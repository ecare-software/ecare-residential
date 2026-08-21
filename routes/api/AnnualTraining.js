const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const AnnualTraining = require("../../models/AnnualTraining");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    const uploadDir = "./uploads/annualTraining";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images and PDFs are allowed"));
    }
  },
});

router.post("/", (req, res) => {
  const newAnnualTraining = new AnnualTraining({
    T1: req.body.T1,
    T2: req.body.T2,
    T3: req.body.T3,
    T4: req.body.T4,
    T5: req.body.T5,
    T6: req.body.T6,
    T7: req.body.T7,
    T8: req.body.T8,
    T9: req.body.T9,
    T10: req.body.T10,
    T11: req.body.T11,
    T12: req.body.T12,
    T13: req.body.T13,
    T14: req.body.T14,
    T15: req.body.T15,
    T16: req.body.T16,
    T17: req.body.T17,
    T18: req.body.T18,
    T19: req.body.T19,
    T20: req.body.T20,
    T21: req.body.T21,
    T22: req.body.T22,
    T23: req.body.T23,
    T24: req.body.T24,
    T25: req.body.T25,
    T26: req.body.T26,
    T27: req.body.T27,
    T28: req.body.T28,
    T29: req.body.T29,
    T30: req.body.T30,
    T31: req.body.T31,
    T32: req.body.T32,

    // ADD THESE: Expiration dates
    T1Expiration: req.body.T1Expiration,
    T2Expiration: req.body.T2Expiration,
    T3Expiration: req.body.T3Expiration,
    T4Expiration: req.body.T4Expiration,
    T5Expiration: req.body.T5Expiration,
    T6Expiration: req.body.T6Expiration,
    T7Expiration: req.body.T7Expiration,
    T8Expiration: req.body.T8Expiration,
    T9Expiration: req.body.T9Expiration,
    T10Expiration: req.body.T10Expiration,
    T11Expiration: req.body.T11Expiration,
    T12Expiration: req.body.T12Expiration,
    T13Expiration: req.body.T13Expiration,
    T14Expiration: req.body.T14Expiration,
    T15Expiration: req.body.T15Expiration,
    T16Expiration: req.body.T16Expiration,
    T17Expiration: req.body.T17Expiration,
    T18Expiration: req.body.T18Expiration,
    T19Expiration: req.body.T19Expiration,
    T20Expiration: req.body.T20Expiration,
    T21Expiration: req.body.T21Expiration,
    T22Expiration: req.body.T22Expiration,
    T23Expiration: req.body.T23Expiration,
    T24Expiration: req.body.T24Expiration,
    T25Expiration: req.body.T25Expiration,
    T26Expiration: req.body.T26Expiration,
    T27Expiration: req.body.T27Expiration,
    T28Expiration: req.body.T28Expiration,
    T29Expiration: req.body.T29Expiration,
    T30Expiration: req.body.T30Expiration,
    T31Expiration: req.body.T31Expiration,
    T32Expiration: req.body.T32Expiration,

    createdBy: req.body.createdBy,
    createdByName: req.body.createdByName,
    lastEditDate: new Date().toISOString(),
    createDate: new Date().toISOString(),
    homeId: req.body.homeId,
    formType: "Annual Training",
  });

  newAnnualTraining
    .save()
    .then((annualTraining) => res.json(annualTraining))
    .catch((e) => {
      console.error("Error saving annual training:", e);
      res.status(500).json({ error: e.message });
    });
});

router.get("/:homeId", (req, res) => {
  AnnualTraining.find({ homeId: req.params.homeId })
    .sort({ createDate: -1 })
    .exec()
    .then((annualTraining) => res.json(annualTraining))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/:homeId/:email", (req, res) => {
  AnnualTraining.find({
    homeId: req.params.homeId,
    createdBy: req.params.email,
  })
    .sort({ createDate: -1 })
    .exec()
    .then((annualTraining) => res.json(annualTraining))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/:homeId" + "/:submittedByA" + "/:lastEditDate", (req, res) => {
  var findObj = {
    homeId: req.params.homeId,
  };

  // submitted by
  if (req.params.submittedByA !== "none") {
    findObj.createdBy = req.params.submittedByA;
  }

  AnnualTraining.find(findObj)
    .sort({ createDate: -1 })
    .exec()
    .then((annualTraining) => res.json(annualTraining))
    .catch((err) => res.status(404).json({ success: err }));
});

router.put("/:formId", (req, res) => {
  AnnualTraining.updateOne({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.put("/:homeId/:formId/", (req, res) => {
  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  AnnualTraining.updateOne({ _id: req.params.formId }, updatedLastEditDate)
    .then((data) => {
      res.json(updatedLastEditDate);
    })
    .catch((e) => {
      console.log(e);
    });
});

// Upload certificate for a specific training
router.post("/upload/:id/:fieldName", upload.single("file"), async (req, res) => {
  try {
    console.log("Upload request received");
    console.log("ID:", req.params.id);
    console.log("Field:", req.params.fieldName);
    console.log("File:", req.file);

    const { id, fieldName } = req.params;
    const file = req.file;

    if (!file) {
      console.error("No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileData = {
      fileName: file.originalname,
      fileUrl: `/uploads/annualTraining/${file.filename}`,
      mimeType: file.mimetype,
      uploadedAt: new Date(),
    };

    // Find the training record and update the certificate field
    const training = await AnnualTraining.findById(id);
    if (!training) {
      console.error("Training not found:", id);
      return res.status(404).json({ error: "Training record not found" });
    }

    // Store certificate data in the field (e.g., T1Certificate, T2Certificate, etc.)
    const certificateField = `${fieldName}Certificate`;
    training[certificateField] = fileData;
    training.lastEditDate = new Date();

    await training.save();
    console.log("Certificate saved successfully");

    res.json({ success: true, file: fileData });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete certificate for a specific training
router.delete("/certificate/:id/:fieldName", async (req, res) => {
  try {
    const { id, fieldName } = req.params;

    const training = await AnnualTraining.findById(id);
    if (!training) {
      return res.status(404).json({ error: "Training record not found" });
    }

    const certificateField = `${fieldName}Certificate`;
    const certificate = training[certificateField];

    // Delete the file from the filesystem
    if (certificate && certificate.fileUrl) {
      const filePath = path.join(__dirname, "../..", certificate.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove certificate data from database
    training[certificateField] = null;
    training.lastEditDate = new Date();
    await training.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
