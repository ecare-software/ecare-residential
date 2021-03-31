const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PreServiceTrainingModSchema = new Schema({
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
  T8Presenter: {
    type: String,
  },
  T9Presenter: {
    type: String,
  },
  T10Presenter: {
    type: String,
  },
  T11Presenter: {
    type: String,
  },
  T12Presenter: {
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
  T8Title: {
    type: String,
  },
  T9Title: {
    type: String,
  },
  T10Title: {
    type: String,
  },
  T11Title: {
    type: String,
  },
  T12Title: {
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
  T8Hours: {
    type: String,
  },
  T9Hours: {
    type: String,
  },
  T10Hours: {
    type: String,
  },
  T11Hours: {
    type: String,
  },
  T12Hours: {
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
});

module.exports = orientationTraining = mongoose.model(
  "preServiceTrainingMod",
  PreServiceTrainingModSchema
);
