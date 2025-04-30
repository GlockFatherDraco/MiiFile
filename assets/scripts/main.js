// Background music setup
const bgMusic = document.getElementById('bgMusic');
const muteButton = document.getElementById('muteButton');
const muteIcon = document.getElementById('muteIcon');

document.addEventListener('click', () => {
    bgMusic.play().catch(error => {
        console.log("Audio autoplay failed:", error);
    });
}, { once: true });

muteButton.addEventListener('click', () => {
    bgMusic.muted = !bgMusic.muted;
    muteIcon.src = bgMusic.muted ? 
        'assets/media/mute.svg' : 
        'assets/media/unmute.svg';
});

// Entry screen handler
document.getElementById('entry-screen').addEventListener('click', function() {
    this.classList.add('hidden');
});

// Constants
const THEME_KEY = 'theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';
const DARK_MODE_CLASS = 'dark-mode';
const VIEW_KEY = 'page_views';
const VISIT_COOKIE = 'last_visit';
const ONE_DAY = 24 * 60 * 60 * 1000;

// Theme management
const checkbox = document.getElementById('checkbox');
const savedTheme = localStorage.getItem(THEME_KEY);
const viewCount = document.getElementById('view-count');

// Cookie helper functions
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * ONE_DAY));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
        if (cookieName === name) return cookieValue;
    }
    return null;
}

// Check if this is a new visit
function isNewVisit() {
    const lastVisitStorage = localStorage.getItem(VISIT_COOKIE);
    const lastVisitCookie = getCookie(VISIT_COOKIE);
    const now = Date.now();

    if (!lastVisitStorage && !lastVisitCookie) return true;
    
    const lastVisit = parseInt(lastVisitStorage || lastVisitCookie);
    return (now - lastVisit) > ONE_DAY;
}

// Update view count
function updateViewCount() {
    if (isNewVisit()) {
        const currentViews = parseInt(localStorage.getItem(VIEW_KEY) || '0');
        const newViews = currentViews + 1;
        
        localStorage.setItem(VIEW_KEY, newViews.toString());
        localStorage.setItem(VISIT_COOKIE, Date.now().toString());
        setCookie(VISIT_COOKIE, Date.now().toString(), 30);
        
        viewCount.textContent = newViews.toString();
    } else {
        viewCount.textContent = localStorage.getItem(VIEW_KEY) || '0';
    }
}

// Initialize theme
if (savedTheme === DARK_THEME) {
    document.body.classList.add(DARK_MODE_CLASS);
    checkbox.checked = true;
}

// Initialize view counter
updateViewCount();

// Update copyright year
document.getElementById('copyright-year').textContent = new Date().getFullYear();

// Theme toggle handler
checkbox.addEventListener('change', () => {
    document.body.classList.toggle(DARK_MODE_CLASS);
    const isDarkMode = document.body.classList.contains(DARK_MODE_CLASS);
    localStorage.setItem(THEME_KEY, isDarkMode ? DARK_THEME : LIGHT_THEME);
});

// Click effect handler
document.addEventListener('click', (e) => {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.left = `${e.pageX}px`;
    effect.style.top = `${e.pageY}px`;
    document.body.appendChild(effect);

    effect.addEventListener('animationend', () => {
        effect.remove();
    });
});
