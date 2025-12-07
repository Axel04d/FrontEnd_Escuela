import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api.js";
import { AuthContext } from "../auth/AuthContext";

import {
  UserGroupIcon,
  BellAlertIcon,
  ClipboardDocumentListIcon,
  SparklesIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function DashboardTutor() {
  const { user } = useContext(AuthContext);

  const [hijos, setHijos] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    setHijos(user?.hijos || []);

    const cargarNotificaciones = async () => {
      try {
        const resNoti = await api.get("/notificaciones/tutor");
        setNotificaciones(resNoti.data?.slice(0, 5) || []);
      } catch (error) {
        console.error("Error cargando notificaciones tutor:", error);
      }
    };

    cargarNotificaciones();
  }, [user]);

  return (
    <div className="space-y-14">

      {/* ===========================================================
                        ENCABEZADO PRINCIPAL
      =========================================================== */}
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
          Bienvenido, Tutor
          <SparklesIcon className="h-7 w-7 text-blue-600" />
        </h1>

        <p className="text-gray-500 text-lg">
          Supervisa el rendimiento académico, conductual y el progreso de tus hijos.
        </p>
      </header>

      {/* ===========================================================
                            TARJETAS RESUMEN
      =========================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Hijos */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border border-gray-100 flex items-center gap-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <UserGroupIcon className="h-10 w-10 text-blue-600" />
          </div>

          <div>
            <p className="text-2xl font-bold text-gray-900">{hijos.length}</p>
            <p className="text-gray-500 text-sm">Hijos registrados</p>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border border-gray-100 flex items-center gap-6">
          <div className="bg-yellow-100 p-4 rounded-full">
            <BellAlertIcon className="h-10 w-10 text-yellow-600" />
          </div>

          <div>
            <p className="text-2xl font-bold text-gray-900">{notificaciones.length}</p>
            <p className="text-gray-500 text-sm">Notificaciones recientes</p>
          </div>
        </div>

        {/* Accesos rápidos */}
        <Link
          to="/app/tutor/notificaciones"
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-between"
        >
          <div>
            <p className="text-lg font-semibold">Centro de Notificaciones</p>
            <p className="text-blue-100 text-sm">Consultar mensajes del docente</p>
          </div>
          <BellAlertIcon className="h-10 w-10 opacity-80" />
        </Link>
      </section>

      {/* ===========================================================
                                HIJOS
      =========================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Mis Hijos</h2>

        {hijos.length === 0 ? (
          <p className="text-gray-500">Aún no tienes hijos registrados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {hijos.map((hijo) => (
              <Link
                key={hijo.id_alumno}
                to={`/app/tutor/hijo/${hijo.id_alumno}`}
                className="group bg-white p-7 rounded-2xl shadow border border-gray-200 hover:shadow-xl transition relative overflow-hidden"
              >
                {/* Decoración lateral */}
                <div className="absolute left-0 top-0 h-full w-2 bg-blue-500 rounded-r-lg group-hover:w-3 transition-all"></div>

                <div className="flex items-center gap-5">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <UserIcon className="h-12 w-12 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {hijo.nombre} {hijo.apellidos}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Grupo: {hijo.grupo || "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-blue-600 font-semibold text-sm group-hover:underline">
                  Ver progreso →
                </div>
              </Link>
            ))}

          </div>
        )}
      </section>

      {/* ===========================================================
                         NOTIFICACIONES RECIENTES
      =========================================================== */}
      <section className="bg-white p-8 rounded-2xl shadow border border-gray-100 space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
          <BellAlertIcon className="h-8 w-8 text-gray-700" />
          Últimas Notificaciones
        </h2>

        {notificaciones.length === 0 ? (
          <p className="text-gray-500">No hay notificaciones recientes.</p>
        ) : (
          <div className="space-y-5">

            {notificaciones.map((n) => (
              <div
                key={n.id_notificacion}
                className="p-5 bg-gray-50 rounded-xl border-l-4 border-blue-600 shadow-sm"
              >
                <p className="text-gray-900 font-semibold">{n.mensaje}</p>

                <p className="text-sm text-gray-500 mt-1">
                  {n.fecha_envio} — {n.hora_envio}
                </p>
              </div>
            ))}

          </div>
        )}
      </section>

    </div>
  );
}
