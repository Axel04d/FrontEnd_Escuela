import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/api.js";

export default function ActivarCuenta() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Token no válido.");
    }
  }, [token]);

  const activarCuenta = async () => {
    if (!password || !password2) {
      setError("Debes escribir ambas contraseñas.");
      return;
    }

    if (password !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await api.post("/auth/activar-cuenta", {
        token,
        nuevaPassword: password,
      });

      setMensaje(res.data.message);
      setError("");

      // Redirigir luego de 2 segundos
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      console.error(err);
      setError("El enlace expiró o es inválido.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Activar Cuenta
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Define tu nueva contraseña para activar tu cuenta.
        </p>

        {error && (
          <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">
            {error}
          </p>
        )}

        {mensaje && (
          <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
            {mensaje}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="font-semibold">Nueva contraseña</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold">Confirmar contraseña</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>

          <button
            onClick={activarCuenta}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Activar Cuenta
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
