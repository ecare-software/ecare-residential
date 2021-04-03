const express = require("express");
const router = express.Router();

const AnnualTrainingMod = require("../../models/AnnualTrainingMod");

router.post("/", (req, res) => {
  const newAnnualTrainingMod = new AnnualTrainingMod({
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
    T13Hours: req.body.T13Hours,
    T14Hours: req.body.T14Hours,
    T15Hours: req.body.T15Hours,
    T16Hours: req.body.T16Hours,
    T17Hours: req.body.T17Hours,
    T18Hours: req.body.T18Hours,
    T19Hours: req.body.T19Hours,
    T20Hours: req.body.T20Hours,
    T21Hours: req.body.T21Hours,
    T22Hours: req.body.T22Hours,
    T23Hours: req.body.T23Hours,
    T24Hours: req.body.T24Hours,
    T25Hours: req.body.T25Hours,
    T26Hours: req.body.T26Hours,
    T27Hours: req.body.T27Hours,
    T28Hours: req.body.T28Hours,
    T29Hours: req.body.T29Hours,
    T30Hours: req.body.T30Hours,
    T31Hours: req.body.T31Hours,
    T32Hours: req.body.T32Hours,
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
    T13Title: req.body.T13Title,
    T14Title: req.body.T14Title,
    T15Title: req.body.T15Title,
    T16Title: req.body.T16Title,
    T17Title: req.body.T17Title,
    T18Title: req.body.T18Title,
    T19Title: req.body.T19Title,
    T20Title: req.body.T20Title,
    T21Title: req.body.T21Title,
    T22Title: req.body.T22Title,
    T23Title: req.body.T23Title,
    T24Title: req.body.T24Title,
    T25Title: req.body.T25Title,
    T26Title: req.body.T26Title,
    T27Title: req.body.T27Title,
    T28Title: req.body.T28Title,
    T29Title: req.body.T29Title,
    T30Title: req.body.T30Title,
    T31Title: req.body.T31Title,
    T32Title: req.body.T32Title,
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
    T13Presenter: req.body.T13Presenter,
    T14Presenter: req.body.T14Presenter,
    T15Presenter: req.body.T15Presenter,
    T16Presenter: req.body.T16Presenter,
    T17Presenter: req.body.T17Presenter,
    T18Presenter: req.body.T18Presenter,
    T19Presenter: req.body.T19Presenter,
    T20Presenter: req.body.T20Presenter,
    T21Presenter: req.body.T21Presenter,
    T22Presenter: req.body.T22Presenter,
    T23Presenter: req.body.T23Presenter,
    T24Presenter: req.body.T24Presenter,
    T25Presenter: req.body.T25Presenter,
    T26Presenter: req.body.T26Presenter,
    T27Presenter: req.body.T27Presenter,
    T28Presenter: req.body.T28Presenter,
    T29Presenter: req.body.T29Presenter,
    T30Presenter: req.body.T30Presenter,
    T31Presenter: req.body.T31Presenter,
    T32Presenter: req.body.T32Presenter,

    createdBy: req.body.createdBy,

    createdByName: req.body.createdByName,

    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    homeId: req.body.homeId,

    formType: "Annual Training",
  });

  newAnnualTrainingMod
    .save()
    .then((annualTrainingMod) => res.json(annualTrainingMod))
    .catch((e) => {
      e;
    });
});

router.get("/:homeId", (req, res) => {
  AnnualTrainingMod.find({ homeId: req.params.homeId })
    .sort({ lastEditDate: -1 })
    .exec()
    .then((annualTrainingMod) => res.json(annualTrainingMod))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/:homeId/:email", (req, res) => {
  AnnualTrainingMod.find({
    homeId: req.params.homeId,
    createdBy: req.params.email,
  })
    .sort({ lastEditDate: -1 })
    .exec()
    .then((annualTrainingMod) => res.json(annualTrainingMod))
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

  AnnualTrainingMod.find(findObj)
    .sort({ lastEditDate: -1 })
    .exec()
    .then((annualTrainingMod) => res.json(annualTrainingMod))
    .catch((err) => res.status(404).json({ success: err }));
});

router.put("/:formId", (req, res) => {
  AnnualTrainingMod.findByIdAndUpdate({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.put("/:homeId/:formId/", (req, res) => {
  AnnualTrainingMod.findByIdAndUpdate({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
