const RegistroClinico = require("./RegistroClinico");

const clinica = new RegistroClinico();

const datosTabla = [
    { mascota: "Lola", fecha: "02/02", motivo: "Vacunacion anual", veterinario: "Dra. Rios", costo: 85000 },
    { mascota: "Lola", fecha: "15/03", motivo: "Control de peso", veterinario: "Dr. Gomez", costo: 40000 },
    { mascota: "Lola", fecha: "20/05", motivo: "Limpieza dental", veterinario: "Dra. Rios", costo: 150000 },
    { mascota: "Toby", fecha: "10/01", motivo: "Consulta por cojera", veterinario: "Dr. Gomez", costo: 60000 },
    { mascota: "Toby", fecha: "12/01", motivo: "Radiografia pata", veterinario: "Dr. Gomez", costo: 120000 },
    { mascota: "Toby", fecha: "05/04", motivo: "Vacunacion anual", veterinario: "Dra. Rios", costo: 85000 },
    { mascota: "Mia", fecha: "18/02", motivo: "Esterilizacion", veterinario: "Dra. Rios", costo: 280000 },
    { mascota: "Mia", fecha: "25/02", motivo: "Control postquirurgico", veterinario: "Dra. Rios", costo: 0},
];
    
for (const registro of datosTabla) {
    clinica.registrarAtencion(registro.mascota, {
        fecha: registro.fecha,
        motivo: registro.motivo,
        veterinario: registro.veterinario,
        costo: registro.costo
    });
}   

console.log("==================================================");
console.log("      CLÍNICA VETERINARIA PATITAS - REPORTE");
console.log("==================================================");

for (const mascota of clinica.obtenerMascotas()) {
    const historial = clinica.obtenerHistorial(mascota);

    let totalGastado = 0;
    historial.recorrer((atencion) => {
        totalGastado += atencion.costo;
    });

    const ultimaVacunacion = historial.buscar((atencion) => atencion.motivo.toLowerCase().includes("vacunacion"));
    const textoVacunacion = ultimaVacunacion ? ultimaVacunacion.fecha : "No se ha registrado vacunación";
    
console.log(`\nPaciente: ${mascota}`);
  console.log(`Número de atenciones: ${historial.obtenerTamanio()}`);
  console.log(`Costo total: $${totalGastado.toLocaleString("es-CO")}`);
  console.log(`Última vacunación: ${textoVacunacion}`);
  console.table(historial.aArreglo());
}