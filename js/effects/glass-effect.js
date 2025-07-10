// ┌─────────────┐
// │ Glass Setup │
// └─────────────┘
function checkBackgroundImage() {
  // Background image not available, skipping glass mode
  return;
}

// ┌─────────────┐
// │ Glass Mode  │
// └─────────────┘
function enableGlassMode() {
  const body = document.body;
  body.classList.add('glass-mode');
  analyzeBackgroundColors();
}

// ┌─────────────┐
// │ Initialize  │
// └─────────────┘
function initGlassEffect() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkBackgroundImage);
  } else {
    checkBackgroundImage();
  }
}

// ┌─────────────┐
// │ Color Analysis│
// └─────────────┘
function analyzeBackgroundColors() {
  // Background image not available, skipping color analysis
  return;
}

// ┌─────────────┐
// │ Color Utils │
// └─────────────┘
function getDominantColor(colors) {
  const colorCounts = {};
  
  colors.forEach(color => {
    const key = color.join(',');
    colorCounts[key] = (colorCounts[key] || 0) + 1;
  });
  
  const dominant = Object.keys(colorCounts).reduce((a, b) => 
    colorCounts[a] > colorCounts[b] ? a : b
  );
  
  return dominant.split(',').map(Number);
}

function getBrightness(color) {
  return (color[0] * 0.299 + color[1] * 0.587 + color[2] * 0.114);
}

// ┌─────────────┐
// │ Apply Colors│
// └─────────────┘
function applyDynamicColors(dominantColor, brightness) {
  const body = document.body;
  const isDark = brightness < 128;
  const [r, g, b] = dominantColor;
  
  if (isDark) {

// ┌─────────────┐
// │ Dark  Colors│
// └─────────────┘
    body.style.setProperty('--glass-bg', `rgba(${r}, ${g}, ${b}, 0.2)`);
    body.style.setProperty('--glass-border', `rgba(255, 255, 255, 0.15)`);
    body.style.setProperty('--glass-text', `rgba(255, 255, 255, 0.95)`);
    body.style.setProperty('--glass-text-secondary', `rgba(255, 255, 255, 0.8)`);
    body.style.setProperty('--glass-shadow', `rgba(0, 0, 0, 0.3)`);
  } else {
// ┌─────────────┐
// │ Light Colors│
// └─────────────┘
    body.style.setProperty('--glass-bg', `rgba(255, 255, 255, 0.2)`);
    body.style.setProperty('--glass-border', `rgba(${r}, ${g}, ${b}, 0.3)`);
    body.style.setProperty('--glass-text', `rgba(0, 0, 0, 0.9)`);
    body.style.setProperty('--glass-text-secondary', `rgba(0, 0, 0, 0.7)`);
    body.style.setProperty('--glass-shadow', `rgba(0, 0, 0, 0.15)`);
  }
  
  body.classList.add('dynamic-colors');
}
// ┌─────────────┐
// │ Start Effect│
// └─────────────┘
initGlassEffect(); 