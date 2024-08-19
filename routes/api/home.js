const express = require("express");
const router = express.Router();

const Home = require("../../models/Home");

router.get("/:homeId", (req, res) => {
  Home.find({ homeId: req.params.homeId })
    .then((home) => res.json(home))
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
