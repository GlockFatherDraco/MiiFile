// ┌─────────────┐
// │ Audio Setup │
// └─────────────┘
document.addEventListener('DOMContentLoaded', () => {
  // ┌─────────────┐
  // │ Select Audio │
  // └─────────────┘
  const audioElement = document.querySelector('audio');
  if (!audioElement) return;

  // ┌─────────────┐
  // │ Music Control│
  // └─────────────┘
  window.startMusic = () => {
    if (audioElement.readyState >= 2) {
      return audioElement.play().catch(() => {
        audioElement.load();
        return audioElement.play().catch(() => {});
      });
    }
  };

  // ┌─────────────┐
  // │ Audio Events │
  // └─────────────┘
  audioElement.addEventListener('error', () => {});
  audioElement.addEventListener('canplay', () => {});
}); 