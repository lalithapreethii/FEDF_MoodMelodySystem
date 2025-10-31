import axios from 'axios';
export const login = async (email, password) => {
  const res = await axios.post('/api/login', { email, password });
  return res.data;
};
export const signup = async (email, password) => {
  const res = await axios.post('/api/signup', { email, password });
  return res.data;
};
