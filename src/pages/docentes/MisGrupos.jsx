import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import { UserGroupIcon, AcademicCapIcon } from "@heroicons/react/24/solid";

export default function MisGrupos() {
  const [grupos, setGrupos] = useState([]);
  const [docente, setDocente] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 📌 1. Cargar docente logueado desde localStorage
  useEffect(() => {
    const d = localStorage.getItem("docente");
    if (d) {
      setDocente(JSON.parse(d));
    } else {
      alert("No hay maestro logueado.");
    }
  }, []);

  // 📌 2. Cargar grupos reales del backend
  useEffect(() => {
    if (!docente) return;

    const cargar = async () => {
      try {
        const res = await api.get("/grupos");
        const todos = res.data;

        // 🔵 FILTRAR SOLO LOS GRUPOS ASIGNADOS AL DOCENTE LOGUEADO
        const mios = todos.filter(
          (g) => Number(g.id_docente) === Number(docente.id_docente)
        );

        // 🔵 Obtener número de alumnos en cada grupo
        const gruposConAlumnos = await Promise.all(
          mios.map(async (g) => {
            const alumnosRes = await api.get(`/alumnos`);
            const alumnosGrupo = alumnosRes.data.filter(
              (a) => Number(a.id_grupo) === Number(g.id_grupo)
            );

            return {
              ...g,
              totalAlumnos: alumnosGrupo.length
            };
          })
        );

        setGrupos(gruposConAlumnos);
      } catch (error) {
        console.error("Error cargando grupos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [docente]);

  if (loading)
    return (
      <p className="text-gray-500 animate-pulse">Cargando grupos del docente...</p>
    );

  return (
    <div className="space-y-10">
      {/* TÍTULO */}
      <div className="flex items-center gap-3">
        <AcademicCapIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">
          Mis grupos — {docente?.nombre} {docente?.apellidos}
        </h1>
      </div>

      {grupos.length === 0 && (
        <p className="text-gray-500">
          No tienes grupos asignados.
        </p>
      )}

      {/* GRID DE GRUPOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {grupos.map((g) => (
          <div
            key={g.id_grupo}
            className="bg-white rounded-xl border shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3">
              <UserGroupIcon className="h-10 w-10 text-blue-600" />
              <div>
                <p className="text-xl font-bold">
                  {g.grado} • Grupo {g.grupo}
                </p>
                <p className="text-gray-500 text-sm">
                  Alumnos: <span className="font-semibold">{g.totalAlumnos}</span>
                </p>
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex flex-col gap-3 mt-6">
              <button
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                onClick={() => navigate(`/grupos/${g.id_grupo}/alumnos`)}
              >
                Ver / gestionar alumnos
              </button>

              <button
                className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                onClick={() =>
                  navigate(`/grupos/${g.id_grupo}/calificaciones`)
                }
              >
                Capturar calificaciones
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
