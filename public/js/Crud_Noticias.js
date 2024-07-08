$(document).ready(function () {
    // Función para cargar las noticias
    function loadNews() {
        $.ajax({
            url: '/api/news',
            method: 'GET',
            success: function (data) {
                let newsTable = '';
                data.forEach(news => {
                    newsTable += `
                        <tr>
                            <td>${news.id}</td>
                            <td>${news.title}</td>
                            <td>${news.description}</td>
                            <td>${news.image_url}</td>
                            <td>
                                <button class="btn btn-warning btn-sm edit-btn" data-id="${news.id}">Editar</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${news.id}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });
                $('#newsTable').html(newsTable);
            }
        });
    }

    loadNews();

    // Agregar o editar noticia
    $('#newsForm').submit(function (event) {
        event.preventDefault();
        const id = $('#newsId').val();
        const title = $('#newsTitle').val();
        const description = $('#newsDescription').val();
        const image_url = $('#newsImageUrl').val();
        const newsData = { title, description, image_url };
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/news/${id}` : '/api/news';

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(newsData),
            success: function () {
                $('#newsModal').modal('hide');
                $('#newsForm')[0].reset();
                loadNews();
            }
        });
    });

    // Editar noticia
    $(document).on('click', '.edit-btn', function () {
        const id = $(this).data('id');
        $.ajax({
            url: `/api/news/${id}`,
            method: 'GET',
            success: function (data) {
                $('#newsId').val(data.id);
                $('#newsTitle').val(data.title);
                $('#newsDescription').val(data.description);
                $('#newsImageUrl').val(data.image_url);
                $('#newsModalLabel').text('Editar Noticia');
                $('#newsModal').modal('show');
            }
        });
    });

    // Eliminar noticia
    $(document).on('click', '.delete-btn', function () {
        const id = $(this).data('id');
        if (confirm('¿Estás seguro de eliminar esta noticia?')) {
            $.ajax({
                url: `/api/news/${id}`,
                method: 'DELETE',
                success: function () {
                    loadNews();
                }
            });
        }
    });

    // Limpiar el formulario y el modal al cerrarlo
    $('#newsModal').on('hidden.bs.modal', function () {
        $('#newsForm')[0].reset();
        $('#newsId').val('');
        $('#newsModalLabel').text('Agregar Noticia');
    });
});