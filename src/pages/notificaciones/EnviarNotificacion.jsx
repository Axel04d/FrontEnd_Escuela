import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../auth/AuthContext";
import { ArrowLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function EnviarNotificacion() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const idDocente = user?.id_docente; // ✔ CORREGIDO
  const idAlumnoURL = params.get("alumno");

  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(idAlumnoURL || "");
  const [listaAlumnos, setListaAlumnos] = useState([]);
  const [alumnoInfo, setAlumnoInfo] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!idAlumnoURL) {
      const cargarAlumnos = async () => {
        try {
          const res = await api.get(`/docentes/${idDocente}/alumnos`);
          setListaAlumnos(res.data || []);
        } catch (error) {
          console.error("Error cargando alumnos:", error);
        }
      };

      cargarAlumnos();
    }
  }, [idAlumnoURL, idDocente]);

  useEffect(() => {
    if (!alumnoSeleccionado) return;

    const cargarAlumno = async () => {
      try {
        const res = await api.get(`/alumnos/${alumnoSeleccionado}`);
        setAlumnoInfo(res.data);
      } catch {
        setAlumnoInfo(null);
      }
    };

    cargarAlumno();
  }, [alumnoSeleccionado]);

  const enviar = async () => {
    if (!alumnoSeleccionado) return alert("Selecciona un alumno.");
    if (!mensaje.trim()) return alert("El mensaje no puede ir vacío.");

    setEnviando(true);

    try {
      await api.post("/notificaciones", {
        id_docente: idDocente,
        id_alumno: alumnoSeleccionado,
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
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 w-fit transition"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Regresar
      </button>

      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <PaperAirplaneIcon className="h-8 w-8 text-blue-600" />
        Enviar Notificación
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
        {!idAlumnoURL && (
          <div>
            <label className="font-semibold text-gray-700">Selecciona un alumno:</label>
            <select
              className="w-full p-3 border rounded-xl mt-2"
              value={alumnoSeleccionado}
              onChange={(e) => setAlumnoSeleccionado(e.target.value)}
            >
              <option value="">-- Seleccionar --</option>
              {listaAlumnos.map((a) => (
                <option key={a.id_alumno} value={a.id_alumno}>
                  {a.nombre} {a.apellidos}
                </option>
              ))}
            </select>
          </div>
        )}

        {alumnoInfo && (
          <div className="p-4 rounded-xl bg-gray-50 border">
            <p className="text-lg font-bold text-gray-800">
              {alumnoInfo.nombre} {alumnoInfo.apellidos}
            </p>
            <p className="text-gray-500 text-sm">ID Alumno: {alumnoSeleccionado}</p>
          </div>
        )}

        <textarea
          className="w-full border rounded-xl p-4 min-h-[140px] text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Escribe el mensaje..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />

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
