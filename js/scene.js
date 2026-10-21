'use strict';
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
