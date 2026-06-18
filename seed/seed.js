// Données de test.
// Script de seed — peuple la base avec des données de démonstration
// (devices, mesures, observations) pour tester les endpoints de
// consultation sans avoir à effectuer une collecte complète.
//
// Usage : node seed/seed.js
//
// Les mesures de soundLevelDb ci-dessous sont des échantillons RÉELS
// extraits de 3 sessions Phyphox (Audio Amplitude) enregistrées dans
// la cour avant ("cour_avant") :
//   - Session 1 : 8 juin 2026, ~05h48-06h08 (heure locale, très tôt matin)
//   - Session 2 : 8 juin 2026, ~08h42-09h04 (heure locale, matinée)
//   - Session 3 : 10 juin 2026, ~02h16-02h49 (heure locale, nuit)
//
// Note sur l'échelle : Phyphox retourne un niveau sonore relatif au
// plein-échelle du micro (dBFS), donc des valeurs négatives. Ce n'est
// PAS un dB SPL calibré. classifyNoise() dans le contrôleur ambiance
// est calibré sur cette échelle (voir rapport, section "Limites").

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Device = require('../models/devices');
const Measurement = require('../models/measurements');
const Observation = require('../models/observations');

const devices = [
  {
    deviceId: 'phone001',
    name: 'iPhone - Cour avant',
    location: 'cour_avant',
    type: 'phone',
    description: 'Téléphone utilisé pour les sessions de collecte Phyphox (amplitude audio).',
  },
];

const observations = [
  {
    deviceId: 'phone001',
    location: 'cour_avant',
    timestamp: new Date('2026-06-08T09:50:00.000Z'), // ~05h50 heure locale
    observer: 'team',
    crowdLevel: 'empty',
    ambiance: 'quiet',
    notes: 'Session 1 - très tôt le matin, rue déserte, quelques bruits de vent.',
  },
  {
    deviceId: 'phone001',
    location: 'cour_avant',
    timestamp: new Date('2026-06-08T12:50:00.000Z'), // ~08h50 heure locale
    observer: 'team',
    crowdLevel: 'low',
    ambiance: 'normal',
    notes: 'Session 2 - matinée, début de circulation et passages occasionnels.',
  },
  {
    deviceId: 'phone001',
    location: 'cour_avant',
    timestamp: new Date('2026-06-10T06:30:00.000Z'), // ~02h30 heure locale
    observer: 'team',
    crowdLevel: 'empty',
    ambiance: 'quiet',
    notes: 'Session 3 - nuit, aucune activité, environnement très calme.',
  },
];

const measurements = [
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:48:14.947192Z"), soundLevelDb: -65.53 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:48:49.025762Z"), soundLevelDb: -61.16 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:49:22.822731Z"), soundLevelDb: -60.99 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:49:56.636962Z"), soundLevelDb: -61.09 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:50:30.251776Z"), soundLevelDb: -56.92 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:51:04.196351Z"), soundLevelDb: -61.28 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:51:38.101096Z"), soundLevelDb: -61.62 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:52:11.954788Z"), soundLevelDb: -61.98 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:52:45.808356Z"), soundLevelDb: -62.18 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:53:19.407708Z"), soundLevelDb: -60.25 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:53:53.055097Z"), soundLevelDb: -61.08 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:54:26.865340Z"), soundLevelDb: -59.08 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:55:00.734912Z"), soundLevelDb: -62.94 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:55:34.547194Z"), soundLevelDb: -61.98 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:56:08.425722Z"), soundLevelDb: -61.65 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:56:42.135651Z"), soundLevelDb: -61.95 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:57:15.823198Z"), soundLevelDb: -59.39 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:57:49.701133Z"), soundLevelDb: -57.17 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:58:23.544709Z"), soundLevelDb: -60.53 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:58:57.404964Z"), soundLevelDb: -61.46 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T09:59:31.238044Z"), soundLevelDb: -62.31 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T10:00:04.905383Z"), soundLevelDb: -61.73 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T10:00:38.823340Z"), soundLevelDb: -61.35 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T10:01:12.617466Z"), soundLevelDb: -60.01 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T10:01:46.481351Z"), soundLevelDb: -60.73 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T10:02:20.361364Z"), soundLevelDb: -61.58 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T10:02:53.953803Z"), soundLevelDb: -58.47 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T10:03:27.793890Z"), soundLevelDb: -61.34 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T10:04:01.544427Z"), soundLevelDb: -60.07 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T10:04:35.244342Z"), soundLevelDb: -60.5 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T10:05:09.133432Z"), soundLevelDb: -61.34 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T10:05:43.016699Z"), soundLevelDb: -60.0 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T10:06:16.847359Z"), soundLevelDb: -59.99 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T10:06:50.649845Z"), soundLevelDb: -61.94 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T10:07:24.276145Z"), soundLevelDb: -61.3 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:42:29.340007Z"), soundLevelDb: -65.94 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:43:05.200760Z"), soundLevelDb: -62.81 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:43:40.868245Z"), soundLevelDb: -58.58 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:44:16.579749Z"), soundLevelDb: -62.6 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:44:52.379673Z"), soundLevelDb: -60.08 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:45:27.812923Z"), soundLevelDb: -62.26 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:46:03.351524Z"), soundLevelDb: -62.83 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:46:39.001900Z"), soundLevelDb: -58.61 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:47:14.713764Z"), soundLevelDb: -60.56 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:47:50.488131Z"), soundLevelDb: -65.5 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:48:26.267712Z"), soundLevelDb: -61.67 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:49:01.788230Z"), soundLevelDb: -62.33 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:49:37.457148Z"), soundLevelDb: -60.16 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:50:13.206498Z"), soundLevelDb: -53.3 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:50:49.008713Z"), soundLevelDb: -60.47 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:51:24.729976Z"), soundLevelDb: -64.24 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:52:00.472345Z"), soundLevelDb: -57.43 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:52:36.194865Z"), soundLevelDb: -53.9 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:53:11.931498Z"), soundLevelDb: -57.64 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:53:47.728323Z"), soundLevelDb: -62.43 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:54:23.211577Z"), soundLevelDb: -56.17 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:54:59.367074Z"), soundLevelDb: -60.95 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:55:35.140488Z"), soundLevelDb: -62.37 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:56:10.735400Z"), soundLevelDb: -62.88 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:56:46.385335Z"), soundLevelDb: -63.07 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:57:22.134745Z"), soundLevelDb: -54.26 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:57:57.936933Z"), soundLevelDb: -61.63 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:58:33.701689Z"), soundLevelDb: -56.95 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:59:09.233164Z"), soundLevelDb: -54.34 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T12:59:44.884874Z"), soundLevelDb: -52.41 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T13:00:20.594046Z"), soundLevelDb: -62.84 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T13:00:56.341137Z"), soundLevelDb: -63.56 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T13:01:32.117919Z"), soundLevelDb: -64.28 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T13:02:07.690365Z"), soundLevelDb: -60.47 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-08T13:02:43.396005Z"), soundLevelDb: -46.08 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:16:36.010663Z"), soundLevelDb: -74.04 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:17:30.030244Z"), soundLevelDb: -66.44 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:18:23.695034Z"), soundLevelDb: -66.12 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:19:17.572917Z"), soundLevelDb: -67.21 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:20:11.517070Z"), soundLevelDb: -65.52 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:21:05.155441Z"), soundLevelDb: -66.99 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:21:59.026976Z"), soundLevelDb: -68.04 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:22:52.915753Z"), soundLevelDb: -68.49 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:23:46.580940Z"), soundLevelDb: -67.9 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:24:40.462686Z"), soundLevelDb: -66.12 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:25:34.078680Z"), soundLevelDb: -67.62 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:26:27.821307Z"), soundLevelDb: -68.38 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:27:21.561132Z"), soundLevelDb: -66.53 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:28:15.488956Z"), soundLevelDb: -65.71 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:29:09.437554Z"), soundLevelDb: -67.64 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:30:03.004101Z"), soundLevelDb: -64.79 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:30:56.959594Z"), soundLevelDb: -65.27 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:31:50.911345Z"), soundLevelDb: -63.28 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:32:44.509564Z"), soundLevelDb: -66.38 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:33:38.419403Z"), soundLevelDb: -67.63 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:34:32.379394Z"), soundLevelDb: -69.97 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:35:26.109190Z"), soundLevelDb: -68.52 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:36:19.910603Z"), soundLevelDb: -66.44 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:37:13.894739Z"), soundLevelDb: -65.64 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:38:07.719585Z"), soundLevelDb: -69.38 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:39:01.442005Z"), soundLevelDb: -69.72 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:39:55.380284Z"), soundLevelDb: -66.97 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:40:49.352452Z"), soundLevelDb: -69.01 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:41:42.939909Z"), soundLevelDb: -70.6 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:42:36.813681Z"), soundLevelDb: -69.37 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:43:30.756295Z"), soundLevelDb: -68.78 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:44:24.421602Z"), soundLevelDb: -67.78 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:45:18.285145Z"), soundLevelDb: -68.75 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:46:12.199640Z"), soundLevelDb: -66.34 },
  { deviceId: "phone001", location: "cour_avant", timestamp: new Date("2026-06-10T06:47:05.968213Z"), soundLevelDb: -66.36 }];

async function seed() {
  await connectDB();

  console.log('Suppression des données existantes...');
  await Device.deleteMany({});
  await Measurement.deleteMany({});
  await Observation.deleteMany({});

  console.log('Insertion des devices...');
  await Device.insertMany(devices);

  console.log('Insertion des mesures...');
  await Measurement.insertMany(measurements);

  console.log('Insertion des observations...');
  await Observation.insertMany(observations);

  console.log(
    `Seed terminé : ${devices.length} device(s), ${measurements.length} mesure(s), ${observations.length} observation(s).`
  );

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((error) => {
  console.error('Erreur lors du seed :', error);
  process.exit(1);
});