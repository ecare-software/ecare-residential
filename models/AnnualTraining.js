const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CertificateSchema = new Schema(
  {
    fileName: String,
    fileUrl: String,
    mimeType: String,
    uploadedAt: Date,
  },
  { _id: false }
);

const AnnualTrainingSchema = new Schema({
  T1: {
    type: String,
  },
  T2: {
    type: String,
  },
  T3: {
    type: String,
  },
  T4: {
    type: String,
  },
  T5: {
    type: String,
  },
  T6: {
    type: String,
  },
  T7: {
    type: String,
  },
  T8: {
    type: String,
  },
  T9: {
    type: String,
  },
  T10: {
    type: String,
  },
  T11: {
    type: String,
  },
  T12: {
    type: String,
  },
  T13: {
    type: String,
  },
  T14: {
    type: String,
  },
  T15: {
    type: String,
  },
  T16: {
    type: String,
  },
  T17: {
    type: String,
  },
  T18: {
    type: String,
  },
  T19: {
    type: String,
  },
  T20: {
    type: String,
  },
  T21: {
    type: String,
  },
  T22: {
    type: String,
  },
  T23: {
    type: String,
  },
  T24: {
    type: String,
  },
  T25: {
    type: String,
  },
  T26: {
    type: String,
  },
  T27: {
    type: String,
  },
  T28: {
    type: String,
  },
  T29: {
    type: String,
  },
  T30: {
    type: String,
  },
  T31: {
    type: String,
  },
  T32: {
    type: String,
  },

  // Expiration dates
  T1Expiration: { type: String, default: "" },
  T2Expiration: { type: String, default: "" },
  T3Expiration: { type: String, default: "" },
  T4Expiration: { type: String, default: "" },
  T5Expiration: { type: String, default: "" },
  T6Expiration: { type: String, default: "" },
  T7Expiration: { type: String, default: "" },
  T8Expiration: { type: String, default: "" },
  T9Expiration: { type: String, default: "" },
  T10Expiration: { type: String, default: "" },
  T11Expiration: { type: String, default: "" },
  T12Expiration: { type: String, default: "" },
  T13Expiration: { type: String, default: "" },
  T14Expiration: { type: String, default: "" },
  T15Expiration: { type: String, default: "" },
  T16Expiration: { type: String, default: "" },
  T17Expiration: { type: String, default: "" },
  T18Expiration: { type: String, default: "" },
  T19Expiration: { type: String, default: "" },
  T20Expiration: { type: String, default: "" },
  T21Expiration: { type: String, default: "" },
  T22Expiration: { type: String, default: "" },
  T23Expiration: { type: String, default: "" },
  T24Expiration: { type: String, default: "" },
  T25Expiration: { type: String, default: "" },
  T26Expiration: { type: String, default: "" },
  T27Expiration: { type: String, default: "" },
  T28Expiration: { type: String, default: "" },
  T29Expiration: { type: String, default: "" },
  T30Expiration: { type: String, default: "" },
  T31Expiration: { type: String, default: "" },
  T32Expiration: { type: String, default: "" },

  // Certificates
  T1Certificate: { type: CertificateSchema, default: null },
  T2Certificate: { type: CertificateSchema, default: null },
  T3Certificate: { type: CertificateSchema, default: null },
  T4Certificate: { type: CertificateSchema, default: null },
  T5Certificate: { type: CertificateSchema, default: null },
  T6Certificate: { type: CertificateSchema, default: null },
  T7Certificate: { type: CertificateSchema, default: null },
  T8Certificate: { type: CertificateSchema, default: null },
  T9Certificate: { type: CertificateSchema, default: null },
  T10Certificate: { type: CertificateSchema, default: null },
  T11Certificate: { type: CertificateSchema, default: null },
  T12Certificate: { type: CertificateSchema, default: null },
  T13Certificate: { type: CertificateSchema, default: null },
  T14Certificate: { type: CertificateSchema, default: null },
  T15Certificate: { type: CertificateSchema, default: null },
  T16Certificate: { type: CertificateSchema, default: null },
  T17Certificate: { type: CertificateSchema, default: null },
  T18Certificate: { type: CertificateSchema, default: null },
  T19Certificate: { type: CertificateSchema, default: null },
  T20Certificate: { type: CertificateSchema, default: null },
  T21Certificate: { type: CertificateSchema, default: null },
  T22Certificate: { type: CertificateSchema, default: null },
  T23Certificate: { type: CertificateSchema, default: null },
  T24Certificate: { type: CertificateSchema, default: null },
  T25Certificate: { type: CertificateSchema, default: null },
  T26Certificate: { type: CertificateSchema, default: null },
  T27Certificate: { type: CertificateSchema, default: null },
  T28Certificate: { type: CertificateSchema, default: null },
  T29Certificate: { type: CertificateSchema, default: null },
  T30Certificate: { type: CertificateSchema, default: null },
  T31Certificate: { type: CertificateSchema, default: null },
  T32Certificate: { type: CertificateSchema, default: null },

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
  createDate: {
    type: Date,
    default: new Date(),
  },
  clientId: {
    type: String,
  },
});

module.exports = annualTraining = mongoose.model(
  "annualTraining",
  AnnualTrainingSchema
);
