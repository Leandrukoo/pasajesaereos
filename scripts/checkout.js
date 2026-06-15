// Form de pago

// Cupones validos
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

// Inicializar checkout
function inicializarCheckout() {
    console.log('✓ Checkout.js cargado');
    mostrarResumenPorDefecto();
}

// Cargar resumen del vuelo
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

// Mostrar resumen por defecto
function mostrarResumenPorDefecto() {
    const resumenElement = document.querySelector('.resumen_vuelo');
    if (!resumenElement.querySelector('h3')) {
        return;
    }
}

// Aplicar cupon descuento
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

        // Actualizar UI
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

        // Guardar cupon aplicado
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

// Configurar eventos del formulario
function configurarEventosCheckout() {
    const form = document.querySelector('.contenido');
    const radioPago = document.querySelectorAll('input[name="tipo"]');
    const inputNombre = document.getElementById('nombre');
    const inputDNI = document.getElementById('dni');
    const inputEmail = document.getElementById('email');
    const inputTelefono = document.getElementById('telefono');

    // Event para validacion en tiempo real
    inputNombre.addEventListener('blur', validarNombre);
    inputDNI.addEventListener('blur', validarDNI);
    inputEmail.addEventListener('blur', validarEmail_checkout);
    inputTelefono.addEventListener('blur', validarTelefono_checkout);

    // Event para cambio de metodo de pago
    radioPago.forEach(radio => {
        radio.addEventListener('change', manejarCambioMetodoPago);
    });

    // Event para el formulario
    form.addEventListener('submit', manejarEnvioCheckout);
}

// Validar nombre
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

// Validar DNI
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

// Validar email
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

// Validar telefono
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

// Manejar cambio de metodo de pago
function manejarCambioMetodoPago(event) {
    const metodoPago = event.target.value;
    console.log(`Método de pago seleccionado: ${metodoPago}`);
    // Aquí podrías mostrar/ocultar campos específicos según el método
}

// Manejar envio del formulario
function manejarEnvioCheckout(event) {
    event.preventDefault();

    // Validar todos los campos
    const esNombreValido = validarNombre();
    const esDNIValido = validarDNI();
    const esEmailValido = validarEmail_checkout();
    const esTelefonoValido = validarTelefono_checkout();
    const metodoPagoSeleccionado = document.querySelector('input[name="tipo"]:checked');

    if (!esNombreValido || !esDNIValido || !esEmailValido || !esTelefonoValido) {
        mostrarNotificacion('Por favor completa todos los campos correctamente', 'error');
        return;
    }

    if (!metodoPagoSeleccionado) {
        mostrarNotificacion('Por favor seleccioná un método de pago', 'error');
        return;
    }

    // Obtener datos del formulario
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

    // Guardar datos
    guardarDatos('datosCheckout', datosCheckout);

    mostrarNotificacion('Pago procesado. Redirigiendo a tus reservas...', 'exito');

    setTimeout(() => {
        window.location.href = 'reservas.html';
    }, 1000);
}


console.log('✓ Checkout.js cargado - Validaciones activas');
console.log('Cupones disponibles:', Object.keys(cuponesValidos));
