(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // Mobile navigation
  const menuButton = $('.menu-toggle');
  const nav = $('.main-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      menuButton.innerHTML = isOpen
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    });
    $$('.main-nav a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
      menuButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Header shadow and back-to-top control
  const header = $('.site-header');
  const backTop = $('.back-top');
  const updateScrollUi = () => {
    const y = window.scrollY || 0;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (backTop) backTop.classList.toggle('is-visible', y > 500);
  };
  window.addEventListener('scroll', updateScrollUi, { passive: true });
  updateScrollUi();
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Reveal content as it enters the viewport
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Academic level tabs
  $$('[data-tab-group]').forEach(group => {
    const buttons = $$('[data-tab]', group);
    const panels = $$('[data-tab-panel]', group);
    buttons.forEach(button => button.addEventListener('click', () => {
      const target = button.dataset.tab;
      buttons.forEach(item => item.setAttribute('aria-selected', String(item === button)));
      panels.forEach(panel => panel.classList.toggle('is-active', panel.dataset.tabPanel === target));
    }));
  });

  // WhatsApp enquiry forms: validate locally, then prepare a message for the school number.
  $$('form[data-whatsapp-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const number = (form.dataset.whatsappNumber || '256782365230').replace(/[^0-9]/g, '');
      const title = form.dataset.messageTitle || 'Website enquiry';
      const data = new FormData(form);
      const lines = [`Hello Bright Future Secondary School,`, ``, `${title}:`];
      for (const [key, value] of data.entries()) {
        if (String(value).trim()) {
          const label = key.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          lines.push(`${label}: ${String(value).trim()}`);
        }
      }
      const message = encodeURIComponent(lines.join('\n'));
      const url = `https://wa.me/${number}?text=${message}`;
      const feedback = $('[data-form-feedback]', form);
      if (feedback) feedback.textContent = 'Your enquiry is ready in WhatsApp. Review the message and press Send.';
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  });

  // Accessible gallery lightbox
  const lightbox = $('.lightbox');
  if (lightbox) {
    const lightboxImage = $('img', lightbox);
    const lightboxTitle = $('[data-lightbox-title]', lightbox);
    const closeButton = $('.lightbox-close', lightbox);
    const cards = $$('[data-lightbox]');
    const close = () => { if (lightbox.open) lightbox.close(); };
    cards.forEach(card => card.addEventListener('click', () => {
      const img = $('img', card);
      lightboxImage.src = card.dataset.full || img.src;
      lightboxImage.alt = img.alt;
      lightboxTitle.textContent = card.dataset.caption || img.alt;
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
      else lightbox.setAttribute('open', '');
    }));
    if (closeButton) closeButton.addEventListener('click', close);
    lightbox.addEventListener('click', event => { if (event.target === lightbox) close(); });
    lightbox.addEventListener('close', () => { lightboxImage.src = ''; });
  }

  // Current year in footer
  $$('[data-current-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
})();
