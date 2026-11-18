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