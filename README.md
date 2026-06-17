Projet réalisé dans le cadre du cours IFT3225 — Développement d'API et services Web

Auteures: Radiah Mohamed Assowe 20229344, Fatoumata Mane 20214863

## Description
Ambiance API est une API REST faite avec Node.js et Express. Elle sert à collecter, stocker et analyser des données d'ambiance captées par un téléphone (via Phyphox) et par des observations qu'on note nous-mêmes. Le but, c'est de transformer ces données brutes en indicateurs simples sur l'ambiance d'un lieu : historique, heures calmes, score de confort.

Le système permet :
1-d'enregistrer des devices (téléphones / capteurs)
2-de collecter des mesures environnementales (son, lumière, mouvement)
3-d'ajouter des observations humaines (le fallback manuel)
4-d'analyser l'ambiance d'un lieu (historique, heures calmes, score de confort)

## Prérequis du projet
- Node.js v18 ou plus
- npm (vient avec Node.js)
- Un compte MongoDB Atlas avec un cluster et une chaîne de connexion
- Phyphox sur un téléphone (capteur "Audio Amplitude") si on veut refaire une collecte
- Postman pour tester l'API

## Installation et lancement du projet
1. Cloner le dépôt et installer les dépendances :
npm install
2. Copier `.env.example` vers `.env` et mettre vos propres valeurs :
```
PORT=3000
MONGO_URI=mongodb+srv://<utilisateur>:<motdepasse>@<cluster>.mongodb.net/<nomBaseDonnees>?retryWrites=true&w=majority
API_KEYS=key123,key456
```
Le `MONGO_URI` vient de votre cluster Atlas (Etape: Database, puis Connect, puis Drivers). `API_KEYS` est une liste de clée à partager avec l'équipe.
3. (Optionnel) Pour remplir la base avec des données de démo :
```
node seed/seed.js
```
4. Lancer le serveur :
```
node server.js
```
Le serveur tourne par défaut sur `http://localhost:3000`.

## Les technologies utilisées

- Phyphox (capteur Audio Amplitude)
- Node.js / Express.js
- MongoDB Atlas + Mongoose
- dotenv
- morgan (pour logger les requêtes dans le terminal)
- Postman (tests API)

## Architecture du projet

```
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
├── .env.example
└── .env ( à créer soi-même)
```

## Authentification

Les routes qui écrivent dans la base (`POST /measurements`, `POST /observations`) demandent une clé API.

Header requis :
```
x-api-key: key123
```

Les reponses vu selon les cas :
- Pas d'en-tête : `401 Unauthorized`, code `MISSING_API_KEY`
- Mauvaise clé : `403 Forbidden`, code `INVALID_API_KEY`
- Bonne clé :la requête passe normalement

Les routes `GET` restent ouvertes à tout le monde. `POST /devices` n'est volontairement pas protégé pour l'instant, c'est une faille expliquée dans le rapport.

## Table des endpoints
La structure de chaque endpoints listé:
| Méthode | Endpoint | Auth | Description |

| POST | `/devices` | Aucune | Enregistre un nouveau device |

| GET | `/devices` | Publique | Liste tous les devices |

| POST | `/measurements` | x-api-key | Enregistre une mesure capteur |

| GET | `/measurements` | Publique | Liste les mesures (filtres : `location`, `deviceId`, `from`, `to`, `limit`) |

| POST | `/observations` | x-api-key | Enregistre une observation humaine |

| GET | `/observations` | Publique | Liste les observations (filtres : `location`, `deviceId`, `from`, `to`, `limit`) |

| GET | `/ambiance/:location/history` | Publique | Évolution récente des mesures d'un lieu |

| GET | `/ambiance/:location/quiet-hours` | Publique | Les heures habituellement les plus calmes |

| GET | `/ambiance/:location/comfort-score` | Publique | Score de confort global d'un lieu |

## Exemples de requêtes
**POST /devices**
```json
{
  "deviceId": "phone001",
  "name": "Phone Cour avant",
  "location": "cour_avant"
}
```
**POST /measurements** (headers: `x-api-key: key123`)
```json
{
  "deviceId": "phone001",
  "location": "cour_avant",
  "soundLevelDb": -60,
  "lightLevelLux": 300,
  "acceleration": { "x": 9.8, "y": 0.2, "z": 0.1 },
  "gyroscope": { "x": 0.1, "y": 0.1, "z": 0.1 }
}
```

**POST /observations** (headers: `x-api-key: key123`)
```json
{
  "deviceId": "phone001",
  "location": "cour_avant",
  "crowdLevel": "low",
  "ambiance": "normal",
  "observer": "team",
  "notes": "Passage occasionnel sur la rue à côté."
}
```

**GET /measurements?location=cour_avant&from=2026-06-08T00:00:00Z&to=2026-06-08T23:59:59Z**
Ça retourne les mesures de cette plage de dates pour le lieu demandé.

## Tests (Postman)
On a testé l'API dans Postman en suivant ces étapes :

1. **Devices** — `POST /devices` (on doit avoir 201), `GET /devices` (200 + la liste)
2. **Authentification** — `POST /measurements` sans `x-api-key` (401, code `MISSING_API_KEY`), avec une mauvaise clé (403, code `INVALID_API_KEY`), avec la bonne clé (201 + le document créé)
3. **Measurements** — `POST /measurements` avec la bonne clé, puis `GET /measurements` avec et sans filtres (`location`, `from`, `to`)
4. **Observations** — `POST /observations` avec la bonne clé, `GET /observations`
5. **Analyse** — `GET /ambiance/cour_avant/history`, `GET /ambiance/cour_avant/quiet-hours`, `GET /ambiance/cour_avant/comfort-score`

Tous ces tests ont été faits avec succès sur une base de `seed/seed.js`.

## Sécurité
- Clé API obligatoire pour `POST /measurements` et `POST /observations`
- Validation des données via les schémas Mongoose
- Gestion des erreurs centralisée (middleware `errorHandler`)
- `POST /devices` pas protégé pour l'instant — c'est une faille connue, voir le rapport pour la solution qu'on propose