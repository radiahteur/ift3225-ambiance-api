// Routes liées aux lieux.
// Utilisées par l'application React pour afficher la carte.

const express = require('express');

const {
  getPlaces,
  getPlaceById
} = require('../controllers/places.controllers');


const router = express.Router();

const { cacheMiddleware } = require('../middleware/cache');

// Lecture publique : afficher tous les lieux
router.get('/', cacheMiddleware(60), getPlaces);


// Lecture publique : détail d'un lieu
router.get('/:id', cacheMiddleware(60), getPlaceById);


module.exports = router;