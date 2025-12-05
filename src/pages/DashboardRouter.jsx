import { useContext } from "react";
import { AuthContext } from "../pages/auth/AuthContext";

import DashboardAdmin from "./Dashboard";
import DashboardDocente from "./docentes/DashboardDocente";
import DashboardTutor from "./tutor/DashboardTutor";

export default function DashboardRouter() {
  const { user } = useContext(AuthContext);

  // ⛔ ADMIN SIN LOGIN → mostrar DashboardAdmin directamente
  if (!user) {
    return <DashboardAdmin />;
  }

  // ⛔ Con usuario logueado → asignar dashboard según rol
  switch (user.rol) {
    case "admin":
      return <DashboardAdmin />;
    case "docente":
      return <DashboardDocente />;
    case "tutor":
      return <DashboardTutor />;
    default:
      return <p>Rol desconocido</p>;
  }
}
