var index = 0;
var imagenes = document.querySelectorAll('.slider img');
var totalImagenes = imagenes.length;

function mostrarImagen(indice) {
    // Ocultar todas las imágenes y mostrar solo la que corresponde al índice
    for (var i = 0; i < imagenes.length; i++) {
        if (i === indice) {
            imagenes[i].classList.add('active');
        } else {
            imagenes[i].classList.remove('active');
        }
    }
}

function siguienteSlide() {
    index = (index + 1) % totalImagenes;
    mostrarImagen(index);
}

function anteriorSlide() {
    index = (index - 1 + totalImagenes) % totalImagenes;
    mostrarImagen(index);
}

// Mostrar primera imagen al cargar la página
mostrarImagen(index);

// Cambiar imagen cada 3 segundos
setInterval(siguienteSlide, 3000);