const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/:email/:name/:organization", (req, res) => {
  var email = req.params.email.toLocaleLowerCase();
  var name = req.params.name;
  var organization = req.params.organization;
  const user = "admin.support@ecare-software.com";
  const pass = "eCare2020?";

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
  const mailOptions = {
    from: user, // sender address
    to: email,
    subject: `Hello ${name}, from eCare Residential`, // Subject line
    html: `<div>
    <p>
      Thank you for reaching out.
    </p>
    <p>
      We would like to set up time to discuss our residential care software. ${
        organization !== "null"
          ? `We believe that we could help you and ${organization}`
          : ""
      }
    </p>
    <p>
      Please use Google calender link <a href="https://calendar.google.com/calendar/u/0/selfsched?sstoken=UU5xNUFsRWU0U3JUfGRlZmF1bHR8YTZiM2YwNWIxMjBjYWFkNzVkMzZhNTkyOTVhOGVkYmI"
      target="_blank"
      style="color:blue"
      >
  here
      </a> to schedule a time for demo or simply respond to this email and 
      we shall respond promptly.
    </p>
    
    <p>
      Thank you, <br/>
      eCare Residential
    </p>
    </div>`,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      res.json({ success: true });
    } else res.json({ success: false });
  });
});

router.get("/", (req, res) => {
  res.json({ success: true });
});

module.exports = router;
