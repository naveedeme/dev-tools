/* ─────────────────────────────────────────────────────────────
   Service Worker — Chrome DevTools Playground
   Strategy: Cache-first for app shell; network-first for CDN.
   ───────────────────────────────────────────────────────────── */

const CACHE_NAME   = 'devtools-v11';
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
];

/* ── Install: pre-cache app shell ───────────────────────────── */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(SHELL_ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

/* ── Activate: delete old caches ───────────────────────────── */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key)   { return caches.delete(key);  })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

/* ── Fetch: cache-first for shell, network-first for CDN ────── */
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  // CDN requests (unpkg, cdnjs, etc.) — network first, cache fallback
  if (url.hostname !== self.location.hostname && url.hostname !== 'localhost') {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          if (response && response.status === 200 && response.type !== 'opaque') {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(function() {
          return caches.match(event.request);
        })
    );
    return;
  }

  // App shell — cache first, network fallback
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
    })
  );
});
