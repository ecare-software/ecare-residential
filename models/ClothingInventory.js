const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// One row of the clothing table. Counts are nullable - a blank cell on the
// paper form means "not counted", which is different from a counted 0.
// total is always server-computed (see computeClothingTotal in
// routes/api/clothingInventory.js), never taken from the request.
const ClothingItemSchema = new Schema(
  {
    key: { type: String },
    item: { type: String },
    // "main" | "seasonal" | "other" - "other" rows have a staff-entered
    // item name (the blank lines under OTHER on the paper form).
    category: { type: String },
    startCount: { type: Number, default: null },
    newCount: { type: Number, default: null },
    usedCount: { type: Number, default: null },
    willNotFit: { type: Number, default: null },
    lost: { type: Number, default: null },
    destroyed: { type: Number, default: null },
    total: { type: Number, default: null },
  },
  { _id: false }
);

const HygieneItemSchema = new Schema(
  {
    key: { type: String },
    item: { type: String },
    custom: { type: Boolean, default: false },
    // "have" | "almostOut" | "need" | ""
    status: { type: String, default: "" },
  },
  { _id: false }
);

// The paper form has two client signature lines. The child signs on the
// form itself, so unlike staff signatures (a live stamp of the submitting
// user's profile signature - see utils/requireUserSignature.js) these are
// persisted with the record as react-signature-canvas point data.
const ClientSignatureSchema = new Schema(
  {
    sig: { type: Array, default: [] },
    date: { type: String, default: "" },
  },
  { _id: false }
);

const ClothingInventorySchema = new Schema({
  childMeta_name: {
    type: String,
  },
  clientId: {
    type: String,
  },
  // "YYYY-MM"
  monthOf: {
    type: String,
  },
  // "YYYY-MM-DD"
  inventoryDate: {
    type: String,
  },
  clothingItems: {
    type: [ClothingItemSchema],
    default: [],
  },
  hygieneItems: {
    type: [HygieneItemSchema],
    default: [],
  },
  clientSignatures: {
    type: [ClientSignatureSchema],
    default: [],
  },
  notes: {
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

module.exports = ClothingInventory = mongoose.model(
  "clothingInventory",
  ClothingInventorySchema
);
