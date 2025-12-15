import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";

export default function AgregarDocente() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
  });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.apellidos || !form.email) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);
      await api.post("/docentes", form);
      alert("✅ Docente agregado correctamente");
      navigate("/app/docentes");
    } catch (error) {
      console.error("Error creando docente:", error);
      alert(
        error.response?.data?.message ||
          "❌ Error al registrar docente"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-xl">
      <h1 className="text-3xl font-bold">Agregar Docente</h1>

      <form
        onSubmit={guardar}
        className="bg-white p-6 rounded-xl shadow space-y-6"
      >
        <div>
          <label className="font-semibold">Nombre</label>
          <input
            name="nombre"
            type="text"
            className="w-full p-3 border rounded-lg"
            onChange={onChange}
            value={form.nombre}
            required
          />
        </div>

        <div>
          <label className="font-semibold">Apellidos</label>
          <input
            name="apellidos"
            type="text"
            className="w-full p-3 border rounded-lg"
            onChange={onChange}
            value={form.apellidos}
            required
          />
        </div>

        <div>
          <label className="font-semibold">Correo</label>
          <input
            name="email"
            type="email"
            className="w-full p-3 border rounded-lg"
            onChange={onChange}
            value={form.email}
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>

          <button
            type="button"
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
            onClick={() => navigate("/app/docentes")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
