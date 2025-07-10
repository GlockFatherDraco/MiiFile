// ┌─────────────┐
// │ Theme Setup │
// └─────────────┘
const k = 'theme';
const d = document;
const dE = d.documentElement;
const g = localStorage.getItem(k);
const b = d.getElementById('tgl');

// ┌─────────────┐
// │ Theme Control│
// └─────────────┘
const set = t => {
  dE.setAttribute('data-theme', t);
  localStorage.setItem(k, t);
};

// ┌─────────────┐
// │ Initialize   │
// └─────────────┘
set(g || 'light');
b.onclick = () => set(dE.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); 