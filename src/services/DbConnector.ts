import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_MIDDLEWARE_URL,
  headers: {
    Authorization: import.meta.env.VITE_MIDDLEWARE_KEY,
  }
});

export default api;

export async function get() {
  const response = await api.get('/');
  return response.data.response;
  }