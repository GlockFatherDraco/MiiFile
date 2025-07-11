// ┌─────────────┐
// │ Entry Setup │
// └─────────────┘
document.addEventListener('DOMContentLoaded', () => {
  // ┌─────────────┐
  // │ Selectors   │
  // └─────────────┘
  const entryOverlay = document.getElementById('entryOverlay');
  if (!entryOverlay) return;

  // ┌─────────────┐
  // │ Entry Control│
  // └─────────────┘
  const removeEntryScreen = () => {
    entryOverlay.classList.add('fade-out');
    setTimeout(() => {
      entryOverlay.remove();
      if (window.startMusic) window.startMusic();
    }, 600);
  };

  // ┌─────────────┐
  // │ Event Handlers │
  // └─────────────┘
  entryOverlay.addEventListener('click', removeEntryScreen);
  entryOverlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      removeEntryScreen();
    }
  });
}); 