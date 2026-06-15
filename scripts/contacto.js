// Form de contacto

document.addEventListener('DOMContentLoaded', function() {
    inicializarFormularioContacto();
    configurarEventosContacto();
});

// Inicializar formulario de contacto
function inicializarFormularioContacto() {
    console.log('✓ Contacto.js cargado');

    // Restaurar datos si existen
    const datosGuardados = cargarDatos('formularioContacto');
    if (datosGuardados) {
        document.getElementById('nombre').value = datosGuardados.nombre || '';
        document.getElementById('email').value = datosGuardados.email || '';
        document.getElementById('telefono').value = datosGuardados.telefono || '';
        document.getElementById('mensaje').value = datosGuardados.mensaje || '';
    }
}

// Configurar eventos del formulario
function configurarEventosContacto() {
    const form = document.querySelector('form');
    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const inputTelefono = document.getElementById('telefono');
    const textareaMensaje = document.getElementById('mensaje');
    const btnEnviar = form.querySelector('button[type="submit"]');
    const btnCancelar = form.querySelector('button[type="reset"]');

    // Validacion en tiempo real
    inputNombre.addEventListener('blur', validarNombreContacto);
    inputEmail.addEventListener('blur', validarEmailContacto);
    inputTelefono.addEventListener('blur', validarTelefonoContacto);
    textareaMensaje.addEventListener('blur', validarMensajeContacto);

    // Guardar datos mientras se escriben
    [inputNombre, inputEmail, inputTelefono, textareaMensaje].forEach(input => {
        input.addEventListener('input', guardarDatosFormularioContacto);
    });

    // Envio del formulario
    form.addEventListener('submit', manejarEnvioContacto);

    // Reset del formulario
    btnCancelar.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('¿Seguro que deseas limpiar el formulario?')) {
            form.reset();
            limpiarDatos('formularioContacto');
            mostrarNotificacion('Formulario limpiado', 'info');
        }
    });
}

// Validar nombre
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

// Validar email
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

// Validar telefono
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

// Validar mensaje
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

// Aplicar estilo de validacion
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

// Guardar datos del formulario
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

// Manejar envio del formulario
function manejarEnvioContacto(event) {
    event.preventDefault();

    // Validar todos los campos
    const esNombreValido = validarNombreContacto();
    const esEmailValido = validarEmailContacto();
    const esTelefonoValido = validarTelefonoContacto();
    const esMensajeValido = validarMensajeContacto();

    if (!esNombreValido || !esEmailValido || !esTelefonoValido || !esMensajeValido) {
        mostrarNotificacion('Por favor completa todos los campos correctamente', 'error');
        return;
    }

    // Crear objeto con los datos del mensaje
    const datosContacto = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        mensaje: document.getElementById('mensaje').value,
        fechaEnvio: new Date().toISOString(),
        id: Date.now() 
    };

    // Guardar mensaje
    guardarMensajeContacto(datosContacto);

    // Mostrar confirmación
    mostrarConfirmacionEnvio(datosContacto);

    // Limpiar formulario
    event.target.reset();

    // Limpiar datos guardados
    limpiarDatos('formularioContacto');

    console.log('✓ Mensaje enviado:', datosContacto);
}

// Guardar mensaje en lista de contactos
function guardarMensajeContacto(datos) {
    // Obtener mensajes anteriores
    let mensajes = cargarDatos('mensajesContacto') || [];

    // Agregar nuevo mensaje
    mensajes.push(datos);

    // Guardar lista actualizada
    guardarDatos('mensajesContacto', mensajes);

    console.log(`✓ Mensaje #${datos.id} guardado en mensajesContacto`);
}

// Mostrar confirmacion de envio
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

    const main = document.querySelector('main');
    const formulario = main.querySelector('form');
    main.insertBefore(confirmacion, formulario);

    // Auto-remover despues de 5 segundos
    setTimeout(() => {
        confirmacion.style.animation = 'fadeOut 0.5s ease-in-out';
        setTimeout(() => confirmacion.remove(), 500);
    }, 5000);

    mostrarNotificacion('Mensaje enviado correctamente', 'exito');
}

// Estilos dinamicos
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

// Inyectar estilos
agregarEstilosContacto();


console.log('✓ Contacto.js cargado - Formulario de contacto activo');
