import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/api.js";

export default function EnviarNotificacion() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preAlumno = searchParams.get("alumno");
  const preTutor = searchParams.get("tutor");

  const [docentes, setDocentes] = useState([]);
  const [alumnos, setAlumnos] = useState([]);

  const [form, setForm] = useState({
    id_docente: "",
    id_alumno: preAlumno || "",
    mensaje: "",
  });

  useEffect(() => {
    Promise.all([api.get("/docentes"), api.get("/alumnos")]).then(
      ([resDoc, resAl]) => {
        setDocentes(resDoc.data);
        setAlumnos(resAl.data);

        // 🔵 Si viene un alumno preseleccionado, lo fijamos
        if (preAlumno) {
          setForm((prev) => ({ ...prev, id_alumno: preAlumno }));
        }
      }
    );
  }, []);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async () => {
    if (!form.id_docente || !form.id_alumno || !form.mensaje) {
      return alert("Todos los campos son necesarios.");
    }

    await api.post("/notificaciones", form);

    alert("Notificación enviada.");
    navigate("/notificaciones");
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Enviar Notificación</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        {/* DOCENTE */}
        <div>
          <label className="font-semibold">Docente que envía</label>
          <select
            name="id_docente"
            className="w-full p-3 border rounded"
            onChange={onChange}
          >
            <option value="">Selecciona un docente</option>
            {docentes.map((d) => (
              <option key={d.id_docente} value={d.id_docente}>
                {d.nombre} {d.apellidos}
              </option>
            ))}
          </select>
        </div>

        {/* ALUMNO */}
        <div>
          <label className="font-semibold">Alumno destinatario</label>
          <select
            name="id_alumno"
            className="w-full p-3 border rounded"
            onChange={onChange}
            value={form.id_alumno}
          >
            <option value="">Selecciona un alumno</option>
            {alumnos.map((a) => (
              <option key={a.id_alumno} value={a.id_alumno}>
                {a.nombre} {a.apellidos}
              </option>
            ))}
          </select>
        </div>

        {/* MENSAJE */}
        <div>
          <label className="font-semibold">Mensaje</label>
          <textarea
            name="mensaje"
            className="w-full p-3 border rounded"
            rows="4"
            onChange={onChange}
            placeholder="Escribe la notificación..."
          ></textarea>
        </div>

        <div className="flex gap-4">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            onClick={enviar}
          >
            Enviar
          </button>

          <button
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
            onClick={() => navigate("/notificaciones")}
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}
