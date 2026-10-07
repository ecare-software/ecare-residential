const express = require("express");
const router = express.Router();

const CssrsScreening = require("../../models/CssrsScreening");
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
  submittedFields,
  canEditForm,
  lastEditedFields,
  dateTimeLocalError,
} = require("../../utils/formIntegrity");

// "Date/time of assessment" is a datetime-local value ("YYYY-MM-DDTHH:mm");
// completion only checks it's present, so its format is checked here.
const ASSESSMENT_DATETIME_LABEL = "Date/time of assessment";

// Same auth, home scoping, field whitelist, and admin-only approval/delete
// as routes/api/clothingInventory.js. On top of that, every save runs the
// whole record through normalizeScreening (applies the C-SSRS skip logic
// and recomputes the derived fields), and a COMPLETED record must pass
// validateCompletion (every item the instrument requires is answered).

const FORM_TYPE = "C-SSRS Screening";
const STATUSES = ["IN PROGRESS", "COMPLETED"];
const ANSWERS = ["", "yes", "no"];

// Ideation items 1-5, in the instrument's order (least to most severe).
const IDEATION_ITEMS = [
  ["wishToBeDead", "1. Wish to be Dead"],
  ["nonSpecificActiveThoughts", "2. Non-Specific Active Suicidal Thoughts"],
  ["activeWithMethods", "3. Active Suicidal Ideation with Any Methods (Not Plan) without Intent to Act"],
  ["activeWithIntent", "4. Active Suicidal Ideation with Some Intent to Act, without Specific Plan"],
  ["activeWithPlanAndIntent", "5. Active Suicidal Ideation with Specific Plan and Intent"],
];

// Behavior items with a "Total #" box, then the plain Yes/No ones.
const COUNTED_BEHAVIOR_ITEMS = [
  ["actualAttempt", "Actual Attempt"],
  ["interruptedAttempt", "Interrupted Attempt"],
  ["abortedAttempt", "Aborted or Self-Interrupted Attempt"],
  ["preparatoryActs", "Preparatory Acts or Behavior"],
];
const YES_NO_BEHAVIOR_ITEMS = [
  ["nonSuicidalSelfInjury", "Non-Suicidal Self-Injurious Behavior"],
  ["selfInjuryIntentUnknown", "Self-Injurious Behavior, intent unknown"],
  ["suicide", "Suicide"],
];

const CLIENT_REQUIRED_ERROR = "Please select a client from this home.";
const NOT_COMPLETED_APPROVAL_ERROR =
  "This C-SSRS Screening is still a draft. It can only be approved after it has been submitted.";
const NOT_ADMIN_APPROVAL_ERROR =
  "Only an administrator can approve or unapprove a C-SSRS Screening.";
const SUBMITTED_LOCKED_ERROR =
  "This C-SSRS Screening has been submitted and can only be edited by the staff member who submitted it or an administrator.";
const APPROVED_LOCKED_ERROR =
  "This C-SSRS Screening has been approved and can only be edited by an administrator.";

// Every field a client may write. Derived fields (mostSevereIdeationType,
// riskFlags) and identity/approval fields are never taken from the body.
// clientId and childMeta_name are deliberately absent: the client is
// resolved within the user's own home and the name taken from that Client
// record (see resolveHomeClient below), never from the request.
const EDITABLE_FIELDS = [
  "assessmentDateTime",
  "administeredBy",
  "ideation",
  "mostSevereIdeationDescription",
  "ideationFrequency",
  "ideationFrequencyResponse",
  "behavior",
  "mostLethalAttemptDate",
  "actualLethality",
  "potentialLethality",
  "actionsTaken",
];

function toText(value, maxLength = 200) {
  return value === undefined || value === null ? "" : String(value).slice(0, maxLength);
}

function toAnswer(value) {
  return ANSWERS.includes(value) ? value : "";
}

// An integer code in [0, max], or null (unanswered).
function toCode(value, max) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= max ? n : null;
}

function toCount(value) {
  return toCode(value, 999);
}

const isYes = (item) => item && item.answer === "yes";

function sanitizeIdeation(ideation) {
  const clean = {};
  IDEATION_ITEMS.forEach(([key]) => {
    const item = ideation && ideation[key];
    clean[key] = { answer: toAnswer(item?.answer), describe: toText(item?.describe, 2000) };
  });
  return clean;
}

function sanitizeBehavior(behavior) {
  const clean = {};
  COUNTED_BEHAVIOR_ITEMS.forEach(([key]) => {
    const item = behavior && behavior[key];
    clean[key] = {
      answer: toAnswer(item?.answer),
      count: toCount(item?.count),
      describe: toText(item?.describe, 2000),
    };
  });
  YES_NO_BEHAVIOR_ITEMS.forEach(([key]) => {
    const item = behavior && behavior[key];
    clean[key] = { answer: toAnswer(item?.answer), describe: "" };
  });
  return clean;
}

// Copies only EDITABLE_FIELDS present in `body` - an edit that omits a
// field (e.g. an approval-only PUT from the report view) leaves it as-is.
function pickEditableFields(body) {
  const picked = {};
  EDITABLE_FIELDS.forEach((field) => {
    if (body[field] === undefined) return;
    if (field === "ideation") picked[field] = sanitizeIdeation(body[field]);
    else if (field === "behavior") picked[field] = sanitizeBehavior(body[field]);
    else if (field === "ideationFrequency") picked[field] = toCode(body[field], 4);
    else if (field === "actualLethality") picked[field] = toCode(body[field], 5);
    else if (field === "potentialLethality") picked[field] = toCode(body[field], 2);
    else if (field === "mostLethalAttemptDate") picked[field] = toText(body[field], 10);
    else if (
      field === "mostSevereIdeationDescription" ||
      field === "ideationFrequencyResponse" ||
      field === "actionsTaken"
    ) {
      picked[field] = toText(body[field], 5000);
    } else picked[field] = toText(body[field]);
  });
  return picked;
}

// Applies the instrument's skip logic to a full record's screening fields
// and recomputes the derived ones, returning every screening field:
// - Items 3-5 are only asked if item 2 is "yes".
// - Intensity of Ideation is only completed if item 1 and/or 2 is "yes".
// - A behavior item's Total # and description only apply when it's "yes".
// - Lethality only applies when an actual attempt is reported, and
//   Potential Lethality only when Actual Lethality is 0.
// Answers to questions that weren't supposed to be asked are cleared
// rather than kept, so a record never holds a contradictory answer (e.g.
// a "yes" to item 5 alongside a "no" to item 2).
function normalizeScreening(record) {
  const ideation = sanitizeIdeation(record.ideation);
  IDEATION_ITEMS.forEach(([key]) => {
    if (!isYes(ideation[key])) ideation[key].describe = "";
  });
  if (!isYes(ideation.nonSpecificActiveThoughts)) {
    ["activeWithMethods", "activeWithIntent", "activeWithPlanAndIntent"].forEach((key) => {
      ideation[key] = { answer: "", describe: "" };
    });
  }

  let mostSevereIdeationType = 0;
  IDEATION_ITEMS.forEach(([key], index) => {
    if (isYes(ideation[key])) mostSevereIdeationType = index + 1;
  });
  const ideationPresent =
    isYes(ideation.wishToBeDead) || isYes(ideation.nonSpecificActiveThoughts);

  const behavior = sanitizeBehavior(record.behavior);
  COUNTED_BEHAVIOR_ITEMS.forEach(([key]) => {
    if (!isYes(behavior[key])) {
      behavior[key].count = null;
      behavior[key].describe = "";
    }
  });

  const attempt = isYes(behavior.actualAttempt);
  const actualLethality = attempt ? toCode(record.actualLethality, 5) : null;

  return {
    childMeta_name: toText(record.childMeta_name),
    clientId: toText(record.clientId),
    assessmentDateTime: toText(record.assessmentDateTime),
    administeredBy: toText(record.administeredBy),
    ideation,
    mostSevereIdeationType,
    mostSevereIdeationDescription: ideationPresent
      ? toText(record.mostSevereIdeationDescription, 5000)
      : "",
    ideationFrequency: ideationPresent ? toCode(record.ideationFrequency, 4) : null,
    ideationFrequencyResponse: ideationPresent
      ? toText(record.ideationFrequencyResponse, 5000)
      : "",
    behavior,
    mostLethalAttemptDate: attempt ? toText(record.mostLethalAttemptDate, 10) : "",
    actualLethality,
    potentialLethality: actualLethality === 0 ? toCode(record.potentialLethality, 2) : null,
    actionsTaken: toText(record.actionsTaken, 5000),
    riskFlags: computeRiskFlags(ideation, behavior),
  };
}

// Descriptive summary of what was endorsed - deliberately not a clinical
// risk level; the instrument leaves that determination to the trained
// administrator's judgment.
function computeRiskFlags(ideation, behavior) {
  const ideationPresent =
    isYes(ideation.wishToBeDead) || isYes(ideation.nonSpecificActiveThoughts);
  const intentOrPlan =
    isYes(ideation.activeWithIntent) || isYes(ideation.activeWithPlanAndIntent);
  const suicidalBehavior = COUNTED_BEHAVIOR_ITEMS.some(([key]) => isYes(behavior[key]));
  const selfInjury =
    isYes(behavior.nonSuicidalSelfInjury) || isYes(behavior.selfInjuryIntentUnknown);
  return {
    ideationPresent,
    intentOrPlan,
    suicidalBehavior,
    selfInjury,
    anyPositive:
      ideationPresent || intentOrPlan || suicidalBehavior || selfInjury || isYes(behavior.suicide),
  };
}

// Items the instrument requires that are still unanswered on a normalized
// record (empty when it can be marked COMPLETED).
function validateCompletion(n) {
  const missing = [];
  if (!n.clientId) missing.push("Child's name");
  if (!n.assessmentDateTime) missing.push("Date/time of assessment");
  if (!n.administeredBy.trim()) missing.push("Administered by");

  const answered = (item) => item && (item.answer === "yes" || item.answer === "no");
  const [q1, q2, ...activeItems] = IDEATION_ITEMS;
  [q1, q2].forEach(([key, label]) => {
    if (!answered(n.ideation[key])) missing.push(label);
  });
  if (isYes(n.ideation.nonSpecificActiveThoughts)) {
    activeItems.forEach(([key, label]) => {
      if (!answered(n.ideation[key])) missing.push(label);
    });
  }
  if (n.mostSevereIdeationType > 0 && n.ideationFrequency === null) {
    missing.push("Intensity of Ideation - Frequency");
  }

  COUNTED_BEHAVIOR_ITEMS.forEach(([key, label]) => {
    const item = n.behavior[key];
    if (!answered(item)) missing.push(label);
    else if (isYes(item) && !(item.count >= 1)) missing.push(`${label} - Total #`);
  });
  YES_NO_BEHAVIOR_ITEMS.forEach(([key, label]) => {
    if (!answered(n.behavior[key])) missing.push(label);
  });

  if (isYes(n.behavior.actualAttempt)) {
    if (n.actualLethality === null) missing.push("Actual Lethality/Medical Damage");
    else if (n.actualLethality === 0 && n.potentialLethality === null) {
      missing.push("Potential Lethality");
    }
  }
  return missing;
}

function incompleteError(missing) {
  return {
    error: `This screening can't be submitted until every required item is answered. Missing: ${missing.join("; ")}.`,
    missing,
  };
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

    const client = await resolveHomeClient(authUser, req.body.clientId);
    if (!client) {
      return res.status(400).json({ error: CLIENT_REQUIRED_ERROR });
    }

    const screening = normalizeScreening({ ...pickEditableFields(req.body), ...client });
    // Blank is fine on a draft; anything entered must be a real date/time.
    if (screening.assessmentDateTime) {
      const invalidDateTime = dateTimeLocalError(
        screening.assessmentDateTime,
        ASSESSMENT_DATETIME_LABEL
      );
      if (invalidDateTime) return res.status(400).json({ error: invalidDateTime });
    }
    if (status === "COMPLETED") {
      const missing = validateCompletion(screening);
      if (missing.length) return res.status(400).json(incompleteError(missing));
    }

    const createDate = req.body.createDate ? new Date(req.body.createDate) : new Date();
    if (Number.isNaN(createDate.getTime())) {
      return res.status(400).json({ error: "createDate must be a valid date." });
    }

    const newScreening = new CssrsScreening({
      ...screening,
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

    const saved = await newScreening.save();
    res.json(saved);
  } catch (err) {
    console.error("Error creating C-SSRS Screening:", err);
    res.status(500).json({ error: "Failed to create C-SSRS Screening" });
  }
});

// Login required and scoped to the user's own home - the URL's homeId is
// only checked against it, never trusted.
router.get("/:homeId", async (req, res) => {
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }
  try {
    const screenings = await CssrsScreening.find({ homeId: authUser.homeId })
      .sort({ createDate: -1 })
      .setOptions({ allowDiskUse: true })
      .exec();
    res.json(screenings);
  } catch (err) {
    res.status(500).json({ error: "Error loading C-SSRS Screenings" });
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

      const screenings = await CssrsScreening.find(query)
        .sort({ createDate: -1 })
        .setOptions({ allowDiskUse: true })
        .exec();
      res.json(screenings);
    } catch (err) {
      console.error("Error searching C-SSRS Screenings:", err);
      res.status(500).json({ error: "Error loading C-SSRS Screenings" });
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

    // The full record, not just a few fields: skip logic and the derived
    // fields depend on the whole screening, so a partial edit is merged
    // onto what's stored and normalized as a whole.
    const existing = await CssrsScreening.findOne({
      _id: req.params.formId,
      homeId: authUser.homeId,
    }).lean();
    if (!existing) {
      return res.status(404).json({ error: "Report not found" });
    }

    const isAdmin = isAdminUser(authUser);
    if (existing.approved && !isAdmin) {
      return res.status(403).json({ error: APPROVED_LOCKED_ERROR });
    }
    // A submitted screening carries its signer's signature, so only the signer
    // or an admin may change it afterward (see canEditForm). Drafts stay
    // editable by any staff in the home.
    if (!canEditForm(authUser, existing)) {
      return res.status(403).json({ error: SUBMITTED_LOCKED_ERROR });
    }

    // Moving the record to a different child requires a client of this
    // home, with the name taken from its record. An unchanged clientId is
    // left alone (that client may have been deactivated since).
    let clientChange = {};
    if (req.body.clientId !== undefined && req.body.clientId !== (existing.clientId || "")) {
      const client = await resolveHomeClient(authUser, req.body.clientId);
      if (!client) {
        return res.status(400).json({ error: CLIENT_REQUIRED_ERROR });
      }
      clientChange = client;
    }

    const screening = normalizeScreening({
      ...existing,
      ...pickEditableFields(req.body),
      ...clientChange,
    });
    const updates = { ...screening, ...lastEditedFields(authUser) };

    // A submitted screening stays submitted - "Finish Later" is only for
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
    // Check the date/time whenever this request sets it or submits the
    // screening (not on an approval-only request against an older record).
    const isSubmitting = existing.status !== "COMPLETED" && updates.status === "COMPLETED";
    if (
      screening.assessmentDateTime &&
      (req.body.assessmentDateTime !== undefined || isSubmitting)
    ) {
      const invalidDateTime = dateTimeLocalError(
        screening.assessmentDateTime,
        ASSESSMENT_DATETIME_LABEL
      );
      if (invalidDateTime) return res.status(400).json({ error: invalidDateTime });
    }

    const effectiveStatus = updates.status || existing.status;
    if (effectiveStatus === "COMPLETED") {
      if (!hasValidSignature(authUser)) {
        return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
      }
      const missing = validateCompletion(screening);
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
      updates.createDate = req.body.createDate;
      const createDateError = applyCreateDateEdit(updates, authUser, existing);
      if (createDateError) {
        return res.status(400).json({ error: createDateError });
      }
    }

    const updated = await CssrsScreening.findOneAndUpdate(
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
    console.error("Error updating C-SSRS Screening:", err);
    res.status(500).json({ error: "Failed to update C-SSRS Screening" });
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
    const data = await CssrsScreening.deleteOne({
      _id: req.params.formId,
      homeId: authUser.homeId,
    });
    res.json(data);
  } catch (err) {
    console.error("Error deleting C-SSRS Screening:", err);
    res.status(500).json({ error: "Failed to delete C-SSRS Screening" });
  }
});

module.exports = router;
