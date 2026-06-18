// Contrôleur des mesures.
// Gère l'enregistrement et la récupération des données provenant des capteurs. 

const Measurement = require('../models/measurements');

function magnitude(x, y, z) {
  if ([x, y, z].some((value) => typeof value !== 'number')) return undefined;
  return Number(Math.sqrt(x * x + y * y + z * z).toFixed(4));
}

async function createMeasurement(req, res, next) {
  try {
    const body = { ...req.body };

    if (body.location) {
      body.location = body.location.toLowerCase();
    }

    if (body.acceleration) {
      body.acceleration.magnitude = magnitude(
        body.acceleration.x,
        body.acceleration.y,
        body.acceleration.z
      );
    }

    if (body.gyroscope) {
      body.gyroscope.magnitude = magnitude(
        body.gyroscope.x,
        body.gyroscope.y,
        body.gyroscope.z
      );
    }

    const measurement = await Measurement.create(body);
    res.status(201).json({ success: true, data: measurement });
  } catch (error) {
    next(error);
  }
}

async function getMeasurements(req, res, next) {
  try {
    const filter = {};

    if (req.query.location) {
      filter.location = req.query.location.toLowerCase();
    }

    if (req.query.deviceId) {
      filter.deviceId = req.query.deviceId;
    }

    if (req.query.from || req.query.to) {
      filter.timestamp = {};
      if (req.query.from) filter.timestamp.$gte = new Date(req.query.from);
      if (req.query.to) filter.timestamp.$lte = new Date(req.query.to);
    }

    const limit = Math.min(Number(req.query.limit || 100), 500);

    const measurements = await Measurement.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: measurements.length,
      data: measurements,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createMeasurement, getMeasurements };
