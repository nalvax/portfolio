/* Calm, accessible interactions for Benjo's portfolio. */
(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.getElementById('theme');
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('benjo-theme'); } catch (error) {}
  if (savedTheme === 'light') root.classList.add('light');
  const updateThemeButton = () => {
    const light = root.classList.contains('light');
    themeButton.textContent = light ? '☾' : '☼';
    themeButton.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', light ? '#f2f1e9' : '#111716');
  };
  updateThemeButton();
  themeButton.addEventListener('click', () => {
    root.classList.toggle('light');
    try { localStorage.setItem('benjo-theme', root.classList.contains('light') ? 'light' : 'dark'); } catch (error) {}
    updateThemeButton();
  });

  const menuButton = document.getElementById('menu');
  const mobileNav = document.getElementById('mobile-nav');
  const setMenu = (open) => {
    mobileNav.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuButton.addEventListener('click', () => setMenu(mobileNav.hidden));
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !mobileNav.hidden) { setMenu(false); menuButton.focus(); }
  });
  document.addEventListener('click', (event) => {
    if (!mobileNav.hidden && !event.target.closest('#mobile-nav') && !event.target.closest('#menu')) setMenu(false);
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 980 && !mobileNav.hidden) setMenu(false); });

  const header = document.getElementById('site-header');
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 16);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  if ('IntersectionObserver' in window) {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav a');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', isActive);
          if (isActive) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-25% 0px -63% 0px', threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Reflection volumes replace the former placeholder tabs.
/* 3D reflection volumes: lightweight, keyboard-accessible, zero extra dependencies. */
/* Reflection volume choreography: takeoff -> orbit/open -> read -> close/return. */
function initReflectionBooks() {
  const showcase = document.getElementById('reflection-showcase');
  const shelf = document.getElementById('reflection-shelf');
  const reader = document.getElementById('reflection-reader');
  if (!showcase || !shelf || !reader) return;
  const tiles = [...showcase.querySelectorAll('[data-book]')];
  const close = document.getElementById('reader-close');
  const previous = document.getElementById('reader-previous');
  const next = document.getElementById('reader-next');
  const body = document.getElementById('reader-body');
  const book = document.getElementById('reflection-openbook');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const volumes = [
    { id:'prelim', term:'Prelim Term', label:'01 / PRELIM TERM', n:'01', cover:'FIRST<br>PRINCIPLES.', shade:'#f2efe8', ink:'#253a43', index:['Algorithms & Flowcharts','Java Fundamentals','Learning the Basics'] },
    { id:'midterm', term:'Midterm', label:'02 / MIDTERM', n:'02', cover:'THINK.<br>TRACE.<br>REPEAT.', shade:'#e0e7e4', ink:'#274e5e', index:['Input / Process / Output','Problem Decomposition','Tracing & Debugging'] },
    { id:'final', term:'Final Term', label:'03 / FINAL TERM', n:'03', cover:'ALWAYS<br>IN<br>PROGRESS.', shade:'#e5e9e4', ink:'#354b3f', index:['Apply & Test','Review & Improve','Looking Forward'] }
  ];
  let active=-1, lastTrigger=null, phase='idle', timer=0;
  const wait = (callback,ms) => { clearTimeout(timer); timer=setTimeout(callback,reduced.matches?0:ms); };
  const jumpToBooks = () => showcase.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
  const setVolume = (i) => {
    const v=volumes[i];
    const content=document.getElementById('reflection-'+v.id);
    if (!content) return;
    active=i;
    body.replaceChildren(content.content.cloneNode(true));
    body.scrollTop=0;
    document.getElementById('reader-title').innerHTML=v.term+' <em>Reflection</em>';
    document.getElementById('reader-kicker').textContent=v.label;
    document.getElementById('reader-count').textContent=v.n+' / 03';
    document.getElementById('reader-edition').textContent='VOL. '+v.n+' / AN ACADEMIC JOURNAL';
    document.getElementById('reader-figure').textContent=v.n;
    document.getElementById('reader-cover-eyebrow').textContent=v.term.toUpperCase()+' / 2026';
    document.getElementById('reader-cover-text').innerHTML=v.cover;
    book.style.setProperty('--reader-cover',v.shade);
    book.style.setProperty('--reader-ink',v.ink);
    document.getElementById('reflection-book-index').replaceChildren(...v.index.map((text,j)=>{
      const li=document.createElement('li');const label=document.createElement('span');const page=document.createElement('span');
      label.textContent=String(j+1).padStart(2,'0')+' / '+text;
      page.textContent=String(j+1).padStart(2,'0');
      li.append(label,page);return li;
    }));
    previous.disabled=i===0;
    next.disabled=i===volumes.length-1;
  };
  function openVolume(i,trigger) {
    if(phase!=='idle')return;
    phase='takeoff';lastTrigger=trigger;setVolume(i);
    shelf.classList.remove('is-returning');
    tiles.forEach((tile,n)=>tile.classList.toggle('is-chosen',n===i));
    shelf.classList.add('is-opening');
    wait(()=>{
      shelf.hidden=true;reader.hidden=false;reader.classList.remove('is-closing','is-changing','reader-visible');
      phase='opening';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        reader.classList.add('reader-visible');
        close.focus({preventScroll:true});
        wait(()=>phase='reading',reduced.matches?0:1350);
      }));
    },reduced.matches?0:570);
    jumpToBooks();
  }
  function changeVolume(i) {
    if(phase!=='reading'||i<0||i>=volumes.length)return;
    phase='changing';reader.classList.add('is-changing');
    wait(()=>{
      setVolume(i);
      reader.classList.remove('is-changing');
      wait(()=>{phase='reading';},reduced.matches?0:1050);
    },reduced.matches?0:470);
  }
  function closeVolume() {
    if(reader.hidden || phase==='closing')return;
    clearTimeout(timer);phase='closing';
    reader.classList.add('is-closing');reader.classList.remove('reader-visible','is-changing');
    wait(()=>{
      reader.hidden=true;shelf.hidden=false;
      reader.classList.remove('is-closing');
      shelf.classList.remove('is-opening');
      tiles.forEach(t=>t.classList.remove('is-chosen'));
      shelf.classList.add('is-returning');
      if(lastTrigger)lastTrigger.focus({preventScroll:true});
      jumpToBooks();
      wait(()=>{shelf.classList.remove('is-returning');phase='idle';},reduced.matches?0:800);
    },reduced.matches?0:1150);
  }
  tiles.forEach((tile,i)=>tile.addEventListener('click',()=>openVolume(i,tile)));
  close.addEventListener('click',closeVolume);
  previous.addEventListener('click',()=>changeVolume(active-1));
  next.addEventListener('click',()=>changeVolume(active+1));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&!reader.hidden){e.preventDefault();closeVolume();}
    if(!reader.hidden&&phase==='reading'&&e.target!==body){
      if(e.key==='ArrowRight'&&active<2){e.preventDefault();changeVolume(active+1);}
      if(e.key==='ArrowLeft'&&active>0){e.preventDefault();changeVolume(active-1);}
    }
  });
  /* restrained mouse orbit; touch remains a scroll gesture on mobile */
  const scene=reader.querySelector('.reflection-reader__scene');
  if(scene){
    scene.addEventListener('pointermove',e=>{
      if(reduced.matches||e.pointerType==='touch'||reader.hidden||phase!=='reading')return;
      const r=scene.getBoundingClientRect();
      const px=Math.max(-1,Math.min(1,2*(e.clientX-r.left)/r.width-1));
      const py=Math.max(-1,Math.min(1,2*(e.clientY-r.top)/r.height-1));
      book.style.setProperty('--book-tilt-y',(-px*4).toFixed(2)+'deg');
      book.style.setProperty('--book-tilt-x',(py*3).toFixed(2)+'deg');
    });
    scene.addEventListener('pointerleave',()=>{
      book.style.setProperty('--book-tilt-y','0deg');
      book.style.setProperty('--book-tilt-x','0deg');
    });
  }
}
initReflectionBooks();


  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = form.elements.namedItem('name').value.trim();
    const email = form.elements.namedItem('email').value.trim();
    const message = form.elements.namedItem('message').value.trim();
    if (!name || !email || !message) return;
    const subject = encodeURIComponent('Portfolio enquiry from ' + name);
    const body = encodeURIComponent(message + '\n\nFrom: ' + name + '\nReply to: ' + email);
    document.getElementById('form-status').textContent = 'Opening your email app — please send the prepared email from there.';
    window.location.href = 'mailto:BENJO.TERRADO@MY.JRU.EDU?subject=' + subject + '&body=' + body;
  });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
    root.classList.add('js-motion');
  }
})();
