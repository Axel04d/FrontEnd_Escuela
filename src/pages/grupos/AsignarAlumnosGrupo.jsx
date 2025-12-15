import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../auth/AuthContext";

export default function AsignarAlumnosGrupo() {
  const { id } = useParams(); // id del grupo
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [grupo, setGrupo] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     🔐 SOLO ADMIN PUEDE ENTRAR
     =============================== */
  useEffect(() => {
    if (user && user.rol !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  /* ===============================
     CARGA DE GRUPO Y ALUMNOS
     =============================== */
  useEffect(() => {
    if (!user || user.rol !== "admin") return;

    const cargarDatos = async () => {
      try {
        const [grupoRes, alumnosRes] = await Promise.all([
          api.get(`/grupos/${id}`),
          api.get("/alumnos"),
        ]);

        setGrupo(grupoRes.data);
        setAlumnos(alumnosRes.data);

        const yaAsignados = alumnosRes.data
          .filter((a) => Number(a.id_grupo) === Number(id))
          .map((a) => a.id_alumno);

        setSeleccionados(yaAsignados);

      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, user]);

  /* ===============================
     SELECCIONAR / DESELECCIONAR
     =============================== */
  const toggleAlumno = (idAlumno) => {
    setSeleccionados((prev) =>
      prev.includes(idAlumno)
        ? prev.filter((a) => a !== idAlumno)
        : [...prev, idAlumno]
    );
  };

  /* ===============================
     GUARDAR CAMBIOS
     =============================== */
  const guardar = async () => {
    try {
      const promises = [];

      for (const alumno of alumnos) {
        const debeEstar =
          seleccionados.includes(alumno.id_alumno) ? Number(id) : null;

        if (alumno.id_grupo !== debeEstar) {
          promises.push(
            api.put(`/alumnos/${alumno.id_alumno}`, {
              id_grupo: debeEstar,
            })
          );
        }
      }

      await Promise.all(promises);

      alert("Asignación actualizada correctamente");
      navigate("/app/grupos");

    } catch (error) {
      console.error("Error guardando asignación:", error);
      alert("Error al guardar los cambios.");
    }
  };

  /* ===============================
     LOADING / ERRORES
     =============================== */
  if (loading)
    return <p className="text-gray-400 animate-pulse">Cargando alumnos...</p>;

  if (!grupo)
    return <p className="text-red-600">Grupo no encontrado.</p>;

  const alumnosDelGrupo = alumnos.filter(
    (a) => Number(a.id_grupo) === Number(id)
  );

  const alumnosSinGrupo = alumnos.filter(
    (a) => !a.id_grupo
  );

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">
        Asignar alumnos a {grupo.grado}° {grupo.grupo}
      </h1>

      {/* ALUMNOS DEL GRUPO */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Alumnos del grupo</h2>

        {alumnosDelGrupo.length === 0 ? (
          <p className="text-gray-500">No hay alumnos asignados.</p>
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

      {/* ALUMNOS SIN GRUPO */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Alumnos sin grupo</h2>

        {alumnosSinGrupo.length === 0 ? (
          <p className="text-gray-500">Todos los alumnos tienen grupo.</p>
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
              <span>{a.nombre} {a.apellidos}</span>
            </label>
          ))
        )}
      </section>

      {/* BOTONES */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={guardar}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
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
  );
}
