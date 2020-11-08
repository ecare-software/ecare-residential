const express = require("express");
const router = express.Router();

// direct message model
const DirectMessage = require("../../models/DirectMessage");

// @route   GET api/items
// @desc    GET all items
// @access  Public
router.get("/:email", (req, res) => {
  DirectMessage.find({
    $or: [
      {
        toID: req.params.email,
      },
      {
        fromID: req.params.email,
      },
    ],
  })
    .sort({ date: 1 })
    .then((directMessage) => res.json(directMessage))
    .catch((err) => res.status(404).json({ success: false }));
});

// @route   GET api/items
// @desc    GET all items
// @access  Public
router.get("/", (req, res) => {
  DirectMessage.find().then((directMessage) => res.json(directMessage));
});

// @route   POST api/items
// @desc    Create an item
// @access  Public

router.post("/", (req, res) => {
  const newDirectMessage = new DirectMessage({
    toObj: req.body.toObj,
    fromObj: req.body.fromObj,
    toID: req.body.toID,
    fromID: req.body.fromID,
    message: req.body.message,
    date: req.body.date,
  });

  newDirectMessage.save().then((directMessage) => res.json(directMessage));
});

// @route   Delete api/items
// @desc    Delete an item
// @access  Public
router.delete("/:id", (req, res) => {
  DirectMessage.findById(req.params.id)
    .then((directMessage) =>
      directMessage.remove().then(() => res.json({ success: true }))
    )
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
