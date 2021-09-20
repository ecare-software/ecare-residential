const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IllnessInjurySchema = new Schema({
  childMeta_name: {
    type: String,
    required: false,
  },
  dateTimeOccur: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: false,
  },
  createdByName: {
    type: String,
    required: false,
  },
  illnessInjury: {
    type: String,
    required: true,
  },
  initialResponse: {
    type: String,
    required: true,
  },
  tempTaken: {
    type: String,
    required: true,
  },
  tempMethodTaken: {
    type: String,
  },
  tempInitialReading: {
    type: String,
  },
  supervisorNotified: {
    type: String,
    required: true,
  },
  notifiedAt: {
    type: String,
    required: true,
  },
  notifiedBy: {
    type: String,
    required: true,
  },
  adminFollowUp: {
    type: String,
  },
  lastMedicationGiven: {
    type: String,
  },
  otherActionsTreatment: {
    type: String,
  },
  treatmentAuthBy: {
    type: String,
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
  },
  approvedSig: {
    type: Array,
  },
  createDate: {
    type: Date,
    default: new Date(),
  },
  clientId: {
    type: String,
  },
});

module.exports = IllnessInjury = mongoose.model(
  "illnessInjury",
  IllnessInjurySchema
);
