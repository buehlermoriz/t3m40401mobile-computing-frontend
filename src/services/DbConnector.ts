import axios from 'axios';
import { toRaw } from 'vue';



const api = axios.create({
  baseURL: import.meta.env.VITE_MIDDLEWARE_URL
});

export default api;

interface participants {
  participants: number[]
}

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

export async function getTrainingTypes(id?: number): Promise<any> {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const params = id ? { id } : {};

    const response = await api.get('/trainingtypes/', { headers, params });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await generateToken();
      return getTrainingTypes(id? id : undefined);
    } else {
      console.error('Error fetching training types:', error);
      throw error;
    }
  }
}

export async function getTrainingBlocks(): Promise<any> {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const response = await api.get('/timeblocks/', { headers });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await generateToken();
      return getTrainingBlocks();
    } else {
      console.error('Error fetching training types:', error);
      throw error;
    }
  }
}

export async function getTrainings(participants?: number, id?: number): Promise<any> {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const params: any = {};

    if (participants) {
      params.participants = participants;
    } else if (id) {
      params.id = id;
    }    const response = await api.get('/trainings/', { headers, params });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await generateToken();
      return getTrainings();
    } else {
      console.error('Error fetching training types:', error);
      throw error;
    }
  }
}

export async function getTrainingCategory(): Promise<any> {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const response = await api.get('/trainingcategories/', { headers });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await generateToken();
      return getTrainingCategory();
    } else {
      console.error('Error fetching training categories:', error);
      throw error;
    }
  }
}

export async function getUser(role?: number, uid?: string): Promise<any> {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const params: any = {};

    if (uid) {
      params.uid = uid;
    } else if (role) {
      params.role = role;
    }
    const response = await api.get('/users/', { headers, params });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await generateToken();
      return getUser();
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
      return newTrainingType(name, description, category, maxParticipants, minParticipants, requirements);
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
      return newTrainingTimeBlock(start, end);
    } else {
      console.error('Error fetching training categories:', error);
      throw error;
    }
  }
}

export const newTraining = async (trainingTypeId:number, timeblocks:number[], notes: string, selectedTeacher: number): Promise<number>  => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const body = {
      notes: notes,
      type: trainingTypeId,
      blocks: toRaw(timeblocks),
      participants: [
        selectedTeacher
      ]
    }
    const response = await api.post('/trainings/', body, { headers });
    return response.data.id;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await generateToken();
      return newTraining(trainingTypeId, timeblocks, notes, selectedTeacher);
    } else {
      console.error('Error fetching training categories:', error);
      throw error;
    }
  }
}

export const newTrainingCategory = async (name:string): Promise<number>  => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const body = {
      name: name
    }
    const response = await api.post('/trainingcategories/', body, { headers });
    return response.data.id;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await generateToken();
      return newTrainingCategory(name);
    } else {
      console.error('Error creating new category:', error);
      throw error;
    }
  }
}

export const newUser = async (name:string, role:number, birthDate: string, uid: string, email: string): Promise<number>  => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const body = {
      name: name,
      role: role,
      birthDate: birthDate,
      uid: uid,
      email: email
    }
    const response = await api.post('/users/', body, { headers });
    return response.data.id;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await generateToken();
      return newUser(name, role, birthDate, uid, email);
    } else {
      console.error('Error creating new user:', error);
      throw error;
    }
  }
}

// PATCH ------------------------------------------------------------------------

export const patchTraining = async (trainingId:number, participants: participants): Promise<any>  => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const body = {
      participants: participants.participants

    }
    const response = await api.patch(`/trainings/${trainingId}/`, body, { headers });
    return response.data.id;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await generateToken();
      return patchTraining(trainingId, participants);
    } else {
      console.error('Error fetching training categories:', error);
      throw error;
    }
  }
}
// DELETE ------------------------------------------------------------------------

export async function deleteTrainingCategory(id: number): Promise<any> {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const response = await api.delete(`/trainingcategories/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await deleteTrainingCategory(id);
      return getUser();
    } else {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}
export async function deleteEvent(id: number): Promise<any> {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('APItoken')}`,
    };
    const response = await api.delete(`/trainings/${id}`, { headers });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await deleteEvent(id);
      return getUser();
    } else {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
}