<<<<<<< HEAD
// Fonctions d'authentification côté client.
// Gère l'inscription et la connexion en appelant l'API.
=======
// Services d'authentification.
// Gère l'inscription, la connexion et les requêtes liées aux utilisateurs.

// Instance Axios utilisée pour communiquer avec le backend.
>>>>>>> a96bc67 (Ajout de commentaires)
import axios from "axios";

const API_URL = "http://localhost:3000";

export async function login(email, password) {
  const response = await axios.post(`${API_URL}/users/login`, {
    email,
    password,
  });

  return response.data;
}

export async function register(username, email, password) {
  const response = await axios.post(`${API_URL}/users/register`, {
    username,
    email,
    password,
  });

  return response.data;
}

export async function getMe() {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getMyObservations() {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/users/me/observations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}