/**
 * Hey! 👋 This is the main script for our portfolio site.
 * It handles all the cool interactive features you see on the page.
 */

// ====================================
// Let's set up our main settings first
// ====================================
const CFG = {
  THEME_KEY: 'theme',         // Where we store theme preference
  DARK_VAL: 'dark',          // For dark mode
  LIGHT_VAL: 'light',        // For light mode
  DARK_CLS: 'dark-mode',     // CSS class for dark mode
  VIEWS_KEY: 'page_views',   // Tracks how many visits we've had
  VISIT_KEY: 'last_visit',   // When was the last visit
  DAY_MS: 86400000,         // How many milliseconds in a day (24h)
  DEBOUNCE_MS: 150,         // Wait time for performance stuff
  MUTE_KEY: 'muted'         // Remember if user muted audio
};

// Grab all the elements we need to work with
// (This saves us from searching the DOM multiple times)
const DOM = {
  bgm: document.getElementById('bgMusic'),
  muteBtnEl: document.getElementById('muteButton'),
  muteIconEl: document.getElementById('muteIcon'),
  entryEl: document.getElementById('entry-screen'),
  themeToggleEl: document.getElementById('checkbox'),
  viewsCountEl: document.getElementById('view-count'),
  copyrightYearEl: document.getElementById('copyright-year'),
  copyrightToggleEl: document.getElementById('copyrightToggle'),
  copyrightCardEl: document.getElementById('copyrightCard')
};

// Check if we can use localStorage (not all browsers support it)
const SUPPORTS_LS = (() => {
  try {
    // Quick test to see if localStorage works
    const TEST_KEY = '__test__';
    localStorage.setItem(TEST_KEY, TEST_KEY);
    localStorage.removeItem(TEST_KEY);
    return true;
  } catch (err) {
    return false;  // Nope, localStorage isn't available
  }
})();

// ====================================
// Helper Functions - The Useful Stuff!
// ====================================

/**
 * Makes sure we don't overwhelm the browser with too many events
 * Think of it like a "wait a moment" function
 */
const debounce = (fn, wait) => {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
};

/**
 * Handles saving and loading data safely
 * Like a secure notepad for our app
 */
const StorageUtils = {
  get(key) {
    if (!SUPPORTS_LS) return null;
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.warn('Oops! Problem reading from storage:', err);
      return null;
    }
  },
  
  set(key, val) {
    if (!SUPPORTS_LS) return false;
    try {
      localStorage.setItem(key, val);
      return true;
    } catch (err) {
      console.warn('Oops! Problem saving to storage:', err);
      return false;
    }
  }
};

/**
 * Manages browser cookies - like little memory notes
 * Useful for visitors who don't have localStorage
 */
const CookieUtils = {
  set(name, value, days) {
    try {
      const d = new Date();
      d.setTime(d.getTime() + (days * CFG.DAY_MS));
      document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Strict`;
      return true;
    } catch (err) {
      console.warn('Cookie saving went wrong:', err);
      return false;
    }
  },
  
  get(name) {
    try {
      const c = document.cookie.split(';').find(c => c.trim().startsWith(name + '='));
      return c ? decodeURIComponent(c.split('=')[1]) : null;
    } catch (err) {
      console.warn('Cookie reading went wrong:', err);
      return null;
    }
  }
};

// ====================================
// The Main Features of Our Site
// ====================================

/**
 * Handles the view counter - keeps track of how many times people visit
 * Like a digital welcome mat that counts footsteps! 👣
 */
const ViewManager = {
  // Starting point if we have no data
  defaults: {
    visits: 0,
    lastVisit: 0
  },

  // Gets the current state of our counter
  getCounterState() {
    // Grab our stored numbers (carefully!)
    const storedVisits = StorageUtils.get(CFG.VIEWS_KEY);
    const storedTimestamp = StorageUtils.get(CFG.VISIT_KEY);
    const cookieTimestamp = CookieUtils.get(CFG.VISIT_KEY);
    
    // Make sure our visit count is a valid number
    const visits = (() => {
      const parsed = parseInt(storedVisits, 10);
      return !isNaN(parsed) && parsed >= 0 ? parsed : this.defaults.visits;
    })();
    
    // Figure out when the last visit was
    const lastVisit = (() => {
      const stored = parseInt(storedTimestamp || cookieTimestamp || '0', 10);
      return !isNaN(stored) && stored > 0 ? stored : this.defaults.lastVisit;
    })();
    
    return { visits, lastVisit };
  },
  
  // Checks if we should count this as a new visit
  isNewVisit(lastVisit) {
    if (!lastVisit) return true;  // First time visitor!
    
    const now = Date.now();
    const hoursSinceLastVisit = (now - lastVisit) / CFG.DAY_MS * 24;
    
    // We count it as a new visit if:
    // 1. It's their first time (welcome!)
    // 2. It's been a whole day since last visit
    // 3. It's a new calendar day (even if it's been less than 24h)
    const lastVisitDate = new Date(lastVisit);
    const todayDate = new Date();
    const isDifferentDay = 
      lastVisitDate.getDate() !== todayDate.getDate() ||
      lastVisitDate.getMonth() !== todayDate.getMonth() ||
      lastVisitDate.getFullYear() !== todayDate.getFullYear();
      
    return hoursSinceLastVisit >= 24 || isDifferentDay;
  },
  
  // Saves the new count and updates what we see
  saveCounterState(visits) {
    const now = Date.now();
    
    // Save in both localStorage and cookies (just to be safe)
    StorageUtils.set(CFG.VIEWS_KEY, visits.toString());
    StorageUtils.set(CFG.VISIT_KEY, now.toString());
    CookieUtils.set(CFG.VISIT_KEY, now.toString(), 30);
    
    // Update what the visitor sees
    if (DOM.viewsCountEl) {
      DOM.viewsCountEl.textContent = visits.toString();
      
      // Add a little animation to make it fun
      DOM.viewsCountEl.classList.remove('count-updated');
      void DOM.viewsCountEl.offsetWidth;  // Reset animation
      DOM.viewsCountEl.classList.add('count-updated');
    }
  },
  
  // The main function that makes it all happen
  updateCount() {
    if (!DOM.viewsCountEl) return;
    
    // Get our current numbers
    const { visits, lastVisit } = this.getCounterState();
    
    // Should we count this visit?
    if (this.isNewVisit(lastVisit)) {
      this.saveCounterState(visits + 1);  // Yep, add one!
    } else {
      DOM.viewsCountEl.textContent = visits.toString();  // Nope, just show the current count
    }
    
    // If we're developing, show some helpful info
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      console.debug('View counter stats:', {
        currentCount: visits,
        lastVisit: new Date(lastVisit).toLocaleString(),
        isNewVisit: this.isNewVisit(lastVisit)
      });
    }
  }
};

/**
 * Handles dark/light mode switching
 * Like a light switch for our website! 🌓
 */
const ThemeManager = {
  init() {
    if (!DOM.themeToggleEl) return;
    
    // Check if user's system prefers dark mode
    const prefersDark = window.matchMedia?.('(prefers-color-scheme:dark)')?.matches || false;
    const savedTheme = StorageUtils.get(CFG.THEME_KEY);
    
    // Set initial theme based on preference
    if (savedTheme === CFG.DARK_VAL || (prefersDark && savedTheme !== CFG.LIGHT_VAL)) {
      document.body.classList.add(CFG.DARK_CLS);
      DOM.themeToggleEl.checked = true;
    }

    // Listen for theme changes
    DOM.themeToggleEl.addEventListener('change', () => {
      document.body.classList.toggle(CFG.DARK_CLS);
      StorageUtils.set(
        CFG.THEME_KEY, 
        document.body.classList.contains(CFG.DARK_CLS) ? CFG.DARK_VAL : CFG.LIGHT_VAL
      );
    });
    
    // Watch for system theme changes
    const mqDark = window.matchMedia?.('(prefers-color-scheme:dark)');
    mqDark?.addEventListener?.('change', e => {
      if (!StorageUtils.get(CFG.THEME_KEY)) {
        document.body.classList.toggle(CFG.DARK_CLS, e.matches);
        if (DOM.themeToggleEl) DOM.themeToggleEl.checked = e.matches;
      }
    });
  }
};

/**
 * Handles the background music
 * Our website's DJ! 🎵
 */
const AudioManager = {
  init() {
    // First, check if we can even play audio
    if (!document.createElement('audio').canPlayType) {
      const voiceboxEl = document.querySelector('.voicebox');
      if (voiceboxEl) voiceboxEl.style.display = 'none';
      return;
    }

    if (!DOM.muteBtnEl || !DOM.bgm || !DOM.muteIconEl) return;
    
    // Start music on first click (browsers require this)
    const initAudio = () => {
      if (DOM.bgm) DOM.bgm.play().catch(() => {});
    };
    
    document.addEventListener('click', initAudio, {once: true});
    
    // Handle mute button clicks
    DOM.muteBtnEl.addEventListener('click', () => {
      DOM.bgm.muted = !DOM.bgm.muted;
      DOM.muteIconEl.src = `assets/media/voice/${DOM.bgm.muted ? 'mute' : 'unmute'}.svg`;
      StorageUtils.set(CFG.MUTE_KEY, DOM.bgm.muted ? 'true' : 'false');
    });

    // Remember if they muted it before
    const muted = StorageUtils.get(CFG.MUTE_KEY) === 'true';
    DOM.bgm.muted = muted;
    DOM.muteIconEl.src = `assets/media/voice/${muted ? 'mute' : 'unmute'}.svg`;
  }
};

/**
 * Makes the copyright info show/hide nicely
 * Like a fancy business card that flips! 💼
 */
const CopyrightManager = {
  init() {
    if (!DOM.copyrightToggleEl || !DOM.copyrightCardEl) return;
    
    let isOpen = false;
    
    const toggleCard = () => {
      isOpen = !isOpen;
      DOM.copyrightToggleEl.classList.toggle('arrow-active', isOpen);
      DOM.copyrightCardEl.classList.toggle('show', isOpen);
      DOM.copyrightToggleEl.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };
    
    // Handle clicks and keyboard
    DOM.copyrightToggleEl.addEventListener('click', toggleCard);
    
    DOM.copyrightToggleEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard();
      }
    });
    
    // Close if clicked outside
    document.addEventListener('click', e => {
      if (isOpen && !e.target.closest('.copyright-trigger')) {
        isOpen = false;
        DOM.copyrightToggleEl.classList.remove('arrow-active');
        DOM.copyrightCardEl.classList.remove('show');
        DOM.copyrightToggleEl.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Start closed
    DOM.copyrightToggleEl.setAttribute('aria-expanded', 'false');
  }
};

/**
 * Creates those cool ripple effects when you click
 * Like dropping pebbles in a pond! 💫
 */
const ClickEffects = {
  init() {
    // Skip on touch devices (looks weird there)
    if (window.matchMedia?.('(pointer:coarse)')?.matches) return;
    
    document.addEventListener('click', debounce(e => {
      if (e.target.closest('.theme-switch,.voicebox')) return;
      
      const effectEl = document.createElement('div');
      effectEl.className = 'click-effect';
      effectEl.style.left = `${e.pageX}px`;
      effectEl.style.top = `${e.pageY}px`;
      document.body.appendChild(effectEl);

      effectEl.addEventListener('animationend', () => {
        if (effectEl.parentNode) effectEl.parentNode.removeChild(effectEl);
      }, {once: true});
    }, CFG.DEBOUNCE_MS), {passive: true});
  }
};

/**
 * Handles the welcome screen animation
 * Our digital doorman! 🚪
 */
const EntryScreenManager = {
  init() {
    if (!DOM.entryEl) return;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (DOM.entryEl && !DOM.entryEl.classList.contains('hidden'))
        DOM.entryEl.classList.add('hidden');
    }, 5000);
    
    // Or hide when clicked
    DOM.entryEl.addEventListener('click', function() {
      this.classList.add('hidden');
    });
    
    // Keyboard users can press Enter/Space
    DOM.entryEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') this.classList.add('hidden');
    });
  }
};

// Add some style for our view counter animation
const viewAnimationStyle = document.createElement('style');
viewAnimationStyle.textContent = `
  @keyframes countPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }
  
  .count-updated {
    animation: countPulse 0.5s ease-in-out;
  }
`;
document.head.appendChild(viewAnimationStyle);

// ====================================
// Let's Get This Party Started! 🎉
// ====================================
const initApp = () => {
  // Set the current year in copyright
  if (DOM.copyrightYearEl) {
    DOM.copyrightYearEl.textContent = new Date().getFullYear();
  }
  
  // Fire up all our features
  EntryScreenManager.init();
  ThemeManager.init();
  ViewManager.updateCount();
  AudioManager.init();
  ClickEffects.init();
  CopyrightManager.init();
};

// Start when the page is ready
document.readyState === 'loading' ?
  document.addEventListener('DOMContentLoaded', initApp) :
  initApp();

// Catch any errors that might pop up
window.addEventListener('error', e => {
  console.warn(`Whoops! Something went wrong: ${e.message} at ${e.filename}:${e.lineno}`);
  return true;
});
