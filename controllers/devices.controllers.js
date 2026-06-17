// Contrôleur des devices.
// Gère la création et la consultation des appareils enregistrés.

const Device = require('../models/devices');

async function createDevice(req, res, next) {
  try {
    const device = await Device.create(req.body);
    res.status(201).json({ success: true, data: device });
  } catch (error) {
    if (error.code === 11000) {
      error.status = 409;
      error.code = 'DUPLICATE_DEVICE';
      error.message = 'A device with this deviceId already exists.';
    }
    next(error);
  }
}

async function getDevices(req, res, next) {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });
    res.json({ success: true, count: devices.length, data: devices });
  } catch (error) {
    next(error);
  }
}

module.exports = { createDevice, getDevices };
