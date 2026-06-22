const cuponesValidos = {
    'DESCUENTO10': { descuento: 0.10, descripcion: '10% de descuento' },
    'DESCUENTO20': { descuento: 0.20, descripcion: '20% de descuento' },
    'VIAJERO': { descuento: 0.15, descripcion: '15% descuento especial' },
    'PROMO2024': { descuento: 0.05, descripcion: '5% descuento promocional' }
};

let precioOriginal = 500;
let precioConDescuento = 500;
let descuentoActual = 0;
let cantidadPasajeros = 1;

document.addEventListener('DOMContentLoaded', function() {
    inicializarCheckout();
    cargarResumenVuelo();
    configurarEventosCheckout();
});

function inicializarCheckout() {
    console.log('✓ Checkout.js cargado');
    mostrarResumenPorDefecto();

    const datosBusqueda = cargarDatos('datosBusquedaVuelos');
    cantidadPasajeros = datosBusqueda ? (parseInt(datosBusqueda.pasajeros) || 1) : 1;

    renderizarFormularioPasajeros(cantidadPasajeros);
    precargarDatosUsuario();
}

function renderizarFormularioPasajeros(cantidad) {
    if (cantidad <= 1) return;

    const contenedor = document.querySelector('.datos_pasajero');
    if (!contenedor) return;

    let html = '';

    for (let i = 1; i <= cantidad; i++) {
        const sufijo = i === 1 ? '' : `-${i}`;

        html += `
            <input type="checkbox" id="acordeon-pasajero-${i}" class="acordeon-toggle" ${i === 1 ? 'checked' : ''}>
            <label for="acordeon-pasajero-${i}" class="acordeon-header">
                <span>Pasajero ${i}</span>
                <span class="acordeon-flecha">⌄</span>
            </label>
            <div class="acordeon-body">
                <label for="nombre${sufijo}">Nombre Completo</label>
                <input type="text" id="nombre${sufijo}" placeholder="Ingresá tu nombre completo" required>

                <label for="dni${sufijo}">Documento de identidad</label>
                <div>
                    <select id="tipoDni${sufijo}">
                        <option value="1">DNI</option>
                        <option value="2">CI</option>
                        <option value="3">CC</option>
                    </select>
                    <input type="number" id="dni${sufijo}" placeholder="Ingrese su numero de identificacion" required>
                </div>

                <label for="email${sufijo}">Correo Electronico</label>
                <input type="email" id="email${sufijo}" placeholder="Ingrese su correo electronico" required>

                <label for="telefono${sufijo}">Telefono (Opcional)</label>
                <input type="tel" id="telefono${sufijo}" placeholder="Ingrese su numero de telefono">
            </div>
        `;
    }

    contenedor.innerHTML = html;
}

function precargarDatosUsuario() {
    const usuarioLogueado = cargarDatos('usuarioLogueado');
    if (!usuarioLogueado) return;

    const inputNombre = document.getElementById('nombre');
    const inputDNI = document.getElementById('dni');
    const inputEmail = document.getElementById('email');
    const inputTelefono = document.getElementById('telefono');

    if (inputNombre) inputNombre.value = usuarioLogueado.nombre || '';
    if (inputDNI) inputDNI.value = usuarioLogueado.dni || '';
    if (inputEmail) inputEmail.value = usuarioLogueado.email || '';
    if (inputTelefono) inputTelefono.value = usuarioLogueado.telefono || '';
}

function cargarResumenVuelo() {
    const vueloSeleccionado = cargarDatos('vueloSeleccionado');
    const datosBusqueda = cargarDatos('datosBusquedaVuelos');

    if (vueloSeleccionado && datosBusqueda) {
        const resumenElement = document.querySelector('.resumen_vuelo');

        precioOriginal = vueloSeleccionado.precio;
        precioConDescuento = vueloSeleccionado.precio;

        resumenElement.innerHTML = `
            <p><strong>${vueloSeleccionado.origen} → ${vueloSeleccionado.destino}</strong></p>
            <p>${vueloSeleccionado.horaSalida} - ${vueloSeleccionado.horaLlegada}</p>
            <p>${vueloSeleccionado.tipo} (${vueloSeleccionado.duracion})</p>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.2);">
                <h3>Subtotal: $${precioOriginal} USD</h3>
                <p id="descuentoInfo"></p>
                <h3 id="totalPrecio">Total: $${precioConDescuento} USD</h3>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background-color: rgba(40,40,48,0.5); border-radius: 5px;">
                <input type="text" id="cupon" placeholder="Ingresa tu cupón" style="flex: 1; padding: 0.5rem;">
                <button type="button" id="btnAplicarCupon" onclick="aplicarCupon()">Aplicar</button>
            </div>
        `;

        console.log('✓ Resumen del vuelo cargado');
    }
}

function mostrarResumenPorDefecto() {
    const resumenElement = document.querySelector('.resumen_vuelo');
    if (!resumenElement.querySelector('h3')) {
        return;
    }
}

function aplicarCupon() {
    const inputCupon = document.getElementById('cupon');
    const cuponIngresado = inputCupon.value.toUpperCase().trim();

    if (!cuponIngresado) {
        mostrarNotificacion('Por favor ingresa un cupón', 'error');
        return;
    }

    if (cuponesValidos[cuponIngresado]) {
        const cupon = cuponesValidos[cuponIngresado];
        descuentoActual = cupon.descuento;
        precioConDescuento = precioOriginal * (1 - descuentoActual);

        const descuentoInfo = document.getElementById('descuentoInfo');
        const totalPrecio = document.getElementById('totalPrecio');

        descuentoInfo.innerHTML = `
            <p style="color: #4CAF50; font-weight: bold;">
                ✓ ${cupon.descripcion}
            </p>
            <p>Ahorro: $${(precioOriginal - precioConDescuento).toFixed(2)} USD</p>
        `;

        totalPrecio.innerHTML = `Total: <strong style="color: #4CAF50;">$${precioConDescuento.toFixed(2)} USD</strong>`;

        inputCupon.disabled = true;
        document.getElementById('btnAplicarCupon').disabled = true;

        guardarDatos('cuponAplicado', {
            codigo: cuponIngresado,
            descuento: descuentoActual,
            precioFinal: precioConDescuento
        });

        mostrarNotificacion(`Cupón "${cuponIngresado}" aplicado correctamente`, 'exito');
        console.log(`✓ Cupón aplicado: ${cuponIngresado} (${(descuentoActual * 100)}% off)`);
    } else {
        mostrarNotificacion('Cupón inválido', 'error');
        inputCupon.value = '';
    }
}

function configurarEventosCheckout() {
    const form = document.querySelector('.contenido');
    const radioPago = document.querySelectorAll('input[name="tipo"]');

    for (let i = 1; i <= cantidadPasajeros; i++) {
        const sufijo = i === 1 ? '' : `-${i}`;

        document.getElementById(`nombre${sufijo}`).addEventListener('blur', () => validarNombre(sufijo));
        document.getElementById(`dni${sufijo}`).addEventListener('blur', () => validarDNI(sufijo));
        document.getElementById(`email${sufijo}`).addEventListener('blur', () => validarEmail_checkout(sufijo));
        document.getElementById(`telefono${sufijo}`).addEventListener('blur', () => validarTelefono_checkout(sufijo));
    }

    radioPago.forEach(radio => {
        radio.addEventListener('change', manejarCambioMetodoPago);
    });

    form.addEventListener('submit', manejarEnvioCheckout);
}

function validarNombre(sufijo = '') {
    const nombre = document.getElementById(`nombre${sufijo}`);
    const valor = nombre.value.trim();

    if (valor === '') {
        nombre.style.borderColor = '#f44336';
        return false;
    }

    if (valor.length < 3) {
        mostrarNotificacion('El nombre debe tener al menos 3 caracteres', 'error');
        nombre.style.borderColor = '#f44336';
        return false;
    }

    nombre.style.borderColor = '#4CAF50';
    return true;
}

function validarDNI(sufijo = '') {
    const dni = document.getElementById(`dni${sufijo}`);
    const valor = dni.value.trim();

    if (valor === '') {
        dni.style.borderColor = '#f44336';
        return false;
    }

    const soloNumeros = valor.replace(/\D/g, '');
    if (soloNumeros.length < 7 || soloNumeros.length > 10) {
        mostrarNotificacion('DNI inválido (7-10 dígitos)', 'error');
        dni.style.borderColor = '#f44336';
        return false;
    }

    dni.style.borderColor = '#4CAF50';
    return true;
}

function validarEmail_checkout(sufijo = '') {
    const email = document.getElementById(`email${sufijo}`);
    const valor = email.value.trim();

    if (valor === '') {
        email.style.borderColor = '#f44336';
        return false;
    }

    if (!validarEmail(valor)) {
        mostrarNotificacion('Email inválido', 'error');
        email.style.borderColor = '#f44336';
        return false;
    }

    email.style.borderColor = '#4CAF50';
    return true;
}

function validarTelefono_checkout(sufijo = '') {
    const telefono = document.getElementById(`telefono${sufijo}`);
    const valor = telefono.value.trim();

    if (valor === '') {
        telefono.style.borderColor = '';
        return true;
    }

    if (!validarTelefono(valor)) {
        mostrarNotificacion('Teléfono inválido (10-15 dígitos)', 'error');
        telefono.style.borderColor = '#f44336';
        return false;
    }

    telefono.style.borderColor = '#4CAF50';
    return true;
}

function manejarCambioMetodoPago(event) {

    const metodoPago = event.target.value;
    const datosTarjeta = document.getElementById('datosTarjeta');

    if (
        metodoPago === 'tarjeta' ||
        metodoPago === 'debito'
    ) {
        datosTarjeta.style.display = 'block';
    } else {
        datosTarjeta.style.display = 'none';
    }

    console.log(`Método de pago seleccionado: ${metodoPago}`);
}

function manejarEnvioCheckout(event) {
    event.preventDefault();

    let esValido = true;
    for (let i = 1; i <= cantidadPasajeros; i++) {
        const sufijo = i === 1 ? '' : `-${i}`;
        const esNombreValido = validarNombre(sufijo);
        const esDNIValido = validarDNI(sufijo);
        const esEmailValido = validarEmail_checkout(sufijo);
        const esTelefonoValido = validarTelefono_checkout(sufijo);

        if (!esNombreValido || !esDNIValido || !esEmailValido || !esTelefonoValido) {
            esValido = false;
        }
    }

    const metodoPagoSeleccionado = document.querySelector('input[name="tipo"]:checked');

    if (
    metodoPagoSeleccionado &&
    (
        metodoPagoSeleccionado.value === 'tarjeta' ||
        metodoPagoSeleccionado.value === 'debito'
    )
) {

    const numeroTarjeta = document.getElementById('numeroTarjeta').value.trim();
    const titular = document.getElementById('titularTarjeta').value.trim();
    const vencimiento = document.getElementById('vencimientoTarjeta').value;
    const cvv = document.getElementById('cvvTarjeta').value.trim();

    if (
        numeroTarjeta === '' ||
        titular === '' ||
        vencimiento === '' ||
        cvv === ''
    ) {
        mostrarNotificacion(
            'Completa todos los datos de la tarjeta',
            'error'
        );
        return;
    }
}

    if (!esValido) {
        mostrarNotificacion('Por favor completa todos los campos correctamente', 'error');
        return;
    }

    if (!metodoPagoSeleccionado) {
        mostrarNotificacion('Por favor seleccioná un método de pago', 'error');
        return;
    }

    const pasajeros = [];
    for (let i = 1; i <= cantidadPasajeros; i++) {
        const sufijo = i === 1 ? '' : `-${i}`;
        pasajeros.push({
            nombre: document.getElementById(`nombre${sufijo}`).value,
            tipoDni: document.getElementById(`tipoDni${sufijo}`).value,
            dni: document.getElementById(`dni${sufijo}`).value,
            email: document.getElementById(`email${sufijo}`).value,
            telefono: document.getElementById(`telefono${sufijo}`).value
        });
    }

    const datosCheckout = {
        ...pasajeros[0],
        pasajeros,
        metodoPago: metodoPagoSeleccionado.value,
        precioFinal: precioConDescuento,
        precioOriginal: precioOriginal,
        descuentoAplicado: descuentoActual,
        fecha: new Date().toISOString()
    };

    guardarDatos('datosCheckout', datosCheckout);

    mostrarNotificacion('Pago procesado. Redirigiendo a tus reservas...', 'exito');

    setTimeout(() => {
        window.location.href = 'reservas.html';
    }, 1000);
}


console.log('✓ Checkout.js cargado - Validaciones activas');
console.log('Cupones disponibles:', Object.keys(cuponesValidos));
