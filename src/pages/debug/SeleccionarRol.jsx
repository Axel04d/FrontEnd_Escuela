import React from "react";

export default function SeleccionarRol() {

  const setRol = (rol) => {
    if (rol === "admin") {
      localStorage.removeItem("user"); // Admin no necesita login
    } else {
      const user = {
        nombre: rol === "docente" ? "Docente Demo" : "Tutor Demo",
        rol: rol,
        id_usuario: rol === "docente" ? 10 : 20
      };
      localStorage.setItem("user", JSON.stringify(user));
    }

    location.href = "/app";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg space-y-6 text-center w-96">
        <h1 className="text-2xl font-bold">Seleccionar Rol de Prueba</h1>
        <p className="text-gray-600">Esto es solo para pruebas sin backend</p>

        {/* BOTÓN ADMIN */}
        <button
          onClick={() => setRol("admin")}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Entrar como ADMIN
        </button>

        {/* BOTÓN DOCENTE */}
        <button
          onClick={() => setRol("docente")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Entrar como DOCENTE
        </button>

        {/* BOTÓN TUTOR */}
        <button
          onClick={() => setRol("tutor")}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Entrar como TUTOR
        </button>

      </div>
    </div>
  );
}
