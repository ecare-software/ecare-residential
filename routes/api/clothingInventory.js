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

const FORM_TYPE = "Monthly Clothing Inventory";
const STATUSES = ["IN PROGRESS", "COMPLETED"];
const CLOTHING_CATEGORIES = ["main", "seasonal", "other"];
const HYGIENE_STATUSES = ["", "have", "almostOut", "need"];
// Generous upper bounds - the form ships ~20 clothing rows and ~8 hygiene
// rows - just so a single request can't grow a record without limit.
const MAX_ROWS = 60;
const MAX_CLIENT_SIGNATURES = 2;
const MAX_COUNT = 9999;

const NOT_ADMIN_APPROVAL_ERROR =
  "Only an administrator can approve or unapprove a Clothing Inventory.";
const APPROVED_LOCKED_ERROR =
  "This Clothing Inventory has been approved and can only be edited by an administrator.";

// Every field a client may write on create/edit. Anything else in the
// body (createdBy, homeId, approvedBy*, total, ...) is ignored rather than
// stripped key-by-key, so a field added to the model later can't become
// silently client-writable.
const EDITABLE_FIELDS = [
  "childMeta_name",
  "clientId",
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

    const createDate = req.body.createDate ? new Date(req.body.createDate) : new Date();
    if (Number.isNaN(createDate.getTime())) {
      return res.status(400).json({ error: "createDate must be a valid date." });
    }

    const newInventory = new ClothingInventory({
      ...pickEditableFields(req.body),
      // Identity and tenant come from the verified login, never the body.
      createdBy: authUser.email,
      createdById: String(authUser._id),
      createdByName: `${authUser.firstName} ${authUser.lastName}`,
      homeId: authUser.homeId,
      formType: FORM_TYPE,
      status,
      createDate,
      lastEditDate: new Date(),
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
        query.createdBy = { $in: submittedByA.split(",") };
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
    }).select("status approved createDate originalCreateDate");
    if (!existing) {
      return res.status(404).json({ error: "Report not found" });
    }

    const isAdmin = isAdminUser(authUser);
    if (existing.approved && !isAdmin) {
      return res.status(403).json({ error: APPROVED_LOCKED_ERROR });
    }

    const updates = { ...pickEditableFields(req.body), lastEditDate: new Date() };

    // A submitted inventory stays submitted - "Finish Later" is only for
    // drafts, so COMPLETED never reverts to IN PROGRESS.
    if (existing.status === "COMPLETED") {
      updates.status = "COMPLETED";
    } else if (STATUSES.includes(req.body.status)) {
      updates.status = req.body.status;
    }
    const effectiveStatus = updates.status || existing.status;
    if (effectiveStatus === "COMPLETED" && !hasValidSignature(authUser)) {
      return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
    }

    if (req.body.approved !== undefined) {
      if (!isAdmin) {
        return res.status(403).json({ error: NOT_ADMIN_APPROVAL_ERROR });
      }
      const approved = req.body.approved === true;
      if (approved && !hasValidSignature(authUser)) {
        return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
      }
      Object.assign(updates, approvalFields(approved, authUser));
    }

    if (req.body.createDate !== undefined) {
      updates.createDate = req.body.createDate;
      const createDateError = applyCreateDateEdit(updates, authUser, existing);
      if (createDateError) {
        return res.status(400).json({ error: createDateError });
      }
    }

    const updated = await ClothingInventory.findOneAndUpdate(
      { _id: req.params.formId, homeId: authUser.homeId },
      { $set: updates },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Report not found" });
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
