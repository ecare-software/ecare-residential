const express = require("express");
const router = express.Router();

const TreatmentPlan72 = require("../../models/TreatmentPlan72");

router.post("/", (req, res) => {
  const newTreatmentPlan72 = new TreatmentPlan72({
    childMeta_name: req.body.childMeta_name,
    childMeta_dob: req.body.childMeta_dob,
    childMeta_age: req.body.childMeta_age,
    childMeta_ssn: req.body.childMeta_ssn,
    childMeta_gender: req.body.childMeta_gender,
    childMeta_medicaidNumber: req.body.childMeta_medicaidNumber,
    childMeta_county: req.body.childMeta_county,
    childMeta_placeOfBirth: req.body.childMeta_placeOfBirth,
    childMeta_ethnicity: req.body.childMeta_ethnicity,
    childMeta_levelOfCare: req.body.childMeta_levelOfCare,

    childMeta_religion: req.body.childMeta_religion,

    childMeta_managingConservator: req.body.childMeta_managingConservator,

    childMeta_dateOfAdmission: req.body.childMeta_dateOfAdmission,

    projectedDateForAchievingPermanency:
      req.body.projectedDateForAchievingPermanency,

    legalStatus_PermancyGoal: req.body.legalStatus_PermancyGoal,

    fatherMeta_name: req.body.fatherMeta_name,

    fatherMeta_address: req.body.fatherMeta_address,

    fatherMeta_phoneNumber: req.body.fatherMeta_phoneNumber,

    motherMeta_name: req.body.motherMeta_name,

    motherMeta_address: req.body.motherMeta_address,

    motherMeta_phoneNumber: req.body.motherMeta_phoneNumber,

    legalStatus: req.body.legalStatus,

    referringAgency_co: req.body.referringAgency_co,

    agentOfReferringAgency_co_name: req.body.agentOfReferringAgency_co_name,

    agentOfReferringAgency_co_address:
      req.body.agentOfReferringAgency_co_address,

    reactionToPlacement: req.body.reactionToPlacement,

    interests: req.body.interests,

    otherMeta1_name: req.body.otherMeta1_name,

    otherMeta1_relationship: req.body.otherMeta1_relationship,

    otherMeta1_address: req.body.otherMeta1_address,

    otherMeta1_phoneNumber: req.body.otherMeta1_phoneNumber,

    otherMeta2_name: req.body.otherMeta2_name,

    otherMeta2_relationship: req.body.otherMeta2_relationship,

    otherMeta2_address: req.body.otherMeta2_address,

    otherMeta2_phoneNumber: req.body.otherMeta2_phoneNumber,

    otherMeta3_name: req.body.otherMeta3_name,

    otherMeta3_relationship: req.body.otherMeta3_relationship,

    otherMeta3_address: req.body.otherMeta3_address,

    otherMeta3_phoneNumber: req.body.otherMeta3_phoneNumber,

    otherMeta4_name: req.body.otherMeta4_name,

    otherMeta4_relationship: req.body.otherMeta4_relationship,

    otherMeta4_address: req.body.otherMeta4_address,

    otherMeta4_phoneNumber: req.body.otherMeta4_phoneNumber,

    currentMedicalInformation: req.body.currentMedicalInformation,

    developmental_medicalHistory: req.body.developmental_medicalHistory,

    drugAllergies: req.body.drugAllergies,

    food1: req.body.food1,

    allergies: req.body.allergies,

    chronicHealth: req.body.chronicHealth,

    healthStrengths: req.body.healthStrengths,

    healthNeeds: req.body.healthNeeds,

    lastPhysicalExamination_date: req.body.lastPhysicalExamination_date,

    lastPhysicalExamination_location: req.body.lastPhysicalExamination_location,

    lastPhysicalExamination_monitoredBy:
      req.body.lastPhysicalExamination_monitoredBy,

    lastDentalExamination_date: req.body.lastDentalExamination_date,

    lastDentalExamination_location: req.body.lastDentalExamination_location,

    lastDentalExamination_monitoredBy:
      req.body.lastDentalExamination_monitoredBy,

    lastOpticalExamination_date: req.body.lastOpticalExamination_date,

    lastOpticalExamination_location: req.body.lastOpticalExamination_location,

    lastOpticalExamination_monitoredBy:
      req.body.lastOpticalExamination_monitoredBy,

    currentMedications_dosages_targetedSymptoms1_medication:
      req.body.currentMedications_dosages_targetedSymptoms1_medication,

    currentMedications_dosages_targetedSymptoms1_dosage_frequency:
      req.body.currentMedications_dosages_targetedSymptoms1_dosage_frequency,

    currentMedications_dosages_targetedSymptoms1_purpose:
      req.body.currentMedications_dosages_targetedSymptoms1_purpose,

    currentMedications_dosages_targetedSymptoms1_possibleSideEffects:
      req.body.currentMedications_dosages_targetedSymptoms1_possibleSideEffects,

    currentMedications_dosages_targetedSymptoms1_monitoredBy:
      req.body.currentMedications_dosages_targetedSymptoms1_monitoredBy,

    currentMedications_dosages_targetedSymptoms2_medication:
      req.body.currentMedications_dosages_targetedSymptoms2_medication,

    currentMedications_dosages_targetedSymptoms2_dosage_frequency:
      req.body.currentMedications_dosages_targetedSymptoms2_dosage_frequency,

    currentMedications_dosages_targetedSymptoms2_purpose:
      req.body.currentMedications_dosages_targetedSymptoms2_purpose,

    currentMedications_dosages_targetedSymptoms2_possibleSideEffects:
      req.body.currentMedications_dosages_targetedSymptoms2_possibleSideEffects,

    currentMedications_dosages_targetedSymptoms2_monitoredBy:
      req.body.currentMedications_dosages_targetedSymptoms2_monitoredBy,

    currentMedications_dosages_targetedSymptoms3_medication:
      req.body.currentMedications_dosages_targetedSymptoms3_medication,

    currentMedications_dosages_targetedSymptoms3_dosage_frequency:
      req.body.currentMedications_dosages_targetedSymptoms3_dosage_frequency,

    currentMedications_dosages_targetedSymptoms3_purpose:
      req.body.currentMedications_dosages_targetedSymptoms3_purpose,

    currentMedications_dosages_targetedSymptoms3_possibleSideEffects:
      req.body.currentMedications_dosages_targetedSymptoms3_possibleSideEffects,

    currentMedications_dosages_targetedSymptoms3_monitoredBy:
      req.body.currentMedications_dosages_targetedSymptoms3_monitoredBy,

    currentMedications_dosages_targetedSymptoms4_medication:
      req.body.currentMedications_dosages_targetedSymptoms4_medication,

    currentMedications_dosages_targetedSymptoms4_dosage_frequency:
      req.body.currentMedications_dosages_targetedSymptoms4_dosage_frequency,

    currentMedications_dosages_targetedSymptoms4_purpose:
      req.body.currentMedications_dosages_targetedSymptoms4_purpose,

    currentMedications_dosages_targetedSymptoms4_possibleSideEffects:
      req.body.currentMedications_dosages_targetedSymptoms4_possibleSideEffects,

    currentMedications_dosages_targetedSymptoms4_monitoredBy:
      req.body.currentMedications_dosages_targetedSymptoms4_monitoredBy,

    currentMedications_dosages_targetedSymptoms5_medication:
      req.body.currentMedications_dosages_targetedSymptoms5_medication,

    currentMedications_dosages_targetedSymptoms5_dosage_frequency:
      req.body.currentMedications_dosages_targetedSymptoms5_dosage_frequency,

    currentMedications_dosages_targetedSymptoms5_purpose:
      req.body.currentMedications_dosages_targetedSymptoms5_purpose,

    currentMedications_dosages_targetedSymptoms5_possibleSideEffects:
      req.body.currentMedications_dosages_targetedSymptoms5_possibleSideEffects,

    currentMedications_dosages_targetedSymptoms5_monitoredBy:
      req.body.currentMedications_dosages_targetedSymptoms5_monitoredBy,

    behavioralStrengths: req.body.behavioralStrengths,

    behavioralNeeds: req.body.behavioralNeeds,

    behavioralTreatmentServices: req.body.behavioralTreatmentServices,

    emotionalStrengths: req.body.emotionalStrengths,

    emotionalNeeds: req.body.emotionalNeeds,

    emotionalTreatmentServices: req.body.emotionalTreatmentServices,

    food2: req.body.food2,

    eyeContact: req.body.eyeContact,

    physicalTouch: req.body.physicalTouch,

    personalProperty: req.body.personalProperty,

    certainTopics: req.body.certainTopics,

    knownContraindicationsToTheUuseOfRestraint:
      req.body.knownContraindicationsToTheUuseOfRestraint,

    de_escalatingTechniquesToAvoidRestraints_ebi:
      req.body.de_escalatingTechniquesToAvoidRestraints_ebi,

    child_de_escalator: req.body.child_de_escalator,

    staff_de_escalator: req.body.staff_de_escalator,

    therapist_de_escalator: req.body.therapist_de_escalator,

    childPreferred_de_escalation: req.body.childPreferred_de_escalation,

    interventionStrategies: req.body.interventionStrategies,

    supervisionStrategies: req.body.supervisionStrategies,

    social_recreationalStrengths: req.body.social_recreationalStrengths,

    social_recreationalNeeds: req.body.social_recreationalNeeds,

    familyStrengths: req.body.familyStrengths,

    familyNeeds: req.body.familyNeeds,

    visitor1_name: req.body.visitor1_name,

    visitor1_relationship: req.body.visitor1_relationship,

    visitor1_frequency: req.body.visitor1_frequency,

    visitor1_supervisedBy: req.body.visitor1_supervisedBy,

    visitor1_location: req.body.visitor1_location,

    visitor1_length: req.body.visitor1_length,

    visitor2_name: req.body.visitor2_name,

    visitor2_relationship: req.body.visitor2_relationship,

    visitor2_frequency: req.body.visitor2_frequency,

    visitor2_supervisedBy: req.body.visitor2_supervisedBy,

    visitor2_location: req.body.visitor2_location,

    visitor2_length: req.body.visitor2_length,

    visitor3_name: req.body.visitor3_name,

    visitor3_relationship: req.body.visitor3_relationship,

    visitor3_frequency: req.body.visitor3_frequency,

    visitor3_supervisedBy: req.body.visitor3_supervisedBy,

    visitor3_location: req.body.visitor3_location,

    visitor3_length: req.body.visitor3_length,

    visitor4_name: req.body.visitor4_name,

    visitor4_relationship: req.body.visitor4_relationship,

    visitor4_frequency: req.body.visitor4_frequency,

    visitor4_supervisedBy: req.body.visitor4_supervisedBy,

    visitor4_location: req.body.visitor4_location,

    visitor4_length: req.body.visitor4_length,

    educational_vacationalStrengths: req.body.educational_vacationalStrengths,

    educational_vacationalNeeds: req.body.educational_vacationalNeeds,

    transitionalLiving: req.body.transitionalLiving,

    dischargePlanning: req.body.dischargePlanning,

    longRangeGoals: req.body.longRangeGoals,

    shortRangeGoals: req.body.shortRangeGoals,

    administorSign: req.body.administorSign,

    administorSignDate: req.body.administorSignDate,

    treatmentDirectorSign: req.body.treatmentDirectorSign,

    treatmentDirectorSignDate: req.body.treatmentDirectorSignDate,

    createdBy: req.body.createdBy,

    createdByName: req.body.createdByName,

    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    homeId: req.body.homeId,

    formType: "72 Hour Treatment Plan",
  });

  newTreatmentPlan72
    .save()
    .then((treatment72) => res.json(treatment72))
    .catch((e) => {
      console.log(e);
    });
});

router.get("/:homeId", (req, res) => {
  TreatmentPlan72.find({ homeId: req.params.homeId })
    .sort({ createDate: -1 })
    .exec()
    .then((TreatmentPlan72s) => res.json(TreatmentPlan72s))
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
      if (isNaN(req.params.searchString)) {
        findObj.childMeta_name = {
          $regex: ".*" + req.params.searchString + ".*",
          $options: "ig",
        };
      } else {
        findObj.childMeta_medicaidNumber = req.params.searchString;
      }
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
          createDate: {
            $gt: new Date(dateAfter.setDate(dateAfter.getDate() + 1)),
          },
        },
        {
          createDate: {
            $lt: new Date(dateBefore.setDate(dateBefore.getDate())),
          },
        },
      ];
    } else {
      //submittedAfter
      if (req.params.lastEditDateAfter !== "none") {
        var date = new Date(req.params.lastEditDateAfter);
        findObj.createDate = {
          $gt: new Date(date.setDate(date.getDate() + 1)),
        };
      }

      //submittedBefore
      if (req.params.lastEditDateBefore !== "none") {
        var date = new Date(req.params.lastEditDateBefore);
        findObj.createDate = {
          $lt: new Date(date.setDate(date.getDate())),
        };
      }
    }

    //child date of birth
    if (
      req.params.childDOBAfter !== "none" &&
      req.params.childDOBBefore !== "none"
    ) {
      var dobAfter = new Date(req.params.childDOBAfter);
      var dobBefore = new Date(req.params.childDOBBefore);
      findObj["$and"] = [
        {
          childMeta_dob: {
            $gt: new Date(
              dobAfter.setDate(dobAfter.getDate() + 1)
            ).toISOString(),
          },
        },
        {
          childMeta_dob: {
            $lt: new Date(dobBefore.setDate(dobBefore.getDate())).toISOString(),
          },
        },
      ];
    } else {
      //submittedAfter
      if (req.params.childDOBAfter !== "none") {
        var date = new Date(req.params.childDOBAfter);
        findObj.childMeta_dob = {
          $gt: new Date(date.setDate(date.getDate() + 1)),
        };
      }

      //submittedBefore
      if (req.params.childDOBBefore !== "none") {
        var date = new Date(req.params.childDOBBefore);
        findObj.childMeta_dob = {
          $lt: new Date(date.setDate(date.getDate())),
        };
      }
    }

    //child date of admission
    if (
      req.params.childDOAAfter !== "none" &&
      req.params.childDOABefore !== "none"
    ) {
      var doaAfter = new Date(req.params.childDOAAfter);
      var doaBefore = new Date(req.params.childDOABefore);
      findObj["$and"] = [
        {
          childMeta_dateOfAdmission: {
            $gte: new Date(
              doaAfter.setDate(doaAfter.getDate() + 1)
            ).toISOString(),
          },
        },
        {
          childMeta_dateOfAdmission: {
            $lte: new Date(
              doaBefore.setDate(doaBefore.getDate())
            ).toISOString(),
          },
        },
      ];
    } else {
      //submittedAfter
      if (req.params.childDOAAfter !== "none") {
        var date = new Date(req.params.childDOAAfter);
        findObj.childMeta_dateOfAdmission = {
          $gt: new Date(date.setDate(date.getDate() + 1)),
        };
      }

      //submittedBefore
      if (req.params.childDOABefore !== "none") {
        var date = new Date(req.params.childDOABefore);
        findObj.childMeta_dateOfAdmission = {
          $lt: new Date(date.setDate(date.getDate())),
        };
      }
    }

    // ethnicityA
    if (req.params.ethnicityA !== "none") {
      findObj.childMeta_ethnicity = req.params.ethnicityA;
    }

    // submitted by
    if (req.params.submittedByA !== "none") {
      findObj.createdBy = req.params.submittedByA;
    }

    if (req.params.approved !== "null") {
      findObj.approved = req.params.approved;
    }

    TreatmentPlan72.find(findObj)
      .sort({ createDate: -1 })
      .exec()
      .then((TreatmentPlan72s) => res.json(TreatmentPlan72s))
      .catch((err) => res.status(404).json({ success: err }));
  }
);

router.put("/:homeId/:formId/", (req, res) => {
  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  TreatmentPlan72.updateOne({ _id: req.params.formId }, updatedLastEditDate)
    .then((data) => {
      res.json(updatedLastEditDate);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.delete("/:homeId/:formId/", (req, res) => {
  TreatmentPlan72.deleteOne({ _id: req.params.formId })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
