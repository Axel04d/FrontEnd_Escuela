import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

import {
  UserGroupIcon,
  AcademicCapIcon,
  UserIcon,
  BellIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    alumnos: 0,
    docentes: 0,
    tutores: 0,
    notificaciones: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resAlumnos, resDocentes, resTutores, resNotificaciones] =
          await Promise.all([
            api.get("/alumnos"),
            api.get("/docentes"),
            api.get("/tutores"),
            api.get("/notificaciones"),
          ]);

        setStats({
          alumnos: resAlumnos.data.length,
          docentes: resDocentes.data.length,
          tutores: resTutores.data.length,
          notificaciones: resNotificaciones.data.slice(0, 5),
        });
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) return <p className="text-gray-400 animate-pulse">Cargando panel...</p>;

  return (
    <div className="space-y-12">

      {/* TÍTULO PRINCIPAL */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-800">Panel Administrativo</h1>
        <p className="text-gray-500 mt-1">Resumen general del sistema escolar</p>
      </div>

      {/* == TARJETAS GRANDES == */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ALUMNOS */}
        <div
          onClick={() => navigate("/app/alumnos")}
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl 
                     transition cursor-pointer border-l-8 border-blue-600"
        >
          <div className="flex items-center justify-between">
            <UserGroupIcon className="h-14 w-14 text-blue-600" />
            <span className="text-4xl font-extrabold text-blue-700">{stats.alumnos}</span>
          </div>
          <h2 className="text-xl font-bold mt-4 text-gray-800">Alumnos Registrados</h2>
          <p className="text-gray-500">Gestión completa de estudiantes</p>
        </div>

        {/* DOCENTES */}
        <div
          onClick={() => navigate("/app/docentes")}
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl 
                     transition cursor-pointer border-l-8 border-green-600"
        >
          <div className="flex items-center justify-between">
            <UserIcon className="h-14 w-14 text-green-600" />
            <span className="text-4xl font-extrabold text-green-700">{stats.docentes}</span>
          </div>
          <h2 className="text-xl font-bold mt-4 text-gray-800">Docentes</h2>
          <p className="text-gray-500">Profesores activos en el sistema</p>
        </div>

        {/* TUTORES */}
        <div
          onClick={() => navigate("/app/tutores")}
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl 
                     transition cursor-pointer border-l-8 border-orange-500"
        >
          <div className="flex items-center justify-between">
            <AcademicCapIcon className="h-14 w-14 text-orange-500" />
            <span className="text-4xl font-extrabold text-orange-600">{stats.tutores}</span>
          </div>
          <h2 className="text-xl font-bold mt-4 text-gray-800">Tutores</h2>
          <p className="text-gray-500">Padres o tutores registrados</p>
        </div>

      </div>

      {/* ===========================================
                 ACCIONES RÁPIDAS
      ============================================ */}
      <div className="bg-white p-8 rounded-2xl shadow space-y-6">

        <h2 className="text-2xl font-bold flex items-center gap-3">
          <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
          Acciones Rápidas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <button
            onClick={() => navigate("/app/alumnos/crear")}
            className="flex items-center gap-4 bg-blue-600 hover:bg-blue-700 
                       text-white p-5 rounded-xl shadow text-lg transition"
          >
            <PlusCircleIcon className="h-8 w-8" />
            Registrar Alumno
          </button>

          <button
            onClick={() => navigate("/app/notificaciones/enviar")}
            className="flex items-center gap-4 bg-purple-600 hover:bg-purple-700 
                       text-white p-5 rounded-xl shadow text-lg transition"
          >
            <BellIcon className="h-8 w-8" />
            Enviar Notificación
          </button>

          <button
            onClick={() => navigate("/app/grupos")}
            className="flex items-center gap-4 bg-green-600 hover:bg-green-700 
                       text-white p-5 rounded-xl shadow text-lg transition"
          >
            <UsersIcon className="h-8 w-8" />
            Ver Grupos
          </button>
        </div>
      </div>

      {/* ===========================================
                 ÚLTIMAS NOTIFICACIONES
      ============================================ */}
      <div className="bg-white p-8 rounded-2xl shadow">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Últimas Notificaciones</h2>
          <BellIcon className="h-10 w-10 text-gray-400" />
        </div>

        {stats.notificaciones.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No hay notificaciones recientes.
          </p>
        ) : (
          <ul className="space-y-4">
            {stats.notificaciones.map((n) => (
              <li
                key={n.id_notificacion}
                className="p-4 bg-gray-50 border rounded-xl shadow-sm"
              >
                <p className="font-semibold text-lg">{n.titulo}</p>
                <p className="text-sm text-gray-500">
                  {n.fecha} — {n.hora}
                </p>
              </li>
            ))}
          </ul>
        )}

      </div>

    </div>
  );
}
