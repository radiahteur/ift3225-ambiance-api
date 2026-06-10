const express = require('express');
const {
  getHistory,
  getQuietHours,
  getComfortScore,
} = require('../controllers/ambiance.controllers');

const router = express.Router();

// Tous les endpoints GET sont publics (selon consigne)
router.get('/:location/history', getHistory);
router.get('/:location/quiet-hours', getQuietHours);
router.get('/:location/comfort-score', getComfortScore);

module.exports = router;
