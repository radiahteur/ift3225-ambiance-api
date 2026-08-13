// Fonctions liées à l'ambiance d'un lieu.
// Regroupe les appels vers l'historique, les créneaux calmes
// et le score de confort renvoyés par l'API.
// Ces données sont mises en cache 60s côté client : elles ne changent
// vraiment qu'après une nouvelle observation, et sont invalidées à ce
// moment-là par submitObservation() dans api/observations.js.

import axios from "axios";
import { API_URL } from "../config";
import { getCached, setCached } from "../utils/cache";

export async function getHistory(location) {
  const cacheKey = `ambiance:${location}:history`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await axios.get(`${API_URL}/ambiance/${location}/history`);
  setCached(cacheKey, response.data);
  return response.data;
}

export async function getQuietHours(location) {
  const cacheKey = `ambiance:${location}:quiet-hours`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await axios.get(`${API_URL}/ambiance/${location}/quiet-hours`);
  setCached(cacheKey, response.data);
  return response.data;
}

export async function getComfortScore(location) {
  const cacheKey = `ambiance:${location}:comfort-score`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await axios.get(`${API_URL}/ambiance/${location}/comfort-score`);
  setCached(cacheKey, response.data);
  return response.data;
}