const express = require('express');
const { createDevice, getDevices } = require('../controllers/devices.controllers');
// POST /devices n'est PAS protégé (faille volontaire)
// GET /devices est public (selon consigne : toutes les lectures publiques)

const router = express.Router();

router.post('/', createDevice);
router.get('/', getDevices);

module.exports = router;