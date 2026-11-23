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

### Tres casos
Caso A: Eliminar la cabeza (this.cabeza)
Antes:
cabeza ──► [ Vacunacion ] ──► [ Control peso ] ──► [ Limpieza ] ◄── cola
Despues:
[ Vacunacion ] (eliminado)
cabeza ──► [ Control peso ] ──► [ Limpieza ] ◄── cola
Que se hizo: Movi this.cabeza al segundo nodo (this.cabeza = this.cabeza.siguiente). (Nota: Si era el único nodo de la lista, this.cabeza queda en null, así que también ponemos this.cola = null).

Caso B: Eliminar un nodo intermedio
Antes:
cabeza ──► [ Vacunacion ] ──► [ Control peso ] ──► [ Limpieza ] ◄── cola
             (anterior)          (actual)
Despues:┌──────────────────────────────────┐
             │           [ Control peso ]       ▼
cabeza ──► [ Vacunacion ]  (eliminado)    [ Limpieza ] ◄── cola
Que se hizo:Hice que el nodo anterior se salte a actual apuntando directo al que seguía después: anterior.siguiente = actual.siguiente.

Caso C: Eliminar la cola (this.cola)
Antes:
cabeza ──► [ Vacunacion ] ──► [ Control peso ] ──► [ Limpieza ] ◄── cola
                                (anterior)          (actual)
Despues:
cabeza ──► [ Vacunacion ] ──► [ Control peso ] ──► null   [ Limpieza ] (eliminado)
                                    ▲
                                   cola
Que se hizo:1. anterior.siguiente = null; (corta la conexión hacia el último).
2. this.cola = anterior; (retrocede el letrero cola al penúltimo nodo).

---

## Complejidad algorítmica de `ListaEnlazada`

Sea $n$ el número de nodos (atenciones médicas) almacenados actualmente en la lista:

| Operación / Método | Complejidad Temporal | Complejidad Espacial (auxiliar) | Justificación |
| :--- | :--- | :--- | :--- |
| `agregarAlInicio(dato)` | **$O(1)$** | **$O(1)$** | Crea un nodo nuevo y ajusta directamente el puntero `this.cabeza` (y `this.cola` si estaba vacía) en un número fijo de pasos, sin importar el tamaño de la lista. |
| `agregarAlFinal(dato)` | **$O(1)$** | **$O(1)$** | Gracias a que mantenemos una referencia directa al último nodo (`this.cola`), engancha el nuevo nodo al final y actualiza `this.cola` sin tener que recorrer la cadena. |
| `estaVacia()` | **$O(1)$** | **$O(1)$** | Compara directamente `this.tamanio === 0` en una única operación. |
| `obtenerTamanio()` | **$O(1)$** | **$O(1)$** | Devuelve el contador entero `this.tamanio` almacenado en la instancia sin contar nodos uno por uno. |
| `recorrer(callback)` | **$O(n)$** | **$O(1)$** | Visita obligatoriamente cada uno de los $n$ nodos desde `this.cabeza` hasta `null` usando un único puntero `actual`. |
| `aArreglo()` | **$O(n)$** | **$O(n)$** | Recorre los $n$ nodos de la lista y crea un arreglo nuevo en memoria con las $n$ referencias a los datos. |
| `buscar(condicion)` | **$O(n)$** *(mejor caso $O(1)$)* | **$O(1)$** | En el mejor caso encuentra el dato en `this.cabeza` ($O(1)$); en el peor caso (el elemento está al final o no existe) debe revisar los $n$ nodos. |
| `insertarDespuesDe(condicion, dato)` | **$O(n)$** *(mejor caso $O(1)$)* | **$O(1)$** | Primero debe buscar el nodo que cumple `condicion` recorriendo desde `cabeza` (hasta $n$ pasos en el peor caso); una vez encontrado, reconectar las referencias toma $O(1)$. |
| `eliminar(condicion)` | **$O(n)$** *(mejor caso $O(1)$)* | **$O(1)$** | Si el nodo a eliminar es `this.cabeza`, toma $O(1)$; si está en medio o al final (`this.cola`), requiere avanzar con los punteros `anterior` y `actual` hasta llegar a él ($O(n)$). |

---

### ¿Por qué eliminar la cola en una lista simplemente enlazada requiere recorrerla ($O(n)$)?

Aunque nuestra `ListaEnlazada` tiene guardado un puntero directo `this.cola` que señala al último nodo, **eliminar ese último nodo sigue tomando tiempo lineal $O(n)$** por una razón estructural:

1. **Los enlaces son de una sola dirección (unidireccionales):** Cada `Nodo` únicamente guarda una referencia hacia adelante (`nodo.siguiente`), pero **no sabe quién está detrás de él** (no existe `nodo.anterior`).
2. **Necesitamos desconectar el penúltimo nodo:** Para eliminar `this.cola` sin dejar la lista cortada ni apuntando a un nodo borrado, tenemos que hacer dos cosas:
   * Cambiar el `.siguiente` del **penúltimo nodo** a `null` (`anterior.siguiente = null`).
   * Mover el puntero `this.cola` para que ahora apunte a ese **penúltimo nodo** (`this.cola = anterior`).
3. **Imposibilidad de retroceder:** Estando parados en `this.cola`, no podemos dar "un paso hacia atrás" para llegar al penúltimo nodo. La única forma de encontrar cuál es el nodo que apunta a `this.cola` es empezar desde `this.cabeza` y recorrer toda la cadena nodo por nodo hasta detenernos justo un paso antes del final ($n - 1$ pasos $\implies O(n)$).

*(Nota: Si quisiéramos que eliminar la cola también fuera $O(1)$, necesitaríamos una **lista doblemente enlazada**, donde cada nodo tenga tanto `siguiente` como `anterior`).*

---

## Comparativa: `ListaEnlazada` vs. Arreglo (`Array`)

Sea $n$ la cantidad de atenciones médicas guardadas en el historial de una mascota:

| Operación | `ListaEnlazada` (con `cabeza` y `cola`) | Arreglo (`Array` en JS) | ¿Por qué ocurre esta diferencia? |
| :--- | :--- | :--- | :--- |
| **Agregar al final** | **$O(1)$** (`agregarAlFinal`) | **$O(1)$ amortizado** (`.push()`) | En nuestra `ListaEnlazada` tenemos guardado el puntero `this.cola`, así que enganchamos el nuevo nodo al instante. En un arreglo se escribe directo en la última casilla libre (solo toma $O(n)$ ocasionalmente cuando se llena y debe pedir más memoria). |
| **Agregar al inicio** | **$O(1)$** (`agregarAlInicio`) | **$O(n)$** (`.unshift()`) | En la lista enlazada basta con apuntar `nuevoNodo.siguiente` a `this.cabeza` y mover `this.cabeza` (2 pasos fijos). En un arreglo, meter algo en la posición `0` obliga a **empujar todos los demás $n$ elementos** una casilla hacia la derecha. |
| **Acceder a la atención número $k$** | **$O(n)$** *(exactamente $k$ pasos)* | **$O(1)$** (`arreglo[k]`) | Los arreglos están guardados en casillas contiguas de memoria y saltan directo al índice `k` con una fórmula matemática. En la `ListaEnlazada` no hay índices: toca empezar en `this.cabeza` y caminar de vagón en vagón ($k$ saltos) hasta llegar. |
| **Buscar (por condición)** | **$O(n)$** (`buscar`) | **$O(n)$** (`.find()`) | Si los datos no están ordenados por el criterio que buscas, en ambas estructuras toca revisar elemento por elemento desde el inicio hasta encontrar la primera coincidencia (o llegar al final). |
| **Eliminar la primera** | **$O(1)$** (`eliminar` cuando es `cabeza`) | **$O(n)$** (`.shift()`) | En la `ListaEnlazada` basta con mover `this.cabeza = this.cabeza.siguiente` y restar 1 al tamaño. En un arreglo, borrar la posición `0` deja un hueco que obliga a **correr todos los demás elementos** una posición hacia la izquierda. |

### Conclusión práctica para **Patitas**
* **Cuándo gana `ListaEnlazada`:** Cuando necesitas **insertar o borrar al principio (o en medio una vez ubicado el nodo)** sin mover miles de registros de lugar en memoria ($O(1)$ frente a $O(n)$ del arreglo).
* **Cuándo gana un Arreglo:** Cuando necesitas **saltar directo a una posición específica** (`historial[45]`) en tiempo constante $O(1)$ o aprovechar mejor la memoria caché al recorrer todo en bloque.

---

## Sala de espera de Patitas: Cola (`Queue` FIFO) con nodos

### Estado de la cola después de encolar a Lola, Toby y Mía y desencolar una vez

En una **Cola (FIFO)** con referencias **`frente`** (el siguiente paciente a ser atendido) y **`final`** (el último paciente que llegó a la fila), cada nodo apunta hacia el paciente que llegó inmediatamente después de él.

#### Paso 0: Cola vacía (estado inicial)
```text
frente ──► null
final  ──► null
tamanio = 0
frente ──► [ Lola ] ──► null
              ▲
            final
tamanio = 1
frente ──► [ Lola ] ──► [ Toby ] ──► null
                           ▲
                         final
tamanio = 2
frente ──► [ Lola ] ──► [ Toby ] ──► [ Mía ] ──► null
                                        ▲
                                      final
tamanio = 3
[ Lola ] (atendida / sale de la fila)

frente ──► [ Toby ] ──► [ Mía ] ──► null
                           ▲
                         final
tamanio = 2

---

## Comparación de rendimiento: `Cola` (nodos) vs. Arreglo (`push` + `shift`)

### Resultados medidos con 100.000 turnos (`node pruebas/benchmark_cola.js`)

| Implementación | Encolar 100.000 | Desencolar 100.000 | Tiempo total | Complejidad (Encolar / Desencolar) |
| :--- | :--- | :--- | :--- | :--- |
| **`Cola` con Nodos (`frente` y `final`)** | `1.25 ms` | **`1.18 ms`** | **`2.43 ms`** | **$O(1)$** / **$O(1)$** |
| **Arreglo (`Array` con `push` y `shift`)** | `1.56 ms` | **`643.85 ms`** | **`645.41 ms`** | **$O(1)$ amortizado** / **$O(n)$** |

* **Aceleración al desencolar:** La `Cola` con nodos fue **544.6x más rápida** que el arreglo con `.shift()`.

### Explicación de la diferencia
* **Al encolar (`encolar` vs `push`):** Ambas estructuras insertan al final sin recorrer la fila, por lo que operan en tiempo constante **$O(1)$** (`1.25 ms` y `1.56 ms`).
* **Al desencolar (`desencolar` vs `shift`):** En nuestra `Cola` con nodos, atender al siguiente paciente solo cambia la referencia `this.frente = this.frente.siguiente` en **$O(1)$** (`1.18 ms` para vaciar los 100.000 turnos). En cambio, cada `arreglo.shift()` saca el índice `0` y obliga a **correr todos los demás elementos una posición hacia la izquierda** ($O(n)$ por cada turno $\implies O(n^2)$ en total), disparando el tiempo a `643.85 ms`.
---

## Complejidad algorítmica: `Cola` (nodos) vs. Arreglo (`push` + `shift`)

Sea $n$ la cantidad de turnos esperando en la sala de espera:

| Operación | `Cola` (Nodos con `frente` y `final`) | Arreglo (`Array` con `push` y `shift`) | ¿Por qué ocurre esta diferencia? |
| :--- | :--- | :--- | :--- |
| **Encolar** (llegada al final) | **$O(1)$** (`encolar`) | **$O(1)$ amortizado** (`.push()`) | En la `Cola`, tenemos guardado el puntero `this.final`, así que enganchamos el nuevo nodo detrás del último en 2 pasos fijos. En el arreglo, `.push()` escribe directo en la siguiente casilla libre al final (solo toma $O(n)$ de forma aislada cuando se llena su capacidad interna y debe redimensionarse). |
| **Desencolar** (atender al frente) | **$O(1)$** (`desencolar`) | **$O(n)$** (`.shift()`) | En la `Cola`, basta con mover el puntero `this.frente = this.frente.siguiente` en 1 paso fijo sin tocar el resto de la fila. En el arreglo, `.shift()` extrae el elemento del índice `0` y deja un hueco al inicio, obligando a **desplazar todos los $n - 1$ elementos restantes una posición hacia la izquierda** para reindexarlos. |
| **Ver frente** (consultar siguiente) | **$O(1)$** (`verFrente`) | **$O(1)$** (`arreglo[0]`) | Ambas estructuras tienen acceso directo al primer elemento sin recorrer la fila ni modificarla. |
| **Tamaño / ¿Está vacía?** | **$O(1)$** (`tamanio`, `estaVacia`) | **$O(1)$** (`arreglo.length === 0`) | Ambas mantienen un contador interno actualizado (`this._tamanio` y `.length`), por lo que consultarlo es inmediato. |
| **Espacio auxiliar (memoria)** | **$O(n)$** | **$O(n)$** | Ambas almacenan $n$ referencias a los turnos. La `Cola` envuelve cada turno en un objeto `Nodo` con un puntero extra (`siguiente`), mientras el arreglo guarda las referencias en un bloque contiguo de memoria. |

### Explicación de la diferencia en rendimiento (por qué `643.85 ms` vs. `1.18 ms`)

* **El efecto acumulado de `.shift()` ($O(n^2)$ en total):** Aunque encolar $100.000$ turnos cuesta prácticamente lo mismo en ambas estructuras (`1.25 ms` vs. `1.56 ms`), al desencolar toda la fila una por una con `.shift()`, el arreglo realiza $(n - 1) + (n - 2) + \dots + 1 = \frac{n(n - 1)}{2} \approx 5.000.000.000$ desplazamientos de memoria para $n = 100.000$. Eso convierte el vaciado completo de la fila en un proceso cuadrático **$O(n^2)$**.
* **La ventaja de los punteros en `Cola` ($O(n)$ en total):** Como nuestra `Cola` conecta los turnos mediante nodos enlazados y mantiene referencias directas a `frente` y `final`, cada llamada a `desencolar()` solo redirige una referencia (`this.frente = this.frente.siguiente`) en tiempo constante **$O(1)$**. Vaciar los $100.000$ turnos realiza exactamente $100.000$ pasos simples ($O(n)$ en total), logrando ser **544 veces más rápido** (`1.18 ms`).

---

## Simulación manual de atención — Mañana del sábado (`Recepcion`)

* **Reglas:** 1 solo consultorio, 20 minutos por consulta, prioridad de `Urgencia` sobre `General` (FIFO dentro de cada cola) y solo se atiende a quien ya llegó.
* **Orden final de atención:** `Toby (8:00) -> Luna (8:20) -> Kira (8:40) -> Rocky (9:00) -> Max (9:20) -> Simón (9:40) -> Nala (10:00)`.

| Hora consultorio | Mascota atendida | Tipo | Hora llegada | Pacientes esperando al momento de llamar |
| :--- | :--- | :--- | :--- | :--- |
| **8:00 – 8:20** | **Toby** | General | 8:00 | Ninguno (entró directo) |
| **8:20 – 8:40** | **Luna** | Urgencia | 8:10 | Urgencias: `[Luna]` \| Generales: `[Max (8:05), Simón (8:20)]` |
| **8:40 – 9:00** | **Kira** | Urgencia | 8:25 | Urgencias: `[Kira]` \| Generales: `[Max, Simón, Nala (8:40)]` |
| **9:00 – 9:20** | **Rocky** | Urgencia | 9:00 | Urgencias: `[Rocky]` \| Generales: `[Max, Simón, Nala]` |
| **9:20 – 9:40** | **Max** | General | 8:05 | Urgencias: `[]` \| Generales: `[Max, Simón, Nala]` |
| **9:40 – 10:00** | **Simón** | General | 8:20 | Urgencias: `[]` \| Generales: `[Simón, Nala]` |
| **10:00 – 10:20** | **Nala** | General | 8:40 | Urgencias: `[]` \| Generales: `[Nala]` |

---

## Validación: Cálculo manual vs. Simulación (`src/simulacion.js`)

**Resultado de la comparación:** **Coincidencia exacta (100%)** — no se presentaron discrepancias ni errores que corregir.

* **Orden manual previsto:** `Toby (08:00) -> Luna (08:20) -> Kira (08:40) -> Rocky (09:00) -> Max (09:20) -> Simón (09:40) -> Nala (10:00)`.
* **Orden ejecutado por `src/simulacion.js`:** `Toby (08:00) -> Luna (08:20) -> Kira (08:40) -> Rocky (09:00) -> Max (09:20) -> Simón (09:40) -> Nala (10:00)`.
* **Promedios verificados:**
  * **Urgencias (3 pacientes):** `8.33 minutos` ($\frac{10 + 15 + 0}{3}$).
  * **Generales (4 pacientes):** `58.75 minutos` ($\frac{0 + 75 + 80 + 80}{4}$).
* **Por qué funcionó a la primera:** En el ciclo minuto a minuto, primero se registran las llegadas del minuto actual (`registrarLlegada`) y luego se verifica la disponibilidad del consultorio (`llamarSiguiente`), asegurando que pacientes críticos que llegan justo al desocuparse el consultorio (como **Rocky** a las `09:00`) sean priorizados inmediatamente frente a las consultas generales en espera.