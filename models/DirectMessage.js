const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Schema
const DirectMessageSchema = new Schema({
  toObj: {
    type: Object,
    required: true,
  },
  fromObj: {
    type: Object,
    required: true,
  },
  toID: {
    type: String,
    required: true,
  },
  fromID: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  homeId: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    default: new Date(),
    //required:true
  },
});

module.exports = User = mongoose.model("directMessage", DirectMessageSchema);
