import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("iteme_token");
    const savedAdmin = localStorage.getItem("iteme_admin");
    if (token && savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("iteme_token", data.token);
    localStorage.setItem("iteme_admin", JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data.admin;
  }

  function logout() {
    localStorage.removeItem("iteme_token");
    localStorage.removeItem("iteme_admin");
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
