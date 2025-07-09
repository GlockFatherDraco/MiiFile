// ┌─────────────┐
// │ Entry UI    │
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
  const overlay = $('#entry-overlay');
  const entryText = $('#entry-text');
  
  // ┌─────────────┐
  // │ Animation   │
  // └─────────────┘
  const animationSteps = [
    'click to enter.',
    'click to enter..',
    'click to enter...',
    'click to enter..',
    'click to enter.'
  ];
  
  let currentIndex = 0;
  let isAnimating = true;
  let fadeStarted = false;
  
  // ┌─────────────┐
  // │ Anim Funcs  │
  // └─────────────┘
  function animateText() {
    if (!isAnimating || !entryText) return;
    
    entryText.textContent = animationSteps[currentIndex];
    currentIndex = (currentIndex + 1) % animationSteps.length;
    setTimeout(animateText, 400);
  }
  
  function hideOverlay() {
    if (fadeStarted || !overlay) return;
    
    fadeStarted = true;
    isAnimating = false;
    overlay.classList.add('hide');
    
    setTimeout(() => {
      if (overlay) {
        overlay.style.display = 'none';
      }
    }, 500);
  }
  
  // ┌─────────────┐
  // │ Events      │
  // └─────────────┘
  function setupEventListeners() {
    if (overlay) {
      overlay.addEventListener('click', hideOverlay);
      overlay.addEventListener('transitionend', () => {
        if (overlay.classList.contains('hide')) {
          document.body.style.overflow = '';
        }
      });
    }
    
    window.addEventListener('DOMContentLoaded', () => {
      document.body.style.overflow = 'hidden';
    });
  }
  
  // ┌─────────────┐
  // │ Start       │
  // └─────────────┘
  function init() {
    setupEventListeners();
    animateText();
  }
  
  init();
})(); 