export let docentesDemo = [
  { id_docente: 1, nombre: "Ana", apellidos: "Martínez López" },
  { id_docente: 2, nombre: "Carlos", apellidos: "Ramírez Torres" },
  { id_docente: 3, nombre: "María", apellidos: "López Hernández" },
  { id_docente: 4, nombre: "Luis", apellidos: "Torres García" },
];

// ====== FUNCIONES QUE SIMULAN EL BACKEND ======

export function agregarDocente(nombre, apellidos) {
  const nuevo = {
    id_docente: docentesDemo.length + 1,
    nombre,
    apellidos,
  };
  docentesDemo.push(nuevo);
  return nuevo;
}

export function editarDocente(id, nombre, apellidos) {
  const d = docentesDemo.find((doc) => doc.id_docente === Number(id));
  if (d) {
    d.nombre = nombre;
    d.apellidos = apellidos;
  }
}

export function eliminarDocente(id) {
  docentesDemo = docentesDemo.filter((d) => d.id_docente !== Number(id));
}
