// ============================================
// MODERN JAVASCRIPT - SPE FRANCE
// Animations, interactions & conversion optimization
// ============================================

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navOverlay = document.querySelector('.nav-menu-overlay');

function openMenu() {
    if (!navMenu || !mobileMenuToggle || !navOverlay) return;
    navMenu.classList.add('active');
    mobileMenuToggle.classList.add('active');
    navOverlay.classList.add('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    if (!navMenu || !mobileMenuToggle || !navOverlay) return;
    navMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    navOverlay.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.querySelectorAll('.nav-item-has-children').forEach(item => {
        item.classList.remove('active');
    });
}

if (mobileMenuToggle && navMenu && navOverlay) {
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navMenu.classList.contains('active');
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    navOverlay.addEventListener('click', () => {
        closeMenu();
    });
    
    // Handle submenu toggle
    const servicesItem = navMenu.querySelector('.nav-item-has-children');
    if (servicesItem) {
        const servicesLink = servicesItem.querySelector('> a');
        servicesLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 968) {
                e.preventDefault();
                servicesItem.classList.toggle('active');
            }
        });
    }
    
    // Close menu on link click
    const navLinks = navMenu.querySelectorAll('a:not(.nav-item-has-children > a)');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 968 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }, 250);
    });
}

// Header Scroll Effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = header ? header.offsetHeight : 70;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            if (navMenu && navMenu.classList.contains('active')) {
                closeMenu();
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
            
            // Find unit element (h, j, +, %)
            const unitElement = element.nextElementSibling;
            const unit = unitElement ? unitElement.textContent.trim() : '';
            
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
    
    // Observe all stat numbers
    document.querySelectorAll('.stat-number[data-target], .stat-value[data-target], .stat-number-large[data-target]').forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Intersection Observer for Fade-in Animations
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
    
    // Observe elements for animation
    document.addEventListener('DOMContentLoaded', () => {
        const animatedElements = document.querySelectorAll(
            '.service-card, .benefit-card, .zone-card, .stat-item'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    });
}

// Floating CTA Click Tracking
document.addEventListener('DOMContentLoaded', () => {
    const floatingCTA = document.querySelector('.floating-cta-btn');
    if (floatingCTA) {
        floatingCTA.addEventListener('click', () => {
            // Track conversion (you can add analytics here)
            console.log('Floating CTA clicked - Urgency call');
        });
    });
    
    // Track all CTA clicks
    document.querySelectorAll('.btn-hero-primary, .btn-cta-primary, .btn-cta-large, .urgency-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.textContent.trim();
            console.log(`CTA clicked: ${text}`);
        });
    });
});

// Parallax Effect for Hero Section
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = heroSection.querySelector('.hero-background');
        
        if (heroBackground && scrolled < heroSection.offsetHeight) {
            heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroBackground.style.opacity = 1 - (scrolled / heroSection.offsetHeight) * 0.5;
        }
    });
}

// Active Navigation Link on Scroll
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Urgency Banner Animation
function initUrgencyBanner() {
    const urgencyBanner = document.querySelector('.urgency-banner');
    if (!urgencyBanner) return;
    
    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
        });
    }, { threshold: 0.1 });
    
    observer.observe(urgencyBanner);
    
    // Pause animation when not visible
    setInterval(() => {
        const banner = urgencyBanner.querySelector('.urgency-icon');
        if (banner) {
            banner.style.animationPlayState = isVisible ? 'running' : 'paused';
        }
    }, 100);
}

// Service Cards Hover Effect
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
}

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initStatsCounter();
    initScrollAnimations();
    initParallax();
    initActiveNavLinks();
    initUrgencyBanner();
    initServiceCards();
    
    // Add smooth fade-in for page load
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
