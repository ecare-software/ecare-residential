const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DailyProgressAndActivitySchema = new Schema({
  childMeta_name: {
    type: String,
    required: false,
  },
  personal_hygiene: {
    type: String,
    required: false,
  },
  dressing: {
    type: String,
    required: false,
  },
  table_mannders: {
    type: String,
    required: false,
  },
  clothes_maintenace: {
    type: String,
    required: false,
  },
  self_feeding: {
    type: String,
    required: false,
  },
  care_of_property: {
    type: String,
    required: false,
  },
  maintenace_of_personal_space: {
    type: String,
    required: false,
  },
  household_chorse: {
    type: String,
    required: false,
  },
  informal_counseling: {
    type: String,
    required: false,
  },
  verbal_redirection: {
    type: String,
    required: false,
  },
  modeling: {
    type: String,
    required: false,
  },
  supervised_separation: {
    type: String,
    required: false,
  },
  provider_feedback_to_client: {
    type: String,
    required: false,
  },
  positive_reinforcement: {
    type: String,
    required: false,
  },
  other: {
    type: String,
    required: false,
  },
  home_restrictions: {
    type: String,
    required: false,
  },
  restricted_leisure_activity: {
    type: String,
    required: false,
  },
  no_allowance: {
    type: String,
    required: false,
  },
  other2: {
    type: String,
    required: false,
  },
  no_of_home_incidents: {
    type: String,
    required: false,
  },
  no_of_home_serious_incidents: {
    type: String,
    required: false,
  },
  no_of_home_restraints: {
    type: String,
    required: false,
  },
  no_of_school_incidents: {
    type: String,
    required: false,
  },
  no_of_school_restraints: {
    type: String,
    required: false,
  },
  illness_injury: {
    type: String,
    required: false,
  },
  level_of_supervison: {
    type: String,
    required: false,
  },
  summary_of_daily_schedule: {
    type: String,
    required: false,
  },
  summary_of_behavior_at_school: {
    type: String,
    required: false,
  },
  summary_of_behavior_at_home: {
    type: String,
    required: false,
  },
  therapeutic_recreational: {
    type: String,
    required: false,
  },
  therapeutic_value: {
    type: String,
    required: false,
  },
  phone_calls_or_visits: {
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
    //required:true
  },
  createDate: {
    type: Date,
    default: new Date(),
    //required:true
  },
});

module.exports = DailyProgressAndActivity = mongoose.model(
  "dailyProgressAndActivity",
  DailyProgressAndActivitySchema
);
