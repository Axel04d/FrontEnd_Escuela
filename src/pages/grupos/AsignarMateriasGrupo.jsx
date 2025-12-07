import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api.js";

export default function AsignarMateriasGrupo() {
  const { id } = useParams(); // id del grupo
  const navigate = useNavigate();

  const [materias, setMaterias] = useState([]);
  const [alumnosGrupo, setAlumnosGrupo] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);

  // 🔵 Cargar materias, alumnos y materias asignadas
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1️⃣ Cargar TODAS las materias
        const resMaterias = await api.get("/materias");
        setMaterias(resMaterias.data);

        // 2️⃣ Alumnos del grupo
        const resAlumnos = await api.get("/alumnos");
        const alumnosFiltrados = resAlumnos.data.filter(
          (a) => Number(a.id_grupo) === Number(id)
        );
        setAlumnosGrupo(alumnosFiltrados);

        // 3️⃣ De alumnos → materias reales asignadas
        const materiasSet = new Set();

        for (const alumno of alumnosFiltrados) {
          try {
            const resAM = await api.get(
              `/alumnomateria/alumno/${alumno.id_alumno}`
            );

            resAM.data.forEach((m) => materiasSet.add(m.id_materia));
          } catch (err) {
            console.warn("No se pudieron cargar materias de alumno", alumno.id_alumno);
          }
        }

        setSeleccionadas(Array.from(materiasSet));

      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    cargarDatos();
  }, [id]);

  // 📌 Seleccionar/deseleccionar materia
  const toggleMateria = (idMateria) => {
    if (seleccionadas.includes(idMateria)) {
      setSeleccionadas(seleccionadas.filter((m) => m !== idMateria));
    } else {
      setSeleccionadas([...seleccionadas, idMateria]);
    }
  };

  // 🔥 GUARDAR CAMBIOS
  const guardar = async () => {
    try {
      // 1️⃣ QUITAR materias que ya no están seleccionadas
      for (const alumno of alumnosGrupo) {
        const resAM = await api.get(
          `/alumnomateria/alumno/${alumno.id_alumno}`
        );

        for (const relacion of resAM.data) {
          if (!seleccionadas.includes(relacion.id_materia)) {
            await api.delete(
              `/alumnomateria/${alumno.id_alumno}/${relacion.id_materia}`
            );
          }
        }
      }

      // 2️⃣ AGREGAR materias nuevas
      for (const id_materia of seleccionadas) {
        for (const alumno of alumnosGrupo) {

          // ✔ Primero verificamos si ya existe en el backend
          const resMat = await api.get(
            `/alumnomateria/alumno/${alumno.id_alumno}`
          );

          const yaExiste = resMat.data.some(
            (r) => Number(r.id_materia) === Number(id_materia)
          );

          if (!yaExiste) {
            await api.post("/alumnomateria", {
              id_alumno: alumno.id_alumno,
              id_materia,
            });
          }
        }
      }

      alert("Materias del grupo actualizadas correctamente.");
      navigate("/app/grupos");

    } catch (error) {
      console.error("Error guardando materias:", error);
      alert("Ocurrió un error al guardar los cambios.");
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Asignar Materias al Grupo</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        {materias.map((m) => (
          <label
            key={m.id_materia}
            className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-100"
          >
            <input
              type="checkbox"
              checked={seleccionadas.includes(m.id_materia)}
              onChange={() => toggleMateria(m.id_materia)}
            />
            {m.nombre_materia}
          </label>
        ))}

        <div className="flex gap-4 pt-4">
          <button
            onClick={guardar}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Guardar Cambios
          </button>

          <button
            onClick={() => navigate("/app/grupos")}
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
