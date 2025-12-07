import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";

export default function AgregarMateria() {
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  const guardar = async (e) => {
    e.preventDefault();

    await api.post("/materias", {
      nombre_materia: nombre,
    });

    navigate("/app/materias");
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Agregar Materia</h1>

      <form
        onSubmit={guardar}
        className="bg-white p-6 rounded-xl shadow w-full md:w-1/2 space-y-4"
      >
        <label className="font-semibold">Nombre de la Materia</label>
        <input
          type="text"
          className="p-3 border rounded w-full"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Guardar
        </button>
      </form>
    </div>
  );
}
