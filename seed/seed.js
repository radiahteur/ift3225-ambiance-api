// Données de test.
// Script de seed — peuple la base avec des données réelles de la phase 2/3
// (devices, mesures, observations) pour tester les endpoints de
// consultation, et sert aussi de source de vérité pour peupler
// l'environnement de production (Render).
//
// Usage : node seed/seed.js
//
// Les mesures de soundLevelDb ci-dessous sont des échantillons RÉELS
// extraits de 9 sessions Phyphox (Audio Amplitude), enregistrées dans
// 3 lieux entre le 17 et le 21 juillet 2026 :
//   - Rue Hébert, secteur Mercier (3 sessions : F1, F3, F4)
//   - Rue Druillettes, Saint-Léonard (4 sessions : S01-S04)
//   - Place d'Armes, Vieux-Montréal (2 sessions : R1, R2)
// Le lieu "Bibliothèque" de la phase 1 est conservé dans le système.
//
// Note sur l'échelle : Phyphox retourne un niveau sonore relatif au
// plein-échelle du micro (dBFS), donc des valeurs négatives. Ce n'est
// PAS un dB SPL calibré. classifyNoise() dans le contrôleur ambiance
// est calibré sur cette échelle (voir rapport, section "Limites").
// Chaque session brute contient plusieurs milliers de points ; un
// sous-échantillonnage uniforme (~35 points/session) est conservé ici
// pour garder le seed léger tout en couvrant toute la durée de chaque
// enregistrement.

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Device = require('../models/devices');
const Measurement = require('../models/measurements');
const Observation = require('../models/observations');
const Place = require("../models/places");
const User = require ("../models/users");
const bcrypt = require ("bcryptjs");

const devices = [
  {
    deviceId: 'phone001',
    name: 'iPhone - Collecte terrain',
    location: 'rue_hebert',
    type: 'phone',
    description: 'Téléphone utilisé pour les sessions de collecte Phyphox (amplitude audio), phase 2/3.',
    apiKey: 'key123'
  },
];

const places = [
  {
    "name": "Rue Hébert",
    "location": "rue_hebert",
    "latitude": 45.5722,
    "longitude": -73.5949,
    "description": "Secteur Mercier — rue résidentielle assez passante."
  },
  {
    "name": "Rue Druillettes",
    "location": "rue_druillettes",
    "latitude": 45.5843,
    "longitude": -73.5797,
    "description": "Saint-Léonard — derrière un commerce, dans un quartier résidentiel."
  },
  {
    "name": "Place d'Armes",
    "location": "place_darmes",
    "latitude": 45.505,
    "longitude": -73.5571,
    "description": "Vieux-Montréal — une rue passante du centre-ville."
  },
  {
    "name": "Bibliothèque",
    "location": "bibliotheque",
    "latitude": 45.5019,
    "longitude": -73.5674,
    "description": "Bibliothèque principale (conservée depuis la phase 1)."
  }
];

const observations = [
  {
    deviceId: "phone001",
    location: "rue_hebert",
    timestamp: new Date("2026-07-17T09:50:18.104Z"),
    observer: "team",
    crowdLevel: "empty",
    ambiance: "normal",
    notes: "Rue Hébert, secteur Mercier — rue résidentielle assez passante. Session Phyphox, 14017 échantillons, niveau moyen -62.5 dBFS.",
  },
  {
    deviceId: "phone001",
    location: "rue_hebert",
    timestamp: new Date("2026-07-17T15:07:54.615Z"),
    observer: "team",
    crowdLevel: "empty",
    ambiance: "quiet",
    notes: "Rue Hébert, secteur Mercier — rue résidentielle assez passante. Session Phyphox, 12703 échantillons, niveau moyen -68.8 dBFS.",
  },
  {
    deviceId: "phone001",
    location: "rue_hebert",
    timestamp: new Date("2026-07-21T23:17:49.710Z"),
    observer: "team",
    crowdLevel: "low",
    ambiance: "normal",
    notes: "Rue Hébert, secteur Mercier — rue résidentielle assez passante. Session Phyphox, 8309 échantillons, niveau moyen -63.5 dBFS.",
  },
  {
    deviceId: "phone001",
    location: "rue_druillettes",
    timestamp: new Date("2026-07-17T05:52:14.972Z"),
    observer: "team",
    crowdLevel: "empty",
    ambiance: "noisy",
    notes: "Rue Druillettes, Saint-Léonard — derrière un commerce, quartier résidentiel. Session Phyphox, 6433 échantillons, niveau moyen -52.1 dBFS.",
  },
  {
    deviceId: "phone001",
    location: "rue_druillettes",
    timestamp: new Date("2026-07-18T05:10:41.850Z"),
    observer: "team",
    crowdLevel: "empty",
    ambiance: "noisy",
    notes: "Rue Druillettes, Saint-Léonard — derrière un commerce, quartier résidentiel. Session Phyphox, 9413 échantillons, niveau moyen -56.7 dBFS.",
  },
  {
    deviceId: "phone001",
    location: "rue_druillettes",
    timestamp: new Date("2026-07-18T09:28:25.834Z"),
    observer: "team",
    crowdLevel: "empty",
    ambiance: "normal",
    notes: "Rue Druillettes, Saint-Léonard — derrière un commerce, quartier résidentiel. Session Phyphox, 10760 échantillons, niveau moyen -59.7 dBFS.",
  },
  {
    deviceId: "phone001",
    location: "rue_druillettes",
    timestamp: new Date("2026-07-21T23:04:36.589Z"),
    observer: "team",
    crowdLevel: "medium",
    ambiance: "noisy",
    notes: "Rue Druillettes, Saint-Léonard — derrière un commerce, quartier résidentiel. Session Phyphox, 7129 échantillons, niveau moyen -52.9 dBFS.",
  },
  {
    deviceId: "phone001",
    location: "place_darmes",
    timestamp: new Date("2026-07-21T21:16:48.352Z"),
    observer: "team",
    crowdLevel: "medium",
    ambiance: "noisy",
    notes: "Place d'Armes, Vieux-Montréal — rue passante du centre-ville. Session Phyphox, 7861 échantillons, niveau moyen -53.0 dBFS.",
  },
  {
    deviceId: "phone001",
    location: "place_darmes",
    timestamp: new Date("2026-07-21T23:24:43.919Z"),
    observer: "team",
    crowdLevel: "medium",
    ambiance: "noisy",
    notes: "Place d'Armes, Vieux-Montréal — rue passante du centre-ville. Session Phyphox, 7342 échantillons, niveau moyen -54.9 dBFS.",
  },
];

const measurements = [
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:52:14.972Z"), soundLevelDb: -57.98 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:52:34.282Z"), soundLevelDb: -55.91 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:52:53.554Z"), soundLevelDb: -54.04 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:53:12.828Z"), soundLevelDb: -27.09 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:53:32.129Z"), soundLevelDb: -54.7 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:53:51.413Z"), soundLevelDb: -55.13 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:54:10.688Z"), soundLevelDb: -55.03 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:54:29.939Z"), soundLevelDb: -55.94 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:54:49.224Z"), soundLevelDb: -25.11 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:55:08.496Z"), soundLevelDb: -53.16 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:55:27.764Z"), soundLevelDb: -55.32 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:55:47.032Z"), soundLevelDb: -56.48 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:56:06.279Z"), soundLevelDb: -51.68 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:56:25.551Z"), soundLevelDb: -54.14 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:56:44.802Z"), soundLevelDb: -54.09 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:57:04.076Z"), soundLevelDb: -49.66 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:57:23.361Z"), soundLevelDb: -50.73 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:57:42.610Z"), soundLevelDb: -51.33 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:58:01.887Z"), soundLevelDb: -56.15 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:58:21.154Z"), soundLevelDb: -53.02 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:58:40.439Z"), soundLevelDb: -55.52 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:58:59.694Z"), soundLevelDb: -56.18 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:59:18.979Z"), soundLevelDb: -53.45 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:59:38.230Z"), soundLevelDb: -56.62 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T05:59:57.521Z"), soundLevelDb: -44.24 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T06:00:16.795Z"), soundLevelDb: -57.03 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T06:00:36.080Z"), soundLevelDb: -53.01 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T06:00:55.381Z"), soundLevelDb: -53.81 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T06:01:14.660Z"), soundLevelDb: -55.85 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T06:01:33.921Z"), soundLevelDb: -56.12 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T06:01:53.184Z"), soundLevelDb: -40.22 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T06:02:12.474Z"), soundLevelDb: -56.29 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T06:02:31.728Z"), soundLevelDb: -56.17 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T06:02:50.999Z"), soundLevelDb: -28.69 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T06:03:10.284Z"), soundLevelDb: -57.35 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-17T06:03:29.552Z"), soundLevelDb: -55.43 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T09:50:18.104Z"), soundLevelDb: -68.99 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T09:51:00.255Z"), soundLevelDb: -63.2 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T09:51:42.140Z"), soundLevelDb: -63.68 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T09:52:23.847Z"), soundLevelDb: -63.29 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T09:53:05.786Z"), soundLevelDb: -63.68 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T09:53:47.738Z"), soundLevelDb: -63.67 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T09:54:29.685Z"), soundLevelDb: -62.58 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T09:55:11.379Z"), soundLevelDb: -62.97 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T09:55:53.289Z"), soundLevelDb: -63.53 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T09:56:35.218Z"), soundLevelDb: -62.43 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T09:57:17.158Z"), soundLevelDb: -60.24 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T09:57:58.862Z"), soundLevelDb: -61.86 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T09:58:40.718Z"), soundLevelDb: -63.93 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T09:59:22.691Z"), soundLevelDb: -63.34 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:00:04.635Z"), soundLevelDb: -64.56 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:00:46.451Z"), soundLevelDb: -60.96 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:01:28.356Z"), soundLevelDb: -62.79 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:02:10.267Z"), soundLevelDb: -65.1 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:02:52.184Z"), soundLevelDb: -62.39 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:03:34.025Z"), soundLevelDb: -62.88 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:04:15.775Z"), soundLevelDb: -64.68 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:04:57.706Z"), soundLevelDb: -63.09 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:05:39.603Z"), soundLevelDb: -62.17 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:06:21.484Z"), soundLevelDb: -63.9 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:07:03.140Z"), soundLevelDb: -62.85 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:07:45.129Z"), soundLevelDb: -63.43 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:08:27.071Z"), soundLevelDb: -61.71 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:09:08.984Z"), soundLevelDb: -60.77 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:09:50.665Z"), soundLevelDb: -62.85 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:10:32.638Z"), soundLevelDb: -64.01 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:11:14.562Z"), soundLevelDb: -63.04 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:11:56.455Z"), soundLevelDb: -59.83 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:12:38.189Z"), soundLevelDb: -60.61 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:13:20.124Z"), soundLevelDb: -61.32 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:14:02.000Z"), soundLevelDb: -61.99 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T10:14:43.887Z"), soundLevelDb: -59.72 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:07:54.615Z"), soundLevelDb: -75.54 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:08:32.714Z"), soundLevelDb: -69.43 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:09:10.667Z"), soundLevelDb: -69.24 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:09:48.675Z"), soundLevelDb: -69.01 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:10:26.441Z"), soundLevelDb: -68.52 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:11:04.341Z"), soundLevelDb: -69.18 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:11:42.241Z"), soundLevelDb: -70.28 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:12:20.211Z"), soundLevelDb: -71.19 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:12:58.165Z"), soundLevelDb: -66.71 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:13:35.896Z"), soundLevelDb: -67.05 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:14:13.891Z"), soundLevelDb: -69.43 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:14:51.758Z"), soundLevelDb: -68.28 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:15:30.332Z"), soundLevelDb: -68.8 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:16:08.307Z"), soundLevelDb: -66.51 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:16:46.249Z"), soundLevelDb: -68.7 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:17:24.228Z"), soundLevelDb: -69.49 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:18:02.037Z"), soundLevelDb: -71.07 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:18:39.840Z"), soundLevelDb: -70.19 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:19:17.769Z"), soundLevelDb: -65.2 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:19:55.654Z"), soundLevelDb: -67.88 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:20:33.651Z"), soundLevelDb: -70.53 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:21:11.357Z"), soundLevelDb: -67.82 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:21:49.286Z"), soundLevelDb: -68.61 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:22:27.256Z"), soundLevelDb: -67.76 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:23:05.215Z"), soundLevelDb: -69.46 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:23:43.177Z"), soundLevelDb: -67.57 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:24:20.890Z"), soundLevelDb: -69.5 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:24:58.820Z"), soundLevelDb: -70.55 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:25:36.735Z"), soundLevelDb: -70.99 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:26:14.694Z"), soundLevelDb: -69.12 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:26:52.545Z"), soundLevelDb: -68.53 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:27:30.322Z"), soundLevelDb: -69.34 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:28:08.233Z"), soundLevelDb: -70.74 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:28:46.183Z"), soundLevelDb: -68.91 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:29:24.139Z"), soundLevelDb: -66.96 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-17T15:30:01.877Z"), soundLevelDb: -67.28 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:10:41.850Z"), soundLevelDb: -57.81 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:11:10.092Z"), soundLevelDb: -53.89 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:11:38.200Z"), soundLevelDb: -50.82 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:12:06.375Z"), soundLevelDb: -56.8 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:12:34.504Z"), soundLevelDb: -56.62 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:13:02.631Z"), soundLevelDb: -56.82 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:13:30.720Z"), soundLevelDb: -58.72 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:13:58.830Z"), soundLevelDb: -57.02 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:14:26.962Z"), soundLevelDb: -58.62 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:14:55.063Z"), soundLevelDb: -57.15 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:15:23.182Z"), soundLevelDb: -57.74 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:15:51.273Z"), soundLevelDb: -58.25 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:16:19.417Z"), soundLevelDb: -56.65 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:16:47.631Z"), soundLevelDb: -50.31 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:17:15.816Z"), soundLevelDb: -54.63 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:17:44.029Z"), soundLevelDb: -57.25 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:18:12.226Z"), soundLevelDb: -57.63 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:18:40.418Z"), soundLevelDb: -55.27 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:19:08.543Z"), soundLevelDb: -56.42 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:19:36.724Z"), soundLevelDb: -58.12 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:20:04.890Z"), soundLevelDb: -57.06 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:20:33.102Z"), soundLevelDb: -57.63 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:21:01.337Z"), soundLevelDb: -56.69 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:21:29.519Z"), soundLevelDb: -54.26 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:21:57.713Z"), soundLevelDb: -57.28 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:22:25.889Z"), soundLevelDb: -57.49 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:22:54.045Z"), soundLevelDb: -58.08 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:23:22.241Z"), soundLevelDb: -51.28 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:23:50.411Z"), soundLevelDb: -57.45 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:24:18.617Z"), soundLevelDb: -57.65 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:24:46.809Z"), soundLevelDb: -59.24 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:25:14.984Z"), soundLevelDb: -55.83 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:25:43.175Z"), soundLevelDb: -58.14 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:26:11.374Z"), soundLevelDb: -59.5 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:26:39.556Z"), soundLevelDb: -56.3 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T05:27:07.768Z"), soundLevelDb: -55.79 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:28:25.834Z"), soundLevelDb: -65.68 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:28:57.757Z"), soundLevelDb: -58.81 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:29:29.770Z"), soundLevelDb: -53.78 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:30:01.737Z"), soundLevelDb: -60.06 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:30:33.956Z"), soundLevelDb: -60.05 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:31:06.219Z"), soundLevelDb: -58.99 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:31:38.466Z"), soundLevelDb: -60.28 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:32:10.729Z"), soundLevelDb: -60.02 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:32:43.010Z"), soundLevelDb: -60.77 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:33:15.272Z"), soundLevelDb: -61.08 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:33:47.565Z"), soundLevelDb: -59.5 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:34:19.833Z"), soundLevelDb: -59.71 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:34:52.135Z"), soundLevelDb: -57.89 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:35:24.420Z"), soundLevelDb: -60.37 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:35:56.744Z"), soundLevelDb: -59.77 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:36:29.038Z"), soundLevelDb: -60.32 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:37:01.315Z"), soundLevelDb: -58.9 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:37:33.605Z"), soundLevelDb: -59.18 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:38:05.906Z"), soundLevelDb: -59.03 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:38:38.242Z"), soundLevelDb: -59.84 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:39:10.544Z"), soundLevelDb: -59.25 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:39:42.846Z"), soundLevelDb: -58.49 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:40:15.148Z"), soundLevelDb: -58.06 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:40:47.457Z"), soundLevelDb: -60.38 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:41:19.782Z"), soundLevelDb: -58.91 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:41:52.101Z"), soundLevelDb: -59.6 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:42:24.418Z"), soundLevelDb: -60.59 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:42:56.734Z"), soundLevelDb: -60.43 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:43:29.041Z"), soundLevelDb: -59.27 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:44:01.364Z"), soundLevelDb: -58.85 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:44:33.657Z"), soundLevelDb: -59.03 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:45:05.993Z"), soundLevelDb: -58.95 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:45:38.332Z"), soundLevelDb: -58.2 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:46:10.685Z"), soundLevelDb: -60.58 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:46:43.033Z"), soundLevelDb: -59.74 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-18T09:47:15.322Z"), soundLevelDb: -60.59 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:16:48.352Z"), soundLevelDb: -49.13 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:17:11.950Z"), soundLevelDb: -57.02 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:17:35.422Z"), soundLevelDb: -53.63 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:17:58.953Z"), soundLevelDb: -48.81 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:18:22.455Z"), soundLevelDb: -51.76 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:18:45.908Z"), soundLevelDb: -54.61 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:19:09.408Z"), soundLevelDb: -55.63 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:19:32.918Z"), soundLevelDb: -52.52 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:19:56.431Z"), soundLevelDb: -49.48 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:20:19.957Z"), soundLevelDb: -49.82 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:20:43.438Z"), soundLevelDb: -52.81 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:21:06.969Z"), soundLevelDb: -50.73 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:21:30.463Z"), soundLevelDb: -50.09 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:21:53.969Z"), soundLevelDb: -51.83 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:22:17.476Z"), soundLevelDb: -53.04 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:22:40.957Z"), soundLevelDb: -51.84 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:23:04.457Z"), soundLevelDb: -51.6 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:23:27.985Z"), soundLevelDb: -55.66 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:23:51.475Z"), soundLevelDb: -52.62 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:24:14.975Z"), soundLevelDb: -56.69 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:24:38.457Z"), soundLevelDb: -52.67 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:25:01.936Z"), soundLevelDb: -52.31 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:25:25.403Z"), soundLevelDb: -55.24 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:25:48.924Z"), soundLevelDb: -53.92 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:26:12.442Z"), soundLevelDb: -51.89 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:26:35.929Z"), soundLevelDb: -47.92 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:26:59.437Z"), soundLevelDb: -54.76 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:27:22.942Z"), soundLevelDb: -52.27 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:27:46.686Z"), soundLevelDb: -55.02 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:28:10.183Z"), soundLevelDb: -51.33 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:28:33.667Z"), soundLevelDb: -53.28 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:28:57.175Z"), soundLevelDb: -54.57 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:29:20.656Z"), soundLevelDb: -56.3 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:29:44.141Z"), soundLevelDb: -52.93 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:30:07.665Z"), soundLevelDb: -50.53 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T21:30:31.193Z"), soundLevelDb: -56.87 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:04:36.589Z"), soundLevelDb: -55.15 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:04:57.829Z"), soundLevelDb: -49.13 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:05:19.028Z"), soundLevelDb: -48.22 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:05:40.163Z"), soundLevelDb: -51.02 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:06:01.161Z"), soundLevelDb: -52.68 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:06:22.323Z"), soundLevelDb: -50.53 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:06:43.399Z"), soundLevelDb: -48.39 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:07:04.432Z"), soundLevelDb: -51.85 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:07:25.570Z"), soundLevelDb: -53.71 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:07:46.899Z"), soundLevelDb: -54.03 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:08:08.265Z"), soundLevelDb: -55.4 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:08:29.643Z"), soundLevelDb: -56.6 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:08:51.018Z"), soundLevelDb: -53.12 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:09:12.363Z"), soundLevelDb: -53.95 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:09:33.764Z"), soundLevelDb: -51.57 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:09:55.105Z"), soundLevelDb: -51.78 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:10:16.394Z"), soundLevelDb: -52.29 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:10:37.734Z"), soundLevelDb: -49.98 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:10:59.136Z"), soundLevelDb: -49.15 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:11:20.471Z"), soundLevelDb: -52.45 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:11:41.873Z"), soundLevelDb: -54.45 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:12:03.268Z"), soundLevelDb: -53.78 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:12:24.642Z"), soundLevelDb: -54.54 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:12:46.010Z"), soundLevelDb: -53.4 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:13:07.389Z"), soundLevelDb: -51.91 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:13:28.773Z"), soundLevelDb: -53.57 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:13:50.164Z"), soundLevelDb: -54.43 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:14:11.530Z"), soundLevelDb: -57.02 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:14:32.916Z"), soundLevelDb: -55.66 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:14:54.296Z"), soundLevelDb: -57.02 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:15:15.672Z"), soundLevelDb: -55.11 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:15:37.048Z"), soundLevelDb: -54.38 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:15:58.412Z"), soundLevelDb: -57.05 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:16:19.796Z"), soundLevelDb: -56.79 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:16:41.153Z"), soundLevelDb: -54.78 },
  { deviceId: "phone001", location: "rue_druillettes", timestamp: new Date("2026-07-21T23:17:02.546Z"), soundLevelDb: -51.76 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:17:49.710Z"), soundLevelDb: -64.26 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:18:14.684Z"), soundLevelDb: -66.91 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:18:39.431Z"), soundLevelDb: -68.11 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:19:04.102Z"), soundLevelDb: -66.31 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:19:28.838Z"), soundLevelDb: -57.38 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:19:53.679Z"), soundLevelDb: -62.56 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:20:18.410Z"), soundLevelDb: -63.03 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:20:43.184Z"), soundLevelDb: -67.5 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:21:07.943Z"), soundLevelDb: -64.21 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:21:32.706Z"), soundLevelDb: -63.69 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:21:57.325Z"), soundLevelDb: -66.97 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:22:22.055Z"), soundLevelDb: -65.84 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:22:46.873Z"), soundLevelDb: -64.06 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:23:11.701Z"), soundLevelDb: -65.7 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:23:36.572Z"), soundLevelDb: -65.08 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:24:01.288Z"), soundLevelDb: -62.48 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:24:26.000Z"), soundLevelDb: -65.4 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:24:43.919Z"), soundLevelDb: -56.34 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:24:50.816Z"), soundLevelDb: -67.72 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:25:06.029Z"), soundLevelDb: -60.05 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:25:15.604Z"), soundLevelDb: -66.69 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:25:27.932Z"), soundLevelDb: -58.68 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:25:40.281Z"), soundLevelDb: -67.75 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:25:49.862Z"), soundLevelDb: -53.44 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:26:05.055Z"), soundLevelDb: -68.66 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:26:11.801Z"), soundLevelDb: -51.69 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:26:29.865Z"), soundLevelDb: -68.65 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:26:33.727Z"), soundLevelDb: -56.33 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:26:54.599Z"), soundLevelDb: -50.71 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:26:55.655Z"), soundLevelDb: -57.17 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:27:17.579Z"), soundLevelDb: -56.68 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:27:19.377Z"), soundLevelDb: -53.59 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:27:39.501Z"), soundLevelDb: -49.04 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:27:44.123Z"), soundLevelDb: -67.65 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:28:01.416Z"), soundLevelDb: -54.3 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:28:08.886Z"), soundLevelDb: -61.18 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:28:23.375Z"), soundLevelDb: -55.72 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:28:33.687Z"), soundLevelDb: -60.53 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:28:45.326Z"), soundLevelDb: -59.35 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:28:58.448Z"), soundLevelDb: -63.74 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:29:07.240Z"), soundLevelDb: -58.78 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:29:23.092Z"), soundLevelDb: -54.94 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:29:29.151Z"), soundLevelDb: -45.57 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:29:47.828Z"), soundLevelDb: -51.36 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:29:51.069Z"), soundLevelDb: -51.2 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:30:12.681Z"), soundLevelDb: -55.03 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:30:12.986Z"), soundLevelDb: -51.33 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:30:34.934Z"), soundLevelDb: -58.4 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:30:37.473Z"), soundLevelDb: -54.75 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:30:56.880Z"), soundLevelDb: -58.22 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:31:02.220Z"), soundLevelDb: -65.11 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:31:18.794Z"), soundLevelDb: -56.54 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:31:26.979Z"), soundLevelDb: -63.98 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:31:40.706Z"), soundLevelDb: -52.25 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:31:51.712Z"), soundLevelDb: -65.98 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:32:02.646Z"), soundLevelDb: -53.92 },
  { deviceId: "phone001", location: "rue_hebert", timestamp: new Date("2026-07-21T23:32:16.264Z"), soundLevelDb: -67.14 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:32:24.575Z"), soundLevelDb: -57.39 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:32:46.519Z"), soundLevelDb: -56.82 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:33:08.452Z"), soundLevelDb: -51.28 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:33:30.361Z"), soundLevelDb: -55.44 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:33:52.280Z"), soundLevelDb: -54.13 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:34:14.239Z"), soundLevelDb: -56.33 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:34:36.165Z"), soundLevelDb: -57.45 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:34:58.100Z"), soundLevelDb: -57 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:35:20.027Z"), soundLevelDb: -56.18 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:35:41.958Z"), soundLevelDb: -54.27 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:36:03.877Z"), soundLevelDb: -50.82 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:36:25.824Z"), soundLevelDb: -54.01 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:36:47.762Z"), soundLevelDb: -55.38 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:37:09.694Z"), soundLevelDb: -56.82 },
  { deviceId: "phone001", location: "place_darmes", timestamp: new Date("2026-07-21T23:37:31.640Z"), soundLevelDb: -54.37 },
];


async function seed() {
  await connectDB();

  console.log('Suppression des données existantes...');
  await Device.deleteMany({});
  await Place.deleteMany({});
  await Measurement.deleteMany({});
  await Observation.deleteMany({});
  await User.deleteMany({});

  console.log('Insertion des devices...');
  await Device.insertMany(devices);

  console.log("Insertion des lieux...");
  await Place.insertMany(places);

  console.log('Insertion des mesures...');
  await Measurement.insertMany(measurements);

  console.log('Insertion des observations...');
  await Observation.insertMany(observations);

  console.log('Insertion des utilisateurs...');

  const hashedPassword = await bcrypt.hash("password123", 10);

  await User.create({
    username: "testuser",
    email: "test@example.com",
    password: hashedPassword
  });

  console.log(
    `Seed terminé : ${devices.length} device(s), ${places.length} lieu(x), ${measurements.length} mesure(s), ${observations.length} observation(s).`
  );

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((error) => {
  console.error('Erreur lors du seed :', error);
  process.exit(1);
});