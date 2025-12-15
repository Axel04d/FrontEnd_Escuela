import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../auth/AuthContext";

import {
  UserGroupIcon,
  UsersIcon,
  BellAlertIcon,
  BookOpenIcon,
  PaperAirplaneIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

export default function DashboardDocente() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [grupos, setGrupos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Protección + carga de datos SOLO del docente
  useEffect(() => {
    if (!user || user.rol !== "docente" || !user.id_perfil) return;

    const cargarDatos = async () => {
      try {
        const [resGrupos, resAlumnos, resNotif] = await Promise.all([
          api.get(`/docentes/${user.id_perfil}/grupos`),
          api.get(`/docentes/${user.id_perfil}/alumnos`),
          api.get(`/notificaciones/docente/${user.id_perfil}`),
        ]);

        setGrupos(resGrupos.data || []);
        setAlumnos(resAlumnos.data || []);
        setNotificaciones((resNotif.data || []).slice(0, 5));
      } catch (error) {
        console.error("Error dashboard docente:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user]);

  if (loading) {
    return (
      <p className="text-gray-400 animate-pulse">
        Cargando panel del docente...
      </p>
    );
  }

  return (
    <div className="space-y-16">

      {/* ==================== ENCABEZADO ==================== */}
      <header>
        <h1 className="text-4xl font-extrabold text-gray-800">
          Panel del Docente
        </h1>
        <p className="text-gray-500 mt-1">
          Consulta tu información, grupos y alumnos asignados.
        </p>
      </header>

      {/* ==================== PERFIL DEL DOCENTE ==================== */}
      <section className="bg-white p-8 rounded-2xl shadow space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <IdentificationIcon className="h-7 w-7 text-blue-600" />
          Mi Perfil
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <span className="font-semibold">Nombre:</span>{" "}
            {user.nombre}
          </p>
          <p>
            <span className="font-semibold">Correo:</span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-semibold">Rol:</span>{" "}
            Docente
          </p>
          <p>
            <span className="font-semibold">ID Docente:</span>{" "}
            {user.id_perfil}
          </p>
        </div>
      </section>

      {/* ==================== TARJETAS RESUMEN ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* MIS GRUPOS */}
        <Link
          to="/app/grupos"
          className="bg-white p-8 rounded-2xl border-l-8 border-blue-600 shadow hover:shadow-xl transition"
        >
          <UserGroupIcon className="h-14 w-14 text-blue-600" />
          <h2 className="text-xl font-bold mt-4">
            Mis Grupos ({grupos.length})
          </h2>
        </Link>

        {/* MIS ALUMNOS */}
        <div className="bg-white p-8 rounded-2xl border-l-8 border-green-600 shadow">
          <UsersIcon className="h-14 w-14 text-green-600" />
          <h2 className="text-xl font-bold mt-4">
            Mis Alumnos ({alumnos.length})
          </h2>
        </div>

        {/* NOTIFICACIONES */}
        <Link
          to="/app/notificaciones"
          className="bg-white p-8 rounded-2xl border-l-8 border-yellow-500 shadow hover:shadow-xl transition"
        >
          <BellAlertIcon className="h-14 w-14 text-yellow-600" />
          <h2 className="text-xl font-bold mt-4">
            Notificaciones ({notificaciones.length})
          </h2>
        </Link>
      </div>

      {/* ==================== LISTA DE ALUMNOS ==================== */}
      <section className="bg-white p-8 rounded-2xl shadow space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpenIcon className="h-8 w-8 text-blue-600" />
          Mis Alumnos
        </h2>

        {alumnos.length === 0 ? (
          <p className="text-gray-500">
            No tienes alumnos asignados.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {alumnos.map((al) => (
              <div
                key={al.id_alumno}
                className="p-6 bg-gray-50 rounded-xl shadow border"
              >
                <h3 className="text-xl font-bold text-gray-800">
                  {al.nombre} {al.apellidos}
                </h3>

                <button
                  onClick={() =>
                    navigate(
                      `/app/notificaciones/enviar?alumno=${al.id_alumno}`
                    )
                  }
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                  Enviar Notificación
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
