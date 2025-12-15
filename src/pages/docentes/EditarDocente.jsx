import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api.js";
import { AuthContext } from "../auth/AuthContext";

export default function EditarDocente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔐 PROTECCIÓN: SOLO ADMIN
  useEffect(() => {
    if (!user) return;
    if (user.rol !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  // 📥 CARGAR DOCENTE
  useEffect(() => {
    if (!id) return;

    const cargarDocente = async () => {
      try {
        const res = await api.get(`/docentes/${id}`);
        setForm({
          nombre: res.data.nombre || "",
          apellidos: res.data.apellidos || "",
        });
      } catch (error) {
        console.error("Error cargando docente:", error);
        alert(
          error.response?.data?.message ||
            "No se pudo cargar la información del docente"
        );
        navigate("/app/docentes");
      } finally {
        setLoading(false);
      }
    };

    cargarDocente();
  }, [id, navigate]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 💾 GUARDAR CAMBIOS
  const guardar = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.apellidos) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      setSaving(true);
      await api.put(`/docentes/${id}`, form);
      alert("✅ Cambios guardados correctamente");
      navigate("/app/docentes");
    } catch (error) {
      console.error("Error actualizando docente:", error);
      alert(
        error.response?.data?.message ||
          "No se pudieron guardar los cambios"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-gray-500 animate-pulse">
        Cargando información del docente...
      </p>
    );
  }

  return (
    <div className="space-y-10 max-w-xl">
      <h1 className="text-3xl font-bold">Editar Docente</h1>

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
            value={form.nombre}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label className="font-semibold">Apellidos</label>
          <input
            name="apellidos"
            type="text"
            className="w-full p-3 border rounded-lg"
            value={form.apellidos}
            onChange={onChange}
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
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
