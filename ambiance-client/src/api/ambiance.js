import axios from "axios";

const API_URL = "http://localhost:3000";

export async function getHistory(location) {
  const response = await axios.get(`${API_URL}/ambiance/${location}/history`);
  return response.data;
}

export async function getQuietHours(location) {
  const response = await axios.get(`${API_URL}/ambiance/${location}/quiet-hours`);
  return response.data;
}

export async function getComfortScore(location) {
  const response = await axios.get(`${API_URL}/ambiance/${location}/comfort-score`);
  return response.data;
}