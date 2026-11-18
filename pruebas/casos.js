const ListaEnlazada = require("../src/ListaEnlazada");

function verificar(titulo, condicion, detalle = "") {
  console.log(`${condicion ? "[OK]" : "[ERROR]"} ${titulo}${detalle ? ` -> ${detalle}` : ""}`);
}

console.log("==================================================");
console.log("PRUEBAS DE CASOS BORDE: eliminar e insertarDespuesDe");
console.log("==================================================\n");

const listaVacia = new ListaEnlazada();
const resVacia = listaVacia.eliminar((a) => a.motivo === "Vacunacion");

verificar(
  "1. Eliminar en lista vacía",
  resVacia === null &&
    listaVacia.cabeza === null &&
    listaVacia.cola === null &&
    listaVacia.obtenerTamanio() === 0,
  `retorno: ${resVacia}, tamanio: ${listaVacia.obtenerTamanio()}`
);

const listaUnNodo = new ListaEnlazada();
listaUnNodo.agregarAlFinal({ fecha: "02/02", motivo: "Vacunacion", costo: 85000 });

const resUnico = listaUnNodo.eliminar((a) => a.motivo === "Vacunacion");

verificar(
  "2. Eliminar el único nodo",
  resUnico !== null &&
    resUnico.motivo === "Vacunacion" &&
    listaUnNodo.cabeza === null &&
    listaUnNodo.cola === null &&
    listaUnNodo.estaVacia() === true &&
    listaUnNodo.obtenerTamanio() === 0,
  `eliminado: ${resUnico?.motivo}, cabeza: ${listaUnNodo.cabeza}, cola: ${listaUnNodo.cola}`
);

const listaCabeza = new ListaEnlazada();
listaCabeza.agregarAlFinal({ fecha: "02/02", motivo: "Vacunacion", costo: 85000 });
listaCabeza.agregarAlFinal({ fecha: "15/03", motivo: "Control de peso", costo: 40000 });
listaCabeza.agregarAlFinal({ fecha: "20/05", motivo: "Limpieza dental", costo: 150000 });

const resCabeza = listaCabeza.eliminar((a) => a.motivo === "Vacunacion");

verificar(
  "3. Eliminar la cabeza",
  resCabeza?.motivo === "Vacunacion" &&
    listaCabeza.cabeza?.dato.motivo === "Control de peso" &&
    listaCabeza.cola?.dato.motivo === "Limpieza dental" &&
    listaCabeza.obtenerTamanio() === 2,
  `nueva cabeza: ${listaCabeza.cabeza?.dato.motivo}, cola: ${listaCabeza.cola?.dato.motivo}, tamanio: ${listaCabeza.obtenerTamanio()}`
);

const listaCola = new ListaEnlazada();
listaCola.agregarAlFinal({ fecha: "02/02", motivo: "Vacunacion", costo: 85000 });
listaCola.agregarAlFinal({ fecha: "15/03", motivo: "Control de peso", costo: 40000 });
listaCola.agregarAlFinal({ fecha: "20/05", motivo: "Limpieza dental", costo: 150000 });

const resCola = listaCola.eliminar((a) => a.motivo === "Limpieza dental");

verificar(
  "4. Eliminar la cola",
  resCola?.motivo === "Limpieza dental" &&
    listaCola.cabeza?.dato.motivo === "Vacunacion" &&
    listaCola.cola?.dato.motivo === "Control de peso" &&
    listaCola.cola?.siguiente === null &&
    listaCola.obtenerTamanio() === 2,
  `cabeza: ${listaCola.cabeza?.dato.motivo}, nueva cola: ${listaCola.cola?.dato.motivo}, tamanio: ${listaCola.obtenerTamanio()}`
);

const resInexistente = listaCola.eliminar((a) => a.motivo === "Cirugia");

verificar(
  "5. Eliminar algo que no existe",
  resInexistente === null &&
    listaCola.cabeza?.dato.motivo === "Vacunacion" &&
    listaCola.cola?.dato.motivo === "Control de peso" &&
    listaCola.obtenerTamanio() === 2,
  `retorno: ${resInexistente}, orden intacto: ${JSON.stringify(listaCola.aArreglo().map((a) => a.motivo))}`
);
const insertadoEnCola = listaCola.insertarDespuesDe(
  (a) => a.motivo === "Control de peso",
  { fecha: "10/06", motivo: "Revision general", costo: 50000 }
);

verificar(
  "6. Insertar después de la cola",
  insertadoEnCola === true &&
    listaCola.cabeza?.dato.motivo === "Vacunacion" &&
    listaCola.cola?.dato.motivo === "Revision general" &&
    listaCola.cola?.siguiente === null &&
    listaCola.obtenerTamanio() === 3,
  `nueva cola: ${listaCola.cola?.dato.motivo}, tamanio: ${listaCola.obtenerTamanio()}, arreglo: ${JSON.stringify(listaCola.aArreglo().map((a) => a.motivo))}`
);