import axios from "axios";

const normalizeBaseUrl = value =>
  (value || "http://localhost:5000").replace(/\/$/, "");

const api = axios.create({
  baseURL: normalizeBaseUrl(process.env.REACT_APP_API_BASE_URL)
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiBaseUrl = () => api.defaults.baseURL;

export default api;
