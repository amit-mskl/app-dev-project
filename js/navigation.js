// =================================
// NAVIGATION SYSTEM
// Smooth scrolling, active states, and scroll spy
// =================================

class NavigationManager {
    constructor() {
        // Get DOM elements
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        this.navbar = document.querySelector('.navbar');
        
        // Configuration
        this.config = {
            offset: 100,           // Offset for scroll calculations
            scrollDuration: 800,   // Smooth scroll duration
            debounceDelay: 10,     // Debounce delay for scroll events
            activeClass: 'active'  // CSS class for active nav items
        };
        
        // State management
        this.isScrolling = false;
        this.lastScrollTime = 0;
        this.currentSection = 'home';
        
        // Initialize the navigation system
        this.init();
    }

    init() {
        try {
            // Set up smooth scrolling
            this.setupSmoothScrolling();
            
            // Set up scroll spy (active state management)
            this.setupScrollSpy();
            
            // Set up navbar behavior
            this.setupNavbarBehavior();
            
            // Set initial active state
            this.setInitialActiveState();
            
            console.log('🧭 Navigation Manager initialized successfully');
            console.log(`📊 Found ${this.sections.length} sections and ${this.navLinks.length} nav links`);
        } catch (error) {
            console.error('❌ Navigation Manager initialization failed:', error);
        }
    }

    setupSmoothScrolling() {
        // Add click event listeners to all navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Also handle any other internal links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            if (!link.closest('.nav-links')) {
                link.addEventListener('click', (e) => this.handleNavClick(e));
            }
        });
    }

    handleNavClick(e) {
        e.preventDefault();
        
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (!targetElement) {
            console.warn(`⚠️ Target element not found: ${targetId}`);
            return;
        }
        
        // Update active state immediately for better UX
        this.updateActiveNavLink(targetId.slice(1)); // Remove # from ID
        
        // Smooth scroll to target
        this.smoothScrollTo(targetElement);
        
        console.log(`🎯 Navigating to: ${targetId}`);
    }

    smoothScrollTo(targetElement) {
        const targetPosition = targetElement.offsetTop - this.config.offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = this.config.scrollDuration;
        let startTime = null;
        
        // Set scrolling flag
        this.isScrolling = true;
        
        // Easing function for smooth animation
        const easeInOutQuart = (t) => {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        };
        
        const animateScroll = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const ease = easeInOutQuart(progress);
            const currentPosition = startPosition + (distance * ease);
            
            window.scrollTo(0, currentPosition);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                // Animation complete
                this.isScrolling = false;
                console.log('✅ Smooth scroll animation completed');
            }
        };
        
        requestAnimationFrame(animateScroll);
    }

    setupScrollSpy() {
        // Throttled scroll handler for better performance
        let scrollTimeout;
        
        const handleScroll = () => {
            if (this.isScrolling) return; // Don't update during programmatic scrolling
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.updateActiveSection();
            }, this.config.debounceDelay);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Also update on page load and resize
        window.addEventListener('load', () => this.updateActiveSection());
        window.addEventListener('resize', () => this.updateActiveSection());
    }

    updateActiveSection() {
        const scrollPosition = window.pageYOffset + this.config.offset + 50;
        let activeSection = 'home'; // Default to home
        
        // Find the current section based on scroll position
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
        });
        
        // Special case: if we're at the very top, always show home as active
        if (window.pageYOffset < 100) {
            activeSection = 'home';
        }
        
        // Update active state if it changed
        if (activeSection !== this.currentSection) {
            this.currentSection = activeSection;
            this.updateActiveNavLink(activeSection);
        }
    }

    updateActiveNavLink(sectionId) {
        // Remove active class from all nav links
        this.navLinks.forEach(link => {
            link.classList.remove(this.config.activeClass);
        });
        
        // Add active class to current section's nav link
        const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add(this.config.activeClass);
            console.log(`🎯 Active section: ${sectionId}`);
        }
    }

    setInitialActiveState() {
        // Set the initial active state based on current scroll position
        this.updateActiveSection();
    }

    setupNavbarBehavior() {
        let lastScrollY = window.pageYOffset;
        let ticking = false;
        
        const updateNavbar = () => {
            const currentScrollY = window.pageYOffset;
            
            // Add/remove scrolled class based on scroll position
            if (currentScrollY > 50) {
                this.navbar?.classList.add('scrolled');
            } else {
                this.navbar?.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (optional - currently disabled)
            // Uncomment the following code if you want the navbar to hide on scroll down
            /*
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                // Scrolling down - hide navbar
                this.navbar?.style.transform = 'translateX(-50%) translateY(-100%)';
            } else {
                // Scrolling up - show navbar
                this.navbar?.style.transform = 'translateX(-50%) translateY(0)';
            }
            */
            
            lastScrollY = currentScrollY;
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Public method to programmatically navigate to a section
    navigateToSection(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            this.updateActiveNavLink(sectionId);
            this.smoothScrollTo(targetElement);
            return true;
        }
        return false;
    }

    // Public method to get current active section
    getCurrentSection() {
        return this.currentSection;
    }

    // Method to refresh navigation (useful after dynamic content changes)
    refresh() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        this.updateActiveSection();
        console.log('🔄 Navigation refreshed');
    }

    // Clean up method
    destroy() {
        try {
            // Remove event listeners
            this.navLinks.forEach(link => {
                link.removeEventListener('click', this.handleNavClick);
            });
            
            console.log('🧹 Navigation Manager destroyed');
        } catch (error) {
            console.error('❌ Error destroying Navigation Manager:', error);
        }
    }
}

// Utility function for smooth scrolling (can be used independently)
function smoothScrollTo(element, offset = 100, duration = 800) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    
    if (!element) return false;
    
    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    const easeInOutQuart = (t) => {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    };
    
    const animate = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutQuart(progress);
        const currentPosition = startPosition + (distance * ease);
        
        window.scrollTo(0, currentPosition);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };
    
    requestAnimationFrame(animate);
    return true;
}

// Initialize navigation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Create global navigation manager instance
        window.navigationManager = new NavigationManager();
        
        // Make smooth scroll utility available globally
        window.smoothScrollTo = smoothScrollTo;
        
        console.log('✅ Navigation system ready!');
    } catch (error) {
        console.error('❌ Failed to initialize navigation system:', error);
    }
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationManager, smoothScrollTo };
}