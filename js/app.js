document.addEventListener('DOMContentLoaded', () => {
  // ================== UTILITIES ==================
  const select = (selector, root = document) => root.querySelector(selector);
  const listen = (element, event, handler, options) => element?.addEventListener(event, handler, options);
  const clamp = (min, max, value) => Math.max(min, Math.min(max, value));
  const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ================== THEME TOGGLE ==================
  const initThemeToggle = () => {
    const button = select('#tgl');
    const root = document.documentElement;
    const THEME_KEY = 'theme';
    if (!button) return;

    // Theme management
    const getSystemTheme = () => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const setTheme = (theme) => {
      const newTheme = theme === 'dark' ? 'dark' : 'light';
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem(THEME_KEY, newTheme);
    };

    // Initialize theme
    setTheme(localStorage.getItem(THEME_KEY) || getSystemTheme());

    // System theme change listener
    listen(matchMedia('(prefers-color-scheme: dark)'), 'change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) setTheme(e.matches ? 'dark' : 'light');
    });

    // Button interaction
    listen(button, 'click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  };

  // ================== AUDIO PLAYER ==================
  const initAudioPlayer = () => {
    const player = select('audio');
    if (!player) return;

    window.startMusic = () => {
      if (player.readyState >= 2) player.play().catch(() => {});
      else listen(player, 'canplay', () => player.play().catch(() => {}), { once: true });
    };
  };

  // ================== ENTRY OVERLAY ==================
  const initEntryOverlay = () => {
    const overlay = select('#entryOverlay');
    if (!overlay) return;

    const removeOverlay = () => {
      overlay.classList.add('fade-out');
      listen(overlay, 'transitionend', () => overlay.remove(), { once: true });
      window.startMusic?.();
    };

    listen(overlay, 'click', removeOverlay);
  };

  // ================== VOLUME CONTROL ==================
  const initVolumeControl = () => {
    // Elements
    const button = select('#msc');
    const capsule = select('#volumeCapsule') || select('.msc-capsule');
    const fill = select('.msc-capsule-fill', capsule);
    const player = select('audio');
    if (!button || !capsule || !fill || !player) return;

    // State
    let isOpen = false;
    let isDragging = false;
    const VOLUME_KEY = 'volume';
    
    // Volume management
    const getSavedVolume = () => clamp(0, 1, parseFloat(localStorage.getItem(VOLUME_KEY)) || 0.5);
    const setVolume = (volume) => {
      const newVolume = clamp(0, 1, volume);
      const percent = Math.round(newVolume * 100);
      
      // Update player and UI
      player.volume = newVolume;
      fill.style.height = `${capsule.clientHeight * newVolume}px`;
      button.classList.toggle('muted', newVolume < 0.01);
      
      // Update accessibility
      capsule.setAttribute('aria-valuenow', percent);
      capsule.setAttribute('aria-valuetext', `${percent}%`);
      localStorage.setItem(VOLUME_KEY, newVolume.toString());
    };

    // UI interactions
    const toggleControl = () => {
      isOpen = !isOpen;
      capsule.classList.toggle('open', isOpen);
      button.setAttribute('aria-expanded', isOpen);
      capsule.setAttribute('aria-hidden', !isOpen);
      if (isOpen) capsule.focus();
    };

    const calculateVolume = (yPos) => {
      const { top, height } = capsule.getBoundingClientRect();
      return clamp(0, 1, 1 - (yPos - top) / height);
    };

    // Event handlers
    const handleInteraction = (e) => {
      const y = e.touches?.[0]?.clientY ?? e.clientY;
      if (typeof y === 'number') setVolume(calculateVolume(y));
    };

    // Initialize
    setVolume(getSavedVolume());
    button.setAttribute('aria-expanded', 'false');
    capsule.setAttribute('aria-hidden', 'true');

    // Event listeners
    listen(button, 'click', (e) => {
      e.stopPropagation();
      toggleControl();
    });

    listen(capsule, 'mousedown', (e) => {
      isDragging = true;
      handleInteraction(e);
    });
    
    listen(capsule, 'touchstart', (e) => {
      isDragging = true;
      handleInteraction(e);
    }, { passive: false });

    const updateOnMove = (e) => isDragging && handleInteraction(e);
    const stopDragging = () => isDragging = false;
    
    document.addEventListener('mousemove', updateOnMove);
    document.addEventListener('touchmove', updateOnMove, { passive: false });
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);
    
    listen(document, 'click', (e) => {
      if (isOpen && !capsule.contains(e.target) && !button.contains(e.target)) {
        toggleControl();
      }
    });
  };

  // ================== RIPPLE EFFECT ==================
  const initRippleEffect = () => {
    const createRipple = (e) => {
      // Skip interactions with controls
      if (e.target.closest('#msc, #tgl, .msc-capsule, .copyright-chip')) return;
      if (prefersReducedMotion()) return;

      // Get position
      const pointer = e.touches?.[0] ?? e;
      const { clientX, clientY } = pointer;
      if (typeof clientX !== 'number' || typeof clientY !== 'number') return;

      // Create ripple
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(window.innerWidth, window.innerHeight) * 0.025;
      
      Object.assign(ripple.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${clientX - size/2}px`,
        top: `${clientY - size/2}px`
      });

      // Auto-remove after animation
      const removeRipple = () => ripple.remove();
      listen(ripple, 'animationend', removeRipple);
      setTimeout(removeRipple, 1000);

      document.body.appendChild(ripple);
    };

    listen(document, 'click', createRipple);
    listen(document, 'touchstart', createRipple, { passive: true });
  };

  // ================== INITIALIZATION ==================
  initThemeToggle();
  initAudioPlayer();
  initEntryOverlay();
  initVolumeControl();
  initRippleEffect();
});