const assert = require("assert");
const RegistroClinico = require("../src/RegistroClinico");
const Editor = require("../src/Editor");

const registro = new RegistroClinico();
const editor = new Editor(registro);

const atencionA = { id: "A", motivo: "Vacuna rabia" };
const atencionB = { id: "B", motivo: "Control general" };
const atencionC = { id: "C", motivo: "Desparasitación" };

function obtenerIds() {
  const historial = registro.obtenerHistorial("Luna");
  return historial ? historial.aArreglo().map((a) => a.id) : [];
}

function verificarPaso(paso, descripcion, esperado, retorno = undefined) {
  const actual = obtenerIds();
  assert.deepStrictEqual(
    actual,
    esperado,
    `Error en Paso ${paso} (${descripcion}): se esperaba ${JSON.stringify(esperado)}, pero se obtuvo ${JSON.stringify(actual)}`
  );
  console.log(
    `Paso ${paso} OK | ${descripcion.padEnd(12)} -> Historial: [${actual.join(", ")}]` +
      (retorno !== undefined ? ` | Retorno: ${retorno}` : "")
  );
}

editor.agregar("Luna", atencionA);
verificarPaso(1, "agregar A", ["A"]);

editor.agregar("Luna", atencionB);
verificarPaso(2, "agregar B", ["A", "B"]);

editor.eliminar("Luna", (a) => a.id === "A");
verificarPaso(3, "eliminar A", ["B"]);

editor.deshacer();
verificarPaso(4, "deshacer", ["B", "A"]);

editor.deshacer();
verificarPaso(5, "deshacer", ["A"]);

editor.rehacer();
verificarPaso(6, "rehacer", ["A", "B"]);

editor.agregar("Luna", atencionC);
verificarPaso(7, "agregar C", ["A", "B", "C"]);
assert.strictEqual(editor.pilaRehacer.estaVacia(), true, "pilaRehacer debería estar vacía tras agregar C");

const res8 = editor.rehacer();
assert.strictEqual(res8, null, "El último rehacer debería devolver null");
verificarPaso(8, "rehacer", ["A", "B", "C"], res8);

console.log("\nTodas las verificaciones pasaron correctamente.");