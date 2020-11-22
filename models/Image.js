const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  imageName: {
    type: String,
    required: true,
  },
  imageData: {
    type: String,
    required: true,
  },
});

module.exports = Image = mongoose.model("image", ImageSchema);
