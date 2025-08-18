// fast-set theme to avoid FOUC
(() => {
  try {
    const theme = localStorage.getItem('theme')
      ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();

document.addEventListener('DOMContentLoaded', () => {
  // ===== utilities =====
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from((root || document).querySelectorAll(s));
  const clamp = (min, max, v) => Math.max(min, Math.min(max, v));
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== theme toggle =====
  function initTheme() {
    const btn = $('#tgl');
    const root = document.documentElement;
    if (!btn) return;

    const sys = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const setTheme = (t) => {
      t = t === 'dark' ? 'dark' : 'light';
      root.setAttribute('data-theme', t);
      localStorage.setItem('theme', t);
    };

    setTheme(localStorage.getItem('theme') || sys());
    btn.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

    // follow system only if user hasn't chosen
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener?.('change', (e) => {
      if (!localStorage.getItem('theme')) setTheme(e.matches ? 'dark' : 'light');
    });
  }

  // ===== audio player =====
  function initAudio() {
    const player = $('audio');
    if (!player) return;
    window.startMusic = () => {
      if (player.readyState >= 2) return player.play().catch(() => {});
      const onCan = () => { player.play().catch(() => {}); };
      player.addEventListener('canplay', onCan, { once: true });
    };
  }

  // ===== entry overlay =====
  function initOverlay() {
    const overlay = $('#entryOverlay');
    if (!overlay) return;
    overlay.addEventListener('click', () => {
      overlay.classList.add('fade-out');
      overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
      window.startMusic?.();
    }, { once: true });
  }

  // ===== social links delay =====
  function initSocialLinksDelay() {
    $$('.social-link').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const href = a.href;
        setTimeout(() => window.open(href, '_blank', 'noopener,noreferrer'), 1000);
      });
    });
  }

  // ===== volume control =====
  function initVolume() {
    const btn = $('#msc');
    const capsule = $('#volumeCapsule') || $('.msc-capsule');
    const fill = capsule ? $('.msc-capsule-fill', capsule) : null;
    const player = $('audio');
    if (!btn || !capsule || !fill || !player) return;

    const saved = clamp(0, 1, parseFloat(localStorage.getItem('volume') || 0.5));

    const setVolume = (vol) => {
      vol = clamp(0, 1, vol);
      const percent = Math.round(vol * 100);
      player.volume = vol;
      fill.style.height = `${percent}%`;                   // simpler, keeps visible effect
      btn.classList.toggle('muted', vol < 0.01);
      capsule.setAttribute('aria-valuenow', percent);
      capsule.setAttribute('aria-valuetext', `${percent}%`);
      localStorage.setItem('volume', String(vol));
    };

    let open = false;
    const toggle = () => {
      open = !open;
      capsule.classList.toggle('open', open);
      capsule.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      if (open) capsule.focus();
    };

    // pointer-based drag (handles mouse & touch)
    const handlePointer = (e) => {
      const y = e.clientY;
      const rect = capsule.getBoundingClientRect();
      setVolume(1 - clamp(0, 1, (y - rect.top) / rect.height));
    };
    const startPointer = (e) => {
      e.preventDefault();
      capsule.setPointerCapture?.(e.pointerId);
      handlePointer(e);
      const move = (ev) => handlePointer(ev);
      const end = (ev) => {
        capsule.releasePointerCapture?.(ev.pointerId);
        capsule.removeEventListener('pointermove', move);
        capsule.removeEventListener('pointerup', end);
      };
      capsule.addEventListener('pointermove', move);
      capsule.addEventListener('pointerup', end);
    };

    // init
    setVolume(saved);
    capsule.hidden = true;
    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    capsule.addEventListener('pointerdown', startPointer, { passive: false });

    // close when clicking outside
    document.addEventListener('click', (e) => {
      if (open && !capsule.contains(e.target) && !btn.contains(e.target)) toggle();
    });
  }

  // ===== ripple effect =====
  function initRipple() {
    const excluded = ['#msc', '#tgl', '.msc-capsule', '.copyright-chip'];
    const isExcluded = (el) => excluded.some(sel => el.closest(sel));
    const make = (e) => {
      if (reduceMotion()) return;
      const target = e.target;
      if (isExcluded(target)) return;
      const x = e.clientX, y = e.clientY;
      if (typeof x !== 'number' || typeof y !== 'number') return;
      const size = Math.max(window.innerWidth, window.innerHeight) * 0.025;
      const span = document.createElement('span');
      span.className = 'ripple';
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${x - size / 2}px`;
      span.style.top = `${y - size / 2}px`;
      span.addEventListener('animationend', () => span.remove(), { once: true });
      document.body.appendChild(span);
    };
    document.addEventListener('pointerdown', make, { passive: true });
  }

  // ===== initialize all =====
  [initTheme, initAudio, initOverlay, initVolume, initRipple, initSocialLinksDelay]
    .forEach(fn => { try { fn(); } catch (e) { console.error(`Error in ${fn.name}:`, e); } });
});
