// Fast-set theme to avoid FOUC
(() => {
  try {
    const theme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch {}
})();

document.addEventListener('DOMContentLoaded', () => {
  // Utilities
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...(root || document).querySelectorAll(s)];
  const clamp = (min, max, v) => Math.max(min, Math.min(max, v));
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme toggle
  const initTheme = () => {
    const btn = $('#tgl');
    if (!btn) return;
    
    const root = document.documentElement;
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)');
    const setTheme = t => {
      t = t === 'dark' ? 'dark' : 'light';
      root.setAttribute('data-theme', t);
      localStorage.setItem('theme', t);
    };

    setTheme(localStorage.getItem('theme') || (sysDark.matches ? 'dark' : 'light'));
    btn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

    sysDark.addEventListener('change', e => {
      if (!localStorage.theme) setTheme(e.matches ? 'dark' : 'light');
    });
  };

  // Audio player
  const initAudio = () => {
    const player = $('audio');
    if (!player) return;
    
    window.startMusic = () => player.readyState >= 2 
      ? player.play().catch(() => {}) 
      : player.addEventListener('canplay', () => player.play(), { once: true });
  };

  // Entry overlay
  const initOverlay = () => {
    $('#entryOverlay')?.addEventListener('click', function() {
      this.classList.add('fade-out');
      this.ontransitionend = () => this.remove();
      window.startMusic?.();
    }, { once: true });
  };

  // Volume control
  const initVolume = () => {
    const btn = $('#msc');
    const capsule = $('.msc-capsule');
    const fill = $('.msc-capsule-fill', capsule);
    const player = $('audio');
    if (!btn || !capsule || !fill || !player) return;
    
    let open = false;
    const savedVol = clamp(0, 1, parseFloat(localStorage.volume || 0.5));
    
    const setVolume = vol => {
      vol = clamp(0, 1, vol);
      const percent = Math.round(vol * 100);
      player.volume = vol;
      fill.style.height = `${percent}%`;
      btn.classList.toggle('muted', vol < 0.01);
      capsule.setAttribute('aria-valuenow', percent);
      localStorage.setItem('volume', vol);
    };

    const toggleCapsule = () => {
      open = !open;
      capsule.classList.toggle('open', open);
      capsule.hidden = !open;
      btn.setAttribute('aria-expanded', open);
      if (open) capsule.focus();
    };

    const handleDrag = e => {
      const { top, height } = capsule.getBoundingClientRect();
      setVolume(1 - clamp(0, 1, (e.clientY - top) / height));
    };

    const startDrag = e => {
      e.preventDefault();
      handleDrag(e);
      const move = e => handleDrag(e);
      const end = () => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', end);
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', end);
    };

    setVolume(savedVol);
    capsule.hidden = true;
    btn.addEventListener('click', e => e.stopPropagation() || toggleCapsule());
    capsule.addEventListener('pointerdown', startDrag);
    
    document.addEventListener('click', e => {
      if (open && !capsule.contains(e.target) && !btn.contains(e.target)) toggleCapsule();
    });
  };

  // Ripple effect
  const initRipple = () => {
    const excluded = ['#msc', '#tgl', '.msc-capsule', '.copyright-chip'];
    document.addEventListener('pointerdown', e => {
      if (reduceMotion() || excluded.some(sel => e.target.closest(sel))) return;
      
      const size = Math.max(window.innerWidth, window.innerHeight) * 0.025;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      Object.assign(ripple.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${e.clientX - size/2}px`,
        top: `${e.clientY - size/2}px`
      });
      ripple.onanimationend = () => ripple.remove();
      document.body.appendChild(ripple);
    }, { passive: true });
  };

  // Initialize all components
  [initTheme, initAudio, initOverlay, initVolume, initRipple].forEach(fn => {
    try { fn() } catch(e) { console.error(`Error in ${fn.name}:`, e) }
  });
});
