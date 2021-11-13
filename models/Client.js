const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Schema
const ClientSchema = new Schema({
  childMeta_name: {
    type: String,
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
  childMeta_levelOfCare: {
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
  drugAllergies: {
    type: String,
  },
  allergies: {
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
});

module.exports = Client = mongoose.model("client", ClientSchema);
