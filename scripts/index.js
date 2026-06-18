document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.form-iniciar-sesion');
    if (!form) return;
    form.removeAttribute('action');
    form.addEventListener('submit', manejarLogin);
});

function manejarLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const usuariosRegistrados = cargarDatos('usuariosRegistrados') || [];
    const usuarioPorDefecto = {
        nombre: 'Juan Perez',
        email: 'test@test.com',
        password: '1234',
        dni: '12345678',
        telefono: '+54 11 1234-5678',
        pais: 'Argentina'
    };

    const usuarioRegistrado = usuariosRegistrados.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    let usuarioValido = null;
    if (usuarioRegistrado) {
        usuarioValido = usuarioRegistrado;
    } else if (email === usuarioPorDefecto.email && password === usuarioPorDefecto.password) {
        usuarioValido = usuarioPorDefecto;
    }

    if (usuarioValido) {
        guardarDatos('usuarioLogueado', {
            nombre: usuarioValido.nombre,
            email: usuarioValido.email,
            dni: usuarioValido.dni || '',
            telefono: usuarioValido.telefono || '',
            pais: usuarioValido.pais || ''
        });
        mostrarNotificacion('Iniciando sesión...', 'exito');
        setTimeout(() => { window.location.href = 'pages/inicio.html'; }, 800);
    } else {
        mostrarNotificacion('Email o contraseña incorrectos', 'error');
    }
}
