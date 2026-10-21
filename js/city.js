'use strict';
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
