// ┌─────────────┐
// │ Theme       │
// └─────────────┘
(function() {
  'use strict';
  
  // ┌─────────────┐
  // │ DOM Utils   │
  // └─────────────┘
  const $ = (selector, context = document) => context.querySelector(selector);
  
  // ┌─────────────┐
  // │ Constants   │
  // └─────────────┘
  const THEME_KEY = 'theme';
  const THEME_ATTRIBUTE = 'data-theme';
  const DEFAULT_THEME = 'light';
  
  // ┌─────────────┐
  // │ DOM Elements│
  // └─────────────┘
  const documentElement = document.documentElement;
  const toggleButton = $('#tgl');
  
  // ┌─────────────┐
  // │ Theme Funcs │
  // └─────────────┘
  function setTheme(theme) {
    documentElement.setAttribute(THEME_ATTRIBUTE, theme);
    localStorage.setItem(THEME_KEY, theme);
  }
  
  function getCurrentTheme() {
    return documentElement.getAttribute(THEME_ATTRIBUTE);
  }
  
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }
  
  // ┌─────────────┐
  // │ Initialize  │
  // └─────────────┘
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    setTheme(savedTheme);
  }
  
  // ┌─────────────┐
  // │ Events      │
  // └─────────────┘
  function setupEventListeners() {
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleTheme);
    }
  }
  
  // ┌─────────────┐
  // │ Start       │
  // └─────────────┘
  initTheme();
  setupEventListeners();
})(); 