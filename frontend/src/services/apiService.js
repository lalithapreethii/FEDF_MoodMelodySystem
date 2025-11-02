import axios from 'axios';

const API_URL = 'https://mood-song-backend-s1tm.onrender.com/api';


// Auth APIs
export const signup = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
    email,
    password
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
};

// Mood Recommendation API
export const getMoodRecommendation = async (answers) => {
  const response = await axios.post(`${API_BASE_URL}/recommend`, {
    answers
  });
  return response.data;
};

// Journal APIs
export const saveJournal = async (journalData) => {
  const response = await axios.post(`${API_BASE_URL}/journal`, journalData);
  return response.data;
};

export const getJournals = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/journal/${userId}`);
  return response.data;
};

// History APIs
export const getSongHistory = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/history/${userId}`);
  return response.data;
};

export const saveSongHistory = async (historyData) => {
  const response = await axios.post(`${API_BASE_URL}/history`, historyData);
  return response.data;
};
