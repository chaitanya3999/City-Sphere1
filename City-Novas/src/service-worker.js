const CACHE_NAME = 'city-novas-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/register.html',
  '/css/home.css',
  '/css/navigation.css',
  '/js/home.js',
  '/js/navigation.js',
  '/images/City Sphere Final copy.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
