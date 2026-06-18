// Modèle Observation.
// Stocke les observations humaines sur l'ambiance d'un lieu (vibe, proximité, notes).

const mongoose = require('mongoose');

const observationSchema = new mongoose.Schema(
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
    observer: {
      type: String,
      default: 'team',
    },
    crowdLevel: {
      type: String,
      enum: ['empty', 'low', 'medium', 'high'],
      required: true,
    },
    ambiance: {
      type: String,
      enum: ['quiet', 'normal', 'noisy', 'very_noisy'],
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

observationSchema.index({ location: 1, timestamp: -1 });

module.exports = mongoose.model('Observation', observationSchema);
