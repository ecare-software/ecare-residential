const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Schema
const DiscussionMessageSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  homeId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  createDate: {
    type: Date,
    // Date.now (a function), not new Date() - the latter is evaluated once
    // at module load, stamping every message with the server's start time.
    default: Date.now,
  },
});

module.exports = User = mongoose.model(
  "discussionMessage",
  DiscussionMessageSchema
);
