// ┌─────────────┐
// │ Music UI   │
// └─────────────┘
(function() {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const m = $('#msc');
  const c = $('.msc-capsule');
  const f = $('.msc-capsule-fill');
  const a = document.querySelector('audio');
  let isOpen = false, isDragging = false, volume = 0.5;

  function updateMuteIcon() {
    m.classList.toggle('muted', a.volume < 0.01);
  }

  function updateSliderFill(vol) {
    const h = c.offsetHeight || 144;
    f.style.height = Math.round(h * vol) + 'px';
    f.style.background = vol < 0.1
      ? 'linear-gradient(to top,#222,#444)'
      : 'linear-gradient(to top,var(--tx) 0%,var(--tx2) 100%)';
  }

  function setVolume(vol) {
    volume = Math.max(0, Math.min(1, vol));
    a.volume = volume;
    updateSliderFill(volume);
    updateMuteIcon();
    c.setAttribute('aria-valuenow', Math.round(volume * 100));
  }

  function getVolumeFromY(y) {
    const r = c.getBoundingClientRect();
    return Math.max(0, Math.min(1, 1 - (y - r.top) / r.height));
  }

  // Drag logic
  function startDrag(e) {
    isDragging = true;
    setVolume(getVolumeFromY(e.clientY));
    function onMove(e2) {
      if (isDragging) setVolume(getVolumeFromY(e2.clientY));
    }
    function onUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }
  c.onmousedown = startDrag;

  function startTouch(e) {
    isDragging = true;
    setVolume(getVolumeFromY(e.touches[0].clientY));
    e.preventDefault();
    function onMove(e2) {
      if (isDragging) setVolume(getVolumeFromY(e2.touches[0].clientY));
    }
    function onUp() {
      isDragging = false;
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    }
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onUp);
  }
  c.ontouchstart = startTouch;

  c.onkeydown = function(e) {
    if (e.key === 'ArrowUp') setVolume(volume + 0.05);
    if (e.key === 'ArrowDown') setVolume(volume - 0.05);
    if (e.key === 'Home') setVolume(1);
    if (e.key === 'End') setVolume(0);
    if (e.key === ' ' || e.key === 'Enter') setVolume(volume < 0.5 ? 1 : 0);
  };

  m.onclick = function() {
    isOpen = !isOpen;
    c.classList.toggle('open', isOpen);
    if (isOpen) updateSliderFill(volume);
    if (isOpen) c.focus();
  };
  m.onkeydown = function(e) { if (e.key === 'Enter' || e.key === ' ') m.click(); };

  document.addEventListener('click', function(e) {
    if (isOpen && !m.contains(e.target) && !c.contains(e.target)) {
      c.classList.remove('open');
      isOpen = false;
    }
  });

  a.addEventListener('volumechange', function() {
    updateMuteIcon();
    updateSliderFill(a.volume);
  });

  c.addEventListener('transitionend', function() {
    if (c.classList.contains('open')) updateSliderFill(volume);
  });
  window.addEventListener('resize', function() {
    if (c.classList.contains('open')) updateSliderFill(volume);
  });

  setTimeout(function() { setVolume(0.5); }, 0);
})(); 