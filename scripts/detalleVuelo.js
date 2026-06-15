// Detalle de vuelo
const asientosSeleccionados = [];
let precioTotal = 500;

document.addEventListener('DOMContentLoaded', function() {
    cargarDetalleVuelo();
    inicializarMapaAsientos();
    configurarEventosAsientos();
    configurarBtnContinuar();
});

// Cargar detalle del vuelo
function cargarDetalleVuelo() {
    const vueloSeleccionado = cargarDatos('vueloSeleccionado');

    if (vueloSeleccionado) {
        precioTotal = vueloSeleccionado.precio;

        const seccionsVuelos = document.querySelectorAll('.vuelo');

        if (seccionsVuelos.length > 0) {
            const vueloIda = seccionsVuelos[0];
            const detalleIda = vueloIda.querySelector('div:nth-child(2)');
            if (detalleIda) {
                detalleIda.innerHTML = `
                    <p><strong>IDA: ${vueloSeleccionado.origen} → ${vueloSeleccionado.destino}</strong></p>
                    <p>Salida: ${vueloSeleccionado.horaSalida}</p>
                    <p>Llegada: ${vueloSeleccionado.horaLlegada}</p>
                    <p>Duración: ${vueloSeleccionado.duracion}</p>
                    <p>Tipo: ${vueloSeleccionado.tipo}</p>
                `;
            }
        }

        // Actualizar total
        const montoElement = document.querySelector('.monto');
        if (montoElement) {
            montoElement.innerHTML = `
                <p>Total</p>
                <p id="precio-total">$${precioTotal}</p>
            `;
        }

        console.log('✓ Detalle de vuelo cargado:', vueloSeleccionado);
    } else {
        console.warn('⚠ No hay vuelo seleccionado');
    }
}

// Inicializar mapa de asientos
function inicializarMapaAsientos() {
    const asientosDisponibles = document.querySelectorAll('.asiento.disponible');

    asientosDisponibles.forEach(asiento => {
        asiento.addEventListener('click', function(e) {
            e.preventDefault();
            toggleAsiento(this);
        });
    });

    console.log(`✓ Mapa de asientos inicializado (${asientosDisponibles.length} asientos disponibles)`);
}

// Toggle de seleccion de asiento
function toggleAsiento(asientoElement) {
    const asientoId = asientoElement.getAttribute('data-id');

    if (!asientoId) return;

    // Verificar si el asiento ya esta seleccionado
    const yaSeleccionado = asientosSeleccionados.includes(asientoId);

    if (yaSeleccionado) {
        asientosSeleccionados.splice(asientosSeleccionados.indexOf(asientoId), 1);
        asientoElement.classList.remove('seleccionado');
    } else {
        asientosSeleccionados.push(asientoId);
        asientoElement.classList.add('seleccionado');
        asientoElement.classList.remove('disponible');
    }

    // Actualizar UI
    actualizarInfoSeleccion();
    guardarDatos('asientosSeleccionados', asientosSeleccionados);

    console.log('Asientos seleccionados:', asientosSeleccionados);
}

// Configurar eventos de asientos
function configurarEventosAsientos() {
    const asientos = document.querySelectorAll('.asiento');

    asientos.forEach(asiento => {
        asiento.style.cursor = 'pointer';

        asiento.addEventListener('mouseenter', function() {
            if (!this.classList.contains('ocupado')) {
                this.style.transform = 'scale(1.1)';
            }
        });

        asiento.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Actualizar informacion de seleccion
function actualizarInfoSeleccion() {
    const infoElement = document.getElementById('info-seleccion');
    const btnContinuar = document.getElementById('btn-continuar');

    if (asientosSeleccionados.length === 0) {
        infoElement.innerHTML = '👉 Hacé clic en un asiento disponible para seleccionarlo.';
        infoElement.style.color = '#FFC107';
        btnContinuar.disabled = true;
        btnContinuar.style.opacity = '0.5';
    } else {
        const plural = asientosSeleccionados.length === 1 ? 'asiento' : 'asientos';
        infoElement.innerHTML = `
            ✓ Asientos seleccionados: <strong>${asientosSeleccionados.join(', ')}</strong>
            (${asientosSeleccionados.length} ${plural})
        `;
        infoElement.style.color = '#4CAF50';
        btnContinuar.disabled = false;
        btnContinuar.style.opacity = '1';
    }
}

// Configurar boton continuar
function configurarBtnContinuar() {
    const btnContinuar = document.getElementById('btn-continuar');

    btnContinuar.addEventListener('click', function(e) {
        e.preventDefault();

        if (asientosSeleccionados.length === 0) {
            mostrarNotificacion('Por favor selecciona al menos un asiento', 'error');
            return;
        }

        // Guardar asientos antes de continuar
        guardarDatos('asientosSeleccionados', asientosSeleccionados);

        mostrarNotificacion('Asientos guardados. Redirigiendo...', 'exito');

        // Redirigir a checkout
        setTimeout(() => {
            redirigir('checkout.html', 500);
        }, 1000);
    });

    // Desactivar inicialmente
    btnContinuar.disabled = true;
    btnContinuar.style.opacity = '0.5';

    // Cambiar estilos
    btnContinuar.style.cursor = 'pointer';
    btnContinuar.style.transition = '0.3s';
}

// Limpiar selección de asientos
function limpiarSeleccion() {
    asientosSeleccionados.length = 0;

    const asientosSeleccionadosElements = document.querySelectorAll('.asiento.seleccionado');
    asientosSeleccionadosElements.forEach(asiento => {
        asiento.classList.remove('seleccionado');
        asiento.classList.add('disponible');
    });

    actualizarInfoSeleccion();
    console.log('✓ Selección de asientos limpiada');
}

// Seleccionar asientos aleatorios
function seleccionarAleatorios(cantidad = 2) {
    limpiarSeleccion();

    const asientosDisponibles = Array.from(document.querySelectorAll('.asiento.disponible'));
    const shuffled = asientosDisponibles.sort(() => 0.5 - Math.random());
    const seleccionados = shuffled.slice(0, cantidad);

    seleccionados.forEach(asiento => {
        asiento.classList.remove('disponible');
        asiento.classList.add('seleccionado');
        const id = asiento.getAttribute('data-id');
        asientosSeleccionados.push(id);
    });

    actualizarInfoSeleccion();
    console.log(`✓ ${cantidad} asientos seleccionados aleatoriamente`);
}

// Estilos dinamicos
function agregarEstilosAsientos() {
    const estilo = document.createElement('style');
    estilo.textContent = `
        .asiento {
            transition: all 0.3s ease;
            border-radius: 5px;
        }

        .asiento.disponible {
            background-color: #4CAF50;
        }

        .asiento.disponible:hover {
            background-color: #45a049;
            transform: scale(1.1);
        }

        .asiento.seleccionado {
            background-color: #2196F3;
            box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
        }

        .asiento.ocupado {
            background-color: #999;
            cursor: not-allowed;
            opacity: 0.6;
        }

        #btn-continuar {
            padding: 0.8rem 2rem;
            font-size: 1.1rem;
            margin-top: 1rem;
            background-color: rgb(40, 40, 48);
            color: white;
            border: 2px solid #2196F3;
            border-radius: 5px;
            transition: all 0.3s;
        }

        #btn-continuar:not(:disabled):hover {
            background-color: #2196F3;
            transform: scale(1.05);
        }

        #btn-continuar:disabled {
            border-color: #999;
        }

        #info-seleccion {
            padding: 0.8rem;
            border-radius: 5px;
            background-color: rgba(255, 193, 7, 0.2);
            margin: 1rem 0;
        }
    `;

    document.head.appendChild(estilo);
}

// Inyectar estilos
agregarEstilosAsientos();

console.log('✓ DetalleVuelo.js cargado - Selección de asientos activa');
