document.addEventListener('DOMContentLoaded', () => {
  // ================== UTILITIES ==================
  const $ = s => document.querySelector(s);
  const on = (el, ev, fn, opt) => el?.addEventListener(ev, fn, opt);
  const clamp = (min, max, val) => Math.max(min, Math.min(max, val));
  const noMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ================== INITIALIZATION ==================
  const init = () => {
    try { initTheme() } catch(e) { console.error('Theme error:', e) }
    try { initAudio() } catch(e) { console.error('Audio error:', e) }
    try { initOverlay() } catch(e) { console.error('Overlay error:', e) }
    try { initVolume() } catch(e) { console.error('Volume error:', e) }
    try { initRipple() } catch(e) { console.error('Ripple error:', e) }
  };

  // ================== THEME TOGGLE ==================
  const initTheme = () => {
    const btn = $('#tgl');
    if (!btn) return;
    
    const root = document.documentElement;
    const sysTheme = () => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const setTheme = theme => {
      theme = theme === 'dark' ? 'dark' : 'light';
      root.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    };

    setTheme(localStorage.getItem('theme') || sysTheme());
    on(btn, 'click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
    on(matchMedia('(prefers-color-scheme: dark)'), 'change', e => {
      !localStorage.theme && setTheme(e.matches ? 'dark' : 'light');
    });
  };

  // ================== AUDIO PLAYER ==================
  const initAudio = () => {
    const player = $('audio');
    if (!player) return;

    window.startMusic = () => player.readyState >= 2 
      ? player.play().catch(() => {})
      : on(player, 'canplay', () => player.play().catch(() => {}), { once: true });
  };

  // ================== ENTRY OVERLAY ==================
  const initOverlay = () => {
    const overlay = $('#entryOverlay');
    if (!overlay) return;

    on(overlay, 'click', () => {
      overlay.classList.add('fade-out');
      window.startMusic?.();
      setTimeout(() => overlay.remove(), 500); // Fixed removal timing
    });
  };

  // ================== VOLUME CONTROL ==================
  const initVolume = () => {
    const btn = $('#msc'), capsule = $('#volumeCapsule') || $('.msc-capsule');
    const fill = $('.msc-capsule-fill', capsule), player = $('audio');
    if (!btn || !capsule || !fill || !player) return;

    let isOpen = false, isDragging = false;
    const setVolume = vol => {
      vol = clamp(0, 1, vol);
      player.volume = vol;
      fill.style.height = `${capsule.clientHeight * vol}px`;
      btn.classList.toggle('muted', vol < 0.01);
      localStorage.setItem('volume', vol);
    };

    setVolume(clamp(0, 1, parseFloat(localStorage.volume) || 0.5);
    btn.ariaExpanded = 'false';
    capsule.ariaHidden = 'true';

    on(btn, 'click', e => {
      e.stopPropagation();
      isOpen = !isOpen;
      capsule.classList.toggle('open', isOpen);
      btn.ariaExpanded = isOpen;
      capsule.ariaHidden = !isOpen;
      isOpen && capsule.focus();
    });

    // Drag handling
    const handleDrag = e => {
      const y = (e.touches?.[0] || e).clientY;
      if (typeof y !== 'number') return;
      
      const rect = capsule.getBoundingClientRect();
      setVolume(1 - clamp(0, 1, (y - rect.top) / rect.height));
    };

    const startDrag = e => {
      isDragging = true;
      e.preventDefault();
      handleDrag(e);
    };

    on(capsule, 'mousedown', startDrag);
    on(capsule, 'touchstart', startDrag, { passive: false });

    const moveHandler = e => isDragging && handleDrag(e);
    on(document, 'mousemove', moveHandler);
    on(document, 'touchmove', moveHandler, { passive: false });

    const endDrag = () => isDragging = false;
    on(document, 'mouseup', endDrag);
    on(document, 'touchend', endDrag);

    on(document, 'click', e => {
      isOpen && !capsule.contains(e.target) && !btn.contains(e.target) && 
        btn.click();
    });
  };

  // ================== RIPPLE EFFECT ==================
  const initRipple = () => {
    const createRipple = e => {
      if (e.target.closest('#msc, #tgl, .msc-capsule, .copyright-chip') || noMotion()) return;
      
      const { clientX, clientY } = e.touches?.[0] || e;
      if (typeof clientX !== 'number') return;

      const size = Math.max(window.innerWidth, window.innerHeight) * 0.025;
      const ripple = Object.assign(document.createElement('span'), {
        className: 'ripple',
        style: `width:${size}px;height:${size}px;left:${clientX - size/2}px;top:${clientY - size/2}px`
      });

      on(ripple, 'animationend', () => ripple.remove());
      document.body.appendChild(ripple);
    };

    on(document, 'click', createRipple);
    on(document, 'touchstart', createRipple, { passive: true });
  };

  // Start initialization
  init();
});
