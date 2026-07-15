// Routes liées aux observations.
// Permet d'ajouter et de consulter les observations d'ambiance.

const express = require('express');
const {
  createObservation,
  getObservations,
} = require('../controllers/observations.controllers');

const requireApiKey = require('../middleware/auth');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

// Lecture publique, selon la consigne de la phase 1.
router.get('/', getObservations);

// Collecte par capteur.
router.post('/', requireApiKey, createObservation);

// Observation envoyée par un utilisateur connecté.
router.post('/user', authenticateJWT, createObservation);

module.exports = router;