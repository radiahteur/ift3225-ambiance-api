# Ambiance API — Phase 2

Projet réalisé pour le cours IFT3225: Développement d'API et services Web

**Auteures :** Radiah Mohamed Assowe (20229344), Fatoumata Mane (20214863)

## Description

Ambiance API est une API REST faite avec Node.js et Express. Elle sert à collecter, stocker et interpréter des données d'ambiance captées par un téléphone (via Phyphox) et par des observations qu'on note nous-mêmes. Le but, c'est de transformer ces données brutes en indicateurs simples sur l'ambiance d'un lieu : historique, heures calmes, score de confort.

La phase 1 du projet a mis en place l'infrastructure de collecte : réception des données, persistance MongoDB et exposition d'endpoints permettant d'interroger l'ambiance d'un lieu.

La phase 2 du projet ajoute une application cliente React pour visualiser l'ambiance des lieux sur une carte, consulter un portrait détaillé (historique, créneaux calmes, classification) et interagir avec le système grâce à un compte utilisateur.

Le système permet :
1. d'enregistrer des devices (téléphones / capteurs)
2. de collecter des mesures environnementales (son, lumière, mouvement)
3. d'ajouter des observations humaines associées à un utilisateur (le fallback manuel)
4. de classifier l'ambiance d'un lieu (historique, heures calmes, score de confort)
5. de visualiser les lieux sur une carte
6. de créer un compte pour soumettre des observations protégées
7. de consulter ses propres contributions

## Prérequis du projet

- Node.js v18 ou plus
- npm (vient avec Node.js)
- Un compte MongoDB Atlas avec un cluster et une chaîne de connexion
- Phyphox sur un téléphone (capteur "Amplitude sonore" / "Audio Amplitude") si on veut refaire une collecte
- Postman pour tester l'API

## Architecture du projet

Le projet est divisé en 2 parties, dans un seul dépôt Git :

```
ift3225-ambiance-api/            # Racine du dépôt serveur backend
│
├── controllers/
├── routes/
├── models/
├── middleware/
├── seed/
├── config/
├── server.js
├── app.js
├── insert-phase2-data.js         # Script d'insertion des mesures de la phase 2
├── .env.example
├── .env                           # à créer soi-même (non versionné)
│
└── ambiance-client/               # Application React (frontend)
    ├── public/
    ├── src/
    │   ├── api/                   # Couche client isolant les appels à l'API
    │   ├── pages/                 # Vues (Home, Login, Register, Account, MapView, PlaceDetails)
    │   ├── components/            # Composants partagés (Navbar, etc.)
    │   ├── App.css
    │   ├── index.css
    │   ├── App.jsx
    │   └── main.jsx
    └── index.html
```

## Installation et lancement

### 1. Backend

Cloner le dépôt et installer les dépendances :

```bash
cd ift3225-ambiance-api
npm install
```

Copier `.env.example` vers `.env` et mettre vos propres valeurs :

```
PORT=3000
MONGO_URI=mongodb+srv://<utilisateur>:<motdepasse>@<cluster>.mongodb.net/<nomBaseDonnees>?retryWrites=true&w=majority
API_KEYS=key123,key456
JWT_SECRET=<votre secret JWT>
```

Le `MONGO_URI` vient de votre cluster Atlas (étape : Database, puis Connect, puis Drivers). `API_KEYS` est une liste de clés à partager avec l'équipe. `JWT_SECRET` sert à signer les tokens d'authentification utilisateur.

(Optionnel) Pour remplir la base avec des données de démo de la phase 1 :

```bash
node seed/seed.js
```

Lancer le serveur :

```bash
npm start
```

Le serveur tourne par défaut sur `http://localhost:3000`.

### 2. Frontend (application cliente React)

Le client React consomme l'API et doit tourner **en parallèle** du serveur backend, dans un **second terminal séparé**.

Dans un nouveau terminal :

```bash
cd ambiance-client
npm install
npm run dev
```

Le client démarre sur l'URL indiquée par Vite (ex. `http://localhost:5173`).

> Le backend (`npm start`, terminal 1) et le frontend (`npm run dev`, terminal 2) doivent tourner **en même temps**, chacun dans son propre terminal, pour que l'application fonctionne.

### 3. Configuration du client

Le client React pointe vers l'API via une constante `API_URL` définie dans les fichiers de `ambiance-client/src/api/` (par défaut `http://localhost:3000`). Si votre backend tourne sur un autre port ou une autre adresse, modifiez cette constante dans chacun de ces fichiers.

## Se connecter et tester les actions protégées (interface)

1. Une fois les deux serveurs lancés, ouvrir l'URL du client dans le navigateur.
2. Aller sur **Inscription** pour créer un compte (nom d'utilisateur, courriel, mot de passe).
3. Se connecter sur **Connexion** : un token JWT est renvoyé par l'API et conservé dans le `localStorage` du navigateur.
4. La barre de navigation reflète l'état connecté (affiche "Mon compte" et "Déconnexion").
5. Sur la page **Mon compte**, consulter son profil et le récapitulatif de ses observations soumises.
6. Sur la carte, cliquer sur un lieu puis remplir le formulaire **"Ajouter une observation"** dans la vue détaillée action protégée, nécessite d'être connecté (le token est automatiquement joint via `Authorization: Bearer <token>`).
7. Se déconnecter retire le token ; la lecture des lieux, de l'historique et des créneaux calmes reste accessible sans connexion (lectures publiques).

### Vues de l'application cliente

- **Carte** (`/`) : tous les lieux positionnés selon leurs coordonnées, marqueur coloré selon la classification d'ambiance courante, clic → portrait détaillé.
- **Portrait d'un lieu** (`/place/:id`) : badge de classification, historique (graphique), créneaux calmes, formulaire de soumission d'observation.
- **Connexion / Inscription** (`/login`, `/register`).
- **Mon compte** (`/account`) : identité de l'utilisateur, récapitulatif de ses contributions, déconnexion.

## Les technologies utilisées

**Backend**
- Phyphox (capteur Amplitude sonore)
- Node.js / Express.js
- MongoDB Atlas + Mongoose
- dotenv
- morgan (pour logger les requêtes dans le terminal)
- bcryptjs (hashage des mots de passe)
- jsonwebtoken (génération et validation JWT)
- Postman (tests API)

**Frontend**
- React.js (application cliente)
- React Router (navigation côté client)
- Axios (communication avec l'API)
- Leaflet / react-leaflet (carte interactive)
- Recharts (graphiques d'historique)

## Authentification

Deux mécanismes d'authentification sont utilisés.

### Authentification par clé API

Les appareils de collecte utilisent une clé API. Les routes qui écrivent dans la base (`POST /measurements`, `POST /observations`) demandent cette clé.

Header requis :

```
x-api-key: key123
```

Réponses selon les cas :
- Pas d'en-tête : `401 Unauthorized`, code `MISSING_API_KEY`
- Mauvaise clé : `403 Forbidden`, code `INVALID_API_KEY`
- Bonne clé : la requête passe normalement

Les routes GET restent ouvertes à tout le monde. `POST /devices` n'est volontairement pas protégé pour l'instant, c'est une faille expliquée dans le rapport.

### Authentification utilisateur JWT

Les utilisateurs de l'application React utilisent un compte personnel.

Flux :
1. L'utilisateur crée un compte avec `/users/register`
2. Il se connecte avec `/users/login`
3. Le serveur vérifie le mot de passe
4. Le serveur génère un token JWT
5. Le client conserve le token (`localStorage`)
6. `Authorization: Bearer <token>` est envoyé par le client pour une action protégée
7. Le middleware `authenticateJWT` vérifie le token avant d'autoriser la requête

Actions protégées : soumettre une observation utilisateur, consulter son profil, consulter ses contributions.

## Table des endpoints

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /devices | Aucune | Enregistre un nouveau device |
| GET | /devices | Publique | Liste tous les devices |
| POST | /measurements | x-api-key | Enregistre une mesure capteur |
| GET | /measurements | Publique | Liste les mesures (filtres : location, deviceId, from, to, limit) |
| POST | /observations | x-api-key | Enregistre une observation humaine (collecte automatisée) |
| POST | /observations/user | JWT | Ajoute une observation liée à un utilisateur connecté |
| GET | /observations | Publique | Liste les observations (filtres : location, deviceId, from, to, limit) |
| GET | /ambiance/:location/history | Publique | Évolution récente des mesures d'un lieu |
| GET | /ambiance/:location/quiet-hours | Publique | Les heures habituellement les plus calmes |
| GET | /ambiance/:location/comfort-score | Publique | Score de confort global d'un lieu |
| POST | /users/register | Aucune | Création d'un compte utilisateur |
| POST | /users/login | Aucune | Connexion et génération JWT |
| GET | /users/me | JWT | Informations du compte connecté |
| GET | /users/me/observations | JWT | Historique des observations personnelles |
| GET | /places | Publique | Liste des lieux avec coordonnées GPS |
| GET | /places/:id | Publique | Détails d'un lieu |

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

## Évolution des modèles de données

**Place**
```json
{
  "name": "bibliotheque",
  "location": "bibliotheque",
  "latitude": 45.504,
  "longitude": -73.613
}
```
Ces coordonnées permettent l'affichage sur une carte.

**User**
```json
{
  "username": "radiah",
  "email": "radiah@test.com",
  "favorites": []
}
```
Le mot de passe est stocké sous forme hashée avec bcrypt.

**Observation**
```json
{
  "location": "bibliotheque",
  "ambiance": "quiet",
  "author": "ObjectId utilisateur"
}
```
Une observation possède maintenant un auteur, ce qui permet de retrouver les contributions d'un utilisateur.

## Tests (Postman)

On a testé l'API dans Postman en suivant ces étapes :
- **Devices** — POST /devices (201), GET /devices (200 + la liste)
- **Authentification** — POST /measurements sans x-api-key (401, code MISSING_API_KEY), avec une mauvaise clé (403, code INVALID_API_KEY), avec la bonne clé (201 + le document créé)
- **Measurements** — POST /measurements avec la bonne clé, puis GET /measurements avec et sans filtres (location, from, to)
- **Observations** — POST /observations avec la bonne clé, GET /observations
- **Analyse** — GET /ambiance/cour_avant/history, GET /ambiance/cour_avant/quiet-hours, GET /ambiance/cour_avant/comfort-score
- **Utilisateurs** — POST /users/register, POST /users/login, GET /users/me avec Authorization: Bearer token
- **Observations utilisateur** — POST /observations/user, GET /users/me/observations

Tous ces tests ont été faits avec succès sur une base de `seed/seed.js`.

## Sécurité

- Clé API obligatoire pour POST /measurements et POST /observations
- JWT obligatoire pour les actions protégées côté utilisateur (POST /observations/user, GET /users/me, GET /users/me/observations)
- Validation des données via les schémas Mongoose
- Gestion des erreurs centralisée (middleware errorHandler)
- POST /devices pas protégé pour l'instant c'est une faille connue, voir le rapport pour la solution qu'on propose

## Dépendances principales — Phase 2

**Backend**
- bcryptjs : hashage des mots de passe
- jsonwebtoken : génération et validation JWT

**Frontend**
- React
- React Router
- Axios
- Leaflet / react-leaflet
- Recharts
