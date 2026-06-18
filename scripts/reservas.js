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
    cargarMisReservas();
    configurarEventosReservas();
});

function cargarMisReservas() {
    console.log('✓ Reservas.js cargado');

    const datosCheckout = cargarDatos('datosCheckout');
    const vueloSeleccionado = cargarDatos('vueloSeleccionado');
    const asientosSeleccionados = cargarDatos('asientosSeleccionados');

    let reservas = cargarDatos('misReservas') || [];

    if (datosCheckout && vueloSeleccionado) {
        const nuevaReserva = {
            id: Date.now(),
            numero: `PW1-${Date.now().toString().slice(-6)}`,
            nombre: datosCheckout.nombre,
            email: datosCheckout.email,
            telefono: datosCheckout.telefono,
            origen: vueloSeleccionado.origen,
            destino: vueloSeleccionado.destino,
            horaSalida: vueloSeleccionado.horaSalida,
            horaLlegada: vueloSeleccionado.horaLlegada,
            duracion: vueloSeleccionado.duracion,
            tipo: vueloSeleccionado.tipo,
            asientos: asientosSeleccionados || [],
            cantidadPasajeros: datosCheckout.pasajeros ? datosCheckout.pasajeros.length : 1,
            precioFinal: datosCheckout.precioFinal,
            precioOriginal: datosCheckout.precioOriginal,
            descuentoAplicado: datosCheckout.descuentoAplicado,
            metodoPago: datosCheckout.metodoPago,
            fechaReserva: new Date().toISOString(),
            estado: 'Confirmada'
        };

        if (!reservas.find(r => r.id === nuevaReserva.id)) {
            reservas.unshift(nuevaReserva);
            guardarDatos('misReservas', reservas);

            limpiarDatos('datosCheckout');
            limpiarDatos('vueloSeleccionado');
            limpiarDatos('asientosSeleccionados');

            mostrarNotificacion('¡Reserva confirmada!', 'exito');
            console.log('✓ Nueva reserva creada:', nuevaReserva);
        }
    }

    const usuarioLogueado = cargarDatos('usuarioLogueado');
    const reservasDelUsuario = usuarioLogueado
        ? reservas.filter(r => r.email.toLowerCase() === usuarioLogueado.email.toLowerCase())
        : reservas;

    mostrarReservas(reservasDelUsuario);
    const nombreMostrar = usuarioLogueado?.nombre || (reservasDelUsuario.length > 0 ? reservasDelUsuario[0].nombre : null);
    if (nombreMostrar) {
        const nombreSidebar = document.querySelector('.sidebar-perfil h3');
        if (nombreSidebar) nombreSidebar.textContent = nombreMostrar;

        const linkPerfil = document.querySelector('.link-perfil');
        if (linkPerfil) linkPerfil.textContent = `¡Hola, ${nombreMostrar.split(' ')[0]}!`;
    }
}

function mostrarReservas(reservas) {
    const misReservasSection = document.querySelector('.mis-reservas');

    if (!misReservasSection) return;

    misReservasSection.innerHTML = '';

    if (reservas.length === 0) {
        misReservasSection.innerHTML = `
            <div class="reserva-vacia">
                <h3>No tienes reservas</h3>
                <p><a href="vuelos.html">Busca un vuelo ahora</a></p>
            </div>
        `;
        return;
    }

    reservas.forEach((reserva, index) => {
        const checkboxId = `reserva${index}`;
        const estado = reserva.estado === 'Confirmada' ? '✓' : '⚠';
        const claseEstado = reserva.estado === 'Confirmada' ? 'estado-confirmada' : 'estado-cancelada';

        const checkboxInput = document.createElement('input');
        checkboxInput.type = 'checkbox';
        checkboxInput.name = 'accordion-reservas';
        checkboxInput.id = checkboxId;
        if (index === 0) checkboxInput.checked = true;

        const label = document.createElement('label');
        label.className = 'item';
        label.htmlFor = checkboxId;
        label.innerHTML = `
            <div>
                <strong class="${claseEstado}">${estado} ${reserva.origen} → ${reserva.destino}</strong>
                <p>Reserva: ${reserva.numero} | ${new Date(reserva.fechaReserva).toLocaleDateString('es-AR')}</p>
            </div>
            <div class="derecha">
                <span>$${reserva.precioFinal?.toFixed(2) || reserva.precioOriginal} USD</span>
                <span class="flecha">⌄</span>
            </div>
        `;

        const contenido = document.createElement('div');
        contenido.className = 'contenido';
        contenido.innerHTML = `
            <div class="reserva-info-grid">
                <div>
                    <p><strong>Pasajero:</strong> ${reserva.nombre}</p>
                    <p><strong>Email:</strong> ${reserva.email}</p>
                    ${reserva.telefono ? `<p><strong>Teléfono:</strong> ${reserva.telefono}</p>` : ''}
                </div>
                <div>
                    <p><strong>Ida:</strong> ${reserva.horaSalida} → ${reserva.horaLlegada}</p>
                    <p><strong>Duración:</strong> ${reserva.duracion}</p>
                    <p><strong>Tipo:</strong> ${reserva.tipo}</p>
                </div>
            </div>

            <div class="reserva-pago-info">
                <p><strong>Cantidad de pasajeros:</strong> ${reserva.cantidadPasajeros || 1}</p>
                <p><strong>Asientos:</strong> ${reserva.asientos?.join(', ') || 'No especificados'}</p>
                <p>
                    <strong>Método de pago:</strong>
                    <select onchange="cambiarMetodoPago(${reserva.id}, this.value)">
                        <option value="tarjeta" ${reserva.metodoPago === 'tarjeta' ? 'selected' : ''}>Tarjeta de crédito</option>
                        <option value="debito" ${reserva.metodoPago === 'debito' ? 'selected' : ''}>Tarjeta de débito</option>
                    </select>
                </p>
                ${reserva.descuentoAplicado > 0 ? `<p class="reserva-descuento"><strong>Descuento aplicado:</strong> ${(reserva.descuentoAplicado * 100)}%</p>` : ''}
            </div>

            <div class="botones-reserva">
                <button onclick="descargarReserva(${reserva.id})">Descargar</button>
                <button onclick="cancelarReserva(${reserva.id})">Cancelar</button>
            </div>
        `;

        misReservasSection.appendChild(checkboxInput);
        misReservasSection.appendChild(label);
        misReservasSection.appendChild(contenido);
    });

    agregarEstilosReservas();

    console.log(`✓ ${reservas.length} reserva(s) mostrada(s)`);
}

function configurarEventosReservas() {
    console.log('✓ Eventos de reservas configurados');
}

function etiquetaMetodoPago(metodo) {
    const etiquetas = { tarjeta: 'Tarjeta de crédito', debito: 'Tarjeta de débito' };
    return etiquetas[metodo] || metodo;
}

function cambiarMetodoPago(id, nuevoMetodo) {
    const reservas = cargarDatos('misReservas') || [];
    const reserva = reservas.find(r => r.id === id);
    if (!reserva) return;

    reserva.metodoPago = nuevoMetodo;
    guardarDatos('misReservas', reservas);

    mostrarNotificacion('Método de pago actualizado', 'exito');
}

function descargarReserva(id) {
    const reservas = cargarDatos('misReservas') || [];
    const reserva = reservas.find(r => r.id === id);

    if (!reserva) return;

    const contenido = `
╔════════════════════════════════════════════╗
║         COMPROBANTE DE RESERVA             ║
║          PasajesAereos.com                 ║
╚════════════════════════════════════════════╝

NÚMERO DE RESERVA: ${reserva.numero}
ESTADO: ${reserva.estado}
FECHA: ${new Date(reserva.fechaReserva).toLocaleDateString('es-AR')}

────────────────────────────────────────────
DATOS DEL PASAJERO
────────────────────────────────────────────
Nombre: ${reserva.nombre}
Email: ${reserva.email}${reserva.telefono ? `
Teléfono: ${reserva.telefono}` : ''}

────────────────────────────────────────────
DETALLES DEL VUELO
────────────────────────────────────────────
Ruta: ${reserva.origen} → ${reserva.destino}
Salida: ${reserva.horaSalida}
Llegada: ${reserva.horaLlegada}
Duración: ${reserva.duracion}
Tipo: ${reserva.tipo}

────────────────────────────────────────────
ASIENTOS RESERVADOS
────────────────────────────────────────────
Cantidad de pasajeros: ${reserva.cantidadPasajeros || 1}
${reserva.asientos?.join(', ') || 'No especificados'}

────────────────────────────────────────────
RESUMEN DE PAGO
────────────────────────────────────────────
Precio original: $${reserva.precioOriginal}
Descuento: -$${((reserva.precioOriginal - reserva.precioFinal) || 0).toFixed(2)}
TOTAL: $${reserva.precioFinal?.toFixed(2) || reserva.precioOriginal}

Método de pago: ${etiquetaMetodoPago(reserva.metodoPago)}

════════════════════════════════════════════
Para cambios o cancelaciones, contactá a:
reservas@pasajesaereos.com
════════════════════════════════════════════
    `;

    const elemento = document.createElement('a');
    elemento.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenido));
    elemento.setAttribute('download', `reserva_${reserva.numero}.txt`);
    elemento.style.display = 'none';

    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);

    mostrarNotificacion('Comprobante descargado', 'exito');
    console.log('✓ Reserva descargada:', reserva.numero);
}

function cancelarReserva(id) {
    if (!confirm('¿Estás seguro que deseas cancelar esta reserva? Esta acción no se puede deshacer.')) {
        return;
    }

    const reservas = cargarDatos('misReservas') || [];
    const reservaACancelar = reservas.find(r => r.id === id);

    if (!reservaACancelar) return;

    reservaACancelar.estado = 'Cancelada';

    guardarDatos('misReservas', reservas);

    mostrarNotificacion('Reserva cancelada. Se procesará un reembolso en 5-7 días hábiles', 'info');

    setTimeout(() => {
        location.reload();
    }, 2000);

    console.log('✓ Reserva cancelada:', reservaACancelar.numero);
}

function agregarEstilosReservas() {
    const estilo = document.createElement('style');
    estilo.textContent = `
        .botones-reserva {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }

        .botones-reserva button {
            flex: 1;
            padding: 0.6rem 1rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }

        .botones-reserva button:first-child {
            background-color: #2196F3;
            color: white;
        }

        .botones-reserva button:first-child:hover {
            background-color: #1976D2;
        }

        .botones-reserva button:last-child {
            background-color: #f44336;
            color: white;
        }

        .botones-reserva button:last-child:hover {
            background-color: #da190b;
        }

        .item {
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .item:hover {
            background-color: rgba(33, 150, 243, 0.1);
        }
    `;

    if (!document.querySelector('style[data-reservas="true"]')) {
        estilo.setAttribute('data-reservas', 'true');
        document.head.appendChild(estilo);
    }
}

console.log('✓ Reservas.js cargado - Panel de reservas activo');