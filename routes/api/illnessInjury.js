const express = require("express");
const router = express.Router();

const IllnessInjury = require("../../models/IllnessInjury");

router.post("/", (req, res) => {
  const newIllnessInjury = new IllnessInjury({
    childMeta_name: req.body.childMeta_name,

    createdBy: req.body.createdBy,

    createdByName: req.body.createdByName,

    dateTimeOccur: req.body.dateTimeOccur,
    illnessInjury: req.body.illnessInjury,
    initialResponse: req.body.initialResponse,
    tempTaken: req.body.tempTaken,
    tempMethodTaken: req.body.tempMethodTaken,
    tempInitialReading: req.body.tempInitialReading,
    supervisorNotified: req.body.supervisorNotified,
    notifiedAt: req.body.notifiedAt,
    notifiedBy: req.body.notifiedBy,
    adminFollowUp: req.body.adminFollowUp,
    lastMedicationGiven: req.body.lastMedicationGiven,
    otherActionsTreatment: req.body.otherActionsTreatment,
    treatmentAuthBy: req.body.treatmentAuthBy,

    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    homeId: req.body.homeId,

    formType: "Illness Injury",
  });

  newIllnessInjury
    .save()
    .then((illnessInjury) => res.json(illnessInjury))
    .catch((e) => {
      e;
    });
});

router.get("/:homeId", (req, res) => {
  IllnessInjury.find({ homeId: req.params.homeId })
    .sort({ createDate: -1 })
    .exec()
    .then((illnessInjury) => res.json(illnessInjury))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get(
  "/:homeId/:searchString" +
    "/:lastEditDateAfter/:lastEditDateBefore" +
    "/:childDOBAfter/:childDOBBefore" +
    "/:childDOAAfter/:childDOABefore" +
    "/:ethnicityA" +
    "/:submittedByA" +
    "/:approved",
  (req, res) => {
    var findObj = {
      homeId: req.params.homeId,
    };
    //search string
    if (req.params.searchString !== "none") {
      findObj.childMeta_name = {
        $regex: ".*" + req.params.searchString + ".*",
        $options: "ig",
      };
    }

    //submitted
    if (
      req.params.lastEditDateAfter !== "none" &&
      req.params.lastEditDateBefore !== "none"
    ) {
      var dateAfter = new Date(req.params.lastEditDateAfter);
      var dateBefore = new Date(req.params.lastEditDateBefore);
      findObj["$and"] = [
        {
          createDate: {
            $gt: new Date(dateAfter.setDate(dateAfter.getDate() + 1)),
          },
        },
        {
          createDate: {
            $lt: new Date(dateBefore.setDate(dateBefore.getDate())),
          },
        },
      ];
    } else {
      //submittedAfter
      if (req.params.lastEditDateAfter !== "none") {
        var date = new Date(req.params.lastEditDateAfter);
        findObj.createDate = {
          $gt: new Date(date.setDate(date.getDate() + 1)),
        };
      }

      //submittedBefore
      if (req.params.lastEditDateBefore !== "none") {
        var date = new Date(req.params.lastEditDateBefore);
        findObj.createDate = {
          $lt: new Date(date.setDate(date.getDate())),
        };
      }
    }

    // submitted by
    if (req.params.submittedByA !== "none") {
      findObj.createdBy = req.params.submittedByA;
    }

    if (req.params.approved !== "null") {
      if (req.params.approved == "true") {
        findObj = {
          ...findObj,
          $and: [
            {
              approved: true,
              approved_alt1: true,
            },
          ],
        };
      } else {
        findObj = {
          ...findObj,
          $or: [
            {
              approved: false,
              approved_alt1: true,
            },
            {
              approved: true,
              approved_alt1: false,
            },
            {
              approved: false,
              approved_alt1: false,
            },
          ],
        };
      }
    }

    IllnessInjury.find(findObj)
      .sort({ createDate: -1 })
      .exec()
      .then((illnessInjury) => res.json(illnessInjury))
      .catch((err) => res.status(404).json({ success: err }));
  }
);

router.put("/:homeId/:formId/", (req, res) => {
  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  IllnessInjury.updateOne({ _id: req.params.formId }, updatedLastEditDate)
    .then((data) => {
      res.json(updatedLastEditDate);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.delete("/:homeId/:formId/", (req, res) => {
  IllnessInjury.deleteOne({ _id: req.params.formId })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
