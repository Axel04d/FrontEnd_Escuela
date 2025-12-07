import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";

export default function AgregarDocente() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
  });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async () => {
    try {
      await api.post("/docentes", form);
      alert("Docente agregado correctamente");
      navigate("/app/docentes"); // 🔥 RUTA CORRECTA
    } catch (error) {
      console.error(error);
      alert("Error al registrar docente. Verifica los datos.");
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Agregar Docente</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        <div>
          <label className="font-semibold">Nombre</label>
          <input
            name="nombre"
            type="text"
            className="w-full p-3 border rounded-lg"
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
            onChange={onChange}
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
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            onClick={guardar}
          >
            Guardar
          </button>

          <button
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
            onClick={() => navigate("/app/docentes")} // 🔥 CORREGIDO
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}
