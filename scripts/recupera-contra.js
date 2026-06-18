document.addEventListener('DOMContentLoaded', function() {
    personalizarSegunSesion();

    const form = document.querySelector('.form-recuperar-contra');
    form.removeAttribute('action');  // Prevenir envío real
    form.addEventListener('submit', manejarRecuperacion);
});

function personalizarSegunSesion() {
    const usuarioLogueado = cargarDatos('usuarioLogueado');
    if (!usuarioLogueado) return;

    const logoContainer = document.querySelector('.logo-perfil-container');
    if (logoContainer) {
        const linkPerfil = document.createElement('a');
        linkPerfil.href = 'perfil.html';
        linkPerfil.className = 'link-perfil';
        linkPerfil.textContent = `¡Hola, ${usuarioLogueado.nombre.split(' ')[0]}!`;
        logoContainer.appendChild(linkPerfil);
    }

    const ulHeader = document.querySelector('.ul_header');
    if (ulHeader) {
        ulHeader.innerHTML = `
            <li class="li_header"><a href="inicio.html">Inicio</a></li>
            <li class="li_header"><a href="vuelos.html">Vuelos</a></li>
            <li class="li_header"><a href="ofertas.html">Ofertas</a></li>
            <li class="li_header"><a href="contacto.html">Contacto</a></li>
            <li class="li_header"><a href="perfil.html">Perfil</a></li>
            <li class="li_header"><a href="../index.html">Cerrar sesión</a></li>
        `;
    }

    const seccion = document.querySelector('.seccion-recuperar-contra');
    if (seccion) {
        const btnVolver = document.createElement('button');
        btnVolver.type = 'button';
        btnVolver.className = 'btn-volver';
        btnVolver.textContent = 'Volver';
        btnVolver.addEventListener('click', volverAtras);
        seccion.insertBefore(btnVolver, seccion.firstChild);
    }
}

function manejarRecuperacion(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    
    if (!validarEmail(email)) {
        mostrarNotificacion('Email inválido', 'error');
        return;
    }
    
    const usuariosRegistrados = cargarDatos('usuariosRegistrados') || [];
    const usuarioRegistrado = usuariosRegistrados.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!usuarioRegistrado) {
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