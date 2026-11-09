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
function initReflectionBooks() {
  const showcase = document.getElementById('reflection-showcase');
  const shelf = document.getElementById('reflection-shelf');
  const reader = document.getElementById('reflection-reader');
  if (!showcase || !shelf || !reader) return;
  const tiles = Array.from(showcase.querySelectorAll('[data-book]'));
  const close = document.getElementById('reader-close');
  const previous = document.getElementById('reader-previous');
  const next = document.getElementById('reader-next');
  const content = document.getElementById('reader-body');
  const cover = document.getElementById('reflection-openbook');
  const quietMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const chapters = [
    { id: 'prelim', title: 'Prelim Term', sequence: '01', kicker: '01 / PRELIM TERM', cover: 'FIRST<br>PRINCIPLES.', coverColor: '#d9e1d4', coverInk: '#274337' },
    { id: 'midterm', title: 'Midterm', sequence: '02', kicker: '02 / MIDTERM', cover: 'THINK.<br>TRACE.<br>REPEAT.', coverColor: '#bed3c5', coverInk: '#244a38' },
    { id: 'final', title: 'Final Term', sequence: '03', kicker: '03 / FINAL TERM', cover: 'ALWAYS<br>IN<br>PROGRESS.', coverColor: '#446b58', coverInk: '#f3f2e6' }
  ];
  let active = -1;
  let returnFocus = null;
  let animationFrame = 0;

  const showChapter = (index, opening) => {
    const chapter = chapters[index];
    const template = document.getElementById('reflection-' + chapter.id);
    if (!template) return;
    active = index;
    content.replaceChildren(template.content.cloneNode(true));
    content.scrollTop = 0;
    document.getElementById('reader-title').innerHTML = chapter.title + ' <em>Reflection</em>';
    document.getElementById('reader-kicker').textContent = chapter.kicker;
    document.getElementById('reader-count').textContent = chapter.sequence + ' / 03';
    document.getElementById('reader-edition').textContent = 'VOL. ' + chapter.sequence + ' / AN ACADEMIC JOURNAL';
    document.getElementById('reader-figure').textContent = chapter.sequence;
    document.getElementById('reader-cover-eyebrow').textContent = chapter.title.toUpperCase() + ' / 2026';
    document.getElementById('reader-cover-text').innerHTML = chapter.cover;
    cover.style.setProperty('--reader-cover', chapter.coverColor);
    cover.style.setProperty('--reader-ink', chapter.coverInk);
    previous.disabled = index === 0;
    next.disabled = index === chapters.length - 1;
    if (opening) {
      shelf.hidden = true;
      reader.hidden = false;
      reader.classList.remove('reader-visible');
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        animationFrame = requestAnimationFrame(() => reader.classList.add('reader-visible'));
      });
      showcase.scrollIntoView({ behavior: quietMotion ? 'auto' : 'smooth', block: 'start' });
      close.focus({ preventScroll: true });
    } else {
      // Settle the book before a page change; keep the reader panel stable.
      reader.classList.remove('reader-visible');
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        animationFrame = requestAnimationFrame(() => reader.classList.add('reader-visible'));
      });
    }
  };

  tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => {
      returnFocus = tile;
      showChapter(index, true);
    });
  });
  const closeReader = () => {
    if (reader.hidden) return;
    cancelAnimationFrame(animationFrame);
    reader.classList.remove('reader-visible');
    reader.hidden = true;
    shelf.hidden = false;
    const target = returnFocus || tiles[0];
    if (target) target.focus({ preventScroll: true });
    active = -1;
    showcase.scrollIntoView({ behavior: quietMotion ? 'auto' : 'smooth', block: 'start' });
  };
  close.addEventListener('click', closeReader);
  previous.addEventListener('click', () => { if (active > 0) showChapter(active - 1, false); });
  next.addEventListener('click', () => { if (active < chapters.length - 1) showChapter(active + 1, false); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !reader.hidden) { event.preventDefault(); closeReader(); }
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
})();
