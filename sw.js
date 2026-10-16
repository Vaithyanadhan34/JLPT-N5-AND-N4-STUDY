<<<<<<< HEAD
<<<<<<< HEAD
const CACHE='jlpt-study-v12';
const APP=['./','./index.html','./css/style.css','./js/app.js','./manifest.json','./data/vocab_source_900.json','./data/kanji_flashcards.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r.ok&&new URL(e.request.url).origin===location.origin){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r}).catch(()=>cached||new Response('',{status:503})))});
=======
const CACHE = 'jlpt-study-v12';
=======
const CACHE = 'jlpt-stationery-v17';
>>>>>>> 54359cc (Update project)
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
>>>>>>> 25c51b3 (Updated JLPT Data and UI/UX)
