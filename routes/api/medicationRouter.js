const express = require("express");
const MedicationLog = require("../../models/Medication");
const {
  resolveHomeScopedUser,
} = require("../../utils/requireUserSignature");
const {
  containsMongoOperatorKey,
  MONGO_OPERATOR_ERROR,
} = require("../../utils/rejectMongoOperators");

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

const MISSING_SIGNATURES_ERROR =
  "Both caregiver signatures are required before a Medication Log can be marked COMPLETED.";

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

    const newLog = new MedicationLog({
      createDate: body.createDate || new Date(),
      // Sourced from the authenticated user, not the request body - a
      // record must belong to its creator's own home and be attributed to
      // them, never a home or identity the caller merely names.
      homeId: authUser.homeId,

      child: {
        childId: body.child?.childId || body.childId || "",
        name: body.child?.name || body.childName || "",
      },
      childMeta_name: body.childMeta_name || body.child?.name || "",

      unit: body.unit || "",
      monthYear: body.monthYear || "",

      allergiesOrContraindications: body.allergiesOrContraindications || "",
      childRefusal: body.childRefusal || "",
      prescriberName: body.prescriberName || "",
      prescriberPhone: body.prescriberPhone || "",
      pharmacyName: body.pharmacyName || "",
      pharmacyPhone: body.pharmacyPhone || "",

      medications: Array.isArray(body.medications)
        ? body.medications.map((m) => ({
            medicationId: m.medicationId || String(Date.now()) + Math.random(),
            id: m.id,                           // preserve frontend ID
            name: m.name || "",
            dosage: m.dosage || "",
            strength: m.strength || "",
            frequency: m.frequency || "",
            otherFrequency: m.otherFrequency || "",
            reasonPrescribed: m.reasonPrescribed || "",
            prnReasonDetails: m.prnReasonDetails || "",
            logTable: {
              days: Array.isArray(m.logTable?.days) ? m.logTable.days : []
            }
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
      approved: body.approved || false,
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

router.get("/:homeId", async (req, res) => {
  try {
    const medicationLogs = await MedicationLog.find({ homeId: req.params.homeId })
      .sort({ createDate: -1 });

    const flattened = medicationLogs.map((log) => ({
      ...log,
      childName: log.child?.name || "",
      childId: log.child?.childId || "",
    }));

    res.json(flattened);
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

router.get(
  "/:homeId/:searchString/:submittedAfter/:submittedBefore/:submittedByA/:approved",
  async (req, res) => {
    try {
      const {
        homeId,
        searchString,
        submittedAfter,
        submittedBefore,
        submittedByA,
        approved,
      } = req.params;

      let query = { homeId };

      if (searchString && searchString !== "none") {
        query.childMeta_name = { $regex: searchString, $options: "i" };
      }

      if (submittedAfter && submittedAfter !== "none") {
        query.createDate = { ...query.createDate, $gte: new Date(submittedAfter) };
      }

      if (submittedBefore && submittedBefore !== "none") {
        query.createDate = { ...query.createDate, $lte: new Date(submittedBefore) };
      }

      if (submittedByA && submittedByA !== "none") {
        query.createdByName = { $in: submittedByA.split(",") };
      }

      if (approved && approved !== "null") {
        query.approved = approved === "true";
      }

      const medicationLogs = await MedicationLog.find({ homeId: req.params.homeId })
        .sort({ createDate: -1 });

        for (const log of medicationLogs) {
          let changed = false;

          log.medications.forEach(med => {
            if (med.logTable?.entries && !med.logTable.days) {
              migrateOldLogTable(med);
              changed = true;
            }
          });

          if (changed) await log.save();
        }

      const flattened = medicationLogs.map(log => ({
        ...log.toObject(),
        childName: log.child?.name || "",
        childId: log.child?.childId || "",
      }));

      res.json(flattened);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching Medication Log" });
    }
  }
);

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Same verified-authentication + home-match requirement as the POST
    // handler above (see utils/requireUserSignature.js) - without it, an
    // unauthenticated caller could edit (and mark COMPLETED) any home's
    // Medication Log by id alone.
    const { authUser, errorResponse } = await resolveHomeScopedUser(req, updates.homeId);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    // A $-prefixed top-level key in the body is a MongoDB update operator,
    // not a field name - see utils/rejectMongoOperators.js. This route
    // already wraps its update in an explicit { $set: updates } below,
    // which happens to make a nested $set key throw (MongoDB rejects a
    // literal "$set" field inside another $set, verified against this
    // repo's actual Mongoose/MongoDB behavior) rather than silently apply
    // it - but that's an accident of this route's shape, not a guarantee,
    // and it'd otherwise surface as an unhelpful 500. Rejecting it
    // outright up front is the same explicit guard the other form routes
    // use, and turns that into a clean 400 instead.
    if (containsMongoOperatorKey(req.body)) {
      return res.status(400).json({ error: MONGO_OPERATOR_ERROR });
    }

    updates.lastEditDate = new Date();
    // homeId/createdBy/createdByName/createDate are set once at creation
    // and must stay immutable - strip them from every edit regardless of
    // what the request body claims, rather than letting an edit silently
    // reassign who the original author was, move the record into another
    // tenant, or backdate/postdate the creation audit trail.
    delete updates.homeId;
    delete updates.createdBy;
    delete updates.createdByName;
    delete updates.createDate;

    if (updates.medications) {
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
        logTable: {
          days: Array.isArray(m.logTable?.days) ? m.logTable.days : []
        }
      }));
    }

    // The record's status AFTER this update is applied - not just whatever
    // this particular request happens to send. Gating only on
    // `updates.status === "COMPLETED"` would let a PUT that omits status
    // entirely (leaving an already-COMPLETED record COMPLETED) slip
    // through with an empty or malformed caregivers value, since the
    // check would never even run.
    const needsExistingDoc = updates.status === undefined || updates.caregivers === undefined;
    const existingDoc = needsExistingDoc
      ? await MedicationLog.findOne({ _id: id, homeId: authUser.homeId }).select("status caregivers")
      : null;

    const effectiveStatus = updates.status !== undefined ? updates.status : existingDoc?.status;

    if (effectiveStatus === "COMPLETED") {
      // Fall back to the persisted caregivers only when the field is
      // completely absent from the request - if the caller explicitly
      // sent caregivers (even null, a string, or some other malformed
      // value), validate exactly what they sent, since that's also what
      // $set below will persist. Falling back to the old (valid) document
      // here while still writing the caller's malformed value would let a
      // COMPLETED record end up with its signatures cleared or replaced.
      const caregiversToCheck =
        updates.caregivers !== undefined ? updates.caregivers : existingDoc?.caregivers;

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

    const flattened = {
      ...updatedLog.toObject(),
      childName: updatedLog.child?.name || "",
      childId: updatedLog.child?.childId || "",
    };

    res.json(flattened);
  } catch (err) {
    console.error("Error updating medication log:", err);
    res.status(500).json({ error: "Failed to update Medication Log" });
  }
});

router.delete("/:homeId/:formId/", (req, res) => {
  MedicationLog.deleteOne({ _id: req.params.formId })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;