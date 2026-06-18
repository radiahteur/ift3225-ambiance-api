// Modèle Measurement.
// Stocke les données collectées par les capteurs telles que le niveau sonore, la lumière et le mouvement.

const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    acceleration: {
      x: Number,
      y: Number,
      z: Number,
      magnitude: Number,
    },
    gyroscope: {
      x: Number,
      y: Number,
      z: Number,
      magnitude: Number,
    },
    soundLevelDb: Number,
    lightLevelLux: Number,
    raw: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

measurementSchema.index({ location: 1, timestamp: -1 });
measurementSchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model('Measurement', measurementSchema);
