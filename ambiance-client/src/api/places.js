import axios from "axios";

const API_URL = "http://localhost:3000";

export async function getPlaces() {
  const response = await axios.get(`${API_URL}/places`);
  return response.data;
}

export async function getPlaceById(id) {
  const response = await axios.get(`${API_URL}/places/${id}`);
  return response.data;
}