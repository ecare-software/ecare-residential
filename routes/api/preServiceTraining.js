const express = require("express");
const router = express.Router();

const PreServiceTraining = require("../../models/PreServiceTraining");

router.post("/", (req, res) => {
  const newPreServiceTraining = new PreServiceTraining({
    T1: req.body.T1,

    T2: req.body.T2,

    T3: req.body.T3,

    T4: req.body.T4,

    T5: req.body.T5,

    T6: req.body.T6,

    T7: req.body.T7,

    T8: req.body.T8,

    T9: req.body.T9,

    T10: req.body.T10,

    T11: req.body.T11,

    T12: req.body.T12,

    createdBy: req.body.createdBy,

    createdByName: req.body.createdByName,

    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    homeId: req.body.homeId,

    formType: "Pre Service Training",
  });

  newPreServiceTraining
    .save()
    .then((preServiceTraining) => res.json(preServiceTraining))
    .catch((e) => {
      e;
    });
});

router.get("/:homeId", (req, res) => {
  PreServiceTraining.find({ homeId: req.params.homeId })
    .sort({ createDate: -1 })
    .exec()
    .then((preServiceTraining) => res.json(preServiceTraining))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/:homeId/:email", (req, res) => {
  PreServiceTraining.find({
    homeId: req.params.homeId,
    createdBy: req.params.email,
  })
    .sort({ createDate: -1 })
    .exec()
    .then((preServiceTraining) => res.json(preServiceTraining))
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

  PreServiceTraining.find(findObj)
    .sort({ createDate: -1 })
    .exec()
    .then((preServiceTraining) => res.json(preServiceTraining))
    .catch((err) => res.status(404).json({ success: err }));
});

router.put("/:formId", (req, res) => {
  PreServiceTraining.updateOne({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.put("/:homeId/:formId/", (req, res) => {
  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  PreServiceTraining.updateOne({ _id: req.params.formId }, updatedLastEditDate)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
