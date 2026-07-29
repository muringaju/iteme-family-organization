import axios from "axios";
import Avatar from "../components/Avatar.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Base URL for uploaded images/files
export const ASSET_BASE = API_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("iteme_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;