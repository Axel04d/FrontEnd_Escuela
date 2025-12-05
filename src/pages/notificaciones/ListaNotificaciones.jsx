import { useEffect, useState } from "react";
import api from "../../api/api.js";
import { TrashIcon, EnvelopeIcon } from "@heroicons/react/24/solid";

export default function ListaNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);

  const cargar = async () => {
    const res = await api.get("/notificaciones");
    setNotificaciones(res.data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar esta notificación?")) return;

    await api.delete(`/notificaciones/${id}`);
    cargar();
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <EnvelopeIcon className="h-9 w-9 text-blue-600" />
        Notificaciones
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        {notificaciones.length === 0 && (
          <p className="text-gray-500">No hay notificaciones enviadas.</p>
        )}

        {notificaciones.map((n) => (
          <div
            key={n.id_notificacion}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            {/* INFO */}
            <div>
              <p className="font-semibold">
                Mensaje: <span className="font-normal">{n.mensaje}</span>
              </p>
              <p className="text-sm text-gray-600">
                De: {n.tb_docente.nombre} {n.tb_docente.apellidos}
              </p>
              <p className="text-sm text-gray-600">
                Para: {n.tb_alumno.nombre} {n.tb_alumno.apellidos}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {n.fecha_envio} — {n.hora_envio}
              </p>
            </div>

            {/* DELETE BUTTON */}
            <button
              onClick={() => eliminar(n.id_notificacion)}
              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
