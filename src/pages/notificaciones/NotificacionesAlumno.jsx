import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api.js";

export default function NotificacionesAlumno() {
  const { id } = useParams();
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    api.get(`/notificaciones/alumno/${id}`).then((res) => {
      setNotificaciones(res.data);
    });
  }, [id]);

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Mis Notificaciones</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        {notificaciones.length === 0 && (
          <p className="text-gray-500">No tienes notificaciones aún.</p>
        )}

        {notificaciones.map((n) => (
          <div key={n.id_notificacion} className="p-4 border rounded-lg">
            <p className="font-semibold">De: {n.tb_docente.nombre} {n.tb_docente.apellidos}</p>
            <p className="mt-2">{n.mensaje}</p>
            <p className="text-xs text-gray-500 mt-2">
              {n.fecha_envio} — {n.hora_envio}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
