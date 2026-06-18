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
    // Moment réel de la mesure, fourni par la collecte.
    // Mongoose ajoute aussi createdAt (timestamps: true), qui représente
    // le moment où le serveur a reçu/enregistré la donnée.
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
    // Phyphox), donc souvent négatif. Pas un dB SPL calibré.
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
