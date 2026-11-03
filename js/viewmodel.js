/* viewmodel.js - first-person guns and hands. Needs THREE.
   VM.make(kind) -> { gun, lh, mg, mf, r }
   gun: weapon + right hand + right forearm. Origin = centre of the right hand's grip, muzzle points to -z.
   lh : left (support) hand + forearm, positioned by the game at gun position + r.
   mg : glowing magazine held by lh during reloads.  mf: muzzle flash. */
const VM=(()=>{
const T=THREE,ph=(c,s,sp)=>new T.MeshPhongMaterial({color:c,shininess:s,specular:sp});
const steel=ph(0x9aa0a8,90,0xffeedd),dark=ph(0x1d1f22,40,0x444444),poly=ph(0x2b2d31,12,0x111111),wood=ph(0x5b3a22,18,0x221108),
 glove=ph(0x1b1c1f,8,0x0a0a0a),sleeve=ph(0x4b5139,4,0x000000),red=ph(0x8a1a1a,60,0xff8866),
 glow=new T.MeshBasicMaterial({color:0x7dff6a}),amber=new T.MeshBasicMaterial({color:0xffb43a});
const bx=(p,m,w,h,d,x,y,z,rx)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);if(rx)o.rotation.x=rx;p.add(o);return o};
// cylinder along z; r = radius at the +z end (towards the player), r2 = radius at the -z end
const cy=(p,m,r,l,x,y,z,r2)=>{const g=new T.CylinderGeometry(r,r2||r,l,14);g.rotateX(Math.PI/2);const o=new T.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o};
// forearm starting at the wrist (x,y,z) and running back toward the player along (dx,dy,dz), out of frame
const arm=(p,x,y,z,dx,dy,dz)=>{const g=new T.Group(),l=Math.hypot(dx,dy,dz);g.position.set(x,y,z);g.rotation.order='YXZ';g.rotation.set(Math.asin(-dy/l),Math.atan2(dx,dz),0);cy(g,glove,.044,.05,0,0,.02);cy(g,sleeve,.056,.7,0,0,.38,.042);p.add(g)};
const tg=(g,y,z)=>{bx(g,dark,.034,.008,.075,0,y,z);bx(g,dark,.034,.045,.008,0,y+.02,z-.034);bx(g,dark,.008,.026,.01,0,y,z+.03)}; // trigger guard + trigger
const flashQuad=(g,x,y,z,c)=>{const m=new T.MeshBasicMaterial({color:c,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}),f=new T.Group();[0,1.2].forEach(a=>{const o=new T.Mesh(new T.PlaneGeometry(.16,.16),m);o.rotation.z=a;f.add(o)});f.position.set(x,y,z);f.visible=false;g.add(f);return f};
// right hand: palm behind the grip, three fingers wrapped round the front, index along the frame, thumb on the left side
const rhand=g=>{bx(g,glove,.056,.08,.07,.016,.02,.035,-.18);[.02,-.005,-.03].forEach(y=>bx(g,glove,.056,.021,.034,.006,y,-.04));bx(g,glove,.016,.018,.08,.026,.052,-.065);bx(g,glove,.016,.018,.09,-.03,.05,-.02);arm(g,.02,.03,.07,.15,-.3,.6)};
// left hand, pistol style: wraps over the right hand's fingers
const lgrip=l=>{bx(l,glove,.045,.075,.07,0,0,0,-.18);[.034,.009,-.016].forEach(y=>bx(l,glove,.066,.023,.03,.05,y,-.052));bx(l,glove,.016,.018,.11,.016,.082,-.055);arm(l,-.01,-.005,.04,-.2,-.3,.6)};
// left hand, long-gun style: palm under the forend, fingers up the right side, thumb on the left
const lfore=l=>{bx(l,glove,.06,.036,.1,0,0,0);[-.04,-.012,.016,.044].forEach(z=>bx(l,glove,.022,.07,.024,.036,.04,z));bx(l,glove,.02,.05,.06,-.036,.03,-.02);arm(l,-.01,-.005,.06,-.25,-.35,.6)};
const SPEC={
 pistol:{m:[0,.115,-.29],l:lgrip,r:[-.045,-.01,.005],b(g){
  bx(g,wood,.044,.14,.064,0,0,0,-.18);bx(g,dark,.04,.04,.27,0,.07,-.105);bx(g,steel,.046,.05,.3,0,.115,-.1);cy(g,steel,.013,.03,0,.115,-.265);
  bx(g,dark,.01,.016,.014,0,.148,-.23);bx(g,dark,.03,.014,.014,0,.148,.03);[0,1,2,3].forEach(i=>bx(g,dark,.048,.036,.005,0,.118,.01+i*.011));
  bx(g,dark,.012,.022,.018,0,.13,.065);bx(g,dark,.04,.012,.07,0,-.075,.0125,-.18);tg(g,.035,-.07)}},
 smg:{m:[0,.1,-.68],l:lfore,r:[0,.028,-.36],b(g){
  bx(g,poly,.042,.13,.055,0,0,0,-.22);bx(g,dark,.056,.075,.34,0,.098,-.11);bx(g,steel,.04,.012,.3,0,.141,-.12);bx(g,poly,.06,.052,.15,0,.075,-.36);
  cy(g,dark,.013,.22,0,.1,-.55);cy(g,steel,.022,.1,0,.1,-.47);bx(g,dark,.032,.02,.012,0,.15,.02);bx(g,dark,.01,.035,.01,0,.135,-.5);
  bx(g,dark,.032,.17,.05,0,-.02,-.12,.1);bx(g,dark,.03,.045,.14,0,.1,.13);tg(g,.04,-.06)}},
 shot:{m:[0,.1,-.74],l:lfore,r:[0,.018,-.32],b(g){
  bx(g,wood,.042,.12,.055,0,0,0,-.2);bx(g,dark,.052,.07,.22,0,.09,-.06);cy(g,steel,.02,.55,0,.1,-.45);cy(g,dark,.016,.42,0,.055,-.38);
  bx(g,wood,.062,.052,.17,0,.065,-.32);bx(g,wood,.042,.075,.26,0,.07,.18,.08);bx(g,steel,.008,.018,.008,0,.125,-.72);tg(g,.04,-.04)}},
 plasma:{m:[0,.09,-.39],l:lfore,r:[0,.032,-.15],c:0x80ff70,b(g){
  bx(g,red,.044,.13,.056,0,0,0,-.2);bx(g,steel,.064,.075,.3,0,.09,-.11);bx(g,glow,.032,.03,.18,0,.133,-.13);
  cy(g,dark,.036,.03,0,.09,-.285);cy(g,red,.026,.1,0,.09,-.33);tg(g,.04,-.055)}}};
function make(k){const s=SPEC[k],g=new T.Group(),l=new T.Group();s.b(g);rhand(g);s.l(l);
 const mg=bx(l,amber,.034,.13,.05,0,.09,-.02);mg.visible=false;
 return{gun:g,lh:l,mg,mf:flashQuad(g,s.m[0],s.m[1],s.m[2],s.c||0xffc060),r:s.r}}
return{make}})();
