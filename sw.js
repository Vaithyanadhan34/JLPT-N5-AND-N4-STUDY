const CACHE = 'jlpt-stationery-v18';
const APP = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/kana-data.js',
  './js/book-features.js',
  './manifest.json',
  './data/vocab_source_900.json',
  './data/kanji_flashcards.json',
  './data/study_supplement.json',
  './data/grammar.json',
  './data/conjunctions.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(APP))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Exclude private book companion data from service worker cache
  if (url.pathname.includes('private') || url.pathname.includes('companion')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network first for local code in development, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok && url.origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || new Response('', { status: 503 })))
  );
});
