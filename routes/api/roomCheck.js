const express = require("express");
const router = express.Router();

const RoomCheck = require("../../models/RoomCheck");
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

// Mirrors routes/api/clothingInventory.js - same auth, home scoping, field
// whitelist, and admin-only approval/delete; only the form fields differ.

const FORM_TYPE = "Room Check";
const STATUSES = ["IN PROGRESS", "COMPLETED"];

const NOT_ADMIN_APPROVAL_ERROR =
  "Only an administrator can approve or unapprove a Room Check.";
const APPROVED_LOCKED_ERROR =
  "This Room Check has been approved and can only be edited by an administrator.";

// Every field a client may write on create/edit. Anything else in the
// body (createdBy, homeId, approvedBy*, ...) is ignored rather than
// stripped key-by-key, so a field added to the model later can't become
// silently client-writable.
const EDITABLE_FIELDS = [
  "childMeta_name",
  "clientId",
  "roomUnit",
  "checkDateTime",
  "checkedBy",
  "findings",
  "followUpNeeded",
  "childSignature",
];

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
    if (field === "followUpNeeded") picked[field] = body[field] === true;
    else if (field === "childSignature") {
      picked[field] = Array.isArray(body[field]) ? body[field] : [];
    } else if (field === "findings") picked[field] = toText(body[field], 5000);
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

    const newRoomCheck = new RoomCheck({
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

    const saved = await newRoomCheck.save();
    res.json(saved);
  } catch (err) {
    console.error("Error creating Room Check:", err);
    res.status(500).json({ error: "Failed to create Room Check" });
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
    const roomChecks = await RoomCheck.find({ homeId: authUser.homeId })
      .sort({ createDate: -1 })
      .setOptions({ allowDiskUse: true })
      .exec();
    res.json(roomChecks);
  } catch (err) {
    res.status(500).json({ error: "Error loading Room Checks" });
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

      const roomChecks = await RoomCheck.find(query)
        .sort({ createDate: -1 })
        .setOptions({ allowDiskUse: true })
        .exec();
      res.json(roomChecks);
    } catch (err) {
      console.error("Error searching Room Checks:", err);
      res.status(500).json({ error: "Error loading Room Checks" });
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

    const existing = await RoomCheck.findOne({
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

    // A submitted Room Check stays submitted - "Finish Later" is only for
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

    const updated = await RoomCheck.findOneAndUpdate(
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
    console.error("Error updating Room Check:", err);
    res.status(500).json({ error: "Failed to update Room Check" });
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
    const data = await RoomCheck.deleteOne({
      _id: req.params.formId,
      homeId: authUser.homeId,
    });
    res.json(data);
  } catch (err) {
    console.error("Error deleting Room Check:", err);
    res.status(500).json({ error: "Failed to delete Room Check" });
  }
});

module.exports = router;
