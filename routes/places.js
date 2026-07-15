// Routes liées aux lieux.
// Utilisées par l'application React pour afficher la carte.

const express = require('express');

const {
  getPlaces,
  getPlaceById
} = require('../controllers/places.controllers');


const router = express.Router();


// Lecture publique : afficher tous les lieux
router.get('/', getPlaces);


// Lecture publique : détail d'un lieu
router.get('/:id', getPlaceById);


module.exports = router;