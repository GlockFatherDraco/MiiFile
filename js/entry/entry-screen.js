// ┌─────────────┐
// │ Entry Setup │
// └─────────────┘
const entryOverlay = document.getElementById('entryOverlay');

// ┌─────────────┐
// │ Entry Control│
// └─────────────┘
const removeEntryScreen = () => {
  entryOverlay.classList.add('fade-out');
  setTimeout(() => {
    entryOverlay.remove();
    // ┌─────────────┐
    // │ Start Music │
    // └─────────────┘
    if (typeof startMusic === 'function') {
      startMusic();
    }
  }, 600);
};

// ┌─────────────┐
// │ Click Events │
// └─────────────┘
entryOverlay.addEventListener('click', removeEntryScreen);

// ┌─────────────┐
// │ Keyboard Events│
// └─────────────┘
entryOverlay.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    removeEntryScreen();
  }
}); 