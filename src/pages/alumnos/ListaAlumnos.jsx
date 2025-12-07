
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import {
  UserGroupIcon,
  UserIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";

export default function ListaAlumnos() {
  const navigate = useNavigate();

  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/grupos")
      .then((res) => setGrupos(res.data))
      .catch(() => alert("Error al cargar grupos"));
  }, []);

  const cargarAlumnos = async (idGrupo) => {
    setGrupoSeleccionado(idGrupo);
    setLoading(true);

    try {
      const res = await api.get("/alumnos");
      setAlumnos(res.data.filter((a) => Number(a.id_grupo) === Number(idGrupo)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lista de Alumnos</h1>

        <button
          onClick={() => navigate("/app/alumnos/crear")}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="h-6 w-6" />
          Agregar Alumno
        </button>
      </div>

      {/* GRUPOS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <UserGroupIcon className="h-6 w-6 text-blue-600" />
          Seleccionar Grupo
        </h2>

        <select
          className="w-full md:w-1/3 p-3 border rounded-lg shadow-sm"
          value={grupoSeleccionado}
          onChange={(e) => cargarAlumnos(e.target.value)}
        >
          <option value="">Seleccione un grupo</option>
          {grupos.map((g) => (
            <option key={g.id_grupo} value={g.id_grupo}>
              {g.grado}° — Grupo {g.grupo}
            </option>
          ))}
        </select>
      </div>

      {grupoSeleccionado && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-blue-600" />
            Alumnos del Grupo Seleccionado
          </h2>

          {loading ? (
            <p className="text-gray-500 animate-pulse">Cargando alumnos...</p>
          ) : (
            <table className="w-full border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">Nombre</th>
                  <th className="p-3 border">Tutor</th>
                  <th className="p-3 border text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {alumnos.map((a) => (
                  <tr key={a.id_alumno}>
                    <td className="p-3 border">
                      {a.nombre} {a.apellidos}
                    </td>

                    <td className="p-3 border">
                      {a.tb_tutore
                        ? `${a.tb_tutore.nombre} ${a.tb_tutore.apellidos}`
                        : "Sin tutor asignado"}
                    </td>

                    <td className="p-3 border text-center">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-2"
                        onClick={() => navigate(`/app/alumnos/${a.id_alumno}`)}
                      >
                        Ver
                      </button>

                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        onClick={() =>
                          navigate(`/app/alumnos/editar/${a.id_alumno}`)
                        }
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
