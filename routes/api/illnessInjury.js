const express = require("express");
const router = express.Router();

const IllnessInjury = require("../../models/IllnessInjury");
const {
  resolveHomeScopedUser,
  hasValidSignature,
  MISSING_SIGNATURE_ERROR,
} = require("../../utils/requireUserSignature");

router.post("/", async (req, res) => {
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.body.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }

  if (req.body.status === "COMPLETED" && !hasValidSignature(authUser)) {
    return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
  }

  const newIllnessInjury = new IllnessInjury({
    childMeta_name: req.body.childMeta_name,

    createdBy: authUser.email,

    createdByName: `${authUser.firstName} ${authUser.lastName}`,

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

    createDate: req.body.createDate,

    // Sourced from the authenticated user, not the request body - a
    // record must belong to its creator's own home, never a home the
    // caller merely names.
    homeId: authUser.homeId,

    formType: "Illness Injury",
    status: req.body.status,
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
    .sort({ createDate: -1 }).setOptions({ allowDiskUse: true })
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
      .sort({ createDate: -1 }).setOptions({ allowDiskUse: true })
      .exec()
      .then((illnessInjury) => res.json(illnessInjury))
      .catch((err) => res.status(404).json({ success: err }));
  }
);

router.put("/:homeId/:formId/", async (req, res) => {
 try {
  // Home-scoped auth is required unconditionally here (not just when
  // completing) - the update predicate below must be scoped to the
  // authenticated user's own home, which requires knowing who that is on
  // every edit, and req.params.homeId must actually match it.
  const { authUser, errorResponse } = await resolveHomeScopedUser(req, req.params.homeId);
  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.body);
  }

  // The record's status AFTER this update is applied - not just
  // whatever this particular request happens to send. Gating only on
  // `req.body.status === "COMPLETED"` would let a PUT that omits status
  // entirely (leaving an already-COMPLETED record COMPLETED) slip past
  // the signature check while still modifying the record's other fields.
  let effectiveStatus = req.body.status;
  if (effectiveStatus === undefined) {
    const existing = await IllnessInjury.findOne({
      _id: req.params.formId,
      homeId: authUser.homeId,
    }).select("status");
    effectiveStatus = existing?.status;
  }

  if (effectiveStatus === "COMPLETED" && !hasValidSignature(authUser)) {
    return res.status(400).json({ error: MISSING_SIGNATURE_ERROR });
  }

  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  // createdBy/createdByName/homeId are set once at creation and must stay
  // immutable - strip them from every edit regardless of what the request
  // body claims, rather than letting an edit silently reassign who the
  // original author was or move the record into another tenant.
  delete updatedLastEditDate.createdBy;
  delete updatedLastEditDate.createdByName;
  delete updatedLastEditDate.homeId;
  IllnessInjury.updateOne(
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
  IllnessInjury.deleteOne({ _id: req.params.formId })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
