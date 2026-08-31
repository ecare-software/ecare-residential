const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrainingAttendanceSchema = new Schema({
  trainingName: { type: String, required: true },
  trainingDate: { type: Date, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  uploadedByName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TrainingAttendance", TrainingAttendanceSchema);