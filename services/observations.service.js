

const Observation = require('../models/observations');

async function createObservation(data) {
    return Observation.create(data);
}

async function getObservations(filters, limit = 100) {
    return Observation.find(filters)
        .sort({ timestamp: -1 })
        .limit(limit);
}

module.exports = {
    createObservation,
    getObservations
};