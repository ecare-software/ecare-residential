const express = require("express");
const router = express.Router();

const Image = require("../../models/Image");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/models/Image.js");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    //does not store file
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
});

router
  .route("/uploadmulter")
  .post(upload.single("imageData"), (req, res, next) => {
    console.log(req.body);
    const newImage = new Image({
      imageName: req.body.imageName,
      imageData: req.file.path,
    });
    newImage
      .save()
      .then((result) => {
        console.log(result);
        res.status(200).json({
          success: true,
          document: result,
        });
      })
      .catch((e) => next(e));
  });

module.exports = router;
