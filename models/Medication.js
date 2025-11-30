const mongoose = require("mongoose");

const caregiverSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  signature: { type: mongoose.Schema.Types.Mixed, default: "" },
  date: { type: Date, default: Date.now },
  initials: { type: String, default: "" },
  title: { type: String, default: "" },
});

const dailyLogEntrySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  time: { type: String, default: "" },
  initials: { type: String, default: "" },
  amountRemaining: { type: String, default: "" },
});

const logTableSchema = new mongoose.Schema({
  entries: { type: [dailyLogEntrySchema], default: [] },
});

const singleMedicationSchema = new mongoose.Schema({
  medicationId: { type: String },       
  name: { type: String, default: "" },  
  dosage: { type: String, default: "" },
  strength: { type: String, default: "" },
  frequency: { type: String, default: "" },      
  otherFrequency: { type: String, default: "" },  
  reasonPrescribed: { type: String, default: "" },
  prnReasonDetails: { type: String, default: "" },

  logTable: { type: logTableSchema, default: () => ({}) },
});

const medicationLogSchema = new mongoose.Schema({
  createDate: { type: Date, default: Date.now },
  homeId: { type: String },

  child: {
    childId: { type: String },
    name: { type: String, required: true },
  },
  childMeta_name: { type: String, default: "" },

  unit: { type: String, default: "" },
  monthYear: { type: String, default: "" },

  allergiesOrContraindications: { type: String, default: "" },
  childRefusal: { type: String, default: "" },
  prescriberName: { type: String, default: "" },
  prescriberPhone: { type: String, default: "" },
  pharmacyName: { type: String, default: "" },
  pharmacyPhone: { type: String, default: "" },

  medications: { type: [singleMedicationSchema], default: [] },

  caregivers: { type: [caregiverSchema], default: [] },

  formType: { type: String, default: "Medication Log" },
  createdBy: { type: String, required: true },
  createdByName: { type: String, default: "" },
  approved: { type: Boolean, default: false },
  status: { type: String, default: "IN_PROGRESS" },
  lastEditDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MedicationLog", medicationLogSchema);