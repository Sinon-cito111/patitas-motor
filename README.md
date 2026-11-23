# Patitas — Motor de Historiales Clínicos Veterinarios (`v0.2`)

Motor de gestión clínica desarrollado en **Node.js** para digitalizar y consultar los historiales médicos de los pacientes de la veterinaria **Patitas** (Lola, Toby, Luna, Max, Simón, Kira, Nala, Rocky y nuevos pacientes), garantizando inserciones, búsquedas y correcciones seguras sin fragmentar ni "cortar" la secuencia cronológica de atenciones.

---

## Funcionalidades principales

* **Recepción con atención por prioridades (`Recepcion` + `Cola` FIFO):** Gestiona por separado las filas de espera de **urgencias** y **turnos generales**, dando prioridad a las urgencias y respetando el orden de llegada dentro de cada fila, con validación segura cuando la sala está vacía.
* **Historial clínico cronológico (`RegistroClinico` + `ListaEnlazada` / `Nodo`):** Mantiene la secuencia ordenada de consultas y procedimientos de cada mascota de forma desacoplada y sin perder el historial previo.
* **Edición con deshacer y rehacer (`Editor` + `Pila` LIFO):** Registra cambios en el historial mediante dos pilas (`pilaDeshacer` y `pilaRehacer`) en tiempo $O(1)$ por operación, limpiando `pilaRehacer` ante una nueva acción y permitiendo revertir errores de digitación o reasignar atenciones a la mascota correcta.
* **Simulación integral de jornada (`src/simulacion.js`):** Simula la llegada de pacientes, la atención en consultorio respetando urgencias, el registro automático de cada atención terminada a través del editor, la corrección de un error de recepcionista con `deshacer()` y el reporte final con tiempos de espera e historiales actualizados.

---

## Cómo ejecutar el proyecto

No requiere dependencias externas ni instalación de paquetes (`npm install` no es necesario); funciona de forma nativa con **Node.js**.

1. Abre una terminal en la carpeta raíz del proyecto (`patitas-motor`).
2. Ejecuta la simulación integral de la mañana del sábado (prioridades, registro vía editor, corrección de error y reporte final):

```bash
node src/simulacion.js