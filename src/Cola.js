const Nodo = require('./Nodo');
class Cola {
    constructor() {
        this.frente = null;
        this.final = null;
        this._tamanio = 0;
    }

    encolar(dato) {
        const nuevoNodo = new Nodo(dato);
        if (this.estaVacia()) {
            this.frente = nuevoNodo;
            this.final = nuevoNodo;
        } else {
            this.final.siguiente = nuevoNodo;
            this.final = nuevoNodo;
        }
        this._tamanio++;
    }
    
    desencolar() {
        if (this.estaVacia()) {
            return null;
        }
        const datoAtendido = this.frente.dato;
        this.frente = this.frente.siguiente;
        
        if (this.frente === null) {
            this.final = null;
        }
        this._tamanio--;
        return datoAtendido;
    }

    verFrente() {
        return this.frente ? this.frente.dato : null;
    }

    estaVacia() {
        return this._tamanio === 0;
    }

    tamanio() {
        return this._tamanio;
    }
}
module.exports = Cola;