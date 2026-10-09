const express = require("express");
const router = express.Router();

const ClothingInventory = require("../../models/ClothingInventory");
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
  resolveHomeClient,
  canEditForm,
  lastEditedFields,
  submittedFields,
  unchangedSince,
  CONFLICT_ERROR,
  submittedByFilter,
  createDateError,
} = require("../../utils/formIntegrity");

const FORM_TYPE = "Monthly Clothing Inventory";
const STATUSES = ["IN PROGRESS", "COMPLETED"];
const CLOTHING_CATEGORIES = ["main", "seasonal", "other"];
const HYGIENE_STATUSES = ["", "have", "almostOut", "need"];
// Generous upper bounds - the form ships ~20 clothing rows and ~8 hygiene
// rows - just so a single request can't grow a record without limit.
const MAX_ROWS = 60;
const MAX_CLIENT_SIGNATURES = 2;
const MAX_COUNT = 9999;

const CLIENT_REQUIRED_ERROR = "Please select a client from this home.";
// month input value, "YYYY-MM".
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const INVALID_MONTH_ERROR = "Month Of must be a valid month.";

// What a COMPLETED inventory must have (mirrors validateForm in
// client/src/components/Forms/ClothingInventory.js, which only checks the
// month - the client is enforced by the dropdown). Returns the labels of
// anything missing from `doc`, the full record as it will be saved.
function missingForCompletion(doc) {
  const missing = [];
  if (!doc.clientId) missing.push("Client");
  if (!doc.monthOf) missing.push("Month Of");
  return missing;
}

const incompleteError = (missing) => ({
  error: `Please complete the following field(s): ${missing.join(", ")}`,
});
const NOT_COMPLETED_APPROVAL_ERROR =
  "This Clothing Inventory is still a draft. It can only be approved after it has been submitted.";
const NOT_ADMIN_APPROVAL_ERROR =
  "Only an administrator can approve or unapprove a Clothing Inventory.";
const SUBMITTED_LOCKED_ERROR =
  "This Clothing Inventory has been submitted and can only be edited by the staff member who submitted it or an administrator.";
const APPROVED_LOCKED_ERROR =
  "This Clothing Inventory has been approved and can only be edited by an administrator.";

// Every field a client may write on create/edit. Anything else in the
// body (createdBy, homeId, approvedBy*, total, ...) is ignored rather than
// stripped key-by-key, so a field added to the model later can't become
// silently client-writable. clientId and childMeta_name are deliberately
// absent: the client is resolved within the user's own home and the name
// taken from that Client record (see resolveHomeClient below).
const EDITABLE_FIELDS = [
  "monthOf",
  "inventoryDate",
  "clothingItems",
  "hygieneItems",
  "clientSignatures",
  "notes",
];

function toText(value, maxLength = 200) {
  return value === undefined || value === null ? "" : String(value).slice(0, maxLength);
}

// Blank means "not counted" (null), which is distinct from a counted 0.
function toCount(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= MAX_COUNT ? n : null;
}

// Total Monthly Inventory = starting supply + new + used
//                           - will not fit - lost - destroyed.
// Null (blank) only when nothing on the row was counted at all.
function computeClothingTotal(row) {
  const plus = [row.startCount, row.newCount, row.usedCount];
  const minus = [row.willNotFit, row.lost, row.destroyed];
  if ([...plus, ...minus].every((v) => v === null)) return null;
  const sum = (values) => values.reduce((acc, v) => acc + (v || 0), 0);
  return sum(plus) - sum(minus);
}

function sanitizeClothingItems(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.slice(0, MAX_ROWS).map((row) => {
    const clean = {
      key: toText(row?.key, 60),
      item: toText(row?.item, 100),
      category: CLOTHING_CATEGORIES.includes(row?.category) ? row.category : "other",
      startCount: toCount(row?.startCount),
      newCount: toCount(row?.newCount),
      usedCount: toCount(row?.usedCount),
      willNotFit: toCount(row?.willNotFit),
      lost: toCount(row?.lost),
      destroyed: toCount(row?.destroyed),
    };
    clean.total = computeClothingTotal(clean);
    return clean;
  });
}

function sanitizeHygieneItems(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.slice(0, MAX_ROWS).map((row) => ({
    key: toText(row?.key, 60),
    item: toText(row?.item, 100),
    custom: row?.custom === true,
    status: HYGIENE_STATUSES.includes(row?.status) ? row.status : "",
  }));
}

function sanitizeClientSignatures(sigs) {
  if (!Array.isArray(sigs)) return [];
  return sigs.slice(0, MAX_CLIENT_SIGNATURES).map((entry) => ({
    sig: Array.isArray(entry?.sig) ? entry.sig : [],
    date: toText(entry?.date, 10),
  }));
}

// Copies only EDITABLE_FIELDS that are actually present in `body` - an
// edit that omits a field (e.g. an approval-only PUT from the report
// view) leaves it untouched rather than clearing it.
function pickEditableFields(body) {
  const picked = {};
  EDITABLE_FIELDS.forEach((field) => {
    if (body[field] === undefined) return;
    if (field === "clothingItems") picked[field] = sanitizeClothingItems(body[field]);
    else if (field === "hygieneItems") picked[field] = sanitizeHygieneItems(body[field]);
    else if (field === "clientSignatures") picked[field] = sanitizeClientSignatures(body[field]);
    else if (field === "notes") picked[field] = toText(body[field], 5000);
    else picked[field] = toText(body[field]);
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

    // Same rules as the other forms: a real date, not before 2000, not in
    // the future (utils/formIntegrity.js).
    if (req.body.createDate) {
      const invalidCreateDate = createDateError(req.body.createDate);
      if (invalidCreateDate) {
        return res.status(400).json({ error: invalidCreateDate });
      }
    }
    const createDate = req.body.createDate ? new Date(req.body.createDate) : new Date();

    const client = await resolveHomeClient(authUser, req.body.clientId);
    if (!client) {
      return res.status(400).json({ error: CLIENT_REQUIRED_ERROR });
    }

    const fields = { ...pickEditableFields(req.body), ...client };
    if (fields.monthOf && !MONTH_RE.test(fields.monthOf)) {
      return res.status(400).json({ error: INVALID_MONTH_ERROR });
    }
    if (status === "COMPLETED") {
      const missing = missingForCompletion(fields);
      if (missing.length) return res.status(400).json(incompleteError(missing));
    }

    const newInventory = new ClothingInventory({
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

    const saved = await newInventory.save();
    res.json(saved);
  } catch (err) {
    console.error("Error creating Clothing Inventory:", err);
    res.status(500).json({ error: "Failed to create Clothing Inventory" });
  }
});

// Unlike the older form routes' list GETs, these require a verified login
// and scope to that user's own home - the URL's homeId is only checked
// against it, never trusted. (A child's clothing and hygiene records are
// as sensitive as anything else on their file.)
router.get("/:homeId", async (req, res) => {
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }
  try {
    const inventories = await ClothingInventory.find({ homeId: authUser.homeId })
      .sort({ createDate: -1 })
      .setOptions({ allowDiskUse: true })
      .exec();
    res.json(inventories);
  } catch (err) {
    res.status(500).json({ error: "Error loading Clothing Inventories" });
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

      const inventories = await ClothingInventory.find(query)
        .sort({ createDate: -1 })
        .setOptions({ allowDiskUse: true })
        .exec();
      res.json(inventories);
    } catch (err) {
      console.error("Error searching Clothing Inventories:", err);
      res.status(500).json({ error: "Error loading Clothing Inventories" });
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

    const existing = await ClothingInventory.findOne({
      _id: req.params.formId,
      homeId: authUser.homeId,
    }).select(
      "status approved createDate originalCreateDate clientId monthOf createdBy createdById submittedById lastEditDate"
    );
    if (!existing) {
      return res.status(404).json({ error: "Report not found" });
    }

    const isAdmin = isAdminUser(authUser);
    if (existing.approved && !isAdmin) {
      return res.status(403).json({ error: APPROVED_LOCKED_ERROR });
    }
    // A submitted inventory carries its author's signature, so only the
    // author or an admin may change it afterward (see canEditForm). Drafts
    // stay editable by any staff in the home.
    if (!canEditForm(authUser, existing)) {
      return res.status(403).json({ error: SUBMITTED_LOCKED_ERROR });
    }

    const editedFields = pickEditableFields(req.body);
    if (editedFields.monthOf && !MONTH_RE.test(editedFields.monthOf)) {
      return res.status(400).json({ error: INVALID_MONTH_ERROR });
    }
    const updates = { ...editedFields, ...lastEditedFields(authUser) };

    // Moving the inventory to a different child requires a client of this
    // home, with the name taken from its record. An unchanged clientId is
    // left alone (that client may have been deactivated since).
    if (req.body.clientId !== undefined && req.body.clientId !== (existing.clientId || "")) {
      const client = await resolveHomeClient(authUser, req.body.clientId);
      if (!client) {
        return res.status(400).json({ error: CLIENT_REQUIRED_ERROR });
      }
      Object.assign(updates, client);
    }

    // A submitted inventory stays submitted - "Finish Later" is only for
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
    // Editing or submitting a completed form needs the editor's signature;
    // an approval-only request doesn't (approving checks the signature
    // itself below, and unapproving is always allowed).
    const changesContent =
      Object.keys(editedFields).length > 0 ||
      (existing.status !== "COMPLETED" && updates.status === "COMPLETED");
    if (effectiveStatus === "COMPLETED" && changesContent && !hasValidSignature(authUser)) {
      return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
    }
    // Checked when this request submits the inventory or edits a completed
    // one (so the month can't be blanked out afterward) - not on an
    // approval-only request.
    const isSubmitting = existing.status !== "COMPLETED" && updates.status === "COMPLETED";
    if (effectiveStatus === "COMPLETED" && (isSubmitting || Object.keys(editedFields).length)) {
      const missing = missingForCompletion({
        clientId: updates.clientId || existing.clientId,
        monthOf: updates.monthOf !== undefined ? updates.monthOf : existing.monthOf,
      });
      if (missing.length) return res.status(400).json(incompleteError(missing));
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
    const updated = await ClothingInventory.findOneAndUpdate(
      { _id: req.params.formId, homeId: authUser.homeId, ...unchangedSince(existing) },
      { $set: updates },
      { new: true }
    );
    if (!updated) {
      // It was found above, so it has since been deleted or had its
      // status/approval changed by another request.
      const stillExists = await ClothingInventory.exists({ _id: req.params.formId, homeId: authUser.homeId });
      return stillExists
        ? res.status(409).json({ error: CONFLICT_ERROR })
        : res.status(404).json({ error: "Report not found" });
    }
    res.json(updated);
  } catch (err) {
    // Also catches a malformed :formId (CastError) - see the matching
    // comment in routes/api/bodyCheck.js.
    console.error("Error updating Clothing Inventory:", err);
    res.status(500).json({ error: "Failed to update Clothing Inventory" });
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
    const data = await ClothingInventory.deleteOne({
      _id: req.params.formId,
      homeId: authUser.homeId,
    });
    res.json(data);
  } catch (err) {
    console.error("Error deleting Clothing Inventory:", err);
    res.status(500).json({ error: "Failed to delete Clothing Inventory" });
  }
});

module.exports = router;
