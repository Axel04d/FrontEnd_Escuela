import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api.js";

import {
  UserGroupIcon,
  UsersIcon,
  BellAlertIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

export default function DashboardDocente() {
  const [grupos, setGrupos] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resGrupos, resNotif] = await Promise.all([
          api.get("/grupos"),
          api.get("/notificaciones"),
        ]);

        setGrupos(resGrupos.data);
        setNotificaciones(resNotif.data.slice(0, 4));
      } catch (error) {
        console.error("Error cargando dashboard docente:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading)
    return <p className="text-gray-400 animate-pulse">Cargando panel...</p>;

  return (
    <div className="space-y-12">

      {/* ==================== TÍTULO ==================== */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-800">
          Panel del Docente
        </h1>
        <p className="text-gray-500 mt-1">
          Bienvenido profesor, aquí tienes acceso directo a tus tareas diarias.
        </p>
      </div>

      {/* ==================== TARJETAS PRINCIPALES ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* === MIS GRUPOS === */}
        <Link
          to="/app/grupos"
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer border-l-8 border-blue-600"
        >
          <div className="flex justify-between items-center">
            <UserGroupIcon className="h-14 w-14 text-blue-600" />
            <span className="text-4xl font-extrabold text-blue-700">
              {grupos.length}
            </span>
          </div>
          <h2 className="text-xl font-bold mt-4">Mis Grupos</h2>
          <p className="text-gray-500 text-sm">
            Consulta los grupos que tienes asignados.
          </p>
        </Link>

        {/* === ALUMNOS === */}
        <Link
          to="/app/alumnos"
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer border-l-8 border-green-600"
        >
          <div className="flex justify-between items-center">
            <UsersIcon className="h-14 w-14 text-green-600" />
            <span className="text-4xl font-extrabold text-green-700">
              {/* No necesitas contar desde backend aquí */}
              —
            </span>
          </div>
          <h2 className="text-xl font-bold mt-4">Alumnos</h2>
          <p className="text-gray-500 text-sm">
            Revisa el desempeño y la información de tus alumnos.
          </p>
        </Link>

        {/* === NOTIFICACIONES === */}
        <Link
          to="/app/notificaciones"
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer border-l-8 border-yellow-500"
        >
          <div className="flex justify-between items-center">
            <BellAlertIcon className="h-14 w-14 text-yellow-600" />
            <span className="text-4xl font-extrabold text-yellow-600">
              {notificaciones.length}
            </span>
          </div>
          <h2 className="text-xl font-bold mt-4">Notificaciones</h2>
          <p className="text-gray-500 text-sm">
            Envía avisos a los tutores o revisa las últimas alertas.
          </p>
        </Link>

      </div>

      {/* ==================== ACCESOS RÁPIDOS ==================== */}
      <div className="bg-white p-8 rounded-2xl shadow space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
          Acciones Rápidas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/app/notificaciones/enviar"
            className="bg-purple-600 hover:bg-purple-700 p-5 rounded-xl text-white text-lg flex items-center gap-4 shadow"
          >
            <BellAlertIcon className="h-8 w-8" />
            Enviar Notificación
          </Link>

          <Link
            to="/app/grupos"
            className="bg-blue-600 hover:bg-blue-700 p-5 rounded-xl text-white text-lg flex items-center gap-4 shadow"
          >
            <UserGroupIcon className="h-8 w-8" />
            Ver Mis Grupos
          </Link>

          <Link
            to="/app/alumnos"
            className="bg-green-600 hover:bg-green-700 p-5 rounded-xl text-white text-lg flex items-center gap-4 shadow"
          >
            <UsersIcon className="h-8 w-8" />
            Ver Alumnos
          </Link>
        </div>
      </div>

      {/* ==================== ACTIVIDAD RECIENTE ==================== */}
      <div className="bg-white p-8 rounded-2xl shadow space-y-6">
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
                <p className="font-semibold">{n.titulo || n.mensaje}</p>
                <p className="text-sm text-gray-500">{n.fecha} — {n.hora}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
