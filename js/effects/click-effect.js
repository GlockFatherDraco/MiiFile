// ┌─────────────┐
// │ Ripple Setup│
// └─────────────┘
document.addEventListener('DOMContentLoaded', () => {
  // ┌─────────────┐
  // │ Ripple Creation│
  // └─────────────┘
  const createRipple = event => {
    const target = event?.target;
    if (!target) return;
    // ┌─────────────┐
    // │ Get Coordinates│
    // └─────────────┘
    const x = event.clientX || event.touches?.[0]?.clientX;
    const y = event.clientY || event.touches?.[0]?.clientY;
    if (!x || !y) return;
    // ┌─────────────┐
    // │ Create Element│
    // └─────────────┘
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    // ┌─────────────┐
    // │ Calculate Size│
    // └─────────────┘
    const size = Math.max(window.innerWidth, window.innerHeight) * 0.025;
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x - size / 2}px;top:${y - size / 2}px`;
    // ┌─────────────┐
    // │ Add to DOM  │
    // └─────────────┘
    document.body.appendChild(ripple);
    // ┌─────────────┐
    // │ Cleanup     │
    // └─────────────┘
    const cleanup = () => ripple.remove();
    ripple.addEventListener('animationend', cleanup);
    setTimeout(cleanup, 1000);
  };
  // ┌───────────────┐
  // │Event Listener│
  // └──────────────┘
  document.addEventListener('click', createRipple);
  document.addEventListener('touchstart', createRipple, { passive: true });
}); 