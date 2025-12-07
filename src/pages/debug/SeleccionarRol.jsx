import React from "react";

export default function SeleccionarRol() {

  const setRol = (rol) => {

    if (rol === "admin") {
      // Admin sin login
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
    } else {
      // Simulación de login
      const usuario = {
        nombre: rol === "docente" ? "Docente Demo" : "Tutor Demo",
        rol: rol,
      };

      // Guardar como lo usa AuthContext
      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("token", "token-demo");
    }

    // Redirigir al APP
    location.href = "/app";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg space-y-6 text-center w-96">
        <h1 className="text-2xl font-bold">Seleccionar Rol de Prueba</h1>
        <p className="text-gray-600">Esto es solo para pruebas sin backend</p>

        {/* ADMIN */}
        <button
          onClick={() => setRol("admin")}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Entrar como ADMIN
        </button>

        {/* DOCENTE */}
        <button
          onClick={() => setRol("docente")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Entrar como DOCENTE
        </button>

        {/* TUTOR */}
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
