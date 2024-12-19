document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = '../index.html';
        return;
    }
    verDetalleProducto();
});

//Función para ver detalles del producto
function verDetalleProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    fetch('../assets/data/productos.json')
    .then(response => response.json())
    .then(data => {
        const producto = data.find(p => p.Id === productId);
        if (producto) {
            document.querySelector('.titulo h1').textContent = producto.Nombre.toUpperCase();
            const galeriaDiv = document.getElementById('producto-galeria');
            galeriaDiv.innerHTML = '';
            producto.Imagenes.forEach(imagen => {
                const imgElement = document.createElement('img');
                imgElement.src = imagen;
                imgElement.alt = producto.Nombre;
                galeriaDiv.appendChild(imgElement);
            });
            document.getElementById('producto-descripcion').textContent = producto.Descripcion;
            document.getElementById('producto-precio').textContent = producto.Precio;

            const botonDiv = document.getElementById('boton-agregar-carrito');
            botonDiv.innerHTML = `
            <button type="button" class="agregar" data-id="${producto.Id}" ${producto.Disponible ? '' : 'disabled'}>¡Lo quiero!</button>
            `;

            if (producto.Disponible === 0) {
                document.getElementById('sin-stock-detalle').style.display = 'block';
            } else {
                document.getElementById('sin-stock-detalle').style.display = 'none';
            }
        }
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}


