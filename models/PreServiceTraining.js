const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PreServiceTrainingSchema = new Schema({
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
  "preServiceTraining",
  PreServiceTrainingSchema
);
