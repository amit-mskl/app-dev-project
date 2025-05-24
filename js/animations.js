// =================================
// SCROLL ANIMATIONS & INTERACTIONS
// Beautiful reveal animations triggered by scrolling
// =================================

class AnimationManager {
    constructor() {
        // Configuration
        this.config = {
            // Intersection Observer options
            rootMargin: '0px 0px -100px 0px', // Start animation 100px before element enters viewport
            threshold: [0, 0.1, 0.5], // Multiple thresholds for different animations
            
            // Animation settings
            staggerDelay: 150, // Delay between staggered animations (ms)
            defaultDuration: 600, // Default animation duration (ms)
            
            // Animation classes
            observeClasses: [
                '.fade-in',
                '.fade-in-stagger', 
                '.reveal-left',
                '.reveal-right',
                '.reveal-up',
                '.reveal-down'
            ]
        };
        
        // State management
        this.observers = new Map();
        this.animatedElements = new Set();
        this.isReducedMotion = this.checkReducedMotion();
        
        // Initialize the animation system
        this.init();
    }

    init() {
        try {
            // Check if user prefers reduced motion
            if (this.isReducedMotion) {
                this.handleReducedMotion();
                return;
            }

            // Set up intersection observers
            this.setupScrollAnimations();
            
            // Set up interactive animations
            this.setupInteractiveAnimations();
            
            // Set up hero animations (they should start immediately)
            this.setupHeroAnimations();
            
            console.log('✨ Animation Manager initialized successfully');
            console.log(`🎭 Observing ${this.getAllAnimationElements().length} elements for scroll animations`);
        } catch (error) {
            console.error('❌ Animation Manager initialization failed:', error);
        }
    }

    checkReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    handleReducedMotion() {
        // If user prefers reduced motion, make all elements visible immediately
        const allAnimationElements = this.getAllAnimationElements();
        allAnimationElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.style.transition = 'none';
        });
        console.log('♿ Reduced motion mode: All animations disabled');
    }

    getAllAnimationElements() {
        const elements = [];
        this.config.observeClasses.forEach(className => {
            elements.push(...document.querySelectorAll(className));
        });
        return elements;
    }

    setupScrollAnimations() {
        // Create intersection observer for scroll animations
        const scrollObserver = new IntersectionObserver(
            (entries) => this.handleScrollIntersection(entries),
            {
                rootMargin: this.config.rootMargin,
                threshold: this.config.threshold
            }
        );

        // Observe all animation elements
        const animationElements = this.getAllAnimationElements();
        animationElements.forEach(element => {
            // Don't observe hero elements (they animate on load)
            if (!element.closest('.hero')) {
                scrollObserver.observe(element);
            }
        });

        this.observers.set('scroll', scrollObserver);
        
        console.log(`👀 Observing ${animationElements.length} elements for scroll animations`);
    }

    handleScrollIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                this.animateElement(entry.target);
                this.animatedElements.add(entry.target);
            }
        });
    }

    animateElement(element) {
        const animationType = this.getAnimationType(element);
        
        switch (animationType) {
            case 'fade-in':
                this.animateFadeIn(element);
                break;
            case 'fade-in-stagger':
                this.animateStaggered(element);
                break;
            case 'reveal-left':
                this.animateRevealLeft(element);
                break;
            case 'reveal-right':
                this.animateRevealRight(element);
                break;
            case 'reveal-up':
                this.animateRevealUp(element);
                break;
            case 'reveal-down':
                this.animateRevealDown(element);
                break;
            default:
                this.animateFadeIn(element);
        }
    }

    getAnimationType(element) {
        for (const className of this.config.observeClasses) {
            if (element.classList.contains(className.slice(1))) { // Remove the dot
                return className.slice(1);
            }
        }
        return 'fade-in';
    }

    animateFadeIn(element) {
        element.style.transition = `opacity ${this.config.defaultDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${this.config.defaultDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        console.log('💫 Fade in animation triggered');
    }

    animateStaggered(element) {
        // Find stagger delay from class
        const staggerMatch = element.className.match(/stagger-(\d+)/);
        const staggerIndex = staggerMatch ? parseInt(staggerMatch[1]) : 1;
        const delay = (staggerIndex - 1) * this.config.staggerDelay;
        
        setTimeout(() => {
            element.style.transition = `opacity ${this.config.defaultDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${this.config.defaultDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);
        
        console.log(`🌊 Staggered animation triggered (delay: ${delay}ms)`);
    }

    animateRevealLeft(element) {
        element.style.transition = `opacity ${this.config.defaultDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${this.config.defaultDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
        
        console.log('👈 Reveal left animation triggered');
    }

    animateRevealRight(element) {
        element.style.transition = `opacity ${this.config.defaultDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${this.config.defaultDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
        
        console.log('👉 Reveal right animation triggered');
    }

    animateRevealUp(element) {
        element.style.transition = `opacity ${this.config.defaultDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${this.config.defaultDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        console.log('👆 Reveal up animation triggered');
    }

    animateRevealDown(element) {
        element.style.transition = `opacity ${this.config.defaultDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${this.config.defaultDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        console.log('👇 Reveal down animation triggered');
    }

    setupHeroAnimations() {
        // Hero elements should animate immediately on page load
        const heroElements = document.querySelectorAll('.hero .hero-subtitle, .hero .hero-title, .hero .hero-description, .hero .hero-cta, .hero .hero-profile');
        
        // The hero animations are already handled by CSS, so we don't need to do anything here
        // But we can add them to our animated set so they don't get re-animated
        heroElements.forEach(element => {
            this.animatedElements.add(element);
        });
        
        console.log('🎬 Hero animations initialized');
    }

    setupInteractiveAnimations() {
        // Enhanced hover animations for cards
        this.setupCardHoverAnimations();
        
        // Button click animations
        this.setupButtonAnimations();
        
        // Navigation link animations
        this.setupNavAnimations();
    }

    setupCardHoverAnimations() {
        const cards = document.querySelectorAll('.skill-card-fixed, .contact-card, .stat-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.isReducedMotion) {
                    this.animateCardHover(card, true);
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!this.isReducedMotion) {
                    this.animateCardHover(card, false);
                }
            });
        });
    }

    animateCardHover(card, isHover) {
        const icon = card.querySelector('.skill-icon-fixed, .contact-icon');
        const title = card.querySelector('h4');
        
        if (isHover) {
            card.style.transform = 'translateY(-10px)';
            if (icon) {
                icon.style.transform = 'scale(1.1)';
            }
            if (title && card.classList.contains('skill-card-fixed')) {
                title.style.color = 'var(--accent-primary)';
            }
        } else {
            card.style.transform = 'translateY(0)';
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
            if (title && card.classList.contains('skill-card-fixed')) {
                title.style.color = 'var(--text-primary)';
            }
        }
    }

    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (!this.isReducedMotion) {
                    this.animateButtonClick(button);
                }
            });
        });
    }

    animateButtonClick(button) {
        // Add a ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupNavAnimations() {
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (!this.isReducedMotion) {
                    link.style.transform = 'translateY(-2px)';
                }
            });
            
            link.addEventListener('mouseleave', () => {
                if (!this.isReducedMotion && !link.classList.contains('active')) {
                    link.style.transform = 'translateY(0)';
                }
            });
        });
    }

    // Public method to manually trigger animation for an element
    triggerAnimation(selector) {
        const element = document.querySelector(selector);
        if (element && !this.animatedElements.has(element)) {
            this.animateElement(element);
            this.animatedElements.add(element);
            return true;
        }
        return false;
    }

    // Public method to reset animations (useful for testing)
    resetAnimations() {
        this.animatedElements.clear();
        const allElements = this.getAllAnimationElements();
        allElements.forEach(element => {
            element.style.opacity = '';
            element.style.transform = '';
            element.style.transition = '';
        });
        console.log('🔄 All animations reset');
    }

    // Clean up method
    destroy() {
        try {
            // Disconnect all observers
            this.observers.forEach(observer => observer.disconnect());
            this.observers.clear();
            
            console.log('🧹 Animation Manager destroyed');
        } catch (error) {
            console.error('❌ Error destroying Animation Manager:', error);
        }
    }
}

// CSS for ripple animation
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Add ripple CSS to document
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize animation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Create global animation manager instance
        window.animationManager = new AnimationManager();
        
        console.log('✅ Animation system ready!');
    } catch (error) {
        console.error('❌ Failed to initialize animation system:', error);
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.animationManager) {
        // Re-check animations when page becomes visible
        setTimeout(() => {
            window.animationManager.setupScrollAnimations();
        }, 100);
    }
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationManager };
}