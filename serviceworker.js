const label_name = "banding-harga-"
var staticCacheName = label_name + new Date().getTime();
var filesToCache = [
    'css/sweetalert2.min.css',
    '/',
    'css/tailwind.css',
    'js/index.js',
    'js/sweetalert2.min.js',
    'image/icon.png',
    'image/icons-512.png',
    'image/splash/splash-640x1136.png',
    'image/splash/splash-750x1334.png',
    'image/splash/splash-1242x2208.png',
    'image/splash/splash-1125x2436.png',
    'image/splash/splash-828x1792.png',
    'image/splash/splash-1242x2688.png',
    'image/splash/splash-1536x2048.png',
    'image/splash/splash-1668x2224.png',
    'image/splash/splash-1668x2388.png',
    'image/splash/splash-2048x2732.png',
    'image/illustration.svg',
    'image/illustration-dark.svg',
];

// Cache on install
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith(label_name)))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('index');
            })
    )
});
