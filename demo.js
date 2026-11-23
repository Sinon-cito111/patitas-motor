const catalogo = require("./src/dominio/catalogo");
const {
  contarServicios,
  listarCatalogo,
  profundidad,
  buscarServicio,
  rutaDeServicio,
  precioPaquete,
  serviciosEnRango
} = require("./src/dominio/recorridoCatalogo");
const ListaEnlazada = require("./src/estructuras/ListaEnlazada");

function separador(titulo) {
  console.log("\n" + "=".repeat(72));
  console.log(titulo);
  console.log("=".repeat(72));
}

function formatearCOP(valor) {
  if (typeof valor !== "number" || Number.isNaN(valor)) {
    return "Sin precio definido";
  }
  return `$${valor.toLocaleString("es-CO")}`;
}

function minutosAHora(totalMinutos) {
  const horas = Math.floor(totalMinutos / 60);
  const mins = String(totalMinutos % 60).padStart(2, "0");
  return `${horas}:${mins}`;
}

function horaAMinutos(horaStr) {
  const [h, m] = horaStr.split(":").map(Number);
  return h * 60 + m;
}
class GestorRecepcion {
  constructor() {
    this.colaUrgencias = [];
    this.colaGenerales = [];
    this.atendidos = [];
    this.pilaDeshacer = [];
    this.pilaRehacer = [];
    this.relojMinutos = 8 * 60; // 8:00 AM
  }

  registrarLlegada(paciente, guardarEnHistorial = true) {
    if (guardarEnHistorial) {
      this.pilaDeshacer.push({
        tipo: "LLEGADA",
        paciente: { ...paciente }
      });
      this.pilaRehacer = [];
    }

    if (paciente.tipo.toLowerCase() === "urgencia") {
      this.colaUrgencias.push(paciente);
    } else {
      this.colaGenerales.push(paciente);
    }
  }

  atenderSiguiente(guardarEnHistorial = true) {
    let siguiente = null;
    if (this.colaUrgencias.length > 0) {
      siguiente = this.colaUrgencias.shift();
    } else if (this.colaGenerales.length > 0) {
      siguiente = this.colaGenerales.shift();
    }

    if (!siguiente) {
      return null;
    }

    const inicioAtencion = Math.max(this.relojMinutos, horaAMinutos(siguiente.horaLlegada));
    const finAtencion = inicioAtencion + 20;
    this.relojMinutos = finAtencion;

    const registroAtencion = {
      ...siguiente,
      horaInicio: minutosAHora(inicioAtencion),
      horaFin: minutosAHora(finAtencion)
    };

    this.atendidos.push(registroAtencion);

    if (guardarEnHistorial) {
      this.pilaDeshacer.push({
        tipo: "ATENCION",
        registro: registroAtencion,
        relojAnterior: inicioAtencion
      });
      this.pilaRehacer = [];
    }

    return registroAtencion;
  }

  deshacer() {
    const accion = this.pilaDeshacer.pop();
    if (!accion) {
      return null;
    }

    if (accion.tipo === "LLEGADA") {
      const lista =
        accion.paciente.tipo.toLowerCase() === "urgencia"
          ? this.colaUrgencias
          : this.colaGenerales;
      const idx = lista.findIndex(
        (p) => p.mascota === accion.paciente.mascota && p.horaLlegada === accion.paciente.horaLlegada
      );
      if (idx !== -1) {
        lista.splice(idx, 1);
      }
    } else if (accion.tipo === "ATENCION") {
      this.atendidos.pop();
      this.relojMinutos = accion.relojAnterior;
      const pacienteOriginal = {
        horaLlegada: accion.registro.horaLlegada,
        mascota: accion.registro.mascota,
        tipo: accion.registro.tipo,
        motivo: accion.registro.motivo
      };
      if (pacienteOriginal.tipo.toLowerCase() === "urgencia") {
        this.colaUrgencias.unshift(pacienteOriginal);
      } else {
        this.colaGenerales.unshift(pacienteOriginal);
      }
    }

    this.pilaRehacer.push(accion);
    return accion;
  }

  rehacer() {
    const accion = this.pilaRehacer.pop();
    if (!accion) {
      return null;
    }

    if (accion.tipo === "LLEGADA") {
      this.registrarLlegada(accion.paciente, false);
    } else if (accion.tipo === "ATENCION") {
      this.atenderSiguiente(false);
    }

    this.pilaDeshacer.push(accion);
    return accion;
  }
}


console.log("\n************************************************************************");
console.log("           CLÍNICA VETERINARIA PATITAS — DEMOSTRACIÓN DEL MOTOR");
console.log("************************************************************************");

separador("1. CATÁLOGO DE SERVICIOS Y ESTRUCTURA JERÁRQUICA");

listarCatalogo(catalogo, 0);
console.log("\nResumen estructural del árbol de servicios:");
console.log(`- Total de servicios disponibles: ${contarServicios(catalogo)}`);
console.log(`- Profundidad máxima de categorías: ${profundidad(catalogo)} niveles`);

const rangoEjemplo = serviciosEnRango(catalogo, 50000, 130000);
console.log(
  `- Servicios entre $50.000 y $130.000 (${rangoEjemplo.length}): ` +
    rangoEjemplo.map((s) => `${s.nombre} (${formatearCOP(s.precio)})`).join(", ")
);

separador("2. SIMULACIÓN DE ATENCIÓN EN CONSULTORIO (URGENCIA > GENERAL)");

const llegadasSabado = [
  { horaLlegada: "8:00", mascota: "Toby", tipo: "General", motivo: "Control de vacunas" },
  { horaLlegada: "8:05", mascota: "Max", tipo: "General", motivo: "Revisión de piel" },
  { horaLlegada: "8:10", mascota: "Luna", tipo: "Urgencia", motivo: "Intoxicación" },
  { horaLlegada: "8:20", mascota: "Simón", tipo: "General", motivo: "Corte de uñas" },
  { horaLlegada: "8:25", mascota: "Kira", tipo: "Urgencia", motivo: "Herida en pata" },
  { horaLlegada: "8:40", mascota: "Nala", tipo: "General", motivo: "Desparasitación" },
  { horaLlegada: "9:00", mascota: "Rocky", tipo: "Urgencia", motivo: "Dificultad para respirar" }
];

const recepcion = new GestorRecepcion();
console.log("Política: Urgencias tienen prioridad sobre General; FIFO dentro de cada grupo (20 min/consulta).\n");

let indiceLlegada = 0;
while (
  indiceLlegada < llegadasSabado.length ||
  recepcion.colaUrgencias.length > 0 ||
  recepcion.colaGenerales.length > 0
) {
  while (
    indiceLlegada < llegadasSabado.length &&
    horaAMinutos(llegadasSabado[indiceLlegada].horaLlegada) <= recepcion.relojMinutos
  ) {
    recepcion.registrarLlegada(llegadasSabado[indiceLlegada]);
    indiceLlegada++;
  }

  if (recepcion.colaUrgencias.length === 0 && recepcion.colaGenerales.length === 0 && indiceLlegada < llegadasSabado.length) {
    recepcion.relojMinutos = horaAMinutos(llegadasSabado[indiceLlegada].horaLlegada);
    continue;
  }

  recepcion.atenderSiguiente();
}

console.table(
  recepcion.atendidos.map((a, idx) => ({
    Orden: idx + 1,
    Llegada: a.horaLlegada,
    Inicio: a.horaInicio,
    Fin: a.horaFin,
    Mascota: a.mascota,
    Tipo: a.tipo,
    Motivo: a.motivo
  }))
);

separador("3. CORRECCIÓN OPERATIVA CON DESHACER Y REHACER");

const demoUndo = new GestorRecepcion();
demoUndo.registrarLlegada({ horaLlegada: "10:00", mascota: "Coco", tipo: "General", motivo: "Chequeo general" });
demoUndo.registrarLlegada({ horaLlegada: "10:05", mascota: "Bruno", tipo: "Urgencia", motivo: "Ingesta de objeto" });

console.log("Estado inicial en espera -> Urgencias:", demoUndo.colaUrgencias.map((p) => p.mascota), "| Generales:", demoUndo.colaGenerales.map((p) => p.mascota));

const atendido1 = demoUndo.atenderSiguiente();
console.log(`1) Se atiende al siguiente paciente: ${atendido1.mascota} (${atendido1.tipo} - ${atendido1.motivo})`);

const accionDeshecha = demoUndo.deshacer();
console.log(`2) Error detectado -> DESHACER (${accionDeshecha.tipo}): ${atendido1.mascota} regresa al frente de su cola.`);
console.log("   Estado tras deshacer -> Urgencias:", demoUndo.colaUrgencias.map((p) => p.mascota), "| Atendidos:", demoUndo.atendidos.length);

const accionRehecha = demoUndo.rehacer();
console.log(`3) Confirmación médica -> REHACER (${accionRehecha.tipo}): se vuelve a registrar la atención de ${atendido1.mascota}.`);
console.log("   Estado tras rehacer -> Urgencias:", demoUndo.colaUrgencias.map((p) => p.mascota), "| Atendidos:", demoUndo.atendidos.length);

separador("4. HISTORIALES CLÍNICOS FINALES (LOLA, TOBY Y MÍA)");

const datosHistoriales = {
  "Lola (gata)": [
    { fecha: "02/02", motivo: "Vacunación anual", veterinario: "Dra. Ríos", costo: 85000 },
    { fecha: "15/03", motivo: "Control de peso", veterinario: "Dr. Gómez", costo: 40000 },
    { fecha: "20/05", motivo: "Limpieza dental", veterinario: "Dra. Ríos", costo: 150000 }
  ],
  "Toby (perro)": [
    { fecha: "10/01", motivo: "Consulta por cojera", veterinario: "Dr. Gómez", costo: 60000 },
    { fecha: "12/01", motivo: "Radiografía de pata", veterinario: "Dr. Gómez", costo: 120000 },
    { fecha: "05/04", motivo: "Vacunación anual", veterinario: "Dra. Ríos", costo: 85000 },
    { fecha: "Sábado", motivo: "Control de vacunas (Turno mañana)", veterinario: "Dra. Ríos", costo: 60000 }
  ],
  "Mía (gata)": [
    { fecha: "18/02", motivo: "Esterilización", veterinario: "Dra. Ríos", costo: 280000 },
    { fecha: "25/02", motivo: "Control posquirúrgico", veterinario: "Dra. Ríos", costo: 0 }
  ]
};

for (const [paciente, registros] of Object.entries(datosHistoriales)) {
  const lista = new ListaEnlazada();
  for (const reg of registros) {
    lista.agregarAlFinal(reg);
  }

  let totalInvertido = 0;
  lista.recorrer((dato) => {
    if (typeof dato.costo === "number") {
      totalInvertido += dato.costo;
    }
  });

  console.log(`\nPaciente: ${paciente} | Total atenciones: ${lista.obtenerTamanio()} | Total acumulado: ${formatearCOP(totalInvertido)}`);
  lista.recorrer((dato) => {
    console.log(`   - [${dato.fecha}] ${dato.motivo} | ${dato.veterinario} | ${formatearCOP(dato.costo)}`);
  });
}

separador("5. BÚSQUEDA DE SERVICIO, RUTA JERÁRQUICA Y PRECIO DE PAQUETE");

const servicioBuscado = "Gata";
const encontrado = buscarServicio(catalogo, servicioBuscado);
const ruta = rutaDeServicio(catalogo, servicioBuscado);

console.log(`Búsqueda del servicio "${servicioBuscado}":`);
console.log(`- Resultado: ${encontrado ? `${encontrado.nombre} (${formatearCOP(encontrado.precio)})` : "No encontrado"}`);
console.log(`- Ruta en catálogo: ${ruta ? ruta.join(" > ") : "Sin ruta"}`);

const categoriaPaquete = catalogo.subcategorias[1]; 
const valorPaquete = precioPaquete(categoriaPaquete);
console.log(`\nCotización de paquete completo "${categoriaPaquete.nombre}" (10% descuento único):`);
console.log(`- Servicios incluidos en la rama: ${contarServicios(categoriaPaquete)}`);
console.log(`- Precio final del paquete: ${formatearCOP(valorPaquete)}`);

console.log("\n" + "=".repeat(72));
console.log("FIN DE LA DEMOSTRACIÓN — MOTOR PATITAS LISTO PARA OPERACIÓN");
console.log("=".repeat(72) + "\n");