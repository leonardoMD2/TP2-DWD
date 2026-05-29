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
        producto.innerHTML = `${elemento.nombre} - $${elemento.precio * elemento.cantidad} x ${elemento.cantidad}`

        carrito.append(producto, btnCantidadSuma, btnEliminar, btnCantidad)
    })
    totalCarrito.textContent = `Total: $${total}`
}

function clearUI() {
    carrito.textContent = ""
    totalCarrito.textContent = "Total: $0"
}