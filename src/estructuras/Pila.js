class Pila {
  constructor() {
    this._items = [];
  }

  apilar(dato) {
    this._items.push(dato);
  }

  desapilar() {
    if (this.estaVacia()) {
      return null;
    }

    return this._items.pop();
  }

  verTope() {
    if (this.estaVacia()) {
      return null;
    }

    return this._items[this._items.length - 1];
  }

  estaVacia() {
    return this._items.length === 0;
  }

  tamanio() {
    return this._items.length;
  }
}

module.exports = Pila;