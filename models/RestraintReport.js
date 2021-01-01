const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestraintReportSchema = new Schema({
  childMeta_name: {
    type: String,
    required: false,
  },
  childMeta_gender: {
    type: String,
    required: false,
  },
  childMeta_dob: {
    type: String,
    required: false,
  },
  childMeta_dateOfAdmission: {
    type: String,
    required: false,
  },
  date_of_incident: {
    type: String,
    required: false,
  },
  staff_involved_name: {
    type: String,
    required: false,
  },
  staff_involved_gender: {
    type: String,
    required: false,
  },
  time_of_incident: {
    type: String,
    required: false,
  },
  staff_witness_name: {
    type: String,
    required: false,
  },
  staff_witness_gender: {
    type: String,
    required: false,
  },
  staff_witness_name: {
    type: String,
    required: false,
  },

  staff_witness_gender: {
    type: String,
    required: false,
  },

  client_witness_name1: {
    type: String,
    required: false,
  },

  client_witness_gender1: {
    type: String,
    required: false,
  },

  client_witness_dob1: {
    type: String,
    required: false,
  },

  client_witness_doa1: {
    type: String,
    required: false,
  },

  client_witness_name2: {
    type: String,
    required: false,
  },

  client_witness_gender2: {
    type: String,
    required: false,
  },

  client_witness_dob2: {
    type: String,
    required: false,
  },

  client_witness_doa2: {
    type: String,
    required: false,
  },

  risk_explaination: {
    type: String,
    required: false,
  },

  risk_alternative_strategies: {
    type: String,
    required: false,
  },

  type_of_restraint: {
    type: String,
    required: false,
  },

  risk_stategies_used: {
    type: String,
    required: false,
  },

  result_of_incident: {
    type: String,
    required: false,
  },

  injuries: {
    type: String,
    required: false,
  },

  action_taken: {
    type: String,
    required: false,
  },

  able_to_prevent: {
    type: String,
    required: false,
  },

  restraint_start_time: {
    type: String,
    required: false,
  },

  restraint_end_time: {
    type: String,
    required: false,
  },

  notification_made_to: {
    type: String,
    required: false,
  },

  notification_made_date_time: {
    type: String,
    required: false,
  },

  interviewer: {
    type: String,
    required: false,
  },

  date_of_interview: {
    type: String,
    required: false,
  },

  client_behavior: {
    type: String,
    required: false,
  },

  client_restraint_description: {
    type: String,
    required: false,
  },

  client_responce: {
    type: String,
    required: false,
  },

  procedural_approved_reason: {
    type: String,
    required: false,
  },

  procedural_approved_standards: {
    type: String,
    required: false,
  },

  procedural_any_injuries: {
    type: String,
    required: false,
  },

  procedural_comments: {
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
  lastEditDate: {
    type: Date,
    default: new Date(),
    //required:true
  },
  homeId: {
    type: String,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  formType: {
    type: String,
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
    //required:true
  },
});

module.exports = RestraintReport = mongoose.model(
  "restraintReport",
  RestraintReportSchema
);
