const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Schema
const DirectMessageSchema = new Schema({
  to: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});


module.exports  = User = mongoose.model('directMessage',DirectMessageSchema);