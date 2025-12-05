import api from "./axios";

export const getAlumnos = () => api.get("/alumnos");
export const getAlumno = (id) => api.get(`/alumnos/${id}`);
export const createAlumno = (data) => api.post("/alumnos", data);
export const updateAlumno = (id, data) => api.put(`/alumnos/${id}`, data);
export const deleteAlumno = (id) => api.delete(`/alumnos/${id}`);

export const getAlumnoNotificaciones = (id) => api.get(`/alumnos/${id}/notificaciones`);
export const getAlumnoMaterias = (id) => api.get(`/alumnos/${id}/materias`);
export const getAlumnoTutor = (id) => api.get(`/alumnos/${id}/tutor`);
export const getAlumnoResumen = (id) => api.get(`/alumnos/${id}/resumen`);
