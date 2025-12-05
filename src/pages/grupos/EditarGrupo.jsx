import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function EditarGrupo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [docentes, setDocentes] = useState([]);
  const [form, setForm] = useState({
    grado: "",
    grupo: "",
    id_docente: "",
  });

  useEffect(() => {
    // Cargar docentes
    api.get("/docentes").then((res) => setDocentes(res.data));

    // Cargar grupo
    api.get(`/grupos/${id}`).then((res) => {
      setForm({
        grado: res.data.grado,
        grupo: res.data.grupo,
        id_docente: res.data.id_docente,
      });
    });
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardarCambios = async () => {
    try {
      await api.put(`/grupos/${id}`, form);
      alert("Grupo actualizado correctamente");
      navigate("/grupos");
    } catch (err) {
      alert("Error al actualizar");
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Editar Grupo</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        {/* Grado */}
        <div>
          <label className="font-semibold">Grado</label>
          <select
            name="grado"
            className="w-full p-3 border rounded-lg"
            value={form.grado}
            onChange={handleChange}
          >
            <option value="">Seleccionar grado</option>
            {["1°","2°","3°","4°","5°","6°"].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Grupo */}
        <div>
          <label className="font-semibold">Grupo</label>
          <input
            type="text"
            name="grupo"
            className="w-full p-3 border rounded-lg"
            value={form.grupo}
            onChange={handleChange}
          />
        </div>

        {/* Docente */}
        <div>
          <label className="font-semibold">Docente</label>
          <select
            name="id_docente"
            className="w-full p-3 border rounded-lg"
            value={form.id_docente}
            onChange={handleChange}
          >
            <option value="">Seleccionar docente</option>
            {docentes.map((d) => (
              <option key={d.id_docente} value={d.id_docente}>
                {d.nombre} {d.apellidos}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            onClick={guardarCambios}
          >
            Guardar Cambios
          </button>

          <button
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
            onClick={() => navigate("/grupos")}
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}
