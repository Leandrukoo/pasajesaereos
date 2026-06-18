const perfilPorDefecto = {
    nombre: 'Juan Pérez',
    dni: '12345678',
    email: 'juan@gmail.com',
    telefono: '+54 11 1234-5678',
    pais: 'Argentina',
    ciudad: 'Buenos Aires',
    fechaRegistro: '2023-06-15'
};

const camposPerfil = [
    { propiedad: 'nombre', tipo: 'text', mensajeError: 'El nombre debe tener al menos 3 caracteres', validar: valor => valor.length >= 3 },
    { propiedad: 'dni', tipo: 'text', mensajeError: 'DNI inválido (7-10 dígitos)', validar: validarDNI },
    { propiedad: 'email', tipo: 'email', mensajeError: 'Email inválido', validar: validarEmail },
    { propiedad: 'telefono', tipo: 'tel', mensajeError: 'Teléfono inválido (10-15 dígitos)', validar: validarTelefono },
    { propiedad: 'pais', tipo: 'text', mensajeError: 'El país no puede estar vacío', validar: valor => valor.length > 0 }
];

document.addEventListener('DOMContentLoaded', function() {
    cargarPerfilUsuario();
    configurarNavegacionPerfil();
});


function cargarPerfilUsuario() {
    const usuarioLogueado = cargarDatos('usuarioLogueado');
    const datosCheckout = cargarDatos('datosCheckout');
    let perfilUsuario = { ...perfilPorDefecto };

    if (usuarioLogueado) {
        perfilUsuario.nombre = usuarioLogueado.nombre || perfilPorDefecto.nombre;
        perfilUsuario.email = usuarioLogueado.email || perfilPorDefecto.email;
        perfilUsuario.dni = usuarioLogueado.dni || perfilPorDefecto.dni;
        perfilUsuario.telefono = usuarioLogueado.telefono || perfilPorDefecto.telefono;
        perfilUsuario.pais = usuarioLogueado.pais || perfilPorDefecto.pais;
        guardarDatos('perfilUsuario', perfilUsuario);
    } else if (datosCheckout) {
        perfilUsuario.nombre = datosCheckout.nombre || perfilPorDefecto.nombre;
        perfilUsuario.email = datosCheckout.email || perfilPorDefecto.email;
        perfilUsuario.telefono = datosCheckout.telefono || perfilPorDefecto.telefono;
        guardarDatos('perfilUsuario', perfilUsuario);
    }

    const linkPerfil = document.querySelector('.link-perfil');
    if (linkPerfil) {
        linkPerfil.textContent = `¡Hola, ${perfilUsuario.nombre.split(' ')[0]}!`;
    }

    const nombreSidebar = document.querySelector('.sidebar-perfil h3');
    if (nombreSidebar) {
        nombreSidebar.textContent = perfilUsuario.nombre;
    }

    actualizarItemsPerfil(perfilUsuario);

    console.log('✓ Perfil de usuario cargado:', perfilUsuario);
}

function actualizarItemsPerfil(perfil) {
    const perfilCard = document.querySelector('.perfil-card');
    if (!perfilCard) return;

    const perfilItems = perfilCard.querySelectorAll('.perfil-item');

    const mapeo = [
        { etiqueta: 'Nombre completo', propiedad: 'nombre' },
        { etiqueta: 'DNI', propiedad: 'dni' },
        { etiqueta: 'Email', propiedad: 'email' },
        { etiqueta: 'Teléfono', propiedad: 'telefono' },
        { etiqueta: 'País', propiedad: 'pais' }
    ];

    perfilItems.forEach((item, index) => {
        if (mapeo[index]) {
            const valor = perfil[mapeo[index].propiedad];
            const pElement = item.querySelector('p');
            if (pElement) {
                pElement.textContent = valor;
            }
        }
    });

    if (!perfilCard.querySelector('.btn-editar-perfil')) {
        agregarBotonesEdicion(perfilCard);
    }

    console.log('✓ Items del perfil actualizados');
}

function agregarBotonesEdicion(perfilCard) {
    const contenedorBotones = document.createElement('div');
    contenedorBotones.className = 'botones-perfil';
    contenedorBotones.innerHTML = `
        <button class="btn-editar-perfil" onclick="habilitarEdicion()">Editar Perfil</button>
        <button class="btn-cambiar-contra" onclick="window.location.href='recuperar-contra.html'">Cambiar Contraseña</button>
        <button class="btn-salir" onclick="salirDeSesion()">Cerrar Sesión</button>
    `;
    contenedorBotones.style.cssText = `
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        flex-wrap: wrap;
    `;

    perfilCard.appendChild(contenedorBotones);

    const estilo = document.createElement('style');
    estilo.textContent = `
        .botones-perfil button {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            font-size: 1rem;
        }

        .btn-editar-perfil {
            background-color: #2196F3;
            color: white;
        }

        .btn-editar-perfil:hover {
            background-color: #1976D2;
            transform: translateY(-2px);
        }

        .btn-cambiar-contra {
            background-color: #757575;
            color: white;
        }

        .btn-cambiar-contra:hover {
            background-color: #5e5e5e;
            transform: translateY(-2px);
        }

        .btn-salir {
            background-color: #f44336;
            color: white;
        }

        .btn-salir:hover {
            background-color: #da190b;
            transform: translateY(-2px);
        }
    `;

    if (!document.querySelector('style[data-perfil="true"]')) {
        estilo.setAttribute('data-perfil', 'true');
        document.head.appendChild(estilo);
    }
}

function habilitarEdicion() {
    const perfilItems = document.querySelectorAll('.perfil-item');

    perfilItems.forEach((item, index) => {
        const p = item.querySelector('p');
        const campo = camposPerfil[index];

        if (p && campo) {
            const inputEdicion = document.createElement('input');
            inputEdicion.type = campo.tipo;
            inputEdicion.value = p.textContent;
            inputEdicion.className = 'input-edicion-perfil';
            inputEdicion.style.cssText = `
                width: 100%;
                padding: 0.5rem;
                border: 2px solid #2196F3;
                border-radius: 5px;
                background-color: rgb(40, 40, 48);
                color: white;
                font-size: 1rem;
            `;

            inputEdicion.addEventListener('blur', () => validarCampoPerfil(inputEdicion, campo));

            p.replaceWith(inputEdicion);
        }
    });

    const btnEditar = document.querySelector('.btn-editar-perfil');
    if (btnEditar) {
        btnEditar.textContent = 'Guardar Cambios';
        btnEditar.onclick = function() {
            guardarCambiosPerfil();
        };
    }

    const btnCambiarContra = document.querySelector('.btn-cambiar-contra');
    if (btnCambiarContra) {
        btnCambiarContra.style.display = 'none';
    }

    mostrarNotificacion('Modo edición activado', 'info');
}

function validarCampoPerfil(input, campo) {
    const valor = input.value.trim();
    const esValido = campo.validar(valor);
    input.style.borderColor = esValido ? '#4CAF50' : '#f44336';

    if (!esValido) {
        mostrarNotificacion(campo.mensajeError, 'error');
    }

    return esValido;
}

function guardarCambiosPerfil() {
    const perfilCard = document.querySelector('.perfil-card');
    const inputs = perfilCard.querySelectorAll('.input-edicion-perfil');

    const valores = {};
    let todoValido = true;

    inputs.forEach((input, index) => {
        const campo = camposPerfil[index];
        if (!campo) return;

        valores[campo.propiedad] = input.value.trim();

        if (!validarCampoPerfil(input, campo)) {
            todoValido = false;
        }
    });

    if (!todoValido) {
        mostrarNotificacion('Revisá los campos marcados en rojo', 'error');
        return;
    }

    const usuarioLogueado = cargarDatos('usuarioLogueado');
    const usuariosRegistrados = cargarDatos('usuariosRegistrados') || [];

    if (usuarioLogueado) {
        const emailEnUso = usuariosRegistrados.some(u =>
            u.email.toLowerCase() === valores.email.toLowerCase() &&
            u.email.toLowerCase() !== usuarioLogueado.email.toLowerCase()
        );

        if (emailEnUso) {
            mostrarNotificacion('Ya existe una cuenta con ese correo electrónico', 'error');
            return;
        }
    }

    const perfilActualizado = { ...perfilPorDefecto, ...valores };

    guardarDatos('perfilUsuario', perfilActualizado);

    if (usuarioLogueado) {
        const usuarioRegistrado = usuariosRegistrados.find(
            u => u.email.toLowerCase() === usuarioLogueado.email.toLowerCase()
        );

        if (usuarioRegistrado) {
            usuarioRegistrado.nombre = perfilActualizado.nombre;
            usuarioRegistrado.dni = perfilActualizado.dni;
            usuarioRegistrado.email = perfilActualizado.email;
            usuarioRegistrado.telefono = perfilActualizado.telefono;
            usuarioRegistrado.pais = perfilActualizado.pais;
            guardarDatos('usuariosRegistrados', usuariosRegistrados);
        }

        guardarDatos('usuarioLogueado', {
            ...usuarioLogueado,
            nombre: perfilActualizado.nombre,
            dni: perfilActualizado.dni,
            email: perfilActualizado.email,
            telefono: perfilActualizado.telefono,
            pais: perfilActualizado.pais
        });
    }

    inputs.forEach((input, index) => {
        const campo = camposPerfil[index];
        const p = document.createElement('p');
        p.textContent = valores[campo.propiedad];
        input.replaceWith(p);
    });

    const linkPerfil = document.querySelector('.link-perfil');
    if (linkPerfil) {
        linkPerfil.textContent = `¡Hola, ${perfilActualizado.nombre.split(' ')[0]}!`;
    }

    const btnGuardar = document.querySelector('.btn-editar-perfil');
    if (btnGuardar) {
        btnGuardar.textContent = 'Editar Perfil';
        btnGuardar.onclick = function() {
            habilitarEdicion();
        };
    }

    const btnCambiarContra = document.querySelector('.btn-cambiar-contra');
    if (btnCambiarContra) {
        btnCambiarContra.style.display = '';
    }

    mostrarNotificacion('Cambios guardados correctamente', 'exito');
    console.log('✓ Perfil actualizado:', perfilActualizado);
}

function configurarNavegacionPerfil() {
    const sidebarLinks = document.querySelectorAll('.sidebar-perfil a');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {

            document.querySelectorAll('.sidebar-perfil li').forEach(li => {
                li.classList.remove('active');
            });

            this.closest('li').classList.add('active');
        });
    });

    console.log('✓ Navegación del perfil configurada');
}

function salirDeSesion() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        limpiarDatos('usuarioLogueado');
        limpiarDatos('perfilUsuario');
        limpiarDatos('datosCheckout');
        limpiarDatos('vueloSeleccionado');

        mostrarNotificacion('Sesión cerrada', 'info');

        setTimeout(() => {
            redirigir('../index.html');
        }, 1500);
    }
}

console.log('✓ Perfil.js cargado - Perfil de usuario activo');
