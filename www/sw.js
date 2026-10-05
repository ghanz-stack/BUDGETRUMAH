const CACHE='budget-keluarga-v9';
const ASSETS=[
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './firebase-config.js',
  './vendor/pdf.min.js',
  './vendor/pdf.worker.min.js'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  const isNav = req.mode==='navigate';
  e.respondWith(
    caches.match(req).then(r=>{
      if(r) return r;
      return fetch(req).catch(()=>{
        // HANYA untuk navigasi halaman -> fallback ke index.html (app shell).
        // Request lain (js/css/gambar) HARUS return response dengan tipe yang sesuai,
        // kalau dipaksa return HTML -> browser baca "MIME type text/html" = pdf.js gagal.
        if(isNav) return caches.match('./index.html');
        return new Response('', {status:504, statusText:'Offline & not cached', headers:{'Content-Type':'text/plain'}});
      });
    })
  );
});
