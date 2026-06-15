// Array de vuelos
const vuelosMock = [
    { id: 1, origen: 'BUE', destino: 'MAD', horaSalida: '05:45', horaLlegada: '08:00', tipo: 'Directo', duracion: '2 h 15m', precio: 500, aerolinea: 'aerolinea1', equipaje: true },
    { id: 2, origen: 'BUE', destino: 'MAD', horaSalida: '08:00', horaLlegada: '11:30', tipo: 'Con escala', duracion: '4 h 30m', precio: 350, aerolinea: 'aerolinea2', equipaje: false },
    { id: 3, origen: 'BUE', destino: 'MAD', horaSalida: '10:30', horaLlegada: '14:00', tipo: 'Directo', duracion: '2 h 15m', precio: 600, aerolinea: 'aerolinea1', equipaje: true },
    { id: 4, origen: 'BUE', destino: 'MAD', horaSalida: '12:00', horaLlegada: '16:45', tipo: 'Con escala', duracion: '5 h', precio: 300, aerolinea: 'aerolinea3', equipaje: false },
    { id: 5, origen: 'BUE', destino: 'MAD', horaSalida: '14:15', horaLlegada: '17:30', tipo: 'Directo', duracion: '2 h 15m', precio: 550, aerolinea: 'aerolinea2', equipaje: true },
    { id: 6, origen: 'BUE', destino: 'MAD', horaSalida: '16:00', horaLlegada: '21:00', tipo: 'Con escala', duracion: '4 h 30m', precio: 320, aerolinea: 'aerolinea1', equipaje: false },
    { id: 7, origen: 'BUE', destino: 'MAD', horaSalida: '18:30', horaLlegada: '21:45', tipo: 'Directo', duracion: '2 h 15m', precio: 700, aerolinea: 'aerolinea3', equipaje: true },
    { id: 8, origen: 'BUE', destino: 'MAD', horaSalida: '20:00', horaLlegada: '01:00', tipo: 'Con escala', duracion: '3 h 30m', precio: 280, aerolinea: 'aerolinea2', equipaje: false },
    { id: 9, origen: 'BUE', destino: 'MAD', horaSalida: '22:00', horaLlegada: '01:15', tipo: 'Directo', duracion: '2 h 15m', precio: 450, aerolinea: 'aerolinea3', equipaje: true },
    { id: 10, origen: 'BUE', destino: 'MAD', horaSalida: '23:59', horaLlegada: '04:30', tipo: 'Con escala', duracion: '4 h 30m', precio: 400, aerolinea: 'aerolinea1', equipaje: false },
];

document.addEventListener('DOMContentLoaded', function() {
    inicializarVuelos();
    mostrarDatosBusqueda();
    configurarFiltros();
});

// Inicializar vuelos
function inicializarVuelos() {
    console.log('✓ Vuelos.js cargado');
    renderizarVuelos();
    aplicarFiltros();
}

// Renderizar tarjetas de vuelos
function renderizarVuelos() {
    const contenedor = document.querySelector('.aerolineas');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    vuelosMock.forEach(vuelo => {
        const article = document.createElement('article');
        article.className = 'aereolinea';
        article.innerHTML = `
            <img class="aerolinea_img" src="../Imagenes/fondo-transparente.png" alt="${vuelo.aerolinea}">
            <section class="aerolinea_horario">
                <h3>${vuelo.origen}</h3>
                <p>${vuelo.horaSalida}</p>
            </section>
            <section class="aerolinea_horario">
                <h3>${vuelo.destino}</h3>
                <p>${vuelo.horaLlegada}</p>
            </section>
            <h4 class="aerolinea_content">${vuelo.tipo}</h4>
            <p class="aerolinea_content">${vuelo.duracion}</p>
            <p class="aerolinea_content">$${vuelo.precio}</p>
            <a href="#" class="boton_reservar" onclick="guardarVueloSeleccionado(${vuelo.id}); return false;">Reservar</a>
        `;
        contenedor.appendChild(article);
    });
}

// Mostrar datos de la búsqueda anterior
function mostrarDatosBusqueda() {
    const datosBusqueda = cargarDatos('datosBusquedaVuelos');

    if (datosBusqueda) {
        // Crear resumen de búsqueda (opcional)
        const resumenBusqueda = document.createElement('div');
        resumenBusqueda.className = 'resumen-busqueda';
        resumenBusqueda.innerHTML = `
            <p><strong>${datosBusqueda.origen}</strong> → <strong>${datosBusqueda.destino}</strong>
            | ${datosBusqueda.fechaIda} | ${datosBusqueda.pasajeros} pasajero(s) | ${datosBusqueda.clase}</p>
        `;
        resumenBusqueda.style.cssText = `
            background-color: rgba(132, 163, 221, 0.3);
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 5px;
            text-align: center;
        `;

        const main = document.querySelector('main');
        const h1 = main.querySelector('h1');
        main.insertBefore(resumenBusqueda, h1.nextSibling);

        console.log('✓ Datos de búsqueda mostrados');
    }
}

// Configurar event de filtros
function configurarFiltros() {
    const rangeInput = document.getElementById('range');
    const rangeLabel = document.querySelector('.rango');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Event para el rango de precio
    rangeInput.addEventListener('input', function() {
        const minPrecio = 300;
        const maxPrecio = 1000;
        const valorActual = this.value;
        rangeLabel.textContent = `Min $${minPrecio} - Max $${valorActual}`;
        aplicarFiltros();
    });

    // Event para checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFiltros);
    });
}

// Aplicar filtros a los vuelos
function aplicarFiltros() {
    const rangeInput = document.getElementById('range');
    const precioMaximo = parseInt(rangeInput.value);

    // Obtener checkboxes seleccionados
    const directoChecked = document.getElementById('directo').checked;
    const conEscalaChecked = document.getElementById('con_escala').checked;
    const aerolinea1Checked = document.getElementById('aerolinea1').checked;
    const aerolinea2Checked = document.getElementById('aerolinea2').checked;
    const aerolinea3Checked = document.getElementById('aerolinea3').checked;
    const equipajeChecked = document.getElementById('equipaje_incluido').checked;

    const vuelos = document.querySelectorAll('.aereolinea');
    let vuelosVisibles = 0;

    vuelos.forEach((vueloElement, index) => {
        if (index >= vuelosMock.length) return;

        const vuelo = vuelosMock[index];
        let mostrarVuelo = true;

        // Filtro 1: Precio
        if (vuelo.precio > precioMaximo) {
            mostrarVuelo = false;
        }

        // Filtro 2: Tipo de vuelo
        if (mostrarVuelo) {
            const tipoVueloValido =
                (directoChecked && vuelo.tipo === 'Directo') ||
                (conEscalaChecked && vuelo.tipo === 'Con escala') ||
                (!directoChecked && !conEscalaChecked); // Si no hay ninguno seleccionado, mostrar todos

            if (!tipoVueloValido && (directoChecked || conEscalaChecked)) {
                mostrarVuelo = false;
            }
        }

        // Filtro 3: Aerolínea
        if (mostrarVuelo) {
            const aerolineaValida =
                (aerolinea1Checked && vuelo.aerolinea === 'aerolinea1') ||
                (aerolinea2Checked && vuelo.aerolinea === 'aerolinea2') ||
                (aerolinea3Checked && vuelo.aerolinea === 'aerolinea3') ||
                (!aerolinea1Checked && !aerolinea2Checked && !aerolinea3Checked); // Si no hay ninguno seleccionado, mostrar todos

            if (!aerolineaValida && (aerolinea1Checked || aerolinea2Checked || aerolinea3Checked)) {
                mostrarVuelo = false;
            }
        }

        // Filtro 4: Equipaje
        if (mostrarVuelo && equipajeChecked && !vuelo.equipaje) {
            mostrarVuelo = false;
        }

        // Mostrar u ocultar vuelo
        if (mostrarVuelo) {
            vueloElement.style.display = 'flex';
            vuelosVisibles++;
        } else {
            vueloElement.style.display = 'none';
        }
    });

    // Actualizar contador de resultados
    actualizarContadorResultados(vuelosVisibles);
}

// Actualizar contador de resultados
function actualizarContadorResultados(cantidad) {
    let contador = document.querySelector('.contador-resultados');

    if (!contador) {
        contador = document.createElement('div');
        contador.className = 'contador-resultados';
        const main = document.querySelector('main');
        main.insertBefore(contador, document.querySelector('.resultados'));
    }

    if (cantidad === 0) {
        contador.innerHTML = '<p style="color: #f44336; font-weight: bold;">No hay vuelos que cumplan con los criterios de búsqueda</p>';
    } else {
        contador.innerHTML = `<p style="color: #4CAF50; font-weight: bold;">✓ ${cantidad} vuelo(s) encontrado(s)</p>`;
    }

    contador.style.cssText = `
        text-align: center;
        padding: 0.5rem;
        margin: 1rem 0;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.1);
    `;
}

// Guardar vuelo seleccionado
function guardarVueloSeleccionado(vueloId) {
    const vuelo = vuelosMock.find(v => v.id === vueloId);
    if (vuelo) {
        guardarDatos('vueloSeleccionado', vuelo);
        mostrarNotificacion('Vuelo guardado. Redirigiendo...', 'exito');
        setTimeout(() => { window.location.href = 'detalleVuelo.html'; }, 500);
    }
}

// Ordenar vuelos
function ordenarVuelos(criterio) {
    const contenedorVuelos = document.querySelector('.aerolineas');
    const vuelos = Array.from(document.querySelectorAll('.aereolinea'));

    vuelos.sort((a, b) => {
        const indiceA = Array.from(document.querySelectorAll('.aereolinea')).indexOf(a);
        const indiceB = Array.from(document.querySelectorAll('.aereolinea')).indexOf(b);

        const vueloA = vuelosMock[indiceA];
        const vueloB = vuelosMock[indiceB];

        if (criterio === 'precio-asc') {
            return vueloA.precio - vueloB.precio;
        } else if (criterio === 'precio-desc') {
            return vueloB.precio - vueloA.precio;
        } else if (criterio === 'duracion-asc') {
            // Ordenar por duración (convertir a minutos)
            const minutosA = extraerMinutos(vueloA.duracion);
            const minutosB = extraerMinutos(vueloB.duracion);
            return minutosA - minutosB;
        }
        return 0;
    });

    // Reordenar elementos en el DOM
    vuelos.forEach(vuelo => {
        contenedorVuelos.appendChild(vuelo);
    });

    console.log(`✓ Vuelos ordenados por: ${criterio}`);
}

// Extraer minutos de formato "2 h 15m"
function extraerMinutos(duracion) {
    const partes = duracion.match(/(\d+)\s*h\s*(\d+)\s*m/);
    if (partes) {
        const horas = parseInt(partes[1]);
        const minutos = parseInt(partes[2]);
        return horas * 60 + minutos;
    }
    return 0;
}

console.log('✓ Vuelos.js cargado - Filtros activos');