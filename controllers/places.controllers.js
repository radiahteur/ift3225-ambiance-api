// Contrôleur des lieux.
// Gère la consultation des lieux utilisés par la carte React.

const Place = require('../models/places');


// Retourne tous les lieux
async function getPlaces(req, res, next) {
  try {

    const places = await Place.find()
      .sort({ name: 1 });


    res.json({
      success: true,
      count: places.length,
      data: places
    });


  } catch (error) {
    next(error);
  }
}


// Retourne un lieu par son identifiant MongoDB
async function getPlaceById(req, res, next) {

  try {

    const place = await Place.findById(req.params.id);


    if (!place) {
      return res.status(404).json({
        success:false,
        error:{
          code:"PLACE_NOT_FOUND",
          message:"Place not found"
        }
      });
    }


    res.json({
      success:true,
      data:place
    });


  } catch(error) {
    next(error);
  }

}


module.exports = {
  getPlaces,
  getPlaceById
};