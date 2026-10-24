(()=>{
'use strict';
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));}
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Scroll reveals: enhancement only, page remains fully readable without JS.
if(!reduce&&'IntersectionObserver' in window){
 const targets=[...document.querySelectorAll('.intro-grid > *, .services-heading, .service-tile, .section-top, .project, .service, .process .container > *, .statement .container > *, .mini-cta-inner > *, .contact .container > *')];
 const io=new IntersectionObserver(entries=>{entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('nl-in');io.unobserve(target)}})},{threshold:.09,rootMargin:'0px 0px -24px 0px'});
 targets.forEach((el,i)=>{el.classList.add('nl-reveal');el.style.transitionDelay=`${(i%3)*80}ms`;io.observe(el)});
 document.body.classList.add('motion-ready');
}
// Portfolio: usable arrows, touch swipe, keyboard focus, and original card layout preserved on smaller JS fallbacks.
document.querySelectorAll('.work-grid').forEach(grid=>{
 const cards=[...grid.querySelectorAll('.project')];if(cards.length<2)return;
 const controls=document.createElement('div');controls.className='nl-portfolio-controls';
 const counter=document.createElement('span');counter.className='nl-portfolio-count';counter.setAttribute('aria-live','polite');
 const prev=document.createElement('button');prev.type='button';prev.textContent='←';prev.setAttribute('aria-label','Previous project');
 const next=document.createElement('button');next.type='button';next.textContent='→';next.setAttribute('aria-label','Next project');
 controls.append(counter,prev,next);grid.parentNode.insertBefore(controls,grid);grid.classList.add('nl-portfolio-mode');
 let selected=0;
 const activate=(idx,scroll=true)=>{selected=(idx+cards.length)%cards.length;cards.forEach((c,i)=>c.classList.toggle('nl-active',i===selected));counter.textContent=`${String(selected+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;if(scroll)grid.scrollTo({left:cards[selected].offsetLeft-grid.offsetLeft,behavior:reduce?'auto':'smooth'});};
 prev.addEventListener('click',()=>activate(selected-1));next.addEventListener('click',()=>activate(selected+1));
 let t;grid.addEventListener('scroll',()=>{clearTimeout(t);t=setTimeout(()=>{let best=0,d=Infinity;cards.forEach((c,i)=>{const delta=Math.abs(c.getBoundingClientRect().left-grid.getBoundingClientRect().left);if(delta<d){d=delta;best=i}});activate(best,false)},100)},{passive:true});activate(0,false);
});
// Expandable service details retain all originally visible service descriptions.
document.querySelectorAll('.service').forEach((row,idx)=>{
 const heading=row.querySelector('h3');const desc=row.querySelector('p');if(!heading||!desc)return;
 const name=heading.textContent.trim();const toggleBtn=document.createElement('button');toggleBtn.type='button';toggleBtn.className='nl-service-toggle';toggleBtn.setAttribute('aria-expanded','false');toggleBtn.setAttribute('aria-label',`More about ${name}`);
 heading.parentNode.insertBefore(toggleBtn,heading);toggleBtn.appendChild(heading);
 const detail=document.createElement('div');detail.className='nl-service-detail';detail.id=`service-detail-${idx}`;detail.hidden=true;detail.textContent=`Let's discuss how ${name.toLowerCase()} can support your goals. Get in touch for a tailored scope and next steps.`;toggleBtn.setAttribute('aria-controls',detail.id);desc.insertAdjacentElement('afterend',detail);
 const arrow=row.querySelector('b');if(arrow)arrow.setAttribute('aria-hidden','true');
 toggleBtn.addEventListener('click',()=>{const open=toggleBtn.getAttribute('aria-expanded')==='true';toggleBtn.setAttribute('aria-expanded',String(!open));detail.hidden=open;});
});
// Subtle process scroll progress, never intercepts page scrolling.
document.querySelectorAll('section.process').forEach(section=>{
 const wrap=section.querySelector('.container');if(!wrap)return;
 const track=document.createElement('div');track.className='nl-process-progress';track.setAttribute('aria-hidden','true');track.innerHTML='<span></span>';wrap.insertBefore(track,wrap.children[1]||null);
 if(reduce)return;const bar=track.firstElementChild;let ticking=false;const update=()=>{const rect=section.getBoundingClientRect();const range=Math.max(1,rect.height+window.innerHeight*.45);bar.style.width=`${Math.max(0,Math.min(100,(window.innerHeight*.7-rect.top)/range*100))}%`;ticking=false};window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});update();
});
// Contact CTA: slight pointer-follow movement on fine pointer devices only.
if(!reduce&&window.matchMedia('(pointer:fine)').matches){document.querySelectorAll('.contact-button').forEach(btn=>{if(btn.closest('.mini-cta'))return;btn.classList.add('nl-cta-magnetic');btn.addEventListener('pointermove',e=>{const r=btn.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)/r.width,dy=(e.clientY-r.top-r.height/2)/r.height;btn.style.transform=`translate(${dx*7}px,${dy*7}px)`});btn.addEventListener('pointerleave',()=>{btn.style.transform=''});btn.addEventListener('blur',()=>{btn.style.transform=''})});}
})();


/* Venom CTA: capture → tension → release → anchored spring recoil.
   Reference: 10.mp4, especially the releases around 2.6–3.0s and 3.7–4.1s. */
function initVenomCTA(anchor){
 'use strict';
 anchor.classList.add('nl-venom-cta');
 anchor.classList.remove('nl-cta-magnetic');
 anchor.innerHTML='<span class="nl-venom-label">Start a conversation</span><span class="nl-venom-arrow" aria-hidden="true">↗</span><span class="nl-venom-drips" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>';
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const ns='http://www.w3.org/2000/svg';
 const count=24,captureDistance=18,releaseDistance=115;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const random=i=>{const n=Math.sin(i*127.1+311.7)*43758.5453;return n-Math.floor(n);};
 const svg=document.createElementNS(ns,'svg');
 svg.setAttribute('class','nl-venom-layer');
 svg.setAttribute('aria-hidden','true');
 svg.setAttribute('focusable','false');
 const defs=document.createElementNS(ns,'defs');
 defs.innerHTML='<linearGradient id="nl-venom-liquid" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#303938"/><stop offset=".12" stop-color="#111615"/><stop offset=".3" stop-color="#050707"/><stop offset=".48" stop-color="#171d1c"/><stop offset=".64" stop-color="#020303"/><stop offset=".82" stop-color="#202625"/><stop offset="1" stop-color="#050707"/></linearGradient><linearGradient id="nl-venom-ridge" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#8b9998" stop-opacity=".02"/><stop offset=".45" stop-color="#c6d5d3" stop-opacity=".34"/><stop offset=".68" stop-color="#aebcbb" stop-opacity=".12"/><stop offset="1" stop-color="#8b9998" stop-opacity="0"/></linearGradient><linearGradient id="nl-venom-glint" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffffff" stop-opacity=".94"/><stop offset=".48" stop-color="#e3eeee" stop-opacity=".58"/><stop offset="1" stop-color="#aabec2" stop-opacity=".02"/></linearGradient><linearGradient id="nl-venom-blood" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#050606"/><stop offset=".32" stop-color="#25302f"/><stop offset=".52" stop-color="#080a0a"/><stop offset=".76" stop-color="#303a39"/><stop offset="1" stop-color="#050606"/></linearGradient>';
 svg.append(defs);
 const makePath=className=>{const p=document.createElementNS(ns,'path');p.setAttribute('class',className);svg.append(p);return p;};
 const strands=Array.from({length:count},(_,i)=>({
  body:makePath('nl-venom-thread'),ridge:makePath('nl-venom-ridge'),blood:makePath('nl-venom-bloodline'),shine:makePath('nl-venom-shine'),
  u:0,v:0,x:0,y:0,vx:0,vy:0,
  phase:random(i+1)*Math.PI*2,width:.35+random(i+31)*1.8,
  bulgeAt:.18+random(i+211)*.66,bulge:.18+random(i+241)*.68,waveGain:.65+random(i+271)*1.2,
  bulgeAt2:.12+random(i+331)*.78,bulge2:.18+random(i+351)*.72,
  shineStart:2+Math.floor(random(i+371)*7),shineLength:3+Math.floor(random(i+391)*7),
  orbitPhase:random(i+451)*Math.PI*2,orbitSpeed:.00022+random(i+471)*.0005,orbitRadius:1+random(i+491)*4,curlRadius:2+random(i+511)*7,
  stiffness:740+random(i+71)*250,damping:15+random(i+91)*3
 }));
 document.body.append(svg);
 let mode='idle',pointer={x:-10000,y:-10000,vx:0,vy:0,time:0},raf=0,previous=0,releasedAt=0,accumulator=0;
 function distance(r,p){return Math.hypot(p.x-clamp(p.x,r.left,r.right),p.y-clamp(p.y,r.top,r.bottom));}
 function root(s,r){return {x:r.left+s.u*r.width,y:r.top+s.v*r.height};}
 function reset(){
  if(raf)cancelAnimationFrame(raf);
  raf=0;mode='idle';previous=0;accumulator=0;
  svg.classList.remove('nl-on');
  anchor.classList.remove('nl-grab-active');
  strands.forEach(s=>{s.body.setAttribute('d','');s.ridge.setAttribute('d','');s.blood.setAttribute('d','');s.shine.setAttribute('d','');});
 }
 function capture(r){
  // Fix roots along the top and bottom edges for the whole gesture; they never jump sides.
  const half=count/2;
  const spread=Math.max(0,r.width-30);
  const centerX=(r.left+r.right)/2;
  strands.forEach((s,i)=>{
   const t=clamp(((i%half)+.5+(random(i+150)-.5)*1.15)/half,.025,.975);
   s.u=(centerX-r.left+(t-.5)*spread)/r.width;
   s.v=i<half?15/r.height:1-15/r.height;
   const a=root(s,r);s.x=a.x;s.y=a.y;s.vx=0;s.vy=0;
  });
  mode='attached';svg.classList.add('nl-on');anchor.classList.add('nl-grab-active');
 }
 function release(now){
  if(mode!=='attached')return;
  mode='recoil';releasedAt=now;anchor.classList.remove('nl-grab-active');
  const r=anchor.getBoundingClientRect();
  // A sharp impulse toward each fixed root produces a real opposite-side overshoot.
  strands.forEach(s=>{const a=root(s,r);s.vx=(a.x-s.x)*7+s.vx*.08;s.vy=(a.y-s.y)*7+s.vy*.08;});
 }
 function curve(points,close=false){
  if(!points.length)return '';
  const f=n=>n.toFixed(2);
  let d=`M${f(points[0].x)},${f(points[0].y)}`;
  for(let j=0;j<points.length-1;j++){
   const a=points[Math.max(0,j-1)],b=points[j],c=points[j+1],e=points[Math.min(points.length-1,j+2)];
   d+=`C${f(b.x+(c.x-a.x)/6)},${f(b.y+(c.y-a.y)/6)} ${f(c.x-(e.x-b.x)/6)},${f(c.y-(e.y-b.y)/6)} ${f(c.x)},${f(c.y)}`;
  }
  return d+(close?'Z':'');
 }
 function render(r,now){
  strands.forEach(s=>{
   const a=root(s,r),dx=s.x-a.x,dy=s.y-a.y,length=Math.hypot(dx,dy);
   if(length<.7){s.body.setAttribute('d','');s.ridge.setAttribute('d','');s.blood.setAttribute('d','');s.shine.setAttribute('d','');return;}
   const nx=-dy/length,ny=dx/length,tension=clamp(length/releaseDistance,0,1);
   // Slack curls become taut under load, as in the clip; they do not keep wriggling at full stretch.
   const slack=(mode==='recoil'?2.3:2+22*(1-tension)**2)*Math.min(1,length/24);
   const muscle=1+.045*Math.sin(now*.0035+s.phase);
   const upper=[],lower=[],center=[],ridgeUpper=[],ridgeLower=[];
   for(let j=0;j<=16;j++){
    const u=j/16,envelope=Math.sin(Math.PI*u),tail=clamp((u-.70)/.30,0,1);
    const wave=(Math.sin(u*Math.PI*(1.6+random(s.phase+2)*1.7)+s.phase+now*.0024)*.53+Math.sin(u*Math.PI*(4.2+random(s.phase+3)*3.4)-s.phase-now*.0031)*.31+Math.sin(u*Math.PI*8.6+s.phase*.73-now*.0043)*.16)*slack*envelope*s.waveGain;
    const curl=(Math.sin(tail*Math.PI*3.4+s.orbitPhase+now*s.orbitSpeed)-Math.sin(s.orbitPhase+now*s.orbitSpeed))*s.curlRadius*tail*(1-tail)*2.2;
    const p={x:a.x+dx*u+nx*(wave+curl),y:a.y+dy*u+ny*(wave+curl)};
    const bulgeAt=s.bulgeAt+.018*Math.sin(now*.0011+s.phase);
    const bulge=1+s.bulge*Math.exp(-(((u-bulgeAt)/.12)**2))+s.bulge2*Math.exp(-(((u-s.bulgeAt2)/.085)**2));
    const ridge=.68+.32*Math.sin((u*4.8+s.phase+now*.00032)*Math.PI)**2;
    const width=1.38*(.1+s.width*(1-u)**1.35*(1.55-.65*tension))*bulge*ridge*muscle*Math.min(1,length/8);
    center.push(p);upper.push({x:p.x+nx*width,y:p.y+ny*width});lower.push({x:p.x-nx*width,y:p.y-ny*width});
    const ridgeCenter={x:p.x+nx*width*.42,y:p.y+ny*width*.42},ridgeWidth=width*(.08+.12*envelope);
    ridgeUpper.push({x:ridgeCenter.x+nx*ridgeWidth,y:ridgeCenter.y+ny*ridgeWidth});ridgeLower.push({x:ridgeCenter.x-nx*ridgeWidth,y:ridgeCenter.y-ny*ridgeWidth});
   }
   const outline=curve(upper.concat(lower.reverse()),true);
   s.body.setAttribute('d',outline);
   s.body.setAttribute('fill','url(#nl-venom-liquid)');
   s.ridge.setAttribute('d',curve(ridgeUpper.concat(ridgeLower.reverse()),true));
   s.blood.setAttribute('d',curve(center));
   s.blood.style.strokeWidth=String(.65+random(s.phase+1171)*.65);
   const glintStart=(s.shineStart+Math.floor(now/85))%center.length;
   const glint=Array.from({length:s.shineLength},(_,j)=>{
    const idx=(glintStart+j)%center.length,p=center[idx],u=idx/16,w=1.38*(.1+s.width*(1-u)**1.35*(1.55-.65*tension));
    return {x:p.x+nx*w*(.28+.18*Math.sin(j+s.phase)),y:p.y+ny*w*(.28+.18*Math.sin(j+s.phase))};
   });
   s.shine.setAttribute('d',curve(glint));
   s.shine.style.strokeWidth=String(.55+random(s.phase+411)*.8);
   s.shine.style.opacity=String(.24+random(s.phase+431)*.4);
  });
 }
 function frame(now){
  raf=0;
  if(mode==='idle'||motion.matches){reset();return;}
  const r=anchor.getBoundingClientRect();
  if(r.bottom<0||r.top>window.innerHeight){reset();return;}
  if(mode==='attached'&&distance(r,pointer)>releaseDistance)release(now);
  const elapsed=previous?Math.min((now-previous)/1000,.04):1/60;
  previous=now;
  const dt=1/240;
  accumulator+=elapsed;
  const steps=Math.floor((accumulator+1e-9)/dt);
  accumulator=Math.max(0,accumulator-steps*dt);
  let settled=true;
  for(let n=0;n<steps;n++){
   strands.forEach(s=>{
    const a=root(s,r),attached=mode==='attached';
    const age=attached?Math.exp(-Math.max(0,now-pointer.time)/85):0;
    const radius=s.orbitRadius,angle=s.orbitPhase+now*s.orbitSpeed;
    const tx=attached?pointer.x+Math.cos(angle)*radius-clamp(pointer.vx*8,-14,14)*age:a.x;
    const ty=attached?pointer.y+Math.sin(angle)*radius-clamp(pointer.vy*8,-14,14)*age:a.y;
    const k=attached?2200+random(s.phase+180)*700:s.stiffness,c=attached?82:s.damping;
    s.vx+=((tx-s.x)*k-s.vx*c)*dt;s.vy+=((ty-s.y)*k-s.vy*c)*dt;
    s.x+=s.vx*dt;s.y+=s.vy*dt;
   });
  }
  for(const s of strands){const a=root(s,r);if(Math.hypot(s.x-a.x,s.y-a.y)>.65||Math.hypot(s.vx,s.vy)>4)settled=false;}
  render(r,now);
  if(mode==='recoil'&&((now-releasedAt>260&&settled)||now-releasedAt>800)){reset();return;}
  raf=requestAnimationFrame(frame);
 }
 function start(){if(!raf){previous=0;raf=requestAnimationFrame(frame);}}
 function move(e){
  if(e.pointerType==='touch'||motion.matches)return;
  const now=performance.now(),dt=pointer.time?Math.max(1,now-pointer.time):16;
  const vx=pointer.time?clamp((e.clientX-pointer.x)/dt,-2,2):0,vy=pointer.time?clamp((e.clientY-pointer.y)/dt,-2,2):0;
  pointer.vx=pointer.vx*.58+vx*.42;pointer.vy=pointer.vy*.58+vy*.42;pointer.time=now;
  pointer.x=e.clientX;pointer.y=e.clientY;
  if(mode==='idle'&&distance(anchor.getBoundingClientRect(),pointer)<=captureDistance)capture(anchor.getBoundingClientRect());
  if(mode==='attached'&&distance(anchor.getBoundingClientRect(),pointer)>releaseDistance)release(performance.now());
  if(mode!=='idle')start();
 }
 document.addEventListener('pointermove',move,{passive:true});
 anchor.addEventListener('pointerenter',move,{passive:true});
 let touchRelease=0;
 anchor.addEventListener('pointerdown',e=>{
  if(e.pointerType!=='touch'||motion.matches)return;
  clearTimeout(touchRelease);
  const r=anchor.getBoundingClientRect();pointer.x=e.clientX;pointer.y=e.clientY;pointer.time=performance.now();
  if(mode==='idle')capture(r);
  strands.forEach(s=>{s.x=pointer.x+(random(s.phase+981)-.5)*12;s.y=pointer.y+(random(s.phase+991)-.5)*12;});
  start();
  touchRelease=setTimeout(()=>{release(performance.now());if(mode!=='idle')start();},420);
 },{passive:true});
 anchor.addEventListener('pointerup',()=>{if(mode==='attached'){clearTimeout(touchRelease);touchRelease=setTimeout(()=>{release(performance.now());if(mode!=='idle')start();},100);}},{passive:true});
 anchor.addEventListener('focus',()=>{
  if(motion.matches||mode!=='idle')return;
  const r=anchor.getBoundingClientRect();pointer.x=(r.left+r.right)/2;pointer.y=(r.top+r.bottom)/2;pointer.time=performance.now();capture(r);
  strands.forEach(s=>{const a=root(s,r);s.x=a.x+(random(s.phase+1011)-.5)*9;s.y=a.y+(s.v<.5?-1:1)*(12+random(s.phase+1021)*24);});
  start();touchRelease=setTimeout(()=>{release(performance.now());if(mode!=='idle')start();},360);
 });
 anchor.addEventListener('blur',()=>{clearTimeout(touchRelease);release(performance.now());if(mode!=='idle')start();});
 document.addEventListener('pointerout',e=>{if(!e.relatedTarget){release(performance.now());if(mode!=='idle')start();}});
 window.addEventListener('blur',()=>{release(performance.now());if(mode!=='idle')start();});
 window.addEventListener('scroll',reset,{passive:true});
 window.addEventListener('resize',reset,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
 motion.addEventListener('change',reset);
}
document.querySelectorAll('.mini-cta .contact-button').forEach(initVenomCTA);
