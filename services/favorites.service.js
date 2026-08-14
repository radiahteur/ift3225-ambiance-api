const User = require('../models/users');
const Place = require('../models/places');


// Ajouter un lieu aux favoris
async function addFavorite(userId, placeId) {

    const place = await Place.findById(placeId);

    if (!place) {
        const error = new Error('Place not found');
        error.code = 'PLACE_NOT_FOUND';
        throw error;
    }

    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.code = 'USER_NOT_FOUND';
        throw error;
    }

    // Vérifier si le lieu est déjà dans les favoris
    if (user.favorites.some(id => id.toString() === placeId.toString())) {
        const error = new Error('Place already in favorites');
        error.code = 'ALREADY_FAVORITE';
        throw error;
    }

    user.favorites.push(placeId);

    await user.save();

    return Place.findById(placeId);
}


// Retirer un lieu des favoris
async function removeFavorite(userId, placeId) {

    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.code = 'USER_NOT_FOUND';
        throw error;
    }

    const isFavorite = user.favorites.some(
        id => id.toString() === placeId.toString()
    );

    if (!isFavorite) {
        const error = new Error('Place is not in favorites');
        error.code = 'NOT_FAVORITE';
        throw error;
    }

    user.favorites = user.favorites.filter(
        id => id.toString() !== placeId.toString()
    );

    await user.save();

    return true;
}


// Récupérer les favoris d'un utilisateur
async function getFavorites(userId) {

    const user = await User.findById(userId)
        .populate('favorites');

    if (!user) {
        const error = new Error('User not found');
        error.code = 'USER_NOT_FOUND';
        throw error;
    }

    return user.favorites;
}


module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites
};