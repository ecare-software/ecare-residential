const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrientationTrainingModSchema = new Schema({
  T1Presenter: {
    type: String,
  },
  T2Presenter: {
    type: String,
  },
  T3Presenter: {
    type: String,
  },
  T4Presenter: {
    type: String,
  },
  T5Presenter: {
    type: String,
  },
  T6Presenter: {
    type: String,
  },
  T7Presenter: {
    type: String,
  },
  T1Title: {
    type: String,
  },
  T2Title: {
    type: String,
  },
  T3Title: {
    type: String,
  },
  T4Title: {
    type: String,
  },
  T5Title: {
    type: String,
  },
  T6Title: {
    type: String,
  },
  T7Title: {
    type: String,
  },
  T1Hours: {
    type: String,
  },
  T2Hours: {
    type: String,
  },
  T3Hours: {
    type: String,
  },
  T4Hours: {
    type: String,
  },
  T5Hours: {
    type: String,
  },
  T6Hours: {
    type: String,
  },
  T7Hours: {
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
  createDate: {
    type: Date,
    default: new Date(),
  },
});

module.exports = orientationTrainingMod = mongoose.model(
  "orientationTrainingMod",
  OrientationTrainingModSchema
);
