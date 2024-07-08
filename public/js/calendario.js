document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        events: '/api/events', // Ruta para obtener los eventos del calendario desde Express.js
        dateClick: function(info) {
            let clickedDate = info.date;
            let eventsOnDate = calendar.getEvents().filter(function(event) {
                return event.start.toISOString().split('T')[0] === clickedDate.toISOString().split('T')[0];
            });

            let eventDetails = '';
            if (eventsOnDate.length > 0) {
                let eventosHTML = eventsOnDate.map(function(event) {
                    return `
                    <div class="event-info">
                        <div class="event-name">${event.title}</div>
                        <div class="event-description">${event.extendedProps.description}</div>
                    </div>
                    `;
                }).join('');
                
                eventDetails = `
                <div class="event-container">
                    <div class="event-date">Eventos para ${clickedDate.toLocaleDateString('es-ES', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</div>
                    <div class="event-list">${eventosHTML}</div>
                </div>
                `;
            } else {
                eventDetails = '<div class="no-events">No hay eventos para esta fecha.</div>';
            }

            mostrarCuadroEventos(eventDetails);
        }
    });

    calendar.render();

    function mostrarCuadroEventos(detallesEvento) {
        let cuadroEvento = document.getElementById('eventBox');
        let contenedorDetallesEvento = document.getElementById('eventDetails');
        let botonCerrar = cuadroEvento.querySelector('.close');

        contenedorDetallesEvento.innerHTML = detallesEvento;
        cuadroEvento.style.display = 'block';

        botonCerrar.onclick = function() {
            cuadroEvento.style.display = 'none';
        };
    }
});
