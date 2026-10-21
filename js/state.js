'use strict';
/* ---------- state ---------- */
const P={},en={b:100,f:100,w:100,l:100},held={q:false},K={},ui={up:false,dn:false},J={x:0,y:0,id:null};
let state='menu',simT=0,frame=0;
const AC=[];for(let i=0;i<57;i++){const g=new THREE.Group();scene.add(g);AC.push({g,m:null,on:false,t:'car',s:0,lat:0,v:0,v0:0,len:4,w:2,hit:0,spin:0,dir:1,ph:Math.random()*6,park:false,base:0,cop:false})}
const COP=AC[56],PL={s:0,lat:0,w:1.9,len:4.3,v:0,on:false};
function setT(a,t){a.t=t;a.len=TY[t].len;a.w=TY[t].w;if(a.m)a.g.remove(a.m);const p=t=='car'?PR.car[Math.random()*5|0]:PR[t];a.m=p.clone();a.g.add(a.m)}
function respawn(a,init){let s0=P.s+(init?120:180)+Math.random()*(init?640:520);const jb=Math.floor(P.s/150)+1+Math.floor(Math.random()*4);
 if(!init&&inJam(jb*150)&&Math.random()<.6)s0=jb*150+Math.random()*150;
 const jam=inJam(s0),r=Math.random();let t='car',lat=LN[Math.random()*7|0],park=false;
 if(jam&&r<.85)t=r<.55?'car':r<.75?'moto':'bus';else if(r<.38)t='car';else if(r<.62)t='moto';else if(r<.72)t='bus';else if(r<.8)t='truck';else if(r<.89)t='ped';else{t='car';park=true;lat=26.25}
 if(t=='ped'&&Math.random()>=S.pd)t='car';if(t=='moto')lat=-27+Math.random()*54;if(t=='ped')lat=Math.random()<.5?-41:41;
 for(let tries=0;park&&tries<4&&Math.abs(s0-Math.round(s0/150)*150)<45;tries++)s0+=40;{const mm=((s0-75)%200+200)%200;if(park&&(mm<30||mm>170))s0+=60}
 for(let n=0;n<3;n++)if(AC.some(b=>b.on&&b!==a&&Math.abs(b.s-s0)<(b.len+TY[t].len)/2+5&&Math.abs(b.lat-lat)<3))s0+=16;
 setT(a,t);a.s=s0;a.lat=lat;a.park=park;a.hit=0;a.cop=false;a.dir=lat<0?1:-1;const T=TY[t];
 a.v0=park||t=='ped'?0:jam?2+Math.random()*2:T.v[0]+Math.random()*(T.v[1]-T.v[0]);a.v=a.v0;a.base=lat;a.on=true;a.g.visible=true}
function reset(){CSIDE=Math.random()<.5?1:-1;AP.lane=null;AP.sk=null;Object.assign(P,{x:cx(10),y:0,z:-10,th:rth(10),vf:0,vx:0,vz:0,vy:0,fl:0,fa:'x',fd:1,fly:false,wall:0,wt:1,wc:0,wd:1,ftg:6,chg:0,done:-1,cols:0,charges:0,tcol:[],shake:0,s:10,lat:0,pol:0,polT:0,polCd:0,polWhy:'',boost:false,roll:0,sa:0,lastHit:-9,lastCurb:-9,lastPot:-9,lastCop:-9,dc:0,inv:-1,dm:'',dd:0,prevS:10,pv:0,msg:''});
 en.b=en.f=en.w=en.l=100;simT=0;held.q=false;AC.forEach(a=>{a.on=false;a.g.visible=false});AC.slice(0,56).forEach(a=>respawn(a,true));chunks.forEach(c=>c.userData.i=-999);stream(10)}
const beep=()=>{};
/* ---------- messages ---------- */
let tT=0,bT=0;
function toast(m){$('toast').textContent=m;tT=2.2}
function crash(msg){if(simT-P.lastHit<2)return;P.lastHit=simT;P.cols++;if(S.vib&&navigator.vibrate)try{navigator.vibrate(80)}catch(e){}P.tcol.push(simT);toast(msg);beep(90,.2);$('flash').style.background='#f00';$('flash').style.opacity=.35;setTimeout(()=>$('flash').style.opacity=0,120);
 P.tcol=P.tcol.filter(t=>simT-t<60);if(P.tcol.length>=5)viol('Va chạm 5 lần trong 60 giây')}
function viol(why){if(P.pol||P.polCd>0)return;P.pol=1;P.polT=16;P.polWhy=why;COP.on=true;COP.cop=true;setT(COP,'cop');COP.s=Math.max(2,P.s-90);COP.lat=P.lat;COP.base=P.lat;COP.v=Math.max(P.vf,0)+10;COP.v0=COP.v;COP.hit=0;COP.park=false;COP.g.visible=true}
function relCop(){COP.cop=false;COP.park=false;COP.v0=15}
/* ---------- skills ---------- */
function detach(m){const w=P.wall||1;if(P.wt==2){const s0=P.wc*L,t=rth(s0),c=Math.cos(t),n=Math.sin(t),q=loc(P.wc),b=w*P.wd*6;P.x=cx(s0)+q[0]*c+b*n;P.z=-s0-q[0]*n+b*c}else P.x=cx(P.s)+w*43;P.wall=0;P.wt=1;toast(m)}
function xinfo(){const c0=Math.round(P.s/L);for(let cc=c0-1;cc<=c0+1;cc++)if(isInter(cc)){const q=loc(cc);if(Math.abs(q[0])>36&&Math.abs(q[1])<14)return{xc:cc,q}}return null}
function act(k){if(state!='play'||P.chg>0)return;
 if(k=='e'){if(P.fly){P.fly=false;toast('Hạ cánh có kiểm soát')}else if(en.f<=0)toast('Hết khí nén bay');else if(!P.wall){P.fly=true;P.ftg=Math.max(P.y,6)}}
 else if(k=='r'){if(P.wall)detach('Rời tường');else if(en.w<=0)toast('Hết bình bám tường');else{const xi=xinfo();if(xi){const t=rth(xi.xc*L),d=(-Math.sin(P.th)*Math.cos(t)+Math.cos(P.th)*Math.sin(t))>=0?1:-1;P.wt=2;P.wc=xi.xc;P.wd=d;P.wall=(xi.q[1]<0?-1:1)*d}else{P.wt=1;P.wall=P.lat<0?-1:1}P.fly=false;P.y=Math.max(P.y,1.5);P.vy=0}}
 else if(k=='f'){if(P.fl>0||P.wall)return;if(en.f<1){toast('Hết khí nén');return}en.f-=1;const c=ctl();let m=c.str!=0?'z':c.up>0?'u':c.thr!=0?'x':'',dir=m=='z'?Math.sign(c.str):1;
if(!m){let tg=null;for(const a of AC){if(!a.on||a.t=='ped'||a.cop)continue;const ds=a.s-P.s;if(ds>-6&&ds<28&&Math.abs(a.lat-P.lat)<5&&(!tg||ds<tg.s-P.s))tg=a}
 if(tg){m='z';dir=P.lat>=tg.lat?1:-1;if(Math.abs(P.lat+dir*18)>43)dir=-dir}else m='u'}
P.dm=m;P.fd=m=='x'?Math.sign(c.thr):m=='z'?dir:1;P.fa=m=='z'?'z':'x';P.dd=m=='z'?18/.88:m=='x'?22/.88:0;P.fl=.001;P.inv=simT+.88+S.iv;
if(m=='u'){if(P.fly)P.ftg=Math.min(34,P.ftg+8);else P.vy=17}else if(!P.fly&&P.y<.3)P.vy=5}}
