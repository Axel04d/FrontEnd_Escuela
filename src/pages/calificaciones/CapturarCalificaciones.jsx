import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api.js";

export default function CapturarCalificaciones() {
  // ⬅️ Coincide EXACTAMENTE con AppRouter
  const { id, idMateria } = useParams();
  const navigate = useNavigate();

  const id_grupo = id;
  const id_materia = idMateria;

  const [grupo, setGrupo] = useState(null);
  const [materia, setMateria] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (!id_grupo || !id_materia) {
          console.error("ID de grupo o materia vacío");
          setLoading(false);
          return;
        }

        // 1) Grupo
        const grupoRes = await api.get(`/grupos/${id_grupo}`);
        setGrupo(grupoRes.data);

        // 2) Materia
        const materiaRes = await api.get(`/materias/${id_materia}`);
        setMateria(materiaRes.data);

        // 3) Alumnos del grupo
        const alumnosRes = await api.get("/alumnos");
        const alumnosGrupo = alumnosRes.data.filter(
          (a) => Number(a.id_grupo) === Number(id_grupo)
        );

        // 4) Obtener calificación real
        const alumnosConCalificacion = await Promise.all(
          alumnosGrupo.map(async (al) => {
            try {
              const res = await api.get(
                `/alumnomateria/alumno/${al.id_alumno}`
              );

              const relacion = res.data.find(
                (m) => Number(m.id_materia) === Number(id_materia)
              );

              return {
                ...al,
                relacionExiste: Boolean(relacion),
                calificacion: relacion?.calificacion ?? "",
              };
            } catch {
              return { ...al, relacionExiste: false, calificacion: "" };
            }
          })
        );

        setAlumnos(alumnosConCalificacion);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id_grupo, id_materia]);

  const actualizarCalificacion = (idAlumno, valor) => {
    if (valor < 0) valor = 0;
    if (valor > 10) valor = 10;

    setAlumnos((prev) =>
      prev.map((a) =>
        a.id_alumno === idAlumno ? { ...a, calificacion: valor } : a
      )
    );
  };

  const guardar = async () => {
    try {
      for (const al of alumnos) {
        // Si NO existe relación → la creamos
        if (!al.relacionExiste) {
          await api.post("/alumnomateria", {
            id_alumno: al.id_alumno,
            id_materia,
          });
        }

        // Actualizamos calificación
        await api.put(`/alumnomateria/${al.id_alumno}/${id_materia}`, {
          calificacion:
            al.calificacion === "" || al.calificacion === null
              ? null
              : Number(al.calificacion),
        });
      }

      alert("Calificaciones guardadas correctamente.");
      navigate(`/grupos/${id_grupo}/calificaciones`);
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar las calificaciones.");
    }
  };

  if (loading)
    return <p className="text-gray-400 animate-pulse">Cargando datos...</p>;

  if (!grupo || !materia)
    return <p className="text-red-500">Error cargando datos.</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">
        Calificaciones – {materia.nombre_materia}
      </h1>

      <p className="text-gray-500 text-lg">
        Grupo {grupo.grado} "{grupo.grupo}"
      </p>

      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Alumno</th>
              <th className="p-3 border text-center">Calificación</th>
            </tr>
          </thead>

          <tbody>
            {alumnos.map((a) => (
              <tr key={a.id_alumno}>
                <td className="p-3 border">
                  {a.nombre} {a.apellidos}
                </td>

                <td className="p-3 border text-center">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={a.calificacion}
                    onChange={(e) =>
                      actualizarCalificacion(a.id_alumno, e.target.value)
                    }
                    className="w-24 p-2 border rounded text-center"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pt-6 flex gap-4 justify-end">
          <button
            onClick={guardar}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Guardar
          </button>

          <button
            onClick={() => navigate(-1)}
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
