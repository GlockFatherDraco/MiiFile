// ┌─────────────┐
// │ Music Setup │
// └─────────────┘
const m = document.getElementById('msc');
const c = document.querySelector('.msc-capsule');
const f = document.querySelector('.msc-capsule-fill');

let open = false;
let drag = false;
let vol = 0.5;

// ┌─────────────┐
// │ Volume Control│
// └─────────────┘
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

// ┌─────────────┐
// │ Mouse Events │
// └─────────────┘
c.addEventListener('mousedown', e => {
  drag = true;
  setVol(getVolFromY(e.clientY));
});

d.addEventListener('mousemove', e => {
  if (drag) setVol(getVolFromY(e.clientY));
});

d.addEventListener('mouseup', () => drag = false);

// ┌─────────────┐
// │ Touch Events │
// └─────────────┘
c.addEventListener('touchstart', e => {
  drag = true;
  setVol(getVolFromY(e.touches[0].clientY));
  e.preventDefault();
});

d.addEventListener('touchmove', e => {
  if (drag) setVol(getVolFromY(e.touches[0].clientY));
});

d.addEventListener('touchend', () => drag = false);

// ┌─────────────┐
// │ Click Events │
// └─────────────┘
c.onclick = e => setVol(getVolFromY(e.clientY));

// ┌─────────────┐
// │ Keyboard Events│
// └─────────────┘
c.onkeydown = e => {
  if (e.key === 'ArrowUp') setVol(vol + 0.05);
  if (e.key === 'ArrowDown') setVol(vol - 0.05);
  if (e.key === 'Home') setVol(1);
  if (e.key === 'End') setVol(0);
  if (e.key === ' ' || e.key === 'Enter') setVol(vol < 0.5 ? 1 : 0);
};

m.onkeydown = e => {
  if (e.key === 'Enter' || e.key === ' ') m.click();
};

// ┌─────────────┐
// │ Button Events│
// └─────────────┘
m.onclick = e => {
  open = !open;
  c.classList.toggle('open', open);
  if (open) c.focus();
};

// ┌─────────────┐
// │ Click Outside│
// └─────────────┘
d.addEventListener('click', e => {
  if (open && !m.contains(e.target) && !c.contains(e.target)) {
    c.classList.remove('open');
    open = false;
  }
});

// ┌─────────────┐
// │ Initialize   │
// └─────────────┘
setTimeout(() => setVol(0.5), 0);
updateIcon();
a.addEventListener('volumechange', () => {
  updateIcon();
  updateFill(a.volume);
}); 