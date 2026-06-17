document.addEventListener('DOMContentLoaded', function() {
    inicializarFormularioContacto();
    configurarEventosContacto();
});

function inicializarFormularioContacto() {
    console.log('✓ Contacto.js cargado');

    const datosGuardados = cargarDatos('formularioContacto');
    if (datosGuardados) {
        document.getElementById('nombre').value = datosGuardados.nombre || '';
        document.getElementById('email').value = datosGuardados.email || '';
        document.getElementById('telefono').value = datosGuardados.telefono || '';
        document.getElementById('mensaje').value = datosGuardados.mensaje || '';
    }
}

function configurarEventosContacto() {
    const form = document.querySelector('form');
    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const inputTelefono = document.getElementById('telefono');
    const textareaMensaje = document.getElementById('mensaje');
    const btnEnviar = form.querySelector('button[type="submit"]');
    const btnCancelar = form.querySelector('button[type="reset"]');

    inputNombre.addEventListener('blur', validarNombreContacto);
    inputEmail.addEventListener('blur', validarEmailContacto);
    inputTelefono.addEventListener('blur', validarTelefonoContacto);
    textareaMensaje.addEventListener('blur', validarMensajeContacto);

    [inputNombre, inputEmail, inputTelefono, textareaMensaje].forEach(input => {
        input.addEventListener('input', guardarDatosFormularioContacto);
    });

    form.addEventListener('submit', manejarEnvioContacto);

    btnCancelar.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('¿Seguro que deseas limpiar el formulario?')) {
            form.reset();
            limpiarDatos('formularioContacto');
            mostrarNotificacion('Formulario limpiado', 'info');
        }
    });
}

function validarNombreContacto() {
    const nombre = document.getElementById('nombre');
    const valor = nombre.value.trim();

    if (valor === '') {
        aplicarEstiloValidacion(nombre, false);
        return false;
    }

    if (valor.length < 3) {
        mostrarNotificacion('El nombre debe tener al menos 3 caracteres', 'error');
        aplicarEstiloValidacion(nombre, false);
        return false;
    }

    aplicarEstiloValidacion(nombre, true);
    return true;
}

function validarEmailContacto() {
    const email = document.getElementById('email');
    const valor = email.value.trim();

    if (valor === '') {
        aplicarEstiloValidacion(email, false);
        return false;
    }

    if (!validarEmail(valor)) {
        mostrarNotificacion('Email inválido', 'error');
        aplicarEstiloValidacion(email, false);
        return false;
    }

    aplicarEstiloValidacion(email, true);
    return true;
}

function validarTelefonoContacto() {
    const telefono = document.getElementById('telefono');
    const valor = telefono.value.trim();

    if (valor === '') {
        aplicarEstiloValidacion(telefono, null);
        return true;
    }

    if (!validarTelefono(valor)) {
        mostrarNotificacion('Teléfono inválido (10-15 dígitos)', 'error');
        aplicarEstiloValidacion(telefono, false);
        return false;
    }

    aplicarEstiloValidacion(telefono, true);
    return true;
}

function validarMensajeContacto() {
    const mensaje = document.getElementById('mensaje');
    const valor = mensaje.value.trim();

    if (valor === '') {
        aplicarEstiloValidacion(mensaje, false);
        return false;
    }

    if (valor.length < 10) {
        mostrarNotificacion('El mensaje debe tener al menos 10 caracteres', 'error');
        aplicarEstiloValidacion(mensaje, false);
        return false;
    }

    aplicarEstiloValidacion(mensaje, true);
    return true;
}

function aplicarEstiloValidacion(elemento, esValido) {
    if (esValido === true) {
        elemento.style.borderColor = '#4CAF50';
        elemento.style.boxShadow = '0 0 5px rgba(76, 175, 80, 0.3)';
    } else if (esValido === false) {
        elemento.style.borderColor = '#f44336';
        elemento.style.boxShadow = '0 0 5px rgba(244, 67, 54, 0.3)';
    } else {
        elemento.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        elemento.style.boxShadow = 'none';
    }
}

function guardarDatosFormularioContacto() {
    const datosFormulario = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        mensaje: document.getElementById('mensaje').value,
        fechaGuardado: new Date().toISOString()
    };

    guardarDatos('formularioContacto', datosFormulario);
}

function manejarEnvioContacto(event) {
    event.preventDefault();

    const esNombreValido = validarNombreContacto();
    const esEmailValido = validarEmailContacto();
    const esTelefonoValido = validarTelefonoContacto();
    const esMensajeValido = validarMensajeContacto();

    if (!esNombreValido || !esEmailValido || !esTelefonoValido || !esMensajeValido) {
        mostrarNotificacion('Por favor completa todos los campos correctamente', 'error');
        return;
    }

    const datosContacto = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        mensaje: document.getElementById('mensaje').value,
        fechaEnvio: new Date().toISOString(),
        id: Date.now() 
    };

    guardarMensajeContacto(datosContacto);

    mostrarConfirmacionEnvio(datosContacto);

    event.target.reset();

    limpiarDatos('formularioContacto');

    console.log('✓ Mensaje enviado:', datosContacto);
}

function guardarMensajeContacto(datos) {
    let mensajes = cargarDatos('mensajesContacto') || [];

    mensajes.push(datos);

    guardarDatos('mensajesContacto', mensajes);

    console.log(`✓ Mensaje #${datos.id} guardado en mensajesContacto`);
}

function mostrarConfirmacionEnvio(datos) {
    const confirmacion = document.createElement('div');
    confirmacion.className = 'confirmacion-envio';
    confirmacion.innerHTML = `
        <div style="
            background-color: rgba(76, 175, 80, 0.1);
            border: 2px solid #4CAF50;
            padding: 1.5rem;
            border-radius: 10px;
            margin: 2rem 0;
            text-align: center;
        ">
            <h3 style="color: #4CAF50; margin-top: 0;">✓ ¡Mensaje enviado con éxito!</h3>
            <p>Gracias por tu mensaje, <strong>${datos.nombre}</strong></p>
            <p>Nos pondremos en contacto en breve a:</p>
            <p style="font-style: italic; color: #2196F3;">${datos.email}</p>
            <small style="color: rgba(255, 255, 255, 0.6);">
                Enviado: ${new Date(datos.fechaEnvio).toLocaleString('es-AR')}
            </small>
        </div>
    `;

    const formulario = document.querySelector('main form');
    formulario.parentNode.insertBefore(confirmacion, formulario);

    setTimeout(() => {
        confirmacion.style.animation = 'fadeOut 0.5s ease-in-out';
        setTimeout(() => confirmacion.remove(), 500);
    }, 5000);

    mostrarNotificacion('Mensaje enviado correctamente', 'exito');
}

function agregarEstilosContacto() {
    const estilo = document.createElement('style');
    estilo.textContent = `
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }

        .formulario-contacto input,
        .formulario-contacto textarea {
            border: 2px solid rgba(255, 255, 255, 0.3) !important;
            transition: all 0.3s;
        }

        .formulario-contacto input:focus,
        .formulario-contacto textarea:focus {
            outline: none;
            border-color: #2196F3 !important;
        }

        .botones-formulario button {
            transition: all 0.3s !important;
        }

        .botones-formulario button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .botones-formulario button:active:not(:disabled) {
            transform: translateY(0);
        }
    `;

    document.head.appendChild(estilo);
}

agregarEstilosContacto();


console.log('✓ Contacto.js cargado - Formulario de contacto activo');
