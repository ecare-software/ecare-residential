const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SearchLogSchema = new Schema({
  childMeta_name: {
    type: String,
  },
  clientId: {
    type: String,
  },
  // datetime-local value ("YYYY-MM-DDTHH:mm") - when the search happened,
  // which can differ from createDate (when the record was entered).
  searchDateTime: {
    type: String,
  },
  location: {
    type: String,
  },
  reason: {
    type: String,
  },
  // Free text, prefilled with the submitting user's name - the staff member
  // who conducted the search isn't always the one entering it.
  // createdBy/createdByName remain the audit record of who submitted it.
  staffConducting: {
    type: String,
  },
  itemsFound: {
    type: String,
  },
  // What was done with anything found (returned, confiscated, disposed of,
  // turned over to law enforcement, ...).
  disposition: {
    type: String,
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

module.exports = SearchLog = mongoose.model("searchLog", SearchLogSchema);
