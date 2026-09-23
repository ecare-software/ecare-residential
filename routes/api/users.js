const express = require("express");
const router = express.Router();

// user model
const User = require("../../models/User");
const { signAuthToken } = require("../../utils/authToken");
const {
  resolveAuthenticatedUser,
  NOT_AUTHENTICATED_ERROR,
} = require("../../utils/requireUserSignature");
const { isAdminUser } = require("../../utils/adminRoles");
const {
  containsMongoOperatorKey,
  MONGO_OPERATOR_ERROR,
} = require("../../utils/rejectMongoOperators");

// Server-side authorization for account writes. Role-based checks elsewhere
// (e.g. utils/applyCreateDateEdit.js, the Serious Incident Report draft
// owner exception) trust User.jobTitle via isAdminUser, so jobTitle - and
// anything else that decides who a user is or where they belong - may only
// be written by an already-authenticated admin of the same home. A user can
// never grant themselves a role.
const NOT_ADMIN_ERROR = "Only an administrator can make this change.";

// What each kind of caller may write via PUT /:id. Anything else in the
// body is rejected outright rather than silently dropped, so a caller finds
// out their change didn't apply. homeId and isAdmin aren't writable by
// anyone here - moving a user between homes isn't something the app does.
const SELF_EDITABLE_FIELDS = ["password", "newUser"];
const ADMIN_EDITABLE_FIELDS = [
  "firstName",
  "middleName",
  "lastName",
  "jobTitle",
  "email",
  "isActive",
  "password",
  "newUser",
];

// @route   GET api/items
// @desc    GET all items
// @access  Public
router.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/user/:email/:homeId", (req, res) => {
  const { email, homeId } = req.params;
  User.findOne({ email, homeId })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => res.status(404).json({ success: false }));
});

// Login. POST, not GET - credentials belong in the body, not the URL, where
// they'd otherwise end up in browser history, proxy logs, and server access
// logs (undermining the point of the httpOnly auth cookie issued below).
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  User.findOneAndUpdate(
    {
      email: email.toLocaleLowerCase(),
      password: password,
    },
    {
      lastLogIn: new Date().toISOString(),
    },
    { new: true }
  )
    .then((user) => {
      if (user) {
        const token = signAuthToken({ email: user.email });
        res.cookie("authToken", token, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 12 * 60 * 60 * 1000, // 12 hours
        });
      }
      res.json(user);
    })
    .catch((err) => res.status(404).json({ success: false }));
});

// Clears the httpOnly auth cookie set above. JS can't clear an httpOnly
// cookie itself, so logging out server-side requires this route.
router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ success: true });
});

// @route   GET api/items
// @desc    GET all items
// @access  Public
router.get("/:homeId", (req, res) => {
  const { isActive } = req.query;

  User.find({ homeId: req.params.homeId })
    .then((users) => {
      if (isActive !== undefined) {
        const isActiveBool = isActive === "true";
        const filteredUsers = users.filter((u) => u.isActive === isActiveBool);
        res.json(filteredUsers);
      } else {
        res.send(users);
      }
    })
    .catch((err) => res.status(404).json({ success: false }));
});

router.get("/", async (req, res) => {
  const { isActive } = req.query;

  try {
    let users = await User.find();

    if (isActive !== undefined) {
      const isActiveBool = isActive === "true";
      users = users.filter((u) => u.isActive === isActiveBool);
    }

    res.json(users.map(({ firstName, lastName, email, isActive }) => ({
      firstName,
      lastName,
      email,
      isActive,
    })));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST api/items
// @desc    Create an item
// @access  Public
// Admin-only: accounts are created from User Management by an admin, into
// the admin's own home. (LogInContainer.js still has a self sign-up code
// path, but nothing in the UI can reach it - and a public sign-up that
// accepted jobTitle/homeId would let anyone mint an admin account.)
router.post("/", async (req, res) => {
  try {
    const authUser = await resolveAuthenticatedUser(req);
    if (!authUser) {
      return res.status(401).json({ error: NOT_AUTHENTICATED_ERROR });
    }
    if (!isAdminUser(authUser)) {
      return res.status(403).json({ error: NOT_ADMIN_ERROR });
    }
    if (typeof req.body.email !== "string" || !req.body.email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const newUser = new User({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      email: req.body.email.toLocaleLowerCase(),
      password: req.body.password,
      homeId: authUser.homeId,
      jobTitle: req.body.jobTitle,
      newUser: true,
    });
    const user = await newUser.save();
    res.json(user);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Resolves the authenticated caller and the target account for a write to
// /:id, enforcing that both belong to the same home. Returns
// { authUser, target } or { status, body } for an error response.
async function resolveAccountWrite(req) {
  const authUser = await resolveAuthenticatedUser(req);
  if (!authUser) {
    return { status: 401, body: { error: NOT_AUTHENTICATED_ERROR } };
  }
  let target;
  try {
    target = await User.findOne({ _id: req.params.id, homeId: authUser.homeId });
  } catch (e) {
    target = null; // malformed id
  }
  if (!target) {
    return { status: 404, body: { error: "User not found" } };
  }
  return { authUser, target };
}

// @route   PUT api/items
// @desc    Create an item
// @access  Public
// Admins can edit accounts in their own home (profile, role, active state,
// password reset). Everyone else can only change their own password.
router.put("/:id", async (req, res) => {
  try {
    if (containsMongoOperatorKey(req.body)) {
      return res.status(400).json({ error: MONGO_OPERATOR_ERROR });
    }
    const resolved = await resolveAccountWrite(req);
    if (!resolved.authUser) {
      return res.status(resolved.status).json(resolved.body);
    }
    const { authUser, target } = resolved;
    const isSelf = String(target._id) === String(authUser._id);
    const isAdmin = isAdminUser(authUser);

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ error: NOT_ADMIN_ERROR });
    }
    const allowed = isAdmin ? ADMIN_EDITABLE_FIELDS : SELF_EDITABLE_FIELDS;
    const disallowed = Object.keys(req.body || {}).filter((k) => !allowed.includes(k));
    if (disallowed.length > 0) {
      return res.status(403).json({
        error: `Not allowed to change: ${disallowed.join(", ")}`,
      });
    }

    const updates = { ...req.body };
    if (typeof updates.email === "string") {
      updates.email = updates.email.toLocaleLowerCase();
    }
    await User.updateOne({ _id: target._id }, updates);
    const user = await User.findOne({ _id: target._id });
    res.send(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// @route   Delete api/items
// @desc    Delete an item
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    const resolved = await resolveAccountWrite(req);
    if (!resolved.authUser) {
      return res.status(resolved.status).json(resolved.body);
    }
    if (!isAdminUser(resolved.authUser)) {
      return res.status(403).json({ error: NOT_ADMIN_ERROR });
    }
    await resolved.target.remove();
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false });
  }
});

// A profile signature is what forms stamp as proof the user signed, so only
// the user themselves can set it - and only the signature field.
router.put("/sig/:id", async (req, res) => {
  try {
    const resolved = await resolveAccountWrite(req);
    if (!resolved.authUser) {
      return res.status(resolved.status).json(resolved.body);
    }
    const { authUser, target } = resolved;
    if (String(target._id) !== String(authUser._id)) {
      return res.status(403).json({ error: "You can only change your own signature." });
    }
    if (!Array.isArray(req.body.signature)) {
      return res.status(400).json({ error: "signature must be an array" });
    }
    await User.updateOne({ _id: target._id }, { signature: req.body.signature });
    const user = await User.findOne({ _id: target._id });
    res.send(user);
  } catch (err) {
    console.error("Error updating signature:", err);
    res.status(500).json({ error: "Failed to update signature" });
  }
});

module.exports = router;
