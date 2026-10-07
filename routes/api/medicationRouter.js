const express = require("express");
const MedicationLog = require("../../models/Medication");
const { MEDICATION_ERROR_TYPES } = require("../../models/Medication");
const IncidentReport = require("../../models/IncidentReport");
const Client = require("../../models/Client");
const {
  resolveHomeScopedUser,
  hasValidSignature,
  MISSING_SIGNATURE_ERROR,
} = require("../../utils/requireUserSignature");
const { isAdminUser } = require("../../utils/adminRoles");
const {
  containsMongoOperatorKey,
  MONGO_OPERATOR_ERROR,
} = require("../../utils/rejectMongoOperators");
const { applyCreateDateEdit } = require("../../utils/applyCreateDateEdit");
const { resolveHomeClient } = require("../../utils/formIntegrity");

const router = express.Router();

// Mirrors the client's isCaregiverSignatureCaptured check (MedicationLog.js)
// - a signature counts as captured if it's a non-empty stroke-data array
// or a real data: URL, not just a non-empty string of any kind.
function isSignaturePresent(sig) {
  if (Array.isArray(sig)) return sig.length > 0;
  if (typeof sig === "string") return sig.startsWith("data:image/") && sig.length > 100;
  return false;
}

// The completion invariant: a Medication Log can only be COMPLETED once
// both caregiver slots (indices 0 and 1) have a captured signature. The
// client already blocks Submit on this (see MedicationLog.js), but that
// only protects the UI - a direct API request must not be able to bypass
// it, so it's enforced here too.
function hasRequiredCaregiverSignatures(caregivers) {
  if (!Array.isArray(caregivers) || caregivers.length < 2) return false;
  return isSignaturePresent(caregivers[0]?.signature) && isSignaturePresent(caregivers[1]?.signature);
}

const CLIENT_REQUIRED_ERROR = "Please select a client from this home.";

// The log's child, resolved within the caller's own home: the id and name
// come from the Client record, never the request. Returns null if there's
// no such client in this home.
async function resolveHomeChild(authUser, childId) {
  const client = await resolveHomeClient(authUser, childId);
  return client ? { childId: client.clientId, name: client.childMeta_name } : null;
}

const NOT_ADMIN_APPROVAL_ERROR = "Only an administrator can approve or unapprove a Medication Log.";
const NOT_COMPLETED_APPROVAL_ERROR =
  "This Medication Log is still in progress. It can only be approved after it has been submitted.";
const APPROVED_LOCKED_ERROR =
  "This Medication Log has been approved and can only be edited by an administrator.";

// Approval fields are always computed server-side from the verified admin
// (approvalFields below) - never taken from the request body.
const APPROVAL_KEYS = ["approved", "approvedBy", "approvedByName", "approvedByDate", "approvedSig"];

function approvalFields(approved, authUser) {
  return approved
    ? {
        approved: true,
        approvedBy: authUser.email,
        approvedByName: `${authUser.firstName} ${authUser.lastName}`,
        approvedByDate: new Date(),
        approvedSig: authUser.signature,
      }
    : { approved: false, approvedBy: "", approvedByName: "", approvedByDate: null, approvedSig: [] };
}

const flatten = (log) => ({
  ...log.toObject(),
  childName: log.child?.name || "",
  childId: log.child?.childId || "",
});

const MISSING_SIGNATURES_ERROR =
  "Both caregiver signatures are required before a Medication Log can be marked COMPLETED.";

// Rebuilds each medication's logTable.days from the request, keeping only
// the dose fields the schema defines and validating the medication-error
// fields on each dose. `child` is the log's { childId, name }; a linked
// incident report must be one of this home's reports about that child.
// Replaces each med.logTable in place; returns { error } (null if valid).
async function sanitizeLogTables(medications, authUser, child) {
  const linkedIds = new Set();

  for (const med of medications) {
    const days = Array.isArray(med.logTable?.days) ? med.logTable.days : [];
    const cleanDays = [];
    for (const day of days) {
      const doses = Array.isArray(day?.doses) ? day.doses : [];
      const cleanDoses = [];
      for (const dose of doses) {
        const clean = {
          time: dose?.time == null ? "" : String(dose.time),
          initials: dose?.initials == null ? "" : String(dose.initials),
          amountRemaining: dose?.amountRemaining == null ? "" : String(dose.amountRemaining),
        };
        if (dose?.errorType) {
          if (!MEDICATION_ERROR_TYPES.includes(dose.errorType)) {
            return { error: "Invalid medication error type." };
          }
          clean.errorType = dose.errorType;
        }
        if (dose?.linkedIncidentReportId) {
          if (!clean.errorType) {
            return {
              error: "An incident report can only be linked to a dose that has a medication error.",
            };
          }
          clean.linkedIncidentReportId = String(dose.linkedIncidentReportId);
          linkedIds.add(clean.linkedIncidentReportId);
        }
        cleanDoses.push(clean);
      }
      cleanDays.push({ day: day?.day, doses: cleanDoses });
    }
    med.logTable = { days: cleanDays };
  }

  if (linkedIds.size) {
    let reports;
    try {
      reports = await IncidentReport.find({
        _id: { $in: [...linkedIds] },
        homeId: authUser.homeId,
      }).select("clientId childMeta_name");
    } catch (e) {
      reports = []; // malformed id
    }
    const sameChild = (report) =>
      (child?.childId && report.clientId === child.childId) ||
      (!report.clientId && child?.name && report.childMeta_name === child.name);
    const valid = new Set(reports.filter(sameChild).map((r) => String(r._id)));
    if ([...linkedIds].some((id) => !valid.has(id))) {
      return {
        error: "A linked incident report must be one of this home's incident reports for this child.",
      };
    }
  }
  return { error: null };
}

function migrateOldLogTable(med) {
  if (med?.logTable?.entries && !med.logTable.days) {
    const map = {};

    for (const entry of med.logTable.entries) {
      if (!map[entry.day]) {
        map[entry.day] = {
          day: entry.day,
          doses: []
        };
      }

      map[entry.day].doses.push({
        time: entry.time || "",
        initials: entry.initials || "",
        amountRemaining: entry.amountRemaining || ""
      });
    }

    med.logTable = { days: Object.values(map) };
    delete med.logTable.entries;
  }
}

router.post("/", async (req, res) => {
  try {
    const body = req.body;

    // Same verified-authentication + home-match requirement as the other
    // form POSTs (see utils/requireUserSignature.js) - without it, this
    // route took homeId/createdBy/createdByName straight from the request
    // body and only checked the *shape* of a COMPLETED submission's
    // caregiver signatures, not who was actually submitting it, so any
    // unauthenticated caller could create a COMPLETED log for any home
    // with fabricated data URLs that pass isSignaturePresent.
    const { authUser, errorResponse } = await resolveHomeScopedUser(req, body.homeId);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    // Used both to validate linked incident reports and as the saved child,
    // so it must be a real client of this home - not whatever id/name the
    // request claims.
    const postChild = await resolveHomeChild(authUser, body.child?.childId || body.childId);
    if (!postChild) {
      return res.status(400).json({ error: CLIENT_REQUIRED_ERROR });
    }
    const postMedications = Array.isArray(body.medications)
      ? body.medications.map((m) => ({ logTable: m.logTable }))
      : [];
    const { error: logTableError } = await sanitizeLogTables(postMedications, authUser, postChild);
    if (logTableError) {
      return res.status(400).json({ error: logTableError });
    }

    const newLog = new MedicationLog({
      createDate: body.createDate || new Date(),
      // Sourced from the authenticated user, not the request body - a
      // record must belong to its creator's own home and be attributed to
      // them, never a home or identity the caller merely names.
      homeId: authUser.homeId,

      child: postChild,
      childMeta_name: postChild.name,

      unit: body.unit || "",
      monthYear: body.monthYear || "",

      allergiesOrContraindications: body.allergiesOrContraindications || "",
      childRefusal: body.childRefusal || "",
      prescriberName: body.prescriberName || "",
      prescriberPhone: body.prescriberPhone || "",
      pharmacyName: body.pharmacyName || "",
      pharmacyPhone: body.pharmacyPhone || "",

      medications: Array.isArray(body.medications)
        ? body.medications.map((m, idx) => ({
            medicationId: m.medicationId || String(Date.now()) + Math.random(),
            id: m.id,                           // preserve frontend ID
            name: m.name || "",
            dosage: m.dosage || "",
            strength: m.strength || "",
            frequency: m.frequency || "",
            otherFrequency: m.otherFrequency || "",
            reasonPrescribed: m.reasonPrescribed || "",
            prnReasonDetails: m.prnReasonDetails || "",
            logTable: postMedications[idx].logTable,
          }))
        : [],

      caregivers: Array.isArray(body.caregivers)
        ? body.caregivers.map((c) => ({
            name: c.name || "",
            signature: c.signature || "",
            date: c.date || new Date(),
            initials: c.initials || "",
            title: c.title || "",
          }))
        : [],

      formType: "Medication Log",
      createdBy: authUser.email,
      createdByName: `${authUser.firstName} ${authUser.lastName}`,
      // A new log is never pre-approved - approval is an admin action on
      // an existing log (PUT below).
      approved: false,
      status: body.status || "IN_PROGRESS",
      lastEditDate: new Date(),
    });

    if (newLog.status === "COMPLETED" && !hasRequiredCaregiverSignatures(newLog.caregivers)) {
      return res.status(400).json({ error: MISSING_SIGNATURES_ERROR });
    }

    const saved = await newLog.save();

    const flattened = {
      ...saved.toObject(),
      childName: saved.child?.name || "",
      childId: saved.child?.childId || "",
    };

    return res.json(flattened);
  } catch (err) {
    console.error("Error creating medication log:", err);
    res.status(500).json({ error: "Failed to create Medication Log" });
  }
});

// Incident reports a dose's medication error can be linked to: this
// home's reports about the given child (matched by clientId, or by name for
// older reports saved without one). Returns just enough to pick one.
router.get("/:homeId/incidentReports/:childId", async (req, res) => {
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }
  try {
    let client = null;
    try {
      client = await Client.findOne({ _id: req.params.childId, homeId: authUser.homeId })
        .select("childMeta_name");
    } catch (e) {
      client = null; // malformed id
    }
    if (!client) return res.json([]);
    const reports = await IncidentReport.find({
      homeId: authUser.homeId,
      $or: [
        { clientId: String(client._id) },
        { clientId: { $in: [null, ""] }, childMeta_name: client.childMeta_name },
      ],
    })
      .select("dateOfIncident time_of_incident nature_of_incident createDate")
      .sort({ createDate: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: "Error loading incident reports" });
  }
});

// Login required and scoped to the caller's own home - the URL's homeId is
// only checked against it, never trusted (same as the other form routes).
router.get("/:homeId", async (req, res) => {
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }
  try {
    const medicationLogs = await MedicationLog.find({ homeId: authUser.homeId })
      .sort({ createDate: -1 });
    res.json(medicationLogs.map(flatten));
  } catch (err) {
    res.status(500).json({ error: "Error loading Medication Logs" });
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

      if (searchString && searchString !== "none") {
        // Escaped - this is a name search, not a caller-supplied regex.
        const escaped = searchString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        query.childMeta_name = { $regex: escaped, $options: "i" };
      }
      if (submittedAfter && submittedAfter !== "none") {
        const after = new Date(submittedAfter);
        if (!Number.isNaN(after.getTime())) {
          query.createDate = { ...query.createDate, $gte: after };
        }
      }
      if (submittedBefore && submittedBefore !== "none") {
        const before = new Date(submittedBefore);
        if (!Number.isNaN(before.getTime())) {
          query.createDate = { ...query.createDate, $lte: before };
        }
      }
      // SearchContainer's "submitted by" options carry user emails.
      if (submittedByA && submittedByA !== "none") {
        query.createdBy = { $in: submittedByA.split(",") };
      }
      if (approved && approved !== "null") {
        query.approved = approved === "true";
      }

      const medicationLogs = await MedicationLog.find(query).sort({ createDate: -1 });

      for (const log of medicationLogs) {
        let changed = false;

        log.medications.forEach((med) => {
          if (med.logTable?.entries && !med.logTable.days) {
            migrateOldLogTable(med);
            changed = true;
          }
        });

        if (changed) await log.save();
      }

      res.json(medicationLogs.map(flatten));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching Medication Log" });
    }
  }
);

// Served at both PUT /:id (the form's own saves, homeId in the body) and
// PUT /:homeId/:id (the report view's approve/unapprove, which - like every
// other form route - puts homeId in the URL and sends only approval fields).
const updateMedicationLog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Same verified-authentication + home-match requirement as the POST
    // handler above (see utils/requireUserSignature.js).
    const { authUser, errorResponse } = await resolveHomeScopedUser(
      req,
      req.params.homeId || updates.homeId
    );
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    // A $-prefixed key is a MongoDB update operator, not a field name - see
    // utils/rejectMongoOperators.js.
    if (containsMongoOperatorKey(req.body)) {
      return res.status(400).json({ error: MONGO_OPERATOR_ERROR });
    }

    let existing = null;
    try {
      existing = await MedicationLog.findOne({ _id: id, homeId: authUser.homeId });
    } catch (e) {
      existing = null; // malformed id
    }
    if (!existing) {
      return res.status(404).json({ error: "Medication log not found" });
    }
    const isAdmin = isAdminUser(authUser);

    // homeId/createdBy/createdByName/createDate are set once at creation
    // and must stay immutable; originalCreateDate/createDateEditedBy/At are
    // computed by applyCreateDateEdit below.
    delete updates.homeId;
    delete updates.createdBy;
    delete updates.createdByName;
    delete updates.formType;
    delete updates.originalCreateDate;
    delete updates.createDateEditedBy;
    delete updates.createDateEditedAt;

    // The child is only ever the canonical Client record of this home. A
    // changed child id must resolve to one; an unchanged one keeps the
    // stored child (that client may have been deactivated since). The
    // request's name is never used.
    delete updates.childMeta_name;
    let child = existing.child;
    if (updates.child !== undefined) {
      const requestedId = updates.child?.childId || "";
      if (requestedId !== (existing.child?.childId || "")) {
        child = await resolveHomeChild(authUser, requestedId);
        if (!child) {
          return res.status(400).json({ error: CLIENT_REQUIRED_ERROR });
        }
        updates.child = child;
        updates.childMeta_name = child.name;
      } else {
        delete updates.child;
      }
    }

    // Approval: only an admin can change it, and the approver fields come
    // from their verified login. A request that merely repeats the current
    // value (older clients send approved: false on every save) is ignored
    // rather than treated as an unapproval.
    const requestedApproval = updates.approved;
    APPROVAL_KEYS.forEach((key) => delete updates[key]);
    const isApprovalChange =
      requestedApproval !== undefined && (requestedApproval === true) !== existing.approved;
    const isEdit = Object.keys(updates).some((key) => key !== "lastEditDate");

    if (existing.approved && !isAdmin && (isEdit || isApprovalChange)) {
      return res.status(403).json({ error: APPROVED_LOCKED_ERROR });
    }
    // The status after this request (a log submitted in the same request
    // counts as COMPLETED, and the completion invariant below still runs).
    const statusAfter = updates.status !== undefined ? updates.status : existing.status;
    // Only a COMPLETED log can be approved - also rejected when the log is
    // already approved, rather than silently unapproving it below.
    // Unapproving is always allowed.
    if (requestedApproval === true && statusAfter !== "COMPLETED") {
      return res.status(400).json({ error: NOT_COMPLETED_APPROVAL_ERROR });
    }
    if (isApprovalChange) {
      if (!isAdmin) {
        return res.status(403).json({ error: NOT_ADMIN_APPROVAL_ERROR });
      }
      if (requestedApproval === true && !hasValidSignature(authUser)) {
        return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
      }
      Object.assign(updates, approvalFields(requestedApproval === true, authUser));
    } else if (existing.approved && statusAfter !== "COMPLETED") {
      // Unlike the other forms, a Medication Log can move back from
      // COMPLETED to IN_PROGRESS (Finish Later). An approved log that does
      // so - only an admin can still edit it - is unapproved, so it's never
      // left approved while in progress.
      Object.assign(updates, approvalFields(false, authUser));
    }
    updates.lastEditDate = new Date();

    if (updates.medications) {
      if (!Array.isArray(updates.medications)) {
        return res.status(400).json({ error: "medications must be a list." });
      }
      // Linked incident reports are checked against the log's (canonical)
      // child, resolved above.
      const { error: logTableError } = await sanitizeLogTables(updates.medications, authUser, child);
      if (logTableError) {
        return res.status(400).json({ error: logTableError });
      }
      updates.medications = updates.medications.map((m) => ({
        medicationId: m.medicationId,
        id: m.id,
        name: m.name || "",
        dosage: m.dosage || "",
        strength: m.strength || "",
        frequency: m.frequency || "",
        otherFrequency: m.otherFrequency || "",
        reasonPrescribed: m.reasonPrescribed || "",
        prnReasonDetails: m.prnReasonDetails || "",
        logTable: m.logTable,
      }));
    }

    if (updates.createDate !== undefined) {
      const createDateError = applyCreateDateEdit(updates, authUser, existing);
      if (createDateError) {
        return res.status(400).json({ error: createDateError });
      }
    }

    // The record's status AFTER this update - an edit that omits status
    // leaves a COMPLETED log COMPLETED, so it must still pass the
    // completion invariant. Fall back to the persisted caregivers only when
    // the request doesn't send any; if it does (even malformed), validate
    // exactly what will be written.
    const effectiveStatus = updates.status !== undefined ? updates.status : existing.status;
    if (effectiveStatus === "COMPLETED") {
      const caregiversToCheck =
        updates.caregivers !== undefined ? updates.caregivers : existing.caregivers;
      if (!hasRequiredCaregiverSignatures(caregiversToCheck)) {
        return res.status(400).json({ error: MISSING_SIGNATURES_ERROR });
      }
    }

    const updatedLog = await MedicationLog.findOneAndUpdate(
      { _id: id, homeId: authUser.homeId },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updatedLog) {
      return res.status(404).json({ error: "Medication log not found" });
    }
    res.json(flatten(updatedLog));
  } catch (err) {
    console.error("Error updating medication log:", err);
    res.status(500).json({ error: "Failed to update Medication Log" });
  }
};

router.put("/:id", updateMedicationLog);
router.put("/:homeId/:id", updateMedicationLog);

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
    let data;
    try {
      data = await MedicationLog.deleteOne({ _id: req.params.formId, homeId: authUser.homeId });
    } catch (e) {
      data = { deletedCount: 0 }; // malformed id
    }
    if (!data.deletedCount) {
      return res.status(404).json({ error: "Medication log not found" });
    }
    res.json(data);
  } catch (err) {
    console.error("Error deleting medication log:", err);
    res.status(500).json({ error: "Failed to delete Medication Log" });
  }
});

module.exports = router;