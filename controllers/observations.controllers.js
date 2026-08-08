// Contrôleur des observations.
// Gère les requêtes HTTP liées aux observations.

const {
    createObservation: createObservationService,
    getObservations: getObservationsService
} = require('../services/observations.service');

async function createObservation(req, res, next) {
    try {
        const body = { ...req.body };

        if (body.location) {
            body.location = body.location.trim().toLowerCase();
        }

        // Si la requête provient d'un utilisateur connecté,
        // on associe automatiquement son identifiant.
        if (req.user) {
            body.author = req.user.id;
        }

        const observation = await createObservationService(body);

        res.status(201).json({
            success: true,
            data: observation
        });

    } catch (error) {
        next(error);
    }
}

async function getObservations(req, res, next) {
    try {
        const filter = {};

        if (req.query.location) {
            filter.location = req.query.location
                .trim()
                .toLowerCase();
        }

        if (req.query.deviceId) {
            filter.deviceId = req.query.deviceId;
        }

        // Filtrage par plage de dates
        if (req.query.from || req.query.to) {
            filter.timestamp = {};

            if (req.query.from) {
                filter.timestamp.$gte = new Date(req.query.from);
            }

            if (req.query.to) {
                filter.timestamp.$lte = new Date(req.query.to);
            }
        }

        const limit = Math.min(
            Number(req.query.limit || 100),
            500
        );

        const observations = await getObservationsService(
            filter,
            limit
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

module.exports = {
    createObservation,
    getObservations
};