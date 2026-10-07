const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClientRefusalSchema = new Schema({
  childMeta_name: {
    type: String,
  },
  clientId: {
    type: String,
  },
  // What the child refused (medication, meal, appointment, school, chore,
  // hygiene, ...).
  refusedItem: {
    type: String,
  },
  // datetime-local value ("YYYY-MM-DDTHH:mm") - when the refusal happened,
  // which can differ from createDate (when the record was entered).
  refusalDateTime: {
    type: String,
  },
  reason: {
    type: String,
  },
  // Free text, prefilled with the submitting user's name - the staff member
  // who witnessed/documented the refusal isn't always the one entering it.
  // createdBy/createdByName remain the audit record of who submitted it.
  staffDocumenting: {
    type: String,
  },
  followUpAction: {
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
  // Who made the most recent change (see utils/formIntegrity.js) -
  // createdBy* stays the original author.
  lastEditedBy: {
    type: String,
  },
  lastEditedById: {
    type: String,
  },
  lastEditedByName: {
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

module.exports = ClientRefusal = mongoose.model("clientRefusal", ClientRefusalSchema);
