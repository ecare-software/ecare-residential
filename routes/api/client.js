
const express = require("express");
const router = express.Router();

const Client = require("../../models/Client");
const User = require("../../models/User");
const { verifyAuthToken } = require("../../utils/authToken");

// Job titles allowed to create/edit a Face Sheet (mirrors
// client/src/utils/FaceSheetEditRoles.js on the frontend).
const FACESHEET_EDIT_ROLES = ["Administrator", "Case/Manager", "Owner/CEO"];

// Face Sheet fields that must be non-empty, and the "none known" checkbox
// pairs where either the checkbox or the free-text field must be filled in.
// (mirrors validateForm() in client/src/components/Forms/FaceSheet.js)
const REQUIRED_FACESHEET_FIELDS = [
  { key: "childMeta_name", label: "Child's Name" },
  { key: "childMeta_dob", label: "Date of Birth" },
  { key: "childMeta_dateOfAdmission", label: "Date of Admission" },
  { key: "childMeta_caseWorker", label: "Case Worker Name" },
];

const ALLERGY_FIELD_PAIRS = [
  { textKey: "food1", flagKey: "noFoodAllergies", label: "Food Allergies" },
  {
    textKey: "drugAllergies",
    flagKey: "noDrugAllergies",
    label: "Medicine Allergies",
  },
  {
    textKey: "allergies",
    flagKey: "noKnownAllergies",
    label: "Other Allergies",
  },
];

// This route also serves the lightweight Activate/Deactivate toggle from
// Clients.js, which PUTs only `{ active }` and should stay available to any
// staff regardless of Face Sheet edit role. Every other request - every
// POST (create), and any PUT whose body is anything other than exactly
// { active } - must pass full Face Sheet authorization/validation below.
//
// Previously this was gated on the presence of childMeta_name, which let a
// caller bypass both requireFaceSheetEditAccess and validateFaceSheetFields
// entirely just by omitting that one field from an otherwise arbitrary
// POST/PUT payload (e.g. PUT { childMeta_caseWorker: "..." } with no
// childMeta_name would skip every check). isActiveOnlyToggle only exempts
// the one narrow, known-safe payload shape instead of trusting the absence
// of a single field.
const isActiveOnlyToggle = (req) => {
  if (req.method !== "PUT") return false;
  const keys = Object.keys(req.body || {});
  return keys.length === 1 && keys[0] === "active";
};

// Identity comes from the httpOnly authToken cookie (set at login, see
// routes/api/users.js), verified server-side - not a client-supplied field.
// Role is still looked up fresh from the DB on every request (not cached in
// the token), so a role change/demotion takes effect immediately.
//
// Authentication is required unconditionally, even for the { active }
// toggle - isActiveOnlyToggle only exempts the toggle from the Face Sheet
// editor *role* check below (any logged-in staff member may use it, same
// as the un-role-gated button in Clients.js), not from being logged in at
// all. Skipping auth entirely for the toggle would let a fully anonymous,
// unauthenticated caller flip active/inactive on any record.
//
// Also requires the authenticated user's own homeId (looked up fresh, not
// client-supplied) to match the home this request claims to act on -
// req.params.homeId for PUT, req.body.homeId for POST. Neither the URL nor
// the body's homeId is trusted by itself: the actual DB query in each route
// handler below scopes by req.authUser.homeId (set here), not by the
// client-supplied value, so a record belonging to a different home can
// never be read or written even if this check were somehow satisfied with
// a mismatched claim.
const requireFaceSheetEditAccess = async (req, res, next) => {
  const decoded = verifyAuthToken(req.cookies?.authToken);
  if (!decoded) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }

  try {
    const user = await User.findOne({ email: decoded.email });
    const claimedHomeId = req.params.homeId || req.body.homeId;
    if (!user || !claimedHomeId || claimedHomeId !== user.homeId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to modify this Face Sheet",
      });
    }

    if (
      !isActiveOnlyToggle(req) &&
      !FACESHEET_EDIT_ROLES.includes(user.jobTitle)
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to edit the Face Sheet",
      });
    }

    req.authUser = user;
    next();
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Error verifying permissions" });
  }
};

const validateFaceSheetFields = (req, res, next) => {
  if (isActiveOnlyToggle(req)) {
    return next();
  }

  const errors = [];

  // We already know (isActiveOnlyToggle, above) that this is a genuine Face
  // Sheet write, not the { active }-only toggle - so every one of these
  // fields is required, whether the key is present-but-empty or omitted
  // from the body entirely.
  REQUIRED_FACESHEET_FIELDS.forEach(({ key, label }) => {
    const value = req.body[key];
    if (!value || (typeof value === "string" && !value.trim())) {
      errors.push(label);
    }
  });

  ALLERGY_FIELD_PAIRS.forEach(({ textKey, flagKey, label }) => {
    const textValue = req.body[textKey];
    const textFilled =
      typeof textValue === "string" && textValue.trim().length > 0;
    if (!req.body[flagKey] && !textFilled) {
      errors.push(`${label} (enter allergies or check the "none known" box)`);
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Please complete the following field(s): ${errors.join(
        ", "
      )}`,
    });
  }

  next();
};

router.post(
  "/",
  requireFaceSheetEditAccess,
  validateFaceSheetFields,
  (req, res) => {
    const newClient = new Client({
      childMeta_name: req.body.childMeta_name,
      childMeta_photo: req.body.childMeta_photo,
      childMeta_gender: req.body.childMeta_gender,
      childMeta_dob: req.body.childMeta_dob,
      childMeta_age: req.body.childMeta_age,
      childMeta_religion: req.body.childMeta_religion,
      childMeta_ethnicity: req.body.childMeta_ethnicity,
      childMeta_dateOfAdmission: req.body.childMeta_dateOfAdmission,
      childMeta_dischargeDate: req.body.childMeta_dischargeDate,
      childMeta_typeOfStay: req.body.childMeta_typeOfStay,
      childMeta_medicaidNumber: req.body.childMeta_medicaidNumber,
      childMeta_cpsNumber: req.body.childMeta_cpsNumber,
      childMeta_ssn: req.body.childMeta_ssn,
      childMeta_caseWorker: req.body.childMeta_caseWorker,
      childMeta_caseWorkerPONumber: req.body.childMeta_caseWorkerPONumber,
      childMeta_referralAgency: req.body.childMeta_referralAgency,
      childMeta_referralDate: req.body.childMeta_referralDate,
      childMeta_levelOfCare: req.body.childMeta_levelOfCare,
      childMeta_levelOfCareOther: req.body.childMeta_levelOfCareOther,
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
      noFoodAllergies: req.body.noFoodAllergies,
      drugAllergies: req.body.drugAllergies,
      noDrugAllergies: req.body.noDrugAllergies,
      allergies: req.body.allergies,
      noKnownAllergies: req.body.noKnownAllergies,
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
  }
);

// Get single client by ID
router.get("/:clientId/:homeId/", (req, res) => {
  Client.findById({ _id: req.params.clientId })
    .then((client) => res.json(client))
    .catch((err) => res.status(404).json({ success: false }));
});

// Get all clients in a home
router.get("/:homeId", (req, res) => {
  const activeFilter = req.query.active;
  const filter = { homeId: req.params.homeId };
  if (activeFilter) {
    filter.active = true;
  }
  Client.find(filter)
    .sort({ childMeta_name: -1 })
    .exec()
    .then((clients) => res.json(clients))
    .catch((err) => res.status(404).json({ success: false }));
});

// Update a client by ID
router.put(
  "/:homeId/:id/",
  requireFaceSheetEditAccess,
  validateFaceSheetFields,
  (req, res) => {
    const updatedLastEditDate = { ...req.body, lastEditDate: new Date() };
    // Never let a record change which home owns it via this route.
    delete updatedLastEditDate.homeId;
    Client.updateOne(
      { _id: req.params.id, homeId: req.authUser.homeId },
      updatedLastEditDate
    )
      .then((data) => {
        if (!data.n) {
          return res
            .status(404)
            .json({ success: false, message: "Client not found" });
        }
        res.json(data);
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json({ success: false });
      });
  }
);

router.delete("/:homeId/:id/", async (req, res) => {
  const decoded = verifyAuthToken(req.cookies?.authToken);
  if (!decoded) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }

  let user;
  try {
    user = await User.findOne({ email: decoded.email });
    if (
      !user ||
      req.params.homeId !== user.homeId ||
      !FACESHEET_EDIT_ROLES.includes(user.jobTitle)
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this Face Sheet",
      });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Error verifying permissions" });
  }

  // Scope by the verified user's own homeId, not the client-supplied URL
  // param, so a record belonging to a different home can never be deleted.
  Client.deleteOne({ _id: req.params.id, homeId: user.homeId })
    .then((data) => {
      if (!data.deletedCount) {
        return res
          .status(404)
          .json({ success: false, message: "Client not found" });
      }
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ success: false });
    });
});

// NOTE: this second PUT handler on the same path is unreachable - Express
// dispatches only the first matching handler above. Left as-is; pre-existing,
// unrelated to the changes here.
router.put("/:homeId/:id/", (req, res) => {
  const active = req.body.active;
  Client.updateOne({ _id: req.params.id }, { active })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
