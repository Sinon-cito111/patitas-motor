const Cola = require("../src/Cola");

    const salaEspera = new Cola();

console.log("==================================================");
console.log("   PRUEBA DE SALA DE ESPERA (COLA FIFO) - PATITAS");
console.log("==================================================\n");

const turnos = [
    {mascota: "Toby", tutor: "Camilo", horaLlegada: "09:00", motivo: "Vacunación"},
    {mascota: "Luna", tutor: "Sofía", horaLlegada: "09:25", motivo: "Consulta general"},
    {mascota: "Max", tutor: "Andrés", horaLlegada: "09:30", motivo: "Desparasitación"},
    {mascota: "Mia", tutor: "Valentina", horaLlegada: "09:50", motivo: "Control de peso"},
    {mascota: "Rocky", tutor: "Diego", horaLlegada: "10:30", motivo: "Limpieza dental"},
];

for(const turno of turnos) {
    salaEspera.encolar(turno);
    console.log(`Se ha agregado a la sala de espera: ${turno.mascota} (Tutor: ${turno.tutor}, Hora: ${turno.horaLlegada}, Motivo: ${turno.motivo})`);
}

console.log("\n--- Revisión de recepción (verFrente) ---");
const siguiente = salaEspera.verFrente();
console.log("Siguiente paciente en turno:", siguiente.mascota, "| Tutor:", siguiente.tutor);
console.log("¿Sigue en la fila? Tamaño actual:", salaEspera.tamanio());

console.log("\n--- Llamado a consultorio (desencolar) ---");
while (!salaEspera.estaVacia()) {
  const atendido = salaEspera.desencolar();
  const proximo = salaEspera.verFrente();
  console.log(
    `Atendiendo a: ${atendido.mascota} (llegó ${atendido.horaLlegada} - ${atendido.motivo}) | ` +
    `Quedan: ${salaEspera.tamanio()} | Siguiente: ${proximo ? proximo.mascota : "Ninguno"}`
  );
}

console.log("\n--- Verificación de sala vacía ---");
console.log("¿Está vacía?:", salaEspera.estaVacia()); 
console.log("frente:", salaEspera.frente); 
console.log("final:", salaEspera.final); 
console.log("desencolar() en vacía:", salaEspera.desencolar());