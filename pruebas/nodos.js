const Nodo = require('../src/Nodo');

const atencion1 = new Nodo({
    fecha: "02/02",
    motivo: "Vacunacion",
    veterinario: "Dra. Rios",
    costo: 85000
})

const atencion2 = new Nodo({
    fecha: "15/03",
    motivo: "control de peso",
    veterinario: "Dr. Gomez",
    costo: 40000
})

const atencion3 = new Nodo({
    fecha: "20/05",
    motivo: "limpieza dental",
    veterinario: "Dra. Rios",
    costo: 150000
})
atencion1.siguiente = atencion2;
atencion2.siguiente = atencion3;

const cabeza = atencion1;

console.log("\n===Historial de atenciones===\n");
let actual = cabeza;
while (actual !== null) {
    console.log(
`Fecha: ${actual.dato.fecha}, Motivo: ${actual.dato.motivo}, Veterinario: ${actual.dato.veterinario}, Costo: ${actual.dato.costo}`
);
    actual = actual.siguiente;
}

let totalCosto = 0;
actual = cabeza;
while (actual !== null) {
    totalCosto += actual.dato.costo;
    actual = actual.siguiente;
}

console.log(`\nEl costo total de las atenciones es: ${totalCosto}`);
console.log("cabeza", cabeza);
    