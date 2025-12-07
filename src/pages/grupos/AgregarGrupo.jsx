import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";

export default function AgregarGrupo() {
  const navigate = useNavigate();

  const [docentes, setDocentes] = useState([]);

  const [form, setForm] = useState({
    grado: "",
    grupo: "",
    id_docente: "",
  });

  useEffect(() => {
    api.get("/docentes").then((res) => setDocentes(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardarGrupo = async () => {
    try {
      await api.post("/grupos", form);
      alert("Grupo creado correctamente");
      navigate("/app/grupos");
    } catch (err) {
      alert("Error al crear el grupo");
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Crear Grupo</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        {/* Grado */}
        <div>
          <label className="font-semibold">Grado</label>
          <select
            name="grado"
            className="w-full p-3 border rounded-lg"
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
            placeholder="A, B, C..."
            onChange={handleChange}
          />
        </div>

        {/* Docente */}
        <div>
          <label className="font-semibold">Docente</label>
          <select
            name="id_docente"
            className="w-full p-3 border rounded-lg"
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

        {/* Botones */}
        <div className="flex gap-4">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            onClick={guardarGrupo}
          >
            Guardar
          </button>

          <button
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
            onClick={() => navigate("/app/grupos")}
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}
