const express = require("express");
const router = express.Router();

const BodyCheck = require("../../models/BodyCheck");

router.post("/", (req, res) => {
  const newBodyCheck = new BodyCheck({
    childMeta_name: req.body.childMeta_name,
    childMeta_gender: req.body.childMeta_gender,
    injury: req.body.injury,
    amPm: req.body.amPm,
    examiner_name: req.body.examiner_name,
    examiner_title: req.body.examiner_title,
    examin_date: req.body.examin_date,
    nurse_designee_name: req.body.nurse_designee_name,
    nurse_designee_title: req.body.nurse_designee_title,
    nurse_designee_date: req.body.nurse_designee_date,
    head: req.body.head,
    left_ear: req.body.left_ear,
    right_ear: req.body.right_ear,
    left_eye: req.body.left_eye,
    right_eye: req.body.right_eye,
    nose: req.body.nose,
    mouth: req.body.mouth,
    chin: req.body.chin,
    neck: req.body.neck,
    left_shoulder: req.body.left_shoulder,
    right_shoulder: req.body.right_shoulder,
    left_arm: req.body.left_arm,
    right_arm: req.body.right_arm,
    left_hand: req.body.left_hand,
    right_hand: req.body.right_hand,
    chest: req.body.chest,
    back: req.body.back,
    stomach: req.body.stomach,
    left_hip: req.body.left_hip,
    right_hip: req.body.right_hip,
    left_leg: req.body.left_leg,
    right_leg: req.body.right_leg,
    left_knee: req.body.left_knee,
    right_knee: req.body.right_knee,
    left_ankle: req.body.left_ankle,
    right_ankle: req.body.right_ankle,
    left_foot: req.body.left_foot,
    right_foot: req.body.right_foot,
    createdBy: req.body.createdBy,
    createdByName: req.body.createdByName,

    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    homeId: req.body.homeId,

    formType: "Health Body Check",
  });

  newBodyCheck
    .save()
    .then((bodyCheck) => res.json(bodyCheck))
    .catch((e) => {
      e;
    });
});

router.get("/:homeId", (req, res) => {
  BodyCheck.find({ homeId: req.params.homeId })
    .sort({ lastEditDate: -1 })
    .exec()
    .then((bodyCheck) => res.json(bodyCheck))
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
          lastEditDate: {
            $gt: new Date(
              dateAfter.setDate(dateAfter.getDate() + 1)
            ).toISOString(),
          },
        },
        {
          lastEditDate: {
            $lt: new Date(
              dateBefore.setDate(dateBefore.getDate())
            ).toISOString(),
          },
        },
      ];
    } else {
      //submittedAfter
      if (req.params.lastEditDateAfter !== "none") {
        var date = new Date(req.params.lastEditDateAfter);
        findObj.lastEditDate = {
          $gt: new Date(date.setDate(date.getDate() + 1)).toISOString(),
        };
      }

      //submittedBefore
      if (req.params.lastEditDateBefore !== "none") {
        var date = new Date(req.params.lastEditDateBefore);
        findObj.lastEditDate = {
          $lt: new Date(date.setDate(date.getDate())).toISOString(),
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

    BodyCheck.find(findObj)
      .sort({ lastEditDate: -1 })
      .exec()
      .then((bodyCheck) => res.json(bodyCheck))
      .catch((err) => res.status(404).json({ success: err }));
  }
);

router.put("/:homeId/:formId/", (req, res) => {
  BodyCheck.findByIdAndUpdate({ _id: req.params.formId }, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
