const express = require("express");
const router = express.Router();

const AdmissionAssessment = require("../../models/AdmissionAssessment");
const BodyCheck = require("../../models/BodyCheck");
const DailyProgressAndActivity = require("../../models/DailyProgressAndActivity");
const IllnessInjury = require("../../models/IllnessInjury");
const IncidentReport = require("../../models/IncidentReport");
const RestraintReport = require("../../models/RestraintReport");
const SeriousIncidentReport = require("../../models/SeriousIncidentReport");
const TreatmentPlan72 = require("../../models/TreatmentPlan72");

router.get("/count/:status/:homeId", async (req, res) => {
  const approved =
    (req.params.status && req.params.status == "true") ||
    req.params.status == "false"
      ? req.params.status
      : false;

  const formPromises = [];
  const homeId = req.params.homeId;

  try {
    formPromises.push(
      AdmissionAssessment.find({
        homeId: req.params.homeId,
        approved,
      })
    );
  } catch (e) {
    console.log(`Error loading AdmissionAssessment -  ${e}`);
  }

  try {
    formPromises.push(
      BodyCheck.find({
        homeId: req.params.homeId,
        approved,
      })
    );
  } catch (e) {
    console.log(`Error loading BodyCheck -  ${e}`);
  }

  try {
    formPromises.push(
      DailyProgressAndActivity.find({
        homeId: req.params.homeId,
        approved,
      })
    );
  } catch (e) {
    console.log(`Error loading DailyProgressAndActivity -  ${e}`);
  }

  try {
    formPromises.push(
      IllnessInjury.find({
        homeId: req.params.homeId,
        approved,
      })
    );
  } catch (e) {
    console.log(`Error loading IllnessInjury -  ${e}`);
  }

  try {
    formPromises.push(
      IncidentReport.find({
        homeId: req.params.homeId,
        approved,
      })
    );
  } catch (e) {
    console.log(`Error loading IncidentReport -  ${e}`);
  }

  try {
    formPromises.push(
      RestraintReport.find({
        homeId: req.params.homeId,
        approved,
      })
    );
  } catch (e) {
    console.log(`Error loading RestraintReport -  ${e}`);
  }

  try {
    formPromises.push(
      SeriousIncidentReport.find({
        homeId: req.params.homeId,
        approved,
      })
    );
  } catch (e) {
    console.log(`Error loading SeriousIncidentReport -  ${e}`);
  }

  try {
    formPromises.push(
      TreatmentPlan72.find({
        homeId: req.params.homeId,
        approved,
      })
    );
  } catch (e) {
    console.log(`Error loading TreatmentPlan72 -  ${e}`);
  }

  const completedPromisses = await Promise.all(formPromises);

  const count = completedPromisses.reduce((acc, formTypePromise) => {
    acc = acc + formTypePromise.length;
    return acc;
  }, 0);
  res.json({
    approved,
    count,
    homeId,
  });
});

router.get("/count/:homeId", async (req, res) => {
  const formPromises = [];
  const homeId = req.params.homeId;

  try {
    formPromises.push(
      AdmissionAssessment.find({
        homeId: req.params.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading AdmissionAssessment -  ${e}`);
  }

  try {
    formPromises.push(
      BodyCheck.find({
        homeId: req.params.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading BodyCheck -  ${e}`);
  }

  try {
    formPromises.push(
      DailyProgressAndActivity.find({
        homeId: req.params.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading DailyProgressAndActivity -  ${e}`);
  }

  try {
    formPromises.push(
      IllnessInjury.find({
        homeId: req.params.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading IllnessInjury -  ${e}`);
  }

  try {
    formPromises.push(
      IncidentReport.find({
        homeId: req.params.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading IncidentReport -  ${e}`);
  }

  try {
    formPromises.push(
      RestraintReport.find({
        homeId: req.params.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading RestraintReport -  ${e}`);
  }

  try {
    formPromises.push(
      SeriousIncidentReport.find({
        homeId: req.params.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading SeriousIncidentReport -  ${e}`);
  }

  try {
    formPromises.push(
      TreatmentPlan72.find({
        homeId: req.params.homeId,
      })
    );
  } catch (e) {
    console.log(`Error loading TreatmentPlan72 -  ${e}`);
  }

  const completedPromisses = await Promise.all(formPromises);

  const count = completedPromisses.reduce((acc, formTypePromise) => {
    acc = acc + formTypePromise.length;
    return acc;
  }, 0);
  console.log(completedPromisses);
  res.json({
    count,
    homeId,
  });
});

module.exports = router;
