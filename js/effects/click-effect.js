// ┌─────────────┐
// │ Ripple Setup│
// └─────────────┘
document.addEventListener('click', createRipple);
document.addEventListener('touchstart', createRipple, { passive: true });

// ┌─────────────┐
// │ Ripple Creation│
// └─────────────┘
function createRipple(event) {
  // ┌─────────────┐
  // │ Get Coordinates│
  // └─────────────┘
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX || (event.touches && event.touches[0].clientX);
  const y = event.clientY || (event.touches && event.touches[0].clientY);
  
  // ┌─────────────┐
  // │ Create Element│
  // └─────────────┘
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  
  // ┌─────────────┐
  // │ Calculate Size│
  // └─────────────┘
  const size = Math.max(window.innerWidth, window.innerHeight) * 0.025;
  ripple.style.width = size + 'px';
  ripple.style.height = size + 'px';
  ripple.style.left = (x - size / 2) + 'px';
  ripple.style.top = (y - size / 2) + 'px';
  
  // ┌─────────────┐
  // │ Add to DOM  │
  // └─────────────┘
  document.body.appendChild(ripple);
  
  // ┌─────────────┐
  // │ Cleanup     │
  // └─────────────┘
  ripple.addEventListener('animationend', () => {
    ripple.parentNode?.removeChild(ripple);
  });
  
  setTimeout(() => {
    ripple.parentNode?.removeChild(ripple);
  }, 1000);
} 