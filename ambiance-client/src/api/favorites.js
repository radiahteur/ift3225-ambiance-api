// Fonctions liées aux favoris de l'usager connecté.
// Ajoute ou retire un lieu de sa liste de favoris.
// Ces appels nécessitent d'être connecté (token JWT requis).

import axios from "axios";
import { API_URL } from "../config";

export async function addFavorite(placeId) {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/users/me/favorites/${placeId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function removeFavorite(placeId) {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${API_URL}/users/me/favorites/${placeId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}