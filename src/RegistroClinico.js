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

  obtenerMascotas() {
    return Array.from(this.historiales.keys());
  }
}

module.exports = RegistroClinico;