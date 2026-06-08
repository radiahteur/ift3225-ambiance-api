const express = require("express");
const router = express.Router();
const Measurement = require("../models/measurements");
const Observation = require("../models/observations");

// HISTORY
router.get("/:location/history", async (req, res) => {
  const data = await Measurement.find({ location: req.params.location });

  res.json({
    location: req.params.location,
    count: data.length,
    data
  });
});

// QUIET HOURS (simple version)
router.get("/:location/quiet-hours", async (req, res) => {
  const data = await Measurement.find({ location: req.params.location });

  const sorted = data.sort((a, b) => a.value - b.value);

  res.json({
    location: req.params.location,
    quietest: sorted.slice(0, 5)
  });
});

module.exports = router;