const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const FosterChecklist = require("../../models/FosterChecklist");

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/foster-checklists";

    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

// CREATE CHECKLIST
router.post("/", async (req, res) => {
  try {
    const newChecklist = new FosterChecklist(req.body);

    const savedChecklist = await newChecklist.save();

    res.status(201).json(savedChecklist);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create checklist",
    });
  }
});

// GET ALL CHECKLISTS
router.get("/", async (req, res) => {
  try {
    const checklists = await FosterChecklist.find();

    res.json(checklists);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch checklists",
    });
  }
});

// GET MOST RECENT CHECKLIST FOR CHILD
router.get("/child/:childId/latest", async (req, res) => {
  try {
    const checklist = await FosterChecklist.findOne({
      childId: req.params.childId,
    }).sort({ createdAt: -1 });

    if (!checklist) {
      return res.status(404).json({
        message: "No checklist found for this child",
      });
    }

    res.json(checklist);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch latest checklist",
    });
  }
});

router.get("/child/:childId", async (req, res) => {
  try {
    console.log("🔴 Incoming childId param:", req.params.childId);
    const checklist = await FosterChecklist.findOne({
      childId: req.params.childId,
    });
    console.log("🔴 Found checklist:", checklist?._id);
    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    res.json(checklist);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch checklist" });
  }
});

// GET SINGLE CHECKLIST
router.get("/:id", async (req, res) => {
  try {
    const checklist = await FosterChecklist.findById(req.params.id);

    if (!checklist) {
      return res.status(404).json({
        message: "Checklist not found",
      });
    }

    res.json(checklist);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch checklist",
    });
  }
});

router.get("/debug-files", (req, res) => {
  const fs = require("fs");
  const dir = path.join(__dirname, "uploads/foster-checklists");

  res.json(fs.readdirSync(dir));
});

router.put("/:id", async (req, res) => {
  try {
    const checklist = await FosterChecklist.findById(req.params.id);

    if (!checklist) {
      return res.status(404).json({
        message: "Checklist not found",
      });
    }

    const allowedFields = [
      "childId",
      "childName",
      "PlacementDate",
      "checklist",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        checklist[field] = req.body[field];
      }
    });

    await checklist.save();

    res.json(checklist);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update checklist",
    });
  }
});

// DELETE CHECKLIST
router.delete("/:id", async (req, res) => {
  try {
    await FosterChecklist.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to delete checklist",
    });
  }
});

router.post(
  "/upload/:id/:fieldName",
  upload.single("file"),
  async (req, res) => {
    try {

      const { id, fieldName } = req.params;

      const checklist = await FosterChecklist.findById(id);

      if (!checklist) {
        return res.status(404).json({
          message: "Checklist not found",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "No file received",
        });
      }

      if (!checklist.uploadedFiles) {
        checklist.uploadedFiles = {};
      }

      checklist.uploadedFiles[fieldName] = [{
        fileName: req.file.originalname,
        fileUrl: `/uploads/foster-checklists/${req.file.filename}`,
        mimeType: req.file.mimetype,
        uploadedAt: new Date(),
      }];

      await checklist.save();

      res.json(checklist);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Failed to upload file",
      });
    }
  }
);

// RECURRING FILE UPLOAD
router.post(
  "/recurring-upload/:id/:fieldName",
  upload.single("file"),
  async (req, res) => {
    try {
      const { id, fieldName } = req.params;
      const { label } = req.body;

      const checklist = await FosterChecklist.findById(id);

      if (!checklist) {
        return res.status(404).json({ message: "Checklist not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file received" });
      }

      if (!checklist.recurringUploads) {
        checklist.recurringUploads = {};
      }

      if (!checklist.recurringUploads[fieldName]) {
        checklist.recurringUploads[fieldName] = [];
      }

      const newFile = {
        fileName: req.file.originalname,
        fileUrl: `/uploads/foster-checklists/${req.file.filename}`,
        mimeType: req.file.mimetype,
        uploadedAt: new Date(),
      };

      let existingGroup = checklist.recurringUploads[fieldName].find(
        (item) => item.label === label
      );

      const uploadsArray = checklist.recurringUploads[fieldName];

      const groupIndex = uploadsArray.findIndex(
        (item) => item.label === label
      );

      if (groupIndex !== -1) {
        uploadsArray[groupIndex] = {
          ...uploadsArray[groupIndex]._doc,
          files: [...uploadsArray[groupIndex].files, newFile],
        };
      } else {
        uploadsArray.push({
          label,
          files: [newFile],
        });
      }

      await checklist.save();

      res.json(checklist);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed recurring upload" });
    }
  }
);

module.exports = router;