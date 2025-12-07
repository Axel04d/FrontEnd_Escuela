import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api.js";

import {
  UserIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  BookOpenIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

// 🔙 Botón reutilizable
function BotonRegresar() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 mb-6 px-4 py-2 
                 bg-gray-200 hover:bg-gray-300 text-gray-700 
                 rounded-lg w-fit transition"
    >
      ⬅ Regresar
    </button>
  );
}

export default function HijoDetalle() {
  const { id } = useParams();

  const [alumno, setAlumno] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // 🔵 Cargar datos EXACTAMENTE como VerAlumno.jsx
  // ================================
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 🧑‍🎓 Alumno
        const alumnoRes = await api.get(`/alumnos/${id}`);
        setAlumno(alumnoRes.data);

        // 📘 Materias reales
        const materiasRes = await api.get(`/alumnomateria/alumno/${id}`);
        setMaterias(materiasRes.data);

        // 🔔 Notificaciones
        const notiRes = await api.get(`/notificaciones/alumno/${id}`);
        setNotificaciones(notiRes.data);

      } catch (error) {
        console.error("Error cargando datos del hijo:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  if (loading) return <p className="text-gray-500 animate-pulse">Cargando...</p>;
  if (!alumno) return <p className="text-red-600">No se encontró información del alumno.</p>;

  return (
    <div className="space-y-10">
      <BotonRegresar />

      {/* ================= INFORMACIÓN GENERAL ================= */}
      <div className="bg-white p-6 rounded-xl shadow flex items-center gap-6">
        <UserIcon className="h-16 w-16 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">
            {alumno.nombre} {alumno.apellidos}
          </h1>

          <p className="text-gray-500">
            {alumno.tb_grupo?.grado} • Grupo {alumno.tb_grupo?.grupo}
          </p>
        </div>
      </div>

      {/* ================= MATERIAS ================= */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpenIcon className="h-6 w-6 text-purple-600" />
          Materias y Calificaciones
        </h2>

        {materias.length === 0 ? (
          <p className="text-gray-500">No hay materias asignadas.</p>
        ) : (
          <table className="w-full border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Materia</th>
                <th className="p-3 border text-center">Calificación</th>
              </tr>
            </thead>

            <tbody>
              {materias.map((m) => (
                <tr key={m.id_materia}>
                  <td className="p-3 border">
                    {m.tb_materia?.nombre_materia || "Materia sin nombre"}
                  </td>
                  <td className="p-3 border text-center font-semibold">
                    {m.calificacion ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ================= NOTIFICACIONES ================= */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BellIcon className="h-6 w-6 text-gray-700" />
          Notificaciones del Maestro
        </h2>

        {notificaciones.length === 0 ? (
          <p className="text-gray-500">No hay notificaciones.</p>
        ) : (
          <ul className="space-y-4">
            {notificaciones.map((n) => (
              <li
                key={n.id_notificacion}
                className="p-4 bg-gray-50 border rounded-lg"
              >
                <p className="font-semibold">{n.mensaje}</p>
                <p className="text-sm text-gray-500">
                  {n.fecha_envio} {n.hora_envio}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
