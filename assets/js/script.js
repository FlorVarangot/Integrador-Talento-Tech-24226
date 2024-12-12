document.addEventListener('DOMContentLoaded', () => {
    fetch('../assets/data/productos.json')
      .then(response => response.json())
      .then(data => {
        const productosDiv = document.getElementById('productos');
        data.forEach(producto => {
          const productoDiv = document.createElement('a');
          productoDiv.href = './detalle.html';
          productoDiv.classList.add('tarjeta-link');
          productoDiv.innerHTML = `
            <article class="tarjeta">
              <h2>${producto.Nombre}</h2>
              <img src="${producto.Imagen}" alt="${producto.Nombre}">
              <p>${producto.Descripcion}</p>
              <p>${producto.Precio}</p>
              <div class="tarjeta-boton">
                <button type="submit">¡Lo quiero!</button>
              </div>
            </article>
          `;
          productosDiv.appendChild(productoDiv);
        });
        console.log(data);
      })
      .catch(error => console.error('Error al cargar el archivo JSON:', error));
  });
  