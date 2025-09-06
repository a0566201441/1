
const CACHE = "budget-pwa-v29";
const CORE_ASSETS = ["./","./index.html","./manifest.webmanifest","./icons/pwa-192.png","./icons/pwa-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE_ASSETS))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const req = e.request; const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(cached => {
      const fetchAndUpdate = fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; }).catch(() => cached);
      return cached || fetchAndUpdate;
    }));
  } else {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; }).catch(() => caches.match(req)));
  }
});
