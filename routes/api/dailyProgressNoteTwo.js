const express = require("express");
const DailyReport = require("../../models/DailyProgressNoteTwo");

const router = express.Router();

// router.use((req, res, next) => {
//   res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//   res.set("Pragma", "no-cache");
//   res.set("Expires", "0");
//   res.set("Surrogate-Control", "no-store");
//   next();
// });

router.post("/", async (req, res) => {
  try {
    const newReport = new DailyReport({
      createDate: req.body.createDate || new Date(),
      child: req.body.child || {},
      childMeta_name: req.body.childMeta_name || req.body.child?.name || "",
      homeId: req.body.homeId || null,
      formType: req.body.formType || "Daily Progress Note Two",
      createdBy: req.body.createdBy || "unknown",
      createdByName: req.body.createdByName || "",
      status: req.body.status || "IN_PROGRESS",
      lastEditDate: req.body.lastEditDate || new Date(),
      approved: req.body.approved || false,

      // Other sections
      staffInitials: req.body.staffInitials || {},
      levelOfPrecaution: req.body.levelOfPrecaution || {},
      hygieneCompleted: req.body.hygieneCompleted || {},
      dailyChoresCompleted: req.body.dailyChoresCompleted || {},
      medicationCompliance: req.body.medicationCompliance || {},
      dailyIntake: req.body.dailyIntake || {},
      staffIntervention: req.body.staffIntervention || {},
      residentBehaviorPerformance: req.body.residentBehaviorPerformance || {},
      recTherapeuticActivity: req.body.recTherapeuticActivity || {},
      timeline: req.body.timeline || [],
      shiftSummary: req.body.shiftSummary || {},
      clothingDescription: req.body.clothingDescription || {},
      signatureSection: req.body.signatureSection || {},
      shiftStatus: req.body.shiftStatus || {
        firstShift: { completed: false, userId: null },
        secondShift: { completed: false, userId: null },
        thirdShift: { completed: false, userId: null },
      },
    });

    const savedReport = await newReport.save();
    res.json(savedReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create Daily Report" });
  }
});

router.get("/latest/:clientId", async (req, res) => {
  const clientId = req.params.clientId;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of day

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  try {
    const report = await DailyReport.findOne({
      "child.childId": clientId,
      createDate: { $gte: today, $lt: tomorrow }
    }).sort({ createDate: -1 });

    if (!report) return res.status(404).send("No report for today yet");
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// GET ALL DAILY PROGRESS NOTE TWO BY HOME ID
router.get("/:homeId", (req, res) => {
  DailyReport.find({ homeId: req.params.homeId })
    .sort({ createDate: -1 })
    .setOptions({ allowDiskUse: true })
    .exec()
    .then((dailyProgressNoteTwo) => res.json(dailyProgressNoteTwo))
    .catch((err) => res.status(404).json({ success: false, error: err.message }));
});

// GET DAILY PROGRESS NOTE TWO WITH FILTERS
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

      // Client name filter
      if (searchString && searchString !== "none") {
        query.childMeta_name = { $regex: searchString, $options: "i" };
      }

      // Submitted date filter
      if (submittedAfter && submittedAfter !== "none") {
        query.createDate = { ...query.createDate, $gte: new Date(submittedAfter) };
      }
      if (submittedBefore && submittedBefore !== "none") {
        query.createDate = { ...query.createDate, $lte: new Date(submittedBefore) };
      }

      // Submitted by filter
      if (submittedByA && submittedByA !== "none") {
        query.createdByName = { $in: submittedByA.split(",") };
      }

      // Approved filter
      if (approved && approved !== "null") {
        query.approved = approved === "true";
      }

      console.log("DailyProgressNoteTwo query:", query);

      const data = await DailyReport.find(query).sort({ createDate: -1 });
      console.log("Fetched DailyProgressNoteTwo data:", data.length, "records");

      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching Daily Progress Note Two" });
    }
  }
);





// GET REPORT BY ID
router.get("/report/:reportId", async (req, res) => {
  try {
    const report = await DailyReport.findById(req.params.reportId).exec();
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(404).json({ success: false, error: err });
  }
});


// UPDATE DAILY REPORT
// PUT route to update a report by homeId and reportId
router.put("/:homeId/:reportId", async (req, res) => {
  try {
    console.log(`Updating report: homeId=${req.params.homeId}, reportId=${req.params.reportId}`);
    console.log("Update payload:", req.body);

    const updatedReport = await DailyReport.findByIdAndUpdate(
      req.params.reportId,
      { ...req.body, lastEditDate: new Date() },
      { new: true }
    );

    if (!updatedReport) {
      console.error("Report not found for update");
      return res.status(404).json({ error: "Report not found" });
    }

    console.log("Report updated successfully:", updatedReport._id);
    res.json(updatedReport);
  } catch (err) {
    console.error("Error updating report:", err);
    res.status(500).json({ error: "Failed to update Daily Report" });
  }
});

// This is a duplicate POST route and should be removed


// DELETE DAILY REPORT
router.delete("/:reportId", async (req, res) => {
  try {
    const deleted = await DailyReport.findByIdAndDelete(req.params.reportId);
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete Daily Report" });
  }
});

module.exports = router;