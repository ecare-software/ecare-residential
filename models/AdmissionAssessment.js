const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdmissionAssessmentSchema = new Schema({
  allergies: {
    type: String,
  },
  basicNeeds: {
    type: String,
  },
  behavioralHistory: {
    type: String,
  },
  certainTopics: {
    type: String,
  },
  childMeta_age: {
    type: String,
  },
  childMeta_county: {
    type: String,
  },
  childMeta_dateOfAdmission: {
    type: String,
  },
  childMeta_dob: {
    type: String,
  },
  childMeta_ethnicity: {
    type: String,
  },
  childMeta_gender: {
    type: String,
  },
  childMeta_levelOfCare: {
    type: String,
  },
  childMeta_managingConservator: {
    type: String,
  },
  childMeta_medicaidNumber: {
    type: String,
  },
  childMeta_name: {
    type: String,
  },
  childMeta_placeOfBirth: {
    type: String,
  },
  childMeta_religion: {
    type: String,
  },
  childMeta_ssn: {
    type: String,
  },
  childPreferred_de_escalation: {
    type: String,
  },
  child_de_escalator: {
    type: String,
  },
  chronicHealthConditions: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  createdByName: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms1_dosage_frequency: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms1_medication: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms1_monitoredBy: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms1_possibleSideEffects: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms1_purpose: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms2_dosage_frequency: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms2_medication: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms2_monitoredBy: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms2_possibleSideEffects: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms2_purpose: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms3_dosage_frequency: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms3_medication: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms3_monitoredBy: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms3_possibleSideEffects: {
    type: String,
  },
  currenƒtMedications_dosages_targetedSymptoms3_purpose: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms4_dosage_frequency: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms4_medication: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms4_monitoredBy: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms4_possibleSideEffects: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms4_purpose: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms5_dosage_frequency: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms5_medication: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms5_monitoredBy: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms5_possibleSideEffects: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms5_purpose: {
    type: String,
  },
  date_of_evaluation: {
    type: String,
  },
  de_escalatingTechniquesToAvoidRestraints_ebi: {
    type: String,
  },
  desc_of_circum: {
    type: String,
  },
  developmental_medicalHistory: {
    type: String,
  },
  diagnosis: {
    type: String,
  },
  drugAllergies: {
    type: String,
  },
  educationHistory: {
    type: String,
  },
  educationalLevel: {
    type: String,
  },
  effortsToObtainInfo: {
    type: String,
  },
  emotionalHistory: {
    type: String,
  },
  env_family_function: {
    type: String,
  },
  est_length_of_stay: {
    type: String,
  },
  examiner: {
    type: String,
  },
  eyeContact: {
    type: String,
  },
  family_social_history: {
    type: String,
  },
  food1: {
    type: String,
  },
  food2: {
    type: String,
  },
  formErrorMessage: {
    type: String,
  },
  formHasError: {
    type: String,
  },
  formSubmitted: {
    type: String,
  },
  healthIssues: {
    type: String,
  },
  homeId: {
    type: String,
  },
  interventionStrategies: {
    type: String,
  },
  juvenileHistory: {
    type: String,
  },
  knownContraindicationsToTheUuseOfRestraint: {
    type: String,
  },
  lastDentalExamination_date: {
    type: String,
  },
  lastDentalExamination_location: {
    type: String,
  },
  lastDentalExamination_monitoredBy: {
    type: String,
  },
  lastEditDate: {
    type: String,
  },
  lastHearingExamination_date: {
    type: String,
  },
  lastHearingExamination_location: {
    type: String,
  },
  lastHearingExamination_monitoredBy: {
    type: String,
  },
  lastOpticalExamination_date: {
    type: String,
  },
  lastOpticalExamination_location: {
    type: String,
  },
  lastOpticalExamination_monitoredBy: {
    type: String,
  },
  lastPhysicalExamination_date: {
    type: String,
  },
  lastPhysicalExamination_location: {
    type: String,
  },
  lastPhysicalExamination_monitoredBy: {
    type: String,
  },
  lastSchoolAttended: {
    type: String,
  },
  legalStatus_PermancyGoal: {
    type: String,
  },
  longTermGoals: {
    type: String,
  },
  managingConservator_text: {
    type: String,
  },
  objective: {
    type: String,
  },
  otherMeta1_address: {
    type: String,
  },
  otherMeta1_name: {
    type: String,
  },
  otherMeta1_phoneNumber: {
    type: String,
  },
  otherMeta1_relationship: {
    type: String,
  },
  otherMeta2_address: {
    type: String,
  },
  otherMeta2_name: {
    type: String,
  },
  otherMeta2_phoneNumber: {
    type: String,
  },
  otherMeta2_relationship: {
    type: String,
  },
  otherMeta3_address: {
    type: String,
  },
  otherMeta3_name: {
    type: String,
  },
  otherMeta3_phoneNumber: {
    type: String,
  },
  otherMeta3_relationship: {
    type: String,
  },
  otherMeta4_address: {
    type: String,
  },
  otherMeta4_name: {
    type: String,
  },
  otherMeta4_phoneNumber: {
    type: String,
  },
  otherMeta4_relationship: {
    type: String,
  },
  parent_gaurdian_expectation: {
    type: String,
  },
  personalProperty: {
    type: String,
  },
  physicalTouch: {
    type: String,
  },
  previousPlacements: {
    type: String,
  },
  progressReportInfo: {
    type: String,
  },
  projectedDateForAchievingPermanency: {
    type: String,
  },
  rationl_admission: {
    type: String,
  },
  recHistory: {
    type: String,
  },
  shortTermGoals: {
    type: String,
  },
  staff_de_escalator: {
    type: String,
  },
  stressors: {
    type: String,
  },
  substanceAbuseStatus: {
    type: String,
  },
  summary_of_discussion: {
    type: String,
  },
  supervisionStrategies: {
    type: String,
  },
  therapist_de_escalator: {
    type: String,
  },
  understanding_expectations: {
    type: String,
  },
  lastEditDate: {
    type: Date,
    default: new Date(),
    //required:true
  },
  homeId: {
    type: String,
  },

  formType: {
    type: String,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  approvedBy: {
    type: String,
    required: false,
  },
  approvedByName: {
    type: String,
    required: false,
  },
  approvedByDate: {
    type: Date,
    //required:true
  },
});

module.exports = AdmissionAssessment = mongoose.model(
  "admissionAssessment",
  AdmissionAssessmentSchema
);
