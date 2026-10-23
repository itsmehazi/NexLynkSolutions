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
// Upgrade only the bottom-right Start a conversation CTA at runtime.
// HTML pages and links can stay as-is; no HTML files need replacing.
document.querySelectorAll('.mini-cta .contact-button').forEach(button=>{
  button.classList.add('venom-button');
  button.setAttribute('aria-label','Start a conversation');
  const copy=button.firstChild?.textContent?.trim() || 'Start a conversation';
  const label=document.createElement('span');
  label.className='venom-button-label';
  label.textContent=copy;
  const arrow=document.createElement('span');
  arrow.className='venom-button-arrow';
  arrow.setAttribute('aria-hidden','true');
  arrow.textContent='↗';
  button.replaceChildren(label,arrow);
});
// Contact CTA: slight pointer-follow movement on fine pointer devices only.
if(!reduce&&window.matchMedia('(pointer:fine)').matches){document.querySelectorAll('.contact-button').forEach(btn=>{btn.classList.add('nl-cta-magnetic');btn.addEventListener('pointermove',e=>{const r=btn.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)/r.width,dy=(e.clientY-r.top-r.height/2)/r.height;btn.style.transform=`translate(${dx*7}px,${dy*7}px)`});btn.addEventListener('pointerleave',()=>{btn.style.transform=''});btn.addEventListener('blur',()=>{btn.style.transform=''})});}
})();


/* Venom-inspired liquid-ink tether. Targets only the bottom-right Start a conversation CTA. */
(()=>{
  'use strict';
  const button=document.querySelector('.mini-cta .venom-button');
  if(!button||!window.matchMedia('(hover:hover) and (pointer:fine)').matches||window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;

  // Decorative SVG sits behind the CTA, never receives clicks, and keeps links fully functional.
  const NS='http://www.w3.org/2000/svg';
  const el=(tag,attrs={})=>{const node=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,v);return node};
  const svg=el('svg',{class:'venom-fluid-layer','aria-hidden':'true',focusable:'false',preserveAspectRatio:'none'});
  const group=el('g');
  const ribbon=el('path',{class:'venom-ink-shape'});
  const thin1=el('path',{class:'venom-ink-shape'});
  const thin2=el('path',{class:'venom-ink-shape'});
  const shine=el('path',{class:'venom-ink-shine','stroke-width':'1.5'});
  const bead1=el('circle',{class:'venom-ink-shape',r:'3.3'});
  const bead2=el('circle',{class:'venom-ink-shape',r:'1.9'});
  const hand=el('g',{class:'venom-hand'});
  // Hand-shaped pointer at the end of the ink tendrils, like the supplied video.
  const handPath=el('path',{d:'M8 12.7 V3.8 a1.8 1.8 0 0 1 3.6 0 v5.4 a1.8 1.8 0 0 1 3.3.9 a1.8 1.8 0 0 1 3.3 1 a1.8 1.8 0 0 1 2.8 1.5 v4.5 c0 2.3-1.8 4.1-4.1 4.1 h-4.6 c-1.5 0-2.8-.7-3.7-1.9 l-4.8-5.7 a1.9 1.9 0 0 1 2.8-2.6 z'});
  hand.appendChild(handPath);
  group.append(thin1,thin2,ribbon,shine,bead1,bead2,hand);
  svg.appendChild(group);document.body.appendChild(svg);
  const state={x:0,y:0,tx:0,ty:0,active:false,frame:0,pointerX:-999,pointerY:-999,started:0};
  const size=()=>svg.setAttribute('viewBox',`0 0 ${window.innerWidth} ${window.innerHeight}`);
  size();window.addEventListener('resize',size,{passive:true});
  const isNear=(x,y,r)=>Math.hypot(Math.max(r.left-x,0,x-r.right),Math.max(r.top-y,0,y-r.bottom))<175;
  const setActive=active=>{if(state.active===active)return;state.active=active;svg.classList.toggle('is-active',active);if(active){state.started=performance.now();request()} };
  const onMove=e=>{
    if(e.pointerType&&e.pointerType!=='mouse')return;
    state.pointerX=e.clientX;state.pointerY=e.clientY;
    const r=button.getBoundingClientRect();
    const active=isNear(e.clientX,e.clientY,r);
    setActive(active);
    if(!active)return;
    const x=Math.min(100,Math.max(0,(e.clientX-r.left)/r.width*100));
    button.style.setProperty('--venom-x',`${x}%`);
    state.tx=Math.min(r.right-8,Math.max(r.left+24,e.clientX));
    // While hovering the pill, let the ink drip below it. Following below it elongates the strands.
    state.ty=e.clientY<r.bottom+24 ? r.bottom+88+(r.bottom-e.clientY)*.10 : Math.min(r.bottom+170,e.clientY);
    if(!state.x){state.x=state.tx;state.y=r.bottom+4}
    request();
  };
  const point=(x,y)=>`${x.toFixed(1)} ${y.toFixed(1)}`;
  const draw=(now)=>{
    state.frame=0;if(!state.active)return;
    const r=button.getBoundingClientRect();
    if(r.bottom<0||r.top>innerHeight){setActive(false);return}
    state.x+=(state.tx-state.x)*.15;state.y+=(state.ty-state.y)*.12;
    const elapsed=(now-state.started)/1000;
    const sway=Math.sin(elapsed*4.2)*5.5;
    const anchor=Math.min(r.right-60,Math.max(r.left+54,state.x-20));
    const base=r.bottom-2;
    const length=Math.max(16,state.y-base);
    const tipX=state.x+sway,tipY=base+Math.min(165,length);
    // A closed, tapered organic ribbon forms the glossy liquid connection.
    const startW=16,endW=3.9;
    ribbon.setAttribute('d',`M ${point(anchor-startW,base-2)} C ${point(anchor-17,base+length*.23)} ${point(tipX-7,tipY-length*.48)} ${point(tipX-endW,tipY)} Q ${point(tipX,tipY+9)} ${point(tipX+endW,tipY)} C ${point(tipX+7,tipY-length*.48)} ${point(anchor+17,base+length*.21)} ${point(anchor+startW,base-2)} Z`);
    thin1.setAttribute('d',`M ${point(anchor-30,base-1)} Q ${point(anchor-25,base+length*.48)} ${point(tipX-17+sway*.3,tipY-21)}`);
    thin1.setAttribute('stroke-width','3.5');thin1.setAttribute('fill','none');
    thin2.setAttribute('d',`M ${point(anchor+32,base-1)} C ${point(anchor+25,base+length*.38)} ${point(tipX+28,tipY-length*.38)} ${point(tipX+15,tipY-12)}`);
    thin2.setAttribute('stroke-width','2.5');thin2.setAttribute('fill','none');
    shine.setAttribute('d',`M ${point(anchor-8,base+6)} Q ${point(anchor-8,base+length*.5)} ${point(tipX-3,tipY-20)}`);
    bead1.setAttribute('cx',tipX+20);bead1.setAttribute('cy',tipY-5+Math.sin(elapsed*3)*3);
    bead2.setAttribute('cx',tipX-22);bead2.setAttribute('cy',tipY-10);
    hand.setAttribute('transform',`translate(${(tipX-13).toFixed(1)},${(tipY-3).toFixed(1)}) rotate(${-12+Math.sin(elapsed*3)*4} 13 12) scale(1.12)`);
    state.frame=requestAnimationFrame(draw);
  };
  const request=()=>{if(!state.frame&&state.active)state.frame=requestAnimationFrame(draw)};
  document.addEventListener('pointermove',onMove,{passive:true});
  window.addEventListener('blur',()=>setActive(false));
  document.addEventListener('pointerout',e=>{if(!e.relatedTarget)setActive(false)});
  button.addEventListener('focus',()=>{
    const r=button.getBoundingClientRect();state.tx=r.left+r.width*.55;state.ty=r.bottom+95;
    state.x=state.tx;state.y=state.ty;setActive(true);
  });
  button.addEventListener('blur',()=>setActive(false));
})();
