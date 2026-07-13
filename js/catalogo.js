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
        material: [],
        tipo: [],
        tamaño: [],
        presion: []
    };

    filterCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const filterType = checkbox.name;
            selectedFilters[filterType].push(checkbox.value);
        }
    });

    filterProducts(selectedFilters);
}

// ========== 6. FUNCIÓN PARA FILTRAR PRODUCTOS ==========
function filterProducts(filters) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Una tarjeta coincide si cumple todos los grupos de filtros activos.
        const shouldShow = Object.entries(filters).every(([filterType, values]) => {
            if (values.length === 0) return true;
            const cardValue = card.dataset[filterType === 'tamaño' ? 'tamano' : filterType];
            return values.includes(cardValue);
        });
        
        if (shouldShow) {
            card.classList.remove('is-filtered-out');
            card.classList.add('is-filtered-in');
        } else {
            card.classList.remove('is-filtered-in');
            card.classList.add('is-filtered-out');
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
