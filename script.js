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
