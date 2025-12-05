import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const iniciarSesion = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("/auth/login", form);

      // ======================
      // GUARDAR SESIÓN LOCAL
      // ======================
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("usuario", JSON.stringify(res.data));

      // ======================
      // REDIRECCIÓN POR ROL
      // ======================
      if (res.data.rol === "admin") {
        navigate("/dashboard");
      } else if (res.data.rol === "docente") {
        navigate("/mis-grupos");
      } else if (res.data.rol === "tutor") {
        navigate("/tutor/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error(error);
      setErrorMsg("Credenciales incorrectas. Verifique su correo y contraseña.");
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
        <p className="text-center text-gray-500 mb-6">
          Bienvenido al Sistema Escolar
        </p>

        {errorMsg && (
          <p className="text-red-500 text-center font-semibold">
            {errorMsg}
          </p>
        )}

        {/* INPUT EMAIL */}
        <div>
          <label className="font-semibold text-gray-700">Correo electrónico</label>
          <input
            name="email"
            type="email"
            placeholder="ejemplo@gmail.com"
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={onChange}
            required
          />
        </div>

        {/* INPUT PASSWORD */}
        <div>
          <label className="font-semibold text-gray-700">Contraseña</label>
          <input
            name="password"
            type="password"
            placeholder="Ingrese su contraseña"
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={onChange}
            required
          />
        </div>

        {/* BOTÓN */}
        <button
          disabled={loading}
          onClick={iniciarSesion}
          className={`w-full py-3 rounded-lg text-white font-bold transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Validando..." : "Ingresar"}
        </button>

        {/* LINK ACTIVAR CUENTA */}
        <p
          className="text-center text-blue-600 hover:underline cursor-pointer"
          onClick={() => navigate("/activar-cuenta")}
        >
          ¿No tienes contraseña? Activar cuenta
        </p>
      </div>
    </div>
  );
}
