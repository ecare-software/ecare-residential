const express = require("express");
const MedicationLog = require("../../models/Medication");

const router = express.Router();

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

            name: m.name || "",
            dosage: m.dosage || "",
            strength: m.strength || "",
            frequency: m.frequency || "",
            otherFrequency: m.otherFrequency || "",
            reasonPrescribed: m.reasonPrescribed || "",
            prnReasonDetails: m.prnReasonDetails || "",

            logTable: {
              entries:
                Array.isArray(m.logTable?.entries) ? m.logTable.entries : [],
            },
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
    const medicationLogs = await MedicationLog.find({
      homeId: req.params.homeId,
    })
      .sort({ createDate: -1 })
      .lean();

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

      const logs = await MedicationLog.find(query)
        .sort({ createDate: -1 })
        .lean();

      const flattened = logs.map((log) => ({
        ...log,
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
        name: m.name || "",
        dosage: m.dosage || "",
        strength: m.strength || "",
        frequency: m.frequency || "",
        otherFrequency: m.otherFrequency || "",
        reasonPrescribed: m.reasonPrescribed || "",
        prnReasonDetails: m.prnReasonDetails || "",
        logTable: {
          entries: Array.isArray(m.logTable?.entries) ? m.logTable.entries : [],
        },
      }));
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

module.exports = router;