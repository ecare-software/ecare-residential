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
  date: {
    type: Date,
    required: true,
  },
  createDate: {
    type: Date,
    default: new Date(),
  },
});

module.exports = User = mongoose.model(
  "discussionMessage",
  DiscussionMessageSchema
);
