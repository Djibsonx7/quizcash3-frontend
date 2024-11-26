import axios from 'axios';

// Configuration de l'instance Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 5000, // Timeout pour éviter les longues attentes
});

// Gestion des erreurs globales via un interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API :', error.response?.data || error.message);
    // Retourne une erreur formatée pour l'interface utilisateur
    return Promise.reject(
      error.response?.data?.message || 'Une erreur est survenue.'
    );
  }
);

// Création d'une session
export const createSession = async (sessionData) => {
  try {
    // Correction de l'URL
    const response = await api.post('/sessions/create', sessionData); 
    return response.data;
  } catch (error) {
    throw new Error(error); // La gestion spécifique reste côté appelant
  }
};

// Récupération des questions
export const fetchQuestions = async () => {
  try {
    const response = await api.get('/questions');
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

// Rejoindre une session
export const joinSession = async (sessionId, playerData) => {
  try {
    const response = await api.post(`/sessions/join`, {
      sessionId,
      ...playerData,
    }); // Correction pour correspondre au backend
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

// Récupérer toutes les sessions disponibles
export const getAllSessions = async (params = {}) => {
  try {
    const response = await api.get('/sessions/all', { params }); // Correction pour correspondre au backend
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
