// Service Worker — Español A2
// Met l'app en cache pour un fonctionnement hors-ligne complet.

const CACHE_NAME = 'espanol-a2-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Installation : on met en cache les fichiers de base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activation : on nettoie les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Stratégie : cache d'abord, réseau en secours (network fallback)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((resp) => {
            // On met en cache les nouvelles ressources GET réussies
            if (resp && resp.status === 200 && resp.type === 'basic') {
              const clone = resp.clone();
              caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
            }
            return resp;
          })
          .catch(() => cached)
      );
    })
  );
});
