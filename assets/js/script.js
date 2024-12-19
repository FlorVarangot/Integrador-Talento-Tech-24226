window.addEventListener('DOMContentLoaded', () => {
    resaltarPaginaActual();
});

// Función para resaltar la página actual en el nav
function resaltarPaginaActual() {
    const currentPath = window.location.pathname.replace(/\/$/, '');
    const enlaces = document.querySelectorAll('.nav-bottom a');

    enlaces.forEach(link => {
        const href = link.getAttribute('href');
        const resolvedHref = new URL(href, window.location.origin).pathname.replace(/\/$/, '');

        if (currentPath === resolvedHref) {
            link.classList.add('activo');
        } else {
            link.classList.remove('activo');
        }
    });
}

//Función para mostrar productos destacados en Index
function mostrarProductosDestacados() {
    fetch('../assets/data/productos.json')
    .then(response => response.json())
    .then(data => {
        const destacadosDiv = document.getElementById('productos-destacados');
        const idsDestacados = [2, 6, 1, 10];
        const productosDestacados = data.filter(producto => idsDestacados.includes(parseInt(producto.Id)));
        productosDestacados.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('tarjeta-link');
            productoDiv.innerHTML = `
            <div class="tarjeta">
                <a href="./pages/detalle.html?id=${producto.Id}" title="${producto.Nombre}">
                    <article class="tarjeta">
                    <h2>${producto.Nombre}</h2>
                    <img src="${producto.Imagenes[0]}" alt="${producto.Nombre}" title="${producto.Nombre}">
                    <p>${producto.Precio}</p>
                    <span class="sin-stock" style="display: ${producto.Disponible ? 'none' : 'block'};">Sin Stock</span>
                    </article>
                </a>
                <div class="tarjeta-boton">
                    <a href="./pages/detalle.html?id=${producto.Id}" class="link">Ver más</a>
                    <button type="button" class="agregar" data-id="${producto.Id}" ${producto.Disponible ? '' : 'disabled'}>¡Lo quiero!</button>
                </div>
            </div>
            `;
            destacadosDiv.appendChild(productoDiv);
        });
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

//Función para listar todos los productos en Productos
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
            <div class="tarjeta">
                <a href="./detalle.html?id=${producto.Id}" title="${producto.Nombre}">
                    <article class="tarjeta">
                    <h2>${producto.Nombre}</h2>
                    <img src="${producto.Imagenes[0]}" alt="${producto.Nombre}" >
                    <p>${producto.Precio}</p>
                    <span class="sin-stock" style="display: ${producto.Disponible ? 'none' : 'block'};">Sin Stock</span>
                    </article>
                </a>
                <div class="tarjeta-boton">
                    <a href="../pages/detalle.html?id=${producto.Id}" class="link">Ver más</a>
                    <button type="button" class="agregar" data-id="${producto.Id}" ${producto.Disponible ? '' : 'disabled'}>¡Lo quiero!</button>
                </div>
            </div>
            `;
            productosDiv.appendChild(productoDiv);
        });
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

//Función para la barra de búsqeda - filtrado en nav de Productos html
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const productosDiv = document.getElementById('productos');

    if (searchInput) {
        if (!window.location.pathname.includes('productos.html')) {
            searchInput.disabled = true;
            searchInput.style.cursor = 'not-allowed';
            searchInput.title = "No se puede buscar";
        }else{
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const basePath = window.location.pathname.includes('pages') ? '../assets/data/productos.json' : 'assets/data/productos.json';
                fetch(basePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    productosDiv.innerHTML = '';
                    const productosFiltrados = data.filter(producto => {
                        return producto.Nombre.toLowerCase().includes(searchTerm) ||
                            producto.Descripcion.toLowerCase().includes(searchTerm);
                    });

                    productosFiltrados.forEach(producto => {
                        const productoDiv = document.createElement('div');
                        productoDiv.classList.add('tarjeta-link');
                        productoDiv.innerHTML = `
                        <a href="./detalle.html?id=${producto.Id}">
                            <article class="tarjeta">
                            <h2>${producto.Nombre}</h2>
                            <img src="${producto.Imagenes[0]}" alt="${producto.Nombre}" title="${producto.Nombre}">
                            <p>${producto.Precio}</p>
                            <span class="sin-stock" style="display: ${producto.Disponible ? 'none' : 'block'};">Sin Stock</span>
                            </article>
                        </a>
                        <div class="tarjeta-boton">
                            <button type="button" class="agregar" data-id="${producto.Id}" ${producto.Disponible ? '' : 'disabled'}>¡Lo quiero!</button>
                        </div>
                        `;
                        productosDiv.appendChild(productoDiv);
                    });
                })
                .catch(error => console.error('Error al cargar el archivo JSON:', error));
            });
        }
    } else {
        console.error('Elemento con ID "search-input" o "productos" no encontrado.');
    }
});

//Mostrar el mensaje de confirmación (agregado a carrito)
function mostrarMensajeConfirmacion(mensaje) {
    const mensajeDiv = document.getElementById('mensaje-confirmacion');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.display = 'block';
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 3000);
}

//Mensaje "redirigiendo..." tras clic en Pagar
function mostrarMensajePago() {
    const mensajePagoDiv = document.getElementById('mensaje-pago');
    mensajePagoDiv.textContent = 'Redirigiendo a la página de pago...';
    mensajePagoDiv.style.display = 'block';
    setTimeout(() => {
      mensajePagoDiv.style.display = 'none';
      window.location.href = '../index.html';
    }, 3000);
}

//Función para actualizar etiqueta de cantidades en carrito
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

//Función para agregar al carrito
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
                cantidad: 1,
                imagen: producto.Imagenes[0]
            };
            carrito.push(nuevoProducto);
            }
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarMensajeConfirmacion(`Se agregó 1 ${producto.Nombre} al carrito.`);
            actualizarCantidadCarrito();
        }
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

//Función para listar productos en el carrito
function listarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const carritoDiv = document.getElementById('carrito');
    const mensajeCarritoVacio = document.getElementById('mensaje-carrito-vacio');
    const mensajeInfo = document.getElementById('mensaje-info');
    const detalleCarrito = document.getElementById('detalle-carrito');
    const carritoItems = document.getElementById('carrito-items');
    const totalFinal = document.getElementById('total-final');
    
    carritoDiv.innerHTML = '';
    carritoItems.innerHTML = '';
    
    if (carrito.length === 0) {
        mensajeCarritoVacio.style.display = 'block';
        detalleCarrito.style.display = 'none';
        mensajeInfo.style.display = 'none';
    } else {
        mensajeCarritoVacio.style.display = 'none';
        detalleCarrito.style.display = 'block';
        mensajeInfo.style.display = 'block';
        
        let total = 0;
        
        carrito.forEach(producto => {
            const totalParcial = producto.precio * producto.cantidad;
            total += totalParcial;
            
            const productoRow = document.createElement('tr');
            productoRow.innerHTML = `
                <td><img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-producto"></td>
                <td>
                    <button class="decrementar" data-id="${producto.id}">-</button>
                    ${producto.cantidad}
                    <button class="incrementar" data-id="${producto.id}">+</button>
                </td>
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toFixed(4)}</td>
                <td>$${totalParcial.toFixed(4)}</td>
                <td><button class="eliminar" title="Quitar del carrito" data-id="${producto.id}"><i class="fas fa-trash-alt"></i></button></td>
            `;
            carritoItems.appendChild(productoRow);
        });

        totalFinal.textContent = total.toFixed(4);
    }
    console.log('Productos en Carrito:', carrito);
}

//Carga de datos + eventos de clic en botones desde carrito (prod-vaciar-pagar)
document.addEventListener('DOMContentLoaded', () => {
    cargarReseñas();
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
            actualizarCantidadCarrito();
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

//Manejo de eventos de clic para agregar al carrito
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('agregar')) {
        const id = event.target.dataset.id;
        agregarAlCarrito(id);
    }
});

//Manejo de evento de clic para gestionar productos en carrito (+ - eliminar)
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('incrementar')) {
        const id = event.target.dataset.id;
        const producto = carrito.find(p => p.id == id);
        if (producto) {
            producto.cantidad += 1;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            listarCarrito();
            actualizarCantidadCarrito();
        }
    }

    if (event.target.classList.contains('decrementar')) {
        const id = event.target.dataset.id;
        const producto = carrito.find(p => p.id == id);
        if (producto && producto.cantidad > 1) {
            producto.cantidad -= 1;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            listarCarrito();
            actualizarCantidadCarrito();
        }
    }

    if (event.target.closest('.eliminar')) { 
        const id = event.target.closest('.eliminar').dataset.id; 
        const index = carrito.findIndex(p => p.id == id); 
        if (index !== -1) {
            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            listarCarrito();
            actualizarCantidadCarrito();
        }
    }
});

//Cargar reseñas
function cargarReseñas() {
    const rutaReseñas = window.location.pathname.includes('pages') ? '../assets/data/reseñas.json' : 'assets/data/reseñas.json';
    fetch(rutaReseñas)
    .then(response => response.json())
    .then(data => {
        mostrarReseñasIndex(data);
        mostrarReseñasBio(data);
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

//Mostrar reseñas en index
function mostrarReseñasIndex(reseñas) {
    const reseñasSection = document.getElementById('reseñas-section-index');
    if (!reseñasSection) return;
  
    reseñasSection.innerHTML = '<h3 class="item-grid">Opiniones</h3>';
  
    const reseñasMostrar = reseñas.slice(0, 3);
    reseñasMostrar.forEach(reseña => {
      const reseñaDiv = document.createElement('article');
      reseñaDiv.classList.add('tarjeta', 'tarjeta-reseña');
      reseñaDiv.innerHTML = `
        <div class="tarjeta-header">
          <h2>${reseña.Autor}</h2>
          <div class="estrellas">
            ${dibujarEstrellas(reseña['Puntos /5'])}
          </div>
        </div>
        <p>${reseña.Reseña}</p>
      `;
      reseñasSection.appendChild(reseñaDiv);
    });
  
    const verMasLink = document.createElement('a');
    verMasLink.href = './pages/bio.html';
    verMasLink.classList.add('ver-mas', 'item-grid');
    verMasLink.textContent = 'Ver más opiniones';
    reseñasSection.appendChild(verMasLink);
}

//Mostrar reseñas en bio
function mostrarReseñasBio(reseñas) {
    const reseñasSection = document.getElementById('reseñas-section-bio');
    if (!reseñasSection) return; 
    reseñasSection.innerHTML = '<h3 class="subtitulo item-grid">Opiniones</h3>';
    reseñas.forEach(reseña => {
        const reseñaDiv = document.createElement('article');
        reseñaDiv.classList.add('tarjeta', 'tarjeta-reseña');
        reseñaDiv.title = reseña.Autor;
        reseñaDiv.innerHTML = `
        <div class="tarjeta-header">
            <h2>${reseña.Autor}</h2>
            <div class="estrellas">
            ${dibujarEstrellas(reseña['Puntos /5'])}
            </div>
        </div>
        <p>${reseña.Reseña}</p>
        `;
        reseñasSection.appendChild(reseñaDiv);
    });
}

//Dibujar estrellas 
function dibujarEstrellas(puntos) {
    const estrellas = Math.round(parseFloat(puntos));
    let estrellasHTML = '';
    for (let i = 0; i < 5; i++) {
        if (i < estrellas) {
        estrellasHTML += '<i class="fas fa-star"></i>';
        } else {
        estrellasHTML += '<i class="far fa-star"></i>';
        }
    }
    return estrellasHTML;
}

//Validación para que el logo de Footer navegue al index según dónde esté
document.addEventListener('DOMContentLoaded', function() {
    const footerLogoLink = document.getElementById('footer-logo-link');
    if (footerLogoLink) {
        const isIndex = window.location.pathname === '/index.html' || window.location.pathname === '/';
        footerLogoLink.href = isIndex ? './index.html' : '../index.html';
    } else {
        console.error('Elemento con ID "footer-logo-link" no encontrado.');
    }
});
