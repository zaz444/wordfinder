const T=THREE,$=id=>document.getElementById(id),Rn=Math.random;
const R=new T.WebGLRenderer({antialias:false});R.autoClear=false;R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(innerWidth,innerHeight);document.body.prepend(R.domElement);
const S=new T.Scene();S.background=new T.Color(0x07090d);S.fog=new T.FogExp2(0x07090d,.04);
const cam=new T.PerspectiveCamera(85,innerWidth/innerHeight,.1,100);cam.rotation.order='YXZ';S.add(cam);
const hemi=new T.HemisphereLight(0x3d6f7c,0x3a2210,.75);S.add(hemi);let MAP=0;
const moon=new T.DirectionalLight(0x7fb0c0,.4);moon.position.set(10,20,5);S.add(moon);const lamps=[[12,-11],[-13,9],[2,15]].map(([x,z])=>{const l=new T.PointLight(0xff8a30,1.2,24);l.position.set(x,3.2,z);S.add(l);const m=new T.Mesh(new T.BoxGeometry(.5,.25,.5),new T.MeshBasicMaterial({color:0xffb060}));m.position.set(x,3.4,z);S.add(m);return l});
const flash=new T.PointLight(0xffc060,0,12);flash.position.set(0,0,-1);cam.add(flash);
addEventListener('resize',()=>{R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();vfit()});
function tex(a,b,rep){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle=a;g.fillRect(0,0,64,64);for(let i=0;i<280;i++){g.fillStyle=Rn()<.5?b:a;g.fillRect(Rn()*64,Rn()*64,3,3)}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rep,rep);return t}
const M=c=>new T.MeshLambertMaterial({color:c}),gc={};
function box(w,h,d,m,x,y,z,par){const k=w+','+h+','+d,o=new T.Mesh(gc[k]||(gc[k]=new T.BoxGeometry(w,h,d)),m);o.position.set(x,y,z);if(par)par.add(o);return o}
function ctex(rep){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#34322c';g.fillRect(0,0,64,64);g.fillStyle='#1d1c19';g.fillRect(0,0,32,32);g.fillRect(32,32,32,32);for(let i=0;i<220;i++){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(Rn()*64,Rn()*64,3,3)}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rep,rep);return t}
function fenceTex(){const c=document.createElement('canvas');c.width=c.height=32;const g=c.getContext('2d');g.strokeStyle='#9aa3aa';g.lineWidth=2;g.beginPath();g.moveTo(0,0);g.lineTo(32,32);g.moveTo(32,0);g.lineTo(0,32);g.stroke();const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(400,8);return t}
const gr=new T.Mesh(new T.PlaneGeometry(100,100),new T.MeshLambertMaterial({map:ctex(25)}));gr.rotation.x=-Math.PI/2;S.add(gr);
const wallM=new T.MeshLambertMaterial({map:tex('#3a3330','#2a2422',10),side:T.DoubleSide});S.add(new T.Mesh(new T.CylinderGeometry(38,38,7,28,1,true),wallM).translateY(3));const fence=new T.Mesh(new T.CylinderGeometry(37,37,4,48,1,true),new T.MeshLambertMaterial({map:fenceTex(),transparent:true,alphaTest:.5,side:T.DoubleSide}));fence.position.y=2;S.add(fence);
// obstacles
const OB=[],OBm=[],mOb=new T.MeshLambertMaterial({map:tex('#4a4036','#352d25',2)});
function obs(k){OBm.forEach(m=>S.remove(m));OB.length=0;OBm.length=0;const mat=k?new T.MeshLambertMaterial({map:tex('#8a7550','#6e5c3e',2)}):mOb,mp=M(0x2a2a2e),n=k?20:16;
for(let i=0;i<n;i++){const a=i/n*6.283+Rn()*.3,r=15+Rn()*18,x=Math.cos(a)*r,z=Math.sin(a)*r,pipe=k&&i%4==3,rad=pipe?.35:k?1.2+Rn()*1.1:.9+Rn()*.8,h=pipe?6.5:k?1.2:2.2+Rn()*1.5;const m=new T.Mesh(new T.CylinderGeometry(rad,rad*(k&&!pipe?1.2:1),h,10),pipe?mp:mat);m.position.set(x,h/2,z);S.add(m);OB.push({x,z,r:rad});OBm.push(m)}}
// stations
const W={pistol:{n:'M1911',mag:8,res:56,dmg:45,rate:.33,auto:0,pel:1,spr:.004,rel:1.2},smg:{n:'MP-X',mag:30,res:150,dmg:28,rate:.085,auto:1,pel:1,spr:.02,rel:1.7},shot:{n:'PUMP 12',mag:6,res:36,dmg:22,rate:.85,auto:0,pel:8,spr:.07,rel:2.3},plasma:{n:'PLASMA',mag:20,res:120,dmg:160,rate:.22,auto:0,pel:1,spr:.002,rel:1.6}};
const ST=[{k:'smg',n:'MP-X SMG',c:1000,ac:500,col:'#4aa3ff'},{k:'shot',n:'PUMP 12',c:1500,ac:750,col:'#ff9a3c'},{k:'perk',n:'TOUGH SKIN',c:2000,col:'#d85cff'},{k:'ammo',n:'AMMO CRATE',c:500,col:'#7be07b'},{k:'box',n:'MYSTERY BOX',c:950,col:'#ffd84a'}];
function lbl(a,b,col){const c=document.createElement('canvas');c.width=256;c.height=96;const g=c.getContext('2d');g.textAlign='center';g.font='bold 36px Oswald,Impact,sans-serif';g.fillStyle=col;g.fillText(a,128,42);g.font='30px Oswald,sans-serif';g.fillStyle='#fff';g.fillText(b,128,82);const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),transparent:true,fog:false}));s.scale.set(2.8,1.05,1);return s}
ST.forEach((s,i)=>{const a=i/5*6.283+.7;s.x=Math.cos(a)*9;s.z=Math.sin(a)*9;box(1.3,1,.6,M(0x2c2c30),s.x,.5,s.z,S).rotation.y=-a;const m=new T.MeshBasicMaterial({color:s.col});const b=box(1,.7,.2,m,s.x,1.35,s.z,S);b.rotation.y=-a;const l=lbl(s.n,String(s.c),s.col);l.position.set(s.x,2.5,s.z);S.add(l)});
// gun
// viewmodel (guns + hands) lives in its own scene + camera so it never clips into walls (see js/viewmodel.js)
const VS=new T.Scene(),vcam=new T.PerspectiveCamera(65,innerWidth/innerHeight,.01,10);
const vh=new T.HemisphereLight(0xa8c8d0,0x3a2a1c,.9),vk=new T.DirectionalLight(0xfff0d8,.9),vfl=new T.PointLight(0xffc060,0,6);vk.position.set(-1,2,1.5);VS.add(vh,vk,vfl);
function vfit(){const a=innerWidth/innerHeight;vcam.aspect=a;vcam.fov=a>=1.4?65:2*Math.atan(Math.tan(65*Math.PI/360)*1.4/a)*180/Math.PI;vcam.updateProjectionMatrix()}vfit();
const VMs={};for(const k in W){VMs[k]=VM.make(k);VS.add(VMs[k].gun,VMs[k].lh)}
let gun,lh,mg,mf,LR;

// state
let p,ammo,zs=[],dy=[],rd,q,spT,between,dead,kills,started=0,cd=0,rl=0,ar=null,rc=0,fl=0,hm=0,hv=0,fire=0,fresh=0,near=null,bob=0,mx=0,my=0;
function setW(k){p.wk=k;rl=0;ar=null;for(const j in VMs){const v=VMs[j],on=j==k;v.gun.visible=v.lh.visible=on;if(on){gun=v.gun;lh=v.lh;mg=v.mg;mf=v.mf;LR=v.r}}}
function reset(){zs.forEach(z=>S.remove(z.g));dy.forEach(d=>S.remove(d.g));zs=[];dy=[];p={x:0,z:0,yaw:0,pitch:0,hp:100,max:100,pts:500,own:{pistol:1},perk:0,nh:0};ammo={pistol:{m:8,r:56}};rd=0;q=0;spT=0;between=2.5;dead=0;kills=0;setW('pistol')}
// zombie
const mSk=M(0x9aa58a),mCl=M(0xa8793a),mPs=M(0x8f6530),mEy=new T.MeshBasicMaterial({color:0xff2020});
function mkZ(){const g=new T.Group();g.rotation.order='YXZ';box(.62,.8,.32,mCl,0,1.15,0,g);const hd=box(.4,.42,.4,mSk,0,1.77,0,g);hd.userData.head=1;if(MAP)box(.46,.14,.46,mPs,0,2.02,0,g);box(.08,.06,.04,mEy,-.1,1.8,.2,g);box(.08,.06,.04,mEy,.1,1.8,.2,g);
const arms=new T.Group();arms.position.set(0,1.45,0);g.add(arms);box(.17,.7,.17,mSk,-.42,-.3,0,arms);box(.17,.7,.17,mSk,.42,-.3,0,arms);
const L=new T.Group(),Rg=new T.Group();L.position.set(-.16,.78,0);Rg.position.set(.16,.78,0);g.add(L,Rg);box(.22,.78,.22,mPs,0,-.39,0,L);box(.22,.78,.22,mPs,0,-.39,0,Rg);
const z={g,L,R:Rg,arms,hp:1,sp:2,ph:Rn()*6,at:0,st:0,dead:0};g.traverse(o=>o.userData.z=z);return z}
function spawn(){let x,y,t=0;do{const a=Rn()*6.283;x=Math.cos(a)*34;y=Math.sin(a)*34}while(Math.hypot(x-p.x,y-p.z)<22&&t++<9);
const z=mkZ();z.hp=rd<10?60+rd*35:410*Math.pow(1.1,rd-9);z.sp=1.5+Math.min(rd,12)*.22+Rn()*.6;z.g.position.set(x,0,y);S.add(z.g);zs.push(z);if(Rn()<.4)snd('g')}
function kill(z){z.dead=1;zs.splice(zs.indexOf(z),1);dy.push({g:z.g,t:0});kills++}
function pushOut(o,rad){for(const b of OB){const dx=o.x-b.x,dz=o.z-b.z,d=Math.hypot(dx,dz),m=b.r+rad;if(d<m&&d>0){o.x=b.x+dx/d*m;o.z=b.z+dz/d*m}}const d=Math.hypot(o.x,o.z);if(d>36.5){o.x*=36.5/d;o.z*=36.5/d}}
function hurt(n){if(dead)return;p.hp-=n;p.nh=0;hv=1;snd('h');if(p.hp<=0)die()}
function die(){dead=1;fire=0;$('t1').textContent='OVERRUN';$('t2').textContent='You lasted '+(rd-1<1?'less than a round':rd+(rd==1?' round':' rounds'))+' and put down '+kills+' of them.';$('ov').style.display='grid'}
// weapons
const ray=new T.Raycaster();ray.far=60;
function shoot(){const w=W[p.wk],a=ammo[p.wk];if(cd>0||rl>0)return false;if(a.m<=0){reload();return false}
a.m--;cd=w.rate;rc=.09;fl=.05;flash.intensity=3;snd(w.pel>1?'s':'p');const objs=zs.map(z=>z.g).concat(OBm),hit=new Set();
for(let i=0;i<w.pel;i++){ray.setFromCamera(new T.Vector2((Rn()-.5)*w.spr*2,(Rn()-.5)*w.spr*2),cam);const h=ray.intersectObjects(objs,true)[0];if(!h)continue;const z=h.object.userData.z;if(!z||z.dead)continue;const hd=h.object.userData.head;z.hp-=w.dmg*(hd?2:1)*(w.pel>1&&h.distance>12?.5:1);z.st=.08;hit.add(z);if(z.hp<=0){p.pts+=hd?100:60;kill(z)}}
hit.forEach(()=>p.pts+=10);if(hit.size)hm=1;if(a.m==0)reload();return true}
function reload(){const w=W[p.wk],a=ammo[p.wk];if(rl>0||a.m>=w.mag||a.r<=0)return;rl=w.rel;ar=p.wk}
function swap(){const ks=Object.keys(p.own),i=ks.indexOf(p.wk);setW(ks[(i+1)%ks.length])}
function cost(s){return s.k=='perk'?(p.perk?0:s.c):s.k=='ammo'?s.c:(p.own[s.k]?s.ac:s.c)}
function buy(){const s=near;if(!s||dead)return;const c=cost(s);if(!c||p.pts<c)return;
if(s.k=='perk'){p.perk=1;p.max=150;p.hp=150}
else if(s.k=='ammo'){for(const k in p.own)ammo[k]={m:W[k].mag,r:W[k].res}}
else if(s.k=='box'){const ks=['smg','shot','plasma'],k=ks[Math.floor(Rn()*ks.length)];p.own[k]=1;ammo[k]={m:W[k].mag,r:W[k].res};setW(k);banner(W[k].n)}
else if(!p.own[s.k]){p.own[s.k]=1;ammo[s.k]={m:W[s.k].mag,r:W[s.k].res};setW(s.k)}
else{if(ammo[s.k].r>=W[s.k].res)return;ammo[s.k]={m:W[s.k].mag,r:W[s.k].res}}
p.pts-=c;snd('p')}
// audio
let A;function ac(){if(!A){try{A=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(A&&A.state=='suspended')A.resume()}
function snd(k){if(!A)return;const t=A.currentTime,g=A.createGain();g.connect(A.destination);
if(k=='g'){const o=A.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(90+Rn()*40,t);o.frequency.exponentialRampToValueAtTime(50,t+.6);g.gain.setValueAtTime(.05,t);g.gain.exponentialRampToValueAtTime(.001,t+.6);o.connect(g);o.start(t);o.stop(t+.6);return}
const n=k=='s'?.25:k=='h'?.15:.12,b=A.createBuffer(1,A.sampleRate*n,A.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Rn()*2-1)*(1-i/d.length);
const s=A.createBufferSource();s.buffer=b;const f=A.createBiquadFilter();f.type='lowpass';f.frequency.value=k=='h'?400:k=='s'?1200:2500;g.gain.value=k=='h'?.5:.3;s.connect(f);f.connect(g);s.start(t)}
// input
let stick=null,look=null,K={},md=0;const sb=$('sb'),sk=$('sk');
function aim(dx,dy){p.yaw-=dx*.0058;p.pitch=Math.max(-1.2,Math.min(1.2,p.pitch-dy*.0048))}
document.addEventListener('touchstart',e=>{ac();for(const t of e.changedTouches){if(t.target.closest('.btn')||t.target.closest('#ov'))continue;
if(t.clientX<innerWidth*.45&&!stick){stick={id:t.identifier,x:t.clientX,y:t.clientY};sb.style.cssText='display:block;left:'+t.clientX+'px;top:'+t.clientY+'px';sk.style.transform=''}
else if(!look)look={id:t.identifier,x:t.clientX,y:t.clientY}}
if(!e.target.closest('#ov'))e.preventDefault()},{passive:false});
document.addEventListener('touchmove',e=>{for(const t of e.changedTouches){if(stick&&t.identifier==stick.id){let dx=t.clientX-stick.x,dy=t.clientY-stick.y;const d=Math.hypot(dx,dy),m=55;if(d>m){dx*=m/d;dy*=m/d}mx=dx/m;my=dy/m;sk.style.transform='translate('+dx+'px,'+dy+'px)'}
else if(look&&t.identifier==look.id){if(!dead&&started)aim(t.clientX-look.x,t.clientY-look.y);look.x=t.clientX;look.y=t.clientY}}e.preventDefault()},{passive:false});
function tend(e){for(const t of e.changedTouches){if(stick&&t.identifier==stick.id){stick=null;mx=my=0;sb.style.display='none'}if(look&&t.identifier==look.id)look=null}}
document.addEventListener('touchend',tend);document.addEventListener('touchcancel',tend);
function bind(id,dn,up){const e=$(id);e.addEventListener('touchstart',v=>{ac();v.preventDefault();dn()},{passive:false});e.addEventListener('touchend',v=>{v.preventDefault();up&&up()});e.addEventListener('mousedown',()=>{ac();dn()});e.addEventListener('mouseup',()=>up&&up());e.addEventListener('mouseleave',()=>up&&up())}
bind('fire',()=>{fire=1;fresh=1},()=>fire=0);bind('rel',reload);bind('swp',swap);bind('buy',buy);
addEventListener('keydown',e=>{K[e.code]=1;if(e.code=='Space'&&!fire){fire=1;fresh=1}if(e.code=='KeyR')reload();if(e.code=='KeyE')buy();if(e.code=='KeyQ')swap()});
addEventListener('keyup',e=>{K[e.code]=0;if(e.code=='Space')fire=0});
R.domElement.addEventListener('mousedown',()=>md=1);addEventListener('mouseup',()=>md=0);addEventListener('mousemove',e=>{if(md&&started&&!dead)aim(e.movementX,e.movementY)});
[['go',0],['go2',1]].forEach(([id,k])=>$(id).addEventListener('click',()=>{ac();$('ov').style.display='none';setMap(k);reset();started=1}));
function banner(t){const b=$('bn');b.textContent=t;b.style.opacity=1;clearTimeout(banner.t);banner.t=setTimeout(()=>b.style.opacity=0,2200)}
// loop
function mudTex(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#3b2f21';g.fillRect(0,0,64,64);for(let i=0;i<170;i++){g.fillStyle='#4d3d2a';g.fillRect(Rn()*64,Rn()*64,3,3)}for(let i=0;i<14;i++){g.fillStyle='#cfcac0';g.fillRect(Rn()*64,Rn()*64,4,3)}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(25,25);return t}
const prisonFloor=gr.material.map,prisonWall=wallM.map,mudFloor=mudTex(),plankWall=tex('#5a4a34','#3a2f20',10);
function setMap(k){MAP=k;const c=k?0x3b2a1a:0x07090d;S.background.setHex(c);S.fog.color.setHex(c);S.fog.density=k?.03:.04;hemi.color.setHex(k?0xc08a50:0x3d6f7c);hemi.groundColor.setHex(k?0x2a1c10:0x3a2210);moon.color.setHex(k?0xffb070:0x7fb0c0);gr.material.map=k?mudFloor:prisonFloor;gr.material.needsUpdate=true;wallM.map=k?plankWall:prisonWall;wallM.needsUpdate=true;fence.visible=!k;mSk.color.setHex(k?0x8a8f7a:0x9aa58a);mCl.color.setHex(k?0x5a5d48:0xa8793a);mPs.color.setHex(k?0x45463a:0x8f6530);obs(k)}
setMap(0);reset();let last=performance.now();
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;
if(started&&!dead){
 let ix=mx+(K.KeyD?1:0)-(K.KeyA?1:0),iy=my+(K.KeyS?1:0)-(K.KeyW?1:0);const l=Math.hypot(ix,iy);if(l>1){ix/=l;iy/=l}
 const v=5.2*dt,c=Math.cos(p.yaw),s=Math.sin(p.yaw);p.x+=(c*ix+s*iy)*v;p.z+=(-s*ix+c*iy)*v;pushOut(p,.5);bob+=l*dt*9;
 cd-=dt;if(rl>0){rl-=dt;if(rl<=0&&ar){const w=W[ar],a=ammo[ar],tk=Math.min(w.mag-a.m,a.r);a.m+=tk;a.r-=tk;ar=null}}
 if(fire&&(W[p.wk].auto||fresh)&&shoot())fresh=0;
 p.nh+=dt;if(p.nh>4&&p.hp<p.max)p.hp=Math.min(p.max,p.hp+30*dt);
 // rounds
 if(between>0){between-=dt;if(between<=0){rd++;q=Math.min(5+rd*4,70);spT=0;banner('ROUND '+rd)}}
 else{spT-=dt;if(q>0&&zs.length<24&&spT<=0){spawn();q--;spT=Math.max(.35,1.8-rd*.12)}if(q==0&&!zs.length){between=4;banner('ROUND '+rd+' CLEARED')}}
 for(const z of zs){const dx=p.x-z.g.position.x,dz=p.z-z.g.position.z,d=Math.hypot(dx,dz)||1;z.g.rotation.y=Math.atan2(dx,dz);
  if(z.st>0)z.st-=dt;else if(d>1){const m=z.sp*dt;z.g.position.x+=dx/d*m;z.g.position.z+=dz/d*m}
  z.ph+=dt*z.sp*2.2;z.L.rotation.x=Math.sin(z.ph)*.7;z.R.rotation.x=-Math.sin(z.ph)*.7;z.arms.rotation.x=-1.4+Math.sin(z.ph*.5)*.1;
  z.at-=dt;if(d<1.3&&z.at<=0){z.at=.9;hurt(20)}}
 for(let i=0;i<zs.length;i++){const a=zs[i].g.position;for(let j=i+1;j<zs.length;j++){const b=zs[j].g.position,dx=a.x-b.x,dz=a.z-b.z,d=Math.hypot(dx,dz);if(d<.8&&d>0){const m=(.8-d)/2;a.x+=dx/d*m;a.z+=dz/d*m;b.x-=dx/d*m;b.z-=dz/d*m}}pushOut(a,.4)}
 near=null;for(const s of ST)if(Math.hypot(p.x-s.x,p.z-s.z)<3){near=s;break}
}
for(let i=dy.length-1;i>=0;i--){const d=dy[i];d.t+=dt;d.g.rotation.x=-Math.min(1.5,d.t*4);if(d.t>3){S.remove(d.g);dy.splice(i,1)}}
// camera + gun
const mv=Math.hypot(mx,my)>.1||K.KeyW||K.KeyA||K.KeyS||K.KeyD;
cam.position.set(p.x,dead?.6:1.7+(mv?Math.sin(bob)*.05:0),p.z);cam.rotation.set(dead?-.2:p.pitch,p.yaw,dead?.6:0);
rc=Math.max(0,rc-dt*.6);const u=rl>0?1-rl/W[ar||p.wk].rel:-1,e3=t=>t*t*(3-2*t),sm=(a,b)=>e3(Math.max(0,Math.min(1,(u-a)/(b-a)))),m3=(A,B,t)=>[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t];
const GP=[.2,-.19+(mv?Math.sin(bob)*.008:0),-.5],yw=.07,cs=Math.cos(yw),sn=Math.sin(yw);
// support-hand rest spot = gun position + offset, turned with the gun's yaw and lifted with the recoil kick
const HR=[GP[0]+LR[0]*cs+LR[2]*sn,GP[1]+LR[1]-LR[2]*Math.sin(rc*1.6),GP[2]+rc-LR[0]*sn+LR[2]*cs];
let gx=GP[0],gy=GP[1],gz=GP[2]+rc,grx=rc*1.6,gry=yw,grz=0,h=HR,mgv=false;
if(u>=0){const up=sm(0,.2)-sm(.8,1),HO=[-.4,-.75,-.35],HI=[GP[0]-.1,GP[1]-.09,GP[2]-.05+(LR[2]<-.1?LR[2]*.3:0)];gx-=.1*up;gy+=.05*up;grx=.95*up;grz=-.4*up;gry=yw+.1*up;if(p.wk=='pistol'||p.wk=='plasma')grz+=sm(.8,.97)*6.283;
if(u<.1)h=m3(HR,HO,sm(0,.1));else if(u<.45)h=m3(HO,HI,sm(.1,.45));else if(u<.6){h=HI.slice();h[1]+=.04*Math.sin(Math.PI*(u-.45)/.15)}else if(u<.85)h=m3(HI,HO,sm(.6,.85));else h=m3(HO,HR,sm(.85,1));mgv=u>.12&&u<.52}
gun.position.set(gx,gy,gz);gun.rotation.set(grx,gry,grz);lh.position.set(h[0],h[1],h[2]);lh.rotation.y=gry;mg.visible=mgv;mf.visible=fl>0;if(fl>0)mf.rotation.z=Rn()*6;VS.visible=!dead;




fl-=dt;if(fl<=0)flash.intensity=0;lamps.forEach((l,i)=>l.intensity=1.1+Math.sin(now*.011+i*2.3)*.2-(Rn()<.03?.9:0));if(mgv){flash.color.setHex(0xffa030);flash.intensity=1.8;flash.position.set(h[0],h[1]+.15,h[2])}else if(fl<=0){flash.color.setHex(0xffc060);flash.position.set(0,0,-1)}
if(mgv){vfl.color.setHex(0xffa030);vfl.intensity=1.6;vfl.position.set(h[0],h[1]+.1,h[2])}else if(fl>0){vfl.color.setHex(0xffc060);vfl.intensity=2.2;vfl.position.set(gx,gy+.1,gz-.4)}else vfl.intensity=0;
// hud
hm=Math.max(0,hm-dt*5);$('hm').style.opacity=hm;hv=Math.max(0,hv-dt*2);$('vig').style.opacity=Math.min(1,Math.pow(1-p.hp/p.max,1.5)*.9+hv*.6);
$('rd').textContent=Math.max(1,rd);$('pk').textContent=p.perk?'♥ TOUGH SKIN':'';$('pt').textContent=p.pts;$('hpf').style.width=(p.hp/p.max*100)+'%';
const w=W[p.wk],a=ammo[p.wk];$('am').innerHTML=(rl>0?'...':a.m)+' / '+a.r+'<small>'+w.n+'</small>';
const bb=$('buy');if(near&&!dead){const c=cost(near),t=near.n+'<br>'+(c?c:'OWNED');if(bb.dataset.t!=t){bb.dataset.t=t;bb.innerHTML=t}bb.style.display='grid';bb.style.opacity=c&&p.pts>=c?1:.45}else bb.style.display='none';
R.render(S,cam);R.clearDepth();R.render(VS,vcam)}
requestAnimationFrame(loop);
