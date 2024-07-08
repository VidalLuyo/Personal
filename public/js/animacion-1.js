//FUNCION PARA IMAGENES. APARECE, DESAPARECE....

document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll('.about__img'); // Selecciona todas las imágenes con la clase 'about__img'

    function triggerAnimation(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate'); // Agrega la clase 'animate' cuando la imagen está en vista
            } else {
                entry.target.classList.remove('animate'); // Remueve la clase 'animate' cuando la imagen no está en vista
            }
        });
    }

    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 1
    }

    const observer = new IntersectionObserver(triggerAnimation, options);

    images.forEach(image => {
        observer.observe(image);
    });
});


// FUNCION PARA IMAGEN-DERECHA. APARECE,DESAPARECE,....


document.addEventListener("DOMContentLoaded", function () {
    const image = document.querySelector('.animated-img'); // Selecciona el elemento con la clase 'animated-img'

    function triggerAnimation(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                image.style.opacity = 1; // Cambia la opacidad a 1 cuando el elemento está en vista
            } else {
                image.style.opacity = 0; // Cambia la opacidad a 0 cuando el elemento no está en vista
            }
        });
    }

    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    }

    const observer = new IntersectionObserver(triggerAnimation, options);

    observer.observe(image);
});

//FUNCION HERO ZOOM AL PASAR EL CURSOR

document.addEventListener("DOMContentLoaded", function () {
    // Función para dividir el texto en palabras y aplicar el efecto de zoom a cada letra
    function applyZoomEffect(elementId) {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        const words = text.split(" "); // Dividir el texto en palabras

        // Crear un nuevo HTML con cada palabra envuelta en un span con clase 'zoomed-word'
        const newText = words.map(word => {
            // Para cada palabra, dividir en letras y envolver cada letra en un span con clase 'zoomed-letter'
            const letters = word.split("").map(letter => `<span class="zoomed-letter">${letter}</span>`).join("");
            return `<span class="zoomed-word">${letters}</span>`;
        }).join(" ");

        // Reemplazar el contenido del elemento con el nuevo HTML
        element.innerHTML = newText;

        // Agregar evento de mouseover a cada letra para el efecto de zoom
        const zoomedLetters = element.querySelectorAll(".zoomed-letter");
        zoomedLetters.forEach(letter => {
            letter.addEventListener("mouseover", function () {
                this.style.transform = "scale(1.5)"; // Ajusta la escala según sea necesario
                this.style.transition = "transform 0.3s ease-in-out"; // Transición suave para el efecto de zoom
            });
            letter.addEventListener("mouseout", function () {
                this.style.transform = "scale(1)"; // Restaura la escala original al quitar el mouse
                this.style.transition = "transform 0.3s ease-in-out"; // Transición suave para el efecto de zoom
            });
        });
    }

    // Llamar a la función para aplicar el efecto de zoom a los elementos
    applyZoomEffect("zoomed-text");
    applyZoomEffect("zoomed-span");
});

ScrollReveal().reveal('.hero-text, .animated-img, .Seccion, .seccion-actividad, .video,.carousel-wrapper,.imgWrapper, .card, .footer', {
    origin: 'bottom',
    distance: '20px',
    duration: 1000,
    delay: 100,
    opacity: 0,
    scale: 0.8,
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    reset: true         // Reinicia la animación cada vez que el elemento es visible
});