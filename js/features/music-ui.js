// ┌─────────────┐
// │ Music UI    │
// └─────────────┘
(function() {
  'use strict';
  
  // ┌─────────────┐
  // │ DOM Utils   │
  // └─────────────┘
  const $ = (selector, context = document) => context.querySelector(selector);
  
  // ┌─────────────┐
  // │ DOM Elements│
  // └─────────────┘
  const musicButton = $('#msc');
  const volumeCapsule = $('.msc-capsule');
  const volumeFill = $('.msc-capsule-fill');
  const audioElement = $('audio');
  
  // ┌─────────────┐
  // │ State       │
  // └─────────────┘
  let isOpen = false;
  let isDragging = false;
  let volume = 0.5;
  
  // ┌─────────────┐
  // │ Volume Funcs│
  // └─────────────┘
  function updateMuteIcon() {
    if (musicButton && audioElement) {
      musicButton.classList.toggle('muted', audioElement.volume < 0.01);
    }
  }
  
  function updateSliderFill(vol) {
    if (!volumeCapsule || !volumeFill) return;
    
    const height = volumeCapsule.offsetHeight || 144;
    volumeFill.style.height = Math.round(height * vol) + 'px';
    volumeFill.style.background = vol < 0.1
      ? 'linear-gradient(to top, #222, #444)'
      : 'linear-gradient(to top, var(--tx) 0%, var(--tx2) 100%)';
  }
  
  function setVolume(vol) {
    volume = Math.max(0, Math.min(1, vol));
    
    if (audioElement) {
      audioElement.volume = volume;
    }
    
    updateSliderFill(volume);
    updateMuteIcon();
    
    if (volumeCapsule) {
      volumeCapsule.setAttribute('aria-valuenow', Math.round(volume * 100));
    }
  }
  
  function getVolumeFromY(y) {
    if (!volumeCapsule) return 0;
    
    const rect = volumeCapsule.getBoundingClientRect();
    return Math.max(0, Math.min(1, 1 - (y - rect.top) / rect.height));
  }
  
  // ┌─────────────┐
  // │ Drag Funcs  │
  // └─────────────┘
  function startDrag(event) {
    isDragging = true;
    setVolume(getVolumeFromY(event.clientY));
    
    function onMove(e) {
      if (isDragging) {
        setVolume(getVolumeFromY(e.clientY));
      }
    }
    
    function onUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }
  
  function startTouch(event) {
    isDragging = true;
    setVolume(getVolumeFromY(event.touches[0].clientY));
    event.preventDefault();
    
    function onMove(e) {
      if (isDragging) {
        setVolume(getVolumeFromY(e.touches[0].clientY));
      }
    }
    
    function onUp() {
      isDragging = false;
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    }
    
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onUp);
  }
  
  // ┌─────────────┐
  // │ Keyboard    │
  // └─────────────┘
  function handleKeyboard(event) {
    if (!volumeCapsule) return;
    
    switch (event.key) {
      case 'ArrowUp':
        setVolume(volume + 0.05);
        break;
      case 'ArrowDown':
        setVolume(volume - 0.05);
        break;
      case 'Home':
        setVolume(1);
        break;
      case 'End':
        setVolume(0);
        break;
      case ' ':
      case 'Enter':
        setVolume(volume < 0.5 ? 1 : 0);
        break;
    }
  }
  
  // ┌─────────────┐
  // │ UI Funcs    │
  // └─────────────┘
  function toggleMusicUI() {
    isOpen = !isOpen;
    
    if (volumeCapsule) {
      volumeCapsule.classList.toggle('open', isOpen);
    }
    
    if (isOpen) {
      updateSliderFill(volume);
      volumeCapsule.focus();
    }
  }
  
  function handleMusicButtonKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      musicButton.click();
    }
  }
  
  function handleOutsideClick(event) {
    if (isOpen && musicButton && volumeCapsule) {
      if (!musicButton.contains(event.target) && !volumeCapsule.contains(event.target)) {
        volumeCapsule.classList.remove('open');
        isOpen = false;
      }
    }
  }
  
  // ┌─────────────┐
  // │ Events      │
  // └─────────────┘
  function setupEventListeners() {
    if (volumeCapsule) {
      volumeCapsule.onmousedown = startDrag;
      volumeCapsule.ontouchstart = startTouch;
      volumeCapsule.onkeydown = handleKeyboard;
    }
    
    if (musicButton) {
      musicButton.onclick = toggleMusicUI;
      musicButton.onkeydown = handleMusicButtonKeydown;
    }
    
    if (audioElement) {
      audioElement.addEventListener('volumechange', () => {
        updateMuteIcon();
        updateSliderFill(audioElement.volume);
      });
    }
    
    if (volumeCapsule) {
      volumeCapsule.addEventListener('transitionend', () => {
        if (volumeCapsule.classList.contains('open')) {
          updateSliderFill(volume);
        }
      });
    }
    
    window.addEventListener('resize', () => {
      if (volumeCapsule && volumeCapsule.classList.contains('open')) {
        updateSliderFill(volume);
      }
    });
    
    document.addEventListener('click', handleOutsideClick);
  }
  
  // ┌─────────────┐
  // │ Start       │
  // └─────────────┘
  function init() {
    setupEventListeners();
    setTimeout(() => setVolume(0.5), 0);
  }
  
  init();
})(); 