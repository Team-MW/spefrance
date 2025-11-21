// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Gérer le sous-menu Services en mobile
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
    
    // Fermer le menu quand on clique sur un lien (sauf Services)
    const navLinks = navMenu.querySelectorAll('a:not(.nav-item-has-children > a)');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on window resize if it becomes desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 968 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
});

// Forms removed - direct contact via phone/email only

// Intersection Observer for fade-in animations with stagger
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation with 3D effects
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.expertise-card, .benefit-item, .domain-card, .faq-item, .stat-card, .process-step');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.95)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
    
    // Add mouse move parallax to cards
    animatedElements.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
    
    // Initialize expertise cards expansion
    initExpertiseCards();
    
    // Initialize hero stats counter
    initHeroStats();
    
    // Add cursor glow effect
    initCursorGlow();
});

// Expertise Cards Expansion
function initExpertiseCards() {
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.expertise-card');
            const isActive = card.classList.contains('active');
            
            // Close all other cards
            document.querySelectorAll('.expertise-card').forEach(c => {
                if (c !== card) {
                    c.classList.remove('active');
                }
            });
            
            // Toggle current card
            card.classList.toggle('active', !isActive);
        });
    });
    
    // Also allow clicking on card to expand
    document.querySelectorAll('.expertise-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the expand button
            if (!e.target.closest('.expand-btn')) {
                const isActive = this.classList.contains('active');
                
                // Close all other cards
                document.querySelectorAll('.expertise-card').forEach(c => {
                    if (c !== this) {
                        c.classList.remove('active');
                    }
                });
                
                // Toggle current card
                this.classList.toggle('active', !isActive);
            }
        });
    });
}

// Hero Stats Counter Animation
function initHeroStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    const animateValue = (element, start, end, duration) => {
        const target = parseInt(element.dataset.target);
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            
            // Format the number with appropriate suffix
            let suffix = '';
            if (target === 1000) suffix = '+';
            else if (target === 100) suffix = '%';
            else if (target === 24) suffix = 'h';
            else if (target === 7) suffix = 'j';
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = end + suffix;
            }
        };
        window.requestAnimationFrame(step);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateValue(entry.target, 0, target, 2000);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statValues.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Header scroll effect with glassmorphism
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
        header.style.boxShadow = '0 8px 32px rgba(0, 102, 255, 0.15)';
    } else {
        header.classList.remove('scrolled');
        header.style.boxShadow = '0 4px 20px rgba(0, 102, 255, 0.1)';
    }
    
    // Parallax effect for hero background
    const hero = document.querySelector('.hero');
    if (hero && currentScroll < hero.offsetHeight) {
        const heroBackground = hero.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${currentScroll * 0.3}px)`;
            heroBackground.style.opacity = 1 - (currentScroll / hero.offsetHeight) * 0.5;
        }
        
        // Parallax for gradient orbs
        const orbs = hero.querySelectorAll('.gradient-orb');
        orbs.forEach((orb, index) => {
            const speed = 0.2 + (index * 0.1);
            orb.style.transform = `translateY(${currentScroll * speed}px)`;
        });
    }
    
    lastScroll = currentScroll;
});

// FAQ Accordion functionality (optional enhancement)
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.style.cursor = 'pointer';
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isOpen = answer.style.maxHeight;
        
        // Close all other FAQs
        document.querySelectorAll('.faq-answer').forEach(ans => {
            ans.style.maxHeight = null;
        });
        
        // Toggle current FAQ
        if (!isOpen) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// Initialize FAQ answers
document.querySelectorAll('.faq-answer').forEach(answer => {
    answer.style.maxHeight = null;
    answer.style.overflow = 'hidden';
    answer.style.transition = 'max-height 0.3s ease-out';
});

// Form input validation styling
const formInputs = document.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            this.style.borderColor = '#4CAF50';
        } else if (this.hasAttribute('required')) {
            this.style.borderColor = '#f44336';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            this.style.borderColor = '';
        }
    });
});

// Phone number formatting
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = value.match(/.{1,2}/g).join(' ');
        }
        e.target.value = value;
    });
});

// Add active state to navigation links on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Cursor glow effect for interactive elements
function initCursorGlow() {
    const interactiveElements = document.querySelectorAll('a, button, .expertise-card, .benefit-item');
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid rgba(0, 102, 255, 0.8);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease, opacity 0.2s ease;
        opacity: 0;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursor);
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            // Use red for urgent buttons, blue for others
            if (el.classList.contains('btn-hero-primary') || el.textContent.includes('Urgence')) {
                cursor.style.borderColor = 'rgba(255, 51, 51, 1)';
                cursor.style.boxShadow = '0 0 20px rgba(255, 51, 51, 0.6)';
            } else {
                cursor.style.borderColor = 'rgba(0, 102, 255, 1)';
                cursor.style.boxShadow = '0 0 20px rgba(0, 102, 255, 0.6)';
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        el.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    });
}

