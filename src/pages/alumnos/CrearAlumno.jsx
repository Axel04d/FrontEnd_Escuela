import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";

export default function CrearAlumno() {
  const navigate = useNavigate();

  const [grupos, setGrupos] = useState([]);
  const [tutores, setTutores] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    id_grupo: "",
    id_tutor: "",
  });

  const [loading, setLoading] = useState(true);

  // 🔵 CARGAR GRUPOS Y TUTORES
  useEffect(() => {
    const cargar = async () => {
      try {
        const g = await api.get("/grupos");
        const t = await api.get("/tutores");

        setGrupos(g.data);
        setTutores(t.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
        alert("Error al cargar grupos y tutores");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  // 🔵 ACTUALIZAR VALORES DEL FORM
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔵 GUARDAR ALUMNO
  const guardar = async () => {
    if (!form.nombre || !form.apellidos || !form.id_grupo || !form.id_tutor) {
      return alert("Todos los campos son obligatorios.");
    }

    try {
      await api.post("/alumnos", form);
      alert("Alumno creado correctamente");
      navigate("/app/alumnos");
    } catch (error) {
      console.error(error);
      alert("Error al crear alumno.");
    }
  };

  if (loading) {
    return (
      <p className="text-gray-500 animate-pulse">Cargando información...</p>
    );
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Agregar Alumno</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        {/* NOMBRE */}
        <div>
          <label className="font-semibold block mb-1">Nombre</label>
          <input
            name="nombre"
            className="p-3 border rounded w-full"
            placeholder="Nombre del alumno"
            onChange={handleChange}
          />
        </div>

        {/* APELLIDOS */}
        <div>
          <label className="font-semibold block mb-1">Apellidos</label>
          <input
            name="apellidos"
            className="p-3 border rounded w-full"
            placeholder="Apellidos del alumno"
            onChange={handleChange}
          />
        </div>

        {/* GRUPO */}
        <div>
          <label className="font-semibold block mb-1">Grupo</label>
          <select
            name="id_grupo"
            className="p-3 border rounded w-full"
            value={form.id_grupo}
            onChange={handleChange}
          >
            <option value="">Seleccione grupo</option>
            {grupos.map((g) => (
              <option key={g.id_grupo} value={g.id_grupo}>
                {g.grado}° {g.grupo}
              </option>
            ))}
          </select>
        </div>

        {/* TUTOR */}
        <div>
          <label className="font-semibold block mb-1">Tutor</label>
          <select
            name="id_tutor"
            className="p-3 border rounded w-full"
            value={form.id_tutor}
            onChange={handleChange}
          >
            <option value="">Seleccione tutor</option>
            {tutores.map((t) => (
              <option key={t.id_tutor} value={t.id_tutor}>
                {t.nombre} {t.apellidos}
              </option>
            ))}
          </select>
        </div>

        {/* BOTÓN GUARDAR */}
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          onClick={guardar}
        >
          Guardar Alumno
        </button>

      </div>
    </div>
  );
}
