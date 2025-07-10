// ┌─────────────┐
// │ Entry Screen│
// └─────────────┘
const entryOverlay = document.getElementById('entryOverlay');

const removeEntryScreen = () => {
  entryOverlay.classList.add('fade-out');
  setTimeout(() => {
    entryOverlay.remove();
    // ┌─────────────┐
    // │ Start Music │
    // └─────────────┘
    startMusic();
  }, 600);
};

entryOverlay.addEventListener('click', removeEntryScreen);
entryOverlay.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    removeEntryScreen();
  }
});

// ┌─────────────┐
// │ Theme Tgl   │
// └─────────────┘
const k = 'theme';
const d = document;
const dE = d.documentElement;
const g = localStorage.getItem(k);
const b = d.getElementById('tgl');

const set = t => {
  dE.setAttribute('data-theme', t);
  localStorage.setItem(k, t);
};

set(g || 'light');
b.onclick = () => set(dE.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');

// ┌─────────────┐
// │ BGM Audio   │
// └─────────────┘
const a = document.querySelector('audio');

const startMusic = () => {
  a && a.play();
};

// ┌─────────────┐
// │ Music Ctrl  │
// └─────────────┘

// ┌─────────────┐
// │ Music Ctrl  │
// └─────────────┘
const m = document.getElementById('msc');
const c = document.querySelector('.msc-capsule');
const f = document.querySelector('.msc-capsule-fill');

let open = false;
let drag = false;
let vol = 0.5;

const updateIcon = () => m.classList.toggle('muted', a.volume < 1e-2);

const setVol = v => {
  vol = Math.max(0, Math.min(1, v));
  a.volume = vol;
  updateFill(vol);
  updateIcon();
  c.setAttribute('aria-valuenow', Math.round(vol * 100));
};

const updateFill = v => {
  const H = c.offsetHeight || 144;
  const fillH = Math.round(H * v);
  f.style.height = fillH + "px";
  f.style.background = 'linear-gradient(to top, var(--tx) 0%, var(--tx2) 100%)';
};

const getVolFromY = y => {
  const rect = c.getBoundingClientRect();
  let rel = 1 - (y - rect.top) / rect.height;
  return Math.max(0, Math.min(1, rel));
};

setTimeout(() => setVol(0.5), 0);

// ┌─────────────┐
// │ Event Listen│
// └─────────────┘
c.addEventListener('mousedown', e => {
  drag = true;
  setVol(getVolFromY(e.clientY));
});

d.addEventListener('mousemove', e => {
  if (drag) setVol(getVolFromY(e.clientY));
});

d.addEventListener('mouseup', () => drag = false);

c.addEventListener('touchstart', e => {
  drag = true;
  setVol(getVolFromY(e.touches[0].clientY));
  e.preventDefault();
});

d.addEventListener('touchmove', e => {
  if (drag) setVol(getVolFromY(e.touches[0].clientY));
});

d.addEventListener('touchend', () => drag = false);

c.onclick = e => setVol(getVolFromY(e.clientY));

c.onkeydown = e => {
  if (e.key === 'ArrowUp') setVol(vol + 0.05);
  if (e.key === 'ArrowDown') setVol(vol - 0.05);
  if (e.key === 'Home') setVol(1);
  if (e.key === 'End') setVol(0);
  if (e.key === ' ' || e.key === 'Enter') setVol(vol < 0.5 ? 1 : 0);
};

m.onclick = e => {
  open = !open;
  c.classList.toggle('open', open);
  if (open) c.focus();
};

m.onkeydown = e => {
  if (e.key === 'Enter' || e.key === ' ') m.click();
};

d.addEventListener('click', e => {
  if (open && !m.contains(e.target) && !c.contains(e.target)) {
    c.classList.remove('open');
    open = false;
  }
});

updateIcon();
a.addEventListener('volumechange', () => {
  updateIcon();
  updateFill(a.volume);
}); 