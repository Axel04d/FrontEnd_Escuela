import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api.js";

export default function EditarMateria() {
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/materias/${id}`).then(res => {
      setNombre(res.data.nombre_materia);
    });
  }, [id]);

  const guardar = async (e) => {
    e.preventDefault();

    await api.put(`/materias/${id}`, {
      nombre_materia: nombre
    });

    navigate("/materias");
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Editar Materia</h1>

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
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
