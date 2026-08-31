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

const FirstAidCprTrainingSchema = new Schema({
  T1: { type: String, default: "" },
  T1Expiration: { type: String, default: "" },
  T1Certificate: { type: CertificateSchema, default: null },

  customEntries: [
    {
      id: { type: Number, required: true },
      hours: { type: String, default: "" },
      title: { type: String, default: "" },
      presenter: { type: String, default: "" },
      completed: { type: Date, default: null },
      expiration: { type: String, default: "" },
      certificate: { type: CertificateSchema, default: null },
    },
  ],

  createdBy: String,
  createdByName: String,
  lastEditDate: Date,
  homeId: String,
  formType: String,
  createDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FirstAidCprTraining", FirstAidCprTrainingSchema);
