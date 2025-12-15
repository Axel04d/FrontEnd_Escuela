import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "./auth/AuthContext";

import {
  UserGroupIcon,
  AcademicCapIcon,
  UserIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    alumnos: [],
    docentes: 0,
    tutores: 0,
  });

  const [loading, setLoading] = useState(true);

  // 🔐 PROTECCIÓN: SOLO ADMIN
  useEffect(() => {
    if (!user) return;
    if (user.rol !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || user.rol !== "admin") return;

    const cargarDatos = async () => {
      try {
        const results = await Promise.allSettled([
          api.get("/alumnos"),
          api.get("/docentes"),
          api.get("/tutores"),
        ]);

        const [alumnos, docentes, tutores] = results;

        setStats({
          alumnos: alumnos.status === "fulfilled" ? alumnos.value.data : [],
          docentes:
            docentes.status === "fulfilled"
              ? docentes.value.data.length
              : 0,
          tutores:
            tutores.status === "fulfilled"
              ? tutores.value.data.length
              : 0,
        });
      } catch (error) {
        console.error("Error cargando dashboard admin:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user]);

  if (loading) {
    return <p className="text-gray-400 animate-pulse">Cargando panel...</p>;
  }

  return (
    <div className="space-y-16">
      {/* ======================== TÍTULO ======================== */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-800">
          Panel Administrativo
        </h1>
        <p className="text-gray-500 mt-1">
          Resumen general del sistema escolar
        </p>
      </div>

      {/* ======================== TARJETAS ======================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ALUMNOS */}
        <div
          onClick={() => navigate("/app/alumnos")}
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer border-l-8 border-blue-600"
        >
          <div className="flex items-center justify-between">
            <UserGroupIcon className="h-14 w-14 text-blue-600" />
            <span className="text-4xl font-extrabold text-blue-700">
              {stats.alumnos.length}
            </span>
          </div>
          <h2 className="text-xl font-bold mt-4">Alumnos</h2>
        </div>

        {/* DOCENTES */}
        <div
          onClick={() => navigate("/app/docentes")}
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer border-l-8 border-green-600"
        >
          <div className="flex items-center justify-between">
            <UserIcon className="h-14 w-14 text-green-600" />
            <span className="text-4xl font-extrabold text-green-700">
              {stats.docentes}
            </span>
          </div>
          <h2 className="text-xl font-bold mt-4">Docentes</h2>
        </div>

        {/* TUTORES */}
        <div
          onClick={() => navigate("/app/tutores")}
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer border-l-8 border-orange-500"
        >
          <div className="flex items-center justify-between">
            <AcademicCapIcon className="h-14 w-14 text-orange-500" />
            <span className="text-4xl font-extrabold text-orange-600">
              {stats.tutores}
            </span>
          </div>
          <h2 className="text-xl font-bold mt-4">Tutores</h2>
        </div>
      </div>

      {/* ======================== ACCIONES ======================== */}
      <div className="bg-white p-8 rounded-2xl shadow space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
          Acciones rápidas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/app/alumnos/crear")}
            className="flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-xl shadow"
          >
            <PlusCircleIcon className="h-8 w-8" />
            Registrar Alumno
          </button>

          <button
            onClick={() => navigate("/app/grupos")}
            className="flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white p-5 rounded-xl shadow"
          >
            <UsersIcon className="h-8 w-8" />
            Ver Grupos
          </button>
        </div>
      </div>
    </div>
  );
}
