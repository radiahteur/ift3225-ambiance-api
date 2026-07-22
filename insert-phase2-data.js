require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Place = require('./models/places');
const Measurement = require('./models/measurements');

const measurementsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'measurements_data.json'), 'utf-8')
);

const places = [
  {
    name: 'Rue Hébert (Mercier)',
    location: 'mercier',
    latitude: 45.318166,
    longitude: -73.739002,
    description: 'Rue résidentielle passante, secteur Mercier.',
  },
  {
    name: 'Rue Druillettes (Saint-Léonard)',
    location: 'saint-leonard',
    latitude: 45.5836,
    longitude: -73.5872,
    description: 'Arrière d\'un commerce, quartier résidentiel de Saint-Léonard.',
  },
  {
    name: 'Place d\'Armes',
    location: 'place-darmes',
    latitude: 45.504722,
    longitude: -73.557222,
    description: 'Rue passante du Vieux-Montréal.',
  },
];

const deviceIds = {
  mercier: 'phyphox-iphone17-2',
  'saint-leonard': 'phyphox-iphone14-3',
  'place-darmes': 'phyphox-iphone15-3',
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connecté à MongoDB');

  // 1. Créer ou mettre à jour les 3 lieux
  for (const place of places) {
    const result = await Place.findOneAndUpdate(
      { location: place.location },
      place,
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`Lieu prêt : ${result.name} (${result.location})`);
  }

  // 2. Retirer toute mesure existante pour ces 3 lieux (nettoyage avant réinsertion)
  const locations = Object.keys(measurementsData);
  const del = await Measurement.deleteMany({ location: { $in: locations } });
  console.log(`${del.deletedCount} ancienne(s) mesure(s) supprimée(s) pour : ${locations.join(', ')}`);

  // 3. Insérer les nouvelles mesures
  let totalInserted = 0;

  for (const [location, points] of Object.entries(measurementsData)) {
    const docs = points.map((p) => ({
      deviceId: deviceIds[location],
      location,
      timestamp: new Date(p.timestamp),
      soundLevelDb: p.soundLevelDb,
    }));

    const inserted = await Measurement.insertMany(docs);
    console.log(`${inserted.length} mesures insérées pour ${location}`);
    totalInserted += inserted.length;
  }

  console.log(`\nTerminé. ${totalInserted} mesures insérées au total.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Erreur pendant l\'insertion :', err);
  process.exit(1);
});
