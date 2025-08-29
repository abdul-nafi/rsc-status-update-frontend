import axios from "axios";

const api = axios.create({
  baseURL: "https://rsc-status-update-backend-production.up.railway.app/", // Your deployed Django backend URL
});

// Attach token in Authorization header for requests after login
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token"); // Classic DRF Token name
  if (token) {
    config.headers.Authorization = `Token ${token}`; // Classic DRF token scheme
  }
  return config;
});

export default api;
