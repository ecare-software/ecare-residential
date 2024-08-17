const express = require("express");
const router = express.Router();

const Home = require("../../models/Home");

router.get("/:homeId", (req, res) => {
  Home.find({ homeId: req.params.homeId })
    .then((home) => res.json(home))
    .catch((err) => res.status(404).json({ success: false }));
});

router.put("/:homeId/twoSignatures", (req, res) => {
  const twoSignaturesTrue = {...req.body, twoSignatures: true };
  Home.updateOne({_id: req.params.homeId}, twoSignaturesTrue)
  .then((data) => {
    res.json(twoSignaturesTrue)
  })
  .catch((e) => {
    console.log(e);
  });
})

module.exports = router;
