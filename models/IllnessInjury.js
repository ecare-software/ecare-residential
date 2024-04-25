const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IllnessInjurySchema = new Schema({
  childMeta_name: {
    type: String,
    required: false,
  },
  dateTimeOccur: {
    type: String,
    required: false,
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
    required: false,
  },
  initialResponse: {
    type: String,
    required: false,
  },
  tempTaken: {
    type: String,
    required: false,
  },
  tempMethodTaken: {
    type: String,
  },
  tempInitialReading: {
    type: String,
  },
  supervisorNotified: {
    type: String,
    required: false,
  },
  notifiedAt: {
    type: String,
    required: false,
  },
  notifiedBy: {
    type: String,
    required: false,
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
    required: false,
  },
  approvedSig: {
    type: Array,
    required: false,
  },

  approved_alt1: {
    type: Boolean,
    default: false,
  },
  approvedBy_alt1: {
    type: String,
    required: false,
  },
  approvedByName_alt1: {
    type: String,
    required: false,
  },
  approvedByDate_alt1: {
    type: Date,
    required: false,
  },
  approvedSig_alt1: {
    type: Array,
    required: false,
  },

  approvedNurse: {
    type: Boolean,
    default: false,
  },
  approvedByNurse: {
    type: String,
    required: false,
  },
  approvedByNameNurse: {
    type: String,
    required: false,
  },
  approvedByDateNurse: {
    type: Date,
    required: false,
  },
  approvedNurseSig: {
    type: Array,
    required: false,
  },

  createDate: {
    type: Date,
  },
  clientId: {
    type: String,
  },
  status: {
    type: String,
  },
});

module.exports = IllnessInjury = mongoose.model(
  "illnessInjury",
  IllnessInjurySchema
);
