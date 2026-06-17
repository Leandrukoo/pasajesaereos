document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.form-recuperar-contra');
    form.removeAttribute('action');  // Prevenir envío real
    form.addEventListener('submit', manejarRecuperacion);
});

function manejarRecuperacion(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    
    if (!validarEmail(email)) {
        mostrarNotificacion('Email inválido', 'error');
        return;
    }
    
    const usuarioRegistrado = cargarDatos('usuarioRegistrado');
    if (!usuarioRegistrado || usuarioRegistrado.email !== email) {
        mostrarNotificacion('Email no registrado', 'error');
        return;
    }
    
    const codigoRecuperacion = generarCodigo();
    guardarDatos('codigoRecuperacion', {
        email,
        codigo: codigoRecuperacion,
        fechaExpiracion: new Date().getTime() + 3600000  // 1 hora
    });
    
    mostrarNotificacion('Revisa tu email para instrucciones', 'exito');
    setTimeout(() => window.location.href = '../index.html', 1500);
}

function generarCodigo() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}