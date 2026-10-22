'use strict';
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
 const st=[];if(P.boost)st.push('BOOST');if(P.fly)st.push('BAY');if(P.wall)st.push('BÁM TƯỜNG');if(P.fl>0)st.push('LỘN VÒNG');else if(simT<P.inv)st.push('MIỄN ĐÂM');if(P.chg>0)st.push('ĐANG SẠC');if(P.pol)st.push('CẢNH SÁT');if(S.ast)st.push('TỰ LÁI');
 $('stat').innerHTML=st.map(t=>`<span class="badge g">${t}</span>`).join('');
 $('nav').textContent=S.hint&&P.s>CS-400&&P.s<CS+14?(P.s<CS-12?(CSIDE>0?'↱ Rẽ PHẢI ':'↰ Rẽ TRÁI ')+'ở ngã tư cuối ('+Math.round(CS-P.s)+'m)':(CSIDE>0?'→ Đi tiếp bên phải':'← Đi tiếp bên trái')):(d>.04?'↰ Cua trái':d<-.04?'↱ Cua phải':'↑ Đi thẳng');
 const sk=Math.max(1,Math.ceil((P.s-7)/150));$('stn').textContent=sk<=66?'⚡ Trạm: '+Math.max(0,sk*150-P.s).toFixed(0)+' m':'Hết trạm sạc';
 $('chg').style.display=P.chg>0?'block':'none';if(P.chg>0){$('chgt').textContent=Math.ceil(P.chg);$('chgb').style.transform='scaleX('+(1-P.chg/30)+')'}
 let msg='';const low=bn.filter(([n,k])=>en[k]<20).map(x=>x[0]);const ci=Math.round(P.s/L);
 if(P.pol==1)msg='🚓 CẢNH SÁT YÊU CẦU DỪNG XE: '+P.polWhy+' ('+Math.ceil(P.polT)+'s)';else if(P.pol==2)msg='🚓 ĐANG KIỂM TRA ('+Math.ceil(P.polT)+'s) — '+P.polWhy;
 else if(AC.filter(a=>a.on&&a.t!='ped'&&a.s>P.s&&a.s<P.s+150&&a.v<5&&Math.abs(a.lat-P.lat)<4).length>=2)msg='⚠ TẮC ĐƯỜNG PHÍA TRƯỚC';
 else if([1,2,3,4,5,6].some(j=>siteAt(ci+j)))msg='⚠ CÔNG TRƯỜNG PHÍA TRƯỚC';else if(low.length)msg='⚠ NĂNG LƯỢNG THẤP: '+low.join(', ');else if(S.hint&&sk<=66&&sk*150-P.s<90&&P.done!=sk&&P.chg<=0)msg='⚡ TRẠM SẠC: đi làn phải, dừng trên vạch xanh';
 const b=$('banner');b.textContent=msg;b.style.opacity=msg?1:0}
