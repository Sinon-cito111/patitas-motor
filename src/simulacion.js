const Recepcion = require("./Recepcion");
const recepcion = new Recepcion();

function formatearHora(minutosTotales) {
  const horas = Math.floor(minutosTotales / 60);
  const minutos = minutosTotales % 60;
  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

const turnosSabado = [
  { minutoLlegada: 480, hora: "8:00", mascota: "Toby", tipo: "General", motivo: "Control de vacunas" },
  { minutoLlegada: 485, hora: "8:05", mascota: "Max", tipo: "General", motivo: "Revisión de piel" },
  { minutoLlegada: 490, hora: "8:10", mascota: "Luna", tipo: "Urgencia", motivo: "Intoxicación" },
  { minutoLlegada: 500, hora: "8:20", mascota: "Simón", tipo: "General", motivo: "Corte de uñas" },
  { minutoLlegada: 505, hora: "8:25", mascota: "Kira", tipo: "Urgencia", motivo: "Herida en pata" },
  { minutoLlegada: 520, hora: "8:40", mascota: "Nala", tipo: "General", motivo: "Desparasitación" },
  { minutoLlegada: 540, hora: "9:00", mascota: "Rocky", tipo: "Urgencia", motivo: "Dificultad para respirar" }
];

let consultorioLibreEn = 480;
let atendidos = 0;

console.log("=========================================================");
console.log("   SIMULACIÓN DE RECEPCIÓN - MAÑANA DEL SÁBADO (PATITAS)");
console.log("=========================================================\n");

let esperaUrgencias = 0;
let cantidadUrgencias = 0;
let esperaGenerales = 0;
let cantidadGenerales = 0;

for (let minuto = 480; atendidos < turnosSabado.length; minuto++) {
  for (const turno of turnosSabado) {
    if (turno.minutoLlegada === minuto) {
      recepcion.registrarLlegada(turno);
      console.log(`[${formatearHora(minuto)}] Llega ${turno.mascota} (${turno.tipo} - ${turno.motivo})`);
    }
  }

if (minuto >= consultorioLibreEn) {
    const siguiente = recepcion.llamarSiguiente();

    if (siguiente !== null) {
      const minutosEspera = minuto - siguiente.minutoLlegada;
      if (siguiente.tipo.trim().toLowerCase() === "urgencia") {
  esperaUrgencias += minutosEspera;
  cantidadUrgencias++;
} else {
  esperaGenerales += minutosEspera;
  cantidadGenerales++;
}
      const horaInicio = formatearHora(minuto);
      const horaFin = formatearHora(minuto + 20);
      console.log(
        `  --> [${horaInicio} - ${horaFin}] ENTRA A CONSULTORIO: ${siguiente.mascota.padEnd(6)} (${siguiente.tipo}) | ` +
        `Llegó: ${formatearHora(siguiente.minutoLlegada)} | Espera: ${minutosEspera} min`
      );
      consultorioLibreEn = minuto + 20;
      atendidos++;
    }
  }
}
const promedioUrgencias = cantidadUrgencias > 0 ? esperaUrgencias / cantidadUrgencias : 0;
const promedioGenerales = cantidadGenerales > 0 ? esperaGenerales / cantidadGenerales : 0;

console.log("\n=== TIEMPO DE ESPERA PROMEDIO ===");
console.log(`Urgencias (${cantidadUrgencias} pacientes): ${promedioUrgencias.toFixed(2)} minutos`);
console.log(`Generales (${cantidadGenerales} pacientes): ${promedioGenerales.toFixed(2)} minutos`);