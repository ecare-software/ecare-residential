const express = require("express");
const router = express.Router();

const Client = require("../../models/Client");

router.post("/", (req, res) => {
  const newClient = new Client({
    childMeta_name: req.body.childMeta_name,
    childMeta_gender: req.body.childMeta_gender,
    childMeta_dob: req.body.childMeta_dob,
    childMeta_age: req.body.childMeta_age,
    childMeta_religion: req.body.childMeta_religion,
    childMeta_ethnicity: req.body.childMeta_ethnicity,
    childMeta_dateOfAdmission: req.body.childMeta_dateOfAdmission,
    childMeta_medicaidNumber: req.body.childMeta_medicaidNumber,
    childMeta_cpsNumber: req.body.childMeta_cpsNumber,
    childMeta_ssn: req.body.childMeta_ssn,
    childMeta_caseWorker: req.body.childMeta_caseWorker,
    childMeta_caseWorkerPONumber: req.body.childMeta_caseWorkerPONumber,
    childMeta_levelOfCare: req.body.childMeta_levelOfCare,
    childMeta_region: req.body.childMeta_region,
    childMeta_county: req.body.childMeta_county,
    childMeta_streetAddress: req.body.childMeta_streetAddress,
    childMeta_state: req.body.childMeta_state,
    childMeta_city: req.body.childMeta_city,
    childMeta_zipcode: req.body.childMeta_zipcode,
    childMeta_placeOfBirth_streetAddress:
      req.body.childMeta_placeOfBirth_streetAddress,
    childMeta_placeOfBirth_state: req.body.childMeta_placeOfBirth_state,
    childMeta_placeOfBirth_city: req.body.childMeta_placeOfBirth_city,
    childMeta_placeOfBirth_zipcode: req.body.childMeta_placeOfBirth_zipcode,
    food1: req.body.food1,
    drugAllergies: req.body.drugAllergies,
    allergies: req.body.allergies,
    chronicHealthConditions: req.body.chronicHealthConditions,
    createdBy: req.body.createdBy,
    createdByName: req.body.createdByName,
    lastEditDate: new Date().toISOString(),

    createDate: new Date().toISOString(),

    homeId: req.body.homeId,
  });

  newClient
    .save()
    .then((client) => res.json(client))
    .catch((e) => {
      e;
    });
});

// Get single client by ID
router.get("/:clientId/:homeId/", (req, res) => {
  Client.findById({ _id: req.params.clientId })
    .then((client) => res.json(client))
    .catch((err) => res.status(404).json({ success: false }));
});

// Get all clients in a home
router.get("/:homeId", (req, res) => {
  Client.find({ homeId: req.params.homeId })
    .sort({ childMeta_name: -1 })
    .exec()
    .then((clients) => res.json(clients))
    .catch((err) => res.status(404).json({ success: false }));
});

// Update a client by ID
router.put("/:homeId/:id/", (req, res) => {
  const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
  Client.updateOne({ _id: req.params.id }, updatedLastEditDate)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.delete("/:homeId/:id/", (req, res) => {
  Client.deleteOne({ _id: req.params.id })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
