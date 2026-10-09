const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MedicationDestructionSchema = new Schema({
  childMeta_name: {
    type: String,
  },
  clientId: {
    type: String,
  },
  medicationName: {
    type: String,
  },
  // Free text so it can carry units ("12 tablets", "30 mL").
  quantity: {
    type: String,
  },
  // One of DESTRUCTION_METHODS in routes/api/medicationDestruction.js;
  // "Other" requires destructionMethodOther.
  destructionMethod: {
    type: String,
  },
  destructionMethodOther: {
    type: String,
  },
  // date input value ("YYYY-MM-DD") - when the medication was destroyed.
  destructionDate: {
    type: String,
  },
  // Witness 1: the staff member who submits the form, signed by
  // submitting it while logged in.
  witness1Id: {
    type: String,
  },
  witness1Name: {
    type: String,
  },
  witness1SignedAt: {
    type: Date,
  },
  // A copy of the witness's profile signature taken at the moment they
  // signed (react-signature-canvas point data), so a later change to their
  // profile signature can't alter this record.
  witness1Sig: {
    type: Array,
    default: [],
  },
  // Witness 2: chosen by witness 1 from the home's staff, signed
  // only when that user logs in and co-signs (POST /:homeId/:formId/cosign).
  witness2Id: {
    type: String,
  },
  witness2Name: {
    type: String,
  },
  witness2SignedAt: {
    type: Date,
  },
  // A copy of the witness's profile signature taken at the moment they
  // signed (react-signature-canvas point data), so a later change to their
  // profile signature can't alter this record.
  witness2Sig: {
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
  // IN PROGRESS (draft) -> AWAITING WITNESS (witness 1 submitted) ->
  // COMPLETED (witness 2 co-signed).
  status: {
    type: String,
  },
});

module.exports = MedicationDestruction = mongoose.model(
  "medicationDestruction",
  MedicationDestructionSchema
);
