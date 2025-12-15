import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import { AuthContext } from "../auth/AuthContext";

import {
  AcademicCapIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function ListaDocentes() {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const esAdmin = user?.rol === "admin";

  const cargarDocentes = async () => {
    try {
      const res = await api.get("/docentes");
      setDocentes(res.data);
    } catch (error) {
      console.error("Error cargando docentes:", error);
      alert(
        error.response?.data?.message ||
          "No se pudieron cargar los docentes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    cargarDocentes();
  }, [user]);

  const borrar = async (id) => {
    if (!confirm("¿Eliminar docente?")) return;

    try {
      await api.delete(`/docentes/${id}`);
      cargarDocentes();
    } catch (error) {
      console.error("Error eliminando docente:", error);
      alert("No se pudo eliminar el docente");
    }
  };

  if (loading) {
    return <p className="text-gray-500 animate-pulse">Cargando docentes...</p>;
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Docentes</h1>

        {esAdmin && (
          <button
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 shadow"
            onClick={() => navigate("/app/docentes/agregar")}
          >
            + Agregar Docente
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {docentes.map((d) => (
          <div
            key={d.id_docente}
            className="bg-white border shadow rounded-xl p-6"
          >
            <div className="flex items-center gap-3">
              <AcademicCapIcon className="h-10 w-10 text-blue-600" />
              <div>
                <p className="text-xl font-bold">
                  {d.nombre} {d.apellidos}
                </p>
                <p className="text-gray-500 text-sm">
                  {d.email}
                </p>
              </div>
            </div>

            {esAdmin && (
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="bg-yellow-500 text-white p-2 rounded-lg"
                  onClick={() =>
                    navigate(`/app/docentes/editar/${d.id_docente}`)
                  }
                >
                  <PencilIcon className="h-5 w-5" />
                </button>

                <button
                  className="bg-red-600 text-white p-2 rounded-lg"
                  onClick={() => borrar(d.id_docente)}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ))}

        {docentes.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center">
            No hay docentes registrados.
          </p>
        )}
      </div>
    </div>
  );
}
