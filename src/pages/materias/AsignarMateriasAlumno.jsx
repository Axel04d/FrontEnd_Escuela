import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";

export default function AsignarMateriasAlumno() {
  const { id } = useParams(); // id del alumno

  const [alumno, setAlumno] = useState(null);
  const [materiasGlobales, setMateriasGlobales] = useState([]);
  const [materiasAlumno, setMateriasAlumno] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Cargar datos iniciales
  // -----------------------------
  useEffect(() => {
    cargarAlumno();
    cargarMateriasGlobales();
    cargarMateriasAlumno();
  }, [id]);

  // Obtener alumno
  const cargarAlumno = async () => {
    try {
      const res = await api.get(`/alumnos/${id}`);
      setAlumno(res.data);
    } catch (err) {
      console.error("Error cargando alumno", err);
    }
  };

  // Obtener todas las materias registradas
  const cargarMateriasGlobales = async () => {
    try {
      const res = await api.get("/materias");
      setMateriasGlobales(res.data);
    } catch (err) {
      console.error("Error cargando materias", err);
    }
  };

  // Obtener materias asignadas al alumno
  const cargarMateriasAlumno = async () => {
    try {
      const res = await api.get(`/alumnomateria/alumno/${id}`);
      // res.data = [{ id_materia, nombre_materia, calificacion }]
      setMateriasAlumno(res.data);
    } catch (err) {
      console.error("Error cargando materias del alumno", err);
      setMateriasAlumno([]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Asignar materia al alumno
  // -----------------------------
  const asignarMateria = async (id_materia) => {
    try {
      await api.post("/alumnomateria", {
        id_alumno: id,
        id_materia,
      });

      cargarMateriasAlumno();
    } catch (err) {
      console.error("Error asignando materia", err);
      alert("No se pudo asignar la materia.");
    }
  };

  // -----------------------------
  // Quitar materia del alumno
  // -----------------------------
  const eliminarMateria = async (id_materia) => {
    try {
      await api.delete(`/alumnomateria/${id}/${id_materia}`);
      cargarMateriasAlumno();
    } catch (err) {
      console.error("Error eliminando materia", err);
      alert("No se pudo eliminar la materia.");
    }
  };

  if (loading)
    return <p className="text-gray-500 animate-pulse">Cargando materias...</p>;

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* ---------------------- */}
      {/* Encabezado */}
      {/* ---------------------- */}
      <h1 className="text-3xl font-bold">
        Asignar materias a {alumno?.nombre} {alumno?.apellidos}
      </h1>

      {/* ---------------------- */}
      {/* Materias Asignadas */}
      {/* ---------------------- */}
      <div className="bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Materias del alumno</h2>

        {materiasAlumno.length === 0 ? (
          <p className="text-gray-600">Este alumno no tiene materias asignadas.</p>
        ) : (
          <ul className="space-y-2">
            {materiasAlumno.map((m) => (
              <li
                key={m.id_materia}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <span>
                  {m.nombre_materia}{" "}
                  {m.calificacion !== null && (
                    <span className="text-sm text-gray-500">
                      (Calificación: {m.calificacion})
                    </span>
                  )}
                </span>

                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => eliminarMateria(m.id_materia)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------------------- */}
      {/* Materias Globales */}
      {/* ---------------------- */}
      <div className="bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Todas las materias</h2>

        <ul className="space-y-2">
          {materiasGlobales.map((m) => (
            <li
              key={m.id_materia}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <span>{m.nombre_materia}</span>

              <button
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                onClick={() => asignarMateria(m.id_materia)}
              >
                Asignar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
