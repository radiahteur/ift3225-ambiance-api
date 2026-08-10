

const Place = require('../models/places');

async function getPlaces() {
return Place.find().sort({ name: 1 });
}

async function getPlaceById(placeId) {
return Place.findById(placeId);
}

async function createPlace(data) {
return Place.create(data);
}

async function findPlaceByLocation(location) {
return Place.findOne({
location: location.trim().toLowerCase()
});
}

module.exports = {
getPlaces,
getPlaceById,
createPlace,
findPlaceByLocation
};
