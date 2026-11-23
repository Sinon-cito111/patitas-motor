const { performance } = require('perf_hooks');
const Cola = require("../src/Cola");

const N = 100000;

const turnosPueba = Array.from({length: N}, (_, i) => ({
    mascota: `Mascota${i + 1}`,
    tutor: `Tutor${i + 1}`,
    horaLlegada: `10:${(i % 60).toString().padStart(2, '0')}`,
    motivo: "Consulta general"
}));

const warmup = new Cola();
for (let i = 0; i < 500; i++) {
    warmup.encolar(turnosPueba[i]);
}
while (!warmup.estaVacia()) warmup.desencolar();

const colaNodos = new Cola();

const t0EncNodos = performance.now();
for (let i = 0; i < N; i++) {
    colaNodos.encolar(turnosPueba[i]);
}
const msEncNodos = performance.now() - t0EncNodos;

const t0DesNodos = performance.now();
while (!colaNodos.estaVacia()) {
    colaNodos.desencolar();
}
const msDesNodos = performance.now() - t0DesNodos;

const colaArreglo = [];

const t0EncArr = performance.now();
for (let i = 0; i < N; i++) {
    colaArreglo.push(turnosPueba[i]);
}
const msEncArr = performance.now() - t0EncArr;

const t0DesArr = performance.now();
while (colaArreglo.length > 0) {
    colaArreglo.shift();
}
const msDesArr = performance.now() - t0DesArr;

console.log(`=== BENCHMARK SALA DE ESPERA (${N.toLocaleString("es-CO")} TURNOS) ===`);
console.table([
{
Estructura: "Cola con Nodos",
    "Encolar (ms)": msEncNodos.toFixed(2),
    "Desencolar (ms)": msDesNodos.toFixed(2),
    "Total (ms)": (msEncNodos + msDesNodos).toFixed(2)
},
{
    Estructura: "Arreglo (push + shift)",
    "Encolar (ms)": msEncArr.toFixed(2),
    "Desencolar (ms)": msDesArr.toFixed(2),
    "Total (ms)": (msEncArr + msDesArr).toFixed(2)
  }
]);

console.log(
  `Diferencia al desencolar: la Cola con nodos fue ${(msDesArr / msDesNodos).toFixed(1)}x más rápida.`
);