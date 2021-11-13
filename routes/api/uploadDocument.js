const express = require("express");
const router = express.Router();
const Image = require("../../models/Image");
const fs = require("fs");

const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const path = require("path");
var upload = multer({ storage: storage });

const MIME_TYPE_TO_EXT = [
  {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ext: ".docx",
  },
  {
    mime: "application/msword",
    ext: ".doc",
  },
  {
    mime: "text/csv",
    ext: ".csv",
  },
  {
    mime: "image/jpeg",
    ext: ".jpeg",
  },
  {
    mime: "image/png",
    ext: ".png",
  },
  {
    mime: "application/pdf",
    ext: ".pdf",
  },
  {
    mime: "application/vnd.ms-powerpoint",
    ext: ".ppt",
  },
  {
    mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ext: ".pptX",
  },
  {
    mime: "text/plain",
    ext: ".txt",
  },
  {
    mime: "application/vnd.ms-excel",
    ext: ".xls",
  },
  {
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ext: ".xlsx",
  },
];

router
  .route("/uploadmulter")
  .post(upload.single("imageData"), (req, res, next) => {
    console.log(
      `Uploading image for home ${req.body.homeId} and user ${req.body.email}`
    );
    const newImage = new Image({
      imageName: `${
        req.body.imageName
          ? req.body.imageName.replace(/\s+/g, "_")
          : req.file.filename
      }`,
      homeId: req.body.homeId,
      email: req.body.email,
      uploadDate: new Date(),
      img: {
        data: fs.readFileSync(
          path.join(__dirname + "/../../uploads/" + req.file.filename)
        ),
        contentType: req.file.mimetype,
      },
    });
    newImage
      .save()
      .then(async (result) => {
        await fs.unlinkSync(__dirname + "/../../uploads/" + req.file.filename);
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
});

router.get("/", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(401).json({
        err: "No files exist",
      });
    }
    return res.json(files);
  });
});

router.put("/:homeId/:formId/", (req, res) => {
  Image.updateOne({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

// @route   Delete api/items
// @desc    Delete an item
// @access  Public
router.delete("/:id", (req, res) => {
  Image.findById(req.params.id)
    .then((user) => user.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
