const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Schema
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  homeId: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  lastLogIn: {
    type: Date,
    default: new Date()
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  newUser :{
    type: Boolean,
    default: true
  }
});

module.exports = User = mongoose.model("user", UserSchema);