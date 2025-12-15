import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../auth/AuthContext";

export default function EditarGrupo() {
  const { id } = useParams();
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
      api.get(`/grupos/${id}`).then((res) => {
        setForm(res.data);
      });
    }
  }, [id, user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardarCambios = async () => {
    try {
      await api.put(`/grupos/${id}`, form);
      alert("Grupo actualizado");
      navigate("/app/grupos");
    } catch {
      alert("No tienes permisos");
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Editar Grupo</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <select name="grado" value={form.grado} onChange={handleChange}
          className="w-full p-3 border rounded-lg">
          {["1°","2°","3°","4°","5°","6°"].map(g =>
            <option key={g} value={g}>{g}</option>
          )}
        </select>

        <input
          name="grupo"
          value={form.grupo}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <select
          name="id_docente"
          value={form.id_docente}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        >
          {docentes.map(d => (
            <option key={d.id_docente} value={d.id_docente}>
              {d.nombre} {d.apellidos}
            </option>
          ))}
        </select>

        <div className="flex gap-4">
          <button
            onClick={guardarCambios}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Guardar
          </button>
          <button
            onClick={() => navigate("/app/grupos")}
            className="bg-gray-400 text-white px-6 py-3 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
