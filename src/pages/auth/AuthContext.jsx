import { createContext, useState, useEffect } from "react";
import api from "../../api/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const savedUser = localStorage.getItem("usuario");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
  }, []);

  const login = ({ id_usuario, id_perfil, email, nombre, rol, hijos, token }) => {
    const usuario = {
      id_usuario,
      id_perfil, // null para admin ✔
      email,
      nombre,
      rol,
      hijos: hijos || [],
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("token", token);

    setUser(usuario);
    setToken(token);

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

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
