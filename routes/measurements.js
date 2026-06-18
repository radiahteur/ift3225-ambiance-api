// Routes liées aux mesures.
// Permet la collecte et la consultation des donnéesdes capteurs.

const express = require('express');
const {
  createMeasurement,
  getMeasurements,
} = require('../controllers/measurements.controllers');
const requireApiKey = require('../middleware/auth');

const router = express.Router();

// Lecture publique, selon la consigne de la phase 1.
router.get('/', getMeasurements);

// Écriture protégée par API key.
router.post('/', requireApiKey, createMeasurement);

module.exports = router;
