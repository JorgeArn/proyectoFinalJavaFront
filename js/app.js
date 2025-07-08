const API_URL = "http://localhost:8080/ecommerce/articulos";

document.addEventListener("DOMContentLoaded", listarArticulos);



// ---------- FUNCIÓN QUE LISTA TODOS LOS ARTÍCULOS --------------
function listarArticulos() {
    // Llamada GET a la API para obtener todos los artículos
    fetch(`${API_URL}/listar`)
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(data => {
            const cards = document.getElementById("cards-articulos"); // Obtenemos el cuerpo de la tabla
            cards.innerHTML = ""; // Limpiar todo antes de insertar nuevos datos
            data.forEach(articulo => {
                const card = document.createElement("div")
                card.innerHTML = `
                    <div class="col-sm-6 col-md-4 col-lg-3">
                        <div class="card h-100 col-md-4">
                            <img src="${articulo.imagen}" class="card-img-top" alt="${articulo.nombre}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${articulo.nombre}</h5>
                                <p class="card-text">${articulo.precio}</p>
                                <a href="#" class="btn btn-dark mt-auto" onclick="agregarCarrito(${articulo.id})">Agregar al carrito</a>
                            </div>
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
            tbody.innerHTML = "";
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td class="text-dark"><img src="${articulo.imagen}" alt="${articulo.nombre}" class="w-100"></td>
                <td class="text-dark">${articulo.nombre}</td>
                <td class="text-dark">${articulo.precio.toFixed(2)}</td>
                <td>    
                    <button class="btn btn-danger btn-sm" >X</button>
                </td>
            `;
            tbody.appendChild(fila);
        })
        .catch(error => console.error("Error al agregar el artículo:", error)); // Manejo de errores
}




