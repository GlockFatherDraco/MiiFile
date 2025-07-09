// ┌─────────────┐
// │ Entry UI   │
// └─────────────┘
(function() {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const overlay = $('#entry-overlay');
  const text = $('#entry-text');
  const steps = ['click to enter.','click to enter..','click to enter...','click to enter..','click to enter.'];
  let idx = 0, running = true, fadeStarted = false;

  function animateText() {
    if (!running) return;
    text.textContent = steps[idx];
    idx = (idx + 1) % steps.length;
    setTimeout(animateText, 400);
  }
  animateText();

  function hideOverlay() {
    if (fadeStarted) return;
    fadeStarted = true;
    running = false;
    overlay.classList.add('hide');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 500);
  }

  overlay.addEventListener('click', hideOverlay);
  window.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';
  });
  overlay.addEventListener('transitionend', () => {
    if (overlay.classList.contains('hide')) {
      document.body.style.overflow = '';
    }
  });
})(); 