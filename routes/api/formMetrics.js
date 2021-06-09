const express = require("express");
const router = express.Router();
ObjectID = require("mongodb").ObjectID;

const AdmissionAssessment = require("../../models/AdmissionAssessment");
const BodyCheck = require("../../models/BodyCheck");
const DailyProgressAndActivity = require("../../models/DailyProgressAndActivity");
const IllnessInjury = require("../../models/IllnessInjury");
const IncidentReport = require("../../models/IncidentReport");
const RestraintReport = require("../../models/RestraintReport");
const SeriousIncidentReport = require("../../models/SeriousIncidentReport");
const TreatmentPlan72 = require("../../models/TreatmentPlan72");

router.get("/count/:homeId", async (req, res) => {
  const data = await TreatmentPlan72.find({ homeId: req.params.homeId });
});
