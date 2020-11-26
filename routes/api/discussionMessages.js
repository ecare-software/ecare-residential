const express = require("express");
const router = express.Router();

// direct message model
const DiscussionMessage = require("../../models/DiscussionMessage");

// @route   GET api/items
// @desc    GET all items
// @access  Public
// router.get("/:id", (req, res) => {
//   DiscussionMessage.findById(req.params.id)
//     .then(discussionMessage => res.json(discussionMessage))
//     .catch(err => res.status(404).json({ success: false }));
// });

// @route   GET api/items
// @desc    GET all items
// @access  Public
router.get("/:homeId", (req, res) => {
  if (req.params.homeId) {
    console.log(`Get Discussion Messages for home ${req.params.homeId}`);
    DiscussionMessage.find({ homeId: req.params.homeId })
      .sort({ date: -1 })
      .then((discussionMessage) => {
        console.log(
          `Success getting Discussion Messages for home - ${req.params.homeId}`
        );
        res.json(discussionMessage);
      });
  } else {
    console.log(`Geting Discussion Messages for every home `);
    DiscussionMessage.find()
      .sort({ date: -1 })
      .then((discussionMessage) => {
        console.log(`Geting Discussion Messages for every home `);
        res.json(discussionMessage);
      });
  }
});

// @route   POST api/items
// @desc    Create an item
// @access  Public

router.post("/", (req, res) => {
  console.log(
    `Attempting to post Discussion Message for home ${req.body.homeId} by user ${req.body.id} - start`
  );
  const newDiscussionMessage = new DiscussionMessage({
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    id: req.body.id,
    homeId: req.body.homeId,
    date: req.body.date,
    message: req.body.message,
  });

  newDiscussionMessage.save().then((discussionMessage) => {
    console.log(
      `Success posting Discussion Message for home ${req.body.homeId} - end`
    );
    res.json(discussionMessage);
  });
});

// @route   Delete api/items
// @desc    Delete an item
// @access  Public
router.delete("/:id", (req, res) => {
  DiscussionMessage.findById(req.params.id)
    .then((discussionMessage) =>
      discussionMessage.remove().then(() => res.json({ success: true }))
    )
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
