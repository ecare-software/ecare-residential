const express = require("express");
const router = express.Router();
ObjectID = require("mongodb").ObjectID;

const AdmissionAssessment = require("../../models/AdmissionAssessment");
const {
  resolveHomeScopedUser,
  hasValidSignature,
  MISSING_SIGNATURE_ERROR,
} = require("../../utils/requireUserSignature");
const {
  containsMongoOperatorKey,
  MONGO_OPERATOR_ERROR,
} = require("../../utils/rejectMongoOperators");

router.post("/", async (req, res) => {
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.body.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }

  if (req.body.status === "COMPLETED" && !hasValidSignature(authUser)) {
    return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
  }

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
    // Note: overwritten below by the second createdBy/createdByName keys
    // in this same object literal (a pre-existing duplicate-key quirk -
    // JS keeps the last one) - both are set from the verified
    // authenticated user, not the request body, so it doesn't matter
    // which wins.
    createdBy: authUser.email,
    createdByName: `${authUser.firstName} ${authUser.lastName}`,
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
    healthIssues: req.body.healthIssues,
    // Sourced from the authenticated user, not the request body - a
    // record must belong to its creator's own home, never a home the
    // caller merely names.
    homeId: authUser.homeId,
    interventionStrategies: req.body.interventionStrategies,
    juvenileHistory: req.body.juvenileHistory,
    knownContraindicationsToTheUuseOfRestraint:
      req.body.knownContraindicationsToTheUuseOfRestraint,
    lastDentalExamination_date: req.body.lastDentalExamination_date,
    lastDentalExamination_location: req.body.lastDentalExamination_location,
    lastDentalExamination_monitoredBy:
      req.body.lastDentalExamination_monitoredBy,
    // Always server-generated, never taken from the request - this value
    // is used for report ordering and shown as audit data, so a
    // caller-supplied lastEditDate could backdate/postdate a record or
    // skew its position in a sorted list.
    lastEditDate: new Date(),
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

    // The key that actually applies (see the note on the first,
    // shadowed createdBy/createdByName above).
    createdBy: authUser.email,

    createdByName: `${authUser.firstName} ${authUser.lastName}`,

    lastEditDate: new Date().toISOString(),

    createDate: req.body.createDate,

    formType: "Admission Assessment",
    status: req.body.status,
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
    .sort({ createDate: -1 }).setOptions({ allowDiskUse: true })
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
        $options: "i",
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

    // submitted by
    if (req.params.submittedByA !== "none") {
      findObj.createdBy = req.params.submittedByA;
    }

    if (req.params.approved !== "null") {
      findObj.approved = req.params.approved;
    }

    AdmissionAssessment.find(findObj)
      .sort({ createDate: -1 }).setOptions({ allowDiskUse: true })
      .exec()
      .then((admissionAssessment) => res.json(admissionAssessment))
      .catch((err) => res.status(404).json({ success: err }));
  }
);

router.put("/:homeId/:formId/", async (req, res) => {
 try {
  // Home-scoped auth is required unconditionally here (not just when
  // completing) - the update predicate below must be scoped to the
  // authenticated user's own home, which requires knowing who that is on
  // every edit, and req.params.homeId must actually match it.
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }

  // A $-prefixed top-level key in the body is a MongoDB update operator,
  // not a field name - see utils/rejectMongoOperators.js. Without this,
  // a caller could smuggle e.g. { $set: { homeId: "other-home" } }
  // alongside plain fields; MongoDB merges that into the update's
  // effective $set and applies it verbatim, bypassing the
  // createdBy/createdByName/homeId/createDate strip below, which only
  // ever covers those exact top-level key names.
  if (containsMongoOperatorKey(req.body)) {
    return res.status(400).json({ error: MONGO_OPERATOR_ERROR });
  }

  // The record's status AFTER this update is applied - not just
  // whatever this particular request happens to send. Gating only on
  // `req.body.status === "COMPLETED"` would let a PUT that omits status
  // entirely (leaving an already-COMPLETED record COMPLETED) slip past
  // the signature check while still modifying the record's other fields.
  let effectiveStatus = req.body.status;
  if (effectiveStatus === undefined) {
    const existing = await AdmissionAssessment.findOne({
      _id: req.params.formId,
      homeId: authUser.homeId,
    }).select("status");
    effectiveStatus = existing?.status;
  }

  if (effectiveStatus === "COMPLETED" && !hasValidSignature(authUser)) {
    return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
  }

  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  // createdBy/createdByName/homeId/createDate are set once at creation and
  // must stay immutable - strip them from every edit regardless of what
  // the request body claims, rather than letting an edit silently reassign
  // who the original author was, move the record into another tenant, or
  // (createDate) backdate/postdate the creation audit trail. Mirrors
  // routes/api/client.js's identical strip on its Face Sheet update.
  delete updatedLastEditDate.createdBy;
  delete updatedLastEditDate.createdByName;
  delete updatedLastEditDate.homeId;
  delete updatedLastEditDate.createDate;
  AdmissionAssessment.updateOne(
    // Scoped to the authenticated user's own home, not the URL's :homeId
    // (just a caller-supplied claim) - a record belonging to a different
    // home can never be matched, let alone edited.
    { _id: req.params.formId, homeId: authUser.homeId },
    updatedLastEditDate
  )
    .then((data) => {
      // Mongoose 5's updateOne() result uses the legacy MongoDB driver
      // shape ({ n, nModified, ok }), not matchedCount/modifiedCount
      // (that's Mongoose 6+/the modern driver) - see routes/api/client.js's
      // identical check for the established convention in this codebase.
      // data.matchedCount here is always undefined, which would make this
      // 404 on every successful update.
      if (!data.n) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(updatedLastEditDate);
    })
    .catch((e) => {
      console.log(e);
    });
 } catch (err) {
   // A malformed :formId (or any other unexpected DB error) throws from
   // the findOne preflight lookup above - without this, that rejection
   // would never reach the updateOne(...).catch() below (a separate
   // promise chain it never gets to), and since this is an async Express
   // 4 handler with no built-in async error forwarding, the request would
   // hang with no response instead of getting a clean error.
   console.error("Error updating report:", err);
   res.status(500).json({ error: "Failed to update report" });
 }
});

router.delete("/:homeId/:formId/", (req, res) => {
  AdmissionAssessment.deleteOne({ _id: req.params.formId })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
