import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import { AuthContext } from "../auth/AuthContext";

import {
  UserGroupIcon,
  UsersIcon,
  BellAlertIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

export default function DashboardDocente() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [grupos, setGrupos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // 🔵 CARGAR GRUPOS, ALUMNOS Y NOTIFICACIONES DEL DOCENTE
  // ================================
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resGrupos = await api.get("/grupos");
        const resAlumnos = await api.get("/alumnos");
        const resNotif = await api.get("/notificaciones");

        setGrupos(resGrupos.data);

        // FILTRAR alumnos que pertenecen a los grupos del docente
        const idsMisGrupos = resGrupos.data.map((g) => g.id_grupo);
        const alumnosDelDocente = resAlumnos.data.filter((a) =>
          idsMisGrupos.includes(a.id_grupo)
        );

        setAlumnos(alumnosDelDocente);

        // Últimas notificaciones del docente
        const misNotificaciones = resNotif.data
          .filter((n) => n.id_docente === user.id_perfil)
          .slice(0, 5);

        setNotificaciones(misNotificaciones);

      } catch (error) {
        console.error("Error cargando dashboard docente:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user]);

  if (loading)
    return <p className="text-gray-400 animate-pulse">Cargando panel...</p>;

  return (
    <div className="space-y-16">

      {/* ==================== ENCABEZADO ==================== */}
      <header>
        <h1 className="text-4xl font-extrabold text-gray-800">
          Panel del Docente
        </h1>
        <p className="text-gray-500 mt-1">
          Bienvenido profesor, aquí puedes gestionar tus grupos, alumnos y notificaciones.
        </p>
      </header>

      {/* ==================== TARJETAS PRINCIPALES ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* GRUPOS */}
        <Link
          to="/app/grupos"
          className="bg-white p-8 rounded-2xl border-l-8 border-blue-600 shadow hover:shadow-xl transition"
        >
          <div className="flex justify-between items-center">
            <UserGroupIcon className="h-14 w-14 text-blue-600" />
            <span className="text-4xl font-extrabold text-blue-700">
              {grupos.length}
            </span>
          </div>
          <h2 className="text-xl font-bold mt-4">Mis Grupos</h2>
          <p className="text-gray-500 text-sm">Consulta tus grupos asignados.</p>
        </Link>

        {/* ALUMNOS */}
        <div className="bg-white p-8 rounded-2xl border-l-8 border-green-600 shadow">
          <div className="flex justify-between items-center">
            <UsersIcon className="h-14 w-14 text-green-600" />
            <span className="text-4xl font-extrabold text-green-700">
              {alumnos.length}
            </span>
          </div>
          <h2 className="text-xl font-bold mt-4">Mis Alumnos</h2>
          <p className="text-gray-500 text-sm">Alumnos que pertenecen a tus grupos.</p>
        </div>

        {/* NOTIFICACIONES */}
        <Link
          to="/app/notificaciones"
          className="bg-white p-8 rounded-2xl shadow border-l-8 border-yellow-500 hover:shadow-xl transition"
        >
          <div className="flex justify-between items-center">
            <BellAlertIcon className="h-14 w-14 text-yellow-600" />
            <span className="text-4xl font-extrabold text-yellow-600">
              {notificaciones.length}
            </span>
          </div>
          <h2 className="text-xl font-bold mt-4">Notificaciones</h2>
          <p className="text-gray-500 text-sm">Mensajes enviados recientemente.</p>
        </Link>

      </div>

      {/* =====================================================
           LISTA DE ALUMNOS + ENVIAR NOTIFICACIÓN DESDE AQUÍ
         ===================================================== */}
      <section className="bg-white p-8 rounded-2xl shadow space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <UsersIcon className="h-8 w-8 text-blue-600" />
          Mis Alumnos
        </h2>

        {alumnos.length === 0 ? (
          <p className="text-gray-500">No tienes alumnos asignados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {alumnos.map((al) => (
              <div
                key={al.id_alumno}
                className="p-6 bg-gray-50 rounded-xl shadow border hover:shadow-md transition"
              >
                <h3 className="text-xl font-bold text-gray-800">
                  {al.nombre} {al.apellidos}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  Grupo: {al.grado} - {al.grupo}
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/app/notificaciones/enviar?alumno=${al.id_alumno}&tutor=${al.id_tutor}`
                    )
                  }
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                  Enviar Notificación
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ==================== ACTIVIDAD RECIENTE ==================== */}
      <section className="bg-white p-8 rounded-2xl shadow space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpenIcon className="h-8 w-8 text-gray-700" />
          Actividad Reciente
        </h2>

        {notificaciones.length === 0 ? (
          <p className="text-gray-500">No hay actividad reciente.</p>
        ) : (
          <ul className="space-y-4">
            {notificaciones.map((n) => (
              <li
                key={n.id_notificacion}
                className="p-4 bg-gray-50 border rounded-xl shadow-sm"
              >
                <p className="font-semibold">{n.mensaje}</p>
                <p className="text-sm text-gray-500">
                  {n.fecha_envio} — {n.hora_envio}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  );
}
