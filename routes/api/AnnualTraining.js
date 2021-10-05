const express = require("express");
const router = express.Router();

const AnnualTraining = require("../../models/AnnualTraining");

router.post("/", (req, res) => {
  const newAnnualTraining = new AnnualTraining({
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
    T13: req.body.T13,
    T14: req.body.T14,
    T15: req.body.T15,
    T16: req.body.T16,
    T17: req.body.T17,
    T18: req.body.T18,
    T19: req.body.T19,
    T20: req.body.T20,
    T21: req.body.T21,
    T22: req.body.T22,
    T23: req.body.T23,
    T24: req.body.T24,
    T25: req.body.T25,
    T26: req.body.T26,
    T27: req.body.T27,
    T28: req.body.T28,
    T29: req.body.T29,
    T30: req.body.T30,
    T31: req.body.T31,
    T32: req.body.T32,

    createdBy: req.body.createdBy,

    createdByName: req.body.createdByName,

    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    homeId: req.body.homeId,

    formType: "Annual Training",
  });

  newAnnualTraining
    .save()
    .then((annualTraining) => res.json(annualTraining))
    .catch((e) => {
      e;
    });
});

router.get("/:homeId", (req, res) => {
  AnnualTraining.find({ homeId: req.params.homeId })
    .sort({ createDate: -1 })
    .exec()
    .then((annualTraining) => res.json(annualTraining))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/:homeId/:email", (req, res) => {
  AnnualTraining.find({
    homeId: req.params.homeId,
    createdBy: req.params.email,
  })
    .sort({ createDate: -1 })
    .exec()
    .then((annualTraining) => res.json(annualTraining))
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

  AnnualTraining.find(findObj)
    .sort({ createDate: -1 })
    .exec()
    .then((annualTraining) => res.json(annualTraining))
    .catch((err) => res.status(404).json({ success: err }));
});

router.put("/:formId", (req, res) => {
  AnnualTraining.updateOne({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.put("/:homeId/:formId/", (req, res) => {
  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  AnnualTraining.updateOne({ _id: req.params.formId }, updatedLastEditDate)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
