// Fonctions liées aux lieux.
// Permet de récupérer la liste des lieux (pour la carte)


import axios from "axios";
import { API_URL } from "../config";
import { getCached, setCached } from "../utils/cache";

export async function getPlaces() {
  const cacheKey = "places:all";
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await axios.get(`${API_URL}/places`);
  setCached(cacheKey, response.data);
  return response.data;
}

export async function getPlaceById(id) {
  const cacheKey = `places:${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await axios.get(`${API_URL}/places/${id}`);
  setCached(cacheKey, response.data);
  return response.data;
}