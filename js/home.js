/**
 * home.js
 * ---------------------------------------------------------------------------
 * Lógica exclusiva de index.html: catálogo de sucursales, control del video
 * del hero y el efecto de video en hover de la sección "viaje".
 * Requiere que main.js se haya cargado antes (comparten la página, pero no
 * hay dependencia real de código entre ambos archivos).
 * ---------------------------------------------------------------------------
 */

/**
 * 1. BASE DE DATOS LOCAL DE SUCURSALES
 * En un sitio real, esto vendría de una API o un JSON externo; aquí se deja
 * como objeto en memoria porque el catálogo es pequeño y no cambia seguido.
 * La clave debe coincidir con el atributo data-sucursal de cada tarjeta.
 */
const sucursalDatabase = {
    PUEBLA: {
        address: 'Av. Industrial 1204, Puebla, Pue.',
        img: 'images/VRP.png',
        phone: '(222) 555-0110',
        hours: 'Lun-Vie 8:00-18:00, Sáb 9:00-14:00',
        coverage: 'Puebla y zona conurbada',
        lat: 19.0434,
        lng: -98.1974,
    },
    QUERETARO: {
        address: 'Blvd. Bernardo Quintana 850, Querétaro, Qro.',
        img: 'images/VRQ.png',
        phone: '(442) 555-0132',
        hours: 'Lun-Vie 8:00-18:00, Sáb 9:00-14:00',
        coverage: 'Querétaro, San Juan del Río',
        lat: 20.5888,
        lng: -100.3899,
    },
    GUADALAJARA: {
        address: 'Av. López Mateos Sur 2375, Guadalajara, Jal.',
        img: 'images/VRG.png',
        phone: '(33) 555-0145',
        hours: 'Lun-Vie 8:00-18:00, Sáb 9:00-14:00',
        coverage: 'ZMG y Occidente',
        lat: 20.6593,
        lng: -103.3496,
    },
    CDMX: {
        address: 'Eje Central Lázaro Cárdenas 320, CDMX',
        img: 'images/VRM.png',
        phone: '(55) 555-0198',
        hours: 'Lun-Vie 8:00-19:00, Sáb 9:00-15:00',
        coverage: 'CDMX y Área Metropolitana',
        lat: 19.4326,
        lng: -99.1332,
    },
};

/**
 * 2. INTERCAMBIO DE VISTAS (catálogo <-> panel de detalles de sucursal)
 * No son páginas distintas: es la misma página ocultando/mostrando secciones.
 * Esto es aceptable aquí porque es un detalle secundario dentro de index.html,
 * no una página de contenido propia (a diferencia de nosotros.html, que sí
 * es una URL real para poder compartirla, indexarla en buscadores, etc.).
 */
const catalogSection = document.querySelector('.porsche-grid-container');
const journeySectionBox = document.querySelector('.journey-section');
const heroSection = document.querySelector('.hero-section');
const detailsSection = document.getElementById('porsche-details-view');
const backBtn = document.getElementById('back-btn');

if (catalogSection && detailsSection) {
    document.querySelectorAll('.card-link').forEach((link) => {
        link.addEventListener('click', (e) => {
            const card = e.target.closest('.porsche-card');
            const sucursalKey = card.getAttribute('data-sucursal');
            const sucursalNombre = card.querySelector('.card-title').innerText;
            const sucursalData = sucursalDatabase[sucursalKey];

            // Las tarjetas de materiales usan navegación real y no pertenecen a este detalle.
            if (!sucursalData) return;

            e.preventDefault();

            // Actualiza el contenido de texto
            document.getElementById('detail-title').innerText = sucursalNombre;
            document.getElementById('detail-address').innerText = sucursalData.address;
            document.getElementById('detail-img').src = sucursalData.img;
            document.getElementById('spec-phone').innerText = sucursalData.phone;
            document.getElementById('spec-hours').innerText = sucursalData.hours;
            document.getElementById('spec-coverage').innerText = sucursalData.coverage;

            // Genera la URL del mapa embebido de Google Maps con las coordenadas
            const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.0!2d${sucursalData.lng}!3d${sucursalData.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${sucursalData.lat}%2C${sucursalData.lng}!5e0!3m2!1ses!2smx!4v1720555200000`;
            document.getElementById('location-map').src = mapUrl;

            catalogSection.classList.add('hidden');
            journeySectionBox.classList.add('hidden');
            heroSection.classList.add('hidden');
            detailsSection.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    backBtn.addEventListener('click', () => {
        catalogSection.classList.remove('hidden');
        journeySectionBox.classList.remove('hidden');
        heroSection.classList.remove('hidden');
        detailsSection.classList.add('hidden');
    });
}

/**
 * 3. CONTROL DEL VIDEO DEL HERO (play / pause)
 * Actualiza también aria-label para que un lector de pantalla anuncie
 * la acción disponible ("Pausar video" / "Reproducir video"), no un texto fijo.
 */
const heroVideo = document.querySelector('.hero-video');
const videoControlBtn = document.getElementById('video-control-btn');

if (heroVideo && videoControlBtn) {
    videoControlBtn.addEventListener('click', () => {
        if (heroVideo.paused) {
            heroVideo.play();
            videoControlBtn.classList.remove('paused');
            videoControlBtn.setAttribute('aria-label', 'Pausar video');
        } else {
            heroVideo.pause();
            videoControlBtn.classList.add('paused');
            videoControlBtn.setAttribute('aria-label', 'Reproducir video');
        }
    });
}

/**
 * 4. CLICK EN TARJETAS DE SUCURSALES (journey-card con data-sucursal)
 * Cuando se clickea una sucursal en la sección "viaje", muestra el detalle.
 * Similar al comportamiento de .porsche-card, pero aplicado a .journey-card.
 */
if (journeySectionBox && detailsSection) {
    document.querySelectorAll('.journey-card[data-sucursal]').forEach((card) => {
        card.addEventListener('click', (e) => {
            const sucursalKey = card.getAttribute('data-sucursal');
            const sucursalNombre = card.querySelector('.journey-model').innerText;
            const sucursalData = sucursalDatabase[sucursalKey];

            if (!sucursalData) return;

            // Actualiza el contenido de texto
            document.getElementById('detail-title').innerText = sucursalNombre;
            document.getElementById('detail-address').innerText = sucursalData.address;
            document.getElementById('detail-img').src = sucursalData.img;
            document.getElementById('spec-phone').innerText = sucursalData.phone;
            document.getElementById('spec-hours').innerText = sucursalData.hours;
            document.getElementById('spec-coverage').innerText = sucursalData.coverage;

            // Genera la URL del mapa embebido de Google Maps con las coordenadas
            const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.0!2d${sucursalData.lng}!3d${sucursalData.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${sucursalData.lat}%2C${sucursalData.lng}!5e0!3m2!1ses!2smx!4v1720555200000`;
            document.getElementById('location-map').src = mapUrl;

            catalogSection.classList.add('hidden');
            journeySectionBox.classList.add('hidden');
            heroSection.classList.add('hidden');
            detailsSection.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

/**
 * 5. CARRUSEL DE SUCURSALES (una tarjeta a la vez, con flechas + autoplay)
 * .journey-track es el riel con las 4 tarjetas en una sola línea (display:flex).
 * Cada tarjeta ocupa 100% del ancho del viewport, así que para mostrar la
 * tarjeta N basta con mover el riel -N*100% con transform: translateX.
 * El usuario puede seguir controlando con las flechas o los puntos en
 * cualquier momento; además avanza solo cada pocos segundos, y se detiene
 * mientras el mouse está encima (para no pelear con el control manual).
 */
const journeyTrack = document.getElementById('journey-track');
const journeyPrevBtn = document.getElementById('journey-prev');
const journeyNextBtn = document.getElementById('journey-next');
const journeyDotsContainer = document.getElementById('journey-dots');
const journeyCarousel = document.querySelector('.journey-carousel');

if (journeyTrack && journeyPrevBtn && journeyNextBtn && journeyDotsContainer && journeyCarousel) {
    const journeyCards = Array.from(journeyTrack.querySelectorAll('.journey-card'));
    let journeyIndex = 0;
    const AUTOPLAY_MS = 5000; // Tiempo entre avances automáticos (5 segundos)
    let journeyAutoplayId = null;

    // Genera un punto indicador por cada tarjeta (se recrean solo una vez al cargar)
    journeyCards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'journey-dot';
        dot.setAttribute('aria-label', `Ir a la sucursal ${i + 1}`);
        dot.addEventListener('click', () => {
            goToJourneySlide(i);
            restartAutoplay(); // Un clic manual reinicia el conteo, no lo interrumpe
        });
        journeyDotsContainer.appendChild(dot);
    });
    const journeyDots = Array.from(journeyDotsContainer.querySelectorAll('.journey-dot'));

    // Mueve el riel a la tarjeta indicada y actualiza el punto activo
    function goToJourneySlide(index) {
        // Ciclo circular: después de la última vuelve a la primera y viceversa
        journeyIndex = (index + journeyCards.length) % journeyCards.length;
        journeyTrack.style.transform = `translateX(-${journeyIndex * 100}%)`;
        journeyDots.forEach((dot, i) => dot.classList.toggle('active', i === journeyIndex));
    }

    // Arranca (o reinicia) el temporizador de avance automático
    function startAutoplay() {
        stopAutoplay(); // Evita temporizadores duplicados
        journeyAutoplayId = setInterval(() => goToJourneySlide(journeyIndex + 1), AUTOPLAY_MS);
    }

    function stopAutoplay() {
        if (journeyAutoplayId) clearInterval(journeyAutoplayId);
    }

    // Al interactuar manualmente (flecha o punto) se reinicia el conteo,
    // así el auto-avance no "compite" justo después de un clic del usuario
    function restartAutoplay() {
        startAutoplay();
    }

    journeyPrevBtn.addEventListener('click', () => {
        goToJourneySlide(journeyIndex - 1);
        restartAutoplay();
    });

    journeyNextBtn.addEventListener('click', () => {
        goToJourneySlide(journeyIndex + 1);
        restartAutoplay();
    });

    // Pausa mientras el mouse está sobre el carrusel; reanuda al salir
    journeyCarousel.addEventListener('mouseenter', stopAutoplay);
    journeyCarousel.addEventListener('mouseleave', startAutoplay);

    // Igual con el foco de teclado: si alguien está navegando con Tab
    // dentro del carrusel, no queremos que se mueva solo debajo de sus dedos
    journeyCarousel.addEventListener('focusin', stopAutoplay);
    journeyCarousel.addEventListener('focusout', startAutoplay);

    goToJourneySlide(0); // Estado inicial: primera sucursal y primer punto activo
    startAutoplay();
}

/**
 * 6. EFECTO HOVER: reproducir video de vista previa en la sección "viaje"
 * Cada tarjeta tiene una <img> estática y un <video> superpuesto que solo
 * se reproduce mientras el mouse está encima (ahorra ancho de banda).
 */
document.querySelectorAll('.journey-card').forEach((card) => {
    const preview = card.querySelector('.journey-vid');
    if (!preview) return;

    card.addEventListener('mouseenter', () => {
        preview.play().catch(() => {
            // Se ignora: algunos navegadores bloquean el autoplay con sonido,
            // aunque este video está en 'muted' así que no debería pasar.
        });
    });

    card.addEventListener('mouseleave', () => {
        preview.pause();
        preview.currentTime = 0; // reinicia el video para el próximo hover
    });
});
