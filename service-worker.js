/* NomanLifeDesk service worker: offline app shell.
   When you change index.html, bump VERSION (v1 -> v2) so phones pick up the update. */
const VERSION = 'v9';
const CACHE = 'nomanlifedesk-' + VERSION;
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('nomanlifedesk-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  const isFb = url.hostname === 'www.gstatic.com' && url.pathname.indexOf('/firebasejs/') === 0;
  // Google Drive / sign-in / any other network call is never touched.
  if (!sameOrigin && !isFont && !isFb) return;

  // App page: try the network first (so updates show immediately), fall back to the offline copy.
  if (sameOrigin && (req.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname))) {
    e.respondWith(
      caches.open(CACHE).then(async (cache) => {
        try {
          const res = await Promise.race([
            fetch(req, { cache: 'no-cache' }),
            new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 4000))
          ]);
          if (res && res.ok) { cache.put('./index.html', res.clone()); return res; }
        } catch (err) {}
        return (await cache.match('./index.html')) || (await cache.match('./')) || new Response('Offline', { status: 504 });
      })
    );
    return;
  }

  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);
      if (cached) { e.waitUntil(network); return cached; }
      const res = await network;
      if (res) return res;
      if (req.mode === 'navigate') return (await cache.match('./index.html')) || (await cache.match('./'));
      return new Response('', { status: 504, statusText: 'Offline' });
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then((cs) => (cs[0] ? cs[0].focus() : self.clients.openWindow('./'))));
});
