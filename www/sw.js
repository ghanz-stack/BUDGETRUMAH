// Service worker Budget Keluarga
//
// PERUBAHAN BESAR (v10): cache-first -> NETWORK-FIRST untuk request same-origin.
//
// Kenapa? Pada v1..v9 fetch handler memakai "cache-first":
//     caches.match(req).then(r => r || fetch(req)...)
// Akibatnya index.html TIDAK PERNAH di-refresh dari jaringan. Padahal hanya
// index.html yang mendaftarkan sw.js, jadi kalau index.html stale, sw.js juga
// tidak pernah di-update -> perangkat TERKUNCI di versi app yang lama selamanya.
// Gejala yang dilaporkan user: "Pengeluaran Superindo di platform lain tidak
// masuk dan tidak terbaca" - karena platform itu menjalankan kode lama.
//
// Dengan network-first: index.html selalu segar => sw.js baru selalu terpasang
// => perangkat otomatis lepas dari versi lama tanpa perlu hard refresh manual.
const CACHE='budget-keluarga-v10';

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
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET') return;

  const url=new URL(req.url);

  // Request cross-origin (Firebase CDN gstatic, dll) -> biarkan ke jaringan apa
  // adanya. Jangan pernah disentuh cache kita, itu bisa merusak modulnya.
  if(url.origin!==self.location.origin) return;

  const isNav=req.mode==='navigate';

  e.respondWith(
    // 1) Coba jaringan dulu (network-first) -> selalu dapat versi terbaru.
    fetch(req).then(res=>{
      if(res && res.status===200 && res.type!=='opaque'){
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});
      }
      return res;
    }).catch(()=>{
      // 2) Offline / jaringan gagal -> pakai cache.
      return caches.match(req).then(r=>{
        if(r) return r;
        if(isNav) return caches.match('./index.html');
        // 3) JANGAN pernah kembalikan HTML untuk request non-navigasi (js/css/gambar).
        //    Browser akan menolaknya dengan "Expected a JavaScript module script but
        //    the server responded with a MIME type of text/html" - bug lama v1..v9
        //    yang membuat pdf.js gagal dimuat sehingga import struk Superindo mati.
        return new Response('',{status:504,statusText:'Offline & not cached',headers:{'Content-Type':'text/plain'}});
      });
    })
  );
});