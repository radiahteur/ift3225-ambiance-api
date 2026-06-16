Projet réalisé dans le cadre du cours IFT3225 — Développement d’API et services Web 

Auteures: Radiah Mohamed Assowe 20229344, Fatoumata Mane 20214863
...

Description:
Ambiance API est une API REST développée avec Node.js et Express permettant de collecter, stocker et analyser des données d’ambiance provenant de dispositifs mobiles ou capteurs. Cet API permet de transformer des données brutes de capteurs en indicateurs d'ambiance exploitables.

Le système permet:
l’enregistrement de devices (téléphones / capteurs)
la collecte de mesures environnementales (son, lumière, mouvement)
la gestion d’observations humaines
l’analyse de l’ambiance d’un lieu (historique, heures calmes, score de confort)

Technologies utilisées:
Phyphox
Node.js
Express.js
MongoDB + Mongoose
dotenv
Postman (tests API)

Architecture du projet:
ambiance-api/
│
├── controllers/
├── routes/
├── models/
├── middleware/
├── seed/
├── config/
├── server.js
├── app.js
└── .env

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Installation/Exécution:

**Lancer le serveur
node server.js

**Configurer les variables d’environnement
Créer un fichier .env à la racine du projet :
PORT=3000
MONGODB_URI=your_mongodb_connection_string
API_KEYS=abc123

**Installer les dépendances
npm install

**Base URL
http://localhost:3000


Authentification:
Certaines routes nécessitent une clé API.
**Header requis :
x-api-key: abc123

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

API Endpoints:
**Créer device
POST /devices

**Lister devices
GET /devices

**Créer une mesure
POST /measurements

**Lister les mesures
GET /measurements

**Créer une observation
POST /observations

**Lister les observations
GET /observations

**Historique des mesures
GET /ambiance/:location/history

**Heures les plus calmes
GET /ambiance/:location/quiet-hours

**Score de confort
GET /ambiance/:location/comfort-score

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Exemples de requêtes
➤ POST /devices
{
  "deviceId": "phone001",
  "name": "Phone Backyard",
  "location": "backyard"
}
➤ POST /measurements
Headers
x-api-key: abc123
Body
{
  "deviceId": "phone001",
  "location": "backyard",
  "soundLevelDb": 55,
  "lightLevelLux": 300,
  "acceleration": {
    "x": 9.8,
    "y": 0.2,
    "z": 0.1
  },
  "gyroscope": {
    "x": 0.1,
    "y": 0.1,
    "z": 0.1
  }
}

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Plan de tests (Postman)
✔ Étape 1 — Devices
POST /devices
GET /devices

✔ Étape 2 — Measurements
POST /measurements (avec x-api-key)
GET /measurements

✔ Étape 3 — Observations
POST /observations
GET /observations

✔ Étape 4 — Analyse
GET /ambiance/backyard/history
GET /ambiance/backyard/quiet-hours
GET /ambiance/backyard/comfort-score

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sécurité
**API key obligatoire pour /measurements
**Validation des entrées via Mongoose
**Gestion des erreurs centralisée
**Protection des routes sensibles via middleware



