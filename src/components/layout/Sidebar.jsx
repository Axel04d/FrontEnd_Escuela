import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../pages/auth/AuthContext";

import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  AcademicCapIcon,
  UserIcon,
  BookOpenIcon,
  BellAlertIcon,
  PlusIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ rol }) {
  const { logout } = useContext(AuthContext);

  const linkStyle =
    "flex items-center gap-3 p-3 rounded-lg transition hover:bg-gray-700 text-gray-300";
  const activeStyle =
    "flex items-center gap-3 p-3 rounded-lg bg-blue-600 text-white";

  // Función para renderizar enlaces limpios
  const Item = ({ to, icon: Icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? activeStyle : linkStyle)}
    >
      <Icon className="h-6 w-6" />
      {children}
    </NavLink>
  );

  return (
    <aside className="w-64 h-screen bg-gray-900 fixed top-0 left-0 p-6 flex flex-col justify-between shadow-xl">

      {/* ====== ENCABEZADO ====== */}
      <div>
        <h1 className="text-3xl font-bold tracking-wide mb-6 text-white">
          EduScore
        </h1>

        {/* ====== MENÚ SEGÚN ROL ====== */}
        <nav className="flex flex-col gap-2">

          {/* ===========================
                  ADMINISTRADOR
             =========================== */}
          {rol === "admin" && (
            <>
              <Item to="/app/dashboard" icon={HomeIcon}>Dashboard</Item>
              <Item to="/app/grupos" icon={UserGroupIcon}>Grupos</Item>
              <Item to="/app/alumnos" icon={UsersIcon}>Alumnos</Item>
              <Item to="/app/alumnos/crear" icon={PlusIcon}>Crear Alumno</Item>
              <Item to="/app/tutores" icon={UserIcon}>Tutores</Item>
              <Item to="/app/docentes" icon={AcademicCapIcon}>Docentes</Item>
              <Item to="/app/materias" icon={BookOpenIcon}>Materias</Item>
              <Item to="/app/notificaciones" icon={BellAlertIcon}>Notificaciones</Item>
            </>
          )}

          {/* ===========================
                  DOCENTE
             =========================== */}
          {rol === "docente" && (
            <>
              <Item to="/app/docente/dashboard" icon={HomeIcon}>Inicio Docente</Item>
              <Item to="/app/grupos" icon={UserGroupIcon}>Grupos</Item>
              <Item to="/app/alumnos" icon={UsersIcon}>Alumnos</Item>
              <Item to="/app/alumnos/crear" icon={PlusIcon}>Crear Alumno</Item>
              <Item to="/app/notificaciones" icon={BellAlertIcon}>Notificaciones</Item>
            </>
          )}

          {/* ===========================
                  TUTOR
             =========================== */}
          {rol === "tutor" && (
            <>
              <Item to="/app/tutor/dashboard" icon={HomeIcon}>Mis Hijos</Item>
              <Item to="/app/tutor/notificaciones" icon={BellAlertIcon}>Notificaciones</Item>
            </>
          )}

        </nav>
      </div>

      {/* ====== BOTÓN LOGOUT ABAJO ====== */}
      <button
        onClick={logout}
        className="flex items-center gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition w-full"
      >
        <ArrowLeftOnRectangleIcon className="h-6 w-6" />
        Cerrar Sesión
      </button>
    </aside>
  );
}
