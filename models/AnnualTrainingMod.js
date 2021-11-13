const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnnualTrainingModSchema = new Schema({
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
  T13Hours: {
    type: String,
  },
  T14Hours: {
    type: String,
  },
  T15Hours: {
    type: String,
  },
  T16Hours: {
    type: String,
  },
  T17Hours: {
    type: String,
  },
  T18Hours: {
    type: String,
  },
  T19Hours: {
    type: String,
  },
  T20Hours: {
    type: String,
  },
  T21Hours: {
    type: String,
  },
  T22Hours: {
    type: String,
  },
  T23Hours: {
    type: String,
  },
  T24Hours: {
    type: String,
  },
  T25Hours: {
    type: String,
  },
  T26Hours: {
    type: String,
  },
  T27Hours: {
    type: String,
  },
  T28Hours: {
    type: String,
  },
  T29Hours: {
    type: String,
  },
  T30Hours: {
    type: String,
  },
  T31Hours: {
    type: String,
  },
  T32Hours: {
    type: String,
  },
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
  T13Presenter: {
    type: String,
  },
  T14Presenter: {
    type: String,
  },
  T15Presenter: {
    type: String,
  },
  T16Presenter: {
    type: String,
  },
  T17Presenter: {
    type: String,
  },
  T18Presenter: {
    type: String,
  },
  T19Presenter: {
    type: String,
  },
  T20Presenter: {
    type: String,
  },
  T21Presenter: {
    type: String,
  },
  T22Presenter: {
    type: String,
  },
  T23Presenter: {
    type: String,
  },
  T24Presenter: {
    type: String,
  },
  T25Presenter: {
    type: String,
  },
  T26Presenter: {
    type: String,
  },
  T27Presenter: {
    type: String,
  },
  T28Presenter: {
    type: String,
  },
  T29Presenter: {
    type: String,
  },
  T30Presenter: {
    type: String,
  },
  T31Presenter: {
    type: String,
  },
  T32Presenter: {
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
  T13Title: {
    type: String,
  },
  T14Title: {
    type: String,
  },
  T15Title: {
    type: String,
  },
  T16Title: {
    type: String,
  },
  T17Title: {
    type: String,
  },
  T18Title: {
    type: String,
  },
  T19Title: {
    type: String,
  },
  T20Title: {
    type: String,
  },
  T21Title: {
    type: String,
  },
  T22Title: {
    type: String,
  },
  T23Title: {
    type: String,
  },
  T24Title: {
    type: String,
  },
  T25Title: {
    type: String,
  },
  T26Title: {
    type: String,
  },
  T27Title: {
    type: String,
  },
  T28Title: {
    type: String,
  },
  T29Title: {
    type: String,
  },
  T30Title: {
    type: String,
  },
  T31Title: {
    type: String,
  },
  T32Title: {
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

module.exports = annualTrainingMod = mongoose.model(
  "annualTrainingMod",
  AnnualTrainingModSchema
);
