# Patitas — Motor de Gestión Clínica y Catálogo de Servicios

Sistema modular en **Node.js** para la clínica veterinaria **Patitas** que gestiona el catálogo jerárquico de servicios médicos, los turnos de atención en consultorio con prioridad de urgencias, el historial operativo con deshacer/rehacer y los historiales clínicos por paciente.

---

## Estructuras implementadas y su uso en Patitas

| Estructura | Ubicación | Uso en el motor de Patitas |
| :--- | :--- | :--- |
| **Árbol N-ario** | `src/dominio/catalogo.js` y `src/dominio/recorridoCatalogo.js` | Representa la jerarquía de categorías, subcategorías y servicios médicos (`Patitas > Consultas / Cirugías / Vacunas`). Permite listar el árbol, contar servicios, medir profundidad, buscar un servicio y su ruta, filtrar por rango de precios y cotizar paquetes con un **10 % de descuento único** al final. |
| **Nodo y Lista Enlazada** (`Nodo`, `ListaEnlazada`) | `src/estructuras/Nodo.js` y `src/estructuras/ListaEnlazada.js` | Almacena el historial clínico secuencial de cada paciente (**Lola**, **Toby**, **Mía**). Utiliza métodos iterativos oficiales (`obtenerTamanio`, `recorrer`, `buscar`) para garantizar espacio constante $O(1)$ y evitar desbordamientos de pila, además de soporte recursivo (`imprimirAlReves`) para mostrar atenciones de la más reciente a la más antigua. |
| **Cola (FIFO)** (`Cola`) | `src/estructuras/Cola.js` | Gestiona el orden de llegada en recepción respetando la política clínica: las **urgencias** se atienden antes que las consultas **generales**, manteniendo el orden estricto de llegada (*First-In, First-Out*) dentro de cada grupo. |
| **Pila (LIFO)** (`Pila`) | `src/estructuras/Pila.js` | Implementa el mecanismo de **Deshacer (*Undo*)** y **Rehacer (*Redo*)** sobre registros de llegada y atenciones en consultorio mediante desapilamiento *Last-In, First-Out*. |

---

## Estructura del proyecto

```text
patitas-motor/
├── demo.js                          # Demostración ejecutiva integral (5 secciones)
├── pruebas/
│   └── todo.js                      # Suite de pruebas automatizadas (casos normales y borde)
├── src/
│   ├── estructuras/
│   │   ├── Nodo.js                  # Nodo simple { dato, siguiente }
│   │   ├── ListaEnlazada.js         # Lista enlazada simple para historiales clínicos
│   │   ├── Cola.js                  # Estructura FIFO para turnos de recepción
│   │   └── Pila.js                  # Estructura LIFO para deshacer/rehacer
│   └── dominio/
│       ├── catalogo.js              # Árbol n-ario de servicios veterinarios
│       ├── recorridoCatalogo.js     # Operaciones recursivas sobre el catálogo
│       ├── RegistroClinico.js       # Modelo de atención clínica por paciente
│       ├── Recepcion.js             # Lógica de prioridad de turnos (Urgencia > General)
│       └── Editor.js                # Control de acciones reversibles (Undo / Redo)
├── bitacora.md                      # Registro de decisiones técnicas, trazas y complejidades
└── README.md                        # Documentación del producto
---

## Resumen de estructuras, operaciones y complejidad

Sea $n$ el número de elementos almacenados en la estructura lineal y $N$ el total de nodos/servicios en el árbol del catálogo:

| Estructura | Operaciones principales | Complejidad de Tiempo | Complejidad de Espacio | Notas de implementación en Patitas |
| :--- | :--- | :--- | :--- | :--- |
| **`Nodo`** (`src/estructuras/Nodo.js`) | `new Nodo(dato, siguiente)` | $O(1)$ | $O(1)$ | Unidad base de enlace simple `{ dato, siguiente }`. |
| **`ListaEnlazada`** (`src/estructuras/ListaEnlazada.js`) | `agregarAlInicio` / `agregarAlFinal` / `obtenerTamanio` | $O(1)$ *(con puntero `cola` y contador `tamanio`)* | $O(1)$ | Inserción en extremos y consulta de longitud instantáneas. |
| **`ListaEnlazada`** *(búsqueda, recorrido y costo)* | `buscar` / `eliminar` / `recorrer` / cálculo de costo total | $O(n)$ | **$O(1)$** *(iterativo oficial)* / $O(n)$ *(recursivo)* | En producción se usan las versiones iterativas para evitar desbordamientos de pila (*stack overflow* observado con $100.000$ registros). |
| **`ListaEnlazada`** *(impresión inversa)* | `imprimirAlReves()` | $O(n)$ | $O(n)$ *(call stack LIFO)* | Muestra el historial de la atención más reciente a la más antigua sin arreglos ni pilas explícitas. |
| **`Cola`** (`src/estructuras/Cola.js`) | `encolar` / `desencolar` / `frente` / `estaVacia` | $O(1)$ | $O(1)$ | Gestión FIFO de turnos en recepción (`Urgencia` > `General`). |
| **`Pila`** (`src/estructuras/Pila.js`) | `apilar` / `desapilar` / `tope` / `estaVacia` | $O(1)$ | $O(1)$ | Control LIFO de acciones reversibles (*Deshacer* / *Rehacer*). |
| **Árbol N-ario** (`src/dominio/catalogo.js` y `recorridoCatalogo.js`) | `listarCatalogo` / `contarServicios` / `profundidad` / `buscarServicio` / `rutaDeServicio` / `precioPaquete` / `serviciosEnRango` | $O(N)$ | $O(h)$ *(donde $h$ es la altura del árbol, $h \le N$)* | Recorrido recursivo en profundidad (DFS); `precioPaquete` aplica el 10 % de descuento una sola vez al finalizar la suma de la rama. |

---

## Cierre de Bitácora — Resumen por MiniReto y Elección de Estructuras

### 1. Lo que se construyó en cada MiniReto

* **Estructuras lineales base (`Nodo`, `ListaEnlazada`, `Cola`, `Pila`):** Se implementaron los módulos en `src/estructuras/`, garantizando distinción exacta de mayúsculas/minúsculas en Linux y separando las operaciones oficiales de producción de las pruebas recursivas.
* **Recursión sobre historiales clínicos (`Lola`, `Toby`, `Mía` y prueba de `100.000` registros):** Se compararon las versiones recursivas e iterativas en tamaño, costo total y búsqueda, se documentó `imprimirAlReves()` mediante el desapilamiento LIFO de la *call stack* y se evidenció el desbordamiento de pila (*stack overflow*) al llegar a `100.000` atenciones.
* **Catálogo jerárquico (`catalogo.js` y `recorridoCatalogo.js`):** Se construyó el árbol n-ario de servicios veterinarios con funciones recursivas para listar la jerarquía, contar servicios, calcular profundidad, buscar servicios, obtener rutas, filtrar por rango de precios y cotizar paquetes con un **10 % de descuento único** al final de la subrama.
* **Recepción, corrección operativa y demostración (`demo.js`, `pruebas/todo.js` y `README.md`):** Se integró la simulación de turnos de la mañana del sábado (`Urgencia` antes que `General`, 20 minutos por consulta), el flujo de **Deshacer / Rehacer**, la suite automatizada en `pruebas/todo.js` (`10/10 OK` cubriendo casos normales y borde) y la documentación del producto en `README.md`.

### 2. Estructuras elegidas por problema y justificación

| Problema en la clínica **Patitas** | Estructura elegida | Complejidad clave | Por qué se eligió esta estructura |
| :--- | :--- | :--- | :--- |
| **Historial clínico por mascota** (`Lola`, `Toby`, `Mía`) | **Lista enlazada simple** (`Nodo` + `ListaEnlazada`) con recorrido iterativo oficial en producción | Tiempo $O(n)$ (o $O(1)$ en tamaño/extremos) / Espacio **$O(1)$** iterativo | Permite anexar atenciones cronológicas de forma secuencial y recorrerlas con memoria constante $O(1)$, evitando el consumo de pila $O(n)$ que provoca *stack overflow* con `100.000` nodos (reservando `imprimirAlReves()` recursivo solo para historiales cortos). |
| **Atención en consultorio** (`Urgencia` > `General`, FIFO por grupo) | **Colas FIFO** (`Cola`) separadas por prioridad | Encolar/desencolar en **$O(1)$** | Garantiza que las urgencias salgan antes que las consultas generales sin perder el orden estricto de llegada dentro de cada categoría. |
| **Deshacer y rehacer acciones** (`Undo` / `Redo`) | **Pilas LIFO** (`Pila`) | Apilar/desapilar en **$O(1)$** | Cada corrección revierte la última acción registrada y permite re aplicarla en orden inverso exacto al de ejecución. |
| **Catálogo de servicios y paquetes** (`Patitas > ...`) | **Árbol n-ario** (`{ nombre, servicios, subcategorias }`) | Recorrido **$O(N)$** / Espacio de pila **$O(h)$** | Cada categoría puede tener un número variable de subcategorías y servicios a distinta profundidad; el recorrido recursivo resuelve búsquedas, rutas y sumas de paquetes de forma natural sin límite fijo de hijos. |