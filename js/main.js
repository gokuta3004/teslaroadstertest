'use strict';
/* ---------- loop ---------- */
let last=performance.now();
function loop(n){requestAnimationFrame(loop);if(S.fps&&n-last<(S.fps==1?33:16)-1)return;const dt=Math.min(.05,(n-last)/1000);last=n;if(state=='play'){update(dt);if(tT>0){tT-=dt;if(tT<=0)$('toast').textContent=''}if(frame%3==0){hud();mini()}}
 stream(P.s);chunks.forEach(g=>{const u=g.userData;if(u.i>0&&isInter(u.i)){const m=LAMP[red(u.i,simT)?1:0];u.lm.forEach(l=>l.material=m)}});camI+=dt;if(camI>4&&!pt.size){const q=Math.min(1,3*dt);CY_-=CY_*q;CP_-=CP_*q}updCam();R.render(scene,cam);frame++}
apply();reset();menu();requestAnimationFrame(loop);
window.__t={P,en,held,K,AC,update,act,start,end,hud,mini,get simT(){return simT},get state(){return state},set simT(v){simT=v},chunks};
