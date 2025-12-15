import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../auth/AuthContext";

export default function AsignarMateriasGrupo() {
  const { id } = useParams(); // id del grupo
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [materias, setMaterias] = useState([]);
  const [alumnosGrupo, setAlumnosGrupo] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     🔐 SOLO ADMIN O DOCENTE
     =============================== */
  useEffect(() => {
    if (user && !["admin", "docente"].includes(user.rol)) {
      navigate("/login");
    }
  }, [user, navigate]);

  /* ===============================
     CARGAR DATOS INICIALES
     =============================== */
  useEffect(() => {
    if (!user) return;

    const cargarDatos = async () => {
      try {
        // 1️⃣ Materias
        const resMaterias = await api.get("/materias");
        setMaterias(resMaterias.data);

        // 2️⃣ Alumnos del grupo
        const resAlumnos = await api.get("/alumnos");
        const alumnosFiltrados = resAlumnos.data.filter(
          (a) => Number(a.id_grupo) === Number(id)
        );
        setAlumnosGrupo(alumnosFiltrados);

        // 3️⃣ Materias ya asignadas (UNA SOLA PASADA)
        const materiasSet = new Set();

        await Promise.all(
          alumnosFiltrados.map(async (al) => {
            const res = await api.get(
              `/alumnomateria/alumno/${al.id_alumno}`
            );
            res.data.forEach((m) => materiasSet.add(m.id_materia));
          })
        );

        setSeleccionadas(Array.from(materiasSet));

      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, user]);

  /* ===============================
     TOGGLE DE MATERIAS
     =============================== */
  const toggleMateria = (idMateria) => {
    setSeleccionadas((prev) =>
      prev.includes(idMateria)
        ? prev.filter((m) => m !== idMateria)
        : [...prev, idMateria]
    );
  };

  /* ===============================
     GUARDAR CAMBIOS
     =============================== */
  const guardar = async () => {
    try {
      const operaciones = [];

      for (const alumno of alumnosGrupo) {
        const res = await api.get(
          `/alumnomateria/alumno/${alumno.id_alumno}`
        );

        const actuales = res.data.map((r) => r.id_materia);

        // ❌ quitar
        actuales
          .filter((idMat) => !seleccionadas.includes(idMat))
          .forEach((idMat) => {
            operaciones.push(
              api.delete(`/alumnomateria/${alumno.id_alumno}/${idMat}`)
            );
          });

        // ➕ agregar
        seleccionadas
          .filter((idMat) => !actuales.includes(idMat))
          .forEach((idMat) => {
            operaciones.push(
              api.post("/alumnomateria", {
                id_alumno: alumno.id_alumno,
                id_materia: idMat,
              })
            );
          });
      }

      await Promise.all(operaciones);

      alert("Materias del grupo actualizadas correctamente");
      navigate("/app/grupos");

    } catch (error) {
      console.error("Error guardando materias:", error);
      alert("Error al guardar los cambios.");
    }
  };

  /* ===============================
     UI STATES
     =============================== */
  if (loading)
    return (
      <p className="text-gray-400 animate-pulse">
        Cargando materias del grupo...
      </p>
    );

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
            <span>{m.nombre_materia}</span>
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
