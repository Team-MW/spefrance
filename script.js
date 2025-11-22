// ============================================
// MODERN JAVASCRIPT - SPE FRANCE
// ============================================

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.querySelector('.nav-menu-overlay');
    
    if (!mobileMenuToggle || !navMenu) {
        return;
    }
    
    function openMenu() {
        navMenu.classList.add('active');
        mobileMenuToggle.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        
        document.querySelectorAll('.nav-item-has-children').forEach(item => {
            item.classList.remove('active');
        });
    }
    
    // Toggle menu
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close on overlay click
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }
    
    // Submenu toggle (mobile only)
    const submenuItems = navMenu.querySelectorAll('.nav-item-has-children');
    submenuItems.forEach(item => {
        const link = item.querySelector('> a');
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 968) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    submenuItems.forEach(other => {
                        if (other !== item) other.classList.remove('active');
                    });
                    
                    item.classList.toggle('active');
                }
            });
        }
    });
    
    // Close on link click
    navMenu.querySelectorAll('a:not(.nav-item-has-children > a)').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 968) {
                closeMenu();
            }
        });
    });
    
    // Close on ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close on resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 968 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});

// Header Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = 70;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.querySelector('.mobile-menu-toggle')?.classList.remove('active');
                document.querySelector('.nav-menu-overlay')?.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});

// Statistics Counter Animation
function initStatsCounter() {
    const animateValue = (element, start, end, duration) => {
        const target = parseInt(element.dataset.target) || 0;
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            
            element.textContent = current;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = target;
            }
        };
        
        window.requestAnimationFrame(step);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target) || 0;
                animateValue(entry.target, 0, target, 2000);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-number[data-target], .stat-value[data-target], .stat-number-large[data-target]').forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.service-card, .benefit-card, .zone-card, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Parallax Hero
window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    const scrolled = window.pageYOffset;
    const heroBackground = heroSection.querySelector('.hero-background');
    
    if (heroBackground && scrolled < heroSection.offsetHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroBackground.style.opacity = 1 - (scrolled / heroSection.offsetHeight) * 0.5;
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initStatsCounter();
    initScrollAnimations();
    
    // Page fade-in
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    }, 100);
});
