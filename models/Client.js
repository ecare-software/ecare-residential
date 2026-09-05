const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Schema
const ClientSchema = new Schema({
  childMeta_name: {
    type: String,
  },
  childMeta_photo: {
    type: String
  },
  childMeta_gender: {
    type: String,
  },
  childMeta_dob: {
    type: String,
  },
  childMeta_age: {
    type: Number,
  },
  childMeta_religion: {
    type: String,
  },
  childMeta_ethnicity: {
    type: String,
  },
  childMeta_dateOfAdmission: {
    type: String,
  },
  childMeta_dischargeDate: {
    type: String,
  },
  childMeta_typeOfStay: {
    type: String,
  },
  childMeta_medicaidNumber: {
    type: String,
  },
  childMeta_cpsNumber: {
    type: String,
  },
  childMeta_ssn: {
    type: Number,
  },
  childMeta_caseWorker: {
    type: String,
  },
  childMeta_caseWorkerPONumber: {
    type: String,
  },
  childMeta_referralAgency: {
    type: String,
  },
  childMeta_referralDate: {
    type: String,
  },
  childMeta_levelOfCare: {
    type: String,
  },
  childMeta_levelOfCareOther: {
    type: String,
  },
  childMeta_region: {
    type: String,
  },
  childMeta_county: {
    type: String,
  },
  childMeta_streetAddress: {
    type: String,
  },
  childMeta_state: {
    type: String,
  },
  childMeta_city: {
    type: String,
  },
  childMeta_zipcode: {
    type: String,
  },
  childMeta_placeOfBirth_streetAddress: {
    type: String,
  },
  childMeta_placeOfBirth_state: {
    type: String,
  },
  childMeta_placeOfBirth_city: {
    type: String,
  },
  childMeta_placeOfBirth_zipcode: {
    type: String,
  },
  food1: {
    type: String,
  },
  noFoodAllergies: {
    type: Boolean,
    default: false,
  },
  drugAllergies: {
    type: String,
  },
  noDrugAllergies: {
    type: Boolean,
    default: false,
  },
  allergies: {
    type: String,
  },
  noKnownAllergies: {
    type: Boolean,
    default: false,
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
  lastEditDate: {
    type: Date,
    default: new Date(),
  },
  createDate: {
    type: Date,
    default: new Date(),
  },
  homeId: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = Client = mongoose.model("client", ClientSchema);
