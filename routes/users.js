// Routes liées aux utilisateurs.
// Gestion de l'inscription, connexion et espace compte.

const express = require('express');

const {
    register,
    login,
    getMe,
    getMyObservations,
    addFavoritePlace,
    removeFavoritePlace
} = require('../controllers/users.controllers');


const authenticateJWT = require('../middleware/authenticateJWT');



const router = express.Router();


// Création d'un compte
// POST /users/register
router.post('/register', register);


// Connexion
// POST /users/login
router.post('/login', login);


// Profil de l'utilisateur connecté
// GET /users/me
router.get('/me', authenticateJWT, getMe);


// Observations envoyées par l'utilisateur connecté
// GET /users/me/observations
router.get(
    '/me/observations',
    authenticateJWT,
    getMyObservations
);


// Ajouter un lieu aux favoris
// POST /users/me/favorites/:placeId
router.post(
    '/me/favorites/:placeId',
    authenticateJWT,
    addFavoritePlace
);


// Retirer un lieu des favoris
// DELETE /users/me/favorites/:placeId
router.delete(
    '/me/favorites/:placeId',
    authenticateJWT,
    removeFavoritePlace
);

module.exports = router;