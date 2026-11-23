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

console.log("=== CATÁLOGO JERÁRQUICO PATITAS ===");
listarCatalogo(catalogo, 0);
console.log("\nTotal de servicios en el catálogo:", contarServicios(catalogo));
console.log("Niveles de profundidad del catálogo:", profundidad(catalogo));

module.exports = {
  contarServicios,
  listarCatalogo,
  profundidad
};