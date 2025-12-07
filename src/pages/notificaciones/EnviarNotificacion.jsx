import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../auth/AuthContext";
import { ArrowLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function EnviarNotificacion() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const idAlumno = params.get("alumno");
  const idTutor = params.get("tutor"); // no se usa para backend pero se muestra
  const idDocente = user?.id_perfil; // 🔵 EL DOCENTE REAL DEL BACKEND

  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [alumnoInfo, setAlumnoInfo] = useState(null);

  // ===============================
  // 🔵 VALIDAR PARÁMETROS
  // ===============================
  useEffect(() => {
    if (!idAlumno || !idDocente) {
      alert("Faltan datos necesarios.");
      navigate(-1);
      return;
    }

    const cargarAlumno = async () => {
      try {
        const res = await api.get(`/alumnos/${idAlumno}`);
        setAlumnoInfo(res.data);
      } catch {
        setAlumnoInfo(null);
      }
    };

    cargarAlumno();
  }, [idAlumno, idDocente, navigate]);

  // ===============================
  // 🔵 ENVIAR NOTIFICACIÓN
  // ===============================
  const enviar = async () => {
    if (!mensaje.trim()) return alert("El mensaje no puede ir vacío.");

    setEnviando(true);

    try {
      await api.post("/notificaciones", {
        id_docente: idDocente,   // ✔ OBLIGATORIO PARA EL BACKEND
        id_alumno: idAlumno,
        mensaje,
      });

      alert("Notificación enviada correctamente.");
      navigate(-1);

    } catch (error) {
      console.error("Error al enviar notificación:", error);
      alert("Error al enviar la notificación.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-10">

      {/* BOTÓN REGRESAR */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 w-fit transition"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Regresar
      </button>

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <PaperAirplaneIcon className="h-8 w-8 text-blue-600" />
        Enviar Notificación
      </h1>

      {/* TARJETA */}
      <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">

        <p className="text-gray-600">La notificación será enviada a:</p>

        {/* INFO DEL ALUMNO */}
        <div className="p-4 rounded-xl bg-gray-50 border">
          {alumnoInfo ? (
            <>
              <p className="text-lg font-bold text-gray-800">
                {alumnoInfo.nombre} {alumnoInfo.apellidos}
              </p>
              <p className="text-gray-500 text-sm">
                ID Alumno: {idAlumno} • ID Docente: {idDocente}
              </p>
            </>
          ) : (
            <p className="text-gray-500">Alumno #{idAlumno}</p>
          )}
        </div>

        {/* INPUT DEL MENSAJE */}
        <textarea
          className="w-full border rounded-xl p-4 min-h-[140px] text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Escribe el mensaje que deseas enviar..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />

        {/* BOTÓN ENVIAR */}
        <button
          onClick={enviar}
          disabled={enviando}
          className="w-full py-3 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition"
        >
          <PaperAirplaneIcon className="h-6 w-6" />
          {enviando ? "Enviando..." : "Enviar Notificación"}
        </button>
      </div>
    </div>
  );
}
