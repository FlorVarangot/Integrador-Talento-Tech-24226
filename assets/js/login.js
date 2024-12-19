//Validaciones para el formulariode log in
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('login-message');

    form.addEventListener('submit', function(event) {
        let valid = true;

        if (emailInput.value.trim() === '') {
            mostrarError(emailInput, 'Por favor, ingresa tu correo electrónico.');
            valid = false;
        } else {
            limpiarError(emailInput);
        }

        if (passwordInput.value.trim() === '') {
            mostrarError(passwordInput, 'Por favor, ingresa tu contraseña.');
            valid = false;
        } else {
            limpiarError(passwordInput);
        }

        if (!valid) {
            event.preventDefault();
        } else {
            loginMessage.style.display = 'block';
        }
    });

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
