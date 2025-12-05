import { useContext } from "react";
import { AuthContext } from "../pages/auth/AuthContext";

import DashboardAdmin from "./Dashboard";
import DashboardDocente from "./docentes/DashboardDocente";
import DashboardTutor from "./tutor/DashboardTutor";

export default function DashboardRouter() {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Cargando...</p>;

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
