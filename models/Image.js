const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  imageName: {
    type: String,
    required: true,
  },
  homeId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

module.exports = Image = mongoose.model("image", ImageSchema);
