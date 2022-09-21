const express = require("express");
const router = express.Router();

const OrientationTrainingMod = require("../../models/OrientationTrainingMod");

router.post("/", (req, res) => {
  const newOrientationTrainingMod = new OrientationTrainingMod({
    T1Presenter: req.body.T1Presenter,
    T2Presenter: req.body.T2Presenter,
    T3Presenter: req.body.T3Presenter,
    T4Presenter: req.body.T4Presenter,
    T5Presenter: req.body.T5Presenter,
    T6Presenter: req.body.T6Presenter,
    T7Presenter: req.body.T7Presenter,
    T1Title: req.body.T1Title,
    T2Title: req.body.T2Title,
    T3Title: req.body.T3Title,
    T4Title: req.body.T4Title,
    T5Title: req.body.T5Title,
    T6Title: req.body.T6Title,
    T7Title: req.body.T7Title,
    T1Hours: req.body.T1Hours,
    T2Hours: req.body.T2Hours,
    T3Hours: req.body.T3Hours,
    T4Hours: req.body.T4Hours,
    T5Hours: req.body.T5Hours,
    T6Hours: req.body.T6Hours,
    T7Hours: req.body.T7Hours,

    createdBy: req.body.createdBy,

    createdByName: req.body.createdByName,

    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    homeId: req.body.homeId,

    formType: "Orientation Training",
  });

  newOrientationTrainingMod
    .save()
    .then((orientationTraining) => res.json(orientationTraining))
    .catch((e) => {
      e;
    });
});

router.get("/:homeId", (req, res) => {
  OrientationTrainingMod.find({ homeId: req.params.homeId })
    .sort({ createDate: -1 })
    .exec()
    .then((orientationTraining) => res.json(orientationTraining))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/:homeId/:email", (req, res) => {
  OrientationTrainingMod.find({
    homeId: req.params.homeId,
    createdBy: req.params.email,
  })
    .sort({ createDate: -1 })
    .exec()
    .then((orientationTraining) => res.json(orientationTraining))
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

  OrientationTrainingMod.find(findObj)
    .sort({ createDate: -1 })
    .exec()
    .then((orientationTraining) => res.json(orientationTraining))
    .catch((err) => res.status(404).json({ success: err }));
});

router.put("/:formId", (req, res) => {
  OrientationTrainingMod.updateOne({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.put("/:homeId/:formId/", (req, res) => {
  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  OrientationTrainingMod.updateOne(
    { _id: req.params.formId },
    updatedLastEditDate
  )
    .then((data) => {
      res.json(updatedLastEditDate);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
