let currentSlideIndex = 0;
let intervalId;

function fetchNews() {
    fetch("http://44.194.224.101:3000/api/news")
        .then(response => response.json())
        .then(data => {
            const carouselSlide = document.getElementById("carouselSlide");
            const carouselDots = document.getElementById("carouselDots");

            // Limpiar el carrusel antes de agregar nuevas noticias
            carouselSlide.innerHTML = "";
            carouselDots.innerHTML = "";

            // Agregar cada noticia al carrusel una por una
            data.forEach((newsItem, index) => {
                const newsDiv = document.createElement("div");
                newsDiv.classList.add("carousel-item");
                newsDiv.innerHTML = `
                    <div class="carousel-caption">
                        <h2>NOTICIAS</h2>
                        <h3>${newsItem.title}</h3>
                        <p>${newsItem.description}</p>
                        <img src='${newsItem.image_url}' alt='${newsItem.title}'>
                    </div>
                `;
                // Agregar la noticia al carrusel
                carouselSlide.appendChild(newsDiv);

                // Crear puntos de navegación
                const dot = document.createElement("span");
                dot.classList.add("carousel-dot");
                dot.addEventListener("click", () => {
                    showSlide(index);
                });
                carouselDots.appendChild(dot);
            });

            // Iniciar el carrusel después de agregar todas las noticias
            showSlide(currentSlideIndex);
            startCarousel();
            addSwipeListeners();
        })
        .catch(error => console.error('Error fetching news:', error));
}

function startCarousel() {
    intervalId = setInterval(() => {
        nextSlide();
    }, 3000); // Cambiar cada segundos 
}

function stopCarousel() {
    clearInterval(intervalId);
}

function showSlide(index) {
    const carouselItems = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.carousel-dot');

    // Ocultar todas las noticias
    carouselItems.forEach(item => {
        item.style.display = 'none';
    });

    // Quitar la clase activa de todos los puntos
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    // Mostrar la noticia actual
    carouselItems[index].style.display = 'block';

    // Agregar la clase activa al punto correspondiente
    dots[index].classList.add('active');

    currentSlideIndex = index;
}

function addSwipeListeners() {
    const carouselContainer = document.getElementById("carrusel-container");

    if (carouselContainer) {
        let startX, endX;

        carouselContainer.addEventListener('touchstart', (event) => {
            stopCarousel();
            startX = event.touches[0].clientX;
        });

        carouselContainer.addEventListener('touchend', (event) => {
            endX = event.changedTouches[0].clientX;
            handleSwipe();
            startCarousel();
        });

        carouselContainer.addEventListener('mousedown', (event) => {
            stopCarousel();
            startX = event.clientX;
        });

        carouselContainer.addEventListener('mouseup', (event) => {
            endX = event.clientX;
            handleSwipe();
            startCarousel();
        });

        function handleSwipe() {
            if (startX - endX > 50) {
                nextSlide();
            } else if (endX - startX > 50) {
                prevSlide();
            }
        }
    } else {
        console.error('carouselContainer not found');
    }
}

function nextSlide() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    currentSlideIndex = (currentSlideIndex + 1) % carouselItems.length;
    showSlide(currentSlideIndex);
}

function prevSlide() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    currentSlideIndex = (currentSlideIndex - 1 + carouselItems.length) % carouselItems.length;
    showSlide(currentSlideIndex);
}

// Obtener y mostrar las noticias al cargar la página
document.addEventListener("DOMContentLoaded", fetchNews);
