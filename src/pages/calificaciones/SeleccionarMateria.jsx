import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api.js";
import { BookOpenIcon } from "@heroicons/react/24/solid";

export default function SeleccionarMateria() {
  const { id } = useParams(); // ID del grupo
  const navigate = useNavigate();

  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarMateriasDelGrupo = async () => {
      try {
        const alumnosRes = await api.get("/alumnos");
        const alumnosGrupo = alumnosRes.data.filter(
          (a) => Number(a.id_grupo) === Number(id)
        );

        if (alumnosGrupo.length === 0) {
          setMaterias([]);
          setCargando(false);
          return;
        }

        const relaciones = [];

        for (const alumno of alumnosGrupo) {
          const res = await api.get(
            `/alumnomateria/alumno/${alumno.id_alumno}`
          );
          relaciones.push(...res.data);
        }

        // Extraer materias únicas
        const materiasUnicas = [];

        relaciones.forEach((rel) => {
          if (
            !materiasUnicas.some(
              (m) => m.id_materia === rel.id_materia
            )
          ) {
            materiasUnicas.push({
              id_materia: rel.id_materia,
              nombre_materia: rel.tb_materia?.nombre_materia,
            });
          }
        });

        setMaterias(materiasUnicas);
      } catch (error) {
        console.error("Error cargando materias del grupo:", error);
        setMaterias([]);
      } finally {
        setCargando(false);
      }
    };

    cargarMateriasDelGrupo();
  }, [id]);

  if (cargando)
    return <p className="text-gray-400 animate-pulse">Cargando materias...</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Calificaciones del Grupo</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {materias.map((m) => (
          <div
            key={m.id_materia}
            className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
            onClick={() =>
              navigate(`/grupos/${id}/calificaciones/${m.id_materia}`)
            }
          >
            <div className="flex items-center gap-3">
              <BookOpenIcon className="h-10 w-10 text-blue-600" />
              <h2 className="text-xl font-bold">{m.nombre_materia}</h2>
            </div>
          </div>
        ))}
      </div>

      {materias.length === 0 && (
        <p className="text-gray-600">
          Este grupo aún no tiene materias asignadas.
        </p>
      )}
    </div>
  );
}
