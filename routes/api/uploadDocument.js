const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const Image = require("../../models/Image");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const crypto = require("crypto");
const path = require("path");
const mongoURI =
  "mongodb://demarcuskennedy:demarcuskennedy@cluster0-shard-00-00-3huhr.mongodb.net:27017,cluster0-shard-00-01-3huhr.mongodb.net:27017,cluster0-shard-00-02-3huhr.mongodb.net:27017/RCS?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
const conn = mongoose.createConnection(mongoURI);
var gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname.replace(/\s+/g, "_"));
//   },
// });
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname + buf.toString("hex");
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const fileFilter = (req, file, cb) => {
  // if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
  cb(null, true);
  // } else {
  //does not store file
  cb(null, false);
  // }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
});

router
  .route("/uploadmulter")
  .post(upload.single("imageData"), (req, res, next) => {
    console.log(
      `Uploading image for home ${req.body.homeId} and user ${req.body.email}`
    );
    const newImage = new Image({
      imageName: `${req.body.imageName.replace(/\s+/g, "_")}`,
      homeId: req.body.homeId,
      email: req.body.email,
      uploadDate: new Date(),
      id: req.file.id,
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

router.get("/:homeId", (req, res) => {
  Image.find({ homeId: req.params.homeId })
    .then((Images) => res.json(Images))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/:homeId/:id", (req, res) => {
  gfs.files.findOne({ _id: req.params.id }, (err, file) => {
    cosm;
    if (!file || file.length === 0) {
      return res.status(401).json({
        err: "No files exist",
      });
    }
    return res.json(file);
  });
  // Image.find({ homeId: req.params.homeId })
  //   .then((Images) => res.json(Images))
  //   .catch((err) => res.status(404).json({ success: false }));
});

router.get("/", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    //check if files
    console.log(files);
    if (!files || files.length === 0) {
      return res.status(401).json({
        err: "No files exist",
      });
    }
    return res.json(files);
  });
});
module.exports = router;
