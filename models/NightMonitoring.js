const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NightMonitoringSchema = new Schema({
  date: {
    type: String,
  },
  roomNumber: {
    type: String,
  },
  timeChildAwake: {
    type: String,
  },
  timeChildReturnBed: {
    type: String,
  },
  reason: {
    type: String,
  },
  childMeta_name: {
    type: String,
  },
  signed: {
    type: Boolean,
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
  approvedSig: {
    type: Array,
  },
  createDate: {
    type: Date,
  },
  status: {
    type: String,
  },
});

module.exports = NightMonitoring = mongoose.model(
  "nightMonitoring",
  NightMonitoringSchema
);
