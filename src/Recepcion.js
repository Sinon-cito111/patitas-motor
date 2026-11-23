const Cola = require('./Cola');

class Recepcion {
    constructor() {
        this.urgencia = new Cola();
        this.generales = new Cola();

    }
    
    registrarLlegada(turno) {
        const tipoNormalizado = turno.tipo.trim().toLowerCase();
        if (tipoNormalizado === 'urgencia') {
            this.urgencia.encolar(turno);
        } else { 
            this.generales.encolar(turno);
        }
    }
    llamarSiguiente() {
        if (!this.urgencia.estaVacia()) {
            return this.urgencia.desencolar();
        } else if (!this.generales.estaVacia()) {
            return this.generales.desencolar();
        } else {
            return null;
        }
    }
}

module.exports = Recepcion;