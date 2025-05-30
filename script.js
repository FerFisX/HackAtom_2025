// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Función para cargar HTML externo ---
    async function loadHtml(url, elementId) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const placeholder = document.getElementById(elementId);
            if (placeholder) {
                placeholder.innerHTML = html;
            }
        } catch (error) {
            console.error(`Error loading ${url}:`, error);
        }
    }

    // Cargar el header y el footer
    loadHtml('assets/header.html', 'header-placeholder')
        .then(() => {
            // Inicializar la lógica del menú responsive DESPUÉS de que el header se haya cargado
            initNavigation();
            // Resaltar el enlace activo de la navegación principal
            highlightActiveNav();
        });
    loadHtml('assets/footer.html', 'footer-placeholder');

    // --- Lógica para la Barra de Navegación Móvil ---
    function initNavigation() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navList = document.querySelector('.nav-list');

        if (menuToggle && navList) {
            menuToggle.addEventListener('click', () => {
                navList.classList.toggle('open');
            });

            document.addEventListener('click', (event) => {
                if (!menuToggle.contains(event.target) && !navList.contains(event.target)) {
                    navList.classList.remove('open');
                }
            });

            navList.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 767) {
                        navList.classList.remove('open');
                    }
                });
            });
        }
    }

    // --- Resaltar el enlace de navegación principal activo ---
    function highlightActiveNav() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-list a');

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('href');

            if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // --- Nuevo Código para la Barra de Navegación Interna (On-Page Nav) ---
    const onPageNavPlaceholder = document.getElementById('on-page-nav-placeholder');

    // Solo generamos la barra si estamos en index.html (la página de Beneficios)
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const sections = document.querySelectorAll('.section-block[id]'); // Selecciona todas las secciones con ID
        const onPageNavList = document.createElement('ul');
        onPageNavList.classList.add('on-page-nav-list');

        sections.forEach(section => {
            const sectionTitle = section.querySelector('.section-title');
            if (sectionTitle) {
                const listItem = document.createElement('li');
                listItem.classList.add('on-page-nav-item');
                const link = document.createElement('a');
                link.href = `#${section.id}`;
                link.textContent = sectionTitle.textContent;
                listItem.appendChild(link);
                onPageNavList.appendChild(listItem);

                // Smooth scroll para los enlaces de la barra interna
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                    // Opcional: Actualizar URL sin recargar para reflejar la sección activa
                    // history.pushState(null, null, this.getAttribute('href'));
                });
            }
        });

        if (onPageNavList.children.length > 0) {
            onPageNavPlaceholder.appendChild(onPageNavList);

            // Observador para resaltar el enlace activo mientras se hace scroll
            const observerOptions = {
                root: null, // viewport
                rootMargin: '0px',
                threshold: 0.5 // Cuando al menos el 50% de la sección es visible
            };

            const sectionObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    const id = entry.target.id;
                    const navLink = document.querySelector(`.on-page-nav-list a[href="#${id}"]`);

                    if (navLink) {
                        if (entry.isIntersecting) {
                            // Remover 'active-on-page' de todos y luego añadir al actual
                            document.querySelectorAll('.on-page-nav-list a').forEach(link => {
                                link.classList.remove('active-on-page');
                            });
                            navLink.classList.add('active-on-page');
                        }
                    }
                });
            }, observerOptions);

            sections.forEach(section => {
                sectionObserver.observe(section);
            });

            // Para la primera carga, resalta la sección inicial o la superior si no hay hash
            const initialHighlight = () => {
                const currentHash = window.location.hash;
                if (currentHash) {
                    const targetSection = document.querySelector(currentHash);
                    if (targetSection) {
                        // Asegurar que el targetSection es observado para ser resaltado
                        // No necesitamos hacer nada aquí si el observer ya lo maneja al cargar
                    }
                } else {
                    // Resalta el primer enlace si no hay hash en la URL
                    const firstLink = document.querySelector('.on-page-nav-list a');
                    if (firstLink) {
                        firstLink.classList.add('active-on-page');
                    }
                }
            };
            // Llamar después de un pequeño retardo para asegurar que el observer ha tenido tiempo
            setTimeout(initialHighlight, 100);
        }
    }


    // --- Código para el Acordeón Interactivo ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion-item');
            const content = item.querySelector('.accordion-content');

            // Cierra todos los otros ítems del acordeón (opcional)
            document.querySelectorAll('.accordion-item.active').forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                    activeItem.querySelector('.accordion-content').style.maxHeight = '0';
                    activeItem.querySelector('.accordion-content').style.paddingTop = '0';
                    activeItem.querySelector('.accordion-content').style.paddingBottom = '0';
                }
            });

            // Abre o cierra el ítem clicado
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.paddingTop = '1.5rem';
                content.style.paddingBottom = '1.5rem';
            } else {
                content.style.maxHeight = '0';
                content.style.paddingTop = '0';
                content.style.paddingBottom = '0';
            }
        });
    });
});