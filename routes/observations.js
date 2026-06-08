const express = require("express");
const router = express.Router();
const Observation = require("../models/observations");
const auth = require("../middleware/auth");

// CREATE OBSERVATION
router.post("/", auth, async (req, res) => {
  const obs = new Observation(req.body);
  await obs.save();

  res.status(201).json(obs);
});

module.exports = router;