import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_MIDDLEWARE_URL
});

export default api;

export async function generateToken(): Promise<void> {
  try {
    const body = {
      username: import.meta.env.VITE_API_USERNAME,
      password: import.meta.env.VITE_API_PASSWORD,
    };
    const response = await api.post('/login/', body);
    if (response.data.access) {
      localStorage.setItem('APItoken', response.data.access);
    }
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}

export async function getTrainingTypes(): Promise<any> {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const response = await api.get('/trainingtypes/', { headers });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await generateToken();
      return getTrainingTypes();
    } else {
      console.error('Error fetching training types:', error);
      throw error;
    }
  }
}