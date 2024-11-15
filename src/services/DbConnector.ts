import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_MIDDLEWARE_URL
});

export default api;

// HELPER ------------------------------------------------------------------------

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

// GET ------------------------------------------------------------------------

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

export async function getCategories(): Promise<any> {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const response = await api.get('/trainingcategories/', { headers });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await generateToken();
      return getCategories();
    } else {
      console.error('Error fetching training categories:', error);
      throw error;
    }
  }
}

export async function getUser(role?: number): Promise<any> {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const params = role ? { role } : {};
    const response = await api.get('/users/', { headers, params });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await generateToken();
      return getCategories();
    } else {
      console.error('Error fetching training categories:', error);
      throw error;
    }
  }
}

// POST ------------------------------------------------------------------------

export const newTrainingType = async (name:string, description:string, category:number, maxParticipants:number, minParticipants:number, requirements:string): Promise<number>  => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const body = {
      name: name,
      description: description,
      category: category,
      maxParticipants: maxParticipants,
      minParticipants: minParticipants,
      requirements: requirements
    }
    const response = await api.post('/trainingtypes/', body, { headers });
    return response.data.id;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await generateToken();
      return getCategories();
    } else {
      console.error('Error fetching training categories:', error);
      throw error;
    }
  }
}

export const newTrainingTimeBlock = async (start:string, end:string): Promise<number>  => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const body = {
      start: start,
      end: end,
    }
    const response = await api.post('/timeblocks/', body, { headers });
    return response.data.id;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await generateToken();
      return getCategories();
    } else {
      console.error('Error fetching training categories:', error);
      throw error;
    }
  }
}