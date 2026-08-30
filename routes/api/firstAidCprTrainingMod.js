const express = require("express");
const router = express.Router();
const FirstAidCprTrainingMod = require("../../models/FirstAidCprTrainingMod");

// GET - Get training modal by homeId
router.get("/:homeId", async (req, res) => {
  try {
    const { homeId } = req.params;
    console.log("GET /firstAidCprTrainingMod - homeId:", homeId);
    const training = await FirstAidCprTrainingMod.find({ homeId });
    console.log("Found training:", training);
    res.json(training);
  } catch (error) {
    console.error("Error fetching training modal:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST - Create new training modal
router.post("/", async (req, res) => {
  try {
    console.log("POST /firstAidCprTrainingMod - Request body:", req.body);
    const newTraining = new FirstAidCprTrainingMod(req.body);
    const savedTraining = await newTraining.save();
    console.log("Saved training:", savedTraining);
    res.json(savedTraining);
  } catch (error) {
    console.error("Error creating training modal:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update existing training modal
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("PUT /firstAidCprTrainingMod/:id - ID:", id);
    console.log("PUT /firstAidCprTrainingMod/:id - Request body:", req.body);

    // First, get the existing document
    const existing = await FirstAidCprTrainingMod.findById(id);
    if (!existing) {
      console.log("Training modal not found");
      return res.status(404).json({ error: "Training modal not found" });
    }

    console.log("Existing training before update:", existing.toObject());

    // Merge all fields manually to ensure dynamic fields are included
    Object.keys(req.body).forEach((key) => {
      existing[key] = req.body[key];
    });
    existing.lastEditDate = new Date();

    const updatedTraining = await existing.save();

    console.log("Updated training after save:", updatedTraining.toObject());

    res.json(updatedTraining);
  } catch (error) {
    console.error("Error updating training modal:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete training modal
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("DELETE /firstAidCprTrainingMod/:id - ID:", id);
    const deletedTraining = await FirstAidCprTrainingMod.findByIdAndDelete(id);

    if (!deletedTraining) {
      return res.status(404).json({ error: "Training modal not found" });
    }

    res.json({ message: "Training modal deleted successfully" });
  } catch (error) {
    console.error("Error deleting training modal:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
