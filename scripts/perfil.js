// Datos de perfil 
const perfilPorDefecto = {
    nombre: 'Juan Pérez',
    dni: '12345678',
    email: 'juan@gmail.com',
    telefono: '+54 11 1234-5678',
    pais: 'Argentina',
    ciudad: 'Buenos Aires',
    fechaRegistro: '2023-06-15'
};

document.addEventListener('DOMContentLoaded', function() {
    cargarPerfilUsuario();
    configurarNavegacionPerfil();
});


// Cargar perfil del usuario
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

    // Actualizar nombre en header
    const linkPerfil = document.querySelector('.link-perfil');
    if (linkPerfil) {
        linkPerfil.textContent = `¡Hola, ${perfilUsuario.nombre.split(' ')[0]}!`;
    }

    // Actualizar nombre en sidebar
    const nombreSidebar = document.querySelector('.sidebar-perfil h3');
    if (nombreSidebar) {
        nombreSidebar.textContent = perfilUsuario.nombre;
    }

    // Actualizar items del perfil
    actualizarItemsPerfil(perfilUsuario);

    console.log('✓ Perfil de usuario cargado:', perfilUsuario);
}


// Actualizar items del perfil 
function actualizarItemsPerfil(perfil) {
    const perfilCard = document.querySelector('.perfil-card');
    if (!perfilCard) return;

    const perfilItems = perfilCard.querySelectorAll('.perfil-item');

    // Mapeo de items a propiedades
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

    // Agregar botón de editar
    if (!perfilCard.querySelector('.btn-editar-perfil')) {
        agregarBotonesEdicion(perfilCard);
    }

    console.log('✓ Items del perfil actualizados');
}

// Agregar botones de edición
function agregarBotonesEdicion(perfilCard) {
    const contenedorBotones = document.createElement('div');
    contenedorBotones.className = 'botones-perfil';
    contenedorBotones.innerHTML = `
        <button class="btn-editar-perfil" onclick="habilitarEdicion()">Editar Perfil</button>
        <button class="btn-salir" onclick="salirDeSesion()">Cerrar Sesión</button>
    `;
    contenedorBotones.style.cssText = `
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        flex-wrap: wrap;
    `;

    perfilCard.appendChild(contenedorBotones);

    // Estilos para botones
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

// Habilitar edición de perfil
function habilitarEdicion() {
    const perfilItems = document.querySelectorAll('.perfil-item');

    perfilItems.forEach(item => {
        const p = item.querySelector('p');

        if (p) {
            const inputEdicion = document.createElement('input');
            inputEdicion.type = 'text';
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

            p.replaceWith(inputEdicion);
        }
    });

    // Cambiar botón de editar a guardar
    const btnEditar = document.querySelector('.btn-editar-perfil');
    if (btnEditar) {
        btnEditar.textContent = 'Guardar Cambios';
        btnEditar.onclick = function() {
            guardarCambiosPerfil();
        };
    }

    mostrarNotificacion('Modo edición activado', 'info');
}


// Guardar cambios del perfil
function guardarCambiosPerfil() {
    const perfilCard = document.querySelector('.perfil-card');
    const inputs = perfilCard.querySelectorAll('.input-edicion-perfil');

    const mapeo = [
        'nombre',
        'dni',
        'email',
        'telefono',
        'pais'
    ];

    const perfilActualizado = { ...perfilPorDefecto };

    inputs.forEach((input, index) => {
        if (mapeo[index]) {
            perfilActualizado[mapeo[index]] = input.value;
        }

        // Convertir input a párrafo
        const p = document.createElement('p');
        p.textContent = input.value;
        input.replaceWith(p);
    });

    // Guardar perfil
    guardarDatos('perfilUsuario', perfilActualizado);

    // Actualizar nombre en header
    const linkPerfil = document.querySelector('.link-perfil');
    if (linkPerfil) {
        linkPerfil.textContent = `¡Hola, ${perfilActualizado.nombre.split(' ')[0]}!`;
    }

    // Cambiar botón de guardar a editar
    const btnGuardar = document.querySelector('.btn-editar-perfil');
    if (btnGuardar) {
        btnGuardar.textContent = 'Editar Perfil';
        btnGuardar.onclick = function() {
            habilitarEdicion();
        };
    }

    mostrarNotificacion('Cambios guardados correctamente', 'exito');
    console.log('✓ Perfil actualizado:', perfilActualizado);
}

// Configurar navegación del perfil
function configurarNavegacionPerfil() {
    const sidebarLinks = document.querySelectorAll('.sidebar-perfil a');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remover clase active de todos
            document.querySelectorAll('.sidebar-perfil li').forEach(li => {
                li.classList.remove('active');
            });

            // Agregar clase active al actual
            this.closest('li').classList.add('active');
        });
    });

    console.log('✓ Navegación del perfil configurada');
}

// Cerrar sesión
function salirDeSesion() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        // Limpiar datos de sesión
        limpiarDatos('perfilUsuario');
        limpiarDatos('datosCheckout');
        limpiarDatos('vueloSeleccionado');

        mostrarNotificacion('Sesión cerrada', 'info');

        // Redirigir a inicio
        setTimeout(() => {
            redirigir('../index.html');
        }, 1500);
    }
}

console.log('✓ Perfil.js cargado - Perfil de usuario activo');
