const ConsultasMenu = (function() {
    // Elementos del DOM
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const consultaForm = document.getElementById('consulta-form');
  
    // Función para alternar la visibilidad del menú desplegable
    function toggleDropdown() {
      dropdownContent.classList.toggle('show');
    }
  
    // Evento clic para alternar la visibilidad del menú desplegable
    dropdownBtn.addEventListener('click', toggleDropdown);
  
    // Evento submit para el formulario de consultas
    consultaForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Evita el envío del formulario por defecto
  
      // Obtener los valores del formulario
      const nombres = document.getElementById('nombre-input').value;
      const apellidos = document.getElementById('apellido-input').value;
      const email = document.getElementById('email-input').value;
      const telefono = document.getElementById('telefono-input').value;
      const consulta = document.getElementById('consulta-input').value;
  
      // Aquí puedes agregar la lógica para enviar la consulta mediante AJAX u otro método
      console.log('Consulta enviada:');
      console.log('Nombres:', nombres);
      console.log('Apellidos:', apellidos);
      console.log('Correo electrónico:', email);
      console.log('Teléfono:', telefono);
      console.log('Consulta:', consulta);
  
      // Puedes restablecer el formulario después del envío si es necesario
      consultaForm.reset();
    });
  
    // Devolver las funciones públicas (si las hay)
    return {
      // Puedes exportar funciones públicas aquí si es necesario
    };
  })();