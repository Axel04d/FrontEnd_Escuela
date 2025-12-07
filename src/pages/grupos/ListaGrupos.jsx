import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon,
  UserPlusIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";
import api from "../../api/api";

export default function ListaGrupos() {
  const [grupos, setGrupos] = useState([]);
  const [materiasGrupo, setMateriasGrupo] = useState({});
  const navigate = useNavigate();

  /* ========================
        CARGA DE GRUPOS      
     ======================== */
  useEffect(() => {
    const cargar = async () => {
      const resGrupos = await api.get("/grupos");
      const resAlumnos = await api.get("/alumnos");

      setGrupos(resGrupos.data);

      const temp = {};

      for (const g of resGrupos.data) {
        const alumnosDelGrupo = resAlumnos.data.filter(
          (a) => Number(a.id_grupo) === Number(g.id_grupo)
        );

        const materiasSet = new Set();

        for (const al of alumnosDelGrupo) {
          try {
            const resAM = await api.get(`/alumnomateria/alumno/${al.id_alumno}`);

            resAM.data.forEach((m) => {
              if (m.tb_materia) {
                materiasSet.add(JSON.stringify(m.tb_materia));
              }
            });
          } catch {}
        }

        temp[g.id_grupo] = Array.from(materiasSet).map((x) => JSON.parse(x));
      }

      setMateriasGrupo(temp);
    };

    cargar();
  }, []);

  /* ========================
          ELIMINAR GRUPO     
     ======================== */
  const eliminarGrupo = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este grupo?\nLos alumnos conservarán su grupo_id."
    );

    if (!confirmar) return;

    try {
      await api.delete(`/grupos/${id}`);
      alert("Grupo eliminado correctamente.");
      setGrupos(grupos.filter((g) => g.id_grupo !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el grupo.");
    }
  };

  return (
    <div className="space-y-10">
      {/* ENCABEZADO */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Grupos</h1>

        <button
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate("/app/grupos/agregar")}
        >
          + Crear Grupo
        </button>
      </div>

      {/* TARJETAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {grupos.map((g) => (
          <div
            key={g.id_grupo}
            className="bg-white shadow rounded-xl p-6 border hover:shadow-lg transition"
          >
            {/* ENCABEZADO DEL GRUPO */}
            <div className="flex items-center gap-3">
              <UserGroupIcon className="h-10 w-10 text-blue-600" />

              <div>
                <p className="text-xl font-bold">
                  {g.grado}° • Grupo {g.grupo}
                </p>

                <p className="text-gray-500">
                  Docente:{" "}
                  <span className="font-semibold">
                    {g.tb_docente?.nombre || "Sin asignar"}
                  </span>
                </p>
              </div>
            </div>

            {/* MATERIAS */}
            <div className="mt-4">
              <p className="font-semibold mb-2">Materias asignadas:</p>

              {materiasGrupo[g.id_grupo]?.length > 0 ? (
                <ul className="space-y-2">
                  {materiasGrupo[g.id_grupo].map((m) => (
                    <li
                      key={m.id_materia}
                      className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
                    >
                      <span>{m.nombre_materia}</span>

                      {/* CALIFICAR */}
                      <button
                        className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                        onClick={() =>
                          navigate(
                            `/app/grupos/${g.id_grupo}/calificaciones/${m.id_materia}`
                          )
                        }
                      >
                        <ClipboardDocumentListIcon className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">Este grupo no tiene materias.</p>
              )}
            </div>

            {/* BOTONES ACCIÓN */}
            <div className="flex gap-3 mt-6 justify-end">

              {/* EDITAR */}
              <button
                className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600"
                onClick={() => navigate(`/app/grupos/editar/${g.id_grupo}`)}
              >
                <PencilIcon className="h-5 w-5" />
              </button>

              {/* ASIGNAR MATERIAS */}
              <button
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700"
                onClick={() => navigate(`/app/grupos/${g.id_grupo}/materias`)}
              >
                <BookOpenIcon className="h-5 w-5" />
              </button>

              {/* ASIGNAR ALUMNOS */}
              <button
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                onClick={() => navigate(`/app/grupos/${g.id_grupo}/alumnos`)}
              >
                <UserPlusIcon className="h-5 w-5" />
              </button>

              {/* ELIMINAR */}
              <button
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                onClick={() => eliminarGrupo(g.id_grupo)}
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
