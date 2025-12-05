import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import { UserGroupIcon, BookOpenIcon } from "@heroicons/react/24/solid";

export default function AlumnosMateria() {
  const { id } = useParams(); // id de la materia
  const navigate = useNavigate();

  const [materia, setMateria] = useState(null);
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    // 📘 Cargar información de la materia
    api.get(`/materias/${id}`).then((res) => {
      setMateria(res.data);
    });

    // 👨‍🏫 Cargar alumnos inscritos en la materia
    api
      .get(`/alumno-materia/materia/${id}`)
      .then((res) => {
        // res.data tiene [{ Alumno, calificacion }]
        const ordenados = res.data.sort((a, b) =>
          a.tb_alumno.nombre.localeCompare(b.tb_alumno.nombre)
        );
        setAlumnos(ordenados);
      })
      .catch(() => setAlumnos([]));
  }, [id]);

  if (!materia)
    return <p className="text-gray-400 animate-pulse">Cargando materia...</p>;

  return (
    <div className="space-y-10">
      {/* Título */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <BookOpenIcon className="h-8 w-8 text-purple-600" />
        Alumnos de {materia.nombre_materia}
      </h1>

      {/* Tabla */}
      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Alumno</th>
              <th className="p-3 border">Grupo</th>
              <th className="p-3 border text-center">Calificación</th>
              <th className="p-3 border text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {alumnos.map((a) => (
              <tr key={a.id}>
                <td className="p-3 border">
                  {a.tb_alumno.nombre} {a.tb_alumno.apellidos}
                </td>

                <td className="p-3 border">
                  {a.tb_alumno.tb_grupo?.grado}°
                  {" - "}
                  {a.tb_alumno.tb_grupo?.grupo}
                </td>

                <td className="p-3 border text-center font-semibold">
                  {a.calificacion ?? "—"}
                </td>

                <td className="p-3 border text-center">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={() =>
                      navigate(
                        `/calificaciones/capturar/${a.tb_alumno.id_alumno}/${id}`
                      )
                    }
                  >
                    Calificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {alumnos.length === 0 && (
          <p className="text-gray-500 mt-4">
            No hay alumnos inscritos en esta materia.
          </p>
        )}
      </div>
    </div>
  );
}
