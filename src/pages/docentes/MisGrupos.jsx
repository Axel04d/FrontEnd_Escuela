import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import { AuthContext } from "../auth/AuthContext";
import { UserGroupIcon, AcademicCapIcon } from "@heroicons/react/24/solid";

export default function MisGrupos() {
  const { user } = useContext(AuthContext);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔐 Protección: solo DOCENTE
  useEffect(() => {
    if (!user) return;

    if (user.rol !== "docente" || !user.id_perfil) {
      navigate("/login");
    }
  }, [user, navigate]);

  // 🔵 Cargar SOLO grupos del docente
  useEffect(() => {
    if (!user?.id_perfil) return;

    const cargar = async () => {
      try {
        const res = await api.get(
          `/docentes/${user.id_perfil}/grupos`
        );
        setGrupos(res.data || []);
      } catch (error) {
        console.error("Error cargando grupos del docente:", error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [user]);

  if (loading) {
    return (
      <p className="text-gray-500 animate-pulse">
        Cargando grupos asignados...
      </p>
    );
  }

  return (
    <div className="space-y-10">

      {/* ==================== ENCABEZADO ==================== */}
      <div className="flex items-center gap-3">
        <AcademicCapIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">
          Mis Grupos
        </h1>
      </div>

      {/* ==================== ESTADO VACÍO ==================== */}
      {grupos.length === 0 && (
        <p className="text-gray-500">
          Actualmente no tienes grupos asignados.
        </p>
      )}

      {/* ==================== LISTA DE GRUPOS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {grupos.map((g) => (
          <div
            key={g.id_grupo}
            className="bg-white rounded-xl border shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3">
              <UserGroupIcon className="h-10 w-10 text-blue-600" />
              <div>
                <p className="text-xl font-bold text-gray-800">
                  {g.grado} • Grupo {g.grupo}
                </p>
                <p className="text-gray-500 text-sm">
                  Alumnos asignados:{" "}
                  <span className="font-semibold">
                    {g.total_alumnos ?? "—"}
                  </span>
                </p>
              </div>
            </div>

            {/* ACCIÓN PERMITIDA AL DOCENTE */}
            <div className="flex flex-col gap-3 mt-6">
              <button
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={() =>
                  navigate(`/app/grupos/${g.id_grupo}/alumnos`)
                }
              >
                Ver alumnos del grupo
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
