const express = require("express");
const router = express.Router();
const Measurement = require("../models/measurements");
const auth = require("../middleware/auth");

// CREATE MEASUREMENT
router.post("/", auth, async (req, res) => {
  const data = new Measurement({
    type: req.body.type,
    value: req.body.value,
    location: req.body.location,
    timestamp: req.body.timestamp
  });

  await data.save();

  res.status(201).json(data);
});

module.exports = router;