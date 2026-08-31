const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FirstAidCprTrainingModSchema = new Schema({
  displayName: { type: String, default: "First Aid CPR Training" },
  formType: { type: String, default: "First aid CPR Training" },
  homeId: String,
  createdBy: String,
  createdByName: String,
  createDate: { type: Date, default: Date.now },
  lastEditDate: { type: Date, default: Date.now },
}, { strict: false, minimize: false }); // strict: false allows dynamic fields, minimize: false keeps empty objects

FirstAidCprTrainingModSchema.pre('save', function(next) {
  this.lastEditDate = new Date();
  next();
});

module.exports = mongoose.model("FirstAidCprTrainingMod", FirstAidCprTrainingModSchema);
