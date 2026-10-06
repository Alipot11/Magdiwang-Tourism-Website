// Magdiwang Tourism service worker. Keep this file in the project ROOT
// so it covers index.html, html/*, assets/*, etc.
// When you change code or data, bump VERSION so visitors get the update.
const VERSION = "v6";
const CORE = "magdiwang-core-" + VERSION;
const TILES = "magdiwang-tiles";
const MAX_TILES = 400;

// Cached on install. Missing files are skipped, so it is safe to list
// pages or images that do not exist yet.
const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "html/explore.html",
  "html/nature.html",
  "html/lodging.html",
  "html/lodging-detail.html",
  "html/foods.html",
  "html/restaurant-detail.html",
  "html/activities.html",
  "html/events.html",
  "html/culture.html",
  "html/coming-soon.html",
  "style/index.css",
  "style/map.css",
  "style/explore.css",
  "style/nature.css",
  "style/lodging.css",
  "style/foods.css",
  "style/activities.css",
  "style/events.css",
  "style/culture.css",
  "js/main.js",
  "js/home.js",
  "js/map.js",
  "js/explore.js",
  "js/nature.js",
  "js/lodging.js",
  "js/foods.js",
  "js/activities.js",
  "js/events.js",
  "js/culture.js",
  "data/spots.js",
  "data/explore.js",
  "data/nature.js",
  "data/lodging.js",
  "data/foods.js",
  "data/activities.js",
  "data/events.js",
  "data/culture.js",
  "assets/tourism-logo.png",
  "assets/tourism-logo.ico",
  "assets/Magdiwang-seal.png",
  "assets/homepage/hero.webp",
  "assets/homepage/hero-2.webp",
  "assets/homepage/hero-3.webp",
  "assets/homepage/hero-4.webp",
  "assets/homepage/about.webp",
  "assets/homepage/cta.webp",
  "assets/homepage/card-1.webp",
  "assets/homepage/card-2.webp",
  "assets/homepage/card-3.webp",
  "assets/homepage/card-4.webp",
  "assets/homepage/card-5.webp",
  "assets/homepage/card-6.webp",
  "assets/icon-192.png",
  "assets/icon-512.png",
  // External libraries and fonts the pages depend on
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js",
  "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@700&family=Permanent+Marker&display=swap"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CORE).then(cache =>
      Promise.all(PRECACHE.map(url =>
        cache.add(new Request(url, { mode: url.startsWith("http") ? "no-cors" : "same-origin" }))
          .catch(() => { /* skip files that are missing */ })
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k.startsWith("magdiwang-core-") && k !== CORE)
        .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function trim(cacheName, max) {
  return caches.open(cacheName).then(cache =>
    cache.keys().then(keys => {
      if (keys.length > max) return cache.delete(keys[0]).then(() => trim(cacheName, max));
    })
  );
}

function cacheable(res) {
  return res && (res.ok || res.type === "opaque");
}

// Save a copy of a response. The clone is made right away, before the
// browser starts reading the response.
function save(cacheName, req, res) {
  if (!cacheable(res)) return;
  const copy = res.clone();
  caches.open(cacheName).then(c => c.put(req, copy)).catch(() => {});
}

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Map tiles: cache as the visitor browses, keep the most recent ones
  if (url.hostname.endsWith("tile.openstreetmap.org")) {
    event.respondWith(
      caches.open(TILES).then(cache =>
        cache.match(req).then(hit =>
          hit || fetch(req).then(res => {
            if (cacheable(res)) { cache.put(req, res.clone()); trim(TILES, MAX_TILES); }
            return res;
          })
        )
      ).catch(() => Response.error())
    );
    return;
  }

  // Pages: network first (fresh content), fall back to cache when offline.
  // ignoreSearch lets lodging-detail.html?id=... work offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then(res => {
        save(CORE, req, res);
        return res;
      }).catch(() =>
        caches.match(req, { ignoreSearch: true })
          .then(hit => hit || caches.match("index.html"))
      )
    );
    return;
  }

  // Your own code and data (js, css, data/*.js): network first so edits show
  // up right away. The cache is only the offline fallback.
  if (url.origin === self.location.origin && /\.(js|css|webmanifest)$/.test(url.pathname)) {
    event.respondWith(
      fetch(req).then(res => {
        save(CORE, req, res);
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Everything else (images, fonts, Leaflet): serve from cache instantly,
  // refresh it in the background. New images are fetched and saved on first view.
  event.respondWith(
    caches.match(req).then(hit => {
      const fresh = fetch(req).then(res => {
        save(CORE, req, res);
        return res;
      }).catch(() => hit);
      return hit || fresh;
    })
  );
});