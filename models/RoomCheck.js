const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomCheckSchema = new Schema({
  childMeta_name: {
    type: String,
  },
  clientId: {
    type: String,
  },
  roomUnit: {
    type: String,
  },
  // datetime-local value ("YYYY-MM-DDTHH:mm") - when the check happened,
  // which can differ from createDate (when the record was entered).
  checkDateTime: {
    type: String,
  },
  // Free text, prefilled with the submitting user's name - the staff member
  // who physically did the check isn't always the one entering it.
  // createdBy/createdByName remain the audit record of who submitted it.
  checkedBy: {
    type: String,
  },
  findings: {
    type: String,
  },
  followUpNeeded: {
    type: Boolean,
    default: false,
  },
  // The child signs on the form itself, so unlike staff signatures (a live
  // stamp of the submitting user's profile signature - see
  // utils/requireUserSignature.js) this is persisted with the record as
  // react-signature-canvas point data.
  childSignature: {
    type: Array,
    default: [],
  },

  createdBy: {
    type: String,
  },
  // The author's immutable User._id - ownership should key on this, not
  // createdBy (an editable email). See routes/api/SeriousIncidentReport.js.
  createdById: {
    type: String,
  },
  createdByName: {
    type: String,
  },
  lastEditDate: {
    type: Date,
    default: Date.now,
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
  },
  approvedByName: {
    type: String,
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
  // See models/BodyCheck.js - maintained by utils/applyCreateDateEdit.js.
  originalCreateDate: {
    type: Date,
  },
  createDateEditedBy: {
    type: String,
  },
  createDateEditedAt: {
    type: Date,
  },
  status: {
    type: String,
  },
});

module.exports = RoomCheck = mongoose.model("roomCheck", RoomCheckSchema);
