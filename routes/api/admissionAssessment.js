const express = require("express");
const router = express.Router();
ObjectID = require("mongodb").ObjectID;

const AdmissionAssessment = require("../../models/AdmissionAssessment");

router.post("/", (req, res) => {
  const newAdmissionAssessment = new AdmissionAssessment({
    allergies: req.body.allergies,
    basicNeeds: req.body.basicNeeds,
    behavioralHistory: req.body.behavioralHistory,
    certainTopics: req.body.certainTopics,
    childMeta_age: req.body.childMeta_age,
    childMeta_county: req.body.childMeta_county,
    childMeta_dateOfAdmission: req.body.childMeta_dateOfAdmission,
    childMeta_dob: req.body.childMeta_dob,
    childMeta_ethnicity: req.body.childMeta_ethnicity,
    childMeta_gender: req.body.childMeta_gender,
    childMeta_levelOfCare: req.body.childMeta_levelOfCare,
    childMeta_managingConservator: req.body.childMeta_managingConservator,
    childMeta_medicaidNumber: req.body.childMeta_medicaidNumber,
    childMeta_name: req.body.childMeta_name,
    childMeta_placeOfBirth: req.body.childMeta_placeOfBirth,
    childMeta_religion: req.body.childMeta_religion,
    childMeta_ssn: req.body.childMeta_ssn,
    childPreferred_de_escalation: req.body.childPreferred_de_escalation,
    child_de_escalator: req.body.child_de_escalator,
    chronicHealthConditions: req.body.chronicHealthConditions,
    createdBy: req.body.createdBy,
    createdByName: req.body.createdByName,
    currentMedications_dosages_targetedSymptoms1_dosage_frequency:
      req.body.currentMedications_dosages_targetedSymptoms1_dosage_frequency,
    currentMedications_dosages_targetedSymptoms1_medication:
      req.body.currentMedications_dosages_targetedSymptoms1_medication,
    currentMedications_dosages_targetedSymptoms1_monitoredBy:
      req.body.currentMedications_dosages_targetedSymptoms1_monitoredBy,
    currentMedications_dosages_targetedSymptoms1_possibleSideEffects:
      req.body.currentMedications_dosages_targetedSymptoms1_possibleSideEffects,
    currentMedications_dosages_targetedSymptoms1_purpose:
      req.body.currentMedications_dosages_targetedSymptoms1_purpose,
    currentMedications_dosages_targetedSymptoms2_dosage_frequency:
      req.body.currentMedications_dosages_targetedSymptoms2_dosage_frequency,
    currentMedications_dosages_targetedSymptoms2_medication:
      req.body.currentMedications_dosages_targetedSymptoms2_medication,
    currentMedications_dosages_targetedSymptoms2_monitoredBy:
      req.body.currentMedications_dosages_targetedSymptoms2_monitoredBy,
    currentMedications_dosages_targetedSymptoms2_possibleSideEffects:
      req.body.currentMedications_dosages_targetedSymptoms2_possibleSideEffects,
    currentMedications_dosages_targetedSymptoms2_purpose:
      req.body.currentMedications_dosages_targetedSymptoms2_purpose,
    currentMedications_dosages_targetedSymptoms3_dosage_frequency:
      req.body.currentMedications_dosages_targetedSymptoms3_dosage_frequency,
    currentMedications_dosages_targetedSymptoms3_medication:
      req.body.currentMedications_dosages_targetedSymptoms3_medication,
    currentMedications_dosages_targetedSymptoms3_monitoredBy:
      req.body.currentMedications_dosages_targetedSymptoms3_monitoredBy,
    currentMedications_dosages_targetedSymptoms3_possibleSideEffects:
      req.body.currentMedications_dosages_targetedSymptoms3_possibleSideEffects,
    currenƒtMedications_dosages_targetedSymptoms3_purpose:
      req.body.currenƒtMedications_dosages_targetedSymptoms3_purpose,
    currentMedications_dosages_targetedSymptoms4_dosage_frequency:
      req.body.currentMedications_dosages_targetedSymptoms4_dosage_frequency,
    currentMedications_dosages_targetedSymptoms4_medication:
      req.body.currentMedications_dosages_targetedSymptoms4_medication,
    currentMedications_dosages_targetedSymptoms4_monitoredBy:
      req.body.currentMedications_dosages_targetedSymptoms4_monitoredBy,
    currentMedications_dosages_targetedSymptoms4_possibleSideEffects:
      req.body.currentMedications_dosages_targetedSymptoms4_possibleSideEffects,
    currentMedications_dosages_targetedSymptoms4_purpose:
      req.body.currentMedications_dosages_targetedSymptoms4_purpose,
    currentMedications_dosages_targetedSymptoms5_dosage_frequency:
      req.body.currentMedications_dosages_targetedSymptoms5_dosage_frequency,
    currentMedications_dosages_targetedSymptoms5_medication:
      req.body.currentMedications_dosages_targetedSymptoms5_medication,
    currentMedications_dosages_targetedSymptoms5_monitoredBy:
      req.body.currentMedications_dosages_targetedSymptoms5_monitoredBy,
    currentMedications_dosages_targetedSymptoms5_possibleSideEffects:
      req.body.currentMedications_dosages_targetedSymptoms5_possibleSideEffects,
    currentMedications_dosages_targetedSymptoms5_purpose:
      req.body.currentMedications_dosages_targetedSymptoms5_purpose,
    date_of_evaluation: req.body.date_of_evaluation,
    de_escalatingTechniquesToAvoidRestraints_ebi:
      req.body.de_escalatingTechniquesToAvoidRestraints_ebi,
    desc_of_circum: req.body.desc_of_circum,
    developmental_medicalHistory: req.body.developmental_medicalHistory,
    diagnosis: req.body.diagnosis,
    drugAllergies: req.body.drugAllergies,
    educationHistory: req.body.educationHistory,
    educationalLevel: req.body.educationalLevel,
    effortsToObtainInfo: req.body.effortsToObtainInfo,
    emotionalHistory: req.body.emotionalHistory,
    env_family_function: req.body.env_family_function,
    est_length_of_stay: req.body.est_length_of_stay,
    examiner: req.body.examiner,
    eyeContact: req.body.eyeContact,
    family_social_history: req.body.family_social_history,
    food1: req.body.food1,
    food2: req.body.food2,
    formErrorMessage: req.body.formErrorMessage,
    formHasError: req.body.formHasError,
    formSubmitted: req.body.formSubmitted,
    healthIssues: req.body.healthIssues,
    homeId: req.body.homeId,
    interventionStrategies: req.body.interventionStrategies,
    juvenileHistory: req.body.juvenileHistory,
    knownContraindicationsToTheUuseOfRestraint:
      req.body.knownContraindicationsToTheUuseOfRestraint,
    lastDentalExamination_date: req.body.lastDentalExamination_date,
    lastDentalExamination_location: req.body.lastDentalExamination_location,
    lastDentalExamination_monitoredBy:
      req.body.lastDentalExamination_monitoredBy,
    lastEditDate: req.body.lastEditDate,
    lastHearingExamination_date: req.body.lastHearingExamination_date,
    lastHearingExamination_location: req.body.lastHearingExamination_location,
    lastHearingExamination_monitoredBy:
      req.body.lastHearingExamination_monitoredBy,
    lastOpticalExamination_date: req.body.lastOpticalExamination_date,
    lastOpticalExamination_location: req.body.lastOpticalExamination_location,
    lastOpticalExamination_monitoredBy:
      req.body.lastOpticalExamination_monitoredBy,
    lastPhysicalExamination_date: req.body.lastPhysicalExamination_date,
    lastPhysicalExamination_location: req.body.lastPhysicalExamination_location,
    lastPhysicalExamination_monitoredBy:
      req.body.lastPhysicalExamination_monitoredBy,
    lastSchoolAttended: req.body.lastSchoolAttended,
    legalStatus_PermancyGoal: req.body.legalStatus_PermancyGoal,
    longTermGoals: req.body.longTermGoals,
    managingConservator_text: req.body.managingConservator_text,
    objective: req.body.objective,
    otherMeta1_address: req.body.otherMeta1_address,
    otherMeta1_name: req.body.otherMeta1_name,
    otherMeta1_phoneNumber: req.body.otherMeta1_phoneNumber,
    otherMeta1_relationship: req.body.otherMeta1_relationship,
    otherMeta2_address: req.body.otherMeta2_address,
    otherMeta2_name: req.body.otherMeta2_name,
    otherMeta2_phoneNumber: req.body.otherMeta2_phoneNumber,
    otherMeta2_relationship: req.body.otherMeta2_relationship,
    otherMeta3_address: req.body.otherMeta3_address,
    otherMeta3_name: req.body.otherMeta3_name,
    otherMeta3_phoneNumber: req.body.otherMeta3_phoneNumber,
    otherMeta3_relationship: req.body.otherMeta3_relationship,
    otherMeta4_address: req.body.otherMeta4_address,
    otherMeta4_name: req.body.otherMeta4_name,
    otherMeta4_phoneNumber: req.body.otherMeta4_phoneNumber,
    otherMeta4_relationship: req.body.otherMeta4_relationship,
    parent_gaurdian_expectation: req.body.parent_gaurdian_expectation,
    personalProperty: req.body.personalProperty,
    physicalTouch: req.body.physicalTouch,
    previousPlacements: req.body.previousPlacements,
    progressReportInfo: req.body.progressReportInfo,
    projectedDateForAchievingPermanency:
      req.body.projectedDateForAchievingPermanency,
    rationl_admission: req.body.rationl_admission,
    recHistory: req.body.recHistory,
    shortTermGoals: req.body.shortTermGoals,
    staff_de_escalator: req.body.staff_de_escalator,
    stressors: req.body.stressors,
    substanceAbuseStatus: req.body.substanceAbuseStatus,
    summary_of_discussion: req.body.summary_of_discussion,
    supervisionStrategies: req.body.supervisionStrategies,
    therapist_de_escalator: req.body.therapist_de_escalator,
    understanding_expectations: req.body.understanding_expectations,

    createdBy: req.body.createdBy,

    createdByName: req.body.createdByName,

    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    formType: "Admission Assessment",
  });

  newAdmissionAssessment
    .save()
    .then((admissionAssessment) => res.json(admissionAssessment))
    .catch((e) => {
      e;
    });
});

router.get("/:homeId", (req, res) => {
  AdmissionAssessment.find({ homeId: req.params.homeId })
    .sort({ lastEditDate: -1 })
    .exec()
    .then((admissionAssessment) => res.json(admissionAssessment))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get(
  "/:homeId/:searchString" +
    "/:lastEditDateAfter/:lastEditDateBefore" +
    "/:childDOBAfter/:childDOBBefore" +
    "/:childDOAAfter/:childDOABefore" +
    "/:ethnicityA" +
    "/:submittedByA" +
    "/:approved",
  (req, res) => {
    var findObj = {
      homeId: req.params.homeId,
    };
    //search string
    if (req.params.searchString !== "none") {
      findObj.childMeta_name = {
        $regex: ".*" + req.params.searchString + ".*",
        $options: "ig",
      };
    }

    //submitted
    if (
      req.params.lastEditDateAfter !== "none" &&
      req.params.lastEditDateBefore !== "none"
    ) {
      var dateAfter = new Date(req.params.lastEditDateAfter);
      var dateBefore = new Date(req.params.lastEditDateBefore);
      findObj["$and"] = [
        {
          lastEditDate: {
            $gt: new Date(
              dateAfter.setDate(dateAfter.getDate() + 1)
            ).toISOString(),
          },
        },
        {
          lastEditDate: {
            $lt: new Date(
              dateBefore.setDate(dateBefore.getDate())
            ).toISOString(),
          },
        },
      ];
    } else {
      //submittedAfter
      if (req.params.lastEditDateAfter !== "none") {
        var date = new Date(req.params.lastEditDateAfter);
        findObj.lastEditDate = {
          $gt: new Date(date.setDate(date.getDate() + 1)).toISOString(),
        };
      }

      //submittedBefore
      if (req.params.lastEditDateBefore !== "none") {
        var date = new Date(req.params.lastEditDateBefore);
        findObj.lastEditDate = {
          $lt: new Date(date.setDate(date.getDate())).toISOString(),
        };
      }
    }

    // submitted by
    if (req.params.submittedByA !== "none") {
      findObj.createdBy = req.params.submittedByA;
    }

    if (req.params.approved !== "null") {
      findObj.approved = req.params.approved;
    }

    AdmissionAssessment.find(findObj)
      .sort({ lastEditDate: -1 })
      .exec()
      .then((admissionAssessment) => res.json(admissionAssessment))
      .catch((err) => res.status(404).json({ success: err }));
  }
);

router.put("/:homeId/:formId/", (req, res) => {
  IllnessInjury.findByIdAndUpdate({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
