const express = require("express");
const MedicationLog = require("../../models/Medication");

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

    const newLog = new MedicationLog({
      createDate: body.createDate || new Date(),
      homeId: body.homeId || null,

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
      createdBy: body.createdBy || "unknown",
      createdByName: body.createdByName || "",
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

    updates.lastEditDate = new Date();

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

    if (updates.status === "COMPLETED") {
      // Normally the client always sends caregivers alongside status, but
      // fall back to what's already on the document in case a caller
      // updates status without resending caregivers.
      const caregiversToCheck = Array.isArray(updates.caregivers)
        ? updates.caregivers
        : (await MedicationLog.findById(id).select("caregivers"))?.caregivers;

      if (!hasRequiredCaregiverSignatures(caregiversToCheck)) {
        return res.status(400).json({ error: MISSING_SIGNATURES_ERROR });
      }
    }

    const updatedLog = await MedicationLog.findByIdAndUpdate(
      id,
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