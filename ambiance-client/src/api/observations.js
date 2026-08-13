// Soumission d'une observation par un usager connecté.


import axios from "axios";
import { API_URL } from "../config";
import { invalidateCacheByPrefix } from "../utils/cache";

export async function submitObservation(location, crowdLevel, ambiance, notes) {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/observations/user`,
    {
      deviceId: "web-client",
      location,
      crowdLevel,
      ambiance,
      notes,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  invalidateCacheByPrefix(`ambiance:${location}:`);

  return response.data;
}