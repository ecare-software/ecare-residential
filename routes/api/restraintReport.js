const express = require("express");
const router = express.Router();

const RestraintReport = require("../../models/RestraintReport");

router.post("/", (req, res) => {
  const newRestraintReport = new RestraintReport({
    childMeta_name: req.body.childMeta_name,

    childMeta_gender: req.body.childMeta_gender,

    childMeta_dob: req.body.childMeta_dob,

    childMeta_dateOfAdmission: req.body.childMeta_dateOfAdmission,

    dateOfIncident: req.body.dateOfIncident,

    staff_involved_name: req.body.staff_involved_name,

    staff_involved_gender: req.body.staff_involved_gender,

    time_of_incident: req.body.time_of_incident,

    staff_witness_name: req.body.staff_witness_name,

    staff_witness_gender: req.body.staff_witness_gender,

    client_witness_name1: req.body.client_witness_name1,

    client_witness_gender1: req.body.client_witness_gender1,

    client_witness_dob1: req.body.client_witness_dob1,

    client_witness_doa1: req.body.client_witness_doa1,

    client_witness_name2: req.body.client_witness_name2,

    client_witness_gender2: req.body.client_witness_gender2,

    client_witness_dob2: req.body.client_witness_dob2,

    client_witness_doa2: req.body.client_witness_doa2,

    incident_explaination: req.body.incident_explaination,

    seperation: req.body.seperation,

    result: req.body.result,

    able_to_prevent: req.body.able_to_prevent,

    notification_made_to: req.body.notification_made_to,

    notification_made_date_time: req.body.notification_made_date_time,

    notification_made_by: req.body.notification_made_by,

    follow_up_results: req.body.follow_up_results,

    risk_explaination: req.body.risk_explaination,

    risk_alternative_strategies: req.body.risk_alternative_strategies,

    type_of_restraint: req.body.type_of_restraint,

    risk_stategies_used: req.body.risk_stategies_used,

    result_of_incident: req.body.result_of_incident,

    injuries: req.body.injuries,

    action_taken: req.body.action_taken,

    restraint_start_time: req.body.restraint_start_time,

    restraint_end_time: req.body.restraint_end_time,

    notification_made_date_time: req.body.notification_made_date_time,

    interviewer: req.body.interviewer,

    date_of_interview: req.body.date_of_interview,

    client_behavior: req.body.client_behavior,

    client_responce: req.body.client_responce,

    client_restraint_description: req.body.client_restraint_description,

    procedural_approved_reason: req.body.procedural_approved_reason,

    procedural_approved_standards: req.body.procedural_approved_standards,

    procedural_any_injuries: req.body.procedural_any_injuries,

    procedural_comments: req.body.procedural_comments,

    createdBy: req.body.createdBy,

    createdByName: req.body.createdByName,

    lastEditDate: new Date().toISOString(),

    createDate: req.body.createDate
      ? req.body.createDate
      : new Date().toISOString(),

    homeId: req.body.homeId,

    formType: "Restraint Report",
  });

  newRestraintReport
    .save()
    .then((restraintReport) => res.json(restraintReport))
    .catch((e) => {
      console.log(e);
    });
});

router.get("/:homeId", (req, res) => {
  RestraintReport.find({ homeId: req.params.homeId })
    .sort({ createDate: -1 })
    .exec()
    .then((RestraintReports) => res.json(RestraintReports))
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

    RestraintReport.find(findObj)
      .sort({ createDate: -1 })
      .exec()
      .then((restraintReports) => res.json(restraintReports))
      .catch((err) => res.status(404).json({ success: err }));
  }
);

router.put("/:homeId/:formId/", (req, res) => {
  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  RestraintReport.updateOne({ _id: req.params.formId }, updatedLastEditDate)
    .then((data) => {
      res.json(updatedLastEditDate);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.delete("/:homeId/:formId/", (req, res) => {
  RestraintReport.deleteOne({ _id: req.params.formId })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
