const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AwakeNightStaffSignoffSchema = new Schema({
  ts1Approval: { type: Boolean, default: false },
  ts2Approval: { type: Boolean, default: false },
  ts3Approval: { type: Boolean, default: false },
  ts4Approval: { type: Boolean, default: false },
  ts5Approval: { type: Boolean, default: false },
  ts6Approval: { type: Boolean, default: false },
  ts7Approval: { type: Boolean, default: false },
  ts8Approval: { type: Boolean, default: false },
  ts9Approval: { type: Boolean, default: false },
  ts10Approval: { type: Boolean, default: false },
  ts11Approval: { type: Boolean, default: false },
  ts12Approval: { type: Boolean, default: false },
  ts13Approval: { type: Boolean, default: false },
  ts14Approval: { type: Boolean, default: false },
  ts15Approval: { type: Boolean, default: false },
  ts16Approval: { type: Boolean, default: false },
  ts17Approval: { type: Boolean, default: false },
  ts18Approval: { type: Boolean, default: false },
  ts19Approval: { type: Boolean, default: false },
  ts20Approval: { type: Boolean, default: false },
  ts21Approval: { type: Boolean, default: false },
  ts22Approval: { type: Boolean, default: false },
  ts23Approval: { type: Boolean, default: false },
  ts24Approval: { type: Boolean, default: false },
  ts25Approval: { type: Boolean, default: false },
  ts26Approval: { type: Boolean, default: false },
  ts27Approval: { type: Boolean, default: false },
  ts28Approval: { type: Boolean, default: false },
  ts29Approval: { type: Boolean, default: false },
  ts30Approval: { type: Boolean, default: false },
  ts31Approval: { type: Boolean, default: false },
  ts32Approval: { type: Boolean, default: false },
  ts33Approval: { type: Boolean, default: false },
  ts34Approval: { type: Boolean, default: false },
  ts35Approval: { type: Boolean, default: false },
  ts36Approval: { type: Boolean, default: false },
  ts37Approval: { type: Boolean, default: false },
  ts38Approval: { type: Boolean, default: false },
  ts39Approval: { type: Boolean, default: false },
  ts40Approval: { type: Boolean, default: false },
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
  approvedSig: {
    type: Array,
  },
  createDate: {
    type: Date,
    default: new Date(),
  },
});

module.exports = AwakeNightStaffSignoff = mongoose.model(
  "awakeNightStaffSignoff",
  AwakeNightStaffSignoffSchema
);
