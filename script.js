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
if(!reduce&&window.matchMedia('(pointer:fine)').matches){document.querySelectorAll('.contact-button').forEach(btn=>{btn.classList.add('nl-cta-magnetic');btn.addEventListener('pointermove',e=>{const r=btn.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)/r.width,dy=(e.clientY-r.top-r.height/2)/r.height;btn.style.transform=`translate(${dx*7}px,${dy*7}px)`});btn.addEventListener('pointerleave',()=>{btn.style.transform=''});btn.addEventListener('blur',()=>{btn.style.transform=''})});}
})();


/* NEXLYNK · VENOM INTERACTION V8
   Inspired by the publicly documented Nexus UI Venom Button states.
   Independently authored, not the proprietary/original component source.
   SVG goo tendrils + spring cursor following + tension-triggered release.
*/
(()=>{
 'use strict';
 if(window.__nlVenom8) return; window.__nlVenom8=true;
 const anchor=document.querySelector('.mini-cta .contact-button');
 if(!anchor)return;
 anchor.classList.remove('venom-button','nl-cta-magnetic');
 anchor.classList.add('nl-venom-cta');
 const original=anchor.textContent.trim();
 anchor.innerHTML='<span class="nl-venom-label">Start a conversation</span><span class="nl-venom-arrow" aria-hidden="true">↗</span>';
 anchor.setAttribute('aria-label','Start a conversation');
 anchor.setAttribute('href','contact.html');
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 if(!fine.matches||motion.matches)return;
 const ns='http://www.w3.org/2000/svg',N=7;
 const svg=document.createElementNS(ns,'svg');
 svg.setAttribute('class','nl-venom-layer');svg.setAttribute('aria-hidden','true');
 svg.setAttribute('width','100%');svg.setAttribute('height','100%');
 const paths=[],hairs=[];
 for(let i=0;i<N;i++){
  const p=document.createElementNS(ns,'path');p.setAttribute('class','nl-venom-thread');svg.append(p);paths.push(p);
  const h=document.createElementNS(ns,'path');h.setAttribute('class','nl-venom-hair');svg.append(h);hairs.push(h);
 }
 const glove=document.createElementNS(ns,'svg');glove.setAttribute('class','nl-venom-cursor');glove.setAttribute('viewBox','0 0 42 54');glove.setAttribute('aria-hidden','true');
 glove.innerHTML='<path d="M9 29V10c0-4 2-6 5-6s5 2 5 6v13c2-3 6-4 8-1 2-2 6-1 7 2 5-1 7 3 7 7v10c0 6-5 11-12 11H18c-6 0-10-3-13-8L1 38c-2-4 1-8 4-8 2 0 3 1 4 3Z" fill="#fbfaf5" stroke="#151816" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/><path d="M19 23v13M27 23v12M34 25v10" stroke="#4c4e49" stroke-width="1.65" stroke-linecap="round" fill="none"/>';
 document.body.append(svg,glove);
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
 const dist=(x,y)=>Math.hypot(x,y);
 let m={x:-1000,y:-1000},lastMouse={x:-1000,y:-1000};
 let glow=0,engaged=false,held=false,grabAt=0,releaseUntil=0,running=false,prev=performance.now(),demo=false,t=0;
 const state=Array.from({length:N},(_,i)=>({x:0,y:0,vx:0,vy:0,base:0,phase:i*1.67,w:[4.0,2.0,6.0,3.0,5.4,2.25,3.25][i],offset:(i-(N-1)/2)*6.0}));
 function closest(rect,x,y){
  const cx=clamp(x,rect.left+16,rect.right-16),cy=clamp(y,rect.top+15,rect.bottom-15);
  const dx=x-clamp(x,rect.left,rect.right),dy=y-clamp(y,rect.top,rect.bottom);
  return {x:cx,y:cy,dist:dist(dx,dy)};
 }
 function attach(rect,p,i){
  const centerX=(rect.left+rect.right)/2,centerY=(rect.top+rect.bottom)/2;
  const dx=p.x-centerX,dy=p.y-centerY;
  let bx,by,tx,ty;
  if(Math.abs(dx/rect.width)>Math.abs(dy/rect.height)){
   bx=dx>0?rect.right-6:rect.left+6;by=clamp(p.y,rect.top+21,rect.bottom-21);tx=0;ty=1;
  }else{
   bx=clamp(p.x,rect.left+31,rect.right-31);by=dy>0?rect.bottom-5:rect.top+5;tx=1;ty=0;
  }
  return {x:bx+tx*state[i].offset,y:by+ty*state[i].offset};
 }
 function pathFor(a,b,w,phase,clock){
  const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy),nx=-dy/Math.max(1,L),ny=dx/Math.max(1,L);
  if(L<2)return '';
  const steps=17,upper=[],lower=[];
  const drift=Math.sin(clock*.0025+phase)*Math.min(8,L*.10);
  for(let j=0;j<=steps;j++){
   const u=j/steps,curve=u*u*(3-2*u);
   const offset=drift*Math.sin(u*Math.PI)*(.4+.6*u)+Math.sin((u*1.55+clock*.0006+phase)*Math.PI*2)*Math.sin(u*Math.PI)*Math.min(2.4,L*.015);
   const x=a.x+dx*curve+nx*offset,y=a.y+dy*curve+ny*offset;
   const taper=(1-u)**.9;let width=w*(.04+1.6*taper) + (.30*Math.sin(u*12+phase)*Math.sin(u*Math.PI));
   width=Math.max(.22,width);upper.push([x+nx*width,y+ny*width]);lower.push([x-nx*width,y-ny*width]);
  }
  const pts=upper.concat(lower.reverse());return 'M'+pts.map(v=>v.map(n=>n.toFixed(1)).join(',')).join('L')+'Z';
 }
 function frame(now){
  running=false;const dt=Math.min((now-prev)/16.67,2.4);prev=now;t+=dt;
  const r=anchor.getBoundingClientRect();
  if(r.bottom < -400||r.top>innerHeight+400){ if(!demo){close();return;}}
  if(demo){
    const elapsed=(now-demo)/1000,period=6.2,k=elapsed%period,amplitude=smooth(0,.9,k)*(1-smooth(4.6,5.8,k));
    if(elapsed>period){demo=false;m.x=-1000;m.y=-1000;}
    m.x=(r.left+r.right)/2+Math.sin(k*1.3)*190*amplitude;
    m.y=r.bottom+95+Math.sin(k*2.1)*60*amplitude;
  }
  const nearest=closest(r,m.x,m.y),d=nearest.dist;
  const inRange=d<290 && m.y>r.top-340&&m.y<r.bottom+340;
  if(inRange&& !engaged){engaged=true;grabAt=now;}
  if(!inRange&&engaged){engaged=false;held=false;releaseUntil=now+380;}
  let power=inRange ? 1-smooth(135,290,d) : Math.max(0,(releaseUntil-now)/380);
  const grab=engaged && d<140;
  const tickGoo=power>0 || releaseUntil>now;
  glow += ((tickGoo?1:0)-glow)*Math.min(1,.17*dt);
  svg.classList.toggle('nl-on',glow>.005);
  // Only hide native cursor while within this section's interactive vicinity.
  const activeCursor=inRange&&!demo&&m.x>r.left-290&&m.x<r.right+290;
  document.body.classList.toggle('nl-venom-follow',activeCursor);
  if(inRange){glove.style.transform=`translate3d(${m.x-9}px,${m.y-7}px,0) rotate(${Math.sin(t*.04)*2.2}deg)`;glove.style.opacity=String(clamp((290-d)/80,0,1));}
  let allRest=true;
  for(let i=0;i<N;i++){
   const s=state[i],a=attach(r,m,i);
   const elastic=grab?1:clamp((290-d)/150,0,1);
   const fingerOffsets=[[-14,-22],[-6,-26],[3,-24],[12,-20],[16,-11],[-12,-6],[8,2]];
   const targetX=m.x+fingerOffsets[i][0],targetY=m.y+fingerOffsets[i][1];
   let goal={x:a.x+(targetX-a.x)*elastic,y:a.y+(targetY-a.y)*elastic};
   const wobble=Math.sin(t*.075+s.phase)*(.6+2.1*power);
   const vx=m.x-a.x,vy=m.y-a.y,L=Math.hypot(vx,vy)||1;
   goal.x+=-vy/L*wobble;goal.y+=vx/L*wobble;
   if(!tickGoo){goal=a;}
   const k=grab?(.055+i*.003):(.045+i*.002);const drag=.76;
   s.vx=(s.vx+(goal.x-s.x)*k*dt)*Math.pow(drag,dt);
   s.vy=(s.vy+(goal.y-s.y)*k*dt)*Math.pow(drag,dt);
   s.x+=s.vx*dt;s.y+=s.vy*dt;
   if(!s.base){s.base=1;s.x=a.x;s.y=a.y;}
   const dest={x:s.x,y:s.y},D=dist(s.x-a.x,s.y-a.y);
   const w=s.w*(.38+.62*power);
   const display=D>3&&(inRange||releaseUntil>now);
   paths[i].setAttribute('d',display?pathFor(a,dest,w,s.phase,now):'');
   paths[i].style.opacity=String(clamp((glow*1.2),0,1));
   // Hairline filaments create multiple distinct speeds at the fringe.
   if(i%2===1&&display){
    const midx=(a.x+dest.x)/2,midy=(a.y+dest.y)/2-3*Math.sin(t*.05+s.phase);
    hairs[i].setAttribute('d',`M${(a.x+3).toFixed(1)},${(a.y+3).toFixed(1)} Q${(midx+4).toFixed(1)},${midy.toFixed(1)} ${(dest.x+(i-3)*3).toFixed(1)},${(dest.y+2).toFixed(1)}`);
    hairs[i].style.opacity=String(glow*.55);
   }else{hairs[i].setAttribute('d','');}
   if(D>3 || Math.abs(s.vx)+Math.abs(s.vy)>1)allRest=false;
  }
  if(glow>.02 || (inRange||releaseUntil>now)||!allRest){running=true;requestAnimationFrame(frame)}
  else close();
 }
 function close(){svg.classList.remove('nl-on');document.body.classList.remove('nl-venom-follow');engaged=false;held=false;for(let i=0;i<N;i++){paths[i].setAttribute('d','');hairs[i].setAttribute('d','');} }
 function start(){if(!running){running=true;prev=performance.now();requestAnimationFrame(frame)}}
 function move(e){if(demo)demo=false; m.x=e.clientX;m.y=e.clientY;start();}
 document.addEventListener('pointermove',move,{passive:true});
 document.addEventListener('pointerleave',()=>{m.x=-1000;m.y=-1000;start()});
 window.addEventListener('blur',()=>{m.x=-1000;m.y=-1000;demo=false;start()});
 window.addEventListener('scroll',()=>{if(engaged)start()},{passive:true});
 window.addEventListener('resize',()=>{if(engaged)start()},{passive:true});
 // Public preview control only. No looping animation on a production site.
 window.NexLynkVenomDemo=()=>{demo=performance.now();start()};
})();

// NexLynkSolutions — WhatsApp Integration
(() => {
  const whatsappNumber = "923288192681";

  const message =
    "Hi NexLynkSolutions! I'm interested in your Design or Business Development services. I'd like to discuss a project.";

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  document.querySelectorAll(".mini-cta .contact-button")
    .forEach((button) => {
      button.href = whatsappUrl;
      button.target = "_blank";
      button.rel = "noopener noreferrer";
      button.setAttribute(
        "aria-label",
        "Start a conversation on WhatsApp"
      );
    });
})();
