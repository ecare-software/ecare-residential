const express = require("express");
const router = express.Router();

const OrientationTraining = require("../../models/OrientationTraining");

router.post("/", (req, res) => {
  const newOrientationTraining = new OrientationTraining({
    T1: req.body.T1,

    T2: req.body.T2,

    T3: req.body.T3,

    T4: req.body.T4,

    T5: req.body.T5,

    T6: req.body.T6,

    T7: req.body.T7,

    createdBy: req.body.createdBy,

    createdByName: req.body.createdByName,

    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    homeId: req.body.homeId,

    formType: "Orientation Training",
  });

  newOrientationTraining
    .save()
    .then((orientationTraining) => res.json(orientationTraining))
    .catch((e) => {
      e;
    });
});

router.get("/:homeId", (req, res) => {
  OrientationTraining.find({ homeId: req.params.homeId })
    .sort({ lastEditDate: -1 })
    .exec()
    .then((orientationTraining) => res.json(orientationTraining))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/:homeId/:email", (req, res) => {
  OrientationTraining.find({
    homeId: req.params.homeId,
    createdBy: req.params.email,
  })
    .sort({ lastEditDate: -1 })
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

  OrientationTraining.find(findObj)
    .sort({ lastEditDate: -1 })
    .exec()
    .then((orientationTraining) => res.json(orientationTraining))
    .catch((err) => res.status(404).json({ success: err }));
});

router.put("/:formId", (req, res) => {
  OrientationTraining.findByIdAndUpdate({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.put("/:homeId/:formId/", (req, res) => {
  OrientationTraining.findByIdAndUpdate({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
