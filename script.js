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

  const tabs = Array.from(document.querySelectorAll('[data-term]'));
  const termTitle = document.getElementById('term-title');
  const termPanel = document.getElementById('reflection-panel');
  const entries = {
    'Prelim Term': 'My personal reflection for this term has not been uploaded yet. This space is reserved for the lessons and experiences I want to remember.',
    'Midterm': 'My Midterm reflection will be added here once it is complete. This entry is intentionally left open rather than filled with sample text.',
    'Final Term': 'My Final Term reflection has not been added yet. I will use this section to look back on what I have learned.'
  };
  function activateTab(selected, focus) {
    tabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    termTitle.textContent = selected.dataset.term;
    document.getElementById('term-body').textContent = entries[selected.dataset.term];
    termPanel.setAttribute('aria-labelledby', selected.id);
    if (focus) selected.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab, false));
    tab.addEventListener('keydown', (event) => {
      let next = -1;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== -1) { event.preventDefault(); activateTab(tabs[next], true); }
    });
  });

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
