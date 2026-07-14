/**
 * main.js
 * ---------------------------------------------------------------------------
 * Lógica GLOBAL compartida por todas las páginas del sitio (index.html,
 * nosotros.html, futuras páginas...). Todo lo que vive aquí depende
 * únicamente de la navbar y el sidebar, que están presentes en cada página.
 *
 * Si una página necesita comportamiento propio (por ejemplo, el catálogo
 * de sucursales de index.html), ese código va en un archivo aparte
 * (home.js) para no cargar JS innecesario en páginas que no lo usan.
 * ---------------------------------------------------------------------------
 */

/**
 * 0. RESTAURAR TEMA GUARDADO AL CARGAR LA PÁGINA
 * Lee de localStorage y aplica el tema guardado antes de que se renderice
 */
(function() {
    const savedTheme = localStorage.getItem('porsche-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
})();

/**
 * 1. MODO OSCURO (interruptor manual)
 * Alterna la clase 'dark-mode' en <body>; las variables CSS (--porsche-bg,
 * --porsche-text, etc.) hacen el resto del cambio de color automáticamente.
 * Guarda la preferencia en localStorage para persistencia entre páginas.
 */
const themeToggleBtn = document.getElementById('theme-toggle');

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        // Togglear modo oscuro
        const isDarkMode = document.body.classList.toggle('dark-mode');
        
        // Guardar preferencia en localStorage
        if (isDarkMode) {
            localStorage.setItem('porsche-theme', 'dark');
        } else {
            localStorage.setItem('porsche-theme', 'light');
        }
    });
}

/**
 * 2. MENÚ LATERAL (SIDEBAR)
 * Abre/cierra el panel deslizable y bloquea el scroll del body mientras
 * está abierto (evita que la página se desplace detrás del overlay).
 */
const sidebar = document.getElementById('porsche-sidebar');
const openMenuBtn = document.getElementById('menu-open-btn');
const closeMenuBtn = document.getElementById('menu-close-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');

if (sidebar && openMenuBtn && closeMenuBtn && sidebarOverlay) {
    const openMenu = () => {
        sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
        // La entrada del panel la controla la transición CSS de `left`
        // (ver .sidebar-content en styles.css) — una sola fuente de animación.
    };

    const closeMenu = () => {
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
        closeSubmenus();
    };

    openMenuBtn.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    sidebarOverlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeMenu();
        }
    });
}

/**
 * 3. NAVEGACIÓN MULTIPANEL DEL SIDEBAR
 * La columna izquierda selecciona una categoría y la columna derecha muestra
 * únicamente su contenido, siguiendo el patrón de navegación de Porsche.
 */
const sidebarNavigation = document.querySelector('.sidebar-navigation');

if (sidebarNavigation) {
    sidebarNavigation.innerHTML = `
        <ul class="sidebar-menu-list">
            <li class="menu-item-parent">
                <button class="menu-parent-btn" data-submenu="modelos" aria-expanded="false" aria-controls="submenu-modelos">
                    <span class="menu-parent-text">Modelos</span>
                    <span class="menu-arrow">›</span>
                </button>
                <ul class="submenu submenu-modelos" id="submenu-modelos" aria-hidden="true">
                    <li class="model-item"><button type="button" class="model-link" data-model="718"><img src="images/Conexiones.jpg" alt="Imagen de prueba del modelo 718"><span><strong>718</strong><small>Gasolina</small></span><span class="model-arrow">›</span></button></li>
                    <li class="model-item"><button type="button" class="model-link" data-model="911"><img src="images/Tuberia.jpg" alt="Imagen de prueba del modelo 911"><span><strong>911</strong><small>Gasolina</small></span><span class="model-arrow">›</span></button></li>
                    <li class="model-item"><button type="button" class="model-link" data-model="taycan"><img src="images/conexiones2.jpg" alt="Imagen de prueba del modelo Taycan"><span><strong>Taycan</strong><small>Eléctrico</small></span><span class="model-arrow">›</span></button></li>
                    <li class="model-item"><button type="button" class="model-link" data-model="panamera"><img src="images/VRQ.png" alt="Imagen de prueba del modelo Panamera"><span><strong>Panamera</strong><small>Híbrido | Gasolina</small></span><span class="model-arrow">›</span></button></li>
                    <li class="model-item"><button type="button" class="model-link" data-model="macan"><img src="images/VRP.png" alt="Imagen de prueba del modelo Macan"><span><strong>Macan</strong><small>Eléctrico | Gasolina</small></span><span class="model-arrow">›</span></button></li>
                    <li class="model-item"><button type="button" class="model-link" data-model="cayenne"><img src="images/VRG.png" alt="Imagen de prueba del modelo Cayenne"><span><strong>Cayenne</strong><small>Eléctrico | Híbrido | Gasolina</small></span><span class="model-arrow">›</span></button></li>
                    <li class="model-detail-view" aria-live="polite">
                        <button type="button" class="model-detail-back"><span>‹</span> Modelos</button>
                        <div class="model-detail-navigation" aria-label="Seleccionar familia de modelo">
                            <button type="button" class="model-family-btn" data-family="718"><strong>718</strong><small>Gasolina</small><span>›</span></button>
                            <button type="button" class="model-family-btn" data-family="911"><strong>911</strong><small>Gasolina</small><span>›</span></button>
                            <button type="button" class="model-family-btn" data-family="taycan"><strong>Taycan</strong><small>Eléctrico</small><span>›</span></button>
                            <button type="button" class="model-family-btn" data-family="panamera"><strong>Panamera</strong><small>Híbrido | Gasolina</small><span>›</span></button>
                            <button type="button" class="model-family-btn" data-family="macan"><strong>Macan</strong><small>Eléctrico | Gasolina</small><span>›</span></button>
                            <button type="button" class="model-family-btn" data-family="cayenne"><strong>Cayenne</strong><small>Eléctrico | Híbrido | Gasolina</small><span>›</span></button>
                        </div>
                        <div class="model-detail-content" data-model-detail="718">
                            <h3>718</h3><p>Visión general de los modelos <span aria-hidden="true">&rarr;</span></p>
                            <div class="variant-list">
                                <a href="cotizacion.html" class="variant-item"><img src="images/Conexiones.jpg" alt="Imagen de prueba del 718 Cayman Style Edition"><span><strong>718 Cayman Style Edition</strong><small>2 variantes del modelo</small></span></a>
                                <a href="cotizacion.html" class="variant-item"><img src="images/Tuberia.jpg" alt="Imagen de prueba del 718 Boxster GTS 4.0"><span><strong>718 Boxster GTS 4.0</strong><small>1 variante del modelo</small></span></a>
                                <a href="cotizacion.html" class="variant-item"><img src="images/conexiones2.jpg" alt="Imagen de prueba del 718 Spyder RS"><span><strong>718 Spyder RS</strong><small>1 variante del modelo</small></span></a>
                                <a href="cotizacion.html" class="variant-item"><img src="images/VRQ.png" alt="Imagen de prueba del 718 Cayman GT4 RS"><span><strong>718 Cayman GT4 RS</strong><small>1 variante del modelo</small></span></a>
                            </div>
                        </div>
                        <div class="model-detail-content" data-model-detail="911">
                            <h3>911</h3><p>Visión general de los modelos <span aria-hidden="true">&rarr;</span></p>
                            <div class="variant-list"><a href="cotizacion.html" class="variant-item"><img src="images/Tuberia.jpg" alt="Imagen de prueba del 911 Carrera"><span><strong>911 Carrera</strong><small>Gasolina</small></span></a><a href="cotizacion.html" class="variant-item"><img src="images/VRP.png" alt="Imagen de prueba del 911 Targa"><span><strong>911 Targa</strong><small>Gasolina</small></span></a><a href="cotizacion.html" class="variant-item"><img src="images/VRG.png" alt="Imagen de prueba del 911 Turbo"><span><strong>911 Turbo</strong><small>Gasolina</small></span></a></div>
                        </div>
                        <div class="model-detail-content" data-model-detail="taycan">
                            <h3>Taycan</h3><p>Visión general de los modelos <span aria-hidden="true">&rarr;</span></p>
                            <div class="variant-list"><a href="cotizacion.html" class="variant-item"><img src="images/conexiones2.jpg" alt="Imagen de prueba del Taycan"><span><strong>Taycan</strong><small>Eléctrico</small></span></a><a href="cotizacion.html" class="variant-item"><img src="images/VRQ.png" alt="Imagen de prueba del Taycan GTS"><span><strong>Taycan GTS</strong><small>Eléctrico</small></span></a></div>
                        </div>
                        <div class="model-detail-content" data-model-detail="panamera">
                            <h3>Panamera</h3><p>Visión general de los modelos <span aria-hidden="true">&rarr;</span></p>
                            <div class="variant-list"><a href="cotizacion.html" class="variant-item"><img src="images/VRQ.png" alt="Imagen de prueba del Panamera"><span><strong>Panamera</strong><small>Híbrido | Gasolina</small></span></a><a href="cotizacion.html" class="variant-item"><img src="images/VRP.png" alt="Imagen de prueba del Panamera Turbo"><span><strong>Panamera Turbo</strong><small>Híbrido</small></span></a></div>
                        </div>
                        <div class="model-detail-content" data-model-detail="macan">
                            <h3>Macan</h3><p>Visión general de los modelos <span aria-hidden="true">&rarr;</span></p>
                            <div class="variant-list"><a href="cotizacion.html" class="variant-item"><img src="images/VRP.png" alt="Imagen de prueba del Macan"><span><strong>Macan</strong><small>Eléctrico | Gasolina</small></span></a><a href="cotizacion.html" class="variant-item"><img src="images/VRG.png" alt="Imagen de prueba del Macan GTS"><span><strong>Macan GTS</strong><small>Eléctrico</small></span></a></div>
                        </div>
                        <div class="model-detail-content" data-model-detail="cayenne">
                            <h3>Cayenne</h3><p>Visión general de los modelos <span aria-hidden="true">&rarr;</span></p>
                            <div class="variant-list"><a href="cotizacion.html" class="variant-item"><img src="images/VRG.png" alt="Imagen de prueba del Cayenne"><span><strong>Cayenne</strong><small>Eléctrico | Híbrido | Gasolina</small></span></a><a href="cotizacion.html" class="variant-item"><img src="images/Conexiones.jpg" alt="Imagen de prueba del Cayenne Turbo"><span><strong>Cayenne Turbo</strong><small>Híbrido | Gasolina</small></span></a></div>
                        </div>
                    </li>
                </ul>
            </li>
            <li class="menu-item-parent">
                <button class="menu-parent-btn" data-submenu="asesoramiento" aria-expanded="false" aria-controls="submenu-asesoramiento">
                    <span class="menu-parent-text">Asesoramiento y compra</span>
                    <span class="menu-arrow">›</span>
                </button>
                <ul class="submenu" id="submenu-asesoramiento" aria-hidden="true">
                    <li><a href="cotizacion.html" class="submenu-link">Configurar solución</a></li>
                    <li><a href="catalogo.html" class="submenu-link">Comparar productos</a></li>
                    <li><a href="cotizacion.html" class="submenu-link">Solicitar cotización</a></li>
                    <li><a href="cotizacion.html" class="submenu-link">Financiamiento</a></li>
                    <li><a href="nosotros.html" class="submenu-link">Asesoría técnica</a></li>
                </ul>
            </li>
            <li class="menu-item-parent">
                <button class="menu-parent-btn" data-submenu="servicios" aria-expanded="false" aria-controls="submenu-servicios">
                    <span class="menu-parent-text">Servicios</span>
                    <span class="menu-arrow">›</span>
                </button>
                <ul class="submenu" id="submenu-servicios" aria-hidden="true">
                    <li><a href="cotizacion.html" class="submenu-link">Mantenimiento y soporte</a></li>
                    <li><a href="cotizacion.html" class="submenu-link">Refacciones y accesorios</a></li>
                    <li><a href="cotizacion.html" class="submenu-link">Servicio para empresas</a></li>
                    <li><a href="cotizacion.html" class="submenu-link">Contacto de servicio</a></li>
                </ul>
            </li>
            <li class="menu-item-parent">
                <button class="menu-parent-btn" data-submenu="experiencia" aria-expanded="false" aria-controls="submenu-experiencia">
                    <span class="menu-parent-text">Experiencia</span>
                    <span class="menu-arrow">›</span>
                </button>
                <ul class="submenu" id="submenu-experiencia" aria-hidden="true">
                    <li><a href="nosotros.html" class="submenu-link">Conoce Válvulas Ros</a></li>
                    <li><a href="marcas.html" class="submenu-link">Nuestras marcas</a></li>
                    <li><a href="index.html" class="submenu-link">Soluciones industriales</a></li>
                    <li><a href="cotizacion.html" class="submenu-link">Proyectos especiales</a></li>
                </ul>
            </li>
            <li class="menu-item-parent">
                <button class="menu-parent-btn" data-submenu="concesionario" aria-expanded="false" aria-controls="submenu-concesionario">
                    <span class="menu-parent-text">Concesionario</span>
                    <span class="menu-arrow">›</span>
                </button>
                <ul class="submenu" id="submenu-concesionario" aria-hidden="true">
                    <li><a href="index.html" class="submenu-link">Ubicaciones</a></li>
                    <li><a href="cotizacion.html" class="submenu-link">Encuentra una sucursal</a></li>
                    <li><a href="cotizacion.html" class="submenu-link">Contáctanos</a></li>
                    <li><a href="nosotros.html" class="submenu-link">Quiénes Somos</a></li>
                </ul>
            </li>
        </ul>
    `;
}

const menuParentBtns = document.querySelectorAll('.menu-parent-btn');
const submenuPanels = document.querySelectorAll('.submenu');

const closeSubmenus = () => {
    menuParentBtns.forEach((menuBtn) => {
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
    });
    submenuPanels.forEach((panel) => {
        panel.classList.remove('is-visible');
        panel.setAttribute('aria-hidden', 'true');
    });
    document.querySelector('#submenu-modelos')?.classList.remove('is-detail');
    document.querySelectorAll('.model-detail-content').forEach((detail) => detail.classList.remove('is-visible'));
};

menuParentBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        const isActive = btn.classList.contains('active');

        closeSubmenus();

        if (!isActive && panel) {
            btn.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
            panel.classList.add('is-visible');
            panel.setAttribute('aria-hidden', 'false');
        }
    });
});

document.querySelectorAll('.submenu-back').forEach((backBtn) => {
    backBtn.addEventListener('click', closeSubmenus);
});

const modelsPanel = document.querySelector('#submenu-modelos');
const modelButtons = document.querySelectorAll('.model-link[data-model]');
const modelDetailView = document.querySelector('.model-detail-view');
const modelDetailBack = document.querySelector('.model-detail-back');
const modelDetailContents = document.querySelectorAll('.model-detail-content');
const modelFamilyBtns = document.querySelectorAll('.model-family-btn');

const closeModelDetail = () => {
    if (!modelsPanel) return;
    modelsPanel.classList.remove('is-detail');
    modelDetailContents.forEach((detail) => detail.classList.remove('is-visible'));
    modelFamilyBtns.forEach((familyBtn) => familyBtn.classList.remove('active'));
};

const showModelFamily = (selectedModel) => {
    const selectedDetail = document.querySelector(`[data-model-detail="${selectedModel}"]`);
    const selectedFamily = document.querySelector(`[data-family="${selectedModel}"]`);

    modelDetailContents.forEach((detail) => detail.classList.remove('is-visible'));
    modelFamilyBtns.forEach((familyBtn) => familyBtn.classList.remove('active'));

    if (modelsPanel && selectedDetail) {
        modelsPanel.classList.add('is-detail');
        selectedDetail.classList.add('is-visible');
        selectedFamily?.classList.add('active');
    }
};

modelButtons.forEach((modelButton) => {
    modelButton.addEventListener('click', () => {
        showModelFamily(modelButton.getAttribute('data-model'));
    });
});

modelFamilyBtns.forEach((familyBtn) => {
    familyBtn.addEventListener('click', () => {
        showModelFamily(familyBtn.getAttribute('data-family'));
    });
});

if (modelDetailView && modelDetailBack) {
    modelDetailBack.addEventListener('click', closeModelDetail);
}

/**
 * 3.5. NAVBAR TRANSPARENTE → SÓLIDA AL HACER SCROLL
 * Sobre el hero de video (index.html) la navbar nace transparente; en
 * páginas sin hero de pantalla completa (nosotros, catálogo, etc.) el
 * contenido empieza en blanco/claro, así que la dejamos sólida siempre
 * para que el texto blanco del logo/menú no quede ilegible.
 */
const porscheNavbar = document.querySelector('.porsche-navbar');

if (porscheNavbar) {
    const heroSection = document.querySelector('.hero-section');

    if (!heroSection) {
        porscheNavbar.classList.add('scrolled');
    } else {
        const updateNavbarState = () => {
            porscheNavbar.classList.toggle('scrolled', window.scrollY > 80);
        };
        updateNavbarState();
        window.addEventListener('scroll', updateNavbarState, { passive: true });
    }
}

/**
 * 4. AÑO DINÁMICO EN EL FOOTER
 * Evita tener que actualizar "© 2026" a mano cada enero en cada página.
 */
const footerYearSpan = document.getElementById('footer-year');

if (footerYearSpan) {
    footerYearSpan.textContent = new Date().getFullYear();
}
