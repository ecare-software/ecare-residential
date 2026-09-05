const express = require("express");
const router = express.Router();

// direct message model
const DiscussionMessage = require("../../models/DiscussionMessage");

// Message-board photo attachment: allowed formats and max raw (decoded) size.
// (mirrors the check in client/src/components/MessageBoard/MessageBoard.js)
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const IMAGE_DATA_URI_RE =
  /^data:image\/(png|jpe?g|gif|webp);base64,([A-Za-z0-9+/]+=*)$/i;

const validateMessageImage = (req, res, next) => {
  const { image } = req.body;
  if (!image) {
    return next();
  }

  const match = IMAGE_DATA_URI_RE.exec(image);
  if (!match) {
    return res.status(400).json({
      success: false,
      message: "Attached image must be a PNG, JPEG, GIF, or WEBP image",
    });
  }

  const base64Data = match[2];
  const padding = (base64Data.match(/=*$/) || [""])[0].length;
  const byteLength = (base64Data.length * 3) / 4 - padding;

  if (byteLength > MAX_IMAGE_BYTES) {
    return res.status(400).json({
      success: false,
      message: `Attached image is too large (max ${Math.floor(
        MAX_IMAGE_BYTES / (1024 * 1024)
      )}MB)`,
    });
  }

  next();
};

router.get("/:homeId", (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page-1)*limit;
  const endIndex = page*limit;
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

router.post("/", validateMessageImage, (req, res) => {
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
    image: req.body.image,
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
