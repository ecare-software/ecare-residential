const express = require("express");
const DailyReport = require("../../models/DailyProgressNoteTwo");
const {
  resolveHomeScopedUser,
} = require("../../utils/requireUserSignature");

const router = express.Router();

function isValidSignatureImage(sig) {
  return typeof sig === "string" && sig.startsWith("data:image/") && sig.length > 100;
}

// selectedShifts was only added to the signatureSchema after this
// enforcement was written (see the model's schema comment) - records
// saved before that had signatures/initials/titles genuinely captured
// and persisted, but Mongoose silently stripped selectedShifts on every
// save since the field didn't exist yet. That data isn't recoverable
// (it was never written to the database, not just hidden), but index 0
// has always meant the AM/1st shift and index 1 the PM/2nd shift
// throughout this form's history - there's no other value either index
// could have meant - so a missing selectedShifts on an otherwise-valid
// legacy signature can be safely inferred positionally instead of
// rejecting a legitimately-completed old report outright.
const POSITIONAL_SHIFT_FALLBACK = ["shift1", "shift2", "shift3"];

// Resolves whether index idx has a valid AM/PM signature, and what shift
// it's for - either the value actually recorded, or the positional
// legacy fallback above when a real signature/initials/title exist but
// selectedShifts doesn't. `inferred: true` marks the fallback case so
// callers can self-heal it back into what gets persisted.
function resolveAmPmSignature(signatureSection, idx) {
  const signatures = signatureSection?.signatures;
  const initials = signatureSection?.initials;
  const titles = signatureSection?.titles;
  const selectedShifts = signatureSection?.selectedShifts;

  const hasCore =
    isValidSignatureImage(signatures?.[idx]) && !!initials?.[idx] && !!titles?.[idx];
  if (!hasCore) return { valid: false };

  if (selectedShifts?.[idx]) {
    return { valid: true, shift: selectedShifts[idx], inferred: false };
  }
  return { valid: true, shift: POSITIONAL_SHIFT_FALLBACK[idx], inferred: true };
}

// Mirrors the client's isSignatureValid/areAllSignaturesValid
// (DailyProgressTwo.js) - a valid AM/PM signature needs a real signature
// image, initials, and a title, for both index 0 (AM) and 1 (PM), with
// the shift resolved (including the legacy fallback) above. The client
// already blocks Submit on this, but that only protects the UI - this is
// the server-side backstop for it.
function hasRequiredAmPmSignatures(signatureSection) {
  return [0, 1].every((idx) => resolveAmPmSignature(signatureSection, idx).valid);
}

// Backfills any inferred (legacy) selectedShifts into a signatureSection
// before it's persisted, so a record that gets re-saved converges to
// having the field explicitly populated and no longer needs the
// positional fallback on its next check. Returns the input unchanged if
// there's nothing to heal (including if it's missing/empty entirely -
// this never invents a signature that isn't there).
function healLegacySelectedShifts(signatureSection) {
  if (!signatureSection) return signatureSection;
  const selectedShifts = Array.isArray(signatureSection.selectedShifts)
    ? [...signatureSection.selectedShifts]
    : [];
  let healed = false;
  for (let idx = 0; idx < 3; idx++) {
    if (!selectedShifts[idx]) {
      const resolved = resolveAmPmSignature(signatureSection, idx);
      if (resolved.valid && resolved.inferred) {
        selectedShifts[idx] = resolved.shift;
        healed = true;
      }
    }
  }
  return healed ? { ...signatureSection, selectedShifts } : signatureSection;
}

const MISSING_SIGNATURES_ERROR =
  "Both AM and PM signatures (with initials, title, and shift) are required before this report can be marked COMPLETED.";

// router.use((req, res, next) => {
//   res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//   res.set("Pragma", "no-cache");
//   res.set("Expires", "0");
//   res.set("Surrogate-Control", "no-store");
//   next();
// });


router.post("/", async (req, res) => {
  try {
    // Same verified-authentication + home-match requirement as the other
    // signature-protected form routes (see utils/requireUserSignature.js)
    // - without it, hasRequiredAmPmSignatures below only checks the
    // *shape* of the submitted signatureSection, not who submitted it, so
    // any anonymous caller could supply a fabricated data URL plus
    // truthy initials/title/shift and pass the check outright.
    const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.body.homeId);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    if (
      req.body.status === "COMPLETED" &&
      !hasRequiredAmPmSignatures(req.body.signatureSection)
    ) {
      return res.status(400).json({ error: MISSING_SIGNATURES_ERROR });
    }

    const newReport = new DailyReport({
      createDate: req.body.createDate || new Date(),
      child: req.body.child || {},
      childMeta_name: req.body.childMeta_name || req.body.child?.name || "",
      // Sourced from the authenticated user, not the request body - a
      // record must belong to its creator's own home and be attributed to
      // them, never a home or identity the caller merely names.
      homeId: authUser.homeId,
      formType: req.body.formType || "Daily Progress Note Two",
      createdBy: authUser.email,
      createdByName: `${authUser.firstName} ${authUser.lastName}`,
      status: req.body.status || "IN_PROGRESS",
      // Always server-generated, never taken from the request - this
      // value is used for report ordering and shown as audit data, so a
      // caller-supplied lastEditDate could backdate/postdate a record or
      // skew its position in a sorted list.
      lastEditDate: new Date(),
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
      shiftCount: Number(req.body.shiftCount) === 2 ? 2 : 3,
      // Only set if this brand-new record is being created already
      // COMPLETED - captures the shiftCount at that moment, permanently
      // (see the schema comment on completedShiftCount).
      completedShiftCount:
        req.body.status === "COMPLETED" ? (Number(req.body.shiftCount) === 2 ? 2 : 3) : undefined,
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
    // createDate as a secondary key: lastEditDate has a schema default for
    // new documents but was never backfilled onto older ones, so legacy
    // records missing it would otherwise all tie together and lose their
    // relative order.
    .sort({ lastEditDate: -1, createDate: -1 })
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

      // Same secondary-sort fallback as the unfiltered list above.
      const data = await DailyReport.find(query).sort({ lastEditDate: -1, createDate: -1 });
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
    // Home-scoped auth is required unconditionally here (not just when
    // completing) - the update predicate below must be scoped to the
    // authenticated user's own home, which requires knowing who that is
    // on every edit, and req.params.homeId must actually match it.
    const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
    if (errorResponse) {
      return res.status(errorResponse.status).json(errorResponse.body);
    }

    console.log(`Updating report: homeId=${req.params.homeId}, reportId=${req.params.reportId}`);
    console.log("Update payload:", req.body);

    // The record's status AFTER this update is applied - not just
    // whatever this particular request happens to send. Gating only on
    // `req.body.status === "COMPLETED"` would let a PUT that omits status
    // entirely (leaving an already-COMPLETED report COMPLETED) slip past
    // the signature check while still modifying the report's other
    // fields. Scoped to the authenticated user's own home too, so this
    // can't be used to read another tenant's data for a record this
    // request could never actually update anyway.
    let effectiveStatus = req.body.status;
    let existingDoc = null;
    if (effectiveStatus === undefined || req.body.signatureSection === undefined) {
      existingDoc = await DailyReport.findOne({
        _id: req.params.reportId,
        homeId: authUser.homeId,
      }).select("status signatureSection shiftCount completedShiftCount");
    }
    if (effectiveStatus === undefined) {
      effectiveStatus = existingDoc?.status;
    }

    const updates = { ...req.body, lastEditDate: new Date() };
    // createdBy/createdByName/homeId are set once at creation and must
    // stay immutable - strip them from every edit regardless of what the
    // request body claims, rather than letting an edit silently reassign
    // who the original author was or move the record into another
    // tenant. completedShiftCount (below) is the same kind of field, so
    // it's stripped here too and only ever set explicitly in the
    // COMPLETED branch.
    delete updates.createdBy;
    delete updates.createdByName;
    delete updates.homeId;
    delete updates.completedShiftCount;

    // Self-heal legacy selectedShifts (see the comment on
    // healLegacySelectedShifts above) whenever this save is touching
    // signatureSection at all, so the record converges to having the
    // field explicitly populated rather than relying on the positional
    // fallback forever.
    if (updates.signatureSection) {
      updates.signatureSection = healLegacySelectedShifts(updates.signatureSection);
    }

    if (effectiveStatus === "COMPLETED") {
      // The two triggers above may not have fetched existingDoc (e.g.
      // status and signatureSection were both sent explicitly) but this
      // branch still needs the persisted shiftCount/completedShiftCount.
      if (!existingDoc) {
        existingDoc = await DailyReport.findOne({
          _id: req.params.reportId,
          homeId: authUser.homeId,
        }).select("status signatureSection shiftCount completedShiftCount");
      }

      // The client always sends signatureSection alongside status, but
      // fall back to what's already persisted in case a caller updates
      // status without resending it.
      const signatureSection =
        req.body.signatureSection !== undefined
          ? req.body.signatureSection
          : existingDoc?.signatureSection;

      if (!hasRequiredAmPmSignatures(signatureSection)) {
        return res.status(400).json({ error: MISSING_SIGNATURES_ERROR });
      }

      // completedShiftCount is set once, the first time a report becomes
      // COMPLETED, and never changed again afterward - unlike shiftCount,
      // which stays live/editable (e.g. adding a 3rd shift to an
      // already-completed 2-shift report; see DailyProgressTwo.js's
      // isNewlyRevealedShift, which depends on this staying put). If it's
      // already persisted, keep that historical value; otherwise this is
      // the first completion, so capture the shiftCount as of right now.
      if (existingDoc?.completedShiftCount != null) {
        updates.completedShiftCount = existingDoc.completedShiftCount;
      } else {
        const currentShiftCount =
          req.body.shiftCount !== undefined ? Number(req.body.shiftCount) : existingDoc?.shiftCount;
        updates.completedShiftCount = currentShiftCount === 2 ? 2 : 3;
      }
    }

    const updatedReport = await DailyReport.findOneAndUpdate(
      // Scoped to the authenticated user's own home, not the URL's
      // :homeId (just a caller-supplied claim) - a record belonging to a
      // different home can never be matched, let alone edited.
      { _id: req.params.reportId, homeId: authUser.homeId },
      updates,
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


router.delete("/:homeId/:formId/", (req, res) => {
  DailyReport.deleteOne({ _id: req.params.formId })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;