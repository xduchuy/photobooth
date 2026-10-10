const CACHE_NAME = 'photobooth-v5';

const FRAME_ASSETS = [
    'fr1.png',
    'fr2.png',
    'fr3.png',
    'fr4.png',
    'polaroid-frame.svg'
];

for (let i = 5; i <= 65; i++) {
    if (i !== 11 && i !== 12) {
        FRAME_ASSETS.push(`frame${i}.svg`);
    }
}

const ASSETS_TO_CACHE = [
    'index.html',
    'chup.html',
    'gioithieu.html',
    'chinhsach.html',
    'layout.html',
    'studio.html',
    'manifest.json',
    'style.css',
    'frames-data.js',
    'storage.js',
    'script.js',
    'studio.js',
    'layout.js',
    'lang.js',
    'search.js',
    'spotlight.js',
    'badge-slider.js',
    'slider.js',
    'back-to-top.js',
    'policy-panels.js',
    'fire.png',
    'xoay.png',
    'tim1.png',
    'comming.png',
    'SG Display DEMO - Narrow.ttf',
    ...FRAME_ASSETS
];

// Install event - caching assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache', CACHE_NAME);
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

    // For navigation requests (opening a page)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    // If network fails, try to return the specific cached page
                    return caches.match(request, { ignoreSearch: true }) || caches.match('index.html');
                })
        );
        return;
    }

    // For other assets (CSS, JS, images, fonts)
    event.respondWith(
        caches.match(request, { ignoreSearch: true }).then((response) => {
            if (response) {
                return response;
            }
            return fetch(request).then((networkResponse) => {
                // Cache dynamically requested same-origin resources
                if (request.url.startsWith(self.location.origin) && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // If offline and request failed, fallback to ignoreSearch match
                return caches.match(request, { ignoreSearch: true });
            });
        })
    );
});
