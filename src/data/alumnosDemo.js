// 🔥 Lista de alumnos demo
export const alumnosDemo = [
  {
    id_alumno: 1,
    nombre: "Juan",
    apellidos: "Pérez Gómez",
    grado: "1°",
    grupo: "A",
    id_tutor: 1,
  },
  {
    id_alumno: 2,
    nombre: "Ana",
    apellidos: "Pérez Gómez",
    grado: "3°",
    grupo: "B",
    id_tutor: 1,
  },
  {
    id_alumno: 3,
    nombre: "Luis",
    apellidos: "Ramírez Soto",
    grado: "2°",
    grupo: "A",
    id_tutor: 2,
  },
];

// 🔥 Esta función simula asignar alumnos a un grupo
// Cuando tengas backend real, se convierte en:
// axios.put(`/grupos/${id}/alumnos`, { alumnos: lista })
export function asignarAlumnosAGrupo(idGrupo, listaAlumnos) {
  console.log("Simulando asignación en DEMO...");
  console.log("Grupo:", idGrupo);
  console.log("Alumnos asignados:", listaAlumnos);

  // Aquí no hacemos nada porque es modo demo,
  // pero cuando tengas backend esto SÍ cambiará datos.
}
