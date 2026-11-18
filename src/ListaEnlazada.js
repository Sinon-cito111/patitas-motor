const Nodo = require("./Nodo");

class ListaEnlazada {
  constructor() {
    this.cabeza = null;
    this.cola = null;
    this.tamanio = 0;
  }

  agregarAlFinal(dato) {
    const nuevoNodo = new Nodo(dato);

    if (this.cabeza === null) {
      this.cabeza = nuevoNodo;
      this.cola = nuevoNodo;
    } else {
      this.cola.siguiente = nuevoNodo;
      this.cola = nuevoNodo;
    }

    this.tamanio++;
  }

  agregarAlInicio(dato) {
    const nuevoNodo = new Nodo(dato);

    if (this.cabeza === null) {
      this.cabeza = nuevoNodo;
      this.cola = nuevoNodo;
    } else {
      nuevoNodo.siguiente = this.cabeza;
      this.cabeza = nuevoNodo;
    }

    this.tamanio++;
  }

  recorrer(callback) {
    let actual = this.cabeza;

    while (actual !== null) {
      callback(actual.dato);
      actual = actual.siguiente;
    }
  }

  buscar(condicion) {
    let actual = this.cabeza;

    while (actual !== null) {
        if (condicion(actual.dato)) {
            return actual.dato;
        }
        actual = actual.siguiente;
    }
    return null;
  }
  aArreglo() {
    const resultado = [];

    this.recorrer((dato) => {
      resultado.push(dato);
    });

    return resultado;
  }
estaVacia() {
    return this.tamanio ===0;
}
obtenerTamanio() {
    return this.tamanio;
} 
  buscar(condicion) {
    let actual = this.cabeza;

    while (actual !== null) {
        if (condicion(actual.dato)) {
            return actual.dato;
        }
        actual = actual.siguiente;
    }
    return null;
  }

insertasDespuesDe(condicion, dato) {
    let actual = this.cabeza;

    while (actual !== null) {
        if (condicion(actual.dato)) {
            const nuevoNodo = new Nodo(dato);

            nuevoNodo.siguiente = actual.siguiente;
            actual.siguiente = nuevoNodo;
            
            if (actual === this.cola) {
                this.cola = nuevoNodo;
            }

            this.tamanio++;
            return true;
        }
        actual = actual.siguiente;
    }
    return false;
}

eliminar(condicion) {
    if (this.cabeza === null) {
        return null;
    }

    if (condicion(this.cabeza.dato)) {
        const eliminado = this.cabeza.dato;
        this.cabeza = this.cabeza.siguiente;

        if (this.cabeza === null) {
            this.cola = null;
        }
        
        this.tamanio--;
        return eliminado;
    }

    let anterior = this.cabeza;
    let actual = this.cabeza.siguiente;

    while (actual !== null) {
        if (condicion(actual.dato)) {
            const eliminado = actual.dato;

            anterior.siguiente = actual.siguiente;

            if (actual === this.cola) {
                this.cola = anterior;
            }
            
            this.tamanio--;
            return eliminado;
        }
        
    anterior = actual;
    actual = actual.siguiente;
    }
    return null;
}

}
module.exports = ListaEnlazada;