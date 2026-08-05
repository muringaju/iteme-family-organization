
import axios from "axios";

export const ASSET_BASE =
  "http://localhost:5001";

const api = axios.create({
  baseURL:
    "http://localhost:5001/api",

  headers: {
    Accept: "application/json",
  },
});

// =====================================================
// AUTH TOKEN
// =====================================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "iteme_token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

export default api;

