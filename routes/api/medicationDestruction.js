const express = require("express");
const router = express.Router();

const MedicationDestruction = require("../../models/MedicationDestruction");
const User = require("../../models/User");
const {
  resolveHomeScopedUser,
  hasValidSignature,
} = require("../../utils/requireUserSignature");
const {
  containsMongoOperatorKey,
  MONGO_OPERATOR_ERROR,
} = require("../../utils/rejectMongoOperators");
const { applyCreateDateEdit } = require("../../utils/applyCreateDateEdit");
const { isAdminUser } = require("../../utils/adminRoles");
const {
  dateOnlyError,
  createDateError,
  resolveHomeClient,
  missingRequiredFields,
  lastEditedFields,
} = require("../../utils/formIntegrity");

// Same auth, home scoping, and field whitelist as routes/api/searchLog.js,
// but with a two-witness workflow instead of a single submit:
//
//   IN PROGRESS       draft - any staff in the home may edit it
//   AWAITING WITNESS  submitted by witness 1 (signed by submitting while
//                     logged in); details are locked. Witness 1 or an admin
//                     may send it back to IN PROGRESS.
//   COMPLETED         witness 2 co-signed from their own login
//                     (POST /:homeId/:formId/cosign); details stay locked
//                     and an admin may now approve it.
//
// Neither witness can sign for the other: each signature is a copy of the
// signing user's own profile signature, taken server-side at signing time.

const FORM_TYPE = "Medication Destruction";
const DRAFT = "IN PROGRESS";
const AWAITING = "AWAITING WITNESS";
const COMPLETED = "COMPLETED";

const DESTRUCTION_METHODS = [
  "Returned to pharmacy / drug take-back",
  "Drug disposal pouch or kit",
  "Mixed with an undesirable substance and placed in trash",
  "Flushed (FDA flush list only)",
  "Other",
];

const REQUIRED_FIELDS = [
  { key: "medicationName", label: "Medication Name" },
  { key: "quantity", label: "Quantity" },
  { key: "destructionMethod", label: "Method of Destruction" },
  { key: "destructionDate", label: "Date of Destruction" },
  { key: "witness2Id", label: "Witness 2" },
];

const MISSING_SIGNATURE_ERROR =
  "You need a signature on file to sign as a witness or approve. Create one under 'Manage Profile'.";
const CLIENT_REQUIRED_ERROR = "Please select a client from this home.";
const LOCKED_ERROR =
  "This Medication Destruction has been submitted for witness signature and can no longer be edited. Witness 1 or an administrator can return it to draft.";
const COMPLETED_LOCKED_ERROR =
  "Both witnesses have signed this Medication Destruction, so it can no longer be edited.";
const NOT_ADMIN_APPROVAL_ERROR =
  "Only an administrator can approve or unapprove a Medication Destruction.";
const NOT_COMPLETED_APPROVAL_ERROR =
  "A Medication Destruction can only be approved after both witnesses have signed.";
const APPROVED_LOCKED_ERROR =
  "This Medication Destruction has been approved and can no longer be changed.";

// Every field a client may write while the form is a draft. Anything else
// in the body (createdBy, homeId, witness signatures, approvedBy*, ...) is
// ignored. childMeta_name and witness2Name are never taken from the body -
// they're looked up from clientId / witness2Id.
const EDITABLE_FIELDS = [
  "clientId",
  "medicationName",
  "quantity",
  "destructionMethod",
  "destructionMethodOther",
  "destructionDate",
  "witness2Id",
];

const MAX_LENGTH = { destructionMethodOther: 500 };

// Copies only EDITABLE_FIELDS present in `body`. Returns { fields } or
// { error } - a non-string value is rejected rather than stored as
// "[object Object]".
function pickEditableFields(body) {
  const fields = {};
  for (const field of EDITABLE_FIELDS) {
    const value = body[field];
    if (value === undefined) continue;
    if (value !== null && typeof value !== "string") {
      return { error: `${field} must be text.` };
    }
    fields[field] = (value || "").slice(0, MAX_LENGTH[field] || 200);
  }
  return { fields };
}

// Validates everything about the form's details that doesn't depend on
// where it is in the workflow. `doc` is the full set of values (existing
// record merged with this request's changes); `submitting` adds the
// required-field checks.
function detailsError(doc, submitting) {
  if (doc.destructionMethod && !DESTRUCTION_METHODS.includes(doc.destructionMethod)) {
    return "Please choose a method of destruction from the list.";
  }
  if (doc.destructionDate) {
    const invalidDate = dateOnlyError(doc.destructionDate, "Date of Destruction");
    if (invalidDate) return invalidDate;
  }
  if (!submitting) return null;

  const missing = missingRequiredFields(doc, REQUIRED_FIELDS);
  if (doc.destructionMethod === "Other" && !String(doc.destructionMethodOther || "").trim()) {
    missing.push("Other Method (describe)");
  }
  if (!doc.clientId) missing.unshift("Client");
  return missing.length
    ? `Please complete the following field(s): ${missing.join(", ")}`
    : null;
}

// Witness 2 must be another active staff member of the same home. Returns
// { witness2Id, witness2Name } or null.
async function resolveWitness(authUser, witnessId) {
  if (!witnessId) return { witness2Id: "", witness2Name: "" };
  if (witnessId === String(authUser._id)) return null;
  try {
    const witness = await User.findOne({
      _id: witnessId,
      homeId: authUser.homeId,
    }).select("firstName lastName isActive");
    if (!witness || witness.isActive === false) return null;
    return {
      witness2Id: String(witness._id),
      witness2Name: `${witness.firstName} ${witness.lastName}`,
    };
  } catch (e) {
    return null; // malformed id
  }
}
const WITNESS_ERROR =
  "Witness 2 must be a different, active staff member of this home.";

// Resolves clientId and witness2Id in `fields` (in place) to their
// server-side names. Returns an error message or null.
async function resolveReferences(authUser, fields, existing = {}) {
  if (fields.clientId !== undefined) {
    if (!fields.clientId) {
      fields.childMeta_name = "";
    } else if (fields.clientId !== existing.clientId) {
      const client = await resolveHomeClient(authUser, fields.clientId);
      if (!client) return CLIENT_REQUIRED_ERROR;
      Object.assign(fields, client);
    }
  }
  if (fields.witness2Id !== undefined && fields.witness2Id !== existing.witness2Id) {
    const witness = await resolveWitness(authUser, fields.witness2Id);
    if (!witness) return WITNESS_ERROR;
    Object.assign(fields, witness);
  }
  return null;
}

// Witness 1 is whoever submits - stamped from their verified login.
function witness1Fields(authUser) {
  return {
    witness1Id: String(authUser._id),
    witness1Name: `${authUser.firstName} ${authUser.lastName}`,
    witness1SignedAt: new Date(),
    witness1Sig: authUser.signature,
  };
}

const CLEARED_WITNESS1 = {
  witness1Id: "",
  witness1Name: "",
  witness1SignedAt: null,
  witness1Sig: [],
};

function approvalFields(approved, authUser) {
  return approved
    ? {
        approved: true,
        approvedBy: authUser.email,
        approvedByName: `${authUser.firstName} ${authUser.lastName}`,
        approvedByDate: new Date(),
        approvedSig: authUser.signature,
      }
    : {
        approved: false,
        approvedBy: "",
        approvedByName: "",
        approvedByDate: null,
        approvedSig: [],
      };
}

const isWitness1 = (authUser, form) =>
  !!form.witness1Id && form.witness1Id === String(authUser._id);

router.post("/", async (req, res) => {
  try {
    const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.body.homeId);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }
    if (containsMongoOperatorKey(req.body)) {
      return res.status(400).json({ error: MONGO_OPERATOR_ERROR });
    }

    // A new record is either a draft or submitted straight to witness 2 -
    // never COMPLETED, which only a co-sign can do.
    const status = req.body.status === AWAITING ? AWAITING : DRAFT;
    if (status === AWAITING && !hasValidSignature(authUser)) {
      return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
    }

    if (req.body.createDate) {
      const invalidCreateDate = createDateError(req.body.createDate);
      if (invalidCreateDate) {
        return res.status(400).json({ error: invalidCreateDate });
      }
    }
    const createDate = req.body.createDate ? new Date(req.body.createDate) : new Date();

    const { fields, error } = pickEditableFields(req.body);
    if (error) return res.status(400).json({ error });
    if (!fields.clientId) {
      return res.status(400).json({ error: CLIENT_REQUIRED_ERROR });
    }
    const referenceError = await resolveReferences(authUser, fields);
    if (referenceError) return res.status(400).json({ error: referenceError });

    const invalidDetails = detailsError(fields, status === AWAITING);
    if (invalidDetails) return res.status(400).json({ error: invalidDetails });

    const saved = await new MedicationDestruction({
      ...fields,
      ...(status === AWAITING ? witness1Fields(authUser) : {}),
      // Identity and tenant come from the verified login, never the body.
      createdBy: authUser.email,
      createdById: String(authUser._id),
      createdByName: `${authUser.firstName} ${authUser.lastName}`,
      homeId: authUser.homeId,
      formType: FORM_TYPE,
      status,
      createDate,
      ...lastEditedFields(authUser),
      approved: false,
    }).save();
    res.json(saved);
  } catch (err) {
    console.error("Error creating Medication Destruction:", err);
    res.status(500).json({ error: "Failed to create Medication Destruction" });
  }
});

// Staff who can be picked as witness 2: active users of the caller's own
// home with a signature on file (they'll need one to co-sign), excluding
// the caller. Returns ids and names only.
router.get("/:homeId/witnesses", async (req, res) => {
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }
  try {
    const users = await User.find({
      homeId: authUser.homeId,
      isActive: { $ne: false },
      _id: { $ne: authUser._id },
      "signature.0": { $exists: true },
    })
      .select("firstName lastName")
      .sort({ firstName: 1, lastName: 1 });
    res.json(users.map((u) => ({ _id: u._id, name: `${u.firstName} ${u.lastName}` })));
  } catch (err) {
    res.status(500).json({ error: "Error loading staff" });
  }
});

// Forms waiting on the caller's co-signature.
router.get("/:homeId/pendingCosign", async (req, res) => {
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }
  try {
    const forms = await MedicationDestruction.find({
      homeId: authUser.homeId,
      status: AWAITING,
      witness2Id: String(authUser._id),
    }).sort({ createDate: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: "Error loading Medication Destructions" });
  }
});

// Unlike the older form routes' list GETs, these require a verified login
// and scope to that user's own home - the URL's homeId is only checked
// against it, never trusted.
router.get("/:homeId", async (req, res) => {
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }
  try {
    const forms = await MedicationDestruction.find({ homeId: authUser.homeId })
      .sort({ createDate: -1 })
      .setOptions({ allowDiskUse: true })
      .exec();
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: "Error loading Medication Destructions" });
  }
});

router.get(
  "/:homeId/:searchString/:submittedAfter/:submittedBefore/:submittedByA/:approved",
  async (req, res) => {
    const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }
    try {
      const { searchString, submittedAfter, submittedBefore, submittedByA, approved } =
        req.params;
      const query = { homeId: authUser.homeId };

      if (searchString !== "none") {
        // Escaped - this is a name search, not a caller-supplied regex.
        const escaped = searchString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.childMeta_name = { $regex: escaped, $options: "i" };
      }
      if (submittedAfter !== "none") {
        const after = new Date(submittedAfter);
        if (!Number.isNaN(after.getTime())) {
          query.createDate = { ...query.createDate, $gte: after };
        }
      }
      if (submittedBefore !== "none") {
        const before = new Date(submittedBefore);
        if (!Number.isNaN(before.getTime())) {
          query.createDate = { ...query.createDate, $lte: before };
        }
      }
      // SearchContainer's "submitted by" options carry user emails.
      if (submittedByA !== "none") {
        query.createdBy = { $in: submittedByA.split(",") };
      }
      if (approved !== "null") {
        query.approved = approved === "true";
      }

      const forms = await MedicationDestruction.find(query)
        .sort({ createDate: -1 })
        .setOptions({ allowDiskUse: true })
        .exec();
      res.json(forms);
    } catch (err) {
      console.error("Error searching Medication Destructions:", err);
      res.status(500).json({ error: "Error loading Medication Destructions" });
    }
  }
);

router.put("/:homeId/:formId/", async (req, res) => {
  try {
    const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }
    if (containsMongoOperatorKey(req.body)) {
      return res.status(400).json({ error: MONGO_OPERATOR_ERROR });
    }

    const existing = await MedicationDestruction.findOne({
      _id: req.params.formId,
      homeId: authUser.homeId,
    });
    if (!existing) {
      return res.status(404).json({ error: "Report not found" });
    }

    const isAdmin = isAdminUser(authUser);
    const updates = { ...lastEditedFields(authUser) };

    // --- Approval (admin only, and only once both witnesses have signed).
    if (req.body.approved !== undefined) {
      if (!isAdmin) {
        return res.status(403).json({ error: NOT_ADMIN_APPROVAL_ERROR });
      }
      const approved = req.body.approved === true;
      if (approved && existing.status !== COMPLETED) {
        return res.status(400).json({ error: NOT_COMPLETED_APPROVAL_ERROR });
      }
      if (approved && !hasValidSignature(authUser)) {
        return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
      }
      Object.assign(updates, approvalFields(approved, authUser));
    } else if (existing.approved) {
      return res.status(403).json({ error: APPROVED_LOCKED_ERROR });
    }

    // --- Creation-date correction (admin only, see applyCreateDateEdit).
    if (req.body.createDate !== undefined) {
      const invalidCreateDate = createDateError(req.body.createDate);
      if (invalidCreateDate) {
        return res.status(400).json({ error: invalidCreateDate });
      }
      updates.createDate = req.body.createDate;
      const createDateEditError = applyCreateDateEdit(updates, authUser, existing);
      if (createDateEditError) {
        return res.status(400).json({ error: createDateEditError });
      }
    }

    const { fields, error } = pickEditableFields(req.body);
    if (error) return res.status(400).json({ error });
    // A Finish Later/Submit resend of unchanged values isn't an edit.
    const changedFields = Object.keys(fields).filter(
      (key) => (existing[key] || "") !== fields[key]
    );
    const requestedStatus = req.body.status;

    if (existing.status === DRAFT) {
      Object.assign(updates, fields);
      const referenceError = await resolveReferences(authUser, updates, existing);
      if (referenceError) return res.status(400).json({ error: referenceError });

      const submitting = requestedStatus === AWAITING;
      const merged = { ...existing.toObject(), ...updates };
      const invalidDetails = detailsError(merged, submitting);
      if (invalidDetails) return res.status(400).json({ error: invalidDetails });
      if (merged.witness2Id && merged.witness2Id === String(authUser._id) && submitting) {
        return res.status(400).json({ error: WITNESS_ERROR });
      }

      if (submitting) {
        if (!hasValidSignature(authUser)) {
          return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
        }
        Object.assign(updates, witness1Fields(authUser), { status: AWAITING });
      }
    } else {
      // Submitted: details are locked for everyone.
      if (changedFields.length) {
        return res.status(403).json({
          error: existing.status === COMPLETED ? COMPLETED_LOCKED_ERROR : LOCKED_ERROR,
        });
      }
      if (requestedStatus === DRAFT && existing.status !== DRAFT) {
        if (existing.status !== AWAITING) {
          return res.status(403).json({ error: COMPLETED_LOCKED_ERROR });
        }
        if (!isWitness1(authUser, existing) && !isAdmin) {
          return res.status(403).json({
            error: "Only witness 1 or an administrator can return this form to draft.",
          });
        }
        Object.assign(updates, CLEARED_WITNESS1, { status: DRAFT });
      }
    }

    const updated = await MedicationDestruction.findOneAndUpdate(
      { _id: req.params.formId, homeId: authUser.homeId },
      { $set: updates },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error updating Medication Destruction:", err);
    res.status(500).json({ error: "Failed to update Medication Destruction" });
  }
});

// Witness 2 co-signs from their own login. The signature is a copy of
// their own profile signature - nothing in the request body is used.
router.post("/:homeId/:formId/cosign", async (req, res) => {
  try {
    const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }
    if (!hasValidSignature(authUser)) {
      return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
    }

    // Conditional on still AWAITING and still naming this user, so two
    // simultaneous co-signs (or one racing a return-to-draft) can't both
    // succeed.
    const updated = await MedicationDestruction.findOneAndUpdate(
      {
        _id: req.params.formId,
        homeId: authUser.homeId,
        status: AWAITING,
        witness2Id: String(authUser._id),
      },
      {
        $set: {
          status: COMPLETED,
          witness2Name: `${authUser.firstName} ${authUser.lastName}`,
          witness2SignedAt: new Date(),
          witness2Sig: authUser.signature,
          ...lastEditedFields(authUser),
        },
      },
      { new: true }
    );
    if (!updated) {
      return res.status(403).json({
        error: "This form isn't waiting on your signature as witness 2.",
      });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error co-signing Medication Destruction:", err);
    res.status(500).json({ error: "Failed to co-sign Medication Destruction" });
  }
});

// Admin-only and home-scoped, matching the report view, which only shows
// Delete to admins (ShowFormContainer's showDelete={isAdminRole}).
router.delete("/:homeId/:formId/", async (req, res) => {
  try {
    const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }
    if (!isAdminUser(authUser)) {
      return res.status(403).json({ error: "Only an administrator can delete a form." });
    }
    const data = await MedicationDestruction.deleteOne({
      _id: req.params.formId,
      homeId: authUser.homeId,
    });
    if (!data.deletedCount) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.json(data);
  } catch (err) {
    console.error("Error deleting Medication Destruction:", err);
    res.status(500).json({ error: "Failed to delete Medication Destruction" });
  }
});

module.exports = router;
module.exports.DESTRUCTION_METHODS = DESTRUCTION_METHODS;
