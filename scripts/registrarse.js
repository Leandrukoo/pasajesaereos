document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.formulario');
    if (!form) return;
    form.removeAttribute('action');
    form.addEventListener('submit', manejarRegistro);
});

function manejarRegistro(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    if (password !== confirmPassword) {
        mostrarNotificacion('Las contraseñas no coinciden', 'error');
        return;
    }

    if (password.length < 4) {
        mostrarNotificacion('La contraseña debe tener al menos 4 caracteres', 'error');
        return;
    }

    const nuevoUsuario = {
        nombre: `${nombre} ${apellido}`,
        email,
        dni,
        telefono,
        password,
        pais: 'Argentina'
    };

    guardarDatos('usuarioRegistrado', nuevoUsuario);

    mostrarNotificacion('Cuenta creada exitosamente. Iniciá sesión para continuar.', 'exito');
    setTimeout(() => { window.location.href = '../index.html'; }, 1000);
}
