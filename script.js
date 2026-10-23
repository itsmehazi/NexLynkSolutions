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
if(!reduce&&window.matchMedia('(pointer:fine)').matches){document.querySelectorAll('.contact-button:not(.venom-button)').forEach(btn=>{btn.classList.add('nl-cta-magnetic');btn.addEventListener('pointermove',e=>{const r=btn.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)/r.width,dy=(e.clientY-r.top-r.height/2)/r.height;btn.style.transform=`translate(${dx*7}px,${dy*7}px)`});btn.addEventListener('pointerleave',()=>{btn.style.transform=''});btn.addEventListener('blur',()=>{btn.style.transform=''})});}
})();


/* === Venom ink strands: scoped to the bottom-right Start a conversation CTA only. === */
(()=>{
 'use strict';
 const buttons=[...document.querySelectorAll('.mini-cta .contact-button.venom-button')];
 if(!buttons.length)return;
 // The hover animation is intentionally desktop-only; mobile gets the glossy pill.
 const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(!fine.matches||reduce.matches)return;
 const ns='http://www.w3.org/2000/svg';
 const node=(tag,attrs)=>{const el=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs||{}))el.setAttribute(k,v);return el};
 const surface=node('svg',{class:'venom-web-overlay','aria-hidden':'true',focusable:'false'});
 const ribbon=node('path',{class:'venom-web-main'});
 const strands=Array.from({length:5},()=>node('path',{class:'venom-web-line'}));
 const highlight=node('path',{class:'venom-web-glint'});
 const drops=Array.from({length:3},()=>node('circle',{class:'venom-web-main'}));
 const hand=node('g',{class:'venom-web-hand'});
 hand.appendChild(node('path',{d:'M9 15 L9 4.8 a2 2 0 0 1 4 0 v6 a2 2 0 0 1 3.9 0.9 a2 2 0 0 1 3.5 1 a2 2 0 0 1 3 1.6 v6.4 c0 3.2-2.6 5.4-5.7 5.4 h-6.9 c-1.9 0-3.2-.75-4.4-2.3 l-5.2-6.2 a2.2 2.2 0 0 1 3.2-3 z'}));
 surface.append(ribbon,...strands,highlight,...drops,hand);
 document.body.appendChild(surface);
 let current=null,raf=0;
 const state={tx:0,ty:0,x:0,y:0,started:0};
 const size=()=>surface.setAttribute('viewBox',`0 0 ${window.innerWidth} ${window.innerHeight}`);
 size();window.addEventListener('resize',size,{passive:true});
 const distance=(x,y,r)=>Math.hypot(Math.max(r.left-x,0,x-r.right),Math.max(r.top-y,0,y-r.bottom));
 function activate(btn,x,y){
   if(current!==btn){current=btn;state.x=x;state.y=y;state.started=performance.now()}
   state.tx=x;state.ty=y;surface.classList.add('is-active');if(!raf)raf=requestAnimationFrame(draw);
 }
 function stop(){current=null;surface.classList.remove('is-active');if(raf){cancelAnimationFrame(raf);raf=0}}
 function track(e){
   if(e.pointerType&&e.pointerType!=='mouse')return;
   const b=buttons.find(button=>distance(e.clientX,e.clientY,button.getBoundingClientRect())<180);
   if(!b){stop();return}
   const r=b.getBoundingClientRect();
   // Follow below button for cinematic dripping web when hovering, or follow cursor directly below pill.
   let tx=e.clientX,ty=e.clientY;
   if(ty<=r.bottom+26)ty=r.bottom+104;
   // Anchor under pill and keep tip near reachable on-screen area.
   tx=Math.min(Math.max(tx,r.left-100),r.right+100);
   ty=Math.min(ty,window.innerHeight-30);
   activate(b,tx,ty);
 }
 const p=(x,y)=>`${x.toFixed(1)} ${y.toFixed(1)}`;
 function draw(now){
   raf=0;if(!current)return;
   const r=current.getBoundingClientRect();
   if(r.bottom<0||r.top>innerHeight){stop();return}
   state.x+=(state.tx-state.x)*.21;state.y+=(state.ty-state.y)*.19;
   const t=(now-state.started)/1000;
   const sway=Math.sin(t*5)*4;
   const tipX=state.x+sway,tipY=Math.max(r.bottom+45,state.y);
   const ax=Math.max(r.left+42,Math.min(r.right-42,tipX));
   const by=r.bottom-1;
   const length=Math.max(40,tipY-by);
   // The ribbon and the smaller tapering strands form a web pulled from the glossy pill.
   const w=15, end=3;
   ribbon.setAttribute('d',`M ${p(ax-w,by)} C ${p(ax-22,by+length*.28)} ${p(tipX-7,tipY-length*.32)} ${p(tipX-end,tipY)} Q ${p(tipX,tipY+8)} ${p(tipX+end,tipY)} C ${p(tipX+8,tipY-length*.32)} ${p(ax+21,by+length*.27)} ${p(ax+w,by)} Z`);
   strands.forEach((line,i)=>{
     const spread=(i-2)*20,ex=tipX+spread*.54+Math.sin(t*3+i)*4;
     const ey=tipY-20-Math.abs(spread)*.26;
     line.setAttribute('d',`M ${p(ax+spread,by)} C ${p(ax+spread*.9,by+length*.30)} ${p(ex+spread*.55,ey-length*.3)} ${p(ex,ey)}`);
     line.setAttribute('stroke-width',String(i===0||i===4?1.7:2.8));
   });
   highlight.setAttribute('d',`M ${p(ax-7,by+5)} Q ${p(ax-11,by+length*.45)} ${p(tipX-3,tipY-20)}`);
   drops.forEach((dot,i)=>{dot.setAttribute('cx',String(tipX+(i-1)*24));dot.setAttribute('cy',String(tipY-22+i*5+Math.sin(t*3+i)*2));dot.setAttribute('r',String([2.4,3.2,2.4][i]))});
   hand.setAttribute('transform',`translate(${(tipX-13).toFixed(1)} ${(tipY-1).toFixed(1)}) rotate(${Math.sin(t*2)*5-7} 12 10) scale(.98)`);
   raf=requestAnimationFrame(draw);
 }
 document.addEventListener('pointermove',track,{passive:true});
 window.addEventListener('blur',stop);
 document.addEventListener('scroll',stop,{passive:true});
 document.addEventListener('pointerout',e=>{if(!e.relatedTarget)stop()});
 buttons.forEach(btn=>{
   btn.addEventListener('pointerenter',e=>{
      if(e.pointerType&&e.pointerType!=='mouse')return;
      const r=btn.getBoundingClientRect();activate(btn,r.left+r.width*.5,r.bottom+104);
   });
   btn.addEventListener('focus',()=>{const r=btn.getBoundingClientRect();activate(btn,r.left+r.width*.55,r.bottom+104)});
   btn.addEventListener('blur',stop);
 });
})();
