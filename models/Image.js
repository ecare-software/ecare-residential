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
  img: {
    data: Buffer,
    contentType: String,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  approvedBy: {
    type: String,
    required: false,
  },
  approvedByName: {
    type: String,
    required: false,
  },
  approvedByDate: {
    type: Date,
    //required:true
  },
});

module.exports = Image = mongoose.model("image", ImageSchema);
