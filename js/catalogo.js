/**
 * catalogo.js
 * Lógica específica de la página de catálogo de productos
 * Maneja filtros, búsqueda, y comportamiento de tarjetas de productos
 */

// ========== 0. DETECTAR CATEGORÍA DE URL ==========
function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('categoria');
}

// ========== 1. INICIALIZAR AÑO EN FOOTER ==========
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ========== 2. INICIALIZAR CATEGORÍA ==========
window.addEventListener('DOMContentLoaded', () => {
    const categoria = getCategoryFromURL();
    const categoryFilters = {
        'conexiones': 'conexion',
        'valvulas': 'valvula',
        'bridas': 'brida'
    };

    if (categoria) {
        // Actualizar título con la categoría
        const catalogTitle = document.querySelector('.catalog-title');
        if (catalogTitle) {
            const categoryNames = {
                'conexiones': 'Conexiones',
                'tuberia': 'Tuberías',
                'valvulas': 'Válvulas',
                'bridas': 'Bridas'
            };
            catalogTitle.textContent = categoryNames[categoria] || 'Catálogo de Productos';
        }
        
        // Auto-seleccionar filtro de tipo
        const tipoFilters = document.querySelectorAll('input[name="tipo"]');
        tipoFilters.forEach(filter => {
            if (filter.value === categoryFilters[categoria]) {
                filter.checked = true;
            }
        });

        applyFilters();
    }
});

// ========== 3. MANEJO DE FILTROS COLAPSABLES ==========
const filterGroupButtons = document.querySelectorAll('.filter-group-btn');

filterGroupButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filterName = button.dataset.filter;
        const filterOptions = document.getElementById(`filter-${filterName}`);
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        // Alternar estado
        button.setAttribute('aria-expanded', !isExpanded);
        
        if (isExpanded) {
            filterOptions.classList.add('is-collapsed');
        } else {
            filterOptions.classList.remove('is-collapsed');
        }
    });
});

// ========== 4. MANEJO DE CHECKBOXES DE FILTRO ==========
const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
const clearFiltersBtn = document.getElementById('clear-filters-btn');

filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        applyFilters();
    });
});

// ========== 5. FUNCIÓN PARA APLICAR FILTROS ==========
function applyFilters() {
    // Recopilar filtros seleccionados
    const selectedFilters = {
        marca: [],
        material: [],
        tipo: [],
        conexion: [],
        tamaño: []
    };

    filterCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const filterType = checkbox.name;
            selectedFilters[filterType].push(checkbox.value);
        }
    });

    filterProducts(selectedFilters);

    // Al reducir el número de tarjetas visibles la página se vuelve más
    // corta, y el navegador "recorta" el scroll hacia el nuevo final si
    // estaba más abajo que la nueva altura. Subimos al encabezado del
    // catálogo para que el usuario siempre vea el resultado del filtro.
    const catalogHeader = document.querySelector('.catalog-header');
    if (catalogHeader) {
        catalogHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ========== 6. FUNCIÓN PARA FILTRAR PRODUCTOS ==========
// Duración de la salida (debe coincidir con .is-filtering-out en catalogo.css)
const FILTER_OUT_DURATION = 280;

function filterProducts(filters) {
    const productCards = document.querySelectorAll('.product-card');
    let visibleIndex = 0;

    productCards.forEach(card => {
        // Una tarjeta coincide si cumple todos los grupos de filtros activos.
        const shouldShow = Object.entries(filters).every(([filterType, values]) => {
            if (values.length === 0) return true;
            const cardValue = card.dataset[filterType === 'tamaño' ? 'tamano' : filterType];
            return values.includes(cardValue);
        });

        if (shouldShow) {
            const wasHidden = card.classList.contains('is-filtered-out') || card.style.display === 'none';

            card.classList.remove('is-filtered-out', 'is-filtering-out', 'is-filtered-in');
            card.style.display = '';

            // Solo re-anima si la tarjeta estaba oculta (evita "parpadeo" en las que ya se veían)
            if (wasHidden) {
                void card.offsetWidth; // fuerza reflow para poder reiniciar la animación
                card.style.animationDelay = `${Math.min(visibleIndex, 12) * 0.04}s`;
                card.classList.add('is-filtered-in');
            }
            visibleIndex++;
        } else if (!card.classList.contains('is-filtered-out')) {
            // Transición de salida suave en vez de desaparecer de golpe
            card.classList.remove('is-filtered-in');
            card.classList.add('is-filtering-out');
            setTimeout(() => {
                card.classList.remove('is-filtering-out');
                card.classList.add('is-filtered-out');
            }, FILTER_OUT_DURATION);
        }
    });
}

// ========== 7. BOTÓN LIMPIAR FILTROS ==========
clearFiltersBtn.addEventListener('click', () => {
    // Animación del botón
    clearFiltersBtn.classList.remove('is-animating');
    void clearFiltersBtn.offsetWidth;
    clearFiltersBtn.classList.add('is-animating');
    
    // Limpiar filtros con transición
    filterCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    applyFilters();
    
    clearFiltersBtn.addEventListener('animationend', () => {
        clearFiltersBtn.classList.remove('is-animating');
    }, { once: true });
});

// ========== 8. MENÚ LATERAL Y TEMA (compartido con main.js) ==========
// El código del menú y tema ya está en main.js y se ejecuta automáticamente
