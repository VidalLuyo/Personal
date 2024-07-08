$(document).ready(function() {
    // Cargar las fechas cívicas al cargar la página
    fetchFechas();

    // Mostrar el modal para agregar una nueva fecha cívica
    $('#addFechaBtn').click(function() {
        $('#fechaModalLabel').text('Agregar Fecha Cívica');
        $('#fechaForm')[0].reset();
        $('#fechaId').val('');
        $('#fechaModal').modal('show');
    });

    // Manejar el guardado de la fecha cívica (agregar o editar)
    $('#saveFechaBtn').click(function() {
        const id = $('#fechaId').val();
        if (id) {
            updateFecha(id);
        } else {
            addFecha();
        }
        $('#fechaModal').modal('hide');
    });

    // Función para obtener todas las fechas cívicas
    function fetchFechas() {
        $.ajax({
            url: '/api/events',
            method: 'GET',
            success: function(data) {
                $('#fechasTableBody').empty();
                data.forEach(fecha => {
                    $('#fechasTableBody').append(`
                        <tr>
                            <td>${fecha.id}</td>
                            <td>${fecha.start}</td>
                            <td>${fecha.title}</td>
                            <td>${fecha.description}</td>
                            <td>
                                <button class="btn btn-warning btn-sm edit-btn" data-id="${fecha.id}">Editar</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${fecha.id}">Eliminar</button>
                            </td>
                        </tr>
                    `);
                });
            }
        });
    }

    // Mostrar modal de edición al hacer clic en el botón "Editar"
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        editFecha(id);
    });

    function editFecha(id) {
        console.log('Editando fecha con ID:', id);
        $.ajax({
            url: `/api/events/${id}`,
            method: 'GET',
            success: function(fecha) {
                console.log('Datos recibidos:', fecha);
                // Resto del código para llenar el formulario modal
                $('#fechaId').val(fecha.id);
                // Formatear la fecha a yyyy-mm-dd para el input type="date"
                const formattedDate = fecha.fecha.split('T')[0];
                $('#fecha').val(formattedDate);
                $('#nombre_evento').val(fecha.nombre_evento);
                $('#descripcion').val(fecha.descripcion);
                $('#fechaModalLabel').text('Editar Fecha Cívica');
                $('#fechaModal').modal('show');
            },
            error: function(xhr, status, error) {
                console.error('Error en la solicitud AJAX:', error);
            }
        });
    }
    
    
    

    // Función para agregar una nueva fecha cívica
    function addFecha() {
        const nuevaFecha = {
            fecha: $('#fecha').val(),
            nombre_evento: $('#nombre_evento').val(),
            descripcion: $('#descripcion').val()
        };
        $.ajax({
            url: '/api/events',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(nuevaFecha),
            success: function(response) {
                fetchFechas();
                $('#fechaForm')[0].reset();
            }
        });
    }

    // Función para actualizar una fecha cívica
    function updateFecha(id) {
        const fechaActualizada = {
            fecha: $('#fecha').val(),
            nombre_evento: $('#nombre_evento').val(),
            descripcion: $('#descripcion').val()
        };
        $.ajax({
            url: `/api/events/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(fechaActualizada),
            success: function(response) {
                fetchFechas();
                $('#fechaForm')[0].reset();
                $('#fechaId').val('');
            }
        });
    }

    // Eliminar una fecha cívica al hacer clic en el botón "Eliminar"
    $(document).on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        if (confirm('¿Estás seguro de eliminar esta fecha cívica?')) {
            $.ajax({
                url: `/api/events/${id}`,
                method: 'DELETE',
                success: function(response) {
                    fetchFechas();
                }
            });
        }
    });
});
