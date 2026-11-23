const catalogo = require("./catalogo");

function contarServicios(categoria) {
  if (!categoria || typeof categoria !== "object") {
    return 0;
  }

  const serviciosPropios = Array.isArray(categoria.servicios)
    ? categoria.servicios.length
    : 0;

  const subcategorias = Array.isArray(categoria.subcategorias)
    ? categoria.subcategorias
    : [];

  let totalSubcategorias = 0;
  for (const sub of subcategorias) {
    totalSubcategorias += contarServicios(sub);
  }

  return serviciosPropios + totalSubcategorias;
}

function listarCatalogo(categoria, nivel = 0) {
  if (!categoria || typeof categoria !== "object") {
    return;
  }

  const sangriaCat = "  ".repeat(nivel);
  const sangriaSrv = "  ".repeat(nivel + 1);

  console.log(`${sangriaCat}[${categoria.nombre}]`);

  if (Array.isArray(categoria.servicios)) {
    for (const servicio of categoria.servicios) {
      const precioFormateado = `$${Number(servicio.precio).toLocaleString("es-CO")}`;
      console.log(`${sangriaSrv}- ${servicio.nombre}: ${precioFormateado}`);
    }
  }

  if (Array.isArray(categoria.subcategorias)) {
    for (const subcategoria of categoria.subcategorias) {
      listarCatalogo(subcategoria, nivel + 1);
    }
  }
}

function profundidad(categoria) {
  if (!categoria || typeof categoria !== "object") {
    return 0;
  }

  const subcategorias = Array.isArray(categoria.subcategorias)
    ? categoria.subcategorias
    : [];

  if (subcategorias.length === 0) {
    return 1;
  }

  let maxSubprofundidad = 0;
  for (const sub of subcategorias) {
    const profSub = profundidad(sub);
    if (profSub > maxSubprofundidad) {
      maxSubprofundidad = profSub;
    }
  }

  return 1 + maxSubprofundidad;
}

function buscarServicio(categoria, nombre) {
  if (!categoria || typeof categoria !== "object" || typeof nombre !== "string") {
    return null;
  }

  const objetivo = nombre.trim().toLowerCase();

  if (Array.isArray(categoria.servicios)) {
    for (const servicio of categoria.servicios) {
      if (
        typeof servicio.nombre === "string" &&
        servicio.nombre.trim().toLowerCase() === objetivo
      ) {
        return servicio;
      }
    }
  }

  if (Array.isArray(categoria.subcategorias)) {
    for (const subcategoria of categoria.subcategorias) {
      const encontrado = buscarServicio(subcategoria, nombre);
      if (encontrado !== null) {
        return encontrado;
      }
    }
  }

  return null;
}

function rutaDeServicio(categoria, nombre) {
  if (!categoria || typeof categoria !== "object" || typeof nombre !== "string") {
    return null;
  }

  const nombreActual = typeof categoria.nombre === "string" ? categoria.nombre : "";
  const objetivo = nombre.trim().toLowerCase();

  if (Array.isArray(categoria.servicios)) {
    for (const servicio of categoria.servicios) {
      if (
        typeof servicio.nombre === "string" &&
        servicio.nombre.trim().toLowerCase() === objetivo
      ) {
        return [nombreActual, servicio.nombre];
      }
    }
  }

  if (Array.isArray(categoria.subcategorias)) {
    for (const subcategoria of categoria.subcategorias) {
      const rutaHija = rutaDeServicio(subcategoria, nombre);
      if (rutaHija !== null) {
        return [nombreActual, ...rutaHija];
      }
    }
  }

  return null;
}

function sumarServiciosCategoria(categoria) {
  if (!categoria || typeof categoria !== "object") {
    return 0;
  }

  let total = 0;

  if (Array.isArray(categoria.servicios)) {
    for (const servicio of categoria.servicios) {
      if (typeof servicio.precio === "number" && !Number.isNaN(servicio.precio)) {
        total += servicio.precio;
      }
    }
  }

  if (Array.isArray(categoria.subcategorias)) {
    for (const subcategoria of categoria.subcategorias) {
      total += sumarServiciosCategoria(subcategoria);
    }
  }

  return total;
}

function precioPaquete(categoria) {
  const totalBruto = sumarServiciosCategoria(categoria);
  return totalBruto * 0.9;
}

function serviciosEnRango(categoria, min, max) {
  if (
    !categoria ||
    typeof categoria !== "object" ||
    typeof min !== "number" ||
    typeof max !== "number" ||
    Number.isNaN(min) ||
    Number.isNaN(max) ||
    min > max
  ) {
    return [];
  }

  const resultados = [];

  if (Array.isArray(categoria.servicios)) {
    for (const servicio of categoria.servicios) {
      if (
        typeof servicio.precio === "number" &&
        !Number.isNaN(servicio.precio) &&
        servicio.precio >= min &&
        servicio.precio <= max
      ) {
        resultados.push(servicio);
      }
    }
  }

  if (Array.isArray(categoria.subcategorias)) {
    for (const subcategoria of categoria.subcategorias) {
      resultados.push(...serviciosEnRango(subcategoria, min, max));
    }
  }

  return resultados;
}

console.log("=== CATÁLOGO JERÁRQUICO PATITAS ===");
listarCatalogo(catalogo, 0);
console.log("\nTotal de servicios en el catálogo:", contarServicios(catalogo));
console.log("Niveles de profundidad del catálogo:", profundidad(catalogo));
console.log("Buscar 'Gata':", buscarServicio(catalogo, "Gata"));
console.log("Buscar 'No existe':", buscarServicio(catalogo, "No existe"));
console.log("Ruta 'Gata':", rutaDeServicio(catalogo, "Gata"));
console.log("Ruta 'No existe':", rutaDeServicio(catalogo, "No existe"));
console.log("Paquete Cirugías (10% dto.):", precioPaquete(catalogo.subcategorias[1]));
console.log("Servicios entre $50.000 y $130.000:", serviciosEnRango(catalogo, 50000, 130000));

// --- AQUÍ VAN LAS PRUEBAS (JUSTO ANTES DE module.exports) ---
const servicioPrimerNivel = "Consulta general";
const servicioMasProfundo = "Oftalmología";
const servicioInexistente = "Acupuntura";

console.log("\n=== PRUEBAS: PRIMER NIVEL, MÁS PROFUNDO E INEXISTENTE ===");

for (const [etiqueta, nombreSrv] of [
  ["Primer nivel", servicioPrimerNivel],
  ["Nivel más profundo", servicioMasProfundo],
  ["No existe", servicioInexistente]
]) {
  console.log(`\n--- Caso: ${etiqueta} ("${nombreSrv}") ---`);
  console.log("buscarServicio:", buscarServicio(catalogo, nombreSrv));
  console.log("rutaDeServicio:", rutaDeServicio(catalogo, nombreSrv));
}

console.log("\n--- Otras funciones por nivel / rama ---");
console.log("contarServicios (Vacunas - 1er nivel):", contarServicios(catalogo.subcategorias[2]));
console.log("contarServicios (Especializada - profundo):", contarServicios(catalogo.subcategorias[0].subcategorias[0]));
console.log("contarServicios (No existe):", contarServicios(null));

console.log("profundidad (Vacunas - sin subcats):", profundidad(catalogo.subcategorias[2]));
console.log("profundidad (Consultas - con Especializada):", profundidad(catalogo.subcategorias[0]));
console.log("profundidad (No existe):", profundidad(null));

console.log("precioPaquete (Vacunas - 1er nivel):", precioPaquete(catalogo.subcategorias[2]));
console.log("precioPaquete (Especializada - profundo):", precioPaquete(catalogo.subcategorias[0].subcategorias[0]));
console.log("precioPaquete (No existe):", precioPaquete(null));

console.log("serviciosEnRango (en Vacunas, $40.000 - $90.000):", serviciosEnRango(catalogo.subcategorias[2], 40000, 90000));
console.log("serviciosEnRango (en Especializada, $0 - $150.000):", serviciosEnRango(catalogo.subcategorias[0].subcategorias[0], 0, 150000));
console.log("serviciosEnRango (en Vacunas sin coincidencias, $500.000 - $900.000):", serviciosEnRango(catalogo.subcategorias[2], 500000, 900000));

module.exports = {
  contarServicios,
  listarCatalogo,
  profundidad,
  buscarServicio,
  rutaDeServicio,
  precioPaquete,
  serviciosEnRango
};