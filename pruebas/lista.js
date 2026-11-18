const ListaEnlazada = require("../src/ListaEnlazada");

function verificarEstado(titulo, lista, esperadoCabeza, esperadoCola, esperadoTamanio) {
  const actualCabeza = lista.cabeza ? lista.cabeza.dato.motivo : null;
  const actualCola = lista.cola ? lista.cola.dato.motivo : null;
  const actualTamanio = lista.obtenerTamanio();

  const correcto =
    actualCabeza === esperadoCabeza &&
    actualCola === esperadoCola &&
    actualTamanio === esperadoTamanio;

  console.log(`\n--- ${titulo} ---`);
  console.log(`cabeza:  ${actualCabeza} (esperado: ${esperadoCabeza})`);
  console.log(`cola:    ${actualCola} (esperado: ${esperadoCola})`);
  console.log(`tamanio: ${actualTamanio} (esperado: ${esperadoTamanio})`);
  console.log("Orden en arreglo:", lista.aArreglo().map((a) => a.motivo));
  console.log("Estado:", correcto ? "OK" : "ERROR");
}

console.log("==========================================");
console.log("1. PRUEBAS DE agregarAlFinal");
console.log("==========================================");

const listaFinal = new ListaEnlazada();
verificarEstado("Estado inicial (lista vacía)", listaFinal, null, null, 0);

listaFinal.agregarAlFinal({
  fecha: "02/02",
  motivo: "Vacunacion",
  veterinario: "Dra. Rios",
  costo: 85000
});
verificarEstado(
  "Caso 1A: agregarAlFinal en lista vacía",
  listaFinal,
  "Vacunacion",
  "Vacunacion",
  1
);

listaFinal.agregarAlFinal({
  fecha: "15/03",
  motivo: "Control de peso",
  veterinario: "Dr. Gomez",
  costo: 40000
});
verificarEstado(
  "Caso 1B: agregarAlFinal en lista con 1 nodo",
  listaFinal,
  "Vacunacion",
  "Control de peso",
  2
);

listaFinal.agregarAlFinal({
  fecha: "20/05",
  motivo: "Limpieza dental",
  veterinario: "Dra. Rios",
  costo: 150000
});
verificarEstado(
  "Caso 1C: agregarAlFinal en lista con varios nodos",
  listaFinal,
  "Vacunacion",
  "Limpieza dental",
  3
);

console.log("\n==========================================");
console.log("2. PRUEBAS DE agregarAlInicio");
console.log("==========================================");

const listaInicio = new ListaEnlazada();
verificarEstado("Estado inicial (lista vacía)", listaInicio, null, null, 0);

listaInicio.agregarAlInicio({
  fecha: "20/05",
  motivo: "Limpieza dental",
  veterinario: "Dra. Rios",
  costo: 150000
});
verificarEstado(
  "Caso 2A: agregarAlInicio en lista vacía",
  listaInicio,
  "Limpieza dental",
  "Limpieza dental",
  1
);

listaInicio.agregarAlInicio({
  fecha: "15/03",
  motivo: "Control de peso",
  veterinario: "Dr. Gomez",
  costo: 40000
});
verificarEstado(
  "Caso 2B: agregarAlInicio en lista con 1 nodo",
  listaInicio,
  "Control de peso",
  "Limpieza dental",
  2
);

listaInicio.agregarAlInicio({
  fecha: "02/02",
  motivo: "Vacunacion",
  veterinario: "Dra. Rios",
  costo: 85000
});
verificarEstado(
  "Caso 2C: agregarAlInicio en lista con varios nodos",
  listaInicio,
  "Vacunacion",
  "Limpieza dental",
  3
);