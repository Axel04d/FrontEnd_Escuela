import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api.js";

export default function EditarAlumno() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [grupos, setGrupos] = useState([]);
  const [tutores, setTutores] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    id_grupo: "",
    id_tutor: "",
  });

  // 🔵 Cargar alumno + grupos + tutores
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Alumno
        const alumnoRes = await api.get(`/alumnos/${id}`);
        const a = alumnoRes.data;

        setForm({
          nombre: a.nombre,
          apellidos: a.apellidos,
          id_grupo: a.id_grupo ?? "",
          id_tutor: a.id_tutor ?? "",
        });

        // Grupos
        const gruposRes = await api.get("/grupos");
        setGrupos(gruposRes.data);

        // Tutores
        const tutoresRes = await api.get("/tutores");
        setTutores(tutoresRes.data);

      } catch (error) {
        console.error("Error cargando datos: ", error);
        alert("Error al cargar los datos del alumno.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔵 Guardar cambios
  const actualizar = async () => {
    if (!form.nombre.trim() || !form.apellidos.trim()) {
      return alert("El nombre y apellidos son obligatorios.");
    }

    try {
      await api.put(`/alumnos/${id}`, {
        nombre: form.nombre,
        apellidos: form.apellidos,
        id_grupo: form.id_grupo === "" ? null : Number(form.id_grupo),
        id_tutor: form.id_tutor === "" ? null : Number(form.id_tutor),
      });

      alert("Alumno actualizado correctamente.");
      navigate("/alumnos");

    } catch (error) {
      console.error("Error actualizando:", error.response?.data || error);
      alert("Error al actualizar el alumno.");
    }
  };

  if (loading)
    return <p className="text-gray-500 animate-pulse">Cargando datos...</p>;

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* TÍTULO */}
      <h1 className="text-3xl font-bold">Editar Alumno</h1>

      {/* FORMULARIO */}
      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        {/* Nombre */}
        <div>
          <label className="block font-semibold mb-1">Nombre</label>
          <input
            className="p-3 border rounded w-full"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
        </div>

        {/* Apellidos */}
        <div>
          <label className="block font-semibold mb-1">Apellidos</label>
          <input
            className="p-3 border rounded w-full"
            value={form.apellidos}
            onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
          />
        </div>

        {/* Grupo */}
        <div>
          <label className="block font-semibold mb-1">Grupo</label>
          <select
            className="p-3 border rounded w-full"
            value={form.id_grupo}
            onChange={(e) => setForm({ ...form, id_grupo: e.target.value })}
          >
            <option value="">Sin grupo</option>

            {grupos.map((g) => (
              <option key={g.id_grupo} value={g.id_grupo}>
                {g.grado}° {g.grupo} — Docente: {g.tb_docente?.nombre ?? "N/A"}
              </option>
            ))}
          </select>
        </div>

        {/* Tutor */}
        <div>
          <label className="block font-semibold mb-1">Tutor</label>
          <select
            className="p-3 border rounded w-full"
            value={form.id_tutor}
            onChange={(e) => setForm({ ...form, id_tutor: e.target.value })}
          >
            <option value="">Sin tutor</option>

            {tutores.map((t) => (
              <option key={t.id_tutor} value={t.id_tutor}>
                {t.nombre} {t.apellidos}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            onClick={actualizar}
          >
            Guardar Cambios
          </button>

          <button
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
            onClick={() => navigate("/alumnos")}
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}
