'use strict';
const AP={lane:null,sk:null};
const nearestLane=lat=>LN.reduce((best,lane)=>Math.abs(lane-lat)<Math.abs(best-lat)?lane:best,LN[0]);
const siteAhead=()=>{const ci=Math.round(P.s/L);for(let j=0;j<12;j++)if(siteAt(ci+j))return true;return false};
const laneBlocked=lane=>lane<-8&&siteAhead();
function laneClear(lane){let clear=120;for(const a of AC){if(!a.on)continue;const ds=a.s-P.s;if(ds<-9||ds>120)continue;if(Math.abs(a.lat-lane)<(a.w+2)/2+.8)clear=Math.min(clear,ds-a.len/2)}return clear}
function chooseLane(){if(AP.lane===null)AP.lane=nearestLane(P.lat);
 const index=LN.indexOf(AP.lane),currentClear=laneClear(AP.lane);
 if(Math.abs(P.lat-AP.lane)<1.6&&(laneBlocked(AP.lane)||currentClear<30+P.vf*2)){let best=AP.lane,bestScore=currentClear-(laneBlocked(AP.lane)?300:0);
  for(const next of laneBlocked(AP.lane)?[index+1]:[index-1,index+1]){const lane=LN[next];if(lane===undefined||(laneBlocked(lane)&&!laneBlocked(AP.lane)))continue;const score=laneClear(lane)+(laneBlocked(AP.lane)?400:0);if(score>bestScore+15){bestScore=score;best=lane}}
  AP.lane=best}
 return AP.lane}
function lightStops(index,distance){const phase=(simT+index*5.3)%30;if(phase>=22)return true;return distance/Math.max(P.vf,1)>22-phase-1.2&&distance>P.vf*P.vf/30+4}
function safeSpeed(){let cars=40,light=40;
 for(const a of AC){if(!a.on)continue;const ds=a.s-P.s;if(ds<=0||ds>60+P.vf*2)continue;if(Math.abs(a.lat-P.lat)>=(a.w+1.9)/2+(a.park?-.2:.7))continue;
  const gap=ds-a.len/2-2.15;if(gap<14+P.vf*1.5)cars=Math.min(cars,Math.max(0,(gap-3)*.7))}
 const rk=Math.round((P.s+STOP-75)/200),lineS=rk*200+75-STOP;
 if(rk>=0&&rk<=NI){const d=lineS-(P.s+2.15);
  if(d>-.5&&d<30+P.vf*1.5&&lightStops(8*rk+3,d))light=Math.min(light,Math.sqrt(Math.max(0,d-2)*10),d/(30-((simT+(8*rk+3)*5.3)%30)+.3))}
 return{cars,light}}
function chargePlan(){if(P.dc<2000&&en.b>=20&&en.f>=20&&en.w>=20)return null;
 if(AP.sk===null||AP.sk==P.done||AP.sk*150<P.s-8){let sk=Math.max(1,Math.ceil((P.s-6)/150));if(sk==P.done)sk++;if(sk*150-P.s<60)sk++;AP.sk=sk}
 const sk=AP.sk;if(sk>66||sk*150>CS-150)return null;
 return{sk,d:loc(sk*6)[1]}}
function lateralNudge(){let push=0;for(const a of AC){if(!a.on||a.park)continue;const ds=a.s-P.s;if(ds<-6||ds>30)continue;const dl=a.lat-P.lat,need=(a.w+1.9)/2+1;if(Math.abs(dl)<need)push-=(dl<0?-1:1)*(need-Math.abs(dl))}return cl(push,-2.5,2.5)}
const steerToHeading=target=>{const d=target-P.th;return cl(-Math.atan2(Math.sin(d),Math.cos(d))*2.2,-1,1)};
const headingForLane=target=>rth(P.s)-cl((target-P.lat)*.08,-.22,.22);
function drivePlan(k){
 const full=!!S.ast,manualStr=Math.abs(k.str)>.1,manualThr=Math.abs(k.thr)>.1,plan={thr:null,str:null,brake:false,boost:false};
 const safe=safeSpeed(),guard=Math.min(safe.cars,safe.light),emergency=P.vf>safe.cars+1.5;let target=guard;
 if(manualStr)AP.lane=null;
 if(!manualStr){
  if(full&&P.s>CS-16){plan.str=steerToHeading(rth(FI*L)-CSIDE*Math.PI/2);target=Math.min(target,10)}
  else if(!xinfo()){
   const charge=full?chargePlan():null;let laneTarget;
   if(charge&&charge.d<500){laneTarget=charge.d<80?P.lat+22.5-loc(charge.sk*6)[0]:22.5;target=Math.min(target,Math.sqrt(Math.max(0,charge.d-.5)*8))}
   else if(full&&P.dc>=1700&&P.dc<2000&&P.s<CS-300)laneTarget=18.75;
   else if(full&&P.s>CS-250){laneTarget=CSIDE*18.75;target=Math.min(target,14)}
   else laneTarget=chooseLane();
   plan.str=steerToHeading(headingForLane(laneTarget+lateralNudge()))}}
 if(full&&!manualThr){target=Math.min(target,en.b>15?34:25);plan.thr=cl((target-P.vf)*.6,emergency?-1:-.35,1);plan.boost=target>26&&P.vf<target-.5}
 if(P.vf>guard+1.5){plan.brake=true;plan.thr=Math.min(plan.thr===null?k.thr:plan.thr,emergency?-cl((P.vf-guard)*.3,.3,1):-cl((P.vf-guard)*.2,.2,.35))}
 return plan}
