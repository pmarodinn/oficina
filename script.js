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

    // Observar elementos com animação
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    
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
    const menu = document.querySelector('.menu');
    const menuLinks = document.querySelectorAll('.menu a');
    
    if (!menuToggle || !menu) return; // Garante que os elementos existem

    // Toggle do menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        menu.classList.toggle('active');
        
        // Atualizar aria-label
        const isOpen = menu.classList.contains('active');
        menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        
        // Prevenir scroll do body quando menu estiver aberto
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    });
    
    // Fechar menu ao clicar em um link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Fechar menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !menu.contains(e.target)) {
            menuToggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Fechar menu com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Botão voltar ao topo
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Smooth scroll para links internos
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Calcular offset do header fixo
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
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
    
    if (!modal) return;
    
    // Selecionar todas as imagens que devem ser expandidas
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
    
    // Fechar modal
    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            modalImage.src = '';
            modalCaption.textContent = '';
        }, 300);
    };
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Fechar com ESC
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
        // Aqui você pode adicionar efeitos de scroll otimizados
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

// Lazy loading para imagens (se necessário)
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
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
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
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100);
    });
}

// Prevenção de zoom em inputs no iOS
function initIOSInputFix() {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (parseFloat(getComputedStyle(input).fontSize) < 16) {
                input.style.fontSize = '16px';
            }
        });
    }
}

// Efeito de ripple nos botões (otimizado para mobile)
function initRippleEffect() {
    document.querySelectorAll('.cta-button, .proposal-link').forEach(button => {
        button.addEventListener('click', function(e) {
            // Verificar se é dispositivo touch
            if (!document.body.classList.contains('touch-device')) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });
    });
    
    // Adicionar estilo da animação ripple
    if (!document.getElementById('ripple-style')) {
        const rippleStyle = document.createElement('style');
        rippleStyle.id = 'ripple-style';
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }
}

// Função para redimensionar imagens automaticamente
function initImageOptimization() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            // Adicionar classe para imagens carregadas
            this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            // Fallback para imagens que falharam ao carregar
            this.style.display = 'none';
            console.warn('Falha ao carregar imagem:', this.src);
        });
    });
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas as funcionalidades
    initScrollAnimations();
    initHeaderScroll();
    initMobileMenu();
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
    
    // Adicionar classes de animação aos elementos
    document.querySelectorAll('.section-card').forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    document.querySelectorAll('.team-member').forEach((member, index) => {
        member.classList.add('animate-on-scroll');
        member.style.animationDelay = `${index * 0.1}s`;
    });
    
    document.querySelectorAll('.post').forEach((post, index) => {
        post.classList.add('animate-on-scroll');
        post.style.animationDelay = `${index * 0.1}s`;
    });
});

// Otimizações para performance
window.addEventListener('load', () => {
    // Remover animações desnecessárias após carregamento
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
});

// Tratamento de erros global
window.addEventListener('error', (e) => {
    console.warn('Erro capturado:', e.error);
});

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Registrar service worker se disponível
        // navigator.serviceWorker.register('/sw.js');
    });
}

