document.addEventListener('DOMContentLoaded', () => {

    // 1. Animaciones Sutiles al hacer Scroll (Scroll Reveal)
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 100;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Ejecutar al inicio por si hay elementos visibles

    // 2. Lógica del Formulario Interactivo de Pedidos
    const orderItems = document.querySelectorAll('.order-item');
    const grandTotalEl = document.getElementById('grandTotal');
    const orderForm = document.getElementById('orderForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationModalMessage = document.getElementById('confirmationModalMessage');

    function openConfirmationModal(message) {
        if (!confirmationModal || !confirmationModalMessage) {
            return;
        }

        confirmationModalMessage.textContent = message;
        confirmationModal.classList.add('is-open');
        confirmationModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeConfirmationModal() {
        if (!confirmationModal) {
            return;
        }

        confirmationModal.classList.remove('is-open');
        confirmationModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    confirmationModal?.addEventListener('click', (event) => {
        if (event.target.closest('[data-close-modal]')) {
            closeConfirmationModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeConfirmationModal();
        }
    });

    function calculateTotal() {
        let grandTotal = 0;

        orderItems.forEach(item => {
            const checkbox = item.querySelector('.product-check');
            const qtyInput = item.querySelector('.product-qty');
            const totalSpan = item.querySelector('.item-total');
            const price = parseFloat(item.getAttribute('data-price'));

            if (checkbox.checked) {
                qtyInput.disabled = false;
                const qty = parseInt(qtyInput.value) || 0;
                const itemTotal = qty * price;
                totalSpan.textContent = `$${itemTotal.toFixed(2)} USD`;
                grandTotal += itemTotal;
            } else {
                qtyInput.disabled = true;
                qtyInput.value = 0;
                totalSpan.textContent = '$0.00 USD';
            }
        });

        grandTotalEl.textContent = `$${grandTotal.toFixed(2)} USD`;
    }

    orderItems.forEach(item => {
        const checkbox = item.querySelector('.product-check');
        const qtyInput = item.querySelector('.product-qty');

        checkbox.addEventListener('change', calculateTotal);
        qtyInput.addEventListener('input', calculateTotal);
    });

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = document.getElementById('orderPhone').value;
        openConfirmationModal(`¡Gracias! Tu pedido con estimado total de ${grandTotalEl.textContent} ha sido recibido. Nos pondremos en contacto al número ${phone}.`);
        orderForm.reset();
        calculateTotal();
    });

    // 3. Mapa Interactivo de Exportación
    const mapButtons = document.querySelectorAll('.map-btn');
    const mapImage = document.getElementById('mapImage');
    const mapOverlayText = document.getElementById('mapOverlayText');

    const mapData = {
        usa: {
            img: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80",
            text: "Mostrando rutas de envío hacia Norteamérica (EE. UU. y Canadá)"
        },
        europe: {
            img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80",
            text: "Mostrando envíos hacia la Unión Europea (España, Alemania, Francia)"
        },
        asia: {
            img: "https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&w=1000&q=80",
            text: "Mostrando envíos hacia Asia y Medio Oriente (Japón, Emiratos Árabes)"
        }
    };

    mapButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            mapButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const countryKey = btn.getAttribute('data-country');
            if (mapData[countryKey]) {
                mapImage.src = mapData[countryKey].img;
                mapOverlayText.textContent = mapData[countryKey].text;
            }
        });
    });

    // 4. Formulario Final de Exportación
    const exportContactForm = document.getElementById('exportContactForm');
    exportContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        openConfirmationModal('Gracias por enviar tu solicitud de exportación. Nuestro equipo comercial se comunicará contigo a la brevedad.');
        exportContactForm.reset();
    });
});