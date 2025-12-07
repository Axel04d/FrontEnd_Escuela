import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import {
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";

export default function ListaMaterias() {
  const [materias, setMaterias] = useState([]);
  const navigate = useNavigate();

  const cargarMaterias = async () => {
    const res = await api.get("/materias");
    setMaterias(res.data);
  };

  useEffect(() => {
    cargarMaterias();
  }, []);

  const eliminarMateria = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta materia?")) return;

    await api.delete(`/materias/${id}`);
    cargarMaterias();
  };

  return (
    <div className="space-y-10">

      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Materias</h1>

        <button
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate("/app/materias/agregar")}
        >
          + Agregar Materia
        </button>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materias.map((m) => (
          <div
            key={m.id_materia}
            className="bg-white p-6 shadow rounded-xl border hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3">
              <BookOpenIcon className="h-10 w-10 text-purple-600" />

              <div>
                <p className="text-xl font-bold">{m.nombre_materia}</p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 mt-6">

              {/* Editar materia */}
              <button
                className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600"
                onClick={() => navigate(`/app/materias/editar/${m.id_materia}`)}
              >
                <PencilIcon className="h-5 w-5" />
              </button>

              {/* Ver alumnos inscritos */}
              <button
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                onClick={() =>
                  navigate(`/app/materias/${m.id_materia}/alumnos`)
                }
              >
                <UserGroupIcon className="h-5 w-5" />
              </button>

              {/* Eliminar materia */}
              <button
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                onClick={() => eliminarMateria(m.id_materia)}
              >
                <TrashIcon className="h-5 w-5" />
              </button>

            </div>
          </div>
        ))}

        {materias.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center">
            No hay materias registradas.
          </p>
        )}
      </div>

    </div>
  );
}
