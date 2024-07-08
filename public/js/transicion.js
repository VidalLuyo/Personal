document.addEventListener('DOMContentLoaded', function () {
    const elements = document.querySelectorAll('.slide-in');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, index * 100);
    });
});