// ┌─────────────┐
// │ Audio Setup │
// └─────────────┘
const a = document.querySelector('audio');

// ┌─────────────┐
// │ Music Control│
// └─────────────┘
const startMusic = () => {
  a && a.play();
}; 