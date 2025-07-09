// ┌─────────────┐
// │ Music UI   │
// └─────────────┘
import { $, on } from '../core/dom.js';

(() => {
  const m = $('#msc'), c = $('.msc-capsule'), f = $('.msc-capsule-fill');
  const a = document.querySelector('audio');
  let o = 0, g = 0, v = 0.5;
  let moveHandler, upHandler, touchMoveHandler, touchEndHandler;

  const setI = () => m.classList.toggle('muted', a.volume < .01);
  const setV = x => { v = Math.max(0, Math.min(1, x)); a.volume = v; setF(v); setI(); c.setAttribute('aria-valuenow', Math.round(v * 100)); };
  const setF = x => { const h = c.offsetHeight || 144; f.style.height = Math.round(h * x) + "px"; f.style.background = x < .1 ? 'linear-gradient(to top,#222,#444)' : 'linear-gradient(to top,var(--tx) 0%,var(--tx2) 100%)'; };
  const getV = y => { const r = c.getBoundingClientRect(); return Math.max(0, Math.min(1, 1 - (y - r.top) / r.height)); };
  setTimeout(() => setV(.5), 0);
  // ┌─────────────────┐
  // │ Drag Handlers   │
  // └────────────────┘
  const startDrag = e => {
    g = 1;
    setV(getV(e.clientY));
    moveHandler = e2 => { if (g) setV(getV(e2.clientY)); };
    upHandler = () => { g = 0; document.removeEventListener('mousemove', moveHandler); document.removeEventListener('mouseup', upHandler); };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  };
  c.onmousedown = startDrag;

  const startTouch = e => {
    g = 1;
    setV(getV(e.touches[0].clientY));
    e.preventDefault();
    touchMoveHandler = e2 => { if (g) setV(getV(e2.touches[0].clientY)); };
    touchEndHandler = () => { g = 0; document.removeEventListener('touchmove', touchMoveHandler); document.removeEventListener('touchend', touchEndHandler); };
    document.addEventListener('touchmove', touchMoveHandler);
    document.addEventListener('touchend', touchEndHandler);
  };
  c.ontouchstart = startTouch;

  c.onkeydown = e => {
    if (e.key === 'ArrowUp') setV(v + .05);
    if (e.key === 'ArrowDown') setV(v - .05);
    if (e.key === 'Home') setV(1);
    if (e.key === 'End') setV(0);
    if (e.key === ' ' || e.key === 'Enter') setV(v < .5 ? 1 : 0);
  };
  m.onclick = () => { o ^= 1; c.classList.toggle('open', !!o); o && c.focus(); };
  m.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') m.click(); };
  document.addEventListener('click', e => { if (o && !m.contains(e.target) && !c.contains(e.target)) { c.classList.remove('open'); o = 0; } });
  a.addEventListener('volumechange', () => { setI(); setF(a.volume); });
})(); 