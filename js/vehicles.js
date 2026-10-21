'use strict';
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
