/**
 * @file Service Worker
 * @description Caching and offline functionality for portfolio
 */

// -----------------------------
// Configuration
// -----------------------------
const CACHE_VERSION = 'v1';
const CACHE_NAME = `portfolio-cache-${CACHE_VERSION}`;

// -----------------------------
// Asset Manifests
// -----------------------------
const CACHE_ASSETS = [
  // HTML
  '/',
  '/index.html',
  
  // Config
  '/manifest.json',
  
  // Styles
  '/assets/styles/style.css',
  
  // Scripts
  '/assets/scripts/main.js',
  '/assets/scripts/service-worker.js',
  
  // Fonts
  '/assets/fonts/font.ttf',
  
  // Images
  '/assets/media/profile/profile.png',
  '/assets/media/voice/mute.svg',
  '/assets/media/voice/unmute.svg',
  '/assets/media/views/view.svg',
  
  // Audio
  '/assets/music/music.ogg',
  
  // Cursors
  '/assets/media/cursors/cursor-light.cur',
  '/assets/media/cursors/cursor-dark.cur',
  
  // Icons
  '/assets/media/icons/icon-192x192.png',
  '/assets/media/icons/icon-512x512.png'
];

// -----------------------------
// Utility Functions
// -----------------------------
/**
 * Helper - Adjust paths for relative serving
 * @param {string} path - Path to adjust
 * @return {string} Adjusted path
 */
const adjustPath = path => path.startsWith('/') ? path.substring(1) : path;

/**
 * Creates appropriate error response based on request type
 * @param {Error} error - The error that occurred
 * @param {Request} request - Original request
 * @returns {Response} Appropriate error response
 */
const createErrorResponse = (error, request) => {
  console.warn('Network fetch failed:', error);
  
  // HTML fallback for navigation requests
  if (request.headers.get('accept')?.includes('text/html')) {
    return caches.match('index.html');
  }

  // Error response for other assets
  return new Response('Network error - Offline mode', {
    status: 503,
    headers: {'Content-Type': 'text/plain'}
  });
};

// -----------------------------
// Cache Management
// -----------------------------
/**
 * Caches a valid response for later use
 * @param {Request} request - Original request
 * @param {Response} response - Network response to cache
 */
const cacheResponse = (request, response) => {
  const responseToCache = response.clone();
  caches.open(CACHE_NAME)
    .then(cache => cache.put(request, responseToCache))
    .catch(err => console.warn('Cache update failed:', err));
};

/**
 * Attempts to fetch from network and update cache
 * @param {Request} request - Request to fetch
 * @returns {Promise<Response>} Network response or error
 */
const fetchAndCache = request => {
  return fetch(request)
    .then(networkResponse => {
      // Don't cache bad responses
      if (!networkResponse || 
          networkResponse.status !== 200 || 
          networkResponse.type === 'opaque') {
        return networkResponse;
      }

      // Cache valid responses for later
      cacheResponse(request, networkResponse);
      return networkResponse;
    })
    .catch(error => createErrorResponse(error, request));
};

// -----------------------------
// Event Handlers
// -----------------------------
/**
 * Install event handler - Cache critical assets
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_ASSETS.map(adjustPath)))
      .then(() => self.skipWaiting())
      .catch(err => console.error('SW installation failed:', err))
  );
});

/**
 * Activate event handler - Clean old caches
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(cacheName => 
            cacheName.startsWith('portfolio-cache-') && 
            cacheName !== CACHE_NAME
          )
          .map(cacheName => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
      .catch(err => console.error('SW activation failed:', err))
  );
});

/**
 * Fetch event handler - Network with cache fallback strategy
 */
self.addEventListener('fetch', event => {
  // Skip non-GET or cross-origin requests
  if (event.request.method !== 'GET' || 
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const requestURL = new URL(event.request.url);

  event.respondWith(
    // Try cache first
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Try with adjusted path if direct match fails
        return caches.match(adjustPath(requestURL.pathname))
          .then(adjustedResponse => {
            if (adjustedResponse) {
              return adjustedResponse;
            }

            // Fetch from network if not in cache
            return fetchAndCache(event.request);
          });
      })
  );
}); 