const CACHE_NAME = 'photobooth-v4';
const ASSETS_TO_CACHE = [
    'index.html',
    'chup.html',
    'gioithieu.html',
    'chinhsach.html',
    'layout.html',
    'studio.html',
    'style.css',
    'script.js',
    'lang.js',
    'search.js',
    'spotlight.js',
    'badge-slider.js',
    'slider.js',
    'back-to-top.js',
    'layout.js',
    'policy-panels.js',
    'fire.png',
    'xoay.png',
    'tim1.png',
    'comming.png',
    'fr1.png',
    'fr2.png',
    'fr3.png',
    'fr4.png',
    'frame5.svg',
    'frame6.svg',
    'frame7.svg',
    'frame8.svg',
    'frame9.svg',
    'frame10.svg',
    'SG Display DEMO - Narrow.ttf'
];

// Install event - caching assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate event - cleaning up old caches
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
    self.clients.claim();
});

// Fetch event - serving from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // For navigation requests (opening a page)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    // If network fails, try to return the specific cached page
                    return caches.match(request) || caches.match('index.html');
                })
        );
        return;
    }

    // For other assets (CSS, JS, images)
    event.respondWith(
        caches.match(request).then((response) => {
            return response || fetch(request).then((networkResponse) => {
                // Optionally cache new assets discovered on the fly
                if (request.url.startsWith(self.location.origin) && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return networkResponse;
            });
        })
    );
});
