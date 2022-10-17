const express = require("express");
const router = express.Router();
const { Webhook } = require("coinbase-commerce-node");
function rawBody(req, res, next) {
  req.setEncoding("utf8");

  var data = "";

  req.on("data", function (chunk) {
    data += chunk;
  });

  req.on("end", function () {
    req.rawBody = data;

    next();
  });
}
router.post("/confirm", async (req, res) => {
  try {
    if (req.body && req.body.event) {
      const event = req.body.event;
      if (event.type === "charge:confirmed") {
        console.log("do user data stuff");
        // if (event.data.metadata && event.data.metadata.email) {
        //   await User.updateOne(
        //     { email: event.data.metadata.email },
        //     { isCoinbasePaymentCompleted: true, isAccountSetupCompleted: true }
        //   );
        // }
      }
      res.status(200).json(event);
    } else {
      res.status(500).send(`Coinbase Error ${e} - bad request body`);
    }
  } catch (e) {
    console.log(`Failed confirm pay with coinbase ${e}`);
    res.status(500).send(`Coinbase Error ${e}`);
  }
});

module.exports = router;
