const ofertasMock = [
    {
        id: 1,
        origen: 'BUE',
        destino: 'MAD',
        rutaCompleta: 'Buenos Aires → Madrid',
        precioOriginal: 850,
        precioOferta: 550,
        descuento: 35,
        validoHasta: '2026-06-30'
    },
    {
        id: 2,
        origen: 'BUE',
        destino: 'MIA',
        rutaCompleta: 'Buenos Aires → Miami',
        precioOriginal: 620,
        precioOferta: 399,
        descuento: 35,
        validoHasta: '2026-06-25'
    },
    {
        id: 3,
        origen: 'BUE',
        destino: 'MEX',
        rutaCompleta: 'Buenos Aires → Ciudad de México',
        precioOriginal: 480,
        precioOferta: 290,
        descuento: 40,
        validoHasta: '2026-07-10'
    },
    {
        id: 4,
        origen: 'BUE',
        destino: 'NYC',
        rutaCompleta: 'Buenos Aires → Nueva York',
        precioOriginal: 750,
        precioOferta: 499,
        descuento: 33,
        validoHasta: '2026-06-28'
    },
    {
        id: 5,
        origen: 'BUE',
        destino: 'FCO',
        rutaCompleta: 'Buenos Aires → Roma',
        precioOriginal: 920,
        precioOferta: 599,
        descuento: 35,
        validoHasta: '2026-07-05'
    },
    {
        id: 6,
        origen: 'BUE',
        destino: 'CDG',
        rutaCompleta: 'Buenos Aires → París',
        precioOriginal: 890,
        precioOferta: 549,
        descuento: 38,
        validoHasta: '2026-07-15'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    inicializarOfertas();
    configurarEventosOfertas();
});

function inicializarOfertas() {
    console.log('✓ Ofertas.js cargado');
    mostrarOfertas(ofertasMock);
}

function mostrarOfertas(ofertas) {
    const ofertasLista = document.querySelector('.ofertas-lista');

    if (!ofertasLista) return;

    ofertasLista.innerHTML = '';

    if (ofertas.length === 0) {
        ofertasLista.innerHTML = '<p style="text-align: center; color: #FFC107;">No hay ofertas disponibles en este momento</p>';
        return;
    }

    ofertas.forEach(oferta => {
        const card = document.createElement('div');
        card.className = 'oferta-card';
        card.innerHTML = `
            <div class="oferta-ruta">
                <div class="oferta-lugar">
                    <span class="etiqueta">Origen</span>
                    <span class="ciudad">${oferta.rutaCompleta.split(' → ')[0]} (${oferta.origen})</span>
                </div>
                <i class="fa-solid fa-plane oferta-flecha"></i>
                <div class="oferta-lugar">
                    <span class="etiqueta">Destino</span>
                    <span class="ciudad">${oferta.rutaCompleta.split(' → ')[1]} (${oferta.destino})</span>
                </div>
            </div>
            <div class="oferta-precios">
                <span class="precio-tachado">$${oferta.precioOriginal} USD</span>
                <span class="precio-oferta">$${oferta.precioOferta} USD</span>
                <span class="badge-descuento">-${oferta.descuento}%</span>
            </div>
            <small style="color: #FFC107; display: block; margin: 0.5rem 0;">Válido hasta: ${oferta.validoHasta}</small>
            <button class="btn-oferta" onclick="aplicarOferta(${oferta.id})">Ver oferta</button>
        `;

        ofertasLista.appendChild(card);
    });

    console.log(`✓ ${ofertas.length} ofertas mostradas`);
}

function aplicarOferta(ofertaId) {
    const oferta = ofertasMock.find(o => o.id === ofertaId);

    if (!oferta) return;

    guardarDatos('ofertaAplicada', oferta);

    mostrarNotificacion(`Oferta ${oferta.destino} aplicada`, 'exito');

    setTimeout(() => {
        redirigir('vuelos.html', 500);
    }, 1000);

    console.log('✓ Oferta aplicada:', oferta);
}

function configurarEventosOfertas() {
    const cards = document.querySelectorAll('.oferta-card');

    cards.forEach(card => {
        card.style.cssText = `
            transition: all 0.3s ease;
            cursor: pointer;
        `;

        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    agregarFiltrosOfertas();

    console.log('✓ Eventos de ofertas configurados');
}

function agregarFiltrosOfertas() {
    const ofertasSeccion = document.querySelector('.ofertas-seccion');

    if (!ofertasSeccion || ofertasSeccion.querySelector('.filtros-ofertas')) return;

    const filtrosDiv = document.createElement('div');
    filtrosDiv.className = 'filtros-ofertas';
    filtrosDiv.style.cssText = `
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin: 2rem 0;
        flex-wrap: wrap;
    `;

    filtrosDiv.innerHTML = `
        <button onclick="filtrarOfertas('todas')" class="btn-filtro active">Todas</button>
        <button onclick="filtrarOfertas('mayor-descuento')" class="btn-filtro">Mayor descuento</button>
        <button onclick="filtrarOfertas('menor-precio')" class="btn-filtro">Menor precio</button>
        <button onclick="filtrarOfertas('proxima-vencer')" class="btn-filtro">Próximo a vencer</button>
    `;

    const titulo = ofertasSeccion.querySelector('.titulo-principal');
    if (titulo) {
        titulo.insertAdjacentElement('afterend', filtrosDiv);
    }

    const estilo = document.createElement('style');
    estilo.textContent = `
        .btn-filtro {
            padding: 0.6rem 1.2rem;
            border: 2px solid #2196F3;
            background-color: transparent;
            color: #2196F3;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }

        .btn-filtro:hover {
            background-color: #2196F3;
            color: white;
        }

        .btn-filtro.active {
            background-color: #2196F3;
            color: white;
        }
    `;

    if (!document.querySelector('style[data-ofertas="true"]')) {
        estilo.setAttribute('data-ofertas', 'true');
        document.head.appendChild(estilo);
    }
}

function filtrarOfertas(criterio) {
    let ofertasFiltradas = [...ofertasMock];

    document.querySelectorAll('.btn-filtro').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    switch (criterio) {
        case 'mayor-descuento':
            ofertasFiltradas.sort((a, b) => b.descuento - a.descuento);
            break;
        case 'menor-precio':
            ofertasFiltradas.sort((a, b) => a.precioOferta - b.precioOferta);
            break;
        case 'proxima-vencer':
            ofertasFiltradas.sort((a, b) => new Date(a.validoHasta) - new Date(b.validoHasta));
            break;
        default:
            ofertasFiltradas = [...ofertasMock];
    }

    mostrarOfertas(ofertasFiltradas);
    configurarEventosOfertas();

    console.log(`✓ Ofertas filtradas por: ${criterio}`);
}

function calcularAhorroTotal() {
    const ahorroTotal = ofertasMock.reduce((total, oferta) => {
        return total + (oferta.precioOriginal - oferta.precioOferta);
    }, 0);

    return ahorroTotal;
}


console.log('✓ Ofertas.js cargado');
console.log(`Ahorro total disponible en ofertas: $${calcularAhorroTotal()} USD`);