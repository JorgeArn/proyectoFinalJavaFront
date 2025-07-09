const API_URL = "http://localhost:8080/ecommerce/articulos";

document.addEventListener("DOMContentLoaded", () => listarArticulos());

// Vaciar el carrito
const clearCarrito = document.querySelector("#vaciar-carrito");
clearCarrito.addEventListener("click", () => {
    const tbody = document.querySelector("#lista-carrito");
    tbody.innerHTML = "";
});

// Menú de productos, tocando en cada categoria lista solo los artículos de esa categoría
document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        const categoria = this.getAttribute("data-categoria");
        listarArticulos(categoria);
    })
})



// ---------- FUNCIÓN QUE LISTA TODOS LOS ARTÍCULOS --------------
function listarArticulos(categoria = null) {

    // si se pasa categoria, lista los articulos por categoria, sino lista todos
    let url = categoria ? `${API_URL}/${categoria}` : `${API_URL}/listar`;
   
    // Llamada GET a la API para obtener todos los artículos
    fetch(url)
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(data => {
            const cards = document.getElementById("cards-articulos"); // Obtenemos el cuerpo de la tabla
            cards.innerHTML = ""; // Limpiar todo antes de insertar nuevos datos
            data.forEach(articulo => {
                const card = document.createElement("div")
                card.className = "col-12 col-sm-6 col-md-4";
                card.innerHTML = `
                        <div class="card h-100">
                            <img src="${articulo.imagen}" class="card-img-top" alt="${articulo.nombre}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${articulo.nombre}</h5>
                                <p class="card-text">$ ${articulo.precio.toFixed(2)}</p>
                                <a href="#" class="btn btn-dark mt-auto" onclick="agregarCarrito(${articulo.id})">Agregar al carrito</a>
                            </div>
                        </div>
                `;
                cards.appendChild(card); // Agregamos la fila al cuerpo de la tabla
            });
        })
        .catch(error => console.error("Error al listar artículos:", error)); // Manejo de errores
}


// --------------- FUNCIÓN QUE AGREGA LOS ARTÍCULOS AL CARRITO --------------------
function agregarCarrito(id) {
    // Llamada GET para obtener los datos del artículo por su ID
    fetch(`${API_URL}/articuloInfo/${id}`)
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(articulo => {
            const tbody = document.getElementById("lista-carrito");

            // Busca si ya existe el articulo en el carrito
            const filaExistente = document.getElementById(`item-${articulo.id}`);
            if(filaExistente) {
                // Si existe se le suma 1 a la cantidad
                const tdCantidad = filaExistente.querySelector(".cantidad");
                tdCantidad.textContent = parseInt(tdCantidad.textContent) + 1;
                return;
            }

            // Si no existe se crea normalmente
            const fila = document.createElement("tr");
            fila.id = `item-${articulo.id}`;
            fila.innerHTML = `
                <td class="text-dark"><img src="${articulo.imagen}" alt="${articulo.nombre}" class="w-100"></td>
                <td class="text-dark">${articulo.nombre}</td>
                <td class="text-dark">$ ${articulo.precio.toFixed(2)}</td>
                <td class="cantidad text-dark">1</td>
                <td>    
                    <button class="btn btn-danger btn-sm" >X</button>
                </td>
            `;

            // Agrega funcionalidad al boton de eliminar
            const btnEliminar = fila.querySelector("button")
            btnEliminar.addEventListener("click", () => {
                fila.remove();
            })

            tbody.appendChild(fila);
        })
        .catch(error => console.error("Error al agregar el artículo:", error)); // Manejo de errores
}



