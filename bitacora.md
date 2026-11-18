##  Historial Clínico de Lola (`Patitas`)

### Diagrama de nodos y flechas (cadena intacta)

```text
  cabeza
    |
    v
+-----------------------------------+-----------+     +----------------------------------------+-----------+     +---------------------------------------+-----------+
|               dato                | siguiente | --> |                  dato                  | siguiente | --> |                 dato                  | siguiente | --> null
|-----------------------------------|           |     |----------------------------------------|           |     |---------------------------------------|           |
| fecha: "02/02"                    |           |     | fecha: "15/03"                         |           |     | fecha: "20/05"                        |           |
| motivo: "Vacunacion"              |           |     | motivo: "control de peso"              |           |     | motivo: "limpieza dental"             |           |
| veterinario: "Dra. Rios"          |           |     | veterinario: "Dr. Gomez"               |           |     | veterinario: "Dra. Rios"              |           |
| costo: 85000                      |           |     | costo: 40000                           |           |     | costo: 150000                         |           |
+-----------------------------------+-----------+     +----------------------------------------+-----------+     +---------------------------------------+-----------+
             (atencion1)                                                    (atencion2)                                                   (atencion3)

### Null al primer Nodo
Si tomo el primer nodo (atencion1) y cambio su flecha siguiente por null, se corta la cadena justo después del primer elemento. Como las flechas van en un solo sentido, los otros dos nodos (atencion2 y atencion3) quedan sueltos o desconectados de cabeza, así que se pierde el acceso al resto del historial.

---

## Cambios de referencias al insertar en la Lista Enlazada (`cabeza`, `cola` y `.siguiente`)

### 1. Agregar al final (`agregarAlFinal(NUEVO)`)

* **1A. Lista vacía (`cabeza = null`, `cola = null`):**
  * **Antes:** `cabeza -> null`, `cola -> null`
  * **Cambios:** `cabeza = NUEVO` y `cola = NUEVO` (`NUEVO.siguiente` queda en `null`).
  ```text
    cabeza       cola
      |           |
      v           v
  +-------+-----------+
  | NUEVO | siguiente | ---> null
  +-------+-----------+

cabeza                       cola
    |                           |
    v                           v
+----+-----------+     +-------+-----------+
| A1 | siguiente | --> | NUEVO | siguiente | ---> null
+----+-----------+     +-------+-----------+

cabeza                                         cola
    |                                             |
    v                                             v
+----+-----------+     +----+-----------+     +-------+-----------+
| A1 | siguiente | --> | A2 | siguiente | --> | NUEVO | siguiente | ---> null
+----+-----------+     +----+-----------+     +-------+-----------+

cabeza       cola
    |           |
    v           v
+-------+-----------+
| NUEVO | siguiente | ---> null
+-------+-----------+

cabeza                       cola
    |                           |
    v                           v
+-------+-----------+     +----+-----------+
| NUEVO | siguiente | --> | A1 | siguiente | ---> null
+-------+-----------+     +----+-----------+

cabeza                                         cola
    |                                             |
    v                                             v
+-------+-----------+     +----+-----------+     +----+-----------+
| NUEVO | siguiente | --> | A1 | siguiente | --> | A2 | siguiente | ---> null
+-------+-----------+     +----+-----------+     +----+-----------+


