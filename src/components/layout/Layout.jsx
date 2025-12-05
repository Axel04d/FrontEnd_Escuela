import { useContext } from "react";
import { AuthContext } from "../../pages/auth/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const { user } = useContext(AuthContext);

  // Si no hay usuario → se asume ADMIN por defecto
  const rol = user?.rol || "admin";

  return (
    <div className="min-h-screen flex">

      {/* SIDEBAR con menú dinámico */}
      <Sidebar rol={rol} />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 ml-64 bg-gray-100 min-h-screen">

        {/* Encabezado */}
        <Header />

        {/* Rutas internas */}
        <div className="p-10">
          <Outlet />
        </div>

      </main>
    </div>
  );
}
