// ┌─────────────┐
// │ Theme Setup │
// └─────────────┘
document.addEventListener('DOMContentLoaded', () => {
  // ┌─────────────┐
  // │ Constants   │
  // └─────────────┘
  const THEME_KEY = 'theme';
  const documentElement = document.documentElement;
  const toggleButton = document.getElementById('tgl');
  if (!toggleButton) return;

  // ┌─────────────┐
  // │ Theme Control│
  // └─────────────┘
  const setTheme = theme => {
    documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  };

  // ┌─────────────┐
  // │ Initialize  │
  // └─────────────┘
  setTheme(localStorage.getItem(THEME_KEY) || 'light');

  // ┌─────────────┐
  // │ Event Handler│
  // └─────────────┘
  toggleButton.addEventListener('click', () => {
    const currentTheme = documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}); 