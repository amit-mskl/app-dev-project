// =================================
// THEME MANAGEMENT SYSTEM
// Handles dark/light mode switching with persistence
// =================================

class ThemeManager {
    constructor() {
        // Get DOM elements
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.html = document.documentElement;
        
        // Theme states
        this.currentTheme = 'dark'; // Default theme
        this.themes = {
            dark: { icon: '🌙', label: 'Switch to light mode' },
            light: { icon: '☀️', label: 'Switch to dark mode' }
        };
        
        // Initialize the theme system
        this.init();
    }

    init() {
        try {
            // Check for saved theme preference or system preference
            this.loadSavedTheme();
            
            // Add event listener to theme toggle button
            if (this.themeToggle) {
                this.themeToggle.addEventListener('click', () => this.toggleTheme());
                
                // Add keyboard support
                this.themeToggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleTheme();
                    }
                });
            }

            // Listen for system theme changes
            this.watchSystemTheme();
            
            // Update UI to match current theme
            this.updateUI();
            
            console.log('🎨 Theme Manager initialized successfully');
        } catch (error) {
            console.error('❌ Theme Manager initialization failed:', error);
        }
    }

    loadSavedTheme() {
        try {
            // Check for saved user preference
            const savedTheme = localStorage.getItem('portfolio-theme');
            
            if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
                this.currentTheme = savedTheme;
            } else {
                // Check system preference if no saved preference
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.currentTheme = systemPrefersDark ? 'dark' : 'light';
            }
        } catch (error) {
            console.warn('⚠️ Could not load saved theme, using default:', error);
            this.currentTheme = 'dark';
        }
    }

    setTheme(theme) {
        try {
            // Validate theme
            if (!this.themes[theme]) {
                throw new Error(`Invalid theme: ${theme}`);
            }

            this.currentTheme = theme;
            
            // Apply theme to document
            if (theme === 'light') {
                this.html.setAttribute('data-theme', 'light');
            } else {
                this.html.removeAttribute('data-theme');
            }

            // Save preference
            this.saveThemePreference(theme);
            
            // Update UI
            this.updateUI();
            
            // Dispatch custom event for other components
            this.dispatchThemeChange(theme);
            
            console.log(`🎨 Theme changed to: ${theme}`);
        } catch (error) {
            console.error('❌ Failed to set theme:', error);
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.animateToggle();
    }

    updateUI() {
        if (!this.themeIcon || !this.themeToggle) return;

        const themeConfig = this.themes[this.currentTheme];
        
        // Update icon
        this.themeIcon.textContent = themeConfig.icon;
        
        // Update accessibility attributes
        this.themeToggle.setAttribute('aria-label', themeConfig.label);
        this.themeToggle.setAttribute('title', themeConfig.label);
    }

    animateToggle() {
        if (!this.themeToggle) return;

        // Add visual feedback animation
        this.themeToggle.style.transform = 'translateY(-2px) scale(0.9)';
        
        setTimeout(() => {
            this.themeToggle.style.transform = 'translateY(-2px) scale(1)';
        }, 150);

        // Add a subtle pulse effect
        this.themeToggle.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.4)';
        
        setTimeout(() => {
            this.themeToggle.style.boxShadow = '';
        }, 300);
    }

    saveThemePreference(theme) {
        try {
            localStorage.setItem('portfolio-theme', theme);
        } catch (error) {
            console.warn('⚠️ Could not save theme preference:', error);
        }
    }

    watchSystemTheme() {
        try {
            // Listen for system theme changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                const hasManualPreference = localStorage.getItem('portfolio-theme');
                
                if (!hasManualPreference) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    this.setTheme(systemTheme);
                    console.log(`🔄 System theme changed to: ${systemTheme}`);
                }
            });
        } catch (error) {
            console.warn('⚠️ Could not watch system theme changes:', error);
        }
    }

    dispatchThemeChange(theme) {
        try {
            // Dispatch custom event for other components to listen to
            const event = new CustomEvent('themeChanged', {
                detail: { theme: theme, timestamp: Date.now() }
            });
            document.dispatchEvent(event);
        } catch (error) {
            console.warn('⚠️ Could not dispatch theme change event:', error);
        }
    }

    // Public method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Public method to force a specific theme
    forceTheme(theme) {
        if (this.themes[theme]) {
            this.setTheme(theme);
            return true;
        }
        return false;
    }

    // Clean up method for when component is destroyed
    destroy() {
        try {
            if (this.themeToggle) {
                this.themeToggle.removeEventListener('click', this.toggleTheme);
                this.themeToggle.removeEventListener('keydown', this.handleKeydown);
            }
            console.log('🧹 Theme Manager destroyed');
        } catch (error) {
            console.error('❌ Error destroying Theme Manager:', error);
        }
    }
}

// Utility functions for theme management
const ThemeUtils = {
    // Get the current theme without instantiating ThemeManager
    getCurrentTheme() {
        return document.documentElement.hasAttribute('data-theme') ? 'light' : 'dark';
    },

    // Apply theme-specific styles dynamically
    applyThemeStyles(theme, styles) {
        const styleId = 'dynamic-theme-styles';
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        
        const themeStyles = styles[theme] || '';
        styleElement.textContent = themeStyles;
    },

    // Check if user prefers reduced motion
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
};

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Create global theme manager instance
        window.themeManager = new ThemeManager();
        
        // Make theme utilities available globally
        window.ThemeUtils = ThemeUtils;
        
        console.log('✅ Theme system ready!');
    } catch (error) {
        console.error('❌ Failed to initialize theme system:', error);
    }
});

// Handle page visibility changes (when user switches tabs)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.themeManager) {
        // Refresh theme when page becomes visible again
        window.themeManager.updateUI();
    }
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, ThemeUtils };
}