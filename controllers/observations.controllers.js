const Observation = require('../models/observations');

async function createObservation(req, res, next) {
  try {
    const body = { ...req.body };

    if (body.location) {
      body.location = body.location.toLowerCase();
    }

    const observation = await Observation.create(body);
    res.status(201).json({ success: true, data: observation });
  } catch (error) {
    next(error);
  }
}

async function getObservations(req, res, next) {
  try {
    const filter = {};

    if (req.query.location) {
      filter.location = req.query.location.toLowerCase();
    }

    if (req.query.deviceId) {
      filter.deviceId = req.query.deviceId;
    }

    const limit = Math.min(Number(req.query.limit || 100), 500);

    const observations = await Observation.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: observations.length,
      data: observations,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createObservation, getObservations };
