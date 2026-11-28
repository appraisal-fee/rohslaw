/* 연명의료 현장 길라잡이 - 오프라인 캐시 (수정 배포 시 VERSION 값을 바꾸세요) */
const VERSION = "lst-pub-20261128-191604";
const FILES = ["./","./index.html","./content.js","./manifest.webmanifest","./vendor/html2canvas.min.js","./vendor/jspdf.umd.min.js",
  "./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => Promise.all(FILES.map(f => c.add(f).catch(()=>{}))))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("lst-pub-") && k !== VERSION).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
