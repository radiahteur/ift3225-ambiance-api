import axios from "axios";

const API_URL = "http://localhost:3000";

export async function login(email, password) {
  const response = await axios.post(`${API_URL}/users/login`, {
    email,
    password,
  });

  return response.data;
}