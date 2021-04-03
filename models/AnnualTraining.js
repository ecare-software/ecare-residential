const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnnualTrainingSchema = new Schema({
  T1: {
    type: String,
  },
  T2: {
    type: String,
  },
  T3: {
    type: String,
  },
  T4: {
    type: String,
  },
  T5: {
    type: String,
  },
  T6: {
    type: String,
  },
  T7: {
    type: String,
  },
  T8: {
    type: String,
  },
  T9: {
    type: String,
  },
  T10: {
    type: String,
  },
  T11: {
    type: String,
  },
  T12: {
    type: String,
  },
  T13: {
    type: String,
  },
  T14: {
    type: String,
  },
  T15: {
    type: String,
  },
  T16: {
    type: String,
  },
  T17: {
    type: String,
  },
  T18: {
    type: String,
  },
  T19: {
    type: String,
  },
  T20: {
    type: String,
  },
  T21: {
    type: String,
  },
  T22: {
    type: String,
  },
  T23: {
    type: String,
  },
  T24: {
    type: String,
  },
  T25: {
    type: String,
  },
  T26: {
    type: String,
  },
  T27: {
    type: String,
  },
  T28: {
    type: String,
  },
  T29: {
    type: String,
  },
  T30: {
    type: String,
  },
  T31: {
    type: String,
  },
  T32: {
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
  },
  formType: {
    type: String,
  },
  homeId: {
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
  },
  createDate: {
    type: Date,
    default: new Date(),
  },
  clientId: {
    type: String,
  },
});

module.exports = annualTraining = mongoose.model(
  "annualTraining",
  AnnualTrainingSchema
);
