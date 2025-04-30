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
const LAST_VISIT_KEY = 'last_visit';

// Theme management
const checkbox = document.getElementById('checkbox');
const savedTheme = localStorage.getItem(THEME_KEY);
const viewCount = document.getElementById('view-count');

// Initialize theme
if (savedTheme === DARK_THEME) {
    document.body.classList.add(DARK_MODE_CLASS);
    checkbox.checked = true;
}

// View counter with 24-hour cache
const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
const now = Date.now();
const ONE_DAY = 24 * 60 * 60 * 1000;

if (!lastVisit || (now - parseInt(lastVisit)) > ONE_DAY) {
    let views = parseInt(localStorage.getItem(VIEW_KEY) || '0');
    views++;
    localStorage.setItem(VIEW_KEY, views.toString());
    localStorage.setItem(LAST_VISIT_KEY, now.toString());
}

viewCount.textContent = localStorage.getItem(VIEW_KEY) || '0';

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