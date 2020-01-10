const express = require("express");
const router = express.Router();

// direct message model
const DirectMessage = require("../../models/DirectMessage");

// @route   GET api/items
// @desc    GET all items
// @access  Public
router.get("/:id", (req, res) => {
  DirectMessage.findById(req.params.id)
    .then(directMessage => res.json(directMessage))
    .catch(err => res.status(404).json({ success: false }));
});

// @route   GET api/items
// @desc    GET all items
// @access  Public
router.get("/", (req, res) => {
    DirectMessage.find()
      .then(directMessage => res.json(directMessage))
  });

// @route   POST api/items
// @desc    Create an item
// @access  Public

router.post("/", (req, res) => {
  const newDirectMessage = new DirectMessage({
    to: req.body.to,
    from:req.body.from,
    message:req.body.message,
  });

  newDirectMessage.save().then(directMessage => res.json(directMessage));
});

// @route   Delete api/items
// @desc    Delete an item
// @access  Public
router.delete("/:id", (req, res) => {
  DirectMessage.findById(req.params.id)
    .then(directMessage => directMessage.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;