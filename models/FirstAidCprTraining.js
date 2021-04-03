const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FirstAidCprTrainingSchema = new Schema({
  T1: {
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

module.exports = firstAidCprTraining = mongoose.model(
  "firstAidCprTraining",
  FirstAidCprTrainingSchema
);
