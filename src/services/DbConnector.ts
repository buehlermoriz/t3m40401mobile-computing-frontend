import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_MIDDLEWARE_URL,
  headers: {
    Authorization: import.meta.env.VITE_MIDDLEWARE_KEY,
  }
});

export default api;

export async function getReach() {
  const response = await api.post('/v1/get-reach');
  return response.data.reach;
  }

  export async function getPrintModules() {
    const response = await api.post('/v1/get-print-modules');
    return response.data.modules;
  }

  export async function getDigitalModules() {
    const response = await api.post('/v1/get-digital-modules');
    return response.data.modules;
  }