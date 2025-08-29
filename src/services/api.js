import axios from "axios";

// Base Axios instance
const api = axios.create({
  baseURL:"https://rsc-status-update-backend-production.up.railway.app/",// Change to your Django backend URL
});

// Later for auth: api.defaults.withCredentials = true;
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;
