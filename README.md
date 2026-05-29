# JavaScript Puro: Carrito de Compras con Módulos ES6

En este repositorio se encuentra una aplicación de carrito de compras construida con JavaScript vanilla (sin frameworks ni librerías). Utiliza módulos ES6 (`import`/`export`) para separar los datos de la lógica. Muestra una lista de productos disponibles; al hacer clic en "Agregar", se insertan en un carrito que calcula el total con `reduce`. No hay bundler ni paso de build: el navegador carga `main.js` directamente como módulo a través de `<script type="module">`.

```
├── index.html                         # HTML base: estructura del DOM y carga de main.js como módulo
├── main.js                            # Lógica principal: renderizado, eventos y carrito
├── module.js                          # Datos y estado compartido: array de autos y array de favoritos
├── defecto.js                         # Ejemplo de export default: función saludo
└── styles.css                         # Estilos: paleta pastel minimalista en tonalidades celestes
```

En `module.js` encontramos los datos de la aplicación: un array de 5 autos (con id, nombre, precio y categoría) y un array vacío `favoritos` que funciona como el estado del carrito. Ambos se exportan como named exports.

En `defecto.js` encontramos un export default: una función `saludo` que ejecuta un `alert("Hola")`. Es un ejemplo didáctico de cómo funciona un export default vs un named export.

En `styles.css` encontramos los estilos de la aplicación con una paleta pastel minimalista en tonalidades celestes. Usa CSS Grid para el layout responsive de productos, bordes finos (`1px solid #c8dff5`), y transiciones suaves en hover. Incluye un breakpoint en 480px para dispositivos móviles.

En `main.js` encontramos toda la lógica de la aplicación: importa los datos de ambos archivos, renderiza los productos en el DOM, maneja los eventos de clic para agregar al carrito, y renderiza el carrito con botones de cantidad (+/-), eliminación (X) y el total calculado.

En `index.html` encontramos la estructura del HTML con tres elementos clave y la etiqueta `<script type="module">` que habilita el uso de módulos ES6.

# Instalación y ejecución

No hay dependencias ni paso de instalación. El proyecto usa JavaScript puro con módulos ES6.

Para ejecutar la aplicación, abrí `index.html` en un navegador moderno que soporte módulos (Chrome, Firefox, Edge). Si usás `file://` directamente, es posible que aparezca un error de CORS; en ese caso, usá un Live Server (como el de VS Code) o cualquier servidor local:

```bash
# Con Python
python -m http.server 8080

# Con Node (si tenés instalado npx)
npx serve .
```

Luego abrí `http://localhost:8080` en el navegador.

# Módulos ES6: named exports vs default export

El proyecto demuestra los dos tipos de exportación que existen en JavaScript moderno. La diferencia fundamental es cómo se importan y qué restricciones tienen.

### **Named exports (module.js)**

Un named export se declara con la palabra `export` antes de la variable o función. Se importa con llaves `{}` y el nombre debe coincidir exactamente:

```js
// module.js — exportación
export const autos = [ /* ... */ ]
export const favoritos = []
```

```js
// main.js — importación
import { autos, favoritos } from "./module.js"
```

La ventaja de los named exports es que podés exportar múltiples cosas del mismo archivo y el importador elige cuáles necesita. Las llaves en el `import` no crean un objeto: son la sintaxis para indicar que estás importando exportaciones nombradas.

### **Default export (defecto.js)**

Un default export se declara con `export default`. Se importa sin llaves y podés ponerle el nombre que quieras:

```js
// defecto.js — exportación
export default function saludo() {
    alert("Hola")
}
```

```js
// main.js — importación
import saludo from "./defecto.js"
```

El nombre `saludo` en el import no viene del archivo original: lo decide quien importa. Podría ser `import miFuncion from "./defecto.js"` y funcionaría igual. Un archivo solo puede tener un default export, pero puede tener tantos named exports como necesite.

# La estructura del DOM: index.html

El HTML define tres elementos que son los puntos de inserción para todo el contenido dinámico:

```html
<link rel="stylesheet" href="styles.css">
<article class="carrito"></article>
<p class="totalCarrito">Total: $0</p>
<article class="productos"></article>
<script type="module" src="main.js"></script>
```

Cada elemento tiene un rol específico:

| Elemento | Selector | Rol |
|---|---|---|
| `<link rel="stylesheet">` | N/A | Vincula `styles.css` para aplicar la paleta pastel celeste |
| `<article class="productos">` | `.productos` | Contenedor donde se renderizan los 5 productos disponibles, cada uno con nombre, precio y botón "Agregar" |
| `<article class="carrito">` | `.carrito` | Contenedor donde se renderizan los productos que el usuario agregó al carrito, con botones +/- y X |
| `<p class="totalCarrito">` | `.totalCarrito` | Muestra el precio total a pagar, calculado con `reduce` |

El atributo `type="module"` en el `<script>` es lo que permite usar `import` y `export` en JavaScript. Sin este atributo, el navegador intentaría ejecutar el archivo como script tradicional y lanzaría un error de sintaxis al encontrar las palabras `import` o `export`.

# La lógica de la aplicación: main.js

El archivo `main.js` es el motor de toda la aplicación. A continuación se muestra el código completo y luego se explica cada parte.

```js
import { autos, favoritos } from "./module.js"
import saludo from "./defecto.js"

const productos = document.querySelector(".productos")
const carrito = document.querySelector(".carrito")
const totalCarrito = document.querySelector(".totalCarrito")

autos.forEach(producto => {
    const p = document.createElement("p")
    const articulo = document.createElement("article")
    const btnAgregar = document.createElement("button")


    btnAgregar.textContent = "Agregar"



    btnAgregar.addEventListener("click", function () {
        const elementoEncontrado = favoritos.find(element => element.id === producto.id)

        if (elementoEncontrado) {
            elementoEncontrado.cantidad += 1
        } else {
            favoritos.push({ ...producto, cantidad: 1 })
        }
        console.log(favoritos)
        clearUI()
        renderCarrito()
    })
    p.innerHTML = `${producto.nombre} <span class="precio">$${producto.precio}</span>`
    p.setAttribute("id", producto.id)

    articulo.append(p, btnAgregar)
    productos.append(articulo)
})

function renderCarrito() {


    if (favoritos.length == 0) {
        return
    }
    const total = favoritos.reduce((acc, element) => {
        return acc + element.precio * element.cantidad
    }, 0)
    favoritos.forEach(elemento => {
        const btnEliminar = document.createElement("button")
        const btnCantidad = document.createElement("button")
        const btnCantidadSuma = document.createElement("button")
        btnEliminar.textContent = "X"
        btnCantidad.textContent = "-"
        btnCantidadSuma.textContent = "+"


        btnEliminar.addEventListener("click", function () {
            const index = favoritos.findIndex(element => element.id === elemento.id)
            if (index !== -1) {
                favoritos.splice(index, 1)
            }
            clearUI()
            renderCarrito()
        })

        btnCantidadSuma.addEventListener("click", function () {
            const elementoEncontrado = favoritos.find(element => element.id === elemento.id)

            if (elementoEncontrado) {
                elementoEncontrado.cantidad += 1
            }
            clearUI()
            renderCarrito()
        })

        btnCantidad.addEventListener("click", function () {
            const elementoEncontrado = favoritos.find(element => element.id === elemento.id)

            if (elementoEncontrado && elemento.cantidad > 1) {
                elementoEncontrado.cantidad -= 1
            }
            clearUI()
            renderCarrito()
        })

        const producto = document.createElement("p")
        const totalNode = document.createElement("p")
        producto.innerHTML = `${elemento.nombre} - $${elemento.precio * element.cantidad} x ${elemento.cantidad}`

        carrito.append(producto, btnCantidadSuma, btnEliminar, btnCantidad)
    })
    totalCarrito.textContent = `Total: $${total}`
}

function clearUI() {
    carrito.textContent = ""
    totalCarrito.textContent = "Total: $0"
}
```

### **Selección de elementos del DOM**

```js
const productos = document.querySelector(".productos")
const carrito = document.querySelector(".carrito")
const totalCarrito = document.querySelector(".totalCarrito")
```

`document.querySelector()` toma un selector CSS y devuelve el primer elemento que coincida. Estas tres constantes son referencias directas a los elementos del HTML: cualquier cosa que hagamos con `productos.append(...)` se reflejará dentro del `<article class="productos">`, y lo mismo con los otros dos.

### **Renderizado de productos: forEach + createElement + append**

```js
autos.forEach(producto => {
    const p = document.createElement("p")
    const articulo = document.createElement("article")
    const btnAgregar = document.createElement("button")

    btnAgregar.textContent = "Agregar"
    p.innerHTML = `${producto.nombre} <span class="precio">$${producto.precio}</span>`
    p.setAttribute("id", producto.id)

    articulo.append(p, btnAgregar)
    productos.append(articulo)
})
```

`autos.forEach()` recorre el array de 5 productos. Para cada uno:

1. Se crean tres elementos vacíos con `document.createElement()`: un `<p>` para el nombre y precio, un `<article>` como contenedor, y un `<button>` para la acción de agregar.
2. Se asigna el texto del botón con `textContent = "Agregar"`.
3. Se inyecta el contenido del `<p>` con un template literal que incluye un `<span class="precio">` para estilizar el precio por separado: `` `${producto.nombre} <span class="precio">$${producto.precio}</span>` ``. Las dobles llaves en `$$` no son un error: la primera es el delimitador del template literal y la segunda es el signo literal de dólar.
4. Se asigna el `id` del `<p>` con `setAttribute("id", producto.id)`. Esto vincula el elemento del DOM con el id del dato, lo que permite identificar visualmente cada producto.
5. Se ensambla la estructura con `articulo.append(p, btnAgregar)` — `append` acepta múltiples nodos como argumentos, insertándolos en orden.
6. Se inserta el artículo completo en el DOM con `productos.append(articulo)`.

El resultado visual es un `<article>` por cada auto, conteniendo su nombre, precio estilizado y un botón.

### **Event Listener: agregar al carrito**

Cada botón tiene un `addEventListener` que se ejecuta cuando el usuario hace clic:

```js
btnAgregar.addEventListener("click", function () {
    const elementoEncontrado = favoritos.find(element => element.id === producto.id)

    if (elementoEncontrado) {
        elementoEncontrado.cantidad += 1
    } else {
        favoritos.push({ ...producto, cantidad: 1 })
    }
    console.log(favoritos)
    clearUI()
    renderCarrito()
})
```

La lógica tiene tres pasos:

**1. Buscar si el producto ya está en el carrito**

```js
const elementoEncontrado = favoritos.find(element => element.id === producto.id)
```

`Array.find()` recorre el array y retorna el primer elemento que cumpla la condición, o `undefined` si no encuentra ninguno. Compara el `id` del producto actual con los `id` de los productos que ya están en `favoritos`.

**2. Si ya existe, incrementar la cantidad**

```js
if (elementoEncontrado) {
    elementoEncontrado.cantidad += 1
}
```

Si `find` retornó un objeto (no `undefined`), significa que el producto ya está en el carrito. Se accede directamente a su propiedad `cantidad` y se le suma 1. Esto funciona porque `find` retorna una **referencia** al objeto original del array, no una copia. Al modificar `elementoEncontrado.cantidad`, se modifica el objeto dentro de `favoritos`.

**3. Si no existe, agregarlo con cantidad 1**

```js
else {
    favoritos.push({ ...producto, cantidad: 1 })
}
```

Si `find` retornó `undefined`, el producto no está en el carrito. Se hace `push` al array `favoritos` con un nuevo objeto que combina las propiedades del auto original usando el spread operator (`...producto`) y agrega una nueva propiedad `cantidad: 1`.

El spread operator (`...`) descompone todas las propiedades del objeto `producto` (`id`, `nombre`, `precio`, `categoria`) y las copia en un nuevo objeto. Si `producto` es `{ id: 1, nombre: "Auto 1", precio: 2222, categoria: "sedan" }`, el resultado es `{ id: 1, nombre: "Auto 1", precio: 2222, categoria: "sedan", cantidad: 1 }`.

**¿Por qué se usa `function()` y no una arrow function en el addEventListener?**

Ambas funcionarían igual en este caso. 

**4. Limpiar y re-renderizar**

```js
clearUI()
renderCarrito()
```

Después de modificar `favoritos`, se llama a `clearUI()` para vaciar el contenido actual del carrito en el DOM, y luego a `renderCarrito()` para volver a dibujarlo con los datos actualizados. Sin este paso, se duplicarían los ítems en cada clic.

### **renderCarrito() — El total con reduce y botones de acción**

```js
function renderCarrito() {


    if (favoritos.length == 0) {
        return
    }
    const total = favoritos.reduce((acc, element) => {
        return acc + element.precio * element.cantidad
    }, 0)
    favoritos.forEach(elemento => {
        const btnEliminar = document.createElement("button")
        const btnCantidad = document.createElement("button")
        const btnCantidadSuma = document.createElement("button")
        btnEliminar.textContent = "X"
        btnCantidad.textContent = "-"
        btnCantidadSuma.textContent = "+"


        btnEliminar.addEventListener("click", function () {
            const index = favoritos.findIndex(element => element.id === elemento.id)
            if (index !== -1) {
                favoritos.splice(index, 1)
            }
            clearUI()
            renderCarrito()
        })

        btnCantidadSuma.addEventListener("click", function () {
            const elementoEncontrado = favoritos.find(element => element.id === elemento.id)

            if (elementoEncontrado) {
                elementoEncontrado.cantidad += 1
            }
            clearUI()
            renderCarrito()
        })

        btnCantidad.addEventListener("click", function () {
            const elementoEncontrado = favoritos.find(element => element.id === elemento.id)

            if (elementoEncontrado && elemento.cantidad > 1) {
                elementoEncontrado.cantidad -= 1
            }
            clearUI()
            renderCarrito()
        })

        const producto = document.createElement("p")
        const totalNode = document.createElement("p")
        producto.innerHTML = `${elemento.nombre} - $${elemento.precio * element.cantidad} x ${elemento.cantidad}`

        carrito.append(producto, btnCantidadSuma, btnEliminar, btnCantidad)
    })
    totalCarrito.textContent = `Total: $${total}`
}
```

**Guard clause**

```js
if (favoritos.length == 0) {
    return
}
```

Si el carrito está vacío, la función se detiene inmediatamente con `return`. Sin esta validación, `reduce` intentaría recorrer un array vacío y el `forEach` no crearía ningún nodo, pero es una buena práctica evitar ejecuciones innecesarias.

**Cálculo del total con `reduce`**

```js
const total = favoritos.reduce((acc, element) => {
    return acc + element.precio * element.cantidad
}, 0)
```

`Array.reduce()` es el método más poderoso de los arrays en JavaScript. Recorre cada elemento del array y va acumulando un resultado en una sola variable.

- El primer argumento `(acc, element)` es la función reductora: `acc` es el acumulador (el resultado que va construyendo) y `element` es el elemento actual del array.
- El segundo argumento `0` es el valor inicial del acumulador.

En cada iteración:

| Iteración | `acc` (acumulador) | `element` | Operación | Resultado |
|---|---|---|---|---|
| 1ª | `0` | `{nombre: "Auto 1", precio: 2222, cantidad: 2}` | `0 + 2222 * 2` | `4444` |
| 2ª | `4444` | `{nombre: "Auto 3", precio: 3333, cantidad: 1}` | `4444 + 3333 * 1` | `7777` |

Al finalizar, `total` contiene la suma de `precio * cantidad` de todos los productos del carrito.

**Botones de acción por cada ítem**

Para cada producto en el carrito se crean tres botones:

```js
const btnEliminar = document.createElement("button")
const btnCantidad = document.createElement("button")
const btnCantidadSuma = document.createElement("button")
btnEliminar.textContent = "X"
btnCantidad.textContent = "-"
btnCantidadSuma.textContent = "+"
```

- **btnCantidadSuma (+)**: Incrementa la cantidad del producto en 1
- **btnCantidad (-)**: Decrementa la cantidad (con validación mínima de 1)
- **btnEliminar (X)**: Elimina el producto completamente del carrito

**Eliminar producto del carrito (btnEliminar)**

```js
btnEliminar.addEventListener("click", function () {
    const index = favoritos.findIndex(element => element.id === elemento.id)
    if (index !== -1) {
        favoritos.splice(index, 1)
    }
    clearUI()
    renderCarrito()
})
```

`Array.findIndex()` retorna el índice del elemento que cumpla la condición, o `-1` si no lo encuentra. Luego `Array.splice(index, 1)` elimina 1 elemento en esa posición. A diferencia de `find()` que retorna el elemento, `findIndex()` retorna la posición, lo cual es necesario para `splice`.

**Incrementar cantidad (btnCantidadSuma)**

```js
btnCantidadSuma.addEventListener("click", function () {
    const elementoEncontrado = favoritos.find(element => element.id === elemento.id)

    if (elementoEncontrado) {
        elementoEncontrado.cantidad += 1
    }
    clearUI()
    renderCarrito()
})
```

Busca el elemento por id con `find()` y le suma 1 a su propiedad `cantidad`. Como `find()` retorna una referencia al objeto original del array, la mutación se refleja directamente en `favoritos`.

**Decrementar cantidad (btnCantidad)**

```js
btnCantidad.addEventListener("click", function () {
    const elementoEncontrado = favoritos.find(element => element.id === elemento.id)

    if (elementoEncontrado && elemento.cantidad > 1) {
        elementoEncontrado.cantidad -= 1
    }
    clearUI()
    renderCarrito()
})
```

La lógica es similar a incrementar, pero con una validación adicional: `elemento.cantidad > 1`. Esto evita que la cantidad baje de 1. Si el usuario hace clic en "-" cuando ya tiene 1 unidad, no sucede nada.

**Render de cada ítem**

```js
const producto = document.createElement("p")
const totalNode = document.createElement("p")
producto.innerHTML = `${elemento.nombre} - $${elemento.precio * element.cantidad} x ${elemento.cantidad}`

carrito.append(producto, btnCantidadSuma, btnEliminar, btnCantidad)
```

`forEach` recorre `favoritos` y por cada producto crea un `<p>` con su nombre, el precio total de ese ítem (precio unitario * cantidad) y la cantidad. Por ejemplo: `Auto 1 - $4444 x 2`. Los tres botones se insertan después del texto del producto.

**Nota**: se crea un `totalNode` con `document.createElement("p")` pero nunca se usa ni se inserta en el DOM. Es código muerto que quedó probablemente como intención de mostrar el total por ítem, pero solo se muestra el total general en `totalCarrito`.

**Actualización del total en el DOM**

```js
totalCarrito.textContent = `Total: $${total}`
```

`textContent` reemplaza todo el texto dentro del elemento `.totalCarrito` con el total formateado. Si el total es `7777`, el resultado visible es `Total: $7777`.

### **clearUI() — Limpiar el carrito**

```js
function clearUI() {
    carrito.textContent = ""
    totalCarrito.textContent = "Total: $0"
}
```

Asignar un string vacío a `textContent` elimina todo el contenido del elemento: todos los nodos hijos (los `<p>` y botones creados por `renderCarrito`) se destruyen. Esto es necesario antes de volver a renderizar para evitar que los ítems se dupliquen en cada clic.

Además, `clearUI()` resetea el total a `Total: $0`. Esto es importante porque si el carrito queda vacío después de eliminar todos los ítems, el total debe volver a cero.

**¿Por qué no se usa `innerHTML = ""`?** Ambas formas funcionan para vaciar un elemento. `textContent = ""` es ligeramente más performante porque no parsea HTML; simplemente elimina los nodos de texto. `innerHTML = ""` también elimina los nodos, pero implica un paso adicional de parseo.

# Cómo viajan los datos: flujo de la aplicación

`module.js` es el dueño de los datos. Exporta `autos` y `favoritos` como referencias compartidas. `main.js` importa esas referencias y las usa para renderizar el DOM y manejar eventos.

```
module.js
  │
  ├── autos (array de 5 objetos) ──────────→ main.js: forEach renderiza cada auto en .productos
  │                                            │
  │                                            ├── createElement("p") → nombre y precio con <span class="precio">
  │                                            ├── createElement("button") → botón "Agregar"
  │                                            └── append → se inserta en .productos
  │
  └── favoritos (array vacío) ─────────────→ main.js: se modifica con push/find/splice al hacer clic
       │                                       │
       │                                       ├── find() → verifica si el producto ya existe
       │                                       │   ├── Si existe: cantidad += 1 (mutación directa)
       │                                       │   └── Si no existe: push({ ...producto, cantidad: 1 })
       │                                       │
       │                                       ├── clearUI() → carrito.textContent = "" + totalCarrito.textContent = "Total: $0"
       │                                       │
       │                                       └── renderCarrito()
       │                                            ├── reduce((acc, el) => acc + el.precio * el.cantidad, 0)
       │                                            │   └── → total
       │                                            ├── forEach → crea <p> + botones (+, -, X) por cada ítem
       │                                            │   ├── btnCantidadSuma (+) → cantidad += 1
       │                                            │   ├── btnCantidad (-) → cantidad -= 1 (mínimo 1)
       │                                            │   └── btnEliminar (X) → findIndex + splice
       │                                            └── totalCarrito.textContent = `Total: $${total}`
```

### **¿Por qué favoritos se comparte por referencia?**

Cuando `main.js` hace `import { favoritos } from "./module.js"`, obtiene una referencia al mismo array que existe en `module.js`. No es una copia: es el mismo objeto en memoria. Esto significa que cualquier `push`, `filter` o mutación que `main.js` haga sobre `favoritos` se refleja inmediatamente. Si otro archivo importara `favoritos`, vería los mismos cambios.

Esta es la razón por la que el carrito funciona: `favoritos` se llena con `push` dentro del event listener, y luego `renderCarrito` lee ese mismo array para mostrar los ítems.

# Funcionalidades de la app

- [x] Renderizar productos disponibles en el DOM con nombre y precio.
- [x] Botón "Agregar" por cada producto.
- [x] Agregar producto al carrito si no existe (con cantidad inicial 1).
- [x] Incrementar cantidad si el producto ya está en el carrito (mutación directa con `find`).
- [x] Calcular y mostrar el total con `reduce`.
- [x] Renderizar ítems del carrito con precio total por ítem y cantidad.
- [x] Limpiar y re-renderizar el carrito en cada acción (`clearUI` + `renderCarrito`).
- [x] Uso de módulos ES6: named exports (`module.js`) y default export (`defecto.js`).
- [x] Creación e inserción de elementos DOM con `createElement` y `append`.
- [x] Event listener en cada botón para agregar al carrito.
- [x] Botón para eliminar ítems del carrito (X) con `findIndex` + `splice`.
- [x] Botones +/- para incrementar/decrementar cantidad con validación mínima.
- [x] Estilos CSS con paleta pastel minimalista en tonalidades celestes y bordes finos.
- [x] Layout responsive con CSS Grid y breakpoint mobile en 480px.
- [ ] Persistencia del carrito en localStorage.
- [ ] Filtrado por categoría (sedan, camioneta).
- [ ] Validación de stock o cantidad máxima.