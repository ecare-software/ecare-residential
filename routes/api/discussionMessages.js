const express = require("express");
const router = express.Router();

// direct message model
const DiscussionMessage = require("../../models/DiscussionMessage");

router.get("/:homeId", (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page-1)*limit;
  const endIndex = page*limit;
  // const result = discussionMessage.slice(startIndex, endIndex)
  if (req.params.homeId) {
    console.log(
      `Get Discussion Messages for home ${req.params.homeId} - start`
    );
    DiscussionMessage.find({ homeId: req.params.homeId })
      .sort({ date: -1 })
      .then((discussionMessage) => {
        console.log(
          `getting Discussion Messages for home - ${req.params.homeId} - end`
        );
        res.json(discussionMessage.slice(startIndex, endIndex));
      });
  } else {
    console.log(`Getting Discussion Messages for every home - start`);
    DiscussionMessage.find()
      .sort({ date: -1 })
      .then((discussionMessage) => {
        console.log(`Discussion Messages for every home - end `);
        res.json(discussionMessage.slice(startIndex, endIndex));
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
    console.log(`posting Discussion Message for home ${req.body.homeId} - end`);
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
