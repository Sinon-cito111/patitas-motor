const Recepcion = require("./Recepcion");
const RegistroClinico = require("./RegistroClinico");
const Editor = require("./Editor");

const recepcion = new Recepcion();
const registro = new RegistroClinico();
const editor = new Editor(registro);

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

      editor.agregar(siguiente.mascota, {
        fecha: "2026-11-28",
        horaInicio,
        horaFin,
        tipo: siguiente.tipo,
        motivo: siguiente.motivo
      });

      console.log(
        `  --> [${horaInicio} - ${horaFin}] ENTRA A CONSULTORIO: ${siguiente.mascota.padEnd(6)} (${siguiente.tipo}) | ` +
        `Llegó: ${formatearHora(siguiente.minutoLlegada)} | Espera: ${minutosEspera} min | [Historial registrado]`
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

console.log("\n=== CORRECCIÓN DE ERROR POR LA RECEPCIONISTA (EDITOR) ===");

editor.agregar("Luna", {
  fecha: "2026-11-28",
  horaInicio: "10:25",
  horaFin: "10:40",
  tipo: "General",
  motivo: "Baño medicado"
});

console.log(
  "Error detectado -> Historial de Luna:",
  registro.obtenerHistorial("Luna").aArreglo().map((a) => a.motivo)
);

const revertida = editor.deshacer();
console.log(
  `Deshacer (${revertida.tipo}) -> Se quitó "${revertida.atencion.motivo}" de ${revertida.mascota}`
);

editor.agregar("Toby", {
  fecha: "2026-11-28",
  horaInicio: "10:25",
  horaFin: "10:40",
  tipo: "General",
  motivo: "Baño medicado"
});

console.log(
  "Historial de Luna restaurado:",
  registro.obtenerHistorial("Luna").aArreglo().map((a) => a.motivo)
);
console.log(
  "Historial de Toby actualizado:",
  registro.obtenerHistorial("Toby").aArreglo().map((a) => a.motivo)
);

console.log("\n=== HISTORIALES CLÍNICOS REGISTRADOS (PRODUCCIÓN) ===");
for (const mascota of registro.obtenerMascotas()) {
  const atenciones = registro.obtenerHistorial(mascota).aArreglo();
  const detalle = atenciones
    .map((a) => `[${a.horaInicio}-${a.horaFin}] ${a.motivo} (${a.tipo})`)
    .join(" -> ");
  console.log(`• ${mascota.padEnd(6)}: ${detalle}`);
}