'use strict';
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
 const k=ctl(),ch=P.chg>0;let thr=ch?0:k.thr,str=ch?0:k.str,ab=false,apBoost=false;
 if(S.ast>=1&&!ch&&!P.fly&&!P.wall&&P.fl<=0&&P.y<2.6){const plan=drivePlan(k);if(plan.str!==null)str=plan.str;if(plan.thr!==null)thr=plan.thr;ab=plan.brake;apBoost=plan.boost}
 P.boost=(held.q||apBoost)&&en.b>0&&!ch&&!P.wall&&!ab;if(P.boost)en.b=Math.max(0,en.b-.2*dt);
 if(P.fly){en.f=Math.max(0,en.f-dt/3);if(en.f<=0){P.fly=false;toast('Hết khí nén: hạ cánh an toàn')}}
 if(P.wall){en.w=Math.max(0,en.w-dt/10);if(en.w<=0)detach('Hết bình bám tường: hạ xuống an toàn');}
 const vmax=25;const pv=P.vf;
 if(ch){P.vf=0;P.vx=P.vz=0}else if(P.boost)P.vf=Math.min(70,P.vf+45*dt);
 else{if(thr>0&&P.vf<vmax)P.vf=Math.min(vmax,P.vf+(14-.4*Math.max(P.vf,0))*thr*dt);
  else if(thr<0){if(P.vf>.5)P.vf=Math.max(0,P.vf+38*thr*dt);else P.vf=Math.max(-9,P.vf+9*thr*dt)}
  else if(thr==0){const d=(3+.002*P.vf*P.vf)*dt;P.vf=P.vf>0?Math.max(0,P.vf-d):Math.min(0,P.vf+d)}
  if(P.vf>vmax)P.vf=Math.max(vmax,P.vf-70*dt)}
 const sp0=Math.abs(P.vf);
 if(P.wall){let d=(P.wt==2?rth(P.wc*L)-P.wd*Math.PI/2:rth(P.s))-P.th;P.th+=Math.atan2(Math.sin(d),Math.cos(d))*Math.min(1,6*dt);P.y=cl(P.y+(str*P.wall+k.up-k.dn)*12*dt,1.3,48);P.vy=0}
 else if(!ch){P.ss=(P.ss||0)+(str-(P.ss||0))*Math.min(1,10*dt);const yr=P.ss*S.sens*2.6/(1+Math.min(sp0,60)/45)*Math.min(1,sp0/4)*Math.min(1,50/Math.max(sp0,1))*(P.vf<0?-1:1);P.th-=yr*dt;
  if(S.al&&str==0&&sp0>8&&!xinfo()){const d=rth(P.s)-P.th,dd=Math.atan2(Math.sin(d),Math.cos(d));P.th+=dd*Math.min(1,(Math.abs(dd)<.35?1.5:.4)*dt)}}
 if(S.fa&&!P.wall&&!ch&&Math.abs(CY_)>.02&&sp0>1&&!pt.size){const dc=CY_*Math.min(1,4*dt);P.th+=dc;CY_-=dc}
 const gr=P.fly?5:P.wall?20:11,tx=-Math.sin(P.th)*P.vf,tz=-Math.cos(P.th)*P.vf,k2=1-Math.exp(-gr*dt);if(!ch){P.vx+=(tx-P.vx)*k2;P.vz+=(tz-P.vz)*k2}
 if(P.fl>0){P.fl+=dt;if(P.fl>=.88)P.fl=0;const sp=P.dd*dt;if(P.dm=='z'){P.x+=Math.cos(P.th)*sp*P.fd;P.z-=Math.sin(P.th)*sp*P.fd}else if(P.dm=='x'){P.x-=Math.sin(P.th)*sp*P.fd;P.z-=Math.cos(P.th)*sp*P.fd}}
 if(P.wall){}else if(P.fly){P.ftg=cl(P.ftg+(k.up-k.dn)*12*dt,2.5,34);P.y+=(P.ftg-P.y)*Math.min(1,3*dt);P.vy=0}
 else{P.vy-=25*dt;if(P.vy<-8&&P.fl<=0)P.vy=-8}
 const ns=Math.min(40,Math.ceil(Math.hypot(P.vx,P.vz)*dt/1.2)||1),h=dt/ns;P.prevS=P.s;
 for(let q=0;q<ns;q++){P.x+=P.vx*h;P.z+=P.vz*h;if(!P.fly&&!P.wall){P.y+=P.vy*h;if(P.y<=0){if(P.vy<-6)P.shake=.3;P.y=0;if(P.vy<0)P.vy=0}}
  P.s=-P.z;let xq=null,xc=0;if(!(P.wall&&P.wt==1)){const c0=Math.round(P.s/L);for(let cc=c0-1;cc<=c0+1;cc++)if(isInter(cc)){const q1=loc(cc);if(Math.abs(q1[0])>36&&Math.abs(q1[1])<14){xq=q1;xc=cc}}}
  if(xq){const s0=xc*L,t=rth(s0),c=Math.cos(t),n=Math.sin(t),a=cl(xq[0],-138,138),b=cl(xq[1],-11.5,11.5);if(a!=xq[0]||b!=xq[1]){P.x=cx(s0)+a*c+b*n;P.z=-s0-a*n+b*c;P.vx*=.5;P.vz*=.5}P.s=-P.z}else if(P.s>CS+14){P.s=CS+14;P.z=-P.s}
  if(P.s<2){P.s=2;P.z=-2}
  let lat=P.x-cx(P.s);if(P.wall){if(P.wt==2){const s0=P.wc*L,t=rth(s0),c=Math.cos(t),n=Math.sin(t),q2=loc(P.wc),a=cl(q2[0],-138,138),b=P.wall*P.wd*11.2;P.x=cx(s0)+a*c+b*n;P.z=-s0-a*n+b*c;P.s=-P.z;lat=P.x-cx(P.s)}else{lat=P.wall*45.2/Math.cos(rth(P.s));P.x=cx(P.s)+lat}}else if(!xq&&(lat<-44||lat>44)){lat=cl(lat,-44,44);P.x=cx(P.s)+lat;if(simT-P.lastCurb>.25){P.lastCurb=simT;P.vx*=.5;P.vf*=Math.abs(P.vf)>60?.9:.85;P.shake=Math.max(P.shake,.3)}else{P.vx=0}}
  if(!P.wall)hitCheck(lat);
  if(xq&&xc==FI&&CSIDE*xq[0]>112&&P.y<8&&!P.wall){end(true);return}}
 P.s=-P.z;P.lat=P.x-cx(P.s);P.dc+=Math.max(0,P.s-P.prevS);
 const rk=Math.round((P.s+STOP-75)/200),ls=rk*200+75-STOP;if(rk>=0&&rk<=NI&&P.prevS<ls&&P.s>=ls&&red(8*rk+3,simT)&&P.y<3&&P.vf>6)viol('Vượt đèn đỏ');
 const sk=Math.round(P.s/150);let inz=false;if(sk>=1&&sk<=66&&P.y<1&&!P.fly&&!P.wall){const q=loc(sk*6);inz=Math.abs(q[1])<8&&q[0]>18&&q[0]<30.8}
 if(P.done>=0&&Math.abs(P.s-P.done*150)>40)P.done=-1;
 if(P.chg>0){if(!inz){P.chg=0;toast('Sạc bị hủy: rời vùng sạc')}else{P.chg-=dt;if(P.chg<=0){P.chg=0;en.b=en.f=en.w=en.l=100;P.charges++;P.done=sk;P.dc=0;toast('Sạc đầy 3 bình!');beep(900,.3)}}}
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
