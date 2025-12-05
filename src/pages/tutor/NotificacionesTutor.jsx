import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import { BellIcon } from "@heroicons/react/24/solid";

export default function NotificacionesTutor() {
  const { id } = useParams();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        // ⬇⬇ RUTA REAL: Notificaciones del alumno/hijo
        const res = await api.get(`/notificaciones/alumno/${id}`);
        setNotificaciones(res.data);
      } catch (error) {
        console.error("Error cargando notificaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarNotificaciones();
  }, [id]);

  if (loading) {
    return <p className="text-gray-500 animate-pulse">Cargando notificaciones...</p>;
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <BellIcon className="h-8 w-8 text-blue-600" />
        Notificaciones
      </h1>

      {notificaciones.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No tienes notificaciones aún.
        </p>
      ) : (
        <div className="space-y-4">
          {notificaciones.map((n) => (
            <div
              key={n.id_notificacion}
              className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-600"
            >
              <p className="font-semibold">{n.mensaje}</p>
              <p className="text-sm text-gray-500">
                {n.fecha_envio} {n.hora_envio}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
