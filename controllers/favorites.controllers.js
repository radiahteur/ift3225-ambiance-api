// Contrôleur des favoris.
// Permet à un utilisateur connecté d'ajouter, retirer et consulter ses lieux favoris.

const {
    addFavorite,
    removeFavorite,
    getFavorites
} = require('../services/favorites.service');


// Ajouter un lieu aux favoris
async function addFavoriteController(req, res, next) {

    try {

        const favorite = await addFavorite(
            req.user.id,
            req.params.placeId
        );

        res.status(201).json({
            success: true,
            data: favorite
        });

    } catch (error) {

        if (error.code === 'PLACE_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                error: {
                    code: error.code,
                    message: error.message
                }
            });
        }

        if (error.code === 'ALREADY_FAVORITE') {
            return res.status(409).json({
                success: false,
                error: {
                    code: error.code,
                    message: error.message
                }
            });
        }

        next(error);
    }
}


// Retirer un lieu des favoris
async function removeFavoriteController(req, res, next) {

    try {

        await removeFavorite(
            req.user.id,
            req.params.placeId
        );

        res.status(200).json({
            success: true,
            message: 'Favorite removed successfully'
        });

    } catch (error) {

        if (
            error.code === 'NOT_FAVORITE' ||
            error.code === 'USER_NOT_FOUND'
        ) {
            return res.status(404).json({
                success: false,
                error: {
                    code: error.code,
                    message: error.message
                }
            });
        }

        next(error);
    }
}


// Récupérer les favoris de l'utilisateur connecté
async function getFavoritesController(req, res, next) {

    try {

        const favorites = await getFavorites(req.user.id);

        res.status(200).json({
            success: true,
            count: favorites.length,
            data: favorites
        });

    } catch (error) {

        next(error);
    }
}


module.exports = {
    addFavoriteController,
    removeFavoriteController,
    getFavoritesController
};