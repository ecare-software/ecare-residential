const express = require("express");
const router = express.Router();

const PreServiceTrainingMod = require("../../models/PreServiceTrainingMod");

router.post("/", (req, res) => {
  const newPreServiceTrainingMod = new PreServiceTrainingMod({
    T1Presenter: req.body.T1Presenter,

    T2Presenter: req.body.T2Presenter,

    T3Presenter: req.body.T3Presenter,

    T4Presenter: req.body.T4Presenter,

    T5Presenter: req.body.T5Presenter,

    T6Presenter: req.body.T6Presenter,

    T7Presenter: req.body.T7Presenter,

    T8Presenter: req.body.T8Presenter,

    T9Presenter: req.body.T9Presenter,

    T10Presenter: req.body.T10Presenter,

    T11Presenter: req.body.T11Presenter,

    T12Presenter: req.body.T12Presenter,

    T1Title: req.body.T1Title,

    T2Title: req.body.T2Title,

    T3Title: req.body.T3Title,

    T4Title: req.body.T4Title,

    T5Title: req.body.T5Title,

    T6Title: req.body.T6Title,

    T7Title: req.body.T7Title,

    T8Title: req.body.T8Title,

    T9Title: req.body.T9Title,

    T10Title: req.body.T10Title,

    T11Title: req.body.T11Title,

    T12Title: req.body.T12Title,

    T1Hours: req.body.T1Hours,

    T2Hours: req.body.T2Hours,

    T3Hours: req.body.T3Hours,

    T4Hours: req.body.T4Hours,

    T5Hours: req.body.T5Hours,

    T6Hours: req.body.T6Hours,

    T7Hours: req.body.T7Hours,

    T8Hours: req.body.T8Hours,

    T9Hours: req.body.T9Hours,

    T10Hours: req.body.T10Hours,

    T11Hours: req.body.T11Hours,

    T12Hours: req.body.T12Hours,

    createdBy: req.body.createdBy,

    createdByName: req.body.createdByName,

    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    homeId: req.body.homeId,

    formType: "Pre Service Training",
  });

  newPreServiceTrainingMod
    .save()
    .then((preServiceTrainingMod) => res.json(preServiceTrainingMod))
    .catch((e) => {
      e;
    });
});

router.get("/:homeId", (req, res) => {
  console.log("hey");
  PreServiceTrainingMod.find({ homeId: req.params.homeId })
    .sort({ lastEditDate: -1 })
    .exec()
    .then((preServiceTrainingMod) => res.json(preServiceTrainingMod))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/:homeId/:email", (req, res) => {
  PreServiceTrainingMod.find({
    homeId: req.params.homeId,
    createdBy: req.params.email,
  })
    .sort({ lastEditDate: -1 })
    .exec()
    .then((preServiceTrainingMod) => res.json(preServiceTrainingMod))
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

  PreServiceTrainingMod.find(findObj)
    .sort({ lastEditDate: -1 })
    .exec()
    .then((preServiceTrainingMod) => res.json(preServiceTrainingMod))
    .catch((err) => res.status(404).json({ success: err }));
});

router.put("/:formId", (req, res) => {
  PreServiceTrainingMod.findByIdAndUpdate({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.put("/:homeId/:formId/", (req, res) => {
  PreServiceTrainingMod.findByIdAndUpdate({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
