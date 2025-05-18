/**
 * Portfolio Website Main Script
 * Organized for clarity and maintainability
 */

// ====================================
// Configuration & Constants
// ====================================
const CFG = {
  // Core settings
  THEME_KEY: 'theme',
  DARK_VAL: 'dark',
  LIGHT_VAL: 'light',
  DARK_CLS: 'dark-mode',
  
  // Analytics
  VIEWS_KEY: 'page_views',
  VISIT_KEY: 'last_visit',
  
  // Timing
  DAY_MS: 86400000,
  DEBOUNCE_MS: 150,
  
  // Audio
  MUTE_KEY: 'muted',
  
  // Title Animation
  TITLE: {
    PREFIX: '@',
    FULL_TEXT: 'GlockFatherDraco',
    CHAR_DELAY: 75,
    PAUSE_DELAY: 250,
    SHOULD_LOOP: true
  }
};

// ====================================
// DOM Elements Cache
// ====================================
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

// ====================================
// Core Utility Functions
// ====================================

/**
 * Checks for localStorage support
 */
const SUPPORTS_LS = (() => {
  try {
    const TEST_KEY = '__test__';
    localStorage.setItem(TEST_KEY, TEST_KEY);
    localStorage.removeItem(TEST_KEY);
    return true;
  } catch (err) {
    return false;
  }
})();

/**
 * Debounce function for performance optimization
 */
const debounce = (fn, wait) => {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
};

// ====================================
// Storage Utilities
// ====================================

/**
 * Local Storage Manager
 */
const StorageUtils = {
  get(key) {
    if (!SUPPORTS_LS) return null;
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.warn('Storage read error:', err);
      return null;
    }
  },
  
  set(key, val) {
    if (!SUPPORTS_LS) return false;
    try {
      localStorage.setItem(key, val);
      return true;
    } catch (err) {
      console.warn('Storage write error:', err);
      return false;
    }
  }
};

/**
 * Cookie Manager
 */
const CookieUtils = {
  set(name, value, days) {
    try {
      const d = new Date();
      d.setTime(d.getTime() + (days * CFG.DAY_MS));
      document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Strict`;
      return true;
    } catch (err) {
      console.warn('Cookie write error:', err);
      return false;
    }
  },
  
  get(name) {
    try {
      const c = document.cookie.split(';').find(c => c.trim().startsWith(name + '='));
      return c ? decodeURIComponent(c.split('=')[1]) : null;
    } catch (err) {
      console.warn('Cookie read error:', err);
      return null;
    }
  }
};

// ====================================
// Feature Modules
// ====================================

/**
 * Entry Screen Manager
 * Handles the welcome animation
 */
const EntryScreenManager = {
  init() {
    if (!DOM.entryEl) return;
    
    setTimeout(() => {
      if (DOM.entryEl && !DOM.entryEl.classList.contains('hidden'))
        DOM.entryEl.classList.add('hidden');
    }, 5000);
    
    DOM.entryEl.addEventListener('click', function() {
      this.classList.add('hidden');
    });
    
    DOM.entryEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') this.classList.add('hidden');
    });
  }
};

/**
 * Theme Manager
 * Handles dark/light mode switching
 */
const ThemeManager = {
  init() {
    if (!DOM.themeToggleEl) return;
    
    const prefersDark = window.matchMedia?.('(prefers-color-scheme:dark)')?.matches || false;
    const savedTheme = StorageUtils.get(CFG.THEME_KEY);
    
    if (savedTheme === CFG.DARK_VAL || (prefersDark && savedTheme !== CFG.LIGHT_VAL)) {
      document.body.classList.add(CFG.DARK_CLS);
      DOM.themeToggleEl.checked = true;
    }

    DOM.themeToggleEl.addEventListener('change', () => {
      document.body.classList.toggle(CFG.DARK_CLS);
      StorageUtils.set(
        CFG.THEME_KEY, 
        document.body.classList.contains(CFG.DARK_CLS) ? CFG.DARK_VAL : CFG.LIGHT_VAL
      );
    });
    
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
 * View Counter Manager
 * Tracks page visits
 */
const ViewManager = {
  defaults: {
    visits: 0,
    lastVisit: 0
  },

  getCounterState() {
    const storedVisits = StorageUtils.get(CFG.VIEWS_KEY);
    const storedTimestamp = StorageUtils.get(CFG.VISIT_KEY);
    const cookieTimestamp = CookieUtils.get(CFG.VISIT_KEY);
    
    const visits = (() => {
      const parsed = parseInt(storedVisits, 10);
      return !isNaN(parsed) && parsed >= 0 ? parsed : this.defaults.visits;
    })();
    
    const lastVisit = (() => {
      const stored = parseInt(storedTimestamp || cookieTimestamp || '0', 10);
      return !isNaN(stored) && stored > 0 ? stored : this.defaults.lastVisit;
    })();
    
    return { visits, lastVisit };
  },
  
  isNewVisit(lastVisit) {
    if (!lastVisit) return true;
    
    const now = Date.now();
    const hoursSinceLastVisit = (now - lastVisit) / CFG.DAY_MS * 24;
    
    const lastVisitDate = new Date(lastVisit);
    const todayDate = new Date();
    const isDifferentDay = 
      lastVisitDate.getDate() !== todayDate.getDate() ||
      lastVisitDate.getMonth() !== todayDate.getMonth() ||
      lastVisitDate.getFullYear() !== todayDate.getFullYear();
      
    return hoursSinceLastVisit >= 24 || isDifferentDay;
  },
  
  saveCounterState(visits) {
    const now = Date.now();
    
    StorageUtils.set(CFG.VIEWS_KEY, visits.toString());
    StorageUtils.set(CFG.VISIT_KEY, now.toString());
    CookieUtils.set(CFG.VISIT_KEY, now.toString(), 30);
    
    if (DOM.viewsCountEl) {
      DOM.viewsCountEl.textContent = visits.toString();
      DOM.viewsCountEl.classList.remove('count-updated');
      void DOM.viewsCountEl.offsetWidth;
      DOM.viewsCountEl.classList.add('count-updated');
    }
  },
  
  updateCount() {
    if (!DOM.viewsCountEl) return;
    
    const { visits, lastVisit } = this.getCounterState();
    
    if (this.isNewVisit(lastVisit)) {
      this.saveCounterState(visits + 1);
    } else {
      DOM.viewsCountEl.textContent = visits.toString();
    }
    
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
 * Audio Manager
 * Handles background music and volume control
 */
const AudioManager = {
  init() {
    if (!document.createElement('audio').canPlayType) {
      const voiceboxEl = document.querySelector('.voicebox');
      if (voiceboxEl) voiceboxEl.style.display = 'none';
      return;
    }

    if (!DOM.muteBtnEl || !DOM.bgm || !DOM.muteIconEl) return;

    const volumeCard = document.getElementById('volumeCard');
    const volumeSlider = document.getElementById('volumeSlider');
    const muteOverlay = document.getElementById('muteOverlay');
    let isCardOpen = false;

    const initAudio = () => {
      if (DOM.bgm) {
        DOM.bgm.play().catch(() => {});
        const savedVolume = StorageUtils.get('volume') || '50';
        DOM.bgm.volume = parseInt(savedVolume, 10) / 100;
        volumeSlider.value = savedVolume;
      }
    };
    
    document.addEventListener('click', initAudio, {once: true});
    
    DOM.muteBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      isCardOpen = !isCardOpen;
      volumeCard.classList.toggle('active', isCardOpen);
    });

    volumeSlider.addEventListener('input', (e) => {
      const volume = parseInt(e.target.value, 10);
      DOM.bgm.volume = volume / 100;
      StorageUtils.set('volume', volume.toString());

      const isMuted = volume === 0;
      DOM.bgm.muted = isMuted;
      DOM.muteIconEl.src = `assets/media/voice/${isMuted ? 'mute' : 'unmute'}.svg`;
      muteOverlay.classList.toggle('active', isMuted);
      StorageUtils.set(CFG.MUTE_KEY, isMuted ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (isCardOpen && !e.target.closest('.voicebox')) {
        isCardOpen = false;
        volumeCard.classList.remove('active');
      }
    });

    const muted = StorageUtils.get(CFG.MUTE_KEY) === 'true';
    DOM.bgm.muted = muted;
    DOM.muteIconEl.src = `assets/media/voice/${muted ? 'mute' : 'unmute'}.svg`;
    
    const savedVolume = StorageUtils.get('volume') || '50';
    volumeSlider.value = savedVolume;
    if (DOM.bgm) DOM.bgm.volume = parseInt(savedVolume, 10) / 100;
  }
};

/**
 * Copyright Manager
 * Handles copyright info display
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
    
    DOM.copyrightToggleEl.addEventListener('click', toggleCard);
    
    DOM.copyrightToggleEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard();
      }
    });
    
    document.addEventListener('click', e => {
      if (isOpen && !e.target.closest('.copyright-trigger')) {
        isOpen = false;
        DOM.copyrightToggleEl.classList.remove('arrow-active');
        DOM.copyrightCardEl.classList.remove('show');
        DOM.copyrightToggleEl.setAttribute('aria-expanded', 'false');
      }
    });
    
    DOM.copyrightToggleEl.setAttribute('aria-expanded', 'false');
  }
};

/**
 * Click Effects Manager
 * Handles ripple animations
 */
const ClickEffects = {
  init() {
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
 * Title Animator
 * Handles title typewriter effect
 */
const TitleAnimator = {
  isAnimating: false,
  originalTitle: document.title,
  currentTitle: CFG.TITLE.PREFIX,
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  async typeCharacter(char) {
    this.currentTitle += char;
    document.title = this.currentTitle;
    await this.sleep(CFG.TITLE.CHAR_DELAY);
  },
  
  async deleteCharacter() {
    this.currentTitle = this.currentTitle.slice(0, -1);
    document.title = this.currentTitle;
    await this.sleep(CFG.TITLE.CHAR_DELAY);
  },
  
  async animateTitle() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    
    do {
      for (const char of CFG.TITLE.FULL_TEXT) {
        await this.typeCharacter(char);
      }
      
      await this.sleep(CFG.TITLE.PAUSE_DELAY);
      
      while (this.currentTitle.length > CFG.TITLE.PREFIX.length) {
        await this.deleteCharacter();
      }
      
      if (CFG.TITLE.SHOULD_LOOP) {
        await this.sleep(CFG.TITLE.PAUSE_DELAY);
      }
      
    } while (CFG.TITLE.SHOULD_LOOP && this.isAnimating);
  },
  
  init() {
    document.title = CFG.TITLE.PREFIX;
    this.currentTitle = CFG.TITLE.PREFIX;
    
    if (document.visibilityState === 'visible') {
      this.animateTitle();
    }
    
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        if (!this.isAnimating) {
          this.currentTitle = CFG.TITLE.PREFIX;
          this.animateTitle();
        }
      } else {
        this.isAnimating = false;
      }
    });
  }
};

// ====================================
// View Counter Animation Style
// ====================================
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
// Application Initialization
// ====================================
const initApp = () => {
  if (DOM.copyrightYearEl) {
    DOM.copyrightYearEl.textContent = new Date().getFullYear();
  }
  
  EntryScreenManager.init();
  ThemeManager.init();
  ViewManager.updateCount();
  AudioManager.init();
  ClickEffects.init();
  CopyrightManager.init();
  TitleAnimator.init();
};

// Start when ready
document.readyState === 'loading' ?
  document.addEventListener('DOMContentLoaded', initApp) :
  initApp();

// Error handling
window.addEventListener('error', e => {
  console.warn(`Error: ${e.message} at ${e.filename}:${e.lineno}`);
  return true;
});
