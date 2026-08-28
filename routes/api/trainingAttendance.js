const express = require("express");
const router = express.Router();

console.log("🚀 Training Attendance route file loaded!");

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const TrainingAttendance = require("../../models/TrainingAttendance");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../../uploads/attendance-sheets");
    console.log("Upload directory:", uploadDir);
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Created upload directory");
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log("Generated filename:", filename);
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    console.log("File validation:", {
      filename: file.originalname,
      mimetype: file.mimetype,
      extname: path.extname(file.originalname),
      isValid: mimetype && extname,
    });

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF and image files are allowed"));
    }
  },
});

// GET - Get all attendance sheets
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/trainingAttendance - Fetching all attendance sheets");
    const sheets = await TrainingAttendance.find().sort({ trainingDate: -1 });
    console.log(`Found ${sheets.length} attendance sheets`);
    res.json(sheets);
  } catch (error) {
    console.error("Error fetching attendance sheets:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST - Upload new attendance sheet
router.post("/", upload.single("attendanceSheet"), async (req, res) => {
  try {
    console.log("POST /api/trainingAttendance - Upload request received");
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { trainingName, trainingDate, uploadedBy, uploadedByName } = req.body;

    if (!trainingName || !trainingDate || !uploadedBy || !uploadedByName) {
      console.error("Missing required fields:", { trainingName, trainingDate, uploadedBy, uploadedByName });
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newAttendance = new TrainingAttendance({
      trainingName,
      trainingDate,
      fileName: req.file.originalname,
      fileUrl: `/uploads/attendance-sheets/${req.file.filename}`,
      uploadedBy,
      uploadedByName,
    });

    console.log("Saving attendance record:", newAttendance);
    const savedAttendance = await newAttendance.save();
    console.log("Attendance saved successfully:", savedAttendance);
    
    res.json(savedAttendance);
  } catch (error) {
    console.error("Error uploading attendance sheet:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete attendance sheet
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`DELETE /api/trainingAttendance/${id}`);
    
    const attendance = await TrainingAttendance.findById(id);

    if (!attendance) {
      console.error("Attendance sheet not found");
      return res.status(404).json({ error: "Attendance sheet not found" });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, "../..", attendance.fileUrl);
    console.log("Deleting file:", filePath);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted successfully");
    } else {
      console.warn("File not found on filesystem:", filePath);
    }

    await TrainingAttendance.findByIdAndDelete(id);
    console.log("Attendance record deleted successfully");
    
    res.json({ message: "Attendance sheet deleted successfully" });
  } catch (error) {
    console.error("Error deleting attendance sheet:", error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: error.message });
  } else if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
});

module.exports = router;