const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BodyCheckSchema = new Schema({
  childMeta_name: {
    type: String,
    required: false,
  },
  childMeta_gender: {
    type: String,
  },
  injury: {
    type: String,
    required: false,
  },
  amPm: {
    type: String,
    required: false,
  },

  examiner_name: {
    type: String,
    required: false,
  },
  examiner_title: {
    type: String,
    required: false,
  },
  examin_date: {
    type: String,
  },
  nurse_designee_name: {
    type: String,
    required: false,
  },
  nurse_designee_title: {
    type: String,
    required: false,
  },
  nurse_designee_date: {
    type: String,
  },

  head: {
    type: Number,
  },
  face: {
    type: Number,
  },
  left_ear: {
    type: Number,
  },
  right_ear: {
    type: Number,
  },
  left_eye: {
    type: Number,
  },
  right_eye: {
    type: Number,
  },
  nose: {
    type: Number,
  },
  mouth: {
    type: Number,
  },
  chin: {
    type: Number,
  },
  neck: {
    type: Number,
  },
  left_shoulder: {
    type: Number,
  },
  right_shoulder: {
    type: Number,
  },
  left_arm: {
    type: Number,
  },
  right_arm: {
    type: Number,
  },
  left_hand: {
    type: Number,
  },
  right_hand: {
    type: Number,
  },
  chest: {
    type: Number,
  },
  back: {
    type: Number,
  },
  stomach: {
    type: Number,
  },
  left_hip: {
    type: Number,
  },
  right_hip: {
    type: Number,
  },
  left_leg: {
    type: Number,
  },
  right_leg: {
    type: Number,
  },
  left_knee: {
    type: Number,
  },
  right_knee: {
    type: Number,
  },
  left_ankle: {
    type: Number,
  },
  right_ankle: {
    type: Number,
  },
  left_foot: {
    type: Number,
  },
  right_foot: {
    type: Number,
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
  approvedSig: {
    type: Array,
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
  },
  approvedNurseSig: {
    type: Array,
  },

  createDate: {
    type: Date,
    default: new Date(),
  },
  clientId: {
    type: String,
  },
  status: {
    type: String,
  },
});

module.exports = BodyCheck = mongoose.model("bodyCheck", BodyCheckSchema);
