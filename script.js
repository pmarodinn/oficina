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
    const menu = document.querySelector('header nav ul.menu');
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
            if (link.getAttribute('href').startsWith('#')) {
                // Não fechar o menu imediatamente para o smooth scroll funcionar
            } else {
                closeMenu();
            }
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

// Smooth scroll para links internos
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const menu = document.querySelector('header nav ul.menu');

            if (targetElement) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                if (menu && menu.classList.contains('active')) {
                    setTimeout(() => {
                        menu.classList.remove('active');
                        document.querySelector('.menu-toggle')?.classList.remove('active');
                        document.querySelector('.menu-backdrop')?.classList.remove('active');
                        document.body.classList.remove('menu-open');
                        document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
                        document.querySelector('.menu-toggle')?.setAttribute('aria-label', 'Abrir menu');
                    }, 150);
                }
            }
        });
    });
}

// Modal para expansão de imagens - VERSÃO CORRIGIDA
function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.querySelector('.modal-caption');
    const closeBtn = document.querySelector('.modal-close');

    if (!modal || !modalImg || !modalCaption || !closeBtn) return;

    // Seleciona todas as imagens clicáveis
    const images = document.querySelectorAll('.image-gallery img, .cronograma-image, .team-member img');
    
    images.forEach(img => {
        img.addEventListener('click', function() {
            // Primeiro define a imagem e legenda
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            modalCaption.textContent = this.alt || '';
            
            // Depois mostra o modal
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Pequeno delay para garantir o render
            setTimeout(() => {
                modal.classList.add('show');
                modalImg.style.opacity = '1';
            }, 10);
        });
    });

    // Função para fechar o modal
    const closeModal = () => {
        modal.classList.remove('show');
        modalImg.style.opacity = '0';
        document.body.style.overflow = 'auto';
        
        // Espera a animação terminar antes de esconder
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    };

    // Event listeners para fechar
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
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
    initMobileMenu();
    initBackToTop();
    initSmoothScroll();
    initImageModal(); // Função corrigida para o modal de imagens
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
