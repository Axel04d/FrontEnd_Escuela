import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";

import { UserIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ListaTutores() {
  const [tutores, setTutores] = useState([]);
  const navigate = useNavigate();

  const cargarTutores = async () => {
    try {
      const [resTutores, resAlumnos] = await Promise.all([
        api.get("/tutores"),
        api.get("/alumnos"),
      ]);

      const alumnos = resAlumnos.data;

      // unir alumnos con su tutor
      const datos = resTutores.data.map((tutor) => ({
        ...tutor,
        hijos: alumnos.filter((a) => a.id_tutor === tutor.id_tutor),
      }));

      setTutores(datos);
    } catch (error) {
      console.error("Error cargando tutores:", error);
    }
  };

  useEffect(() => {
    cargarTutores();
  }, []);

  const borrar = async (id) => {
    if (!confirm("¿Eliminar tutor?")) return;

    try {
      await api.delete(`/tutores/${id}`);
      await cargarTutores();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el tutor.");
    }
  };

  return (
    <div className="space-y-10">

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tutores</h1>

        <button
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 shadow"
          onClick={() => navigate("/tutores/agregar")}
        >
          + Registrar Tutor
        </button>
      </div>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {tutores.map((t) => (
          <div
            key={t.id_tutor}
            className="bg-white border shadow rounded-xl p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3">
              <UserIcon className="h-10 w-10 text-purple-600" />
              <div>
                <p className="text-xl font-bold">
                  {t.nombre} {t.apellidos}
                </p>
                <p className="text-gray-500 text-sm">Tel: {t.telefono}</p>
              </div>
            </div>

            {/* Alumnos a cargo */}
            <div className="mt-4">
              <h3 className="font-bold text-gray-700 mb-2">Hijos:</h3>

              {t.hijos.length > 0 ? (
                <ul className="space-y-2">
                  {t.hijos.map((h) => (
                    <li
                      key={h.id_alumno}
                      className="p-2 bg-gray-50 border rounded-lg"
                    >
                      <p className="font-semibold">
                        {h.nombre} {h.apellidos}
                      </p>
                      <p className="text-sm text-gray-600">
                        {h.tb_grupo?.grado} • Grupo {h.tb_grupo?.grupo}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  Este tutor no tiene alumnos asignados.
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600"
                onClick={() => navigate(`/tutores/editar/${t.id_tutor}`)}
              >
                <PencilIcon className="h-5 w-5" />
              </button>

              <button
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                onClick={() => borrar(t.id_tutor)}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
