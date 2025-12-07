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
  PaperAirplaneIcon,
  BookOpenIcon as MateriasIcon,
} from "@heroicons/react/24/solid";

// 🔙 Botón Reutilizable
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

export default function VerAlumno() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [alumno, setAlumno] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [conducta, setConducta] = useState({ positivos: 0, negativos: 0 });
  const [loading, setLoading] = useState(true);

  // CARGAR DATOS
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const alumnoRes = await api.get(`/alumnos/${id}`);
        setAlumno(alumnoRes.data);

        const materiaRes = await api.get(`/alumnomateria/alumno/${id}`);
        setMaterias(materiaRes.data);

        const notiRes = await api.get(`/notificaciones/alumno/${id}`);
        setNotificaciones(notiRes.data);

      } catch (error) {
        console.error("Error al cargar alumno:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  if (loading) return <p className="text-gray-400 animate-pulse">Cargando datos...</p>;
  if (!alumno) return <p className="text-red-500">Error: Alumno no encontrado.</p>;

  return (
    <div className="space-y-10">

      <BotonRegresar />

      {/* TÍTULO */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Alumno: {alumno.nombre} {alumno.apellidos}
        </h1>

        <button
          onClick={() => navigate(`/app/admin/alumno/${id}/materias`)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition"
        >
          <MateriasIcon className="h-6 w-6" />
          Asignar Materias
        </button>
      </div>

      {/* INFORMACIÓN GENERAL */}
      <section className="bg-white p-6 rounded-xl shadow grid md:grid-cols-2 gap-8">
        {/* ALUMNO */}
        <div className="flex items-center gap-4">
          <UserIcon className="h-14 w-14 text-blue-600" />
          <div>
            <p className="text-2xl font-semibold">
              {alumno.nombre} {alumno.apellidos}
            </p>
            <p className="text-gray-500">
              {alumno.grado} • Grupo {alumno.grupo}
            </p>
          </div>
        </div>

        {/* TUTOR */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-4">
            <AcademicCapIcon className="h-14 w-14 text-green-500" />
            <div>
              <p className="text-xl font-semibold">Tutor</p>
              <p className="text-gray-500">
                {alumno.tutor?.nombre} {alumno.tutor?.apellidos}
              </p>
            </div>
          </div>

          {/* 🔵 BOTÓN CORREGIDO */}
          <button
            onClick={() =>
              navigate(
                `/app/notificaciones/enviar?alumno=${alumno.id_alumno}&tutor=${alumno.id_tutor}`
              )
            }
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            Enviar Notificación
          </button>
        </div>
      </section>

      {/* CONDUCTA */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ClipboardDocumentListIcon className="h-6 w-6 text-gray-700" />
          Conducta
        </h2>

        <div className="flex gap-14 text-center">
          <div>
            <FaceSmileIcon className="h-14 w-14 text-green-500 mx-auto" />
            <p className="text-3xl font-bold">{conducta.positivos}</p>
            <p className="text-gray-500">Puntos Positivos</p>
          </div>

          <div>
            <FaceFrownIcon className="h-14 w-14 text-red-500 mx-auto" />
            <p className="text-3xl font-bold">{conducta.negativos}</p>
            <p className="text-gray-500">Puntos Negativos</p>
          </div>
        </div>
      </section>

      {/* MATERIAS */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpenIcon className="h-6 w-6 text-purple-600" />
          Materias y Calificaciones
        </h2>

        {materias.length === 0 ? (
          <p className="text-gray-500">Este alumno no tiene materias asignadas.</p>
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

      {/* NOTIFICACIONES */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BellIcon className="h-6 w-6 text-gray-500" />
          Notificaciones del Tutor
        </h2>

        {notificaciones.length === 0 ? (
          <p className="text-gray-500">No hay notificaciones.</p>
        ) : (
          <ul className="space-y-4">
            {notificaciones.map((n) => (
              <li key={n.id_notificacion} className="p-4 bg-gray-50 border rounded-lg">
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
