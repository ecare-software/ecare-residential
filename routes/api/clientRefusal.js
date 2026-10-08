const express = require("express");
const router = express.Router();

const ClientRefusal = require("../../models/ClientRefusal");
const {
  resolveHomeScopedUser,
  hasValidSignature,
  MISSING_SIGNATURE_ERROR,
} = require("../../utils/requireUserSignature");
const {
  containsMongoOperatorKey,
  MONGO_OPERATOR_ERROR,
} = require("../../utils/rejectMongoOperators");
const { applyCreateDateEdit } = require("../../utils/applyCreateDateEdit");
const { isAdminUser } = require("../../utils/adminRoles");
const {
  dateTimeLocalError,
  createDateError,
  resolveHomeClient,
  missingRequiredFields,
  canEditForm,
  lastEditedFields,
  submittedFields,
  unchangedSince,
  CONFLICT_ERROR,
  submittedByFilter,
} = require("../../utils/formIntegrity");

// Mirrors routes/api/roomCheck.js - same auth, home scoping, field
// whitelist, and admin-only approval/delete; only the form fields differ.

const FORM_TYPE = "Client Refusal";
const STATUSES = ["IN PROGRESS", "COMPLETED"];

const NOT_COMPLETED_APPROVAL_ERROR =
  "This Client Refusal is still a draft. It can only be approved after it has been submitted.";
const NOT_ADMIN_APPROVAL_ERROR =
  "Only an administrator can approve or unapprove a Client Refusal.";
const SUBMITTED_LOCKED_ERROR =
  "This Client Refusal has been submitted and can only be edited by the staff member who submitted it or an administrator.";
const CLIENT_REQUIRED_ERROR = "Please select a client from this home.";

// Required before a Client Refusal can be COMPLETED (mirrors REQUIRED_FIELDS in
// client/src/components/Forms/ClientRefusal.js). Drafts may be partial.
const REQUIRED_FIELDS = [
  { key: "refusedItem", label: "What Was Refused" },
  { key: "refusalDateTime", label: "Date/Time of Refusal" },
  { key: "reason", label: "Reason for Refusal" },
  { key: "staffDocumenting", label: "Staff Member Documenting" },
  { key: "followUpAction", label: "Follow-Up Action" },
];
const DATETIME_FIELD = { key: "refusalDateTime", label: "Date/Time of Refusal" };

const APPROVED_LOCKED_ERROR =
  "This Client Refusal has been approved and can only be edited by an administrator.";

// Every field a client may write on create/edit. Anything else in the
// body (createdBy, homeId, approvedBy*, ...) is ignored rather than
// stripped key-by-key, so a field added to the model later can't become
// silently client-writable.
const EDITABLE_FIELDS = [
  "childMeta_name",
  "clientId",
  "refusedItem",
  "refusalDateTime",
  "reason",
  "staffDocumenting",
  "followUpAction",
];

// Free-text fields long enough to need more than toText's default limit.
const LONG_TEXT_FIELDS = ["reason", "followUpAction"];

function toText(value, maxLength = 200) {
  return value === undefined || value === null ? "" : String(value).slice(0, maxLength);
}

// Copies only EDITABLE_FIELDS that are actually present in `body` - an
// edit that omits a field (e.g. an approval-only PUT from the report
// view) leaves it untouched rather than clearing it.
function pickEditableFields(body) {
  const picked = {};
  EDITABLE_FIELDS.forEach((field) => {
    if (body[field] === undefined) return;
    picked[field] = LONG_TEXT_FIELDS.includes(field)
      ? toText(body[field], 5000)
      : toText(body[field]);
  });
  return picked;
}

function approvalFields(approved, authUser) {
  return approved
    ? {
        approved: true,
        approvedBy: authUser.email,
        approvedByName: `${authUser.firstName} ${authUser.lastName}`,
        approvedByDate: new Date(),
        // The approver's own profile signature, looked up server-side -
        // never a signature the request supplies.
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

router.post("/", async (req, res) => {
  try {
    const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.body.homeId);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    const status = STATUSES.includes(req.body.status) ? req.body.status : "IN PROGRESS";
    if (status === "COMPLETED" && !hasValidSignature(authUser)) {
      return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
    }

    if (req.body.createDate) {
      const invalidCreateDate = createDateError(req.body.createDate);
      if (invalidCreateDate) {
        return res.status(400).json({ error: invalidCreateDate });
      }
    }
    const createDate = req.body.createDate ? new Date(req.body.createDate) : new Date();

    const fields = pickEditableFields(req.body);
    // The child must be a real client of this home; their name comes from
    // the Client record, never the request.
    const client = await resolveHomeClient(authUser, req.body.clientId);
    if (!client) {
      return res.status(400).json({ error: CLIENT_REQUIRED_ERROR });
    }
    Object.assign(fields, client);

    // Blank is fine on a draft; anything entered must be a real date/time.
    if (fields[DATETIME_FIELD.key]) {
      const invalidDateTime = dateTimeLocalError(fields[DATETIME_FIELD.key], DATETIME_FIELD.label);
      if (invalidDateTime) {
        return res.status(400).json({ error: invalidDateTime });
      }
    }
    if (status === "COMPLETED") {
      const missing = missingRequiredFields(fields, REQUIRED_FIELDS);
      if (missing.length) {
        return res.status(400).json({
          error: `Please complete the following field(s): ${missing.join(", ")}`,
        });
      }
    }

    const newClientRefusal = new ClientRefusal({
      ...fields,
      // Identity and tenant come from the verified login, never the body.
      createdBy: authUser.email,
      createdById: String(authUser._id),
      createdByName: `${authUser.firstName} ${authUser.lastName}`,
      homeId: authUser.homeId,
      formType: FORM_TYPE,
      status,
      ...(status === "COMPLETED" ? submittedFields(authUser) : {}),
      createDate,
      ...lastEditedFields(authUser),
      approved: false,
    });

    const saved = await newClientRefusal.save();
    res.json(saved);
  } catch (err) {
    console.error("Error creating Client Refusal:", err);
    res.status(500).json({ error: "Failed to create Client Refusal" });
  }
});

// Unlike the older form routes' list GETs, these require a verified login
// and scope to that user's own home - the URL's homeId is only checked
// against it, never trusted. (A child's refusals - of medication, care,
// meals - are as sensitive as anything else on their file.)
router.get("/:homeId", async (req, res) => {
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }
  try {
    const clientRefusals = await ClientRefusal.find({ homeId: authUser.homeId })
      .sort({ createDate: -1 })
      .setOptions({ allowDiskUse: true })
      .exec();
    res.json(clientRefusals);
  } catch (err) {
    res.status(500).json({ error: "Error loading Client Refusals" });
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
        Object.assign(query, submittedByFilter(submittedByA.split(",")));
      }
      if (approved !== "null") {
        query.approved = approved === "true";
      }

      const clientRefusals = await ClientRefusal.find(query)
        .sort({ createDate: -1 })
        .setOptions({ allowDiskUse: true })
        .exec();
      res.json(clientRefusals);
    } catch (err) {
      console.error("Error searching Client Refusals:", err);
      res.status(500).json({ error: "Error loading Client Refusals" });
    }
  }
);

router.put("/:homeId/:formId/", async (req, res) => {
  try {
    const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }
    // See utils/rejectMongoOperators.js. The field whitelist below already
    // drops unknown keys, but reject outright to surface the attempt.
    if (containsMongoOperatorKey(req.body)) {
      return res.status(400).json({ error: MONGO_OPERATOR_ERROR });
    }

    const existing = await ClientRefusal.findOne({
      _id: req.params.formId,
      homeId: authUser.homeId,
    });
    if (!existing) {
      return res.status(404).json({ error: "Report not found" });
    }

    const isAdmin = isAdminUser(authUser);
    if (existing.approved && !isAdmin) {
      return res.status(403).json({ error: APPROVED_LOCKED_ERROR });
    }
    if (!canEditForm(authUser, existing)) {
      return res.status(403).json({ error: SUBMITTED_LOCKED_ERROR });
    }

    const editedFields = pickEditableFields(req.body);
    const updates = { ...editedFields, ...lastEditedFields(authUser) };

    // The child's name is only ever taken from the Client record. A changed
    // clientId must be a client of this home; an unchanged one is left as
    // is (the client may have been deactivated since).
    delete updates.childMeta_name;
    delete updates.clientId;
    if (req.body.clientId !== undefined && req.body.clientId !== existing.clientId) {
      const client = await resolveHomeClient(authUser, req.body.clientId);
      if (!client) {
        return res.status(400).json({ error: CLIENT_REQUIRED_ERROR });
      }
      Object.assign(updates, client);
    }

    // A submitted Client Refusal stays submitted - "Finish Later" is only for
    // drafts, so COMPLETED never reverts to IN PROGRESS.
    if (existing.status === "COMPLETED") {
      updates.status = "COMPLETED";
    } else if (STATUSES.includes(req.body.status)) {
      updates.status = req.body.status;
    }
    // Whoever submits signs: a draft handed off between staff is recorded
    // (and its signature shown) under the person who actually submitted it.
    if (existing.status !== "COMPLETED" && updates.status === "COMPLETED") {
      Object.assign(updates, submittedFields(authUser));
    }
    const effectiveStatus = updates.status || existing.status;
    if (effectiveStatus === "COMPLETED" && !hasValidSignature(authUser)) {
      return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
    }

    const dateTimeValue = updates[DATETIME_FIELD.key];
    if (dateTimeValue) {
      const invalidDateTime = dateTimeLocalError(dateTimeValue, DATETIME_FIELD.label);
      if (invalidDateTime) {
        return res.status(400).json({ error: invalidDateTime });
      }
    }

    // Only when this request actually edits fields or submits - an
    // approval-only PUT on an older record shouldn't be blocked by it.
    const isSubmitting = existing.status !== "COMPLETED" && updates.status === "COMPLETED";
    if (effectiveStatus === "COMPLETED" && (isSubmitting || Object.keys(editedFields).length)) {
      const merged = { ...existing.toObject(), ...updates };
      const missing = missingRequiredFields(merged, REQUIRED_FIELDS);
      if (!merged.clientId) missing.unshift("Client");
      if (missing.length) {
        return res.status(400).json({
          error: `Please complete the following field(s): ${missing.join(", ")}`,
        });
      }
    }

    if (req.body.approved !== undefined) {
      if (!isAdmin) {
        return res.status(403).json({ error: NOT_ADMIN_APPROVAL_ERROR });
      }
      const approved = req.body.approved === true;
      // Only a submitted form can be approved - approving a draft would
      // skip the submit-time checks and lock it incomplete. (Unapproving is
      // always allowed.)
      if (approved && effectiveStatus !== "COMPLETED") {
        return res.status(400).json({ error: NOT_COMPLETED_APPROVAL_ERROR });
      }
      if (approved && !hasValidSignature(authUser)) {
        return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
      }
      Object.assign(updates, approvalFields(approved, authUser));
    }

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

    // Only if it's still in the status/approval state checked above.
    const updated = await ClientRefusal.findOneAndUpdate(
      { _id: req.params.formId, homeId: authUser.homeId, ...unchangedSince(existing) },
      { $set: updates },
      { new: true }
    );
    if (!updated) {
      // It was found above, so it has since been deleted or had its
      // status/approval changed by another request.
      const stillExists = await ClientRefusal.exists({ _id: req.params.formId, homeId: authUser.homeId });
      return stillExists
        ? res.status(409).json({ error: CONFLICT_ERROR })
        : res.status(404).json({ error: "Report not found" });
    }
    res.json(updated);
  } catch (err) {
    // Also catches a malformed :formId (CastError) - see the matching
    // comment in routes/api/bodyCheck.js.
    console.error("Error updating Client Refusal:", err);
    res.status(500).json({ error: "Failed to update Client Refusal" });
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
    const data = await ClientRefusal.deleteOne({
      _id: req.params.formId,
      homeId: authUser.homeId,
    });
    res.json(data);
  } catch (err) {
    console.error("Error deleting Client Refusal:", err);
    res.status(500).json({ error: "Failed to delete Client Refusal" });
  }
});

module.exports = router;
