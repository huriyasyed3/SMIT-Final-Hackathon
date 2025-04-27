import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const addTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error("Error adding task:", error.response?.data || error.message);
    throw error;
  }
};

export default api