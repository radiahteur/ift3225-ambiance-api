const express = require('express');
const {
  createObservation,
  getObservations,
} = require('../controllers/observations.controllers');
const requireApiKey = require('../middleware/auth');

const router = express.Router();

// Lecture publique, selon la consigne de la phase 1.
router.get('/', getObservations);

// Écriture protégée par API key.
router.post('/', requireApiKey, createObservation);

module.exports = router;