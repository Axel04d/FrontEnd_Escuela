export let materiasDemo = [
  { id_materia: 1, nombre_materia: "Matemáticas" },
  { id_materia: 2, nombre_materia: "Español" },
  { id_materia: 3, nombre_materia: "Ciencias" },
  { id_materia: 4, nombre_materia: "Historia" },
  { id_materia: 5, nombre_materia: "Inglés" },
  { id_materia: 6, nombre_materia: "Programación" },
  { id_materia: 7, nombre_materia: "Robótica" },
];

// 🚀 FUNCIONES "como si fueran el backend"
export function agregarMateria(nombre) {
  const nueva = {
    id_materia: materiasDemo.length + 1,
    nombre_materia: nombre,
  };
  materiasDemo.push(nueva);
  return nueva;
}

export function editarMateria(id, nombre) {
  const materia = materiasDemo.find(m => m.id_materia === Number(id));
  if (materia) materia.nombre_materia = nombre;
}

export function eliminarMateria(id) {
  materiasDemo = materiasDemo.filter(m => m.id_materia !== Number(id));
}
