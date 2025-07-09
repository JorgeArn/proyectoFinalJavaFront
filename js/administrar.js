const API_URL = "http://localhost:8080/ecommerce/articulos";

// Cuando se carga la página, mostramos el listado
document.addEventListener("DOMContentLoaded", listarArticulosCrud);

// Manejador del formulario
document.getElementById("form-articulo").addEventListener("submit", guardarArticulo);

// Botón para cancelar edición
document.getElementById("cancelar").addEventListener("click", () => {
    // Limpiar todos los campos del formulario
    document.getElementById("form-articulo").reset();
    // Borrar el ID oculto del formulario
    document.getElementById("idArticulo").value = "";
});


// ----------------- FUNCIÓN QUE LISTA TODOS LOS ARTÍCULOS EN EL CRUD ---------------------
function listarArticulosCrud() {
    // Llamada GET a la API para obtener todos los artículos
    fetch(`${API_URL}/listar`)
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(data => {
            const tbody = document.getElementById("tabla-articulos"); // Obtenemos el cuerpo de la tabla
            tbody.innerHTML = ""; // Limpiar tabla antes de insertar nuevos datos
            data.forEach(articulo => {
                const fila = document.createElement("tr"); // Creamos una fila de tabla
                // Insertamos columnas con los datos del artículo y botones de acción
                fila.innerHTML = `
                    <td>${articulo.id}</td>
                    <td>${articulo.nombre}</td>
                    <td>${articulo.precio.toFixed(2)}</td>
                    <td>${articulo.categoria}</td>
                    <td>
                        <img src="${articulo.imagen}" alt="${articulo.nombre}" style="width: 100px; height: 100px;">
                    </td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarArticulo(${articulo.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarArticulo(${articulo.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(fila); // Agregamos la fila al cuerpo de la tabla
            });
        })
        .catch(error => console.error("Error al listar artículos:", error)); // Manejo de errores
}

// ---------- FUNCIÓN QUE GUARDA O ACTUALIZA UN ARTÍCULO EN EL CRUD -------------
function guardarArticulo(event) {
    event.preventDefault(); // Evitamos el comportamiento por defecto del formulario

    // Obtenemos los valores de los campos del formulario
    const id = document.getElementById("idArticulo").value;
    const nombre = document.getElementById("nombre").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);
    const categoria = document.getElementById("categoria").value;
    const imagen = document.getElementById("imagen").files[0];

    // Validación de campos
    if (!nombre || isNaN(precio) || precio < 0 || !categoria) {
        alert("Por favor complete correctamente los campos.");
        return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("precio", precio);
    formData.append("categoria", categoria);
    if (imagen) {
        formData.append("imagen", imagen);
    }

    // Determinamos si es una edición (PUT) o creación (POST)
    const url = id ? `${API_URL}/editarArticulo/${id}` : `${API_URL}/crearArticulo`;
    const metodo = id ? "PUT" : "POST";

    // Enviamos el artículo al backend usando fetch
    fetch(url, {
        method: metodo,
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al guardar"); // Verificamos respuesta exitosa
            return response.json();
        })
        .then(() => {
            // Limpiamos el formulario y recargamos la tabla
            document.getElementById("form-articulo").reset();
            document.getElementById("idArticulo").value = "";
            listarArticulosCrud();
            alert("Articulo guardado correctamente");
        })
        .catch(error => console.error("Error al guardar artículo:", error)); // Manejo de errores
}


// === Cargar artículo en el formulario para edición ===
function editarArticulo(id) {
    // Llamada GET para obtener los datos del artículo por su ID
    fetch(`${API_URL}/articuloInfo/${id}`)
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(articulo => {
            // Cargamos los datos del artículo en el formulario
            document.getElementById("idArticulo").value = articulo.id;
            document.getElementById("nombre").value = articulo.nombre;
            document.getElementById("precio").value = articulo.precio;
            document.getElementById("categoria").value = articulo.categoria;
            document.getElementById("imagen").files[0] = articulo.imagen;
        })
        .catch(error => console.error("Error al obtener artículo:", error)); // Manejo de errores
}

// === Eliminar un artículo ===
function eliminarArticulo(id) {
    // Confirmación antes de eliminar
    if (confirm("¿Deseás eliminar este artículo?")) {
        // Llamada DELETE al backend
        fetch(`${API_URL}/borrarArticulo/${id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) throw new Error("Error al eliminar"); // Verificamos que la respuesta sea exitosa
                listarArticulosCrud(); // Actualizamos la lista de artículos
            })
            .catch(error => console.error("Error al eliminar artículo:", error)); // Manejo de errores
    }
}