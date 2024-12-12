// Función para mostrar productos destacados en Index
function mostrarProductosDestacados() {
    fetch('assets/data/productos.json')
    .then(response => response.json())
    .then(data => {
        const destacadosDiv = document.getElementById('productos-destacados');
        const idsDestacados = [2, 6, 1, 10];
        const productosDestacados = data.filter(producto => idsDestacados.includes(parseInt(producto.Id)));
        productosDestacados.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('tarjeta-link');
            productoDiv.innerHTML = `
            <a href="./pages/detalle.html?id=${producto.Id}">
                <article class="tarjeta">
                <h2>${producto.Nombre}</h2>
                <img src="${producto.Imagen}" alt="${producto.Nombre}">
                <p>${producto.Precio}</p>
                </article>
            </a>
            <div class="tarjeta-boton">
                <button type="button" class="agregar" data-id="${producto.Id}">¡Lo quiero!</button>
            </div>
            `;
            destacadosDiv.appendChild(productoDiv);
        });
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Función para ver detalles del producto
function verDetalleProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    fetch('../assets/data/productos.json')
    .then(response => response.json())
    .then(data => {
        const producto = data.find(p => p.Id === productId);
        if (producto) {
            document.getElementById('producto-nombre').textContent = producto.Nombre;
            document.getElementById('producto-imagen').src = producto.Imagen;
            document.getElementById('producto-descripcion').textContent = producto.Descripcion;
            document.getElementById('producto-precio').textContent = producto.Precio;

            const botonDiv = document.getElementById('boton-agregar-carrito');
            botonDiv.innerHTML = `
            <button type="button" class="agregar" data-id="${producto.Id}">¡Lo quiero!</button>
            `;
        }
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Función para listar todos los productos en Productos
function listarProductos() {
    fetch('../assets/data/productos.json')
    .then(response => response.json())
    .then(data => {
        const productosDiv = document.getElementById('productos');
        productosDiv.innerHTML = '';
        data.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('tarjeta-link');
            productoDiv.innerHTML = `
            <a href="./detalle.html?id=${producto.Id}">
                <article class="tarjeta">
                <h2>${producto.Nombre}</h2>
                <img src="${producto.Imagen}" alt="${producto.Nombre}">
                <p>${producto.Precio}</p>
                </article>
            </a>
            <div class="tarjeta-boton">
                <button type="button" class="agregar" data-id="${producto.Id}">¡Lo quiero!</button>
            </div>
            `;
            productosDiv.appendChild(productoDiv);
        });
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Función para mostrar el mensaje de confirmación
function mostrarMensajeConfirmacion(mensaje) {
    const mensajeDiv = document.getElementById('mensaje-confirmacion');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.display = 'block';
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 3000);
}

function mostrarMensajePago() {
    const mensajePagoDiv = document.getElementById('mensaje-pago');
    mensajePagoDiv.textContent = 'Redirigiendo a la página de pago...';
    mensajePagoDiv.style.display = 'block';
    setTimeout(() => {
      mensajePagoDiv.style.display = 'none';
      window.location.href = '../index.html';
    }, 3000);
}

// función para actualizar etiqueta de cantidades en carrito
function actualizarCantidadCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const carritoCantidad = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    const carritoCantidadSpan = document.getElementById('carrito-cantidad');

    if (carritoCantidad > 0) {
        carritoCantidadSpan.textContent = carritoCantidad;
        carritoCantidadSpan.style.display = 'block';
    } else {
        carritoCantidadSpan.style.display = 'none';
    }
}

// Función para agregar al carrito
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
function agregarAlCarrito(id) {
    fetch('../assets/data/productos.json')
    .then(response => response.json())
    .then(data => {
        const producto = data.find(p => p.Id === id);
        if (producto) {
            const productoEnCarrito = carrito.find(p => p.id === id);
            if (productoEnCarrito) {
                productoEnCarrito.cantidad += 1;
            } else {
            const nuevoProducto = {
                id: producto.Id,
                nombre: producto.Nombre,
                precio: parseFloat(producto.Precio.replace(/[^0-9.-]+/g, "")),
                cantidad: 1
            };
            carrito.push(nuevoProducto);
            }
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarMensajeConfirmacion(`${producto.Nombre} ha sido agregado al carrito.`);
            actualizarCantidadCarrito();
            setTimeout(() => {
                const currentPath = window.location.pathname;
                if (currentPath.includes('index.html')) {
                    window.location.href = './pages/carrito.html';
                } else {
                    window.location.href = './carrito.html';
                }
            }, 3000);
        }
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}  

// Función para listar productos en el carrito
function listarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const carritoDiv = document.getElementById('carrito');
    const mensajeCarritoVacio = document.getElementById('mensaje-carrito-vacio');
    const detalleCarrito = document.getElementById('detalle-carrito');
    const carritoItems = document.getElementById('carrito-items');
    const totalFinal = document.getElementById('total-final');
    
    carritoDiv.innerHTML = '';
    carritoItems.innerHTML = '';
    
    if (carrito.length === 0) {
      mensajeCarritoVacio.style.display = 'block';
      detalleCarrito.style.display = 'none';
    } else {
      mensajeCarritoVacio.style.display = 'none';
      detalleCarrito.style.display = 'block';
      
      let total = 0;
      
      carrito.forEach(producto => {
        const totalParcial = producto.precio * producto.cantidad;
        total += totalParcial;
        
        const productoRow = document.createElement('tr');
        productoRow.innerHTML = `
          <td>${producto.nombre}</td>
          <td>
            <button class="decrementar" data-id="${producto.id}">-</button>
            ${producto.cantidad}
            <button class="incrementar" data-id="${producto.id}">+</button>
          </td>
          <td>$${producto.precio.toFixed(2)}</td>
          <td>$${totalParcial.toFixed(2)}</td>
          <td><button class="eliminar" data-id="${producto.id}">Eliminar</button></td>
        `;
        carritoItems.appendChild(productoRow);
      });

      totalFinal.textContent = total.toFixed(2);
    }
    console.log('Productos en Carrito:', carrito);
} 

// Manejo de eventos de clic en botones desde carrito (prod-vaciar-pagar)
document.addEventListener('DOMContentLoaded', () => {
    actualizarCantidadCarrito();

    if (document.getElementById('ver-mas-productos')) {
        document.getElementById('ver-mas-productos').addEventListener('click', () => {
            window.location.href = './productos.html';
        });
    }

    if (document.getElementById('vaciar-carrito')) {
        document.getElementById('vaciar-carrito').addEventListener('click', () => {
            localStorage.removeItem('carrito');
            listarCarrito();
        });
    }

    if (document.getElementById('ir-a-pagar')) { 
        document.getElementById('ir-a-pagar').addEventListener('click', () => { 
            mostrarMensajePago();
        })
    }

    if (document.getElementById('productos-destacados')) {
        mostrarProductosDestacados();
    }
    if (document.getElementById('productos')) {
        listarProductos();
    }
    if (document.getElementById('producto-nombre')) {
        verDetalleProducto();
    }
    if (document.getElementById('carrito')) {
        listarCarrito();
    }
});

// Manejo de eventos de clic para agregar al carrito
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('agregar')) {
        const id = event.target.dataset.id;
        agregarAlCarrito(id);
    }
});

// Manejo de evento de clic para gestionar productos en carrito
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('incrementar')) {
        const id = event.target.dataset.id;
        const producto = carrito.find(p => p.id == id);
        if (producto) {
            producto.cantidad += 1;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            listarCarrito();
        }
    }

    if (event.target.classList.contains('decrementar')) {
        const id = event.target.dataset.id;
        const producto = carrito.find(p => p.id == id);
        if (producto && producto.cantidad > 1) {
            producto.cantidad -= 1;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            listarCarrito();
        }
    }

    if (event.target.classList.contains('eliminar')) {
        const id = event.target.dataset.id;
        const index = carrito.findIndex(p => p.id == id);
        if (index !== -1) {
            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            listarCarrito();
        }
    }
});
  