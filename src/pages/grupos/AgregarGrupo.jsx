import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import { AuthContext } from "../auth/AuthContext";

export default function AgregarGrupo() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [docentes, setDocentes] = useState([]);
  const [form, setForm] = useState({
    grado: "",
    grupo: "",
    id_docente: "",
  });

  // 🔐 SOLO ADMIN
  useEffect(() => {
    if (!user) return;
    if (user.rol !== "admin") {
      alert("Acceso no autorizado");
      navigate("/app/grupos");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.rol === "admin") {
      api.get("/docentes").then((res) => setDocentes(res.data));
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardarGrupo = async () => {
    if (!form.grado || !form.grupo || !form.id_docente) {
      alert("Completa todos los campos");
      return;
    }

    try {
      await api.post("/grupos", form);
      alert("Grupo creado correctamente");
      navigate("/app/grupos");
    } catch (err) {
      console.error(err);
      alert("No tienes permisos para crear grupos");
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Crear Grupo</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">
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

        <div>
          <label className="font-semibold">Grupo</label>
          <input
            type="text"
            name="grupo"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />
        </div>

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

        <div className="flex gap-4">
          <button
            onClick={guardarGrupo}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Guardar
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
