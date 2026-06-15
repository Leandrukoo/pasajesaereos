// Funcionalidades de todo el sitio

document.addEventListener('DOMContentLoaded', function() {
    inicializarNavegacion();
    configurarEventosGlobales();
    actualizarNombreUsuario();
});

// Nombre del usuario en el header

function actualizarNombreUsuario() {
    const usuario = cargarDatos('usuarioLogueado');
    const linkPerfil = document.querySelector('.link-perfil');
    if (linkPerfil && usuario && usuario.nombre) {
        linkPerfil.textContent = `¡Hola, ${usuario.nombre.split(' ')[0]}!`;
    }
}

// Navegacion responsive

/**
 * Inicializa la navegacion responsiva
 */
function inicializarNavegacion() {
    const navHeader = document.querySelector('.nav_header');
    const ulHeader = document.querySelector('.ul_header');

    // Crear boton hamburguesa si no existe
    if (!document.querySelector('.menu-hamburguesa')) {
        crearBtnHamburguesa();
    }

    // Event para toggle del menú
    const btnMenu = document.querySelector('.menu-hamburguesa');
    if (btnMenu) {
        btnMenu.addEventListener('click', function() {
            ulHeader.classList.toggle('menu-activo');
            btnMenu.classList.toggle('activo');
        });

        // Cerrar menu al hacer click en un link
        const links = ulHeader.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                ulHeader.classList.remove('menu-activo');
                btnMenu.classList.remove('activo');
            });
        });
    }

    // Cerrar menu si se redimensiona la ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            ulHeader.classList.remove('menu-activo');
            if (btnMenu) btnMenu.classList.remove('activo');
        }
    });
}

/**
 * Crea el boton hamburguesa dinámicamente
 */
function crearBtnHamburguesa() {
    const nav = document.querySelector('.nav_header');
    const btnMenu = document.createElement('button');

    btnMenu.className = 'menu-hamburguesa';
    btnMenu.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    btnMenu.setAttribute('aria-label', 'Toggle menu');
    btnMenu.setAttribute('type', 'button');

    nav.appendChild(btnMenu);
}

// Eventos globales

/**
 * Configura eventos globales del sitio
 */
function configurarEventosGlobales() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', manejarSmoothScroll);
    });

    detectarModoSistema();
}

/**
 * Smooth scroll para links internos
 */
function manejarSmoothScroll(e) {
    const href = this.getAttribute('href');
    if (href === '#') {
        e.preventDefault();
        return;
    }

    const elemento = document.querySelector(href);
    if (elemento) {
        e.preventDefault();
        elemento.scrollIntoView({ behavior: 'smooth' });
    }
}


/**
 * Detecta y aplica el modo oscuro/claro del sistema
 */
function detectarModoSistema() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.setAttribute('data-tema', 'oscuro');
    } else {
        document.body.setAttribute('data-tema', 'claro');
    }

    // Listener para cambios de modo
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        document.body.setAttribute('data-tema', e.matches ? 'oscuro' : 'claro');
    });
}

// Utilidades de la navegacion

/**
 * Redirige a otra pagina
 * @param {string} url - URL destino
 * @param {number} delay - Retraso en ms 
 */
function redirigir(url, delay = 0) {
    if (delay > 0) {
        setTimeout(() => {
            window.location.href = url;
        }, delay);
    } else {
        window.location.href = url;
    }
}

/**
 * Vuelve a la pagina anterior
 */
function volverAtras() {
    window.history.back();
}

/**
 * Recarga la pagina
 */
function recargarPagina() {
    location.reload();
}

// Estilos responsive
/**
 * Inyecta estilos CSS para responsive
 */
function inyectarEstilosResponsivos() {
    const estilo = document.createElement('style');
    estilo.textContent = `
        /* MENÚ HAMBURGUESA */
        .menu-hamburguesa {
            display: none;
            flex-direction: column;
            background: none;
            border: none;
            cursor: pointer;
            gap: 5px;
            padding: 10px;
        }

        .menu-hamburguesa span {
            width: 25px;
            height: 3px;
            background-color: white;
            border-radius: 3px;
            transition: 0.3s;
        }

        .menu-hamburguesa.activo span:nth-child(1) {
            transform: rotate(45deg) translate(10px, 10px);
        }

        .menu-hamburguesa.activo span:nth-child(2) {
            opacity: 0;
        }

        .menu-hamburguesa.activo span:nth-child(3) {
            transform: rotate(-45deg) translate(8px, -8px);
        }

        /* RESPONSIVE - Tablets y móviles */
        @media (max-width: 1024px) {
            .busqueda-vuelos {
                width: 90% !important;
                padding: 1.5rem !important;
            }

            .fila-formulario {
                flex-direction: column !important;
            }

            .items-formulario {
                width: 100% !important;
            }
        }

        @media (max-width: 768px) {
            .menu-hamburguesa {
                display: flex;
            }

            .ul_header {
                display: none;
                position: absolute;
                top: 80px;
                right: 0;
                left: 0;
                background-color: rgba(0, 0, 0, 0.95);
                flex-direction: column;
                padding: 20px;
                border-top: 1px solid #444;
                animation: slideDown 0.3s ease-in-out;
            }

            .ul_header.menu-activo {
                display: flex;
            }

            .li_header {
                padding: 15px 0;
                border-bottom: 1px solid #444;
            }

            .busqueda-vuelos {
                width: 95% !important;
                padding: 1rem !important;
                margin: 0.5rem auto !important;
            }

            .titulo-principal h2 {
                font-size: 1.5rem !important;
            }

            .titulo-principal h3 {
                font-size: 1rem !important;
            }

            .fila-formulario {
                flex-direction: column !important;
                gap: 0.5rem !important;
            }

            .items-formulario {
                width: 100% !important;
                margin-left: 0 !important;
            }

            /* Filtros en layout mobile */
            .resultados {
                flex-direction: column !important;
            }

            .filtro {
                width: 100% !important;
                margin-bottom: 2rem;
            }

            .aerolineas {
                grid-template-columns: 1fr !important;
            }

            .filtro_equipaje {
                width: 100% !important;
            }
        }

        @media (max-width: 480px) {
            .logo-perfil-container {
                flex-direction: column !important;
                align-items: flex-start !important;
            }

            .img_header {
                width: 60px !important;
            }

            .titulo-principal h2 {
                font-size: 1.2rem !important;
            }

            .items-formulario button {
                height: 2.5rem !important;
                font-size: 1rem !important;
            }
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;

    document.head.appendChild(estilo);
}

// Ejecutar al cargar
inyectarEstilosResponsivos();

console.log('✓ Main.js cargado - Funcionalidades globales activas');
