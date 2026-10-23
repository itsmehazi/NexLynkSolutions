const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));document.querySelector('#year').textContent=new Date().getFullYear();

// Progressive enhancement: content remains visible without JavaScript.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const targets = document.querySelectorAll('.intro-grid > div, .section-top, .project, .services-heading, .service, .statement .container, .process-grid > *, .contact .container');
  targets.forEach(el => el.classList.add('motion-reveal'));
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }
  }, { threshold: 0.07, rootMargin: '0px 0px 45px 0px' });
  targets.forEach(el => observer.observe(el));
}
