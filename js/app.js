// Set theme ASAP to avoid FOUC
(function() {
  try {
    document.documentElement.setAttribute('data-theme',
      localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  } catch(e) {}
})();

document.addEventListener('DOMContentLoaded', () => {
  // ================== SOCIAL LINKS DELAY ==================
  const initSocialLinksDelay = () => {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.href;
        setTimeout(() => {
          window.open(href, '_blank', 'noopener,noreferrer');
        }, 1000);
      });
    });
  };

  // ================== UTILITIES ==================
  const $ = (s, root = document) => root.querySelector(s);
  const on = (el, ev, fn, opts) => el?.addEventListener(ev, fn, opts);
  const clamp = (min, max, val) => Math.max(min, Math.min(max, val));
  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ================== THEME TOGGLE ==================
  const initTheme = () => {
    const btn = $('#tgl'), root = document.documentElement;
    if (!btn) return;

    const setTheme = (theme) => {
      theme = theme === 'dark' ? 'dark' : 'light';
      root.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    };

    const sysTheme = () => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(localStorage.getItem('theme') || sysTheme());

    on(btn, 'click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
    on(matchMedia('(prefers-color-scheme: dark)'), 'change', (e) => {
      if (!localStorage.getItem('theme')) setTheme(e.matches ? 'dark' : 'light');
    });
  };

  // ================== AUDIO PLAYER ==================
  const initAudio = () => {
    const player = $('audio');
    if (!player) return;

    window.startMusic = () => {
      player.readyState >= 2 
        ? player.play().catch(() => {})
        : on(player, 'canplay', () => player.play().catch(() => {}), { once: true });
    };
  };

  // ================== ENTRY OVERLAY ==================
  const initOverlay = () => {
    const overlay = $('#entryOverlay');
    if (!overlay) return;

    on(overlay, 'click', () => {
      overlay.classList.add('fade-out');
      on(overlay, 'transitionend', () => overlay.remove(), { once: true });
      window.startMusic?.();
    });
  };

  // ================== VOLUME CONTROL ==================
  const initVolume = () => {
    const btn = $('#msc'), capsule = $('#volumeCapsule') || $('.msc-capsule');
    const fill = $('.msc-capsule-fill', capsule), player = $('audio');
    if (!btn || !capsule || !fill || !player) return;

    let isOpen = false, isDragging = false;
    const savedVol = clamp(0, 1, parseFloat(localStorage.getItem('volume') || 0.5));
    
    const setVolume = (vol) => {
      vol = clamp(0, 1, vol);
      const percent = Math.round(vol * 100);
      
      player.volume = vol;
      fill.style.height = `${capsule.clientHeight * vol}px`;
      btn.classList.toggle('muted', vol < 0.01);
      
      capsule.setAttribute('aria-valuenow', percent);
      capsule.setAttribute('aria-valuetext', `${percent}%`);
      localStorage.setItem('volume', vol.toString());
    };

    const toggleUI = () => {
      isOpen = !isOpen;
      capsule.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', isOpen);
      capsule.hidden = !isOpen;
      if (isOpen) capsule.focus();
    };

    const handleDrag = (e) => {
      const y = e.touches?.[0]?.clientY ?? e.clientY;
      if (typeof y !== 'number') return;
      
      const rect = capsule.getBoundingClientRect();
      const posY = clamp(rect.top, rect.bottom, y);
      setVolume(1 - (posY - rect.top) / rect.height);
    };

    // Initialize volume
    setVolume(savedVol);
    btn.setAttribute('aria-expanded', 'false');
    capsule.hidden = true;

    // Event handlers
    on(btn, 'click', (e) => e.stopPropagation() || toggleUI());
    
    // Drag handling
    const startDrag = (e) => {
      isDragging = true;
      e.preventDefault();
      handleDrag(e);
    };
    
    on(capsule, 'mousedown', startDrag);
    on(capsule, 'touchstart', startDrag, { passive: false });
    
    on(document, 'mousemove', (e) => isDragging && handleDrag(e));
    on(document, 'touchmove', (e) => isDragging && (e.preventDefault() || handleDrag(e)), { passive: false });
    
    on(document, 'mouseup', () => isDragging = false);
    on(document, 'touchend', () => isDragging = false);
    
    // Close when clicking outside
    on(document, 'click', (e) => {
      if (isOpen && !capsule.contains(e.target) && !btn.contains(e.target)) toggleUI();
    });
  };

  // ================== RIPPLE EFFECT ==================
  const initRipple = () => {
    const createRipple = (e) => {
      if (e.target.closest('#msc, #tgl, .msc-capsule, .copyright-chip') || reduceMotion()) return;
      
      const { clientX, clientY } = e.touches?.[0] ?? e;
      if (typeof clientX !== 'number' || typeof clientY !== 'number') return;

      const size = Math.max(window.innerWidth, window.innerHeight) * 0.025;
      const ripple = Object.assign(document.createElement('span'), {
        className: 'ripple',
        style: `
          width: ${size}px;
          height: ${size}px;
          left: ${clientX - size/2}px;
          top: ${clientY - size/2}px;
        `
      });

      on(ripple, 'animationend', () => ripple.remove());
      document.body.appendChild(ripple);
    };

    on(document, 'click', createRipple);
    on(document, 'touchstart', createRipple, { passive: true });
  };

  // ================== INITIALIZATION ==================
  [initTheme, initAudio, initOverlay, initVolume, initRipple, initSocialLinksDelay]
    .forEach(fn => { try { fn() } catch(e) { console.error(`Error in ${fn.name}:`, e) } });
});
