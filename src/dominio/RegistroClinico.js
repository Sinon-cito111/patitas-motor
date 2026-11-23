const ListaEnlazada = require("./ListaEnlazada");

class RegistroClinico {
  constructor() {
    this.historiales = new Map();
  }

  registrarAtencion(mascota, atencion) {
    if (!this.historiales.has(mascota)) {
      this.historiales.set(mascota, new ListaEnlazada());
    }

    const historial = this.historiales.get(mascota);
    historial.agregarAlFinal(atencion);
  }

  obtenerHistorial(mascota) {
    return this.historiales.get(mascota) || null;
  }

  eliminarAtencion(mascota, condicion) {
    const historial = this.historiales.get(mascota);
    if (!historial) {
      return [];
    }

    const eliminadas = [];
    let eliminada = historial.eliminar(condicion);

    while (eliminada !== null) {
      eliminadas.push(eliminada);
      eliminada = historial.eliminar(condicion);
    }

    return eliminadas;
  }

  obtenerMascotas() {
    return Array.from(this.historiales.keys());
  }
}

module.exports = RegistroClinico;