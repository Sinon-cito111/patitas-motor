class Nodo {
  constructor(dato, siguiente = null) {
    this.dato = dato;
    this.siguiente = siguiente;
  }
}

module.exports = Nodo;