// Contrôleur des utilisateurs.
// Gère les requêtes HTTP liées aux utilisateurs.

const {
    registerUser,
    loginUser,
    getUserById,
    getUserObservations,
    addFavorite,
    removeFavorite
} = require('../services/users.service');

// Création d'un compte utilisateur
async function register(req, res, next) {
    try {
        const {
            username,
            email,
            password
        } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "MISSING_FIELDS",
                    message: "Username, email and password are required"
                }
            });
        }

        const user = await registerUser(
            username,
            email,
            password
        );

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        if (error.code === 'EMAIL_EXISTS') {
            return res.status(400).json({
                success: false,
                error: {
                    code: "EMAIL_EXISTS",
                    message: "Email already used"
                }
            });
        }

        next(error);
    }
}

// Connexion
async function login(req, res, next) {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "MISSING_FIELDS",
                    message: "Email and password are required"
                }
            });
        }

        const { user, token } = await loginUser(
            email,
            password
        );

        res.status(200).json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }
        });

    } catch (error) {
        if (error.code === 'INVALID_CREDENTIALS') {
            return res.status(401).json({
                success: false,
                error: {
                    code: "INVALID_CREDENTIALS",
                    message: "Email ou mot de passe incorrect"
                }
            });
        }

        next(error);
    }
}

// Informations de l'utilisateur connecté
async function getMe(req, res, next) {
    try {
        const user = await getUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "USER_NOT_FOUND",
                    message: "User not found"
                }
            });
        }

        res.json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                favorites: user.favorites
            }
        });

    } catch (error) {
        next(error);
    }
}

// Observations envoyées par l'utilisateur
async function getMyObservations(req, res, next) {
    try {
        const observations = await getUserObservations(
            req.user.id
        );

        res.json({
            success: true,
            count: observations.length,
            data: observations
        });

    } catch (error) {
        next(error);
    }
}

// Ajoute un lieu aux favoris de l'utilisateur connecté
async function addFavoritePlace(req, res, next) {
    try {
        const user = await addFavorite(req.user.id, req.params.placeId);

        res.json({
            success: true,
            data: {
                favorites: user.favorites
            }
        });

    } catch (error) {
        next(error);
    }
}

// Retire un lieu des favoris de l'utilisateur connecté
async function removeFavoritePlace(req, res, next) {
    try {
        const user = await removeFavorite(req.user.id, req.params.placeId);

        res.json({
            success: true,
            data: {
                favorites: user.favorites
            }
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    getMe,
    getMyObservations,
    addFavoritePlace,
    removeFavoritePlace
};