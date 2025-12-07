import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";

/* PÚBLICAS */
import ActivarCuenta from "../pages/auth/ActivarCuenta";
import Login from "../pages/auth/Login";
import SeleccionarRol from "../pages/debug/SeleccionarRol";

/* DASHBOARDS */
import Dashboard from "../pages/Dashboard";                
import DashboardDocente from "../pages/docentes/DashboardDocente";
import DashboardTutor from "../pages/tutor/DashboardTutor";

/* TUTORES */
import HijoDetalle from "../pages/tutor/HijoDetalle";
import NotificacionesTutor from "../pages/tutor/NotificacionesTutor";
import ListaTutores from "../pages/tutores/ListaTutores";
import AgregarTutor from "../pages/tutores/AgregarTutor";
import EditarTutor from "../pages/tutores/EditarTutor";

/* DOCENTES */
import ListaDocentes from "../pages/docentes/ListaDocentes";
import AgregarDocente from "../pages/docentes/AgregarDocente";
import EditarDocente from "../pages/docentes/EditarDocente";

/* ALUMNOS */
import ListaAlumnos from "../pages/alumnos/ListaAlumnos";
import VerAlumno from "../pages/alumnos/VerAlumno";
import EditarAlumno from "../pages/alumnos/EditarAlumno";
import CrearAlumno from "../pages/alumnos/CrearAlumno";
import AsignarMateriasAlumno from "../pages/materias/AsignarMateriasAlumno";

/* GRUPOS */
import ListaGrupos from "../pages/grupos/ListaGrupos";
import AgregarGrupo from "../pages/grupos/AgregarGrupo";
import EditarGrupo from "../pages/grupos/EditarGrupo";
import AsignarMateriasGrupo from "../pages/grupos/AsignarMateriasGrupo";
import AsignarAlumnosGrupo from "../pages/grupos/AsignarAlumnosGrupo";

/* MATERIAS */
import ListaMaterias from "../pages/materias/ListaMaterias";
import AgregarMateria from "../pages/materias/AgregarMateria";
import EditarMateria from "../pages/materias/EditarMateria";
import AlumnosMateria from "../pages/materias/AlumnosMateria";

/* CALIFICACIONES */
import SeleccionarMateria from "../pages/calificaciones/SeleccionarMateria";
import CapturarCalificaciones from "../pages/calificaciones/CapturarCalificaciones";

/* NOTIFICACIONES */
import ListaNotificaciones from "../pages/notificaciones/ListaNotificaciones";
import EnviarNotificacion from "../pages/notificaciones/EnviarNotificacion";
import NotificacionesAlumno from "../pages/notificaciones/NotificacionesAlumno";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========= RUTA INICIAL — SIEMPRE ADMIN ========= */}
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

        {/* ========= RUTAS PÚBLICAS ========= */}
        <Route path="/login" element={<Login />} />
        <Route path="/activar-cuenta" element={<ActivarCuenta />} />
        <Route path="/debug/roles" element={<SeleccionarRol />} />

        {/* ========= ZONA PRIVADA / APP ========= */}
        <Route path="/app" element={<Layout />}>

          {/* DASHBOARD ADMIN */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* DASHBOARD DOCENTE */}
          <Route path="dashboard-docente" element={<DashboardDocente />} />

          {/* DASHBOARD TUTOR */}
          <Route path="dashboard-tutor" element={<DashboardTutor />} />

          {/* ALUMNOS */}
          <Route path="alumnos" element={<ListaAlumnos />} />
          <Route path="alumnos/crear" element={<CrearAlumno />} />
          <Route path="alumnos/editar/:id" element={<EditarAlumno />} />
          <Route path="alumnos/:id" element={<VerAlumno />} />
          <Route path="admin/alumno/:id/materias" element={<AsignarMateriasAlumno />} />

          {/* GRUPOS */}
          <Route path="grupos" element={<ListaGrupos />} />
          <Route path="grupos/agregar" element={<AgregarGrupo />} />
          <Route path="grupos/editar/:id" element={<EditarGrupo />} />
          <Route path="grupos/:id/materias" element={<AsignarMateriasGrupo />} />
          <Route path="grupos/:id/alumnos" element={<AsignarAlumnosGrupo />} />

          {/* CALIFICACIONES */}
          <Route path="grupos/:id/calificaciones" element={<SeleccionarMateria />} />
          <Route path="grupos/:id/calificaciones/:idMateria" element={<CapturarCalificaciones />} />

          {/* MATERIAS */}
          <Route path="materias" element={<ListaMaterias />} />
          <Route path="materias/agregar" element={<AgregarMateria />} />
          <Route path="materias/editar/:id" element={<EditarMateria />} />
          <Route path="materias/:id/alumnos" element={<AlumnosMateria />} />

          {/* DOCENTES */}
          <Route path="docentes" element={<ListaDocentes />} />
          <Route path="docentes/agregar" element={<AgregarDocente />} />
          <Route path="docentes/editar/:id" element={<EditarDocente />} />

          {/* TUTORES */}
          <Route path="tutores" element={<ListaTutores />} />
          <Route path="tutores/agregar" element={<AgregarTutor />} />
          <Route path="tutores/editar/:id" element={<EditarTutor />} />

          {/* NOTIFICACIONES */}
          <Route path="notificaciones" element={<ListaNotificaciones />} />
          <Route path="notificaciones/enviar" element={<EnviarNotificacion />} />
          <Route path="notificaciones/alumno/:id" element={<NotificacionesAlumno />} />

          {/* PANEL TUTOR */}
          <Route path="tutor/hijo/:id" element={<HijoDetalle />} />
          <Route path="tutor/notificaciones" element={<NotificacionesTutor />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
