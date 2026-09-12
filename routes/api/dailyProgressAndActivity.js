const express = require("express");
const router = express.Router();

const DailyProgressAndActivity = require("../../models/DailyProgressAndActivity");

// Same rule the client uses to decide whether a home requires two
// signatures before a report can be completed (see
// DailyProgressAndActivity.js's doGetHomeInfo). Derived independently from
// homeId here rather than trusted from req.body.twoSignaturesRequired -
// that field is client-supplied and a direct API request could otherwise
// just send `twoSignaturesRequired: false` to skip the second-signature
// requirement entirely.
//TODO add twoSignatureRequired to home API - keep in sync with the client's copy of this rule until it is
function isTwoSignatureHome(homeId) {
  return homeId === "home-3" || homeId === "home-1234";
}

function hasSignature(sig) {
  return Array.isArray(sig) && sig.length > 0;
}

// The completion invariant: signature1 is always required, and signature2
// is additionally required for two-signature homes. Mirrors the client's
// missingRequiredSignature check in DailyProgressAndActivity.js - that
// only protects the UI, so this is the server-side backstop for it.
function meetsSignatureCompletionRequirement(homeId, signature1, signature2) {
  if (!hasSignature(signature1)) return false;
  if (isTwoSignatureHome(homeId) && !hasSignature(signature2)) return false;
  return true;
}

const MISSING_SIGNATURE_ERROR =
  "A signature (both caregiver signatures, for two-signature homes) is required before this report can be marked COMPLETED.";

router.post("/", (req, res) => {
  if (
    req.body.status === "COMPLETED" &&
    !meetsSignatureCompletionRequirement(req.body.homeId, req.body.signature1, req.body.signature2)
  ) {
    return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
  }


  const newDailyProgressAndActivity = new DailyProgressAndActivity({
    childMeta_name: req.body.childMeta_name,

    incident_type: req.body.incident_type,
    nature_of_incident: req.body.nature_of_incident,
    other_incident_description: req.body.other_incident_description,
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

    createDate: req.body.createDate,

    homeId: req.body.homeId,

    formType: "Daily Activity",
    status: req.body.status,
    signature1: req.body.signature1,
    signature2: req.body.signature2,
    twoSignaturesRequired: req.body.twoSignaturesRequired,
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
    .sort({ createDate: -1 }).setOptions({ allowDiskUse: true })
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
        $options: "i",
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
      findObj.approved = req.params.approved;
    }

    DailyProgressAndActivity.find(findObj)
      .sort({ createDate: -1 }).setOptions({ allowDiskUse: true }).exec()
      .then((dailyProgressAndActivities) =>
        res.json(dailyProgressAndActivities)
      )
      .catch((err) => res.status(404).json({ success: err }));
  }
);

router.put("/:homeId/:formId/", async (req, res) => {
  if (req.body.status === "COMPLETED") {
    // Fall back to the persisted signatures only when a field is
    // completely absent from the request - if the caller explicitly sent
    // signature1/signature2 (even null, a string, or some other malformed
    // value), validate exactly what they sent, since that's also what
    // gets persisted below via {...req.body}. Falling back to the old
    // (valid) document here while still writing the caller's malformed
    // value would let a COMPLETED record end up with its signature(s)
    // cleared or replaced.
    let { signature1, signature2 } = req.body;
    if (signature1 === undefined || signature2 === undefined) {
      const existing = await DailyProgressAndActivity.findById(req.params.formId).select(
        "signature1 signature2"
      );
      if (signature1 === undefined) signature1 = existing?.signature1;
      if (signature2 === undefined) signature2 = existing?.signature2;
    }

    if (!meetsSignatureCompletionRequirement(req.params.homeId, signature1, signature2)) {
      return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
    }
  }

  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  DailyProgressAndActivity.updateOne(
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
  DailyProgressAndActivity.deleteOne({ _id: req.params.formId })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
