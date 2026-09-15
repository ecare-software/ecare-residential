const express = require("express");
const router = express.Router();

const DailyProgressAndActivity = require("../../models/DailyProgressAndActivity");
const Home = require("../../models/Home");
const {
  resolveHomeScopedUser,
} = require("../../utils/requireUserSignature");
const {
  containsMongoOperatorKey,
  MONGO_OPERATOR_ERROR,
} = require("../../utils/rejectMongoOperators");
const { applyCreateDateEdit } = require("../../utils/applyCreateDateEdit");

// Whether a home requires two signatures before a report can be
// completed - resolved from the persisted Home record's own
// twoSignatures flag, not a hardcoded homeId list (a newly configured
// two-signature home must not silently be treated as single-signature)
// and not any client-supplied value (a direct request could otherwise
// just name a one-signature home to dodge the second-signature
// requirement). Callers must always pass a TRUSTED homeId - the
// authenticated user's own (authUser.homeId) - never req.body.homeId or
// req.params.homeId, which are just caller-supplied claims.
//
// A home genuinely missing its Home record defaults to false (single
// signature), so an unconfigured home doesn't accidentally start
// demanding a second signature nobody set up - that's a resolved "no"
// answer, not a failure. A query FAILURE (DB unreachable, timeout, etc.)
// is not the same thing and must not be treated as one: silently
// defaulting to false during an outage would let a genuinely
// two-signature home complete a report with only one signature, exactly
// when this check matters most. Fail closed instead - assume the
// stricter (two-signature) policy on an indeterminate lookup. That can
// block a legitimate single-signature completion until the outage
// clears, but it can never under-enforce.
async function isTwoSignatureHome(homeId) {
  if (!homeId) return false;
  let home;
  try {
    home = await Home.findOne({ homeId });
  } catch (e) {
    console.error("Error looking up Home for twoSignatures policy:", e);
    return true;
  }
  return !!home?.twoSignatures;
}

function hasSignature(sig) {
  return Array.isArray(sig) && sig.length > 0;
}

// The completion invariant given an already-resolved two-signature flag
// (from isTwoSignatureHome, above) - split out so callers that also need
// to persist the flag can resolve it once and reuse it here, rather than
// looking the home up twice per request.
function meetsSignatureCompletionRequirement(twoSigRequired, signature1, signature2) {
  if (!hasSignature(signature1)) return false;
  if (twoSigRequired && !hasSignature(signature2)) return false;
  return true;
}

const MISSING_SIGNATURE_ERROR =
  "A signature (both caregiver signatures, for two-signature homes) is required before this report can be marked COMPLETED.";

router.post("/", async (req, res) => {
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.body.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }

  const twoSigRequired = await isTwoSignatureHome(authUser.homeId);

  if (
    req.body.status === "COMPLETED" &&
    !meetsSignatureCompletionRequirement(twoSigRequired, req.body.signature1, req.body.signature2)
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

    // Sourced from the verified authenticated user, not the request body -
    // both are permanent audit/tenancy facts about the record and must
    // not be spoofable.
    createdBy: authUser.email,

    createdByName: `${authUser.firstName} ${authUser.lastName}`,

    lastEditDate: new Date().toISOString(),

    createDate: req.body.createDate,

    homeId: authUser.homeId,

    formType: "Daily Activity",
    status: req.body.status,
    signature1: req.body.signature1,
    signature2: req.body.signature2,
    // The actually-resolved policy (see isTwoSignatureHome), not the
    // client's own claim - req.body.twoSignaturesRequired is never
    // trusted for the completion decision above, so it shouldn't be
    // trusted for what gets persisted either.
    twoSignaturesRequired: twoSigRequired,
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
 try {
  // Home-scoped auth is required unconditionally here (not just when
  // completing) - the update predicate below, and the two-signature
  // policy lookup, must be scoped to the authenticated user's own home,
  // which requires knowing who that is on every edit, and req.params.homeId
  // must actually match it.
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }

  // A $-prefixed top-level key in the body is a MongoDB update operator,
  // not a field name - see utils/rejectMongoOperators.js. Without this,
  // a caller could smuggle e.g. { $set: { homeId: "other-home" } }
  // alongside plain fields; MongoDB merges that into the update's
  // effective $set and applies it verbatim, bypassing the
  // createdBy/createdByName/homeId/createDate strip below, which only
  // ever covers those exact top-level key names.
  if (containsMongoOperatorKey(req.body)) {
    return res.status(400).json({ error: MONGO_OPERATOR_ERROR });
  }

  const twoSigRequired = await isTwoSignatureHome(authUser.homeId);

  // The record's status AFTER this update is applied - not just whatever
  // this particular request happens to send. Gating only on
  // `req.body.status === "COMPLETED"` would let a PUT that omits status
  // entirely (leaving an already-COMPLETED report COMPLETED) slip past
  // the signature check while still modifying the report's other fields.
  // Scoped to the authenticated user's own home too - otherwise this
  // fallback could read (and validate against) another tenant's data for
  // a record this request's predicate would never actually be allowed to
  // update.
  let effectiveStatus = req.body.status;
  let existingDoc = null;
  if (
    effectiveStatus === undefined ||
    req.body.signature1 === undefined ||
    req.body.signature2 === undefined
  ) {
    existingDoc = await DailyProgressAndActivity.findOne({
      _id: req.params.formId,
      homeId: authUser.homeId,
    }).select("status signature1 signature2");
  }
  if (effectiveStatus === undefined) {
    effectiveStatus = existingDoc?.status;
  }

  if (effectiveStatus === "COMPLETED") {
    // Fall back to the persisted signatures only when a field is
    // completely absent from the request - if the caller explicitly sent
    // signature1/signature2 (even null, a string, or some other malformed
    // value), validate exactly what they sent, since that's also what
    // gets persisted below via {...req.body}. Falling back to the old
    // (valid) document here while still writing the caller's malformed
    // value would let a COMPLETED record end up with its signature(s)
    // cleared or replaced.
    const signature1 = req.body.signature1 !== undefined ? req.body.signature1 : existingDoc?.signature1;
    const signature2 = req.body.signature2 !== undefined ? req.body.signature2 : existingDoc?.signature2;

    if (!meetsSignatureCompletionRequirement(twoSigRequired, signature1, signature2)) {
      return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
    }
  }

  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  // createdBy/createdByName/homeId/createDate are set once at creation and
  // must stay immutable - strip them from every edit regardless of what
  // the request body claims, rather than letting an edit silently reassign
  // who the original author was, move the record into another tenant, or
  // (createDate) backdate/postdate the creation audit trail. Mirrors
  // routes/api/client.js's identical strip on its Face Sheet update.
  // twoSignaturesRequired is refreshed to the currently resolved policy
  // rather than trusted from the body, for the same reason the completion
  // check above never trusts it.
  delete updatedLastEditDate.createdBy;
  delete updatedLastEditDate.createdByName;
  delete updatedLastEditDate.homeId;
  // originalCreateDate/createDateEditedBy/createDateEditedAt are always
  // server-computed by applyCreateDateEdit below, never taken from the
  // request body.
  delete updatedLastEditDate.originalCreateDate;
  delete updatedLastEditDate.createDateEditedBy;
  delete updatedLastEditDate.createDateEditedAt;
  if (updatedLastEditDate.createDate !== undefined) {
    const existingForCreateDate = await DailyProgressAndActivity.findOne(
      { _id: req.params.formId, homeId: authUser.homeId }
    ).select("createDate originalCreateDate");
    applyCreateDateEdit(updatedLastEditDate, authUser, existingForCreateDate);
  }
  updatedLastEditDate.twoSignaturesRequired = twoSigRequired;
  DailyProgressAndActivity.updateOne(
    // Scoped to the authenticated user's own home, not the URL's :homeId
    // (just a caller-supplied claim) - a record belonging to a different
    // home can never be matched, let alone edited.
    { _id: req.params.formId, homeId: authUser.homeId },
    updatedLastEditDate
  )
    .then((data) => {
      // Mongoose 5's updateOne() result uses the legacy MongoDB driver
      // shape ({ n, nModified, ok }), not matchedCount/modifiedCount
      // (that's Mongoose 6+/the modern driver) - see routes/api/client.js's
      // identical check for the established convention in this codebase.
      // data.matchedCount here is always undefined, which would make this
      // 404 on every successful update.
      if (!data.n) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(updatedLastEditDate);
    })
    .catch((e) => {
      console.log(e);
    });
 } catch (err) {
   // A malformed :formId (or any other unexpected DB error) throws from
   // the findOne preflight lookup above - without this, that rejection
   // would never reach the updateOne(...).catch() below (a separate
   // promise chain it never gets to), and since this is an async Express
   // 4 handler with no built-in async error forwarding, the request would
   // hang with no response instead of getting a clean error.
   console.error("Error updating report:", err);
   res.status(500).json({ error: "Failed to update report" });
 }
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
