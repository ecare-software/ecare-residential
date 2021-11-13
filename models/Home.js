const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Schema
const ClientSchema = new Schema({
  name: {
    type: String,
  },
  homeId: {
    type: String,
  },
});

module.exports = Client = mongoose.model("Home", ClientSchema);
