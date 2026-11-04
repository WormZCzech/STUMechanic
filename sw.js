/* STUMechanic service worker – offline cache. Bump VERSION when files change. */
var VERSION = 'stu-v1';
var FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/styles.css', 'assets/icon.svg', 'assets/icon-192.png', 'assets/icon-512.png',
  'js/core.js', 'js/i18n.js', 'js/vehicles.js', 'js/app.js',
  'js/anim/lib.js', 'js/anim/lifting.js', 'js/anim/oil.js', 'js/anim/brakes.js', 'js/anim/timing.js', 'js/anim/body.js',
  'js/tutorials/lifting.js', 'js/tutorials/oil-change.js', 'js/tutorials/brakes.js', 'js/tutorials/timing-belt.js', 'js/tutorials/bodywork.js'
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
/* network-first so updates arrive when online, cache fallback when offline */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function (res) {
    var copy = res.clone();
    caches.open(VERSION).then(function (c) { c.put(e.request, copy); });
    return res;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});
