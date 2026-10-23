'use strict';
/* ---------- input ---------- */
function camNext(){S.cam=(S.cam+1)%4;CY_=CP_=0;camZ=1;apply()}
function camReset(){CY_=CP_=0;camZ=1}
function autoToggle(){S.ast=S.ast?0:1;AP.lane=null;AP.sk=null;toast(S.ast?'Tự lái: BẬT':'Tự lái: TẮT');apply()}
addEventListener('keydown',e=>{if(e.repeat)return;K[e.code]=true;const c=e.code;if(c=='KeyQ')held.q=true;else if(c=='KeyE')act('e');else if(c=='KeyR')act('r');else if(c=='KeyF')act('f');else if(c=='KeyC')camNext();else if(c=='KeyV')camReset();else if(c=='KeyT')autoToggle();else if(c=='KeyP'||c=='Escape')pause();
 if(['Space','ArrowUp','ArrowDown','ShiftLeft'].includes(c))e.preventDefault()});
addEventListener('keyup',e=>{K[e.code]=false;if(e.code=='KeyQ')held.q=false});
addEventListener('blur',()=>{for(const k in K)K[k]=false;held.q=false;ui.up=ui.dn=false});
document.querySelectorAll('#btns button').forEach(b=>{const k=b.dataset.k,set=v=>{if(k=='q')held.q=v;else if(k=='up')ui.up=v;else if(k=='dn')ui.dn=v;else if(v)act(k);b.classList.toggle('on',v&&(k=='q'||k=='up'||k=='dn'))};
 b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);set(true)});['pointerup','pointercancel','lostpointercapture'].forEach(n=>b.addEventListener(n,()=>set(false)))});
const joy=$('joy'),kn=$('knob');
function jm(e){const r=joy.getBoundingClientRect(),R0=r.width/2;let dx=e.clientX-r.left-R0,dy=e.clientY-r.top-R0;const d=Math.hypot(dx,dy),m=Math.min(d,R0*.6);if(d>0){dx=dx/d*m;dy=dy/d*m}kn.style.transform=`translate(${dx}px,${dy}px)`;const f=v=>Math.abs(v)<R0*.08?0:v/(R0*.6);J.x=f(dx);J.y=f(dy)}
joy.addEventListener('pointerdown',e=>{e.preventDefault();J.id=e.pointerId;joy.setPointerCapture(e.pointerId);jm(e)});joy.addEventListener('pointermove',e=>{if(e.pointerId==J.id)jm(e)});
['pointerup','pointercancel'].forEach(n=>joy.addEventListener(n,e=>{if(e.pointerId==J.id){J.id=null;J.x=J.y=0;kn.style.transform=''}}));
const cv=$('c'),pt=new Map();let pd0=0;
cv.addEventListener('pointerdown',e=>{if(state!='play')return;try{cv.setPointerCapture(e.pointerId)}catch(_){}pt.set(e.pointerId,[e.clientX,e.clientY]);camI=0;if(pt.size==2){const v=[...pt.values()];pd0=Math.hypot(v[0][0]-v[1][0],v[0][1]-v[1][1])}});
cv.addEventListener('pointermove',e=>{const p=pt.get(e.pointerId);if(!p)return;camI=0;if(pt.size==1){CY_-=(e.clientX-p[0])*.006*S.cs*(S.ix?-1:1);CP_=cl(CP_+(e.clientY-p[1])*.006*S.cs*(S.iy?-1:1),-.5,1.3)}
 p[0]=e.clientX;p[1]=e.clientY;if(pt.size==2){const v=[...pt.values()],d=Math.hypot(v[0][0]-v[1][0],v[0][1]-v[1][1]);if(pd0>0&&d>0)camZ=cl(camZ*pd0/d,.35,3.5);pd0=d}});
['pointerup','pointercancel'].forEach(n=>cv.addEventListener(n,e=>{pt.delete(e.pointerId);pd0=0}));
cv.addEventListener('wheel',e=>{e.preventDefault();camI=0;camZ=cl(camZ*(e.deltaY>0?1.1:.9),.35,3.5)},{passive:false});
$('pb').addEventListener('click',pause);
[['bc',camNext],['bv',camReset],['bt',autoToggle]].forEach(([id,fn])=>$(id).addEventListener('click',e=>{fn();e.currentTarget.blur()}));
['gesturestart','gesturechange','gestureend'].forEach(n=>document.addEventListener(n,e=>e.preventDefault(),{passive:false}));
document.addEventListener('touchmove',e=>{if(e.touches.length>1)e.preventDefault()},{passive:false});
let ltt=0;document.addEventListener('touchend',e=>{const n=Date.now();if(n-ltt<350&&!e.target.closest('#popup'))e.preventDefault();ltt=n},{passive:false});
['contextmenu','selectstart','dragstart'].forEach(n=>document.addEventListener(n,e=>e.preventDefault()));document.addEventListener('dblclick',e=>e.preventDefault());document.addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault()},{passive:false});
if('ontouchstart' in window||navigator.maxTouchPoints>0)document.body.classList.add('touch');
addEventListener('resize',apply);document.addEventListener('visibilitychange',()=>{if(document.hidden&&state=='play')pause()});
