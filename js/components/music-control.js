// ┌─────────────┐
// │ Music Setup │
// └─────────────┘
document.addEventListener('DOMContentLoaded', () => {
  // ┌─────────────┐
  // │ Selectors   │
  // └─────────────┘
  const musicButton = document.getElementById('msc');
  const volumeCapsule = document.querySelector('.msc-capsule');
  const volumeFill = document.querySelector('.msc-capsule-fill');
  const audioElement = document.querySelector('audio');
  if (!musicButton || !volumeCapsule || !volumeFill || !audioElement) return;

  // ┌─────────────┐
  // │ State       │
  // └─────────────┘
  let isOpen = false;
  let isDragging = false;
  let currentVolume = 0.5;
  const capsuleHeight = volumeCapsule.offsetHeight || 144;
  const rect = volumeCapsule.getBoundingClientRect();

  // ┌─────────────┐
  // │ Core Functions │
  // └─────────────┘
  const updateIcon = () => musicButton.classList.toggle('muted', audioElement.volume < 1e-2);
  const updateFill = v => volumeFill.style.cssText = `height:${Math.round(capsuleHeight * v)}px;background:linear-gradient(to top,var(--tx) 0%,var(--tx2) 100%)`;
  const getVolumeFromY = y => Math.max(0, Math.min(1, 1 - (y - rect.top) / rect.height));
  const setVolume = v => {
    currentVolume = Math.max(0, Math.min(1, v));
    audioElement.volume = currentVolume;
    updateFill(currentVolume);
    updateIcon();
    volumeCapsule.setAttribute('aria-valuenow', Math.round(currentVolume * 100));
  };

  // ┌─────────────┐
  // │ Event Handlers │
  // └─────────────┘
  const getClientY = e => e.clientY || e.touches?.[0]?.clientY;
  const handleVolumeChange = y => y && setVolume(getVolumeFromY(y));
  const startDrag = e => {
    e.stopPropagation();
    isDragging = true;
    handleVolumeChange(getClientY(e));
    if (e.touches) e.preventDefault();
  };
  const updateDrag = e => isDragging && handleVolumeChange(getClientY(e));
  const endDrag = () => isDragging = false;

  // ┌─────────────┐
  // │ Keyboard Controls │
  // └─────────────┘
  const keyboardControls = {
    'ArrowUp': () => setVolume(currentVolume + 0.05),
    'ArrowDown': () => setVolume(currentVolume - 0.05),
    'Home': () => setVolume(1),
    'End': () => setVolume(0),
    ' ': () => setVolume(currentVolume < 0.5 ? 1 : 0),
    'Enter': () => setVolume(currentVolume < 0.5 ? 1 : 0)
  };

  // ┌─────────────┐
  // │ Event Listeners │
  // └─────────────┘
  volumeCapsule.addEventListener('mousedown', startDrag);
  volumeCapsule.addEventListener('touchstart', startDrag, { passive: false });
  volumeCapsule.addEventListener('click', e => {
    e.stopPropagation();
    handleVolumeChange(e.clientY);
  });
  volumeCapsule.addEventListener('keydown', e => keyboardControls[e.key]?.());

  document.addEventListener('mousemove', updateDrag);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', updateDrag, { passive: false });
  document.addEventListener('touchend', endDrag);

  musicButton.addEventListener('click', e => {
    e.stopPropagation();
    isOpen = !isOpen;
    volumeCapsule.classList.toggle('open', isOpen);
    if (isOpen) volumeCapsule.focus();
  });
  musicButton.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') musicButton.click();
  });

  document.addEventListener('click', e => {
    const clickedOnControl = musicButton.contains(e.target) || volumeCapsule.contains(e.target);
    if (isOpen && !clickedOnControl) {
      volumeCapsule.classList.remove('open');
      isOpen = false;
    }
  });

  // ┌─────────────┐
  // │ Initialize   │
  // └─────────────┘
  setVolume(0.5);
  updateIcon();
  audioElement.addEventListener('volumechange', () => {
    updateIcon();
    updateFill(audioElement.volume);
  });
}); 