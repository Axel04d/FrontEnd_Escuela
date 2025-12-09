import { createContext, useState, useEffect } from "react";
import api from "../../api/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // ======================================================
  // 🔵 CARGAR SESIÓN DESDE LOCALSTORAGE AL INICIAR
  // ======================================================
  useEffect(() => {
    const savedUser = localStorage.getItem("usuario");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setToken(savedToken);

      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
  }, []);

  // ======================================================
  // 🔵 LOGIN — GUARDAR SESIÓN
  // ======================================================
  const login = ({ id_usuario, email, nombre, rol, id_perfil, hijos, token }) => {
    const usuario = {
      id_usuario,
      email,
      nombre,
      rol,
      id_perfil,
      hijos: hijos || []
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("token", token);

    setUser(usuario);
    setToken(token);

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // ======================================================
  // 🔴 LOGOUT
  // ======================================================
  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);

    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
