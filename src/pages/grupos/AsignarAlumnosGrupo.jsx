import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function AsignarAlumnosGrupo() {
  const { id } = useParams(); // id del grupo
  const navigate = useNavigate();

  const [grupo, setGrupo] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------
  // Cargar datos iniciales: Grupo + Alumnos
  // ---------------------------------------
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar información del grupo
        const grupoRes = await api.get(`/grupos/${id}`);
        setGrupo(grupoRes.data);

        // Cargar todos los alumnos
        const alumnosRes = await api.get("/alumnos");
        setAlumnos(alumnosRes.data);

        // Detectar alumnos ya asignados al grupo
        const yaAsignados = alumnosRes.data
          .filter((a) => a.id_grupo === Number(id))
          .map((a) => a.id_alumno);

        setSeleccionados(yaAsignados);

      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  // ---------------------------------------
  // Seleccionar o deseleccionar alumno
  // ---------------------------------------
  const toggleAlumno = (idAlumno) => {
    if (seleccionados.includes(idAlumno)) {
      setSeleccionados(seleccionados.filter((a) => a !== idAlumno));
    } else {
      setSeleccionados([...seleccionados, idAlumno]);
    }
  };

  // ---------------------------------------
  // Guardar asignaciones finales
  // ---------------------------------------
  const guardar = async () => {
    try {
      // Desasignar alumnos que ya no están marcados
      for (const alumno of alumnos) {
        if (
          alumno.id_grupo === Number(id) &&
          !seleccionados.includes(alumno.id_alumno)
        ) {
          await api.put(`/alumnos/${alumno.id_alumno}`, {
            id_grupo: null,
          });
        }
      }

      // Asignar alumnos seleccionados
      for (const idAlumno of seleccionados) {
        await api.put(`/alumnos/${idAlumno}`, {
          id_grupo: id,
        });
      }

      alert("Asignación actualizada correctamente");
      navigate("/app/grupos");

    } catch (err) {
      console.error("Error guardando cambios:", err);
      alert("Hubo un error al guardar los cambios.");
    }
  };

  // ---------------------------------------
  // Loading y errores
  // ---------------------------------------
  if (loading)
    return <p className="text-gray-400 animate-pulse">Cargando alumnos...</p>;

  if (!grupo)
    return <p className="text-red-600">No se encontró el grupo.</p>;

  // ---------------------------------------
  // Filtrar alumnos
  // ---------------------------------------
  const alumnosDelGrupo = alumnos.filter((a) => a.id_grupo === Number(id));
  const alumnosSinGrupo = alumnos.filter(
    (a) => !a.id_grupo || a.id_grupo === null
  );

  return (
    <div className="space-y-10">
      {/* Título dinámico */}
      <h1 className="text-3xl font-bold">
        Asignar alumnos a {grupo.grado}° {grupo.grupo}
      </h1>

      {/* Alumnos asignados actualmente */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Alumnos del grupo</h2>

        {alumnosDelGrupo.length === 0 ? (
          <p className="text-gray-500">No hay alumnos asignados aún.</p>
        ) : (
          alumnosDelGrupo.map((a) => (
            <label
              key={a.id_alumno}
              className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={seleccionados.includes(a.id_alumno)}
                onChange={() => toggleAlumno(a.id_alumno)}
              />
              <span>{a.nombre} {a.apellidos}</span>
            </label>
          ))
        )}
      </section>

      {/* Alumnos disponibles para asignar */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Alumnos sin grupo</h2>

        {alumnosSinGrupo.length === 0 ? (
          <p className="text-gray-500">Todos los alumnos ya están asignados.</p>
        ) : (
          alumnosSinGrupo.map((a) => (
            <label
              key={a.id_alumno}
              className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={seleccionados.includes(a.id_alumno)}
                onChange={() => toggleAlumno(a.id_alumno)}
              />
              <span>
                {a.nombre} {a.apellidos}
              </span>
            </label>
          ))
        )}
      </section>

      {/* Botones */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={guardar}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Guardar Cambios
        </button>

        <button
          onClick={() => navigate("app/grupos")}
          className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
