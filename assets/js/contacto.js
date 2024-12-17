//Validaciones en el formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.formulario');
    const nombreInput = document.getElementById('nombre');
    const mailInput = document.getElementById('mail');
    const mensajeInput = document.getElementById('mensaje');
    const suscripcionCheckbox = document.getElementById('suscripcion');
    const mensajeEnvio = document.getElementById('mensaje-envio');

    form.addEventListener('submit', function(event) {
        let valid = true;

        // Validar nombre vacío
        if (nombreInput.value.trim() === '') {
            mostrarError(nombreInput, 'Por favor, ingresa tu nombre.');
            valid = false;
        } else {
            limpiarError(nombreInput);
        }

        // Validar mail -vacío y formato-
        if (!validarEmail(mailInput.value)) {
            mostrarError(mailInput, 'Por favor, ingresa un correo electrónico válido.');
            valid = false;
        } else {
            limpiarError(mailInput);
        }

        // Validar mensaje vacío
        if (mensajeInput.value.trim() === '') {
            mostrarError(mensajeInput, 'Por favor, ingresa un mensaje.');
            valid = false;
        } else {
            limpiarError(mensajeInput);
        }

        if (!valid) {
            event.preventDefault();
        } else {
            mensajeEnvio.textContent = 'Enviando mensaje...';
            mensajeEnvio.style.display = 'block';
        }
    });

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function mostrarError(input, mensaje) {
        const errorSpan = document.getElementById(`error-${input.id}`);
        errorSpan.textContent = mensaje;
        input.classList.add('error');
    }

    function limpiarError(input) {
        const errorSpan = document.getElementById(`error-${input.id}`);
        errorSpan.textContent = '';
        input.classList.remove('error');
    }
});


