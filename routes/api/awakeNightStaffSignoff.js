const express = require("express");
const router = express.Router();

const AwakeNightStaffSignoff = require("../../models/AwakeNightStaffSignoff");

router.post("/", (req, res) => {
  const newAwakeNightStaffSignoff = new AwakeNightStaffSignoff({
    ts1Approval: req.body.ts1Approval,
    ts2Approval: req.body.ts2Approval,
    ts3Approval: req.body.ts3Approval,
    ts4Approval: req.body.ts4Approval,
    ts5Approval: req.body.ts5Approval,
    ts6Approval: req.body.ts6Approval,
    ts7Approval: req.body.ts7Approval,
    ts8Approval: req.body.ts8Approval,
    ts9Approval: req.body.ts9Approval,
    ts10Approval: req.body.ts10Approval,
    ts11Approval: req.body.ts11Approval,
    ts12Approval: req.body.ts12Approval,
    ts13Approval: req.body.ts13Approval,
    ts14Approval: req.body.ts14Approval,
    ts15Approval: req.body.ts15Approval,
    ts16Approval: req.body.ts16Approval,
    ts17Approval: req.body.ts17Approval,
    ts18Approval: req.body.ts18Approval,
    ts19Approval: req.body.ts19Approval,
    ts20Approval: req.body.ts20Approval,
    ts21Approval: req.body.ts21Approval,
    ts22Approval: req.body.ts22Approval,
    ts23Approval: req.body.ts23Approval,
    ts24Approval: req.body.ts24Approval,
    ts25Approval: req.body.ts25Approval,
    ts26Approval: req.body.ts26Approval,
    ts27Approval: req.body.ts27Approval,
    ts28Approval: req.body.ts28Approval,
    ts29Approval: req.body.ts29Approval,
    ts30Approval: req.body.ts30Approval,
    ts31Approval: req.body.ts31Approval,
    ts32Approval: req.body.ts32Approval,
    ts33Approval: req.body.ts33Approval,
    ts34Approval: req.body.ts34Approval,
    ts35Approval: req.body.ts35Approval,
    ts36Approval: req.body.ts36Approval,
    ts37Approval: req.body.ts37Approval,
    ts38Approval: req.body.ts38Approval,
    ts39Approval: req.body.ts39Approval,
    ts40Approval: req.body.ts40Approval,

    createdBy: req.body.createdBy,

    createdByName: req.body.createdByName,

    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    homeId: req.body.homeId,

    formType: "Awake Night Staff Signoff",
  });
  newAwakeNightStaffSignoff
    .save()
    .then((awakeNightStaffSignoff) => res.json(awakeNightStaffSignoff))
    .catch((e) => {
      e;
    });
});

router.get("/:homeId", (req, res) => {
  AwakeNightStaffSignoff.find({ homeId: req.params.homeId })
    .sort({ createDate: -1 })
    .exec()
    .then((awakeNightStaffSignoff) => res.json(awakeNightStaffSignoff))
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/:homeId/:email", (req, res) => {
  AwakeNightStaffSignoff.find({
    homeId: req.params.homeId,
    createdBy: req.params.email,
  })
    .sort({ createDate: -1 })
    .exec()
    .then((awakeNightStaffSignoff) => res.json(awakeNightStaffSignoff))
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

    //child date of birth
    if (
      req.params.childDOBAfter !== "none" &&
      req.params.childDOBBefore !== "none"
    ) {
      var dobAfter = new Date(req.params.childDOBAfter);
      var dobBefore = new Date(req.params.childDOBBefore);
      findObj["$and"] = [
        {
          childMeta_dob: {
            $gt: new Date(
              dobAfter.setDate(dobAfter.getDate() + 1)
            ).toISOString(),
          },
        },
        {
          childMeta_dob: {
            $lt: new Date(dobBefore.setDate(dobBefore.getDate())).toISOString(),
          },
        },
      ];
    } else {
      //submittedAfter
      if (req.params.childDOBAfter !== "none") {
        var date = new Date(req.params.childDOBAfter);
        findObj.childMeta_dob = {
          $gt: new Date(date.setDate(date.getDate() + 1)),
        };
      }

      //submittedBefore
      if (req.params.childDOBBefore !== "none") {
        var date = new Date(req.params.childDOBBefore);
        findObj.childMeta_dob = {
          $lt: new Date(date.setDate(date.getDate())),
        };
      }
    }

    //child date of admission
    if (
      req.params.childDOAAfter !== "none" &&
      req.params.childDOABefore !== "none"
    ) {
      var doaAfter = new Date(req.params.childDOAAfter);
      var doaBefore = new Date(req.params.childDOABefore);
      findObj["$and"] = [
        {
          childMeta_dateOfAdmission: {
            $gte: new Date(
              doaAfter.setDate(doaAfter.getDate() + 1)
            ).toISOString(),
          },
        },
        {
          childMeta_dateOfAdmission: {
            $lte: new Date(
              doaBefore.setDate(doaBefore.getDate())
            ).toISOString(),
          },
        },
      ];
    } else {
      //submittedAfter
      if (req.params.childDOAAfter !== "none") {
        var date = new Date(req.params.childDOAAfter);
        findObj.childMeta_dateOfAdmission = {
          $gt: new Date(date.setDate(date.getDate() + 1)),
        };
      }

      //submittedBefore
      if (req.params.childDOABefore !== "none") {
        var date = new Date(req.params.childDOABefore);
        findObj.childMeta_dateOfAdmission = {
          $lt: new Date(date.setDate(date.getDate())),
        };
      }
    }
    // submitted by
    if (req.params.submittedByA !== "none") {
      findObj.createdBy = req.params.submittedByA;
    }

    if (req.params.approved !== "null") {
      findObj.approved = req.params.approved;
    }

    AwakeNightStaffSignoff.find(findObj)
      .sort({ createDate: -1 })
      .exec()
      .then((incidentReports) => res.json(incidentReports))
      .catch((err) => res.status(404).json({ success: err }));
  }
);

router.get("/:homeId" + "/:submittedByA" + "/:lastEditDate", (req, res) => {
  var findObj = {
    homeId: req.params.homeId,
  };

  // submitted by
  if (req.params.submittedByA !== "none") {
    findObj.createdBy = req.params.submittedByA;
  }

  AwakeNightStaffSignoff.find(findObj)
    .sort({ createDate: -1 })
    .exec()
    .then((awakeNightStaffSignoff) => res.json(awakeNightStaffSignoff))
    .catch((err) => res.status(404).json({ success: err }));
});

router.put("/:formId", (req, res) => {
  AwakeNightStaffSignoff.updateOne({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.put("/:homeId/:formId/", (req, res) => {
  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  AwakeNightStaffSignoff.updateOne(
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

router.delete("/:homeId/:formId/", (req, res) => {
  AwakeNightStaffSignoff.deleteOne({ _id: req.params.formId })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
