// Animações de scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Menu hambúrguer para mobile
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('header nav ul.menu'); // Seletor mais específico
    const menuBackdrop = document.querySelector('.menu-backdrop');

    if (!menuToggle || !menu || !menuBackdrop) {
        console.error('Elementos do menu não encontrados. Verifique os seletores.');
        return;
    }

    menuToggle.addEventListener('click', () => {
        const isActive = menu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuBackdrop.classList.toggle('active');
        document.body.classList.toggle('menu-open', isActive);
        menuToggle.setAttribute('aria-expanded', isActive.toString());
        menuToggle.setAttribute('aria-label', isActive ? 'Fechar menu' : 'Abrir menu');
    });

    const closeMenu = () => {
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuBackdrop.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
    };

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Se for um link interno para âncora, permitir o smooth scroll
            if (link.getAttribute('href').startsWith('#')) {
                // Não fechar o menu imediatamente para o smooth scroll funcionar
                // O smooth scroll já tem seu próprio handler
            } else {
                 // Para links externos ou outras páginas, fechar o menu
                closeMenu();
            }
            // Se for um link de âncora na mesma página, o smooth scroll cuidará do fechamento após a rolagem
        });
    });

    menuBackdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Botão voltar ao topo
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Smooth scroll para links internos (incluindo os do menu)
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const menu = document.querySelector('header nav ul.menu'); // Referência ao menu

            if (targetElement) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Fechar o menu APÓS o clique e início do scroll, se estiver aberto
                if (menu && menu.classList.contains('active')) {
                    // Adiciona um pequeno delay para garantir que o scroll iniciou
                    setTimeout(() => {
                        menu.classList.remove('active');
                        document.querySelector('.menu-toggle')?.classList.remove('active');
                        document.querySelector('.menu-backdrop')?.classList.remove('active');
                        document.body.classList.remove('menu-open');
                        document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
                        document.querySelector('.menu-toggle')?.setAttribute('aria-label', 'Abrir menu');
                    }, 150); // Delay de 150ms pode ser ajustado
                }
            }
        });
    });
}


// Modal para expansão de imagens
function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.querySelector('.modal-caption');
    const closeBtn = document.querySelector('.modal-close');

    if (!modal || !modalImage || !modalCaption || !closeBtn) return;

    const clickableImages = document.querySelectorAll('.cronograma-image, .image-gallery img, .team-member img');
    clickableImages.forEach(img => {
        img.addEventListener('click', () => {
            modal.classList.add('show');
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modalCaption.textContent = img.alt || 'Imagem do projeto SignSpeak';
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            modalImage.src = '';
            modalCaption.textContent = '';
        }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
    });
}

// Detecção de dispositivo touch
function initTouchDetection() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }
}

// Otimização de performance para scroll
function initScrollOptimization() {
    let ticking = false;
    function updateScrollEffects() {
        ticking = false;
    }
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
}

// Lazy loading para imagens
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }
}

// Ajuste de viewport height para mobile
function initViewportFix() {
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => setTimeout(setVH, 100));
}

// Prevenção de zoom em inputs no iOS
function initIOSInputFix() {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.querySelectorAll('input, textarea, select').forEach(input => {
            if (parseFloat(getComputedStyle(input).fontSize) < 16) {
                input.style.fontSize = '16px';
            }
        });
    }
}

// Efeito de ripple nos botões
function initRippleEffect() {
    document.querySelectorAll('.cta-button, .proposal-link').forEach(button => {
        button.addEventListener('click', function(e) {
            if (!document.body.classList.contains('touch-device')) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                ripple.style.cssText = `position: absolute; width: ${size}px; height: ${size}px; left: ${x}px; top: ${y}px; background: rgba(255, 255, 255, 0.3); border-radius: 50%; transform: scale(0); animation: ripple 0.6s ease-out; pointer-events: none;`;
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            }
        });
    });
    if (!document.getElementById('ripple-style')) {
        const rippleStyle = document.createElement('style');
        rippleStyle.id = 'ripple-style';
        rippleStyle.textContent = `@keyframes ripple { to { transform: scale(2); opacity: 0; } }`;
        document.head.appendChild(rippleStyle);
    }
}

// Função para redimensionar imagens automaticamente
function initImageOptimization() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', () => img.classList.add('loaded'));
        img.addEventListener('error', () => {
            img.style.display = 'none';
            console.warn('Falha ao carregar imagem:', img.src);
        });
    });
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar o backdrop do menu ao body
    const menuBackdrop = document.createElement('div');
    menuBackdrop.classList.add('menu-backdrop');
    document.body.appendChild(menuBackdrop);

    initScrollAnimations();
    initHeaderScroll();
    initMobileMenu(); // Deve ser chamado após a criação do backdrop
    initBackToTop();
    initSmoothScroll();
    initImageModal();
    initTouchDetection();
    initScrollOptimization();
    initLazyLoading();
    initViewportFix();
    initIOSInputFix();
    initRippleEffect();
    initImageOptimization();

    document.querySelectorAll('.section-card, .team-member, .post').forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.animationDelay = `${index * 0.1}s`;
    });
});

window.addEventListener('load', () => {
    setTimeout(() => document.body.classList.add('loaded'), 1000);
});

window.addEventListener('error', (e) => {
    console.warn('Erro capturado:', e.error);
});

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         // navigator.serviceWorker.register('/sw.js');
//     });
// }


