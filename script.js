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
/* Reflection motion V3. A shared-element flight and a single interrupt-safe choreography.
   No library, no layout reads during animation, no swapping display states mid-flight. */
function initReflectionBooks() {
  const showcase=document.getElementById('reflection-showcase');
  const shelf=document.getElementById('reflection-shelf');
  const reader=document.getElementById('reflection-reader');
  if(!showcase||!shelf||!reader)return;
  const scene=reader.querySelector('.reflection-reader__scene');
  const openbook=document.getElementById('reflection-openbook');
  const buttons=[...showcase.querySelectorAll('[data-book]')];
  const closeButton=document.getElementById('reader-close');
  const previous=document.getElementById('reader-previous');
  const next=document.getElementById('reader-next');
  const reflectionBody=document.getElementById('reader-body');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const volumes=[
    {id:'prelim',term:'Prelim Term',label:'01 / PRELIM TERM',n:'01',cover:'FIRST<br>PRINCIPLES.',shade:'#f2efe8',ink:'#253a43',index:['Algorithms & Flowcharts','Java Fundamentals','Learning the Basics']},
    {id:'midterm',term:'Midterm',label:'02 / MIDTERM',n:'02',cover:'THINK.<br>TRACE.<br>REPEAT.',shade:'#e0e7e4',ink:'#274e5e',index:['Input / Process / Output','Problem Decomposition','Tracing & Debugging']},
    {id:'final',term:'Final Term',label:'03 / FINAL TERM',n:'03',cover:'ALWAYS<br>IN<br>PROGRESS.',shade:'#e5e9e4',ink:'#354b3f',index:['Apply & Test','Review & Improve','Looking Forward']}
  ];
  let active=-1,phase='idle',lastTrigger=null,epoch=0,flight=null;
  let shelfHeight=0,readerHeight=0;
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,reduce.matches?0:ms));
  const frame=()=>new Promise(resolve=>requestAnimationFrame(()=>resolve()));
  const cancelled=id=>id!==epoch;
  function setVolume(i){
    const v=volumes[i],source=document.getElementById('reflection-'+v.id);
    if(!source)return;
    active=i;
    reflectionBody.replaceChildren(source.content.cloneNode(true));
    reflectionBody.scrollTop=0;
    document.getElementById('reader-title').innerHTML=v.term+' <em>Reflection</em>';
    document.getElementById('reader-kicker').textContent=v.label;
    document.getElementById('reader-count').textContent=v.n+' / 03';
    document.getElementById('reader-edition').textContent='VOL. '+v.n+' / AN ACADEMIC JOURNAL';
    document.getElementById('reader-figure').textContent=v.n;
    document.getElementById('reader-cover-eyebrow').textContent=v.term.toUpperCase()+' / 2026';
    document.getElementById('reader-cover-text').innerHTML=v.cover;
    openbook.style.setProperty('--reader-cover',v.shade);
    openbook.style.setProperty('--reader-ink',v.ink);
    const index=document.getElementById('reflection-book-index');
    index.replaceChildren(...v.index.map((label,j)=>{
      const li=document.createElement('li');
      const a=document.createElement('span'),b=document.createElement('span');
      a.textContent=String(j+1).padStart(2,'0')+' / '+label;
      b.textContent=String(j+1).padStart(2,'0');
      li.append(a,b);return li;
    }));
    previous.disabled=i===0;next.disabled=i===2;
  }
  function prepStage(){
    shelfHeight=shelf.getBoundingClientRect().height;
    const header=showcase.querySelector('.reflection-showcase__top').getBoundingClientRect().height;
    showcase.style.setProperty('--stage-top',header+'px');
    showcase.style.height=(shelfHeight+header)+'px';
    reader.hidden=false;reader.classList.add('is-active');reader.classList.remove('reader-visible','is-closing','is-changing','is-book-ready');
    readerHeight=reader.getBoundingClientRect().height;
    // Ensure reader is never shorter than the shelf when open.
    readerHeight=Math.max(readerHeight,shelfHeight);
    return header;
  }
  function flightClone(tile,fromRect,toRect,duration,reverse=false){
    const source=tile.querySelector('.reflection-book__object');
    const clone=source.cloneNode(true);
    clone.classList.add('reflection-flight');
    clone.setAttribute('aria-hidden','true');
    const tokenStyles=getComputedStyle(tile);
    ['--cover','--cover-ink','--cover-accent'].forEach(name=>clone.style.setProperty(name,tokenStyles.getPropertyValue(name)));
    Object.assign(clone.style,{
      position:'fixed',left:fromRect.left+'px',top:fromRect.top+'px',
      width:fromRect.width+'px',height:fromRect.height+'px',
      transform:'none',transition:'none',filter:'none',
      pointerEvents:'none',margin:'0'
    });
    document.body.append(clone);
    const dx=toRect.left-fromRect.left,dy=toRect.top-fromRect.top;
    const sx=toRect.width/Math.max(1,fromRect.width),sy=toRect.height/Math.max(1,fromRect.height);
    const eased=reverse?'cubic-bezier(.26,.64,.23,1)':'cubic-bezier(.19,.77,.19,1)';
    const animation=clone.animate([
      {transform:'translate3d(0px,0px,0px) scale(1)',opacity:1,offset:0},
      {transform:`translate3d(${dx*.55}px,${dy*.68-20}px,0px) scale(${1+(sx-1)*.55},${1+(sy-1)*.55})`,opacity:1,offset:.63},
      {transform:`translate3d(${dx}px,${dy}px,0px) scale(${sx},${sy})`,opacity:1,offset:1}
    ],{duration:reduce.matches?1:duration,easing:eased,fill:'forwards'});
    flight={animation,clone};
    return animation.finished.catch(()=>{}).then(()=>{clone.remove();if(flight?.clone===clone)flight=null;});
  }
  async function openVolume(i,trigger){
    if(phase!=='idle')return;
    phase='opening';const mine=++epoch;lastTrigger=trigger;setVolume(i);
    const tile=buttons[i];
    // Capture the original position before any animation class changes.
    const originalRect=tile.querySelector('.reflection-book__object').getBoundingClientRect();
    const header=prepStage();
    await frame();
    if(cancelled(mine))return;
    const targetRect=openbook.getBoundingClientRect();
    buttons.forEach((b,n)=>b.classList.toggle('is-chosen',n===i));
    shelf.classList.add('is-opening','is-flight');
    // Both stages share a single measured coordinate space: never display:none mid-animation.
    const trip=flightClone(tile,originalRect,targetRect,reduce.matches?1:820);
    await wait(reduce.matches?0:90);
    if(cancelled(mine))return;
    showcase.style.height=(readerHeight+header)+'px';
    shelf.style.opacity='0';
    await trip;
    if(cancelled(mine))return;
    reader.classList.add('is-book-ready');
    await frame();await frame();
    if(cancelled(mine))return;
    reader.classList.add('reader-visible');
    await wait(reduce.matches?0:1190);
    if(cancelled(mine))return;
    phase='reading';
    closeButton.focus({preventScroll:true});
  }
  async function closeVolume(){
    if(phase!=='reading'&&phase!=='changing')return;
    const mine=++epoch;phase='closing';
    reader.classList.remove('is-changing','reader-visible');reader.classList.add('is-closing');
    await wait(reduce.matches?0:870);
    if(cancelled(mine))return;
    const fromRect=openbook.getBoundingClientRect();
    const tile=buttons[active];
    shelf.hidden=false;
    shelf.style.opacity='0';
    shelf.classList.remove('is-opening');
    // Paint the return shelf offscreen before measuring, then hide the chosen cover.
    shelf.classList.add('is-flight-out');
    const targetRect=tile.querySelector('.reflection-book__object').getBoundingClientRect();
    const header=showcase.querySelector('.reflection-showcase__top').getBoundingClientRect().height;
    const trip=flightClone(tile,fromRect,targetRect,reduce.matches?1:820,true);
    reader.classList.remove('is-book-ready');
    reader.classList.remove('is-active');
    showcase.style.height=(shelfHeight+header)+'px';
    await wait(reduce.matches?0:260);
    if(cancelled(mine))return;
    shelf.style.opacity='1';
    await trip;
    if(cancelled(mine))return;
    reader.hidden=true;
    reader.classList.remove('is-closing');
    shelf.classList.remove('is-flight','is-flight-out','is-returning');
    buttons.forEach(b=>b.classList.remove('is-chosen'));
    showcase.style.height='';
    phase='idle';
    lastTrigger?.focus({preventScroll:true});
  }
  async function changeVolume(i){
    if(phase!=='reading'||i<0||i>=volumes.length)return;
    const mine=++epoch;phase='changing';
    reader.classList.add('is-changing');
    await wait(reduce.matches?0:600);
    if(cancelled(mine))return;
    setVolume(i);
    reader.classList.remove('is-changing');
    await wait(reduce.matches?0:1250);
    if(cancelled(mine))return;
    phase='reading';
  }
  buttons.forEach((button,i)=>button.addEventListener('click',()=>openVolume(i,button)));
  closeButton.addEventListener('click',closeVolume);
  previous.addEventListener('click',()=>changeVolume(active-1));
  next.addEventListener('click',()=>changeVolume(active+1));
  document.addEventListener('keydown',e=>{
    if(reader.hidden)return;
    if(e.key==='Escape'&&(phase==='reading'||phase==='changing')){e.preventDefault();closeVolume();}
    if(phase==='reading'&&e.target!==reflectionBody){
      if(e.key==='ArrowRight'&&active<2){e.preventDefault();changeVolume(active+1);}
      if(e.key==='ArrowLeft'&&active>0){e.preventDefault();changeVolume(active-1);}
    }
  });
  // Spring-damped pointer orbit; always a transform, never a relayout or heavy filter.
  let aimX=0,aimY=0,tiltX=0,tiltY=0,frameId=0,last=0;
  function orbit(t){
    frameId=0;
    const dt=Math.min(.05,(t-(last||t))/1000);last=t;
    const smoothing=1-Math.exp(-10*dt);
    tiltX+=(aimX-tiltX)*smoothing;
    tiltY+=(aimY-tiltY)*smoothing;
    openbook.style.setProperty('--book-tilt-x',tiltX.toFixed(2)+'deg');
    openbook.style.setProperty('--book-tilt-y',tiltY.toFixed(2)+'deg');
    if(Math.abs(aimX-tiltX)+Math.abs(aimY-tiltY)>.02 && phase==='reading')frameId=requestAnimationFrame(orbit);
  }
  function requestOrbit(){if(!frameId)frameId=requestAnimationFrame(orbit);}
  scene?.addEventListener('pointermove',e=>{
    if(phase!=='reading'||reduce.matches||e.pointerType==='touch')return;
    const rect=scene.getBoundingClientRect();
    aimX=Math.max(-2.4,Math.min(2.4,((e.clientY-rect.top)/rect.height-.5)*4.8));
    aimY=Math.max(-3,Math.min(3,((e.clientX-rect.left)/rect.width-.5)*-6));
    requestOrbit();
  },{passive:true});
  scene?.addEventListener('pointerleave',()=>{aimX=aimY=0;requestOrbit();},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&frameId){cancelAnimationFrame(frameId);frameId=0;}});
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
