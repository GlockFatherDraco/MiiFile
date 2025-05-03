// Constants and cache DOM elements
const DOM = {
    bgMusic: document.getElementById('bgMusic'),
    muteButton: document.getElementById('muteButton'),
    muteIcon: document.getElementById('muteIcon'),
    entryScreen: document.getElementById('entry-screen'),
    checkbox: document.getElementById('checkbox'),
    viewCount: document.getElementById('view-count'),
    copyrightYear: document.getElementById('copyright-year')
};

const CONFIG = {
    THEME_KEY: 'theme',
    DARK_THEME: 'dark',
    LIGHT_THEME: 'light',
    DARK_MODE_CLASS: 'dark-mode',
    VIEW_KEY: 'page_views',
    VISIT_COOKIE: 'last_visit',
    ONE_DAY: 24 * 60 * 60 * 1000,
    DEBOUNCE_DELAY: 150
};

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const storage = {
    get: (key) => localStorage.getItem(key),
    set: (key, value) => localStorage.setItem(key, value),
    remove: (key) => localStorage.removeItem(key)
};

// Cookie management
const cookies = {
    set: (name, value, days) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * CONFIG.ONE_DAY));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Strict`;
    },
    get: (name) => {
        return document.cookie.split(';')
            .find(cookie => cookie.trim().startsWith(name + '='))
            ?.split('=')[1];
    }
};

// Audio management
const audioManager = {
    init() {
        const handleFirstInteraction = () => {
            DOM.bgMusic.play().catch(error => {
                console.warn("Audio autoplay failed:", error);
            });
            document.removeEventListener('click', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction, { once: true });

        DOM.muteButton.addEventListener('click', () => {
            DOM.bgMusic.muted = !DOM.bgMusic.muted;
            DOM.muteIcon.src = DOM.bgMusic.muted ? 
                'assets/media/voice/mute.svg' : 
                'assets/media/voice/unmute.svg';
            storage.set('muted', DOM.bgMusic.muted);
        });

        // Restore mute state
        const muted = storage.get('muted') === 'true';
        DOM.bgMusic.muted = muted;
        DOM.muteIcon.src = muted ? 'assets/media/voice/mute.svg' : 'assets/media/voice/unmute.svg';
    }
};

// View counter management
const viewManager = {
    isNewVisit() {
        const lastVisitStorage = storage.get(CONFIG.VISIT_COOKIE);
        const lastVisitCookie = cookies.get(CONFIG.VISIT_COOKIE);
        const now = Date.now();

        if (!lastVisitStorage && !lastVisitCookie) return true;
        
        const lastVisit = parseInt(lastVisitStorage || lastVisitCookie);
        return (now - lastVisit) > CONFIG.ONE_DAY;
    },

    updateCount() {
        if (this.isNewVisit()) {
            const currentViews = parseInt(storage.get(CONFIG.VIEW_KEY) || '0');
            const newViews = currentViews + 1;
            
            storage.set(CONFIG.VIEW_KEY, newViews.toString());
            storage.set(CONFIG.VISIT_COOKIE, Date.now().toString());
            cookies.set(CONFIG.VISIT_COOKIE, Date.now().toString(), 30);
            
            DOM.viewCount.textContent = newViews.toString();
        } else {
            DOM.viewCount.textContent = storage.get(CONFIG.VIEW_KEY) || '0';
        }
    }
};

// Theme management
const themeManager = {
    init() {
        const savedTheme = storage.get(CONFIG.THEME_KEY);
        if (savedTheme === CONFIG.DARK_THEME) {
            document.body.classList.add(CONFIG.DARK_MODE_CLASS);
            DOM.checkbox.checked = true;
        }

        DOM.checkbox.addEventListener('change', () => {
            document.body.classList.toggle(CONFIG.DARK_MODE_CLASS);
            const isDarkMode = document.body.classList.contains(CONFIG.DARK_MODE_CLASS);
            storage.set(CONFIG.THEME_KEY, isDarkMode ? CONFIG.DARK_THEME : CONFIG.LIGHT_THEME);
        });
    }
};

// Click effect
const clickEffect = {
    init() {
        document.addEventListener('click', debounce((e) => {
            if (e.target.closest('.theme-switch, .voicebox')) return;
            
            const effect = document.createElement('div');
            effect.className = 'click-effect';
            effect.style.left = `${e.pageX}px`;
            effect.style.top = `${e.pageY}px`;
            document.body.appendChild(effect);

            effect.addEventListener('animationend', () => {
                effect.remove();
            }, { once: true });
        }, CONFIG.DEBOUNCE_DELAY));
    }
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    audioManager.init();
    themeManager.init();
    clickEffect.init();
    viewManager.updateCount();

    // Set copyright year
    DOM.copyrightYear.textContent = new Date().getFullYear();

    // Entry screen handler
    DOM.entryScreen.addEventListener('click', function() {
        this.classList.add('hidden');
    });
});
