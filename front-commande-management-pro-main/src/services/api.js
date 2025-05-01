import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8090/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const auth = {
  login: async (credentials) => {
    try {
      console.log('Sending login request with credentials:', credentials);
      const response = await api.post('/auth/login', {
        identifiant: credentials.identifiant,
        motDePasse: credentials.motDePasse
      });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default api;
