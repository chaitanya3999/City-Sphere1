const CACHE_NAME = 'city-sphere-v1.0.0';
const OFFLINE_URL = '/src/html/offline.html';

const CACHE_ASSETS = [
    '/',
    '/src/html/index.html',
    '/src/css/home.css',
    '/src/js/home.js',
    '/src/images/City Sphere Final copy.png',
    OFFLINE_URL
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(CACHE_ASSETS);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Intercept network requests
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                // If fetch fails (no network), return offline page
                return caches.match(OFFLINE_URL);
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
