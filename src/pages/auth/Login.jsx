import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "./AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const iniciarSesion = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("/auth/login", form);
      const data = res.data;

      console.log("Respuesta login:", data);

      if (!data?.token || !data?.user?.rol) {
        throw new Error("El servidor no devolvió datos válidos.");
      }

      // GUARDAR SESIÓN
      login({
        ...data.user,
        token: data.token
      });

      // REDIRECCIÓN SEGÚN ROL
      const rol = data.user.rol;

      if (rol === "admin") return navigate("/app/dashboard");
      if (rol === "docente") return navigate("/app/dashboard-docente");
      if (rol === "tutor") return navigate("/app/dashboard-tutor");

      navigate("/login");

    } catch (error) {
      console.error("Error login:", error);
      setErrorMsg("Credenciales incorrectas o servidor no disponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-10 space-y-8">
        
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Iniciar Sesión
        </h1>

        {errorMsg && (
          <p className="text-red-500 text-center font-semibold">
            {errorMsg}
          </p>
        )}

        <div>
          <label className="font-semibold">Correo</label>
          <input
            name="email"
            type="email"
            onChange={onChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="font-semibold">Contraseña</label>
          <input
            name="password"
            type="password"
            onChange={onChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <button
          disabled={loading}
          onClick={iniciarSesion}
          className={`w-full py-3 rounded-lg text-white font-bold transition ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Validando..." : "Ingresar"}
        </button>

      </div>
    </div>
  );
}
