// ┌─────────────┐
// │ BGM Audio   │
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
  const audioElement = $('audio');
  
  // ┌─────────────┐
  // │ Audio Funcs │
  // └─────────────┘
  function playAudio() {
    if (audioElement) {
      audioElement.play().catch(error => {
        console.warn('Audio autoplay failed:', error);
      });
    }
  }
  
  // ┌─────────────┐
  // │ Events      │
  // └─────────────┘
  function setupEventListeners() {
    window.addEventListener('click', playAudio, { once: true });
  }
  
  // ┌─────────────┐
  // │ Start       │
  // └─────────────┘
  setupEventListeners();
})(); 