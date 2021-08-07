const label_name = "banding-harga-"
var staticCacheName = label_name + new Date().getTime();
var filesToCache = [
    '/css/sweetalert2.min.css',
    '/index.html',
    '/css/tailwind.css',
    '/js/index.js',
    '/js/sweetalert2.min.js',
    '/image/icons-512.png',
    '/image/illustration.svg',
    '/image/illustration-dark.svg',
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
