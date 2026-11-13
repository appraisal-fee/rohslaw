// 진료일정 검색(보기 전용) - 서비스 워커: 페이지·자료는 최신 우선, 끊기면 저장본
const CACHE = 'jinryo-view-v8';
const CORE = ['./', './index.html', './data.json', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const fresh = req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/data.json');
  if (fresh) {
    const key = url.pathname.endsWith('/data.json') ? './data.json' : './index.html';
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(key, cp)); return r; }).catch(() => caches.match(key)));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
