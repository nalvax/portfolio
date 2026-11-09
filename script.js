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
    document.querySelector('meta[name="theme-color"]').setAttribute('content', light ? '#f6f5ef' : '#111713');
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
/* Reflection books V4 — continuous, aligned, interrupt-safe choreography.
   The traveling cover is NEVER removed until the actual book is painted beneath it. */
function initReflectionBooks() {
  const showcase = document.getElementById('reflection-showcase');
  const shelf = document.getElementById('reflection-shelf');
  const reader = document.getElementById('reflection-reader');
  const book = document.getElementById('reflection-openbook');
  if (!showcase || !shelf || !reader || !book) return;
  const buttons = Array.from(showcase.querySelectorAll('[data-book]'));
  const closeButton = document.getElementById('reader-close');
  const previous = document.getElementById('reader-previous');
  const next = document.getElementById('reader-next');
  const reflectionBody = document.getElementById('reader-body');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const timing = () => motion.matches ? { flight: 0, open: 0, close: 0, change: 0, fade: 0 } : { flight: 740, open: 940, close: 840, change: 240, fade: 130 };
  const volumes = [
    { id:'prelim', term:'Prelim Term', label:'01 / PRELIM TERM', n:'01', cover:'FIRST<br>PRINCIPLES.', shade:'#f2efe8', ink:'#253a43', index:['Algorithms & Flowcharts','Java Fundamentals','Learning the Basics'] },
    { id:'midterm', term:'Midterm', label:'02 / MIDTERM', n:'02', cover:'THINK.<br>TRACE.<br>REPEAT.', shade:'#e0e7e4', ink:'#274e5e', index:['Input / Process / Output','Problem Decomposition','Tracing & Debugging'] },
    { id:'final', term:'Final Term', label:'03 / FINAL TERM', n:'03', cover:'ALWAYS<br>IN<br>PROGRESS.', shade:'#e5e9e4', ink:'#354b3f', index:['Apply & Test','Review & Improve','Looking Forward'] }
  ];
  let active = -1;
  let phase = 'idle';
  let trigger = null;
  let stageHeight = 0;
  let shelfHeight = 0;
  let stageHeader = 0;
  let overlay = null;
  let overlayAnimation = null;
  let transitionId = 0;
  const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
  const pause = duration => duration ? new Promise(resolve => setTimeout(resolve, duration)) : Promise.resolve();
  const alive = id => transitionId === id;
  const object = i => buttons[i]?.querySelector('.reflection-book__object');

  function fillVolume(i) {
    const volume = volumes[i];
    if (!volume) return;
    const template = document.getElementById('reflection-' + volume.id);
    if (!template) return;
    active = i;
    reflectionBody.replaceChildren(template.content.cloneNode(true));
    reflectionBody.scrollTop = 0;
    document.getElementById('reader-title').innerHTML = volume.term + ' <em>Reflection</em>';
    document.getElementById('reader-kicker').textContent = volume.label;
    document.getElementById('reader-count').textContent = volume.n + ' / 03';
    document.getElementById('reader-edition').textContent = 'VOL. ' + volume.n + ' / AN ACADEMIC JOURNAL';
    document.getElementById('reader-figure').textContent = volume.n;
    document.getElementById('reader-cover-eyebrow').textContent = volume.term.toUpperCase() + ' / 2026';
    document.getElementById('reader-cover-text').innerHTML = volume.cover;
    book.style.setProperty('--reader-cover', volume.shade);
    book.style.setProperty('--reader-ink', volume.ink);
    // The opened hardcover uses the exact same artwork as its shelf counterpart.
    // This prevents the title/artwork from jumping during the shared-element handoff.
    const coverFace = book.querySelector('.reflection-openbook__coverface');
    const oldPrint = coverFace.querySelector('.reflection-cover-print');
    oldPrint?.remove();
    const print = buttons[i].querySelector('.reflection-book__front').cloneNode(true);
    print.classList.add('reflection-cover-print');
    const tileStyle = getComputedStyle(buttons[i]);
    for (const key of ['--cover','--cover-ink','--cover-accent']) {
      print.style.setProperty(key, tileStyle.getPropertyValue(key));
    }
    coverFace.append(print);
    const index = document.getElementById('reflection-book-index');
    index.replaceChildren(...volume.index.map((entry,j) => {
      const li = document.createElement('li');
      const title = document.createElement('span');
      const number = document.createElement('span');
      title.textContent = String(j+1).padStart(2,'0') + ' / ' + entry;
      number.textContent = String(j+1).padStart(2,'0');
      li.append(title, number);
      return li;
    }));
    previous.disabled = i === 0;
    next.disabled = i === volumes.length - 1;
  }

  function cleanupOverlay() {
    if (overlayAnimation) { overlayAnimation.cancel(); overlayAnimation = null; }
    if (overlay) { overlay.remove(); overlay = null; }
  }

  function makeOverlay(i, rect) {
    cleanupOverlay();
    const source = object(i);
    const node = source.cloneNode(true);
    const style = getComputedStyle(buttons[i]);
    node.classList.add('reflection-flight');
    node.setAttribute('aria-hidden', 'true');
    for (const name of ['--cover','--cover-ink','--cover-accent']) node.style.setProperty(name, style.getPropertyValue(name));
    Object.assign(node.style, {
      position:'fixed', left:rect.left + 'px', top:rect.top + 'px',
      width:rect.width + 'px', height:rect.height + 'px',
      transform:'none', transition:'none', filter:'none',
      transformOrigin:'top left', pointerEvents:'none',
      backfaceVisibility:'hidden', margin:'0', opacity:'1'
    });
    document.body.append(node);
    overlay = node;
    return node;
  }

  async function travel(node, from, to, duration, reverse = false) {
    if (!duration) {
      node.style.left = to.left + 'px';
      node.style.top = to.top + 'px';
      node.style.width = to.width + 'px';
      node.style.height = to.height + 'px';
      return;
    }
    const dx = to.left - from.left;
    const dy = to.top - from.top;
    const sx = to.width / Math.max(1,from.width);
    const sy = to.height / Math.max(1,from.height);
    const midpoint = reverse ? .43 : .52;
    const anim = node.animate([
      { transform:'translate3d(0,0,0) scale(1,1)', offset:0 },
      { transform:`translate3d(${(dx*midpoint).toFixed(2)}px,${(dy*midpoint-12).toFixed(2)}px,0) scale(${(1+(sx-1)*midpoint).toFixed(4)},${(1+(sy-1)*midpoint).toFixed(4)})`, offset:midpoint },
      { transform:`translate3d(${dx.toFixed(2)}px,${dy.toFixed(2)}px,0) scale(${sx.toFixed(4)},${sy.toFixed(4)})`, offset:1 }
    ], { duration, easing: reverse?'cubic-bezier(.22,.69,.25,1)':'cubic-bezier(.22,.75,.18,1)', fill:'forwards' });
    overlayAnimation = anim;
    try { await anim.finished; } catch(e) {}
  }

  async function fadeOverlay(id) {
    if (!overlay || !alive(id)) return;
    const node = overlay;
    const dur = timing().fade;
    if (dur) {
      const fade = node.animate([{opacity:1},{opacity:0}],{duration:dur,easing:'ease-out',fill:'forwards'});
      overlayAnimation = fade;
      try { await fade.finished; } catch(e) {}
    }
    if (alive(id)) cleanupOverlay();
  }

  async function prepareReader() {
    const header = showcase.querySelector('.reflection-showcase__top');
    stageHeader = header.getBoundingClientRect().height;
    shelfHeight = shelf.getBoundingClientRect().height;
    showcase.style.setProperty('--stage-top', stageHeader + 'px');
    showcase.style.height = (shelfHeight + stageHeader) + 'px';
    reader.hidden = false;
    reader.classList.remove('reader-visible','is-book-ready','is-closing','is-changing');
    reader.classList.add('is-active');
    reader.style.visibility = 'visible';
    reader.style.pointerEvents = 'auto';
    stageHeight = Math.max(reader.getBoundingClientRect().height,shelfHeight);
    showcase.style.height = (stageHeight + stageHeader) + 'px';
    await nextFrame();
    await nextFrame();
  }

  async function openVolume(i,button) {
    if (phase !== 'idle' || !object(i)) return;
    phase = 'opening';
    const id = ++transitionId;
    trigger = button;
    fillVolume(i);
    const start = object(i).getBoundingClientRect();
    await prepareReader();
    if (!alive(id)) return;
    const end = book.getBoundingClientRect();
    const node = makeOverlay(i, start);
    // Shelf cover stays painted until overlay is mounted; its hiding is atomic.
    shelf.classList.add('is-flight','is-opening');
    buttons.forEach((b,j)=>b.classList.toggle('is-chosen',j===i));
    shelf.classList.add('book-level-flight');
    shelf.style.opacity = '0';
    reader.classList.add('reader-environment');
    await travel(node, start, end, timing().flight);
    if (!alive(id)) return;
    // CLOSED BOOK IS VISIBLE BEFORE THE FLYING COVER IS REMOVED.
    reader.classList.add('is-book-ready');
    await nextFrame();await nextFrame();
    if (!alive(id)) return;
    await fadeOverlay(id);
    if (!alive(id)) return;
    reader.classList.add('reader-visible');
    await pause(timing().open);
    if (!alive(id)) return;
    phase = 'reading';
    closeButton.focus({preventScroll:true});
  }

  async function closeVolume() {
    if (phase !== 'reading') return;
    phase = 'closing';
    const id = ++transitionId;
    reader.classList.add('is-closing');
    reader.classList.remove('reader-visible','is-changing');
    await pause(timing().close);
    if (!alive(id)) return;
    // The closed reader cover is still on screen while the return overlay starts.
    const from = book.getBoundingClientRect();
    const to = object(active).getBoundingClientRect();
    const node = makeOverlay(active, from);
    reader.classList.remove('is-book-ready');
    shelf.classList.remove('is-opening');
    shelf.classList.add('is-flight-out');
    shelf.style.opacity = '1';
    await nextFrame();
    if (!alive(id)) return;
    await travel(node, from, to, timing().flight);
    if (!alive(id)) return;
    // Give selected shelf cover a frame to paint, then crossfade the overlay.
    shelf.classList.remove('is-flight','is-flight-out','book-level-flight');
    buttons.forEach(b=>b.classList.remove('is-chosen'));
    await nextFrame();await nextFrame();
    if (!alive(id)) return;
    await fadeOverlay(id);
    if (!alive(id)) return;
    reader.classList.remove('is-active','reader-environment','is-closing');
    reader.hidden = true;
    reader.style.visibility='';
    reader.style.pointerEvents='';
    showcase.style.height = '';
    shelf.style.opacity = '';
    phase = 'idle';
    trigger?.focus({preventScroll:true});
  }

  async function changeVolume(i) {
    if (phase !== 'reading' || i < 0 || i >= volumes.length || i === active) return;
    phase='changing';
    const id=++transitionId;
    reader.classList.add('is-changing');
    await pause(timing().change);
    if (!alive(id)) return;
    fillVolume(i);
    reader.classList.remove('is-changing');
    await pause(timing().change);
    if (alive(id)) phase='reading';
  }

  buttons.forEach((button,i) => button.addEventListener('click',()=>openVolume(i,button)));
  closeButton.addEventListener('click',closeVolume);
  previous.addEventListener('click',()=>changeVolume(active-1));
  next.addEventListener('click',()=>changeVolume(active+1));
  document.addEventListener('keydown',event => {
    if (reader.hidden) return;
    if (event.key === 'Escape' && phase === 'reading') { event.preventDefault(); closeVolume(); }
    if (phase === 'reading' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) {
      if (event.key === 'ArrowRight' && active < volumes.length-1) { event.preventDefault(); changeVolume(active+1); }
      if (event.key === 'ArrowLeft' && active > 0) { event.preventDefault(); changeVolume(active-1); }
    }
  });
  // The book remains level. Hover never modifies its rotation or causes jitter.
  const mediaChanged = () => {
    if (phase !== 'idle' && phase !== 'reading') return;
    if (phase==='reading') {
      const h=showcase.querySelector('.reflection-showcase__top').getBoundingClientRect().height;
      const r=reader.getBoundingClientRect().height;
      showcase.style.height=(Math.max(r,shelfHeight)+h)+'px';
    }
  };
  window.addEventListener('resize', mediaChanged, {passive:true});
  document.addEventListener('visibilitychange',()=>{
    if (document.hidden && phase!=='idle' && phase!=='reading') {
      // Prevent hidden tabs getting stuck in an unfinishable transition.
      transitionId++;
      cleanupOverlay();
      shelf.classList.remove('is-flight','is-opening','is-flight-out','book-level-flight');
      shelf.style.opacity='';
      buttons.forEach(b=>b.classList.remove('is-chosen'));
      reader.classList.remove('reader-visible','is-book-ready','is-active','is-closing','is-changing','reader-environment');
      reader.hidden=true;
      reader.style.visibility='';reader.style.pointerEvents='';
      showcase.style.height='';
      phase='idle';
    }
  });
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

  // Nash-inspired gallery + PDF archive; native dialogs preserve Escape and focus trapping.
  function initBenjoArchiveViewers() {
    const imageLinks = Array.from(document.querySelectorAll('a[data-view-image]'));
    const pdfLinks = Array.from(document.querySelectorAll('a[data-view-pdf]'));
    if (!imageLinks.length && !pdfLinks.length) return;
    if (!window.HTMLDialogElement || typeof HTMLDialogElement.prototype.showModal !== 'function') return;
    const plainClick = event => !event.defaultPrevented && event.button === 0 &&
      !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;
    let imageDialog = null, pdfDialog = null, previousFocus = null, currentImage = 0;
    function restoreFocus() {
      document.body.classList.remove('benjo-archive-open');
      if (previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
      previousFocus = null;
    }
    function mountImageDialog() {
      if (imageDialog) return;
      imageDialog = document.createElement('dialog');
      imageDialog.className = 'benjo-image-viewer';
      imageDialog.setAttribute('aria-label', 'School Works photo gallery');
      imageDialog.innerHTML = [
        "<div class='benjo-image-panel'>",
        "<div class='benjo-image-top'><span>BENJO / SCHOOL WORKS ARCHIVE</span><button type='button' class='benjo-image-close' aria-label='Close image viewer'>✕</button></div>",
        "<div class='benjo-image-stage'><button type='button' class='benjo-image-prev' aria-label='Previous screenshot'>‹</button><img class='benjo-image-original' alt='Original schoolwork screenshot' draggable='false'><button type='button' class='benjo-image-next' aria-label='Next screenshot'>›</button></div>",
        "<div class='benjo-image-bottom'><div><strong class='benjo-image-name'></strong><p class='benjo-image-caption'></p></div><span class='benjo-image-count' aria-live='polite'></span></div>",
        "</div>"
      ].join('');
      document.body.appendChild(imageDialog);
      imageDialog.querySelector('.benjo-image-close').addEventListener('click', () => imageDialog.close());
      imageDialog.querySelector('.benjo-image-prev').addEventListener('click', () => switchImage(-1));
      imageDialog.querySelector('.benjo-image-next').addEventListener('click', () => switchImage(1));
      imageDialog.addEventListener('click', e => { if (e.target === imageDialog) imageDialog.close(); });
      imageDialog.addEventListener('close', restoreFocus);
      imageDialog.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); switchImage(-1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); switchImage(1); }
      });
      let startingX = null;
      const stage = imageDialog.querySelector('.benjo-image-stage');
      stage.addEventListener('touchstart', e => {
        if (e.touches.length === 1) startingX = e.touches[0].clientX;
      }, { passive: true });
      stage.addEventListener('touchend', e => {
        if (startingX === null || e.changedTouches.length !== 1) return;
        const difference = e.changedTouches[0].clientX - startingX;
        startingX = null;
        if (Math.abs(difference) > 65) switchImage(difference < 0 ? 1 : -1);
      }, { passive: true });
    }
    function showImage(index) {
      currentImage = (index + imageLinks.length) % imageLinks.length;
      const link = imageLinks[currentImage], photo = imageDialog.querySelector('.benjo-image-original');
      photo.src = link.href;
      photo.alt = link.querySelector('img')?.alt || link.dataset.viewTitle || 'Original screenshot';
      imageDialog.querySelector('.benjo-image-name').textContent = link.dataset.viewTitle || 'School Works';
      imageDialog.querySelector('.benjo-image-caption').textContent = link.dataset.viewSubtitle || 'Original CodeChum activity screenshot';
      imageDialog.querySelector('.benjo-image-count').textContent =
        String(currentImage + 1).padStart(2, '0') + ' / ' + String(imageLinks.length).padStart(2, '0');
    }
    function switchImage(delta) { showImage(currentImage + delta); }
    imageLinks.forEach((link, index) => link.addEventListener('click', e => {
      if (!plainClick(e)) return;
      e.preventDefault();
      mountImageDialog();
      previousFocus = document.activeElement;
      showImage(index);
      imageDialog.showModal();
      document.body.classList.add('benjo-archive-open');
      imageDialog.querySelector('.benjo-image-close').focus({ preventScroll: true });
    }));
    function mountPdfDialog() {
      if (pdfDialog) return;
      pdfDialog = document.createElement('dialog');
      pdfDialog.className = 'benjo-pdf-viewer';
      pdfDialog.setAttribute('aria-label', 'Original certificate PDF viewer');
      pdfDialog.innerHTML = [
        "<div class='benjo-pdf-panel'>",
        "<button type='button' class='benjo-pdf-close' aria-label='Close PDF viewer'>✕</button>",
        "<div class='benjo-pdf-header'><span class='benjo-pdf-kicker'>BENJO TERRADO / CREDENTIAL ARCHIVE</span><h2 class='benjo-pdf-name'></h2><p>Original completion certificate · Non-credit independent learning</p></div>",
        "<div class='benjo-pdf-document'><iframe class='benjo-pdf-iframe' title='Original certificate PDF' loading='lazy'></iframe><div class='benjo-pdf-loading' role='status'>Opening certificate…</div></div>",
        "<div class='benjo-pdf-footer'><a class='benjo-pdf-download' href='#' download>Download PDF ↓</a><a class='benjo-pdf-external' href='#' target='_blank' rel='noopener noreferrer'>Open in new tab ↗</a><span>ORIGINAL DOCUMENT / PDF</span></div>",
        "</div>"
      ].join('');
      document.body.appendChild(pdfDialog);
      const frame = pdfDialog.querySelector('.benjo-pdf-iframe');
      const loading = pdfDialog.querySelector('.benjo-pdf-loading');
      frame.addEventListener('load', () => { loading.hidden = true; });
      pdfDialog.querySelector('.benjo-pdf-close').addEventListener('click', () => pdfDialog.close());
      pdfDialog.addEventListener('click', e => { if (e.target === pdfDialog) pdfDialog.close(); });
      pdfDialog.addEventListener('close', () => {
        frame.removeAttribute('src');
        loading.hidden = false;
        restoreFocus();
      });
    }
    pdfLinks.forEach(link => link.addEventListener('click', e => {
      if (!plainClick(e)) return;
      e.preventDefault();
      mountPdfDialog();
      previousFocus = document.activeElement;
      const url = link.href;
      const title = link.dataset.pdfTitle || 'Original certificate';
      pdfDialog.querySelector('.benjo-pdf-name').textContent = title;
      pdfDialog.querySelector('.benjo-pdf-iframe').title = title + ' — PDF';
      const download = pdfDialog.querySelector('.benjo-pdf-download');
      download.href = url;
      download.download = decodeURIComponent(new URL(url).pathname.split('/').pop() || 'certificate.pdf');
      pdfDialog.querySelector('.benjo-pdf-external').href = url;
      pdfDialog.querySelector('.benjo-pdf-loading').hidden = false;
      pdfDialog.showModal();
      document.body.classList.add('benjo-archive-open');
      pdfDialog.querySelector('.benjo-pdf-iframe').src = url + '#toolbar=1&navpanes=0&view=FitH';
      pdfDialog.querySelector('.benjo-pdf-close').focus({ preventScroll: true });
    }));
  }
  initBenjoArchiveViewers();

})();
