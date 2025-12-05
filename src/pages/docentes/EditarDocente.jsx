import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api.js";

export default function EditarDocente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
  });

  useEffect(() => {
    api.get(`/docentes/${id}`).then((res) => {
      setForm({
        nombre: res.data.nombre,
        apellidos: res.data.apellidos,
      });
    });
  }, [id]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async () => {
    await api.put(`/docentes/${id}`, form);
    alert("Cambios guardados");
    navigate("/docentes");
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Editar Docente</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        <div>
          <label className="font-semibold">Nombre</label>
          <input
            name="nombre"
            type="text"
            className="w-full p-3 border rounded-lg"
            value={form.nombre}
            onChange={onChange}
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
            onClick={() => navigate("/docentes")}
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}
