const express = require("express");
const router = express.Router();

const FirstAidCprTraining = require("../../models/FirstAidCprTraining");

router.post("/", (req, res) => {
  const newFirstAidCprTraining = new FirstAidCprTraining({
    T1: req.body.T1,

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
      e;
    });
});

router.get("/:homeId", (req, res) => {
  FirstAidCprTraining.find({ homeId: req.params.homeId })
    .sort({ lastEditDate: -1 })
    .exec()
    .then((firstAidCprTraining) => res.json(firstAidCprTraining))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/:homeId/:email", (req, res) => {
  FirstAidCprTraining.find({
    homeId: req.params.homeId,
    createdBy: req.params.email,
  })
    .sort({ lastEditDate: -1 })
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
    .sort({ lastEditDate: -1 })
    .exec()
    .then((firstAidCprTraining) => res.json(firstAidCprTraining))
    .catch((err) => res.status(404).json({ success: err }));
});

router.put("/:formId", (req, res) => {
  FirstAidCprTraining.findByIdAndUpdate({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.put("/:homeId/:formId/", (req, res) => {
  const updatedLastEditDate = {...req.body, lastEditDate: new Date()}
  FirstAidCprTraining.findByIdAndUpdate({ _id: req.params.formId }, updatedLastEditDate)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
