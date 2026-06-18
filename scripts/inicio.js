document.addEventListener('DOMContentLoaded', function() {
    poblarCiudades();
    inicializarFormulario();
});

function poblarCiudades() {
    const selectOrigen = document.getElementById('origen');
    const selectDestino = document.getElementById('destino');

    ciudadesDisponibles.forEach(ciudad => {
        const opcionTexto = `${ciudad.nombre} (${ciudad.codigo})`;

        const opcionOrigen = document.createElement('option');
        opcionOrigen.value = ciudad.nombre;
        opcionOrigen.textContent = opcionTexto;
        selectOrigen.appendChild(opcionOrigen);

        const opcionDestino = document.createElement('option');
        opcionDestino.value = ciudad.nombre;
        opcionDestino.textContent = opcionTexto;
        selectDestino.appendChild(opcionDestino);
    });
}

function inicializarFormulario() {
    const form = document.querySelector('.main-form');
    if (!form) return;

    const radioButtons = document.querySelectorAll('input[name="tipo"]');
    const fechaIdaInput = document.getElementById('fecha-ida');
    const fechaVueltaInput = document.getElementById('fecha-vuelta');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', manejarCambioTipo);
    });

    fechaIdaInput.addEventListener('change', validarRangoFechasFormulario);
    fechaVueltaInput.addEventListener('change', validarRangoFechasFormulario);
    form.addEventListener('submit', manejarEnvio);
}

function manejarCambioTipo(event) {
    const fechaVueltaInput = document.getElementById('fecha-vuelta');
    const tipo = event.target.value;

    if (tipo === 'solo-ida') {
        fechaVueltaInput.disabled = true;
        fechaVueltaInput.value = '';
    } else if (tipo === 'ida-vuelta') {
        fechaVueltaInput.disabled = false;
    }
}

function validarRangoFechasFormulario() {
    const fechaIdaInput = document.getElementById('fecha-ida');
    const fechaVueltaInput = document.getElementById('fecha-vuelta');
    const tipoVueloSeleccionado = document.querySelector('input[name="tipo"]:checked');

    if (tipoVueloSeleccionado && tipoVueloSeleccionado.value === 'ida-vuelta') {
        if (!validarRangoFechas(fechaIdaInput.value, fechaVueltaInput.value)) {
            mostrarNotificacion('La fecha de vuelta no puede ser anterior a la fecha de ida', 'error');
            fechaVueltaInput.value = '';
        }
    }
}

function manejarEnvio(event) {
    event.preventDefault();

    const tipoVueloSeleccionado = document.querySelector('input[name="tipo"]:checked');

    if (!tipoVueloSeleccionado) {
        mostrarNotificacion('Por favor selecciona un tipo de vuelo', 'error');
        return;
    }

    const datosBusqueda = {
        tipo: tipoVueloSeleccionado.value,
        origen: document.getElementById('origen').value,
        destino: document.getElementById('destino').value,
        fechaIda: document.getElementById('fecha-ida').value,
        fechaVuelta: document.getElementById('fecha-vuelta').value,
        pasajeros: document.getElementById('pasajeros').value,
        clase: document.getElementById('clase').value
    };

    guardarDatos('datosBusquedaVuelos', datosBusqueda);
    mostrarNotificacion('Búsqueda iniciada...', 'info');
    this.submit();
}
