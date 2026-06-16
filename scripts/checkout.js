const cuponesValidos = {
    'DESCUENTO10': { descuento: 0.10, descripcion: '10% de descuento' },
    'DESCUENTO20': { descuento: 0.20, descripcion: '20% de descuento' },
    'VIAJERO': { descuento: 0.15, descripcion: '15% descuento especial' },
    'PROMO2024': { descuento: 0.05, descripcion: '5% descuento promocional' }
};

let precioOriginal = 500;
let precioConDescuento = 500;
let descuentoActual = 0;

document.addEventListener('DOMContentLoaded', function() {
    inicializarCheckout();
    cargarResumenVuelo();
    configurarEventosCheckout();
});

function inicializarCheckout() {
    console.log('✓ Checkout.js cargado');
    mostrarResumenPorDefecto();
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
    const inputNombre = document.getElementById('nombre');
    const inputDNI = document.getElementById('dni');
    const inputEmail = document.getElementById('email');
    const inputTelefono = document.getElementById('telefono');

    inputNombre.addEventListener('blur', validarNombre);
    inputDNI.addEventListener('blur', validarDNI);
    inputEmail.addEventListener('blur', validarEmail_checkout);
    inputTelefono.addEventListener('blur', validarTelefono_checkout);

    radioPago.forEach(radio => {
        radio.addEventListener('change', manejarCambioMetodoPago);
    });

    form.addEventListener('submit', manejarEnvioCheckout);
}

function validarNombre() {
    const nombre = document.getElementById('nombre');
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

function validarDNI() {
    const dni = document.getElementById('dni');
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

function validarEmail_checkout() {
    const email = document.getElementById('email');
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

function validarTelefono_checkout() {
    const telefono = document.getElementById('telefono');
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

    const esNombreValido = validarNombre();
    const esDNIValido = validarDNI();
    const esEmailValido = validarEmail_checkout();
    const esTelefonoValido = validarTelefono_checkout();
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

    if (!esNombreValido || !esDNIValido || !esEmailValido || !esTelefonoValido) {
        mostrarNotificacion('Por favor completa todos los campos correctamente', 'error');
        return;
    }

    if (!metodoPagoSeleccionado) {
        mostrarNotificacion('Por favor seleccioná un método de pago', 'error');
        return;
    }

    const datosCheckout = {
        nombre: document.getElementById('nombre').value,
        tipoDni: document.getElementById('tipoDni').value,
        dni: document.getElementById('dni').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
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
