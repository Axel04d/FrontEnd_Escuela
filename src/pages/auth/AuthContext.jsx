import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ======================================================
  // 🔵 CARGAR SESIÓN DESDE LOCALSTORAGE AL INICIAR LA APP
  // ======================================================
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("usuario");
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedToken) {
        const parsed = JSON.parse(savedUser);

        if (parsed?.rol) {
          setUser({
            id_usuario: parsed.id_usuario || null,
            email: parsed.email || null,
            nombre: parsed.nombre || "",
            rol: parsed.rol,
            id_perfil: parsed.id_perfil || null,
            hijos: parsed.hijos || [],   // 🔵 importante
            token: savedToken,
          });
        }
      }
    } catch (error) {
      console.error("Error al cargar sesión:", error);
      setUser(null);
    }
  }, []);

  // ======================================================
  // 🔵 GUARDAR SESIÓN DESPUÉS DEL LOGIN
  // ======================================================
  const login = ({ id_usuario, email, nombre, rol, id_perfil, token, hijos }) => {
    const usuario = {
      id_usuario,
      email,
      nombre,
      rol,
      id_perfil,
      hijos: hijos || [],   // 🔵 si es tutor, aquí llegan los hijos
    };

    // Guardar en localStorage
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("token", token);

    setUser({
      ...usuario,
      token,
    });
  };

  // ======================================================
  // 🔴 CERRAR SESIÓN
  // ======================================================
  const logout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
