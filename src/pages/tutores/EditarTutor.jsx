import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api.js";

export default function EditarTutor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
  });

  useEffect(() => {
    const cargarTutor = async () => {
      try {
        const res = await api.get(`/tutores/${id}`);
        const t = res.data;

        setForm({
          nombre: t.nombre,
          apellidos: t.apellidos,
          telefono: t.telefono ?? "",
        });
      } catch (error) {
        console.error("Error cargando tutor:", error);
        alert("No se pudo cargar el tutor");
      }
    };

    cargarTutor();
  }, [id]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async () => {
    try {
      await api.put(`/tutores/${id}`, form);
      alert("Cambios guardados");
      navigate("/app/tutores");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar tutor");
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Editar Tutor</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        <div>
          <label className="font-semibold">Nombre</label>
          <input
            name="nombre"
            className="w-full p-3 border rounded-lg"
            value={form.nombre}
            onChange={onChange}
          />
        </div>

        <div>
          <label className="font-semibold">Apellidos</label>
          <input
            name="apellidos"
            className="w-full p-3 border rounded-lg"
            value={form.apellidos}
            onChange={onChange}
          />
        </div>

        <div>
          <label className="font-semibold">Teléfono</label>
          <input
            name="telefono"
            className="w-full p-3 border rounded-lg"
            value={form.telefono}
            onChange={onChange}
          />
        </div>

        <div className="flex gap-4">
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            onClick={guardar}
          >
            Guardar Cambios
          </button>

          <button
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
            onClick={() => navigate("/app/tutores")}
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}
