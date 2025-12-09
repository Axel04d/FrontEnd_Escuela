import { useContext } from "react";
import { AuthContext } from "../../pages/auth/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, Navigate } from "react-router-dom";

export default function Layout() {
  const { user } = useContext(AuthContext);

  // ❌ Antes: rol por defecto = admin
  // ❗ Ahora: si NO hay usuario → redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const rol = user.rol;

  return (
    <div className="min-h-screen flex">

      {/* SIDEBAR */}
      <Sidebar rol={rol} />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 ml-64 bg-gray-100 min-h-screen">

        <Header user={user} />

        <div className="p-10">
          <Outlet />
        </div>

      </main>
    </div>
  );
}
