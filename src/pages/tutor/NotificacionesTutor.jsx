import { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../auth/AuthContext";
import { BellIcon } from "@heroicons/react/24/solid";

export default function NotificacionesTutor() {
  const { user } = useContext(AuthContext);

  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        const hijos = user?.hijos || [];

        // Si no tiene hijos, no tiene notificaciones
        if (hijos.length === 0) {
          setNotificaciones([]);
          setLoading(false);
          return;
        }

        let todas = [];

        // Trae las notificaciones reales por cada hijo
        for (const hijo of hijos) {
          const res = await api.get(`/notificaciones/alumno/${hijo.id_alumno}`);
          todas = [...todas, ...res.data];
        }

        // Ordenar por fecha y hora (descendente)
        todas.sort((a, b) => {
          const fechaA = new Date(`${a.fecha_envio} ${a.hora_envio}`);
          const fechaB = new Date(`${b.fecha_envio} ${b.hora_envio}`);
          return fechaB - fechaA;
        });

        setNotificaciones(todas);
      } catch (error) {
        console.error("Error cargando notificaciones del tutor:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarNotificaciones();
  }, [user]);

  if (loading) {
    return (
      <p className="text-gray-500 animate-pulse">
        Cargando notificaciones...
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
        <BellIcon className="h-9 w-9 text-blue-600" />
        Mis Notificaciones
      </h1>

      {notificaciones.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No tienes notificaciones aún.
        </p>
      ) : (
        <div className="space-y-4">
          {notificaciones.map((n, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-600"
            >
              <p className="font-semibold text-gray-900">{n.mensaje}</p>

              <p className="text-sm text-gray-500 mt-1">
                {n.fecha_envio} • {n.hora_envio}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
