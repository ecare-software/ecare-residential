const express = require("express");
const router = express.Router();

const DailyProgressAndActivity = require("../../models/DailyProgressAndActivity");

router.post("/", (req, res) => {
  const newDailyProgressAndActivity = new DailyProgressAndActivity({
    childMeta_name: req.body.childMeta_name,

    personal_hygiene: req.body.personal_hygiene,
    dressing: req.body.dressing,
    table_mannders: req.body.table_mannders,
    clothes_maintenace: req.body.clothes_maintenace,
    self_feeding: req.body.self_feeding,
    care_of_property: req.body.care_of_property,
    maintenace_of_personal_space: req.body.maintenace_of_personal_space,
    household_chorse: req.body.household_chorse,
    informal_counseling: req.body.informal_counseling,
    verbal_redirection: req.body.verbal_redirection,
    modeling: req.body.modeling,
    supervised_separation: req.body.supervised_separation,
    provider_feedback_to_client: req.body.provider_feedback_to_client,
    positive_reinforcement: req.body.positive_reinforcement,
    other: req.body.other,
    home_restrictions: req.body.home_restrictions,
    restricted_leisure_activity: req.body.restricted_leisure_activity,
    no_allowance: req.body.no_allowance,
    other2: req.body.other2,
    no_of_home_incidents: req.body.no_of_home_incidents,
    no_of_home_serious_incidents: req.body.no_of_home_serious_incidents,
    no_of_home_restraints: req.body.no_of_home_restraints,
    no_of_school_incidents: req.body.no_of_school_incidents,
    no_of_school_restraints: req.body.no_of_school_restraints,
    illness_injury: req.body.illness_injury,
    level_of_supervison: req.body.level_of_supervison,
    summary_of_daily_schedule: req.body.summary_of_daily_schedule,
    summary_of_behavior_at_school: req.body.summary_of_behavior_at_school,
    summary_of_behavior_at_home: req.body.summary_of_behavior_at_home,
    therapeutic_recreational: req.body.therapeutic_recreational,
    therapeutic_value: req.body.therapeutic_value,
    phone_calls_or_visits: req.body.phone_calls_or_visits,

    createdBy: req.body.createdBy,

    createdByName: req.body.createdByName,

    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    homeId: req.body.homeId,

    formType: "Daily Activity",
  });

  newDailyProgressAndActivity
    .save()
    .then((dailyProgressAndActivity) => res.json(dailyProgressAndActivity))
    .catch((e) => {
      e;
    });
});

router.get("/:homeId", (req, res) => {
  DailyProgressAndActivity.find({ homeId: req.params.homeId })
    .sort({ lastEditDate: -1 })
    .exec()
    .then((dailyProgressAndActivities) => res.json(dailyProgressAndActivities))
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

    DailyProgressAndActivity.find(findObj)
      .sort({ lastEditDate: -1 })
      .exec()
      .then((dailyProgressAndActivities) =>
        res.json(dailyProgressAndActivities)
      )
      .catch((err) => res.status(404).json({ success: err }));
  }
);

router.put("/:homeId/:formId/", (req, res) => {
  const updatedLastEditDate = {...req.body, lastEditDate: new Date()}
  DailyProgressAndActivity.findByIdAndUpdate(
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
