const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FirstAidCprTrainingModSchema = new Schema({
  T1Presenter: {
    type: String,
  },
  T1Title: {
    type: String,
  },
  T1Hours: {
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

module.exports = firstAidCprTrainingMod = mongoose.model(
  "firstAidCprTrainingMod",
  FirstAidCprTrainingModSchema
);
