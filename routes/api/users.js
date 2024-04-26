const express = require("express");
const router = express.Router();

// user model
const User = require("../../models/User");

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

// @route   GET api/items
// @desc    GET all items
// @access  Public
router.get("/:email/:password", (req, res) => {
  User.findOneAndUpdate(
    {
      email: req.params.email.toLocaleLowerCase(),
      password: req.params.password,
    },
    {
      lastLogIn: new Date().toISOString(),
    },
    { new: true }
  )
    .then((user) => {
      res.json(user);
    })
    .catch((err) => res.status(404).json({ success: false }));
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
router.post("/", (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    email: req.body.email.toLocaleLowerCase(),
    password: req.body.password,
    homeId: req.body.homeId,
    jobTitle: req.body.jobTitle,
    isAdmin: req.body.isAdmin,
    newUser: true,
  });
  newUser.save().then((user) => res.json(user));
});

// @route   PUT api/items
// @desc    Create an item
// @access  Public
router.put("/:id", (req, res) => {
  User.updateOne({ _id: req.params.id }, req.body).then(function () {
    User.findOne({ _id: req.params.id }).then((user) => {
      res.send(user);
    });
  });
});

// @route   Delete api/items
// @desc    Delete an item
// @access  Public
router.delete("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => user.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
});

router.put("/sig/:id", (req, res) => {
  User.updateOne({ _id: req.params.id }, req.body).then(function () {
    User.findOne({ _id: req.params.id }).then((user) => {
      res.send(user);
    });
  });
});

module.exports = router;
