/**
 * marcas.js
 * ---------------------------------------------------------------------------
 * Lógica exclusiva de marcas.html: carrusel de marcas con navegación,
 * autoplay, y efectos de hover video.
 * Similar al carrusel de sucursales en home.js, pero para la página de marcas.
 * ---------------------------------------------------------------------------
 */

/**
 * CARRUSEL DE MARCAS (una tarjeta a la vez, con flechas + autoplay)
 * .brands-track es el riel con las 4 marcas en una sola línea.
 * Cada marca ocupa 100% del ancho del viewport, así que para mostrar la
 * marca N basta con mover el riel -N*100% con transform: translateX.
 */
const brandsTrack = document.getElementById('brands-track');
const brandsPrevBtn = document.getElementById('brands-prev');
const brandsNextBtn = document.getElementById('brands-next');
const brandsDotsContainer = document.getElementById('brands-dots');
const brandsCarousel = document.querySelector('.journey-carousel');

if (brandsTrack && brandsPrevBtn && brandsNextBtn && brandsDotsContainer && brandsCarousel) {
    const brandCards = Array.from(brandsTrack.querySelectorAll('.journey-card'));
    let brandsIndex = 0;
    const AUTOPLAY_MS = 5000; // Tiempo entre avances automáticos (5 segundos)
    let brandsAutoplayId = null;

    // Genera un punto indicador por cada marca
    brandCards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'journey-dot';
        dot.setAttribute('aria-label', `Ir a la marca ${i + 1}`);
        dot.addEventListener('click', () => {
            goToBrandsSlide(i);
            restartAutoplay();
        });
        brandsDotsContainer.appendChild(dot);
    });
    const brandsDots = Array.from(brandsDotsContainer.querySelectorAll('.journey-dot'));

    // Mueve el riel a la marca indicada y actualiza el punto activo
    function goToBrandsSlide(index) {
        brandsIndex = (index + brandCards.length) % brandCards.length;
        brandsTrack.style.transform = `translateX(-${brandsIndex * 100}%)`;
        brandsDots.forEach((dot, i) => dot.classList.toggle('active', i === brandsIndex));
    }

    // Arranca (o reinicia) el temporizador de avance automático
    function startAutoplay() {
        stopAutoplay();
        brandsAutoplayId = setInterval(() => goToBrandsSlide(brandsIndex + 1), AUTOPLAY_MS);
    }

    function stopAutoplay() {
        if (brandsAutoplayId) clearInterval(brandsAutoplayId);
    }

    function restartAutoplay() {
        startAutoplay();
    }

    // Botones de navegación
    brandsPrevBtn.addEventListener('click', () => {
        goToBrandsSlide(brandsIndex - 1);
        restartAutoplay();
    });

    brandsNextBtn.addEventListener('click', () => {
        goToBrandsSlide(brandsIndex + 1);
        restartAutoplay();
    });

    // Pausa mientras el mouse está sobre el carrusel; reanuda al salir
    brandsCarousel.addEventListener('mouseenter', stopAutoplay);
    brandsCarousel.addEventListener('mouseleave', startAutoplay);

    // Igual con el foco de teclado
    brandsCarousel.addEventListener('focusin', stopAutoplay);
    brandsCarousel.addEventListener('focusout', startAutoplay);

    goToBrandsSlide(0); // Estado inicial: primera marca
    startAutoplay();
}

/**
 * EFECTO HOVER: reproducir video de vista previa en tarjetas de marca
 * Igual a como funciona en home.js para las sucursales
 */
document.querySelectorAll('.journey-card').forEach((card) => {
    const img = card.querySelector('.journey-img');
    const video = card.querySelector('.journey-vid');

    if (img && video) {
        card.addEventListener('mouseenter', () => {
            img.style.opacity = '0';
            video.style.opacity = '1';
            video.play();
        });

        card.addEventListener('mouseleave', () => {
            img.style.opacity = '1';
            video.style.opacity = '0';
            video.pause();
            video.currentTime = 0;
        });
    }
});
