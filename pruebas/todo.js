const assert = require("assert");
const Nodo = require("../src/estructuras/Nodo");
const ListaEnlazada = require("../src/estructuras/ListaEnlazada");
const Cola = require("../src/estructuras/Cola");
const Pila = require("../src/estructuras/Pila");
const catalogo = require("../src/dominio/catalogo");
const {
  contarServicios,
  profundidad,
  buscarServicio,
  rutaDeServicio,
  precioPaquete,
  serviciosEnRango
} = require("../src/dominio/recorridoCatalogo");

let totalPruebas = 0;
let pruebasOk = 0;
let pruebasFalla = 0;

function verificar(descripcion, fnPrueba) {
  totalPruebas++;
  try {
    fnPrueba();
    pruebasOk++;
    console.log(`[OK]    ${descripcion}`);
  } catch (error) {
    pruebasFalla++;
    console.log(`[FALLA] ${descripcion} -> ${error.message}`);
  }
}

function seccion(titulo) {
  console.log(`\n=== ${titulo} ===`);
}

seccion("1. NODO");

verificar("Nodo - Caso normal: almacena dato y enlaza con el siguiente nodo", () => {
  const segundo = new Nodo({ motivo: "Control" });
  const primero = new Nodo({ motivo: "Vacuna" }, segundo);

  assert.strictEqual(primero.dato.motivo, "Vacuna");
  assert.strictEqual(primero.siguiente, segundo);
  assert.strictEqual(primero.siguiente.dato.motivo, "Control");
});

verificar("Nodo - Caso borde: nodo aislado sin siguiente apunta a null", () => {
  const nodoUnico = new Nodo("Registro único");

  assert.strictEqual(nodoUnico.dato, "Registro único");
  assert.strictEqual(nodoUnico.siguiente, null);
});

seccion("2. LISTA ENLAZADA");

verificar("ListaEnlazada - Caso normal: inserción, tamaño, búsqueda y costo total (Lola y Mía)", () => {
  const historial = new ListaEnlazada();
  historial.agregarAlFinal({ fecha: "02/02", motivo: "Vacunación anual", costo: 85000 });
  historial.agregarAlFinal({ fecha: "18/02", motivo: "Esterilización", costo: 280000 });
  // Caso con costo $0 (ej. control posquirúrgico de Mía)
  historial.agregarAlFinal({ fecha: "25/02", motivo: "Control posquirúrgico", costo: 0 });

  assert.strictEqual(historial.obtenerTamanio(), 3);
  assert.strictEqual(historial.tamanioRecursivo(), 3);
  assert.strictEqual(historial.costoTotalRecursivo(), 365000);

  const encontrado = historial.buscar((r) => r.motivo === "Esterilización");
  const encontradoRec = historial.buscarRecursivo((r) => r.motivo === "Esterilización");
  assert.deepStrictEqual(encontrado, encontradoRec);
  assert.strictEqual(encontrado.costo, 280000);
});

verificar("ListaEnlazada - Caso borde: lista vacía y eliminación de único elemento", () => {
  const listaVacia = new ListaEnlazada();

  assert.strictEqual(listaVacia.estaVacia(), true);
  assert.strictEqual(listaVacia.obtenerTamanio(), 0);
  assert.strictEqual(listaVacia.tamanioRecursivo(), 0);
  assert.strictEqual(listaVacia.costoTotalRecursivo(), 0);
  assert.strictEqual(listaVacia.buscar(() => true), null);
  assert.strictEqual(listaVacia.eliminar(() => true), null);

  listaVacia.agregarAlInicio({ id: 1, costo: 50000 });
  assert.strictEqual(listaVacia.obtenerTamanio(), 1);
  const eliminado = listaVacia.eliminar((r) => r.id === 1);
  assert.strictEqual(eliminado.id, 1);
  assert.strictEqual(listaVacia.estaVacia(), true);
  assert.strictEqual(listaVacia.cabeza, null);
  assert.strictEqual(listaVacia.cola, null);
});

seccion("3. COLA");

verificar("Cola - Caso normal: respeta orden FIFO (primero en entrar, primero en salir)", () => {
  const cola = new Cola();
  const encolar = cola.encolar ? cola.encolar.bind(cola) : cola.enqueue.bind(cola);
  const desencolar = cola.desencolar ? cola.desencolar.bind(cola) : cola.dequeue.bind(cola);

  encolar("Luna - Intoxicación");
  encolar("Kira - Herida en pata");
  encolar("Rocky - Dificultad para respirar");

  assert.strictEqual(desencolar(), "Luna - Intoxicación");
  assert.strictEqual(desencolar(), "Kira - Herida en pata");
  assert.strictEqual(desencolar(), "Rocky - Dificultad para respirar");
});

verificar("Cola - Caso borde: desencolar o consultar en cola vacía no rompe el sistema", () => {
  const colaVacia = new Cola();
  const desencolar = colaVacia.desencolar
    ? colaVacia.desencolar.bind(colaVacia)
    : colaVacia.dequeue.bind(colaVacia);
  const verFrente = colaVacia.frente
    ? colaVacia.frente.bind(colaVacia)
    : colaVacia.peek
    ? colaVacia.peek.bind(colaVacia)
    : () => null;

  const extraido = desencolar();
  const frente = verFrente();

  assert.ok(extraido === null || extraido === undefined);
  assert.ok(frente === null || frente === undefined);
});

seccion("4. PILA");

verificar("Pila - Caso normal: respeta orden LIFO (último en entrar, primero en salir)", () => {
  const pila = new Pila();
  const apilar = pila.apilar ? pila.apilar.bind(pila) : pila.push.bind(pila);
  const desapilar = pila.desapilar ? pila.desapilar.bind(pila) : pila.pop.bind(pila);

  apilar("Acción 1: Llegada Toby");
  apilar("Acción 2: Llegada Luna");
  apilar("Acción 3: Atención Luna");

  assert.strictEqual(desapilar(), "Acción 3: Atención Luna");
  assert.strictEqual(desapilar(), "Acción 2: Llegada Luna");
  assert.strictEqual(desapilar(), "Acción 1: Llegada Toby");
});

verificar("Pila - Caso borde: desapilar o mirar tope en pila vacía devuelve null/undefined sin error", () => {
  const pilaVacia = new Pila();
  const desapilar = pilaVacia.desapilar
    ? pilaVacia.desapilar.bind(pilaVacia)
    : pilaVacia.pop.bind(pilaVacia);
  const verTope = pilaVacia.tope
    ? pilaVacia.tope.bind(pilaVacia)
    : pilaVacia.peek
    ? pilaVacia.peek.bind(pilaVacia)
    : () => null;

  const sacado = desapilar();
  const tope = verTope();

  assert.ok(sacado === null || sacado === undefined);
  assert.ok(tope === null || tope === undefined);
});

seccion("5. ÁRBOL N-ARIO (CATÁLOGO)");

verificar("Catálogo - Caso normal: conteo, profundidad, búsqueda, ruta y paquete con 10% dto.", () => {
  assert.strictEqual(contarServicios(catalogo), 10);
  assert.strictEqual(profundidad(catalogo), 3);

  const gata = buscarServicio(catalogo, "Gata");
  assert.strictEqual(gata.precio, 280000);

  const rutaGata = rutaDeServicio(catalogo, "Gata");
  assert.deepStrictEqual(rutaGata, ["Patitas", "Cirugías", "Esterilización", "Gata"]);

  const cirugias = catalogo.subcategorias.find((c) => c.nombre === "Cirugías");
  assert.strictEqual(precioPaquete(cirugias), 702000);
});

verificar("Catálogo - Caso borde: servicio inexistente, precio null (Oftalmología) y rango sin resultados", () => {
  assert.strictEqual(buscarServicio(catalogo, "Acupuntura"), null);
  assert.strictEqual(rutaDeServicio(catalogo, "Acupuntura"), null);

  const oftalmologia = buscarServicio(catalogo, "Oftalmología");
  assert.notStrictEqual(oftalmologia, null);
  assert.strictEqual(oftalmologia.precio, null);

  const sinCoincidencias = serviciosEnRango(catalogo, 900000, 1500000);
  assert.deepStrictEqual(sinCoincidencias, []);
});

console.log("\n========================================");
console.log(`RESUMEN PRUEBAS: ${pruebasOk}/${totalPruebas} OK | ${pruebasFalla} FALLA`);
console.log("========================================");

if (pruebasFalla > 0) {
  process.exitCode = 1;
}