const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Schema
const TreatmentPlan72Schema = new Schema({
  childMeta_name: {
    type: String,
    //required: true
  },
  childMeta_dob: {
    type: String,
    //required:true
  },
  childMeta_age: {
    type: Number,
  },
  childMeta_ssn: {
    type: Number,
    // required: true
  },
  childMeta_gender: {
    type: String,
    // required: true
  },
  childMeta_medicaidNumber: {
    type: String,
    // required: true
  },
  childMeta_county: {
    type: String,
  },
  childMeta_placeOfBirth: {
    type: String,
  },
  childMeta_ethnicity: {
    type: String,
    // required: true
  },
  childMeta_levelOfCare: {
    type: String,
    // required: true
  },
  childMeta_religion: {
    type: String,
  },
  childMeta_managingConservator: {
    type: String,
    // required: true
  },
  childMeta_StringOfAdmission: {
    type: String,
    // required: true
  },
  projectedDateForAchievingPermanency: {
    type: String,
    //required: true
  },
  legalStatus_PermancyGoal: {
    type: String,
    //required: true
  },
  fatherMeta_name: {
    type: String,
    //required: true
  },
  fatherMeta_address: {
    type: String,
    //required: true
  },
  fatherMeta_phoneNumber: {
    type: String,
    //required: true
  },
  motherMeta_name: {
    type: String,
    //required: true
  },
  motherMeta_address: {
    type: String,
    //required: true
  },
  motherMeta_phoneNumber: {
    type: String,
    //required: true
  },
  legalStatus: {
    type: String,
    //required: true
  },
  referringAgency_co: {
    type: String,
    //required: true
  },
  agentOfReferringAgency_co_name: {
    type: String,
    //required: true
  },
  agentOfReferringAgency_co_address: {
    type: String,
    //required: true
  },
  reactionToPlacement: {
    type: String,
    //required: true
  },
  interests: {
    type: String,
    //required: true
  },
  otherMeta1_name: {
    type: String,
  },
  otherMeta1_relationship: {
    type: String,
  },
  otherMeta1_address: {
    type: String,
  },
  otherMeta1_phoneNumber: {
    type: String,
  },
  otherMeta2_name: {
    type: String,
  },
  otherMeta2_relationship: {
    type: String,
  },
  otherMeta2_address: {
    type: String,
  },
  otherMeta2_phoneNumber: {
    type: String,
  },
  otherMeta3_name: {
    type: String,
  },
  otherMeta3_relationship: {
    type: String,
  },
  otherMeta3_address: {
    type: String,
  },
  otherMeta3_phoneNumber: {
    type: String,
  },
  otherMeta4_name: {
    type: String,
  },
  otherMeta4_relationship: {
    type: String,
  },
  otherMeta4_address: {
    type: String,
  },
  otherMeta4_phoneNumber: {
    type: String,
  },
  currentMedicalInformation: {
    type: String,
    //required: true
  },
  developmental_medicalHistory: {
    type: String,
    //required: true
  },
  drugAllergies: {
    type: String,
    //required: true
  },
  food1: {
    type: String,
    //required: true
  },
  allergies: {
    type: String,
    //required: true
  },
  chronicHealth: {
    type: String,
    //required: true
  },
  healthStrengths: {
    type: String,
    //required: true
  },
  healthNeeds: {
    type: String,
    //required: true
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

  lastDentalExamination_date: {
    type: String,
  },
  lastDentalExamination_location: {
    type: String,
  },
  lastDentalExamination_monitoredBy: {
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
  currentMedications_dosages_targetedSymptoms1_medication: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms1_dosage_frequency: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms1_purpose: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms1_possibleSideEffects: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms1_monitoredBy: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms2_medication: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms2_dosage_frequency: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms2_purpose: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms2_possibleSideEffects: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms2_monitoredBy: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms3_medication: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms3_dosage_frequency: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms3_purpose: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms3_possibleSideEffects: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms3_monitoredBy: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms4_medication: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms4_dosage_frequency: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms4_purpose: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms4_possibleSideEffects: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms4_monitoredBy: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms5_medication: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms5_dosage_frequency: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms5_purpose: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms5_possibleSideEffects: {
    type: String,
  },
  currentMedications_dosages_targetedSymptoms5_monitoredBy: {
    type: String,
  },
  behavioralStrengths: {
    type: String,
    //required: true
  },
  behavioralNeeds: {
    type: String,
    //required: true
  },
  behavioralTreatmentServices: {
    type: String,
  },
  emotionalStrengths: {
    type: String,
    //required: true
  },
  emotionalNeeds: {
    type: String,
    //required: true
  },
  emotionalTreatmentServices: {
    type: String,
  },
  food2: {
    type: String,
  },
  eyeContact: {
    type: String,
  },
  physicalTouch: {
    type: String,
  },
  personalProperty: {
    type: String,
  },
  certainTopics: {
    type: String,
  },
  knownContraindicationsToTheUuseOfRestraint: {
    type: String,
  },
  de_escalatingTechniquesToAvoidRestraints_ebi: {
    type: String,
  },
  child_de_escalator: {
    type: String,
  },
  staff_de_escalator: {
    type: String,
  },
  therapist_de_escalator: {
    type: String,
  },
  childPreferred_de_escalation: {
    type: String,
  },
  interventionStrategies: {
    type: String,
  },
  supervisionStrategies: {
    type: String,
  },
  social_recreationalStrengths: {
    type: String,
  },
  social_recreationalNeeds: {
    type: String,
  },
  familyStrengths: {
    type: String,
  },
  familyNeeds: {
    type: String,
  },
  visitor1_name: {
    type: String,
  },
  visitor1_relationship: {
    type: String,
  },
  visitor1_frequency: {
    type: String,
  },
  visitor1_supervisedBy: {
    type: String,
  },
  visitor1_location: {
    type: String,
  },
  visitor1_length: {
    type: String,
  },

  visitor2_name: {
    type: String,
  },
  visitor2_relationship: {
    type: String,
  },
  visitor2_frequency: {
    type: String,
  },
  visitor2_supervisedBy: {
    type: String,
  },
  visitor2_location: {
    type: String,
  },
  visitor2_length: {
    type: String,
  },
  visitor3_name: {
    type: String,
  },
  visitor3_relationship: {
    type: String,
  },
  visitor3_frequency: {
    type: String,
  },
  visitor3_supervisedBy: {
    type: String,
  },
  visitor3_location: {
    type: String,
  },
  visitor3_length: {
    type: String,
  },
  visitor4_name: {
    type: String,
  },
  visitor4_relationship: {
    type: String,
  },
  visitor4_frequency: {
    type: String,
  },
  visitor4_supervisedBy: {
    type: String,
  },
  visitor4_location: {
    type: String,
  },
  visitor4_length: {
    type: String,
  },
  educational_vacationalStrengths: {
    type: String,
  },
  educational_vacationalNeeds: {
    type: String,
  },
  transitionalLiving: {
    type: String,
  },
  dischargePlanning: {
    type: String,
  },
  longRangeGoals: {
    type: String,
  },
  shortRangeGoals: {
    type: String,
  },
  administorSign: {
    type: String,
    //required:true
  },
  administorSignDate: {
    type: String,
  },
  treatmentDirectorSign: {
    type: String,
    //required:true
  },
  treatmentDirectorSignDate: {
    type: String,
  },
  createdBy: {
    type: String,
    required: false,
  },
  createdByName: {
    type: String,
    required: false,
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
  createDate: {
    type: Date,
    default: new Date(),
    //required:true
  },
});

module.exports = TreatmentPlan72 = mongoose.model(
  "treatmentPlan72",
  TreatmentPlan72Schema
);
