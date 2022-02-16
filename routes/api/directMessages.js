const express = require("express");
const router = express.Router();
const Home = require("../../models/Home");
const nodemailer = require("nodemailer");

const sendEmail = async (
  toEmail,
  toName,
  homeId,
  homeName,
  fromEmail,
  fromName,
  message
) => {
  const mailClientUser = "admin.support@ecare-software.com"; // mail client
  const mailClientPass = "eCare2020?";

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: mailClientUser,
      pass: mailClientPass,
    },
  });
  const mailOptions = {
    from: mailClientUser, // sender address
    to: toEmail,
    subject: `Hey ${toName}, you have a new direct message`, // Subject line
    html: `<div>
    <h2 style={{color:"black"}}>
      You have a Direct Message from ${fromName} of ${homeName} (${homeId})
    </h2>
    <h4 style={{color:"black"}}>
      Message:
    </h4>
    <p style={{color:"black"}}>
      ${message}
    </p>
    <h4 style={{color:"black"}}>
      To respond please visit the system at <a href="https://ecare-residential.com/" target="_blank" >https://ecare-residential.com/</a>
    </h4>
    </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      error: e,
    };
  }
};

// direct message model
const DirectMessage = require("../../models/DirectMessage");

// @route   GET api/items
// @desc    GET all items
// @access  Public
router.get("/:email/:homeId", (req, res) => {
  console.log(
    `Get Direct Messages for user ${req.params.email} at home ${req.params.homeId} - start`
  );
  DirectMessage.find({
    $or: [
      {
        toID: req.params.email,
      },
      {
        fromID: req.params.email,
      },
    ],
    homeId: req.params.homeId,
  })
    .sort({ date: 1 })
    .then((directMessage) => {
      console.log(
        `Direct Messages for user ${req.params.email} at home ${req.params.homeId} - end`
      );
      res.json(directMessage);
    })
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

router.post("/", async (req, res) => {
  console.log(
    `Posting Direct Message for user ${req.body.toID} at home ${req.body.homeId}`
  );

  var toObj = req.body.toObj;
  var fromObj = req.body.fromObj;
  var toEmail = req.body.toID.toLocaleLowerCase();
  var toName = `${toObj?.firstName} ${toObj?.lastName}`;
  var homeId = req.body.homeId;
  var fromEmail = req.body.fromID;
  var fromName = `${fromObj?.firstName} ${fromObj?.lastName}`;
  var message = req.body.message;
  var date = req.body.date;

  if (
    !toObj ||
    !fromObj ||
    !toEmail ||
    !toName ||
    !homeId ||
    !fromEmail ||
    !fromName ||
    !message ||
    !date
  ) {
    res.status(500).send(`Missing required fields`);
    return;
  }

  const newDirectMessage = new DirectMessage({
    toObj,
    fromObj,
    toID: toEmail,
    fromID: fromEmail,
    message,
    date,
    homeId,
  });

  let directMessage, foundHome;
  try {
    directMessage = await newDirectMessage.save();
  } catch (e) {
    res.status(500).send(`Direct message error ${e}`);
  }

  try {
    [foundHome] = await Home.find({ homeId });
  } catch {
    res.status(200).json(directMessage);
    console.log(`Home fetch error ${e}`);
  }

  const emailResp = await sendEmail(
    toEmail,
    toName,
    homeId,
    foundHome.name,
    fromEmail,
    fromName,
    message
  );

  if (emailResp.success) {
    console.log(
      `Sent email for user ${req.body.toID} at home ${req.body.homeId}`
    );
  } else {
    console.log(
      `Error sending email for user ${req.body.toID} at home ${req.body.homeId}`
    );
  }

  res.status(200).json(directMessage);
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
