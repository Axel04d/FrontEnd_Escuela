import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api.js";

import {
  UserIcon,
  BellAlertIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

export default function DashboardTutor() {
  const [hijos, setHijos] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const resHijos = await api.get("/tutor/hijos");
        const resNoti = await api.get("/tutor/notificaciones");

        setHijos(resHijos.data || []);
        setNotificaciones(resNoti.data?.slice(0, 5) || []);
      } catch (error) {
        console.error("Error cargando panel del tutor:", error);
      }
    };

    cargar();
  }, []);

  return (
    <div className="space-y-12">

      {/* ==================== TITULO ==================== */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-800">Panel del Tutor</h1>
        <p className="text-gray-500 mt-1">
          Consulta el progreso, notificaciones y desempeño de tus hijos.
        </p>
      </div>

      {/* ==================== TARJETAS DE HIJOS ==================== */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Hijos</h2>

        {hijos.length === 0 ? (
          <p className="text-gray-500">No se encontraron hijos asociados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {hijos.map((hijo) => (
              <Link
                key={hijo.id}
                to={`/app/tutor/hijo/${hijo.id}`}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border-l-8 border-blue-600 transition cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <UserIcon className="h-16 w-16 text-blue-600" />

                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {hijo.nombre}
                    </p>
                    <p className="text-gray-500">
                      {hijo.grado} • Grupo {hijo.grupo}
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-blue-600 font-semibold text-sm">
                  Ver progreso →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ==================== ACCESOS RÁPIDOS ==================== */}
      <section className="bg-white p-8 rounded-2xl shadow space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
          Accesos Rápidos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/app/tutor/notificaciones"
            className="bg-yellow-500 hover:bg-yellow-600 p-5 rounded-xl text-white text-lg flex items-center gap-4 shadow"
          >
            <BellAlertIcon className="h-8 w-8" />
            Ver Notificaciones
          </Link>

          <Link
            to="/app/tutor/hijos"
            className="bg-blue-600 hover:bg-blue-700 p-5 rounded-xl text-white text-lg flex items-center gap-4 shadow"
          >
            <UserIcon className="h-8 w-8" />
            Ver Hijos
          </Link>

          <Link
            to="/app/tutor/notificaciones"
            className="bg-purple-600 hover:bg-purple-700 p-5 rounded-xl text-white text-lg flex items-center gap-4 shadow"
          >
            <BookOpenIcon className="h-8 w-8" />
            Revisar Actividad
          </Link>
        </div>
      </section>

      {/* ==================== NOTIFICACIONES RECIENTES ==================== */}
      <section className="bg-white p-8 rounded-2xl shadow space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <BellAlertIcon className="h-8 w-8 text-gray-700" />
          Últimas Notificaciones
        </h2>

        {notificaciones.length === 0 ? (
          <p className="text-gray-500">No tienes notificaciones recientes.</p>
        ) : (
          <ul className="space-y-4">
            {notificaciones.map((n) => (
              <li
                key={n.id_notificacion}
                className="p-5 bg-gray-50 rounded-xl border shadow-sm"
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
