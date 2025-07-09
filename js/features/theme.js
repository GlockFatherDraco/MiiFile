// ┌─────────────┐
// │ Theme      │
// └─────────────┘
(function() {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const k = 'theme';
  const de = document.documentElement;
  const b = $('#tgl');
  const setT = t => { de.setAttribute('data-theme', t); localStorage.setItem(k, t); };
  setT(localStorage.getItem(k) || 'light');
  b && b.addEventListener('click', () => setT(de.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
})(); 