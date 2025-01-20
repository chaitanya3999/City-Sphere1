const CACHE_NAME = 'city-sphere-v1.1.0';
const OFFLINE_URL = '/src/html/offline.html';

const CACHE_ASSETS = [
    // Core HTML Pages
    '/',
    '/src/html/index.html',
    '/src/html/aboutus.html',
    '/src/html/services.html',
    '/src/html/contact.html',

    // CSS Files
    '/src/css/home.css',
    '/src/css/aboutus.css',
    '/src/css/form-validation.css',
    '/src/css/accessibility.css',

    // JavaScript Files
    '/src/js/home.js',
    '/src/js/form-validation.js',
    '/src/js/performance-optimizer.js',
    '/src/js/accessibility-seo.js',

    // Images
    '/src/images/City Sphere Final copy.png',
    '/src/images/team-member-1.jpg',
    '/src/images/team-member-2.jpg',
    '/src/images/team-member-3.jpg',

    // External Resources
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',

    // Offline Page
    OFFLINE_URL
];

// Install Event: Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching core assets');
                return cache.addAll(CACHE_ASSETS);
            })
            .catch((error) => {
                console.error('Install cache error:', error);
            })
    );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch Event: Network First Strategy with Fallback
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // If network request is successful, cache and return
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(event.request)
                    .then((response) => {
                        if (response) {
                            return response;
                        }
                        // If cache also fails, return offline page
                        return caches.match(OFFLINE_URL);
                    })
            })
    );
});

// Background Sync (optional)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

// Notification handling (optional)
self.addEventListener('push', (event) => {
    const title = 'City Sphere Update';
    const options = {
        body: event.data.text(),
        icon: '/src/images/City Sphere Final copy.png',
        badge: '/src/images/City Sphere Final copy.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Helper function for background sync (mock implementation)
async function syncData() {
    try {
        // Implement actual sync logic here
        console.log('Background sync completed');
    } catch (error) {
        console.error('Sync failed:', error);
    }
});
