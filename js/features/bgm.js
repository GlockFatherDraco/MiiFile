// ┌─────────────┐
// │ BGM Audio  │
// └─────────────┘
import { $ } from '../core/dom.js';

(() => {
  const a = $('audio');
  window.addEventListener('click', () => { a && a.play(); }, { once: true });
})(); 