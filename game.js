'use strict';
const $=i=>document.getElementById(i),cl=(v,a,b)=>v<a?a:v>b?b:v,PI2=Math.PI*2;
let CSIDE=1;const ROUTE=9875,TL=900,L=25,NC=34,BACK=6,NF=400,NI=49,FI=395,CS=9875,STOP=21,LN=[-26.25,-18.75,-11.25,-3.75,3.75,11.25,18.75],LN8=LN.concat(26.25);
const cx=s=>120*Math.sin(s/900)+30*Math.sin(s/260+1);
const rth=s=>-Math.atan(120/900*Math.cos(s/900)+30/260*Math.cos(s/260+1));
const hs=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const S={vol:.6,gfx:1,sens:1,cam:0,diff:1,bs:1,bo:0,cs:1,ix:0,iy:0,fa:1,al:0,am:0,az:1,ac:0,ast:0,auto:0,vib:1,fps:0,td:1,pd:1,iv:1.5,tod:0,hint:1};try{Object.assign(S,JSON.parse(localStorage.getItem('hrr3d')||'{}'))}catch(e){}
const siteAt=i=>i>8&&i<395&&i%8>3&&i%8<7&&i%6!=0&&hs(i*3.7)<.1;
const potAt=i=>(i>3&&i%6!=0&&hs(i*5.1)<.07)?{x:LN[Math.floor(hs(i*9.3)*7)],o:(hs(i*2.2)-.5)*16}:null;
const marked=i=>i%6<3&&i>1&&i<NF&&i%8!=3,isInter=i=>i>0&&i<NF&&i%8==3,red=(i,t)=>((t+i*5.3)%30)>=22;
const inJam=s=>hs(Math.floor(s/150)*1.7)<.05;
const fmtC=t=>{t=Math.floor(7.5*3600+t);return[t/3600|0,(t/60|0)%60,t%60].map(v=>String(v).padStart(2,'0')).join(':')};
const fmtM=t=>{t=Math.max(0,Math.ceil(t));return String(t/60|0).padStart(2,'0')+':'+String(t%60).padStart(2,'0')};
/* ---------- renderer & scene ---------- */
const R=new THREE.WebGLRenderer({canvas:$('c'),antialias:false});
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(70,1,.3,900);
scene.background=new THREE.Color(0x9cc3e6);scene.fog=new THREE.Fog(0x9cc3e6,120,520);
const hemi=new THREE.HemisphereLight(0xffffff,0x667788,1.0);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff2dd,.9);sun.position.set(40,100,60);scene.add(sun);
const MC={},M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:c})),B=c=>new THREE.MeshBasicMaterial({color:c});
const UB=new THREE.BoxGeometry(1,1,1),CY=new THREE.CylinderGeometry(.5,.5,1,10).rotateZ(Math.PI/2),SP=new THREE.SphereGeometry(.5,7,5);
const bx=(w,h,d,m,x,y,z,p)=>{const o=new THREE.Mesh(UB,m);o.scale.set(w,h,d);o.position.set(x||0,y||0,z||0);p&&p.add(o);return o};
const wh=(r,w,m,x,y,z,p)=>{const o=new THREE.Mesh(CY,m);o.scale.set(w,r*2,r*2);o.position.set(x,y,z);p.add(o);return o};
const sp=(r,m,x,y,z,p)=>{const o=new THREE.Mesh(SP,m);o.scale.setScalar(r*2);o.position.set(x,y,z);p.add(o);return o};
const TIRE=M(0x111111),GLS=M(0x1d2b3a),V3=THREE.Vector3;
const gnd=bx(3000,1,3000,M(0x6b705c),0,-.6,0,scene);
function sgn(t,col,w){const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.fillStyle=col;x.fillRect(0,0,256,64);x.fillStyle='#fff';x.font='bold '+(w||34)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,128,34);return new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)})}
const SG=['PHỞ BÒ','CÀ PHÊ','TẠP HÓA','SỬA XE','NHÀ THUỐC','BÚN CHẢ'].map((n,i)=>sgn(n,['#c1121f','#1d3557','#2a9d8f','#e76f51','#2b9348','#7b2cbf'][i])),SGS=sgn('TRẠM SẠC ⚡','#0a7d4a',28),SGF=sgn('CÔNG TY','#1d3557',34);
/* ---------- vehicles ---------- */
const mkCar=c=>{const g=new THREE.Group();bx(1.8,.7,4.2,M(c),0,.65,0,g);bx(1.5,.6,2.2,GLS,0,1.3,.2,g);[[-.9,1.3],[.9,1.3],[-.9,-1.3],[.9,-1.3]].forEach(p=>wh(.35,.25,TIRE,p[0],.35,p[1],g));return g};
const mkMoto=()=>{const g=new THREE.Group();bx(.4,.5,1.7,M(0xb22222),0,.6,0,g);bx(.5,.8,.4,M(0x2a6f97),0,1.2,.1,g);sp(.22,M(0xffd60a),0,1.8,.1,g);wh(.33,.15,TIRE,0,.33,.7,g);wh(.33,.15,TIRE,0,.33,-.7,g);return g};
const mkBus=()=>{const g=new THREE.Group();bx(2.5,2.8,11,M(0x1fa34a),0,1.9,0,g);bx(2.55,.8,10,GLS,0,2.3,0,g);[-4,4].forEach(z=>[-1.2,1.2].forEach(x=>wh(.5,.3,TIRE,x,.5,z,g)));return g};
const mkTruck=()=>{const g=new THREE.Group();bx(2.4,2.4,5,M(0xe0e0e0),0,2,1,g);bx(2.4,1.8,1.8,M(0xd9822b),0,1.5,-2.4,g);[-2.3,0,2.3].forEach(z=>[-1.2,1.2].forEach(x=>wh(.5,.3,TIRE,x,.5,z,g)));return g};
const mkPed=()=>{const g=new THREE.Group();bx(.45,1,.3,M(0x3a7d44),0,.9,0,g);sp(.2,M(0xf1c27d),0,1.6,0,g);return g};
const mkCop=()=>{const g=mkCar(0xf5f5f5);bx(.7,.2,.3,B(0xff0000),-.4,1.7,0,g);bx(.7,.2,.3,B(0x0066ff),.4,1.7,0,g);return g};
const PR={car:[0xd0021b,0x1e90ff,0xf5a623,0xdddddd,0x222222].map(mkCar),moto:mkMoto(),bus:mkBus(),truck:mkTruck(),ped:mkPed(),cop:mkCop()};
const TY={moto:{len:1.9,w:.8,v:[13,20]},car:{len:4.2,w:1.8,v:[11,17]},bus:{len:11,w:2.5,v:[8,12]},truck:{len:7,w:2.4,v:[8,11]},ped:{len:.6,w:.6,v:[0,0]},cop:{len:4.2,w:1.8,v:[0,0]}};
/* ---------- Tesla Roadster Rocket ---------- */
const car=new THREE.Group(),body=new THREE.Group();car.rotation.order='YXZ';car.add(body);scene.add(car);
const ext=(pts,dep,bv,mat,x,y,z)=>{const sh=new THREE.Shape();pts.forEach((q,i)=>i?sh.lineTo(q[0],q[1]):sh.moveTo(q[0],q[1]));const g=new THREE.ExtrudeGeometry(sh,{depth:dep,bevelEnabled:true,bevelThickness:bv,bevelSize:bv,bevelSegments:3,steps:1});g.translate(0,0,-dep/2);g.rotateY(-Math.PI/2);const m=new THREE.Mesh(g,mat);m.position.set(x,y,z);body.add(m);return m};
{const RED=new THREE.MeshPhongMaterial({color:0xb5001c,shininess:110,specular:0xffb0b0}),DKM=M(0x111111),GRY=M(0x2a2a30),WHT=B(0xffffff),
 GL=new THREE.MeshPhongMaterial({color:0x0b1018,transparent:true,opacity:.55,shininess:140,specular:0xffffff}),
 tilt=(m,x)=>{m.rotation.x=x;return m};
 ext([[-2.35,.3],[-2.43,.5],[-2.2,.63],[-1.4,.77],[-.85,.85],[.2,.84],[1.2,.86],[1.9,.82],[2.35,.72],[2.38,.5],[2.3,.3],[1.5,.26],[-1.5,.26]],1.66,.12,RED,0,0,0);
 ext([[-.95,.83],[-.25,1.17],[.9,1.15],[1.55,.88],[1.55,.8],[-.95,.8]],1.2,.1,GL,0,0,0);
 [-.4,.4].forEach(x=>{bx(.5,.18,.5,DKM,x,.92,.35,body);bx(.46,.55,.14,DKM,x,1.12,.62,body);bx(.2,.16,.1,DKM,x,1.46,.64,body)});
 bx(.5,.05,.05,DKM,-.4,1.0,-.55,body);
 [-.6,.6].forEach(x=>{bx(.62,.045,.05,B(0xe6f6ff),x,.6,-2.36,body).rotation.y=x<0?.25:-.25;bx(.3,.05,.06,B(0xe6f6ff),x*.7,.55,-2.4,body);bx(.5,.1,.06,DKM,x,.56,-2.37,body)});
 bx(1.1,.1,.05,DKM,0,.4,-2.4,body);bx(.2,.03,.02,WHT,0,.64,-2.43,body);bx(.04,.12,.02,WHT,0,.58,-2.43,body);bx(1.9,.07,.5,DKM,0,.27,-2.2,body);
 [-1,1].forEach(s=>{bx(.08,.08,.18,DKM,s*1.0,.9,-.75,body);bx(.05,.12,2.2,GRY,s*.97,.3,0,body)});
 bx(1.4,.06,.04,B(0xff2222),0,.62,2.4,body);bx(1.7,.08,.4,DKM,0,.28,2.3,body);
 const wheel=(x,z)=>{const g=new THREE.Group();g.position.set(x,.36,z);car.add(g);wh(.36,.3,TIRE,0,0,0,g);wh(.27,.31,GRY,0,0,0,g);for(let k=0;k<5;k++){const sp=bx(.04,.52,.07,DKM,Math.sign(x)*.17,0,0,g);sp.rotation.x=k*Math.PI/5}bx(.05,.1,.12,B(0xd01020),Math.sign(x)*.18,-.1,.05,g)};
 [[-.95,1.4],[.95,1.4],[-.95,-1.4],[.95,-1.4]].forEach(p=>wheel(p[0],p[1]));
 const pod=new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,2.2,20).rotateX(Math.PI/2),M(0x0d0d10));pod.position.set(0,.98,2.0);body.add(pod);
 const nz=new THREE.Mesh(new THREE.CylinderGeometry(.34,.5,.55,20).rotateX(Math.PI/2),M(0x2a2a2e));nz.position.set(0,.98,3.2);body.add(nz);
 const tc=document.createElement('canvas');tc.width=256;tc.height=64;{const x=tc.getContext('2d');x.fillStyle='#fff';x.font='bold 40px sans-serif';x.textAlign='center';x.fillText('SPACEX',128,46)}
 const tm=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(tc),transparent:true});[-1,1].forEach(s=>{const t=new THREE.Mesh(new THREE.PlaneGeometry(1.3,.32),tm);t.position.set(s*.41,1.0,2.0);t.rotation.y=s*Math.PI/2;body.add(t)});
 bx(.05,.32,.7,DKM,0,1.5,1.5,body);bx(.7,.05,.4,DKM,0,1.64,1.45,body).rotation.x=-.1}
const FM=c=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false});
const flames=[[0,.98,3.45,.5],[-.5,.6,2.4,.2],[.5,.6,2.4,.2]].map(p=>{const f=new THREE.Mesh(new THREE.ConeGeometry(p[3],1,10).translate(0,.5,0).rotateX(Math.PI/2),FM(p[3]>.3?0xffb070:0x66ccff));f.position.set(p[0],p[1],p[2]);f.visible=false;body.add(f);return f});
const jets=[[-.8,-1.3],[.8,-1.3],[-.8,1.3],[.8,1.3]].map(p=>{const j=new THREE.Mesh(new THREE.ConeGeometry(.24,1.4,8).rotateX(Math.PI).translate(0,-.7,0),FM(0x9fdcff));j.position.set(p[0],.28,p[1]);j.visible=false;body.add(j);return j});
const sides=[];[-1,1].forEach(s=>[-1.2,1.2].forEach(z=>{const f=new THREE.Mesh(new THREE.ConeGeometry(.18,1,8).rotateZ(-Math.PI/2).translate(.5,0,0),FM(0xaee6ff));f.scale.x=s;f.position.set(s*1.0,.62,z);f.visible=false;body.add(f);sides.push(f)}));
const aura=new THREE.Mesh(new THREE.TorusGeometry(2.4,.07,6,24).rotateX(Math.PI/2),B(0x2ecc71));aura.position.y=.1;aura.visible=false;car.add(aura);
/* ---------- city chunks ---------- */
const pal=[0xe9c46a,0xf4a261,0xa8dadc,0xf2cc8f,0xcdb4db,0xb7e4c7,0xe5989b,0xdad7cd],ASP=M(0x3b3b40),LAMP=[B(0x22ff55),B(0xff2222)];
const mkTex=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'));return new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(c)})};
const ROADM=mkTex(512,128,x=>{const W=512/60;x.fillStyle='#3b3b40';x.fillRect(0,0,512,128);x.fillStyle='#fff';[-22.5,-15,-7.5,7.5,15,22.5].forEach(l=>{for(let y=4;y<128;y+=64)x.fillRect((l+30)*W-1,y,3,34)});x.fillRect(1.2*W,0,3,128);x.fillRect(58.8*W-3,0,3,128);x.fillStyle='#ffd60a';x.fillRect(30*W-5,0,3,128);x.fillRect(30*W+2,0,3,128)});
const CRM=mkTex(1024,64,x=>{x.fillStyle='#3b3b40';x.fillRect(0,0,1024,64);x.fillStyle='#fff';for(let k=0;k<1024;k+=48)x.fillRect(k,31,26,3);x.fillRect(0,3,1024,3);x.fillRect(0,58,1024,3)});
const FC={},WH=B(0xffffff),DK=M(0x222222),ROOF=M(0x8a8a8a),PARM=M(0xb0b0b0),BALM=M(0xcfcfcf),TKM=M(0x3b5b7a),AWC=[0xc1121f,0x1d3557,0x2a9d8f,0xe76f51,0x2b9348,0x7b2cbf];
function fac(ci,n){const k=ci*100+n;if(FC[k])return FC[k];const W=192,FH=48,c=document.createElement('canvas');c.width=W;c.height=FH*n;const x=c.getContext('2d');
 x.fillStyle='#'+pal[ci].toString(16).padStart(6,'0');x.fillRect(0,0,W,FH*n);
 for(let f=0;f<n;f++){const y=f*FH;x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,y,W,3);
  if(f==n-1){x.fillStyle='#262a31';x.fillRect(6,y+10,W-12,FH-10);x.fillStyle='#9ad3ee';x.fillRect(10,y+14,104,FH-14);x.fillStyle='#fff';x.fillRect(61,y+14,2,FH-14);x.fillStyle='#4a2f1d';x.fillRect(124,y+12,28,FH-12);x.fillStyle='#ffd24d';x.fillRect(146,y+30,3,3);x.fillStyle='#cfcfcf';x.fillRect(160,y+16,24,FH-16)}
  else for(let j=0;j<3;j++){const x0=16+j*58;x.fillStyle='#f4f1ea';x.fillRect(x0-3,y+8,46,34);x.fillStyle=hs(ci*31+f*7+j)<.3?'#ffe9a8':'#5f93b5';x.fillRect(x0,y+11,40,28);
   x.fillStyle='#f4f1ea';x.fillRect(x0+19,y+11,2,28);x.fillRect(x0,y+24,40,2);x.fillStyle='#777';x.fillRect(x0-5,y+42,50,3);
   if(hs(ci*13+f*5+j)<.2){x.fillStyle='#d8d8d8';x.fillRect(x0+6,y+31,26,10)}
   if(f%2==0){x.fillStyle='#444';for(let q=0;q<8;q++)x.fillRect(x0-5+q*6.5,y+36,1.5,8)}}}
 return FC[k]=new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(c)})}
function mkChunk(){const g=new THREE.Group(),u=g.userData;u.i=-999;
 bx(60,.1,L+1.2,ROADM,0,0,0,g);u.sw=[-1,1].map(s=>bx(15,.3,L+1.2,M(0x9a9a9a),s*37.5,.1,0,g));
 u.bd=[];[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(a=>{const sd=a[0],bg=new THREE.Group();bg.position.set(sd*63,0,a[1]*L/4);g.add(bg);
  u.bd.push({sd,bg,b:bx(34,1,L/2-.4,M(0xdddddd),0,0,0,bg),par:bx(34.6,1.2,L/2-.1,PARM,0,0,0,bg),aw:bx(2.6,.35,L/2-.7,M(0xc1121f),-sd*18.2,3.1,0,bg),tk:wh(1.5,3,TKM,sd*6,0,0,bg),ba:[0,1].map(()=>bx(1.6,.3,8,BALM,-sd*17.8,0,0,bg))})});
 u.sg=[0,1,2,3].map(k=>{const o=bx(9,2.4,.1,SG[0],(k<2?-1:1)*45.55,5.4,(k%2?1:-1)*L/4,g);o.rotation.y=Math.PI/2;return o});
 const pm=new THREE.MeshBasicMaterial({color:0x00e5ff,transparent:true,opacity:.4});u.pn=[-1,1].map(s=>bx(.15,24,L-1,pm,s*45.9,13,0,g));
 u.tr=[[40,-8],[40,4],[-40,8],[-40,-4]].map(p=>{const t=new THREE.Group();bx(.6,4,.6,M(0x5a3d2b),0,2,0,t);sp(2.4,M(0x2d6a4f),0,5.4,0,t);t.position.set(p[0],0,p[1]);g.add(t);return t});
 u.po=bx(3,.03,3,M(0x0d0d0d),0,.08,0,g);
 u.cr=bx(300,.11,24,CRM,0,0,0,g);u.xb=[];[-1,1].forEach(sx=>{const o=bx(2,20,26,M(0x666666),sx*142,10,0,g);o.userData.sx=sx;u.xb.push(o);[-1,1].forEach(sz=>{const hh=28.8,m=fac(3,8),w=M(0xcdb4db);u.xb.push(bx(56,hh,20,[w,w,w,w,sz>0?w:m,sz>0?m:w],sx*110,hh/2,sz*22,g))})});u.ix=new THREE.Group();g.add(u.ix);
 for(let k=0;k<20;k++)[-1,1].forEach(z=>bx(1.6,.03,5,WH,-28.5+k*3,.09,z*16.5,u.ix));bx(60,.03,.7,WH,0,.09,21.5,u.ix);
 u.lm=[];[-1,1].forEach(s=>{bx(.5,8,.5,DK,s*31.5,4,23,u.ix);bx(14,.35,.35,DK,s*24.5,7.6,23,u.ix);[26,14].forEach(xx=>{bx(1.2,2.8,1,DK,s*xx,6.1,23,u.ix);u.lm.push(bx(.8,.8,.2,LAMP[0],s*xx,6.5,23.55,u.ix))})});
 u.of=new THREE.Group();bx(.5,1,.4,M(0x1e3a8a),0,.9,0,u.of);sp(.22,M(0xf1c27d),0,1.6,0,u.of);bx(.12,.9,.12,M(0xffffff),.5,1.2,0,u.of).rotation.z=-.5;u.of.position.set(-33,.3,19);g.add(u.of);
 u.st=new THREE.Group();const RT=B(0xe31937),WP=M(0xf2f2f2),BK=M(0x15151a);
 bx(11.25,.06,14,M(0x30343c),24.4,.1,0,u.st);[-7,-3.5,0,3.5,7].forEach(z=>bx(11.25,.02,.15,WH,24.4,.14,z,u.st));bx(.2,.03,14,B(0x00ff88),18.8,.14,0,u.st);
 [-5.25,-1.75,1.75,5.25].forEach(z=>{bx(.4,2.2,.55,WP,30.6,1.1,z,u.st);bx(.42,.35,.57,BK,30.6,2.25,z,u.st);bx(.02,.12,.4,RT,30.38,2.0,z,u.st);bx(.02,.38,.1,RT,30.38,1.88,z,u.st);bx(.02,.28,.3,BK,30.38,1.3,z,u.st);bx(1.6,.05,.05,BK,29.8,.9,z+.1,u.st).rotation.z=-.3;bx(.12,.12,.18,BK,29.0,.65,z+.1,u.st)});
 bx(.7,10,.7,WP,32.5,5,-8,u.st);bx(.45,4.6,3.2,new THREE.MeshBasicMaterial({map:(()=>{const c=document.createElement('canvas');c.width=256;c.height=360;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,256,360);x.fillStyle='#e31937';x.fillRect(48,50,160,30);x.beginPath();x.moveTo(108,80);x.lineTo(148,80);x.lineTo(148,170);x.lineTo(108,170);x.fill();x.fillStyle='#222';x.font='bold 30px sans-serif';x.textAlign='center';x.fillText('SUPERCHARGER',128,240);x.font='22px sans-serif';x.fillText('TESLA · V4 · 250 kW',128,290);return new THREE.CanvasTexture(c)})()}),32.5,10.3,-8,u.st);
 g.add(u.st);
 u.si=new THREE.Group();[-11,11].forEach(z=>bx(20,.9,.4,M(0xff7a00),-19,.7,z,u.si));bx(7,3,9,M(0xf2c200),-19,1.6,0,u.si);bx(1.2,1.2,8,M(0xf2c200),-19,4,-3,u.si);[-6,-2,3,7].forEach(z=>bx(.8,1.2,.8,M(0xff5500),-8.4,.7,z,u.si));g.add(u.si);
 u.fn=new THREE.Group();bx(2.4,14,2.4,M(0xcccccc),120,7,-14,u.fn);bx(2.4,14,2.4,M(0xcccccc),120,7,14,u.fn);bx(2.4,3.6,32,SGF,120,15,0,u.fn);const cm=M(0x2d4a73);bx(40,90,80,[cm,fac(1,25),cm,cm,cm,cm],165,45,0,u.fn);g.add(u.fn);
 u.wl=bx(300,40,2,M(0x222222),0,20,0,g);scene.add(g);return g}
const chunks=[];for(let i=0;i<NC;i++)chunks.push(mkChunk());
function fill(g,i){const u=g.userData,s=i*L;u.i=i;g.visible=i>=-2&&i<=397;g.position.set(cx(s),0,-s);g.rotation.y=rth(s);const ix=isInter(i),ec=i==NF;
 u.bd.forEach((d,k)=>{const n=5+Math.floor(hs(i*4+k)*8),hh=n*3.6,ci=Math.floor(hs(i*7+k)*8),wm=M(pal[ci]),fm=fac(ci,n);
  d.b.scale.y=hh;d.b.position.y=hh/2;d.b.material=d.sd>0?[wm,fm,ROOF,wm,wm,wm]:[fm,wm,ROOF,wm,wm,wm];d.par.position.y=hh+.45;d.tk.position.y=hh+2.4;
  d.aw.material=M(AWC[Math.floor(hs(i*3+k)*6)]);d.ba[0].position.y=7.2;d.ba[1].position.y=14.4;d.bg.visible=!ix&&!ec});
 u.sg.forEach((o,k)=>{o.material=SG[Math.floor(hs(i+.3+k*.37)*6)];o.visible=!ix&&!ec});u.sw.forEach(o=>o.visible=!ix);
 const mk=!ix;u.pn.forEach(p=>p.visible=mk);u.tr.forEach(t=>t.visible=!ix&&!ec);u.cr.visible=u.ix.visible=ix;u.xb.forEach(o=>{const sx=o.userData.sx;o.visible=ix&&(i!=FI||(sx&&sx!=CSIDE))});u.of.visible=ix&&((i-3)/8)%3==0;
 const po=potAt(i);u.po.visible=!!po;if(po){u.po.position.x=po.x;u.po.position.z=-po.o}
 u.st.visible=i%6==0&&i>=6&&i<=NF-4;u.si.visible=siteAt(i);u.fn.visible=i==FI;u.fn.rotation.y=CSIDE>0?0:Math.PI;u.wl.visible=i==396}
function stream(s){const c=Math.round(s/L);for(let i=c-BACK;i<c-BACK+NC;i++){const g=chunks[((i%NC)+NC)%NC];if(g.userData.i!==i)fill(g,i)}}
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
 if(park&&Math.abs(s0-Math.round(s0/150)*150)<20)s0+=40;{const mm=((s0-75)%200+200)%200;if(park&&(mm<30||mm>170))s0+=60}
 for(let n=0;n<3;n++)if(AC.some(b=>b.on&&b!==a&&Math.abs(b.s-s0)<(b.len+TY[t].len)/2+5&&Math.abs(b.lat-lat)<3))s0+=16;
 setT(a,t);a.s=s0;a.lat=lat;a.park=park;a.hit=0;a.cop=false;a.dir=lat<0?1:-1;const T=TY[t];
 a.v0=park||t=='ped'?0:jam?2+Math.random()*2:T.v[0]+Math.random()*(T.v[1]-T.v[0]);a.v=a.v0;a.base=lat;a.on=true;a.g.visible=true}
function reset(){CSIDE=Math.random()<.5?1:-1;Object.assign(P,{x:cx(10),y:0,z:-10,th:rth(10),vf:0,vx:0,vz:0,vy:0,fl:0,fa:'x',fd:1,fly:false,wall:0,wt:1,wc:0,wd:1,ftg:6,chg:0,done:-1,cols:0,charges:0,tcol:[],shake:0,s:10,lat:0,pol:0,polT:0,polCd:0,polWhy:'',boost:false,roll:0,sa:0,lastHit:-9,lastCurb:-9,lastPot:-9,lastCop:-9,inv:-1,dm:'',dd:0,prevS:10,pv:0,msg:''});
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
if(m=='u'){if(P.fly)P.ftg=Math.min(34,P.ftg+8);else P.vy=17}e,y+16,24,FH-16)}
  else for(let j=0;j<3;j++){const x0=16+j*58;x.fillStyle='#f4f1ea';x.fillRect(x0-3,y+8,46,34);x.fillStyle=hs(ci*31+f*7+j)<.3?'#ffe9a8':'#5f93b5';x.fillRect(x0,y+11,40,28);
   x.fillStyle='#f4f1ea';x.fillRect(x0+19,y+11,2,28);x.fillRect(x0,y+24,40,2);x.fillStyle='#777';x.fillRect(x0-5,y+42,50,3);
   if(hs(ci*13+f*5+j)<.2){x.fillStyle='#d8d8d8';x.fillRect(x0+6,y+31,26,10)}
   if(f%2==0){x.fillStyle='#444';for(let q=0;q<8;q++)x.fillRect(x0-5+q*6.5,y+36,1.5,8)}}}
 return FC[k]=new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(c)})}
function mkChunk(){const g=new THREE.Group(),u=g.userData;u.i=-999;
 bx(60,.1,L+1.2,ROADM,0,0,0,g);u.sw=[-1,1].map(s=>bx(15,.3,L+1.2,M(0x9a9a9a),s*37.5,.1,0,g));
 u.bd=[];[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(a=>{const sd=a[0],bg=new THREE.Group();bg.position.set(sd*63,0,a[1]*L/4);g.add(bg);
  u.bd.push({sd,bg,b:bx(34,1,L/2-.4,M(0xdddddd),0,0,0,bg),par:bx(34.6,1.2,L/2-.1,PARM,0,0,0,bg),aw:bx(2.6,.35,L/2-.7,M(0xc1121f),-sd*18.2,3.1,0,bg),tk:wh(1.5,3,TKM,sd*6,0,0,bg),ba:[0,1].map(()=>bx(1.6,.3,8,BALM,-sd*17.8,0,0,bg))})});
 u.sg=[0,1,2,3].map(k=>{const o=bx(9,2.4,.1,SG[0],(k<2?-1:1)*45.55,5.4,(k%2?1:-1)*L/4,g);o.rotation.y=Math.PI/2;return o});
 const pm=new THREE.MeshBasicMaterial({color:0x00e5ff,transparent:true,opacity:.4});u.pn=[-1,1].map(s=>bx(.15,24,L-1,pm,s*45.9,13,0,g));
 u.tr=[[40,-8],[40,4],[-40,8],[-40,-4]].map(p=>{const t=new THREE.Group();bx(.6,4,.6,M(0x5a3d2b),0,2,0,t);sp(2.4,M(0x2d6a4f),0,5.4,0,t);t.position.set(p[0],0,p[1]);g.add(t);return t});
 u.po=bx(3,.03,3,M(0x0d0d0d),0,.08,0,g);
 u.cr=bx(300,.11,24,CRM,0,0,0,g);u.xb=[];[-1,1].forEach(sx=>{const o=bx(2,20,26,M(0x666666),sx*142,10,0,g);o.userData.sx=sx;u.xb.push(o);[-1,1].forEach(sz=>{const hh=28.8,m=fac(3,8),w=M(0xcdb4db);u.xb.push(bx(56,hh,20,[w,w,w,w,sz>0?w:m,sz>0?m:w],sx*110,hh/2,sz*22,g))})});u.ix=new THREE.Group();g.add(u.ix);
 for(let k=0;k<20;k++)[-1,1].forEach(z=>bx(1.6,.03,5,WH,-28.5+k*3,.09,z*16.5,u.ix));bx(60,.03,.7,WH,0,.09,21.5,u.ix);
 u.lm=[];[-1,1].forEach(s=>{bx(.5,8,.5,DK,s*31.5,4,23,u.ix);bx(14,.35,.35,DK,s*24.5,7.6,23,u.ix);[26,14].forEach(xx=>{bx(1.2,2.8,1,DK,s*xx,6.1,23,u.ix);u.lm.push(bx(.8,.8,.2,LAMP[0],s*xx,6.5,23.55,u.ix))})});
 u.of=new THREE.Group();bx(.5,1,.4,M(0x1e3a8a),0,.9,0,u.of);sp(.22,M(0xf1c27d),0,1.6,0,u.of);bx(.12,.9,.12,M(0xffffff),.5,1.2,0,u.of).rotation.z=-.5;u.of.position.set(-33,.3,19);g.add(u.of);
 u.st=new THREE.Group();const RT=B(0xe31937),WP=M(0xf2f2f2),BK=M(0x15151a);
 bx(11.25,.06,14,M(0x30343c),24.4,.1,0,u.st);[-7,-3.5,0,3.5,7].forEach(z=>bx(11.25,.02,.15,WH,24.4,.14,z,u.st));bx(.2,.03,14,B(0x00ff88),18.8,.14,0,u.st);
 [-5.25,-1.75,1.75,5.25].forEach(z=>{bx(.4,2.2,.55,WP,30.6,1.1,z,u.st);bx(.42,.35,.57,BK,30.6,2.25,z,u.st);bx(.02,.12,.4,RT,30.38,2.0,z,u.st);bx(.02,.38,.1,RT,30.38,1.88,z,u.st);bx(.02,.28,.3,BK,30.38,1.3,z,u.st);bx(1.6,.05,.05,BK,29.8,.9,z+.1,u.st).rotation.z=-.3;bx(.12,.12,.18,BK,29.0,.65,z+.1,u.st)});
 bx(.7,10,.7,WP,32.5,5,-8,u.st);bx(.45,4.6,3.2,new THREE.MeshBasicMaterial({map:(()=>{const c=document.createElement('canvas');c.width=256;c.height=360;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,256,360);x.fillStyle='#e31937';x.fillRect(48,50,160,30);x.beginPath();x.moveTo(108,80);x.lineTo(148,80);x.lineTo(148,170);x.lineTo(108,170);x.fill();x.fillStyle='#222';x.font='bold 30px sans-serif';x.textAlign='center';x.fillText('SUPERCHARGER',128,240);x.font='22px sans-serif';x.fillText('TESLA · V4 · 250 kW',128,290);return new THREE.CanvasTexture(c)})()}),32.5,10.3,-8,u.st);
 g.add(u.st);
 u.si=new THREE.Group();[-11,11].forEach(z=>bx(20,.9,.4,M(0xff7a00),-19,.7,z,u.si));bx(7,3,9,M(0xf2c200),-19,1.6,0,u.si);bx(1.2,1.2,8,M(0xf2c200),-19,4,-3,u.si);[-6,-2,3,7].forEach(z=>bx(.8,1.2,.8,M(0xff5500),-8.4,.7,z,u.si));g.add(u.si);
 u.fn=new THREE.Group();bx(2.4,14,2.4,M(0xcccccc),120,7,-14,u.fn);bx(2.4,14,2.4,M(0xcccccc),120,7,14,u.fn);bx(2.4,3.6,32,SGF,120,15,0,u.fn);const cm=M(0x2d4a73);bx(40,90,80,[cm,fac(1,25),cm,cm,cm,cm],165,45,0,u.fn);g.add(u.fn);
 u.wl=bx(300,40,2,M(0x222222),0,20,0,g);scene.add(g);return g}
const chunks=[];for(let i=0;i<NC;i++)chunks.push(mkChunk());
function fill(g,i){const u=g.userData,s=i*L;u.i=i;g.visible=i>=-2&&i<=397;g.position.set(cx(s),0,-s);g.rotation.y=rth(s);const ix=isInter(i),ec=i==NF;
 u.bd.forEach((d,k)=>{const n=5+Math.floor(hs(i*4+k)*8),hh=n*3.6,ci=Math.floor(hs(i*7+k)*8),wm=M(pal[ci]),fm=fac(ci,n);
  d.b.scale.y=hh;d.b.position.y=hh/2;d.b.material=d.sd>0?[wm,fm,ROOF,wm,wm,wm]:[fm,wm,ROOF,wm,wm,wm];d.par.position.y=hh+.45;d.tk.position.y=hh+2.4;
  d.aw.material=M(AWC[Math.floor(hs(i*3+k)*6)]);d.ba[0].position.y=7.2;d.ba[1].position.y=14.4;d.bg.visible=!ix&&!ec});
 u.sg.forEach((o,k)=>{o.material=SG[Math.floor(hs(i+.3+k*.37)*6)];o.visible=!ix&&!ec});u.sw.forEach(o=>o.visible=!ix);
 const mk=!ix;u.pn.forEach(p=>p.visible=mk);u.tr.forEach(t=>t.visible=!ix&&!ec);u.cr.visible=u.ix.visible=ix;u.xb.forEach(o=>{const sx=o.userData.sx;o.visible=ix&&(i!=FI||(sx&&sx!=CSIDE))});u.of.visible=ix&&((i-3)/8)%3==0;
 const po=potAt(i);u.po.visible=!!po;if(po){u.po.position.x=po.x;u.po.position.z=-po.o}
 u.st.visible=i%6==0&&i>=6&&i<=NF-4;u.si.visible=siteAt(i);u.fn.visible=i==FI;u.fn.rotation.y=CSIDE>0?0:Math.PI;u.wl.visible=i==396}
function stream(s){const c=Math.round(s/L);for(let i=c-BACK;i<c-BACK+NC;i++){const g=chunks[((i%NC)+NC)%NC];if(g.userData.i!==i)fill(g,i)}}
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
 if(park&&Math.abs(s0-Math.round(s0/150)*150)<20)s0+=40;{const mm=((s0-75)%200+200)%200;if(park&&(mm<30||mm>170))s0+=60}
 for(let n=0;n<3;n++)if(AC.some(b=>b.on&&b!==a&&Math.abs(b.s-s0)<(b.len+TY[t].len)/2+5&&Math.abs(b.lat-lat)<3))s0+=16;
 setT(a,t);a.s=s0;a.lat=lat;a.park=park;a.hit=0;a.cop=false;a.dir=lat<0?1:-1;const T=TY[t];
 a.v0=park||t=='ped'?0:jam?2+Math.random()*2:T.v[0]+Math.random()*(T.v[1]-T.v[0]);a.v=a.v0;a.base=lat;a.on=true;a.g.visible=true}
function reset(){CSIDE=Math.random()<.5?1:-1;Object.assign(P,{x:cx(10),y:0,z:-10,th:rth(10),vf:0,vx:0,vz:0,vy:0,fl:0,fa:'x',fd:1,fly:false,wall:0,wt:1,wc:0,wd:1,ftg:6,chg:0,done:-1,cols:0,charges:0,tcol:[],shake:0,s:10,lat:0,pol:0,polT:0,polCd:0,polWhy:'',boost:false,roll:0,sa:0,lastHit:-9,lastCurb:-9,lastPot:-9,lastCop:-9,inv:-1,dm:'',dd:0,prevS:10,pv:0,msg:''});
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
/* ---------- physics & game ---------- */
function ctl(){const k=K;let thr=(k.KeyW||k.ArrowUp?1:0)-(k.KeyS||k.ArrowDown?1:0)-J.y,str=(k.KeyD||k.ArrowRight?1:0)-(k.KeyA||k.ArrowLeft?1:0)+J.x;if(S.auto&&thr==0)thr=1;
 return{thr:cl(thr,-1,1),str:cl(str,-1,1),up:(k.Space||ui.up)?1:0,dn:(k.ShiftLeft||ui.dn)?1:0}}
const loc=ci=>{const s0=ci*L,t=rth(s0),c=Math.cos(t),n=Math.sin(t),dx=P.x-cx(s0),dz=P.z+s0;return[dx*c-dz*n,dx*n+dz*c]};
const OB={};function obs(ci){if(OB[ci])return OB[ci];const o=[],s0=ci*L,t=rth(s0),c=Math.cos(t),n=Math.sin(t);
 const add=(x,z,r)=>{const X=cx(s0)+x*c+z*n,s=s0+x*n-z*c;o.push([X-cx(s),s,r])};
 if(ci>=0&&ci<=NF){if(isInter(ci)){add(-31.5,23,.7);add(31.5,23,.7)}else{if(ci<NF)[[40,-8],[40,4],[-40,8],[-40,-4]].forEach(p=>add(p[0],p[1],1.1));if(ci%6==0&&ci>=6&&ci<=NF-4)add(32.5,0,.7)}}
 return OB[ci]=o}
function hitCheck(lat){if(P.fl>0||simT<P.inv)return;const ci=Math.round(P.s/L);
 if(siteAt(ci)&&lat<-8&&P.y<1.6){P.x=cx(P.s)-8;P.vf*=.5;P.vx*=.5;P.shake=.6;crash('Va vào rào công trường')}
 const po=potAt(ci);if(po&&P.y<.4&&Math.abs(P.s-(ci*L+po.o))<1.8&&Math.abs(lat-po.x)<2.2&&simT-P.lastPot>1){P.lastPot=simT;P.vf*=.75;P.vy=4;P.shake=.5;toast('Ổ gà!')}
 if(P.y<5)for(let c2=ci-1;c2<=ci+1;c2++)for(const o of obs(c2)){const ds=P.s-o[1],dl=lat-o[0],hx=1.8+o[2],hy=.7+o[2],ax=hx-Math.abs(ds),ay=hy-Math.abs(dl);
  if(ax>0&&ay>0){if(ax/hx<ay/hy)P.z=-(o[1]+(ds<0?-1:1)*(hx+.05));else P.x=cx(P.s)+o[0]+(dl<0?-1:1)*(hy+.05);P.vf*=.3;P.vx*=.3;P.vz*=.3;P.shake=.7;crash(o[2]>1?'Đâm vào cây!':'Đâm vào cột!')}}
 if(P.y>2.6)return;
 for(const a of AC){if(!a.on)continue;const ds=P.s-a.s,dl=lat-a.lat,hl=(a.len+3.4)/2+(a.hit>0?.5:0);if(Math.abs(ds)<hl&&Math.abs(dl)<(a.w+1.4)/2+(a.hit>0?.4:0)){
  const rv=P.vf-a.v;P.z=ds<0?-(a.s-hl-.05):-(a.s+hl+.05);
  P.vf=ds<0?Math.min(P.vf,a.v)*.4:Math.max(P.vf,a.v);P.vx*=.4;P.vz*=.4;
  if(a.cop){if(simT-P.lastCop>3&&(ds>0?rv<-2:rv>2)){P.lastCop=simT;simT+=20;P.shake=1;toast('Tông xe cảnh sát: phạt +20 giây')}continue}
  if(a.hit>0)continue;
  const dd=lat-a.lat;a.hit=1.6;a.spin=(Math.random()<.5?-1:1)*(2+Math.abs(rv)*.05);a.v=Math.max(a.v,0)+Math.min(Math.abs(rv)*.4,40);a.lat-=Math.sign(dd||1)*1.2;
  P.shake=Math.min(1,.2+Math.abs(rv)/20);crash(a.t=='ped'?'Đâm người đi bộ!':'Va chạm!');if(a.t=='ped')viol('Va chạm người đi bộ')}}}
function update(dt){simT+=dt;if(simT>=TL){end(false);return}
 const k=ctl(),ch=P.chg>0;let thr=ch?0:k.thr,str=ch?0:k.str,ab=false;
 if(S.ast>=1&&!ch&&!P.fly&&!P.wall&&P.fl<=0&&simT>=P.inv&&P.y<2.6&&P.vf>3){for(const a of AC){if(!a.on||a.t=='ped')continue;const ds=a.s-P.s;if(ds>0&&ds<5+P.vf*.9&&Math.abs(a.lat-P.lat)<(a.w+1.5)/2+.4&&P.vf>a.v+1){thr=-1;ab=true;break}}}
 if(S.ast>=2&&!P.wall&&!P.fly&&Math.abs(P.lat)>38&&!xinfo())P.x-=Math.sign(P.lat)*6*dt;
 P.boost=held.q&&en.b>0&&!ch&&!P.wall&&!ab;if(P.boost)en.b=Math.max(0,en.b-.2*dt);
 if(P.fly){en.f=Math.max(0,en.f-dt/3);if(en.f<=0){P.fly=false;toast('Hết khí nén: hạ cánh an toàn')}}
 if(P.wall){en.w=Math.max(0,en.w-dt/10);if(en.w<=0)detach('Hết bình bám tường: hạ xuống an toàn');}
 const vmax=25;const pv=P.vf;
 if(ch){P.vf=0;P.vx=P.vz=0}else if(P.boost)P.vf=Math.min(70,P.vf+45*dt);
 else{if(thr>0&&P.vf<vmax)P.vf=Math.min(vmax,P.vf+(14-.4*Math.max(P.vf,0))*thr*dt);
  else if(thr<0){if(P.vf>.5)P.vf=Math.max(0,P.vf+38*thr*dt);else P.vf=Math.max(-9,P.vf+9*thr*dt)}
  else if(thr==0){const d=(3+.002*P.vf*P.vf)*dt;P.vf=P.vf>0?Math.max(0,P.vf-d):Math.min(0,P.vf+d)}
  if(P.vf>vmax)P.vf=Math.max(vmax,P.vf-70*dt)}
 const sp0=Math.abs(P.vf);
 if(P.wall){let d=(P.wt==2?rth(P.wc*L)-P.wd*Math.PI/2:rth(P.s))-P.th;P.th+=Math.atan2(Math.sin(d),Math.cos(d))*Math.min(1,6*dt);P.y=cl(P.y+str*P.wall*12*dt,1.3,40);P.vy=0}
 else if(!ch){P.ss=(P.ss||0)+(str-(P.ss||0))*Math.min(1,10*dt);const yr=P.ss*S.sens*2.6/(1+Math.min(sp0,60)/45)*Math.min(1,sp0/4)*Math.min(1,50/Math.max(sp0,1))*(P.vf<0?-1:1);P.th-=yr*dt;
  if(S.al&&str==0&&sp0>8&&!xinfo()){const d=rth(P.s)-P.th,dd=Math.atan2(Math.sin(d),Math.cos(d));P.th+=dd*Math.min(1,(Math.abs(dd)<.35?1.5:.4)*dt)}}
 if(S.fa&&!P.wall&&!ch&&Math.abs(CY_)>.02&&sp0>1&&!pt.size){const dc=CY_*Math.min(1,4*dt);P.th+=dc;CY_-=dc}
 const gr=P.fly?5:P.wall?20:11,tx=-Math.sin(P.th)*P.vf,tz=-Math.cos(P.th)*P.vf,k2=1-Math.exp(-gr*dt);if(!ch){P.vx+=(tx-P.vx)*k2;P.vz+=(tz-P.vz)*k2}
 if(P.fl>0){P.fl+=dt;if(P.fl>=.88)P.fl=0;const sp=P.dd*dt;if(P.dm=='z'){P.x+=Math.cos(P.th)*sp*P.fd;P.z-=Math.sin(P.th)*sp*P.fd}else if(P.dm=='x'){P.x-=Math.sin(P.th)*sp*P.fd;P.z-=Math.cos(P.th)*sp*P.fd}}
 if(P.wall){}else if(P.fly){P.ftg=cl(P.ftg+(k.up-k.dn)*12*dt,2.5,34);P.y+=(P.ftg-P.y)*Math.min(1,3*dt);P.vy=0}
 else{P.vy-=25*dt;if(P.vy<-8&&P.fl<=0)P.vy=-8}
 const ns=Math.min(40,Math.ceil(Math.hypot(P.vx,P.vz)*dt/1.2)||1),h=dt/ns;P.prevS=P.s;
 for(let q=0;q<ns;q++){P.x+=P.vx*h;P.z+=P.vz*h;if(!P.fly&&!P.wall){P.y+=P.vy*h;if(P.y<=0){if(P.vy<-6)P.shake=.3;P.y=0;if(P.vy<0)P.vy=0}}
  P.s=-P.z;let xq=null,xc=0;{const c0=Math.round(P.s/L);for(let cc=c0-1;cc<=c0+1;cc++)if(isInter(cc)){const q1=loc(cc);if(Math.abs(q1[0])>36&&Math.abs(q1[1])<14){xq=q1;xc=cc}}}
  if(xq){const s0=xc*L,t=rth(s0),c=Math.cos(t),n=Math.sin(t),a=cl(xq[0],-138,138),b=cl(xq[1],-11.5,11.5);if(a!=xq[0]||b!=xq[1]){P.x=cx(s0)+a*c+b*n;P.z=-s0-a*n+b*c;P.vx*=.5;P.vz*=.5}P.s=-P.z}else if(P.s>CS+14){P.s=CS+14;P.z=-P.s}
  if(P.s<2){P.s=2;P.z=-2}
  let lat=P.x-cx(P.s);if(P.wall){if(P.wt==2){const s0=P.wc*L,t=rth(s0),c=Math.cos(t),n=Math.sin(t),q2=loc(P.wc),a=cl(q2[0],-138,138),b=P.wall*P.wd*11.2;P.x=cx(s0)+a*c+b*n;P.z=-s0-a*n+b*c;P.s=-P.z;lat=P.x-cx(P.s)}else{lat=P.wall*45.2/Math.cos(rth(P.s));P.x=cx(P.s)+lat}}else if(!xq&&(lat<-44||lat>44)){lat=cl(lat,-44,44);P.x=cx(P.s)+lat;if(simT-P.lastCurb>.25){P.lastCurb=simT;P.vx*=.5;P.vf*=Math.abs(P.vf)>60?.9:.85;P.shake=Math.max(P.shake,.3)}else{P.vx=0}}
  if(!P.wall)hitCheck(lat);
  if(xq&&xc==FI&&CSIDE*xq[0]>112&&P.y<8&&!P.wall){end(true);return}}
 P.s=-P.z;P.lat=P.x-cx(P.s);
 const rk=Math.round((P.s+STOP-75)/200),ls=rk*200+75-STOP;if(rk>=0&&rk<=NI&&P.prevS<ls&&P.s>=ls&&red(8*rk+3,simT)&&P.y<3&&P.vf>6)viol('Vượt đèn đỏ');
 const sk=Math.round(P.s/150);let inz=false;if(sk>=1&&sk<=66&&P.y<1&&!P.fly&&!P.wall){const q=loc(sk*6);inz=Math.abs(q[1])<8&&q[0]>18&&q[0]<30.8}
 if(P.done>=0&&Math.abs(P.s-P.done*150)>40)P.done=-1;
 if(P.chg>0){if(!inz){P.chg=0;toast('Sạc bị hủy: rời vùng sạc')}else{P.chg-=dt;if(P.chg<=0){P.chg=0;en.b=en.f=en.w=en.l=100;P.charges++;P.done=sk;toast('Sạc đầy 3 bình!');beep(900,.3)}}}
 else if(inz&&P.done!=sk&&Math.abs(P.vf)<3&&Math.hypot(P.vx,P.vz)<3.5){P.chg=30;P.boost=false;beep(700,.2)}
 if(P.pol==1){P.polT-=dt;if(Math.abs(P.vf)<1.5&&Math.abs(COP.s-P.s)<30){P.pol=2;P.polT=5}else if(P.polT<=0){simT+=30;toast('Không dừng xe: phạt +30 giây');P.pol=0;P.polCd=60;relCop()}}
 else if(P.pol==2){P.polT-=dt;if(Math.abs(P.vf)>6){simT+=30;toast('Bỏ chạy khi đang kiểm tra: phạt +30 giây');P.pol=0;P.polCd=60;relCop()}else if(P.polT<=0){P.pol=0;P.polCd=60;toast('Kiểm tra xong: chỉ nhắc nhở, đi tiếp');relCop()}}
 P.polCd-=dt;
 traffic(dt);
 P.sa+=((-(P.vf-pv)/Math.max(dt,.001)*.002)-P.sa)*Math.min(1,8*dt);P.shake=Math.max(0,P.shake-dt*2);
 P.roll+=(P.wall*Math.PI/2-P.roll)*Math.min(1,6*dt);P.str=str}
function traffic(dt){const n=Math.min(54,Math.max(4,Math.round([18,28,38][S.diff]*S.td)));PL.s=P.s;PL.lat=P.lat;PL.v=P.vf;PL.on=!P.fly&&P.y<2.6&&!P.wall;const all=AC.concat(PL);
 for(let i=0;i<56;i++){const a=AC[i];if(i>=n){a.on=false;a.g.visible=false;continue}if(!a.on){respawn(a)}}
 for(const a of AC){if(!a.on)continue;
  if(a.hit>0){a.hit-=dt;a.g.rotation.y+=a.spin*dt;a.v*=Math.max(0,1-dt*.8)}
  else if(a.t=='ped'){const sd=a.base>0?1:-1;a.lat+=a.dir*1.8*dt;if(Math.abs(a.lat)<=27)a.dir=sd;else if(Math.abs(a.lat)>=41)a.dir=-sd}
  else{if(a.cop){a.v0=Math.max(P.vf+14,10);a.base=LN8.reduce((m,l)=>Math.abs(l-P.lat)<Math.abs(m-P.lat)?l:m,LN8[0]);if(a.s<P.s-250){a.s=P.s-100;a.v=Math.max(P.vf,5)}}let tv=a.v0;if(!a.park){
    for(const b of all){if(b===a||!b.on||b.s<=a.s||Math.abs(b.lat-a.lat)>(a.w+b.w)/2+.4||b.t=='ped')continue;const gap=b.s-b.len/2-(a.s+a.len/2);if(gap<10+a.v*1.5)tv=Math.min(tv,Math.max(0,(gap-3)*.7))}
    const k=Math.round((a.s+STOP-75)/200);if(k>=0&&k<=NI&&red(8*k+3,simT)){const d=(k*200+75-STOP)-(a.s+a.len/2);if(d>-.5&&d<25+a.v*1.5)tv=Math.min(tv,Math.max(0,d-2)*.6)}
    if(siteAt(Math.round((a.s+30)/L))&&a.base<-8)a.base=-3.75;
    a.v+=cl(tv-a.v,-9*dt,(a.cop?12:3)*dt);const tl=a.t=='moto'?a.base+Math.sin(simT*.7+a.ph)*1.2:a.base;a.lat+=cl(tl-a.lat,-2*dt,2*dt)}}
  a.s+=a.v*dt;a.g.position.set(cx(a.s)+a.lat,0,-a.s);if(a.hit<=0)a.g.rotation.y=rth(a.s);
  if(a.cop&&a.m.children.length>2){const t=Math.floor(simT*4)%2;a.m.children[a.m.children.length-2].visible=t==0;a.m.children[a.m.children.length-1].visible=t==1}
  if(!a.cop&&(a.s<P.s-150||a.s>P.s+900)){if(a===COP){a.on=false;a.g.visible=false}else respawn(a)}}}
/* ---------- camera, HUD ---------- */
const UP=new V3(),FW=new V3(),LK=new V3(),Y=new V3(0,1,0);
const RT=new V3(),OF=new V3();let CY_=0,CP_=0,camZ=1,camI=0;
function updCam(){UP.set(-Math.sin(P.roll),Math.cos(P.roll),0).applyAxisAngle(Y,P.th);FW.set(-Math.sin(P.th),0,-Math.cos(P.th));RT.crossVectors(FW,UP).normalize();
car.visible=!(simT<P.inv&&P.fl<=0&&Math.floor(simT*12)%2);car.position.set(P.x,P.y,P.z);car.rotation.set(P.fl>0&&P.fa=='x'?-P.fd*P.fl/.88*PI2:0,P.th,P.roll+(P.fl>0&&P.fa=='z'?-P.fd*P.fl/.88*PI2:0));body.rotation.x=P.sa;body.rotation.z=-(P.str||0)*.06*Math.min(1,Math.abs(P.vf)/20);
flames.forEach(f=>{f.visible=P.boost||(P.fl>0&&P.fa=='x');f.scale.z=(P.boost?2.6:1)+Math.random()*2.5;f.scale.x=f.scale.y=P.boost?1.4:.8});jets.forEach(j=>{j.visible=P.fly||P.wall!=0;j.scale.y=.8+Math.random()*.5});sides.forEach(f=>{f.visible=P.fl>0&&P.fa=='z';f.scale.y=f.scale.z=.8+Math.random()*.5});aura.visible=P.chg>0;aura.rotation.y+=.05;
let cp;const m=S.cam,pp=new V3(P.x,P.y,P.z);
if(m==1){cp=pp.clone().addScaledVector(UP,1.15).addScaledVector(FW,-.1);LK.copy(FW).applyAxisAngle(UP,CY_).applyAxisAngle(RT,-CP_).multiplyScalar(30).add(cp)}
else{const fr=m==3,bk=m==2?13:7+Math.min(Math.max(P.vf,0),150)*.04,hh=m==2?5.5:2.6;
 OF.set(0,0,0).addScaledVector(FW,fr?bk*.8:-bk).addScaledVector(UP,fr?2.2:hh).multiplyScalar(camZ).applyAxisAngle(UP,CY_).applyAxisAngle(RT,-CP_);
 cp=pp.clone().add(OF);LK.copy(pp).addScaledVector(FW,fr?0:9*Math.max(0,1-Math.abs(CY_)-Math.abs(CP_))).addScaledVector(UP,1)}
if(P.shake>0)cp.add(new V3((Math.random()-.5)*P.shake,(Math.random()-.5)*P.shake,0));if(cp.y<.6)cp.y=.6;
cam.position.copy(cp);cam.up.lerp(UP,.2).normalize();cam.lookAt(LK);const fv=cl((70+Math.min(Math.max(P.vf,0),70)/70*22)*(m==1?camZ:1),22,115);if(Math.abs(cam.fov-fv)>.3){cam.fov=fv;cam.updateProjectionMatrix()}
$('aim').style.display=state=='play'?'block':'none';
gnd.position.set(P.x,-.6,P.z)}
const bn=[['Q BOOST','b'],['E BAY + F LỘN','f'],['R TƯỜNG','w']];
$('bars').innerHTML=bn.map(([n,k])=>`<div class="t"><span>${n}</span><span id="v${k}">100</span></div><div class="bar stb"><i id="b${k}"></i></div>`).join('');
const mmc=$('mm').getContext('2d');
function mini(){const w=120,h=150,g=mmc,sp0=P.s,c0=cx(sp0),X=s=>w/2+cl((cx(s)-c0)*.5,-52,52),Yy=s=>h-18-(s-sp0)*.19;g.clearRect(0,0,w,h);
 g.strokeStyle='#7ab8ff';g.lineWidth=6;g.beginPath();for(let s=Math.max(0,sp0-60);s<=Math.min(ROUTE+40,sp0+680);s+=20){const x=X(s),y=Yy(s);s==Math.max(0,sp0-60)?g.moveTo(x,y):g.lineTo(x,y)}g.stroke();
 g.fillStyle='#2ecc71';for(let j=Math.max(1,Math.ceil((sp0-60)/150));j<=66&&j*150<sp0+680;j++)g.fillRect(X(j*150)-3,Yy(j*150)-3,6,6);
 g.fillStyle='#ff5555';AC.forEach(a=>{if(a.on&&a.t!='ped'&&a.s>sp0-60&&a.s<sp0+680)g.fillRect(X(a.s)+a.lat*.12-1.5,Yy(a.s)-1.5,3,3)});
 if(ROUTE<sp0+680){g.fillStyle='#ffd700';g.fillRect(X(ROUTE)-7,Yy(ROUTE)-4,14,8)}
 g.fillStyle='#fff';g.beginPath();g.moveTo(w/2,Yy(sp0)-7);g.lineTo(w/2-5,Yy(sp0)+5);g.lineTo(w/2+5,Yy(sp0)+5);g.fill()}
function hud(){const rem=TL-simT,d=rth(P.s+120)-rth(P.s);
 $('clk').textContent='🕒 '+fmtC(simT)+' / hạn 07:45';$('left').textContent='CÒN '+fmtM(rem);$('spd').textContent=Math.round(Math.abs(P.vf)*3.6)+' km/h';{const q=loc(FI),dd=P.s<CS-12?(CS-P.s)+112:Math.max(0,112-CSIDE*q[0]);$('dst').textContent='ĐẾN CÔNG TY: '+(dd/1000).toFixed(2)+' km'};
 ['b','f','w'].forEach(k=>{$('v'+k).textContent=Math.ceil(en[k]);$('b'+k).style.transform='scaleX('+en[k]/100+')'});
 const st=[];if(P.boost)st.push('BOOST');if(P.fly)st.push('BAY');if(P.wall)st.push('BÁM TƯỜNG');if(P.fl>0)st.push('LỘN VÒNG');else if(simT<P.inv)st.push('MIỄN ĐÂM');if(P.chg>0)st.push('ĐANG SẠC');if(P.pol)st.push('CẢNH SÁT');
 $('stat').innerHTML=st.map(t=>`<span class="badge g">${t}</span>`).join('');
 $('nav').textContent=S.hint&&P.s>CS-400&&P.s<CS+14?(P.s<CS-12?(CSIDE>0?'↱ Rẽ PHẢI ':'↰ Rẽ TRÁI ')+'ở ngã tư cuối ('+Math.round(CS-P.s)+'m)':(CSIDE>0?'→ Đi tiếp bên phải':'← Đi tiếp bên trái')):(d>.04?'↰ Cua trái':d<-.04?'↱ Cua phải':'↑ Đi thẳng');
 const sk=Math.max(1,Math.ceil((P.s-7)/150));$('stn').textContent=sk<=66?'⚡ Trạm: '+Math.max(0,sk*150-P.s).toFixed(0)+' m':'Hết trạm sạc';
 $('chg').style.display=P.chg>0?'block':'none';if(P.chg>0){$('chgt').textContent=Math.ceil(P.chg);$('chgb').style.transform='scaleX('+(1-P.chg/30)+')'}
 let msg='';const low=bn.filter(([n,k])=>en[k]<20).map(x=>x[0]);const ci=Math.round(P.s/L);
 if(P.pol==1)msg='🚓 CẢNH SÁT YÊU CẦU DỪNG XE: '+P.polWhy+' ('+Math.ceil(P.polT)+'s)';else if(P.pol==2)msg='🚓 ĐANG KIỂM TRA ('+Math.ceil(P.polT)+'s) — '+P.polWhy;
 else if(AC.filter(a=>a.on&&a.t!='ped'&&a.s>P.s&&a.s<P.s+150&&a.v<5&&Math.abs(a.lat-P.lat)<4).length>=2)msg='⚠ TẮC ĐƯỜNG PHÍA TRƯỚC';
 else if([1,2,3,4,5,6].some(j=>siteAt(ci+j)))msg='⚠ CÔNG TRƯỜNG PHÍA TRƯỚC';else if(low.length)msg='⚠ NĂNG LƯỢNG THẤP: '+low.join(', ');else if(S.hint&&sk<=66&&sk*150-P.s<90&&P.done!=sk&&P.chg<=0)msg='⚡ TRẠM SẠC: đi làn phải, dừng trên vạch xanh';
 const b=$('banner');b.textContent=msg;b.style.opacity=msg?1:0}
/* ---------- screens ---------- */
function ov(title,html,btns){$('ptitle').textContent=title;$('pbody').innerHTML=html;const o=$('popts');o.innerHTML='';btns.forEach(([t,f])=>{const b=document.createElement('button');b.textContent=t;b.onclick=f;o.appendChild(b)});$('popup').style.display='block'}
const HELP='<p>Xuất phát <b>07:30</b>, đến công ty cách <b>10 km</b> trước <b>07:45</b>. Dừng ở trạm Supercharger (làn phải, vạch xanh) để nạp đầy 3 bình khí.</p><p><b>W/S</b> tiến/phanh/lùi · <b>A/D</b> rẽ · <b>Q</b> giữ = Rocket Boost · <b>E</b> bay (Space/Shift lên/xuống) · <b>R</b> bám tường (bám được mọi tường) · <b>F</b> lộn né (trái/phải = lộn ngang, lên/xuống = lộn dọc) · <b>C</b> đổi camera (sau/trong/xa/trước) · <b>kéo chuột/vuốt</b> xoay cam · <b>lăn chuột/chụm 2 ngón</b> thu phóng · <b>V</b> reset cam · <b>P/Esc</b> tạm dừng.</p>';
function menu(){state='menu';reset();ov('HANOI ROADSTER ROCKET 3D','<p>🚀 Deadline 07:45</p>'+HELP,[['▶ Play',start],['⚙ Settings',()=>settings(menu)],['Quit',()=>{$('pbody').innerHTML='<p>Đã thoát. Bấm Play để chơi lại.</p>'}]])}
function pauseOv(){ov('TẠM DỪNG','',[['Resume',resume],['Restart',start],['Settings',()=>settings(pauseOv)],['Quit',menu]])}
const ST=[
['h','Điều khiển'],['r','Độ nhạy lái','sens',.5,1.6,.05],['s','Camera','cam',['Sau xe','Trong xe','Xa','Trước xe']],
['h','Camera & tâm ngắm'],['r','Độ nhạy xoay camera','cs',.3,2.5,.1],['s','Đảo trục ngang camera','ix',['Không','Có']],['s','Đảo trục dọc camera','iy',['Không','Có']],['s','Xe quay mũi theo tâm','fa',['Tắt','Bật']],['s','Tự thẳng lại theo đường','al',['Tắt','Bật']],['s','Kiểu tâm','am',['Vòng + chấm','Chấm','Chữ thập','Ẩn']],['r','Cỡ tâm','az',.6,2,.1],['s','Màu tâm','ac',['Trắng','Vàng','Xanh lá','Đỏ','Xanh dương']],
['h','Hiển thị'],['s','Đồ họa','gfx',['Thấp','Vừa','Cao']],['r','Cỡ nút cảm ứng','bs',.7,1.4,.05],['r','Vị trí nút (nâng lên)','bo',0,120,5],
['h','Độ khó'],['s','Độ khó giao thông','diff',['Dễ','Thường','Khó']],
['h','Hỗ trợ lái'],['s','Trợ lái','ast',['Tắt','Phanh tự động','Phanh + tránh mép đường']],['s','Tự động tăng tốc','auto',['Tắt','Bật']],
['h','Điện thoại & hiệu năng'],['s','Rung khi va chạm','vib',['Tắt','Bật']],['s','Giới hạn FPS','fps',['Không giới hạn','30','60']],
['h','Lối chơi'],['r','Mật độ xe','td',.3,1.5,.1],['r','Mật độ người đi bộ','pd',0,1,.1],['r','Thời gian miễn đâm sau lộn (giây)','iv',.5,3,.1],['s','Thời gian trong ngày','tod',['Ban ngày','Hoàng hôn','Ban đêm','Âm u / mưa']],['s','Gợi ý ngã tư & trạm sạc','hint',['Tắt','Bật']]
];
function settings(back){const rows=ST.map(x=>x[0]=='h'?`<div class="row" style="color:#0ff;font-weight:bold;margin-top:8px">${x[1]}</div>`:x[0]=='r'?`<div class="row">${x[1]}<input type="range" data-k="${x[2]}" min="${x[3]}" max="${x[4]}" step="${x[5]}" value="${S[x[2]]}"></div>`:`<div class="row">${x[1]}<select data-k="${x[2]}">${x[3].map((o,i)=>`<option value="${i}"${i==S[x[2]]?' selected':''}>${o}</option>`).join('')}</select></div>`).join('');
 ov('SETTINGS',rows,[['Xong',()=>back()]]);
 document.querySelectorAll('#pbody [data-k]').forEach(e=>e.oninput=e.onchange=()=>{const k=e.dataset.k;S[k]=+e.value;if(k=='cam'){CY_=CP_=0;camZ=1}apply()})}
const hl=new THREE.PointLight(0xffffee,0,70);hl.position.set(0,3,-8);
function applyTod(){const T=[[0x9cc3e6,120,520,1,.9,0xfff2dd,0],[0xf2a65a,100,450,.7,.8,0xffb070,.4],[0x0a1230,60,320,.28,.25,0x6677aa,1.6],[0x8e9aa6,50,260,.75,.35,0xdddddd,0]][S.tod];scene.background=new THREE.Color(T[0]);scene.fog=new THREE.Fog(T[0],T[1],T[2]);hemi.intensity=T[3];sun.intensity=T[4];sun.color.setHex(T[5]);hl.intensity=T[6];if(!hl.parent)car.add(hl)}
function apply(){applyTod();try{localStorage.setItem('hrr3d',JSON.stringify(S))}catch(e){}{const el=$('aim');if(el){const z=30*S.az;el.className='m'+S.am;el.style.width=el.style.height=z+'px';el.style.margin=(-z/2)+'px 0 0 '+(-z/2)+'px';el.style.setProperty('--ac',['#ffffff','#ffd700','#2ecc71','#ff3b3b','#3aa0ff'][S.ac])}}R.setPixelRatio([.6,1,Math.min(window.devicePixelRatio||1,2)][S.gfx]);R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();document.body.style.setProperty('--bs',S.bs);document.body.style.setProperty('--bo',S.bo+'px')}
function start(){reset();$('popup').style.display='none';state='play';last=performance.now();toast('07:30 — Xuất phát! Đến công ty trước 07:45')}
function resume(){$('popup').style.display='none';state='play';last=performance.now()}
function pause(){if(state=='play'){state='pause';held.q=false;pauseOv()}else if(state=='pause')resume()}
function end(win){state='end';held.q=false;const late=!win;
 ov(win?'🎉 CHIẾN THẮNG':'⏰ THẤT BẠI',`<p>${win?'Bạn đến công ty đúng giờ!':'Quá 07:45 — bạn bị đình chỉ lương!'}</p><p>Thời gian: <b>${fmtC(Math.min(simT,TL))}</b><br>Quãng đường: <b>${(P.s/1000).toFixed(2)} km</b> / 10 km<br>Số lần sạc: <b>${P.charges}</b> · Va chạm: <b>${P.cols}</b><br>Năng lượng còn lại: Q <b>${Math.ceil(en.b)}</b> · E+F <b>${Math.ceil(en.f)}</b> · R <b>${Math.ceil(en.w)}</b></p>`,[['↻ Chơi lại',start],['Menu',menu]])}
/* ---------- input ---------- */
addEventListener('keydown',e=>{if(e.repeat)return;K[e.code]=true;const c=e.code;if(c=='KeyQ')held.q=true;else if(c=='KeyE')act('e');else if(c=='KeyR')act('r');else if(c=='KeyF')act('f');else if(c=='KeyC'){S.cam=(S.cam+1)%4;CY_=CP_=0;camZ=1}else if(c=='KeyV'){CY_=CP_=0;camZ=1}else if(c=='KeyP'||c=='Escape')pause();
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
['gesturestart','gesturechange','gestureend'].forEach(n=>document.addEventListener(n,e=>e.preventDefault(),{passive:false}));
document.addEventListener('touchmove',e=>{if(e.touches.length>1)e.preventDefault()},{passive:false});
let ltt=0;document.addEventListener('touchend',e=>{const n=Date.now();if(n-ltt<350&&!e.target.closest('#popup'))e.preventDefault();ltt=n},{passive:false});
['contextmenu','selectstart','dragstart'].forEach(n=>document.addEventListener(n,e=>e.preventDefault()));document.addEventListener('dblclick',e=>e.preventDefault());document.addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault()},{passive:false});
if('ontouchstart' in window||navigator.maxTouchPoints>0)document.body.classList.add('touch');
addEventListener('resize',apply);document.addEventListener('visibilitychange',()=>{if(document.hidden&&state=='play')pause()});
/* ---------- loop ---------- */
let last=performance.now();
function loop(n){requestAnimationFrame(loop);if(S.fps&&n-last<(S.fps==1?33:16)-1)return;const dt=Math.min(.05,(n-last)/1000);last=n;if(state=='play'){update(dt);if(tT>0){tT-=dt;if(tT<=0)$('toast').textContent=''}if(frame%3==0){hud();mini()}}
 stream(P.s);chunks.forEach(g=>{const u=g.userData;if(u.i>0&&isInter(u.i)){const m=LAMP[red(u.i,simT)?1:0];u.lm.forEach(l=>l.material=m)}});camI+=dt;if(camI>4&&!pt.size){const q=Math.min(1,3*dt);CY_-=CY_*q;CP_-=CP_*q}updCam();R.render(scene,cam);frame++}
apply();reset();menu();requestAnimationFrame(loop);
window.__t={P,en,held,K,AC,update,act,start,end,hud,mini,get simT(){return simT},get state(){return state},set simT(v){simT=v},chunks};
