const Pila = require("./Pila");

class Editor {
  constructor(registroClinico) {
    this.registro = registroClinico;
    this.pilaDeshacer = new Pila();
    this.pilaRehacer = new Pila();
  }

  agregar(mascota, atencion) {
    this.registro.registrarAtencion(mascota, atencion);

    this.pilaDeshacer.apilar({
      tipo: "AGREGAR",
      mascota,
      atencion
    });

    this.pilaRehacer = new Pila();
  }

  eliminar(mascota, condicion) {
    const eliminadas = this.registro.eliminarAtencion(mascota, condicion);

    if (eliminadas.length === 0) {
      return 0;
    }

    this.pilaDeshacer.apilar({
      tipo: "ELIMINAR",
      mascota,
      eliminadas
    });

    this.pilaRehacer = new Pila();

    return eliminadas.length;
  }

  deshacer() {
    if (this.pilaDeshacer.estaVacia()) {
      return null;
    }

    const accion = this.pilaDeshacer.desapilar();

    if (accion.tipo === "AGREGAR") {
      this.registro.eliminarAtencion(
        accion.mascota,
        (item) => item === accion.atencion
      );
    } else if (accion.tipo === "ELIMINAR") {
      for (const atencion of accion.eliminadas) {
        this.registro.registrarAtencion(accion.mascota, atencion);
      }
    }

    this.pilaRehacer.apilar(accion);
    return accion;
  }

  rehacer() {
    if (this.pilaRehacer.estaVacia()) {
      return null;
    }

    const accion = this.pilaRehacer.desapilar();

    if (accion.tipo === "AGREGAR") {
      this.registro.registrarAtencion(accion.mascota, accion.atencion);
    } else if (accion.tipo === "ELIMINAR") {
      this.registro.eliminarAtencion(accion.mascota, (item) =>
        accion.eliminadas.includes(item)
      );
    }

    this.pilaDeshacer.apilar(accion);
    return accion;
  }
}

module.exports = Editor;