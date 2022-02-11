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
router.post("/confirm", rawBody, async (req, res) => {
  try {
    const rawBody = req.rawBody;
    const signature = req.headers["x-cc-webhook-signature"];
    const webhookSecret = "2100833d-fec5-48c0-b671-89f3b309075b";
    const event = await Webhook.verifyEventBody(
      rawBody,
      signature,
      webhookSecret
    );
    console.log(event);

    // let chargeStatus = { status: "" };
    // if (event.type === "charge:pending") {
    //   chargeStatus.status = "pending";
    //   if (event.data.metadata && event.data.metadata.email) {
    //     await User.updateOne(
    //       { email: event.data.metadata.email },

    //     );
    //   }
    // }
    // if (event.type === "charge:confirmed") {
    //   chargeStatus.status = "confirmed";
    //   if (event.data.metadata && event.data.metadata.email) {
    //     await User.updateOne(
    //       { email: event.data.metadata.email },
    //       { isCoinbasePaymentCompleted: true, isAccountSetupCompleted: true }
    //     );
    //   }
    // }
    // if (event.type === "charge:resolved") {
    //   chargeStatus.status = "confirmed";
    //   if (event.data.metadata && event.data.metadata.email) {
    //     await User.updateOne(
    //       { email: event.data.metadata.email },
    //       { isCoinbasePaymentCompleted: true, isAccountSetupCompleted: true }
    //     );
    //   }
    // }
    // if (event.type === "charge:failed") {
    //   chargeStatus.status = "failed";
    //   await User.updateOne(
    //     { email: event.data.metadata.email },
    //     { isCoinbasePaymentCompleted: false, isAccountSetupCompleted: false }
    //   );
    // }

    res.status(200).json(event);
  } catch (e) {
    console.log(`Failed confirm pay with coinbase ${e}`);
    res.status(500).send(`Coinbase Error ${e}`);
  }
});

module.exports = router;
