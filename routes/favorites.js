// Routes liées aux favoris.
// Toutes les routes nécessitent un utilisateur authentifié.

const express = require('express');

const {
    addFavoriteController,
    removeFavoriteController,
    getFavoritesController
} = require('../controllers/favorites.controllers');

const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();


// Consulter les favoris de l'utilisateur connecté
// GET /favorites
router.get(
    '/',
    authenticateJWT,
    getFavoritesController
);


// Ajouter un lieu aux favoris
// POST /favorites/:placeId
router.post(
    '/:placeId',
    authenticateJWT,
    addFavoriteController
);


// Retirer un lieu des favoris
// DELETE /favorites/:placeId
router.delete(
    '/:placeId',
    authenticateJWT,
    removeFavoriteController
);


module.exports = router;