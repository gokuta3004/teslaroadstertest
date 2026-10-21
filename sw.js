const C='hrr3d-v1';
const A=['./','index.html','style.css','game.js','manifest.json','icon.svg','https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(A.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(e.request).then(n=>{if(n&&(n.ok||n.type==='opaque')){const cp=n.clone();caches.open(C).then(c=>c.put(e.request,cp))}return n}).catch(()=>hit||caches.match('index.html'));
    return hit||net;
  }));
});
