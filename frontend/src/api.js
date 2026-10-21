import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Every request automatically carries the logged-in user's token, so pages
// never have to attach it manually.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
