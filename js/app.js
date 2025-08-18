// ===================================================
// Fast-set theme to avoid FOUC
// ===================================================
(() => {
  try {
    const theme = localStorage.theme || 
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch {}
})();

// ===================================================
// Main initialization
// ===================================================
addEventListener('DOMContentLoaded', () => {
  // ===================================================
  // Utilities
  // ===================================================
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (min, max, v) => Math.max(min, Math.min(max, v));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===================================================
  // Theme toggle
  // ===================================================
  const initTheme = () => {
    const btn = $('#tgl');
    if (!btn) return;
    
    const root = document.documentElement;
    const sysDark = matchMedia('(prefers-color-scheme: dark)');
    const setTheme = t => {
      t = t === 'dark' ? 'dark' : 'light';
      root.dataset.theme = t;
      localStorage.theme = t;
    };

    setTheme(localStorage.theme || (sysDark.matches ? 'dark' : 'light'));
    btn.onclick = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');

    sysDark.onchange = e => {
      if (!localStorage.theme) setTheme(e.matches ? 'dark' : 'light');
    };
  };

  // ===================================================
  // Audio player
  // ===================================================
  const initAudio = () => {
    const player = $('audio');
    if (!player) return;
    
    window.startMusic = () => player.readyState >= 2 
      ? player.play().catch(() => {}) 
      : player.oncanplay = () => player.play();
  };

  // ===================================================
  // Entry overlay
  // ===================================================
  const initOverlay = () => {
    $('#entryOverlay')?.addEventListener('click', function() {
      this.classList.add('fade-out');
      this.ontransitionend = () => this.remove();
      window.startMusic?.();
    }, { once: true });
  };

  // ===================================================
  // Social links delay
  // ===================================================
  const initSocialLinksDelay = () => {
    $$('.social-link').forEach(a => {
      a.onclick = e => {
        e.preventDefault();
        const href = a.href;
        setTimeout(() => window.open(href, '_blank', 'noopener,noreferrer'), 1000);
      };
    });
  };

  // ===================================================
  // Volume control
  // ===================================================
  const initVolume = () => {
    const btn = $('#msc'), capsule = $('.msc-capsule'), 
          fill = $('.msc-capsule-fill', capsule), player = $('audio');
    if (!btn || !capsule || !fill || !player) return;
    
    let open = false;
    const savedVol = clamp(0, 1, parseFloat(localStorage.volume || 0.5));
    
    const setVolume = vol => {
      vol = clamp(0, 1, vol);
      const percent = Math.round(vol * 100);
      player.volume = vol;
      fill.style.height = `${percent}%`;
      btn.classList.toggle('muted', vol < 0.01);
      capsule.ariaValueNow = percent;
      localStorage.volume = vol;
    };

    const toggleCapsule = () => {
      open = !open;
      capsule.classList.toggle('open', open);
      capsule.hidden = !open;
      btn.ariaExpanded = open;
      if (open) capsule.focus();
    };

    const handleDrag = e => {
      const { top, height } = capsule.getBoundingClientRect();
      setVolume(1 - clamp(0, 1, (e.clientY - top) / height));
    };

    const startDrag = e => {
      e.preventDefault();
      handleDrag(e);
      const end = () => {
        document.onpointermove = null;
        document.onpointerup = null;
      };
      document.onpointermove = handleDrag;
      document.onpointerup = end;
    };

    setVolume(savedVol);
    capsule.hidden = true;
    btn.onclick = e => e.stopPropagation() || toggleCapsule();
    capsule.onpointerdown = startDrag;
    
    document.onclick = e => {
      if (open && !capsule.contains(e.target) && !btn.contains(e.target)) toggleCapsule();
    };
  };

  // ===================================================
  // Ripple effect
  // ===================================================
  const initRipple = () => {
    const excluded = ['#msc', '#tgl', '.msc-capsule', '.copyright-chip'];
    document.onpointerdown = e => {
      if (reduceMotion || excluded.some(sel => e.target.closest(sel))) return;
      
      const size = Math.max(innerWidth, innerHeight) * 0.025;
      const ripple = Object.assign(document.createElement('span'), {
        className: 'ripple',
        style: `width:${size}px;height:${size}px;left:${e.clientX-size/2}px;top:${e.clientY-size/2}px`,
        onanimationend: () => ripple.remove()
      });
      document.body.appendChild(ripple);
    };
  };

  // ===================================================
  // Initialize all components
  // ===================================================
  [initTheme, initAudio, initOverlay, initVolume, initRipple, initSocialLinksDelay]
    .forEach(fn => { try { fn() } catch(e) { console.error(`Error in ${fn.name}:`, e) } });
});
