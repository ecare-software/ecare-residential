const express = require("express");
const router = express.Router();
const { resolveHomeScopedUser } = require("../../utils/requireUserSignature");

const AdmissionAssessment = require("../../models/AdmissionAssessment");
const BodyCheck = require("../../models/BodyCheck");
const DailyProgressAndActivity = require("../../models/DailyProgressAndActivity");
const IllnessInjury = require("../../models/IllnessInjury");
const IncidentReport = require("../../models/IncidentReport");
const RestraintReport = require("../../models/RestraintReport");
const SeriousIncidentReport = require("../../models/SeriousIncidentReport");
const TreatmentPlan72 = require("../../models/TreatmentPlan72");
const AwakeNightStaffSignoff = require("../../models/AwakeNightStaffSignoff");
const NightMonitoring = require("../../models/NightMonitoring");
const ClothingInventory = require("../../models/ClothingInventory");
const RoomCheck = require("../../models/RoomCheck");
const SearchLog = require("../../models/SearchLog");
const ClientRefusal = require("../../models/ClientRefusal");
const MedicationDestruction = require("../../models/MedicationDestruction");
const CssrsScreening = require("../../models/CssrsScreening");

const getApprovalFilter = (status) => {
  if (status == "true") {
    return {
      $and: [
        {
          approved: true,
          approved_alt1: true,
        },
      ],
    };
  } else {
    return {
      $or: [
        {
          approved: false,
          approved_alt1: true,
        },
        {
          approved: true,
          approved_alt1: false,
        },
        {
          approved: false,
          approved_alt1: false,
        },
      ],
    };
  }
};
// Both count routes require a verified login and only ever count the
// caller's own home - the URL's homeId is checked against it, never trusted.
// (Even counts of C-SSRS screenings, medication destructions, etc. are
// sensitive.)
router.get("/count/:status/:homeId/:lastEditDateAfter", async (req, res) => {
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }
  if (req.params.lastEditDateAfter !== "none" &&
      Number.isNaN(new Date(req.params.lastEditDateAfter).getTime())) {
    return res.status(400).json({ error: "lastEditDateAfter must be a valid date." });
  }
  const approved =
    (req.params.status && req.params.status == "true") ||
    req.params.status == "false"
      ? req.params.status
      : false;

  const formPromises = [];
  const homeId = authUser.homeId;

  const dateFilter =
    req.params.lastEditDateAfter !== "none"
      ? { lastEditDate: { $gte: new Date(req.params.lastEditDateAfter) } }
      : {};

  try {
    formPromises.push(
      AdmissionAssessment.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading AdmissionAssessment -  ${e}`);
  }

  try {
    formPromises.push(
      AwakeNightStaffSignoff.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading Awake Night Staff Signoff -  ${e}`);
  }

  try {
    formPromises.push(
      NightMonitoring.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading Night Monitoring -  ${e}`);
  }

  try {
    formPromises.push(
      BodyCheck.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading BodyCheck -  ${e}`);
  }

  try {
    formPromises.push(
      DailyProgressAndActivity.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading DailyProgressAndActivity -  ${e}`);
  }

  try {
    formPromises.push(
      IllnessInjury.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading IllnessInjury -  ${e}`);
  }

  try {
    formPromises.push(
      IncidentReport.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading IncidentReport -  ${e}`);
  }

  try {
    formPromises.push(
      RestraintReport.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading RestraintReport -  ${e}`);
  }

  try {
    formPromises.push(
      SeriousIncidentReport.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading SeriousIncidentReport -  ${e}`);
  }

  try {
    formPromises.push(
      TreatmentPlan72.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading TreatmentPlan72 -  ${e}`);
  }

  try {
    formPromises.push(
      ClothingInventory.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading ClothingInventory -  ${e}`);
  }

  try {
    formPromises.push(
      RoomCheck.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading RoomCheck -  ${e}`);
  }

  try {
    formPromises.push(
      SearchLog.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading SearchLog -  ${e}`);
  }

  try {
    formPromises.push(
      ClientRefusal.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading ClientRefusal -  ${e}`);
  }

  try {
    formPromises.push(
      MedicationDestruction.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading MedicationDestruction -  ${e}`);
  }

  try {
    formPromises.push(
      CssrsScreening.countDocuments({
        homeId: authUser.homeId,
        approved,
        ...dateFilter,
      })
    );
  } catch (e) {
    console.log(`Error loading CssrsScreening -  ${e}`);
  }

  let completedPromisses;
  try {
    completedPromisses = await Promise.all(formPromises);
  } catch (e) {
    console.log(`Error counting forms - ${e}`);
    return res.status(500).json({ error: "Error counting forms" });
  }

  // Each entry is already a number (countDocuments) - the matching records
  // themselves are never loaded just to be counted.
  const count = completedPromisses.reduce((acc, formTypeCount) => acc + formTypeCount, 0);
  res.json({
    approved,
    count,
    homeId,
  });
});

router.get("/count/:homeId", async (req, res) => {
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }
  const formPromises = [];
  const homeId = authUser.homeId;

  try {
    formPromises.push(
      AdmissionAssessment.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading AdmissionAssessment -  ${e}`);
  }

  try {
    formPromises.push(
      AwakeNightStaffSignoff.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading Awake Night Staff Signoff -  ${e}`);
  }

  try {
    formPromises.push(
      NightMonitoring.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading Night Monitoring -  ${e}`);
  }

  try {
    formPromises.push(
      BodyCheck.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading BodyCheck -  ${e}`);
  }

  try {
    formPromises.push(
      DailyProgressAndActivity.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading DailyProgressAndActivity -  ${e}`);
  }

  try {
    formPromises.push(
      IllnessInjury.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading IllnessInjury -  ${e}`);
  }

  try {
    formPromises.push(
      IncidentReport.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading IncidentReport -  ${e}`);
  }

  try {
    formPromises.push(
      RestraintReport.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading RestraintReport -  ${e}`);
  }

  try {
    formPromises.push(
      SeriousIncidentReport.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading SeriousIncidentReport -  ${e}`);
  }

  try {
    formPromises.push(
      TreatmentPlan72.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading TreatmentPlan72 -  ${e}`);
  }

  try {
    formPromises.push(
      ClothingInventory.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading ClothingInventory -  ${e}`);
  }

  try {
    formPromises.push(
      RoomCheck.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading RoomCheck -  ${e}`);
  }

  try {
    formPromises.push(
      SearchLog.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading SearchLog -  ${e}`);
  }

  try {
    formPromises.push(
      ClientRefusal.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading ClientRefusal -  ${e}`);
  }

  try {
    formPromises.push(
      MedicationDestruction.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading MedicationDestruction -  ${e}`);
  }

  try {
    formPromises.push(
      CssrsScreening.countDocuments({
        homeId: authUser.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading CssrsScreening -  ${e}`);
  }

  let completedPromisses;
  try {
    completedPromisses = await Promise.all(formPromises);
  } catch (e) {
    console.log(`Error counting forms - ${e}`);
    return res.status(500).json({ error: "Error counting forms" });
  }

  // Each entry is already a number (countDocuments) - the matching records
  // themselves are never loaded just to be counted.
  const count = completedPromisses.reduce((acc, formTypeCount) => acc + formTypeCount, 0);
  res.json({
    count,
    homeId,
  });
});

module.exports = router;
