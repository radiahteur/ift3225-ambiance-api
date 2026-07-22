// Soumission d'une observation par un usager connecté.
// Le token JWT stocké dans localStorage est envoyé
// dans l'en-tête Authorization pour authentifier la requête.
import axios from "axios";

const API_URL = "http://localhost:3000";

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

  return response.data;
}