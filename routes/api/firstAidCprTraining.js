const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const FirstAidCprTraining = require("../../models/FirstAidCprTraining");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads/firstAidCprTraining";
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
  const newFirstAidCprTraining = new FirstAidCprTraining({
    T1: req.body.T1,

    customEntries: req.body.customEntries || [],

    createdBy: req.body.createdBy,

    createdByName: req.body.createdByName,

    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    homeId: req.body.homeId,

    formType: "First aid CPR Training",
  });

  newFirstAidCprTraining
    .save()
    .then((firstAidCprTraining) => res.json(firstAidCprTraining))
    .catch((e) => {
      console.error("Error saving first aid cpr training:", e);
      res.status(500).json({ error: e.message });
    });
});

router.get("/:homeId", (req, res) => {
  FirstAidCprTraining.find({ homeId: req.params.homeId })
    .sort({ createDate: -1 })
    .exec()
    .then((firstAidCprTraining) => res.json(firstAidCprTraining))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/:homeId/:email", (req, res) => {
  FirstAidCprTraining.find({
    homeId: req.params.homeId,
    createdBy: req.params.email,
  })
    .sort({ createDate: -1 })
    .exec()
    .then((firstAidCprTraining) => res.json(firstAidCprTraining))
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

  FirstAidCprTraining.find(findObj)
    .sort({ createDate: -1 })
    .exec()
    .then((firstAidCprTraining) => res.json(firstAidCprTraining))
    .catch((err) => res.status(404).json({ success: err }));
});

router.put("/:formId", (req, res) => {
  FirstAidCprTraining.findById(req.params.formId)
    .then((training) => {
      training.T1 = req.body.T1;

      // ADD THIS: Update customEntries
      training.customEntries = req.body.customEntries || [];

      training.lastEditDate = new Date().toISOString();

      training
        .save()
        .then((updatedTraining) => res.json(updatedTraining))
        .catch((err) => res.status(400).json({ error: err.message }));
    })
    .catch((err) => res.status(404).json({ error: "Training not found" }));
});

router.put("/:homeId/:formId/", (req, res) => {
  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  FirstAidCprTraining.updateOne({ _id: req.params.formId }, updatedLastEditDate)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

// Upload T1 certificate
router.post("/upload/:id/:fieldName", upload.single("file"), async (req, res) => {
  try {
    const { id, fieldName } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileData = {
      fileName: file.originalname,
      fileUrl: `/uploads/firstAidCprTraining/${file.filename}`,
      mimeType: file.mimetype,
      uploadedAt: new Date(),
    };

    const training = await FirstAidCprTraining.findById(id);
    if (!training) {
      return res.status(404).json({ error: "Training record not found" });
    }

    const certificateField = `${fieldName}Certificate`;
    training[certificateField] = fileData;
    training.lastEditDate = new Date();

    await training.save();

    res.json({ success: true, file: fileData });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete T1 certificate
router.delete("/certificate/:id/:fieldName", async (req, res) => {
  try {
    const { id, fieldName } = req.params;

    const training = await FirstAidCprTraining.findById(id);
    if (!training) {
      return res.status(404).json({ error: "Training record not found" });
    }

    const certificateField = `${fieldName}Certificate`;
    const certificate = training[certificateField];

    if (certificate && certificate.fileUrl) {
      const filePath = path.join(__dirname, "../..", certificate.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    training[certificateField] = null;
    training.lastEditDate = new Date();
    await training.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Upload custom entry certificate
router.post("/uploadCustom/:id/:entryId", upload.single("file"), async (req, res) => {
  try {
    const { id, entryId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileData = {
      fileName: file.originalname,
      fileUrl: `/uploads/firstAidCprTraining/${file.filename}`,
      mimeType: file.mimetype,
      uploadedAt: new Date(),
    };

    const training = await FirstAidCprTraining.findById(id);
    if (!training) {
      return res.status(404).json({ error: "Training record not found" });
    }

    const entry = training.customEntries.find(e => e.id === parseInt(entryId));
    if (!entry) {
      return res.status(404).json({ error: "Custom entry not found" });
    }

    entry.certificate = fileData;
    training.lastEditDate = new Date();

    await training.save();

    res.json({ success: true, file: fileData });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete custom entry certificate
router.delete("/certificateCustom/:id/:entryId", async (req, res) => {
  try {
    const { id, entryId } = req.params;

    const training = await FirstAidCprTraining.findById(id);
    if (!training) {
      return res.status(404).json({ error: "Training record not found" });
    }

    const entry = training.customEntries.find(e => e.id === parseInt(entryId));
    if (!entry) {
      return res.status(404).json({ error: "Custom entry not found" });
    }

    if (entry.certificate && entry.certificate.fileUrl) {
      const filePath = path.join(__dirname, "../..", entry.certificate.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    entry.certificate = null;
    training.lastEditDate = new Date();
    await training.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
