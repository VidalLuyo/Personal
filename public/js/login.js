document.addEventListener('DOMContentLoaded', function () {
    const messageElement = document.getElementById('message');

    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Enviar datos de login al servidor
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Email o contraseña incorrectos');
                }
                return response.json();
            })
            .then(data => {
                // Mostrar mensaje según la respuesta del servidor
                if (data.message === 'Login exitoso') {
                    showMessage('¡Usted inicio como administradorcorrectamente!.', '#838181');
                    setTimeout(() => {
                        messageElement.classList.add('hidden');
                        window.location.href = 'http://127.0.0.1:3000/public/Crud_Noticias.html'; // Redirección exitosa después de 5 segundos
                    }, 3000); // 5 segundos en milisegundos (5 * 1000)
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                // Mostrar mensaje de error
                showMessage('Error: ' + error.message, '#838181');
                setTimeout(() => {
                    messageElement.classList.add('hidden');
                }, 3000); // 5 segundos en milisegundos (5 * 1000)
            });
    });

    function showMessage(text, backgroundColor) {
        messageElement.textContent = text;
        messageElement.style.backgroundColor = backgroundColor;
        messageElement.style.display = 'block';
        messageElement.classList.remove('hidden');
    }
});
