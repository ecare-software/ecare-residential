const express = require("express");
const router = express.Router();

const FirstAidCprTraining = require("../../models/FirstAidCprTraining");

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

module.exports = router;
