document.addEventListener('DOMContentLoaded', function () {
    const nombresInput = document.getElementById('nombres');
    const apellidosInput = document.getElementById('apellidos');
    const celularInput = document.getElementById('celular');
    const submitButton = document.getElementById('submit-button');

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 1000);
        }, 1000);
    }

    function redirectToPageWithLoader(url) {
        const loader = document.createElement('div');
        loader.classList.add('loader');
        document.body.appendChild(loader);

        setTimeout(() => {
            window.location.href = url;
            loader.remove(); // Elimina el loader después de la redirección
        }, 500); // Tiempo de espera simulado (ajusta según sea necesario)
    }

    if (nombresInput) {
        nombresInput.addEventListener('input', function () {
            const value = this.value;
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
                this.value = value.slice(0, -1);
                showNotification('Solo se permiten letras y espacios en el campo de nombres');
            }
        });
    }

    if (apellidosInput) {
        apellidosInput.addEventListener('input', function () {
            const value = this.value;
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
                this.value = value.slice(0, -1);
                showNotification('Solo se permiten letras y espacios en el campo de apellidos');
            }
        });
    }

    if (celularInput) {
        celularInput.addEventListener('input', function () {
            let value = this.value;
            value = value.replace(/\D/g, '');

            if (!/^9/.test(value) && value.length > 0) {
                this.value = value.slice(0, -1);
                showNotification('El número de celular debe empezar con 9');
                return;
            }

            if (value.length > 9) {
                this.value = value.slice(0, 9);
                showNotification('El número de celular debe tener máximo 9 dígitos');
                return;
            }

            this.value = value;
        });
    }

    if (submitButton) {
        submitButton.addEventListener('click', function (event) {
            // Validación adicional antes de enviar el formulario
            const nombresValue = nombresInput.value.trim();
            const apellidosValue = apellidosInput.value.trim();
            const celularValue = celularInput.value.trim();

            if (nombresValue === '') {
                showNotification('El campo de nombres no puede estar vacío');
                event.preventDefault();
            } else if (apellidosValue === '') {
                showNotification('El campo de apellidos no puede estar vacío');
                event.preventDefault();
            } else if (celularValue === '') {
                showNotification('El campo de celular no puede estar vacío');
                event.preventDefault();
            } else {
                redirectToPageWithLoader('http://localhost:3000/index.html');
            }
        });
    } else {
        console.error('El botón de envío no fue encontrado');
    }
});
