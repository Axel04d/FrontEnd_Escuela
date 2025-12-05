import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import { PencilIcon, TrashIcon, UserGroupIcon, BookOpenIcon } from "@heroicons/react/24/solid";

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
    cargarMaterias(); // refrescar lista
  };

  return (
    <div className="space-y-10">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Materias</h1>

        <button
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          onClick={() => navigate("/materias/agregar")}
        >
          + Agregar Materia
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materias.map((m) => {
          return (
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

              <div className="flex justify-end gap-3 mt-6">
                {/* EDITAR */}
                <button
                  className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600"
                  onClick={() => navigate(`/materias/editar/${m.id_materia}`)}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>

                {/* VER ALUMNOS DE ESTA MATERIA */}
                <button
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                  onClick={() => navigate(`/materias/${m.id_materia}/alumnos`)}
                >
                  <UserGroupIcon className="h-5 w-5" />
                </button>

                {/* ELIMINAR */}
                <button
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                  onClick={() => eliminarMateria(m.id_materia)}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => navigate(`/materias/${m.id_materia}/alumnos`)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                >
                  Ver alumnos
                </button>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
