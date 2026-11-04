/* STUMechanic service worker – offline cache. Bump VERSION when files change. */
var VERSION = 'stu-v6';
var FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/styles.css', 'assets/icon.svg', 'assets/icon-192.png', 'assets/icon-512.png',
  'js/core.js', 'js/i18n.js', 'js/vehicles.js', 'js/app.js',
  'js/anim/lib.js', 'js/anim/lifting.js', 'js/anim/oil.js', 'js/anim/brakes.js', 'js/anim/timing.js', 'js/anim/body.js',
  'js/anim/bleed.js', 'js/anim/coolant.js', 'js/anim/plugs.js', 'js/anim/diag.js', 'js/anim/clutch.js', 'js/anim/drivetrain.js',
  'js/anim/lights.js', 'js/anim/exhaust.js', 'js/anim/steering.js',
  'js/vendor/three.min.js', 'js/3d/engine.js', 'js/3d/parts.js', 'js/3d/cars.js',
  'js/3d/scenes/lifting.js', 'js/3d/scenes/oil.js', 'js/3d/scenes/brakes.js', 'js/3d/scenes/timing.js', 'js/3d/scenes/body.js', 'js/3d/scenes/bleed.js', 'js/3d/scenes/coolant.js', 'js/3d/scenes/plugs.js', 'js/3d/scenes/diag.js', 'js/3d/scenes/clutch.js', 'js/3d/scenes/drivetrain.js', 'js/3d/scenes/lights.js', 'js/3d/scenes/exhaust.js', 'js/3d/scenes/steering.js',
  'js/3d/scenes/battery.js', 'js/3d/scenes/tyres.js', 'js/3d/scenes/filters.js', 'js/3d/scenes/wipers.js', 'js/3d/scenes/fuses.js', 'js/3d/scenes/stk-check.js', 'js/3d/scenes/jumpstart-tow.js', 'js/3d/scenes/fuel-filter.js', 'js/3d/scenes/van-care.js', 'js/3d/scenes/struts-springs.js', 'js/3d/scenes/suspension-wear.js', 'js/3d/scenes/wheel-bearing.js', 'js/3d/scenes/aux-belt.js', 'js/3d/scenes/thermostat-pump.js', 'js/3d/scenes/egr-dpf.js', 'js/3d/scenes/injectors.js', 'js/3d/scenes/alternator-starter.js', 'js/3d/scenes/brake-lines.js', 'js/3d/scenes/alignment.js', 'js/3d/scenes/aircon.js', 'js/3d/scenes/gearbox-noise.js', 'js/3d/scenes/gearbox-7g.js', 'js/3d/scenes/air-suspension.js', 'js/3d/scenes/mhev-48v.js', 'js/3d/scenes/track-prep.js', 'js/3d/scenes/cv-boot.js', 'js/3d/scenes/turbo.js', 'js/3d/scenes/engine-mounts.js', 'js/3d/scenes/welding.js', 'js/3d/scenes/plastic-pdr.js', 'js/3d/scenes/head-gasket.js', 'js/3d/scenes/abc-hydraulics.js',
  'js/tutorials/battery.js', 'js/tutorials/tyres.js', 'js/tutorials/filters.js', 'js/tutorials/wipers.js', 'js/tutorials/fuses.js', 'js/tutorials/stk-check.js', 'js/tutorials/jumpstart-tow.js', 'js/tutorials/fuel-filter.js', 'js/tutorials/van-care.js', 'js/tutorials/struts-springs.js', 'js/tutorials/suspension-wear.js', 'js/tutorials/wheel-bearing.js', 'js/tutorials/aux-belt.js', 'js/tutorials/thermostat-pump.js', 'js/tutorials/egr-dpf.js', 'js/tutorials/injectors.js', 'js/tutorials/alternator-starter.js', 'js/tutorials/brake-lines.js', 'js/tutorials/alignment.js', 'js/tutorials/aircon.js', 'js/tutorials/gearbox-noise.js', 'js/tutorials/gearbox-7g.js', 'js/tutorials/air-suspension.js', 'js/tutorials/mhev-48v.js', 'js/tutorials/track-prep.js', 'js/tutorials/cv-boot.js', 'js/tutorials/turbo.js', 'js/tutorials/engine-mounts.js', 'js/tutorials/welding.js', 'js/tutorials/plastic-pdr.js', 'js/tutorials/head-gasket.js', 'js/tutorials/abc-hydraulics.js', 'js/symptoms.js',
  'js/tutorials/lifting.js', 'js/tutorials/oil-change.js', 'js/tutorials/brakes.js', 'js/tutorials/timing-belt.js', 'js/tutorials/bodywork.js',
  'js/tutorials/brake-bleed.js', 'js/tutorials/coolant.js', 'js/tutorials/spark-plugs.js', 'js/tutorials/diagnostics.js',
  'js/tutorials/clutch.js', 'js/tutorials/drivetrain-oils.js', 'js/tutorials/headlights.js', 'js/tutorials/rearlights.js',
  'js/tutorials/exhaust.js', 'js/tutorials/steering-wheel.js'
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
