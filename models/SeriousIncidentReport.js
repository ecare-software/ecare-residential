const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeriousIncidentReportSchema = new Schema({
  childMeta_name: {
    type: String,
  },
  childMeta_gender: {
    type: String,
  },
  childMeta_dob: {
    type: String,
  },
  childMeta_dateOfAdmission: {
    type: String,
  },
  dateOfIncident: {
    type: String,
  },
  staff_involved_name: {
    type: String,
  },
  staff_involved_gender: {
    type: String,
  },

  time_of_incident: {
    type: String,
  },
  staff_witness_name: {
    type: String,
  },
  staff_witness_gender: {
    type: String,
  },
  client_witness_name1: {
    type: String,
  },
  client_witness_gender1: {
    type: String,
  },
  client_witness_dob1: {
    type: String,
  },
  client_witness_doa1: {
    type: String,
  },
  client_witness_name2: {
    type: String,
  },
  client_witness_gender2: {
    type: String,
  },
  client_witness_dob2: {
    type: String,
  },
  client_witness_doa2: {
    type: String,
  },
  incident_explaination: {
    type: String,
  },
  seperation: {
    type: String,
  },
  result: {
    type: String,
  },
  able_to_prevent: {
    type: String,
  },
  follow_up_results: {
    type: String,
  },
  notification_made_to: {
    type: String,
  },
  notification_made_date_time: {
    type: String,
  },
  notification_made_by: {
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
  createDate: {
    type: Date,
    default: new Date(),
  },
  clientId: {
    type: String,
  },
});

module.exports = SeriousIncidentReport = mongoose.model(
  "seriousIncidentReport",
  SeriousIncidentReportSchema
);
