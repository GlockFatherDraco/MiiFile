// ┌─────────────┐
// │ Theme      │
// └─────────────┘
import { $, on } from '../core/dom.js';
import { get, set } from '../core/storage.js';

(() => {
  const k = 'theme';
  const de = document.documentElement;
  const b = $('#tgl');
  const setT = t => { de.setAttribute('data-theme', t); set(k, t); };
  setT(get(k) || 'light');
  on(b, 'click', () => setT(de.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
})(); 