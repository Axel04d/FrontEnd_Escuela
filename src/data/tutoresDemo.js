export let tutoresDemo = [
  { id_tutor: 1, nombre: "María", apellidos: "Gómez Ruiz", telefono: "555-123-4567" },
  { id_tutor: 2, nombre: "Francisco", apellidos: "Díaz López", telefono: "555-987-3344" },
  { id_tutor: 3, nombre: "Jessica", apellidos: "Ruiz Torres", telefono: "555-778-1122" },
];

// ===== CONTROLADORES SIMULADOS =====

export function agregarTutor(nombre, apellidos, telefono) {
  const nuevo = {
    id_tutor: tutoresDemo.length + 1,
    nombre,
    apellidos,
    telefono,
  };
  tutoresDemo.push(nuevo);
  return nuevo;
}

export function editarTutor(id, nombre, apellidos, telefono) {
  const t = tutoresDemo.find((x) => x.id_tutor === Number(id));
  if (t) {
    t.nombre = nombre;
    t.apellidos = apellidos;
    t.telefono = telefono;
  }
}

export function eliminarTutor(id) {
  tutoresDemo = tutoresDemo.filter((t) => t.id_tutor !== Number(id));
}
