const express = require("express");
const router = express.Router();

const FirstAidCprTrainingMod = require("../../models/FirstAidCprTrainingMod");

router.post("/", (req, res) => {
  const newFirstAidCprTrainingMod = new FirstAidCprTrainingMod({
    T1Presenter: req.body.T1Presenter,

    T1Title: req.body.T1Title,

    T1Hours: req.body.T1Hours,

    createdBy: req.body.createdBy,

    createdByName: req.body.createdByName,

    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    homeId: req.body.homeId,

    formType: "First aid CPR Training",
  });

  newFirstAidCprTrainingMod
    .save()
    .then((firstAidCprTrainingMod) => res.json(firstAidCprTrainingMod))
    .catch((e) => {
      e;
    });
});

router.get("/:homeId", (req, res) => {
  FirstAidCprTrainingMod.find({ homeId: req.params.homeId })
    .sort({ createDate: -1 })
    .exec()
    .then((firstAidCprTrainingMod) => res.json(firstAidCprTrainingMod))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/:homeId/:email", (req, res) => {
  FirstAidCprTrainingMod.find({
    homeId: req.params.homeId,
    createdBy: req.params.email,
  })
    .sort({ createDate: -1 })
    .exec()
    .then((firstAidCprTrainingMod) => res.json(firstAidCprTrainingMod))
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

  FirstAidCprTrainingMod.find(findObj)
    .sort({ createDate: -1 })
    .exec()
    .then((firstAidCprTrainingMod) => res.json(firstAidCprTrainingMod))
    .catch((err) => res.status(404).json({ success: err }));
});

router.put("/:formId", (req, res) => {
  FirstAidCprTrainingMod.updateOne({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.put("/:homeId/:formId/", (req, res) => {
  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  FirstAidCprTrainingMod.updateOne(
    { _id: req.params.formId },
    updatedLastEditDate
  )
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
