(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // Responsive navigation: works with touch, keyboard, Escape and outside taps.
  const menuButton = $('.menu-toggle');
  const nav = $('.main-nav');
  const closeMenu = () => {
    if (!menuButton || !nav) return;
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('menu-open');
  };
  const openMenu = () => {
    if (!menuButton || !nav) return;
    nav.classList.add('is-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('menu-open');
  };
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => nav.classList.contains('is-open') ? closeMenu() : openMenu());
    $$('.main-nav a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', event => {
      if (nav.classList.contains('is-open') && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
  }

  // Sticky header and back-to-top control.
  const header = $('.site-header');
  const backTop = $('.back-top');
  const updateScrollUi = () => {
    const y = window.scrollY || 0;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (backTop) backTop.classList.toggle('is-visible', y > 450);
  };
  window.addEventListener('scroll', updateScrollUi, { passive: true });
  updateScrollUi();
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Reveal effects degrade gracefully when IntersectionObserver is unavailable.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.1 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  // Accessible tabs.
  $$('[data-tab-group]').forEach(group => {
    const buttons = $$('[data-tab]', group), panels = $$('[data-tab-panel]', group);
    buttons.forEach(button => button.addEventListener('click', () => {
      const target = button.dataset.tab;
      buttons.forEach(item => { const active = item === button; item.setAttribute('aria-selected', String(active)); item.classList.toggle('is-active', active); });
      panels.forEach(panel => panel.classList.toggle('is-active', panel.dataset.tabPanel === target));
    }));
  });

  // Enquiry forms: browser validation first, then prepare a WhatsApp message.
  $$('form[data-whatsapp-form]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const number = (form.dataset.whatsappNumber || '256782365230').replace(/[^0-9]/g, '');
    const title = form.dataset.messageTitle || 'Website enquiry';
    const lines = ['Hello Bright Future Secondary School,', '', `${title}:`];
    new FormData(form).forEach((value, key) => {
      if (String(value).trim()) lines.push(`${key.replace(/[_-]/g, ' ')}: ${String(value).trim()}`);
    });
    const feedback = $('[data-form-feedback]', form);
    if (feedback) feedback.textContent = 'Your message is ready in WhatsApp. Review it and press Send.';
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  }));

  // Gallery lightbox shows the entire image using object-fit: contain.
  const lightbox = $('.lightbox');
  if (lightbox) {
    const image = $('img', lightbox), title = $('[data-lightbox-title]', lightbox);
    const close = () => { if (lightbox.open && typeof lightbox.close === 'function') lightbox.close(); else lightbox.removeAttribute('open'); };
    $$('[data-lightbox]').forEach(card => card.addEventListener('click', () => {
      const thumb = $('img', card); if (!thumb) return;
      image.src = card.dataset.full || thumb.currentSrc || thumb.src;
      image.alt = thumb.alt || 'Bright Future school photograph';
      if (title) title.textContent = card.dataset.caption || thumb.alt || 'School gallery';
      if (typeof lightbox.showModal === 'function') lightbox.showModal(); else lightbox.setAttribute('open', '');
    }));
    $('.lightbox-close', lightbox)?.addEventListener('click', close);
    lightbox.addEventListener('click', event => { if (event.target === lightbox) close(); });
  }

  // Academic course explorer and UGX fee calculator (illustrative assignment figures).
  const courses = [
    { id: 'ict', name: 'ICT & Digital Skills', category: 'Technology', fee: 180000, description: 'Build confidence using computers, digital tools and responsible technology.' },
    { id: 'science', name: 'Science', category: 'Sciences', fee: 160000, description: 'Explore scientific ideas through observation, investigation and practical learning.' },
    { id: 'business', name: 'Business Studies', category: 'Humanities', fee: 140000, description: 'Develop enterprise awareness, financial literacy and problem-solving skills.' },
    { id: 'languages', name: 'Languages & Communication', category: 'Languages', fee: 120000, description: 'Strengthen reading, writing, speaking and effective communication.' }
  ];
  const courseList = $('#courseList'), courseSelect = $('#courseSelect'), details = $('#courseDetails');
  const registrationCourse = $('#registrationCourse'), courseFee = $('#courseFee'), registrationFee = $('#registrationFee'), totalFee = $('#totalFee');
  const money = value => new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(value);
  const updateTotal = () => { if (totalFee) totalFee.textContent = money(Number(courseFee?.value || 0) + Number(registrationFee?.value || 0)); };
  const updateCourse = id => {
    const course = courses.find(item => item.id === id);
    if (!course) { if (details) details.textContent = 'Choose a learning area to view its details.'; if (courseFee) courseFee.value = ''; updateTotal(); return; }
    if (details) details.innerHTML = `<strong>${course.name}</strong><p>${course.description}</p><span>${course.category}</span>`;
    if (courseFee) courseFee.value = String(course.fee);
    updateTotal();
  };
  if (courseList && !courseList.dataset.rendered) {
    courseList.dataset.rendered = 'true'; courseList.replaceChildren();
    courses.forEach(course => {
      const card = document.createElement('article'); card.className = 'course-card';
      const tag = document.createElement('span'); tag.className = 'course-tag'; tag.textContent = course.category;
      const heading = document.createElement('h3'); heading.textContent = course.name;
      const paragraph = document.createElement('p'); paragraph.textContent = course.description;
      const button = document.createElement('button'); button.type = 'button'; button.className = 'button button-outline course-choose'; button.dataset.course = course.id; button.textContent = 'View learning area';
      card.append(tag, heading, paragraph, button); courseList.append(card);
    });
  }
  if (courseSelect && !courseSelect.dataset.optionsAdded) {
    courseSelect.dataset.optionsAdded = 'true';
    courses.forEach(course => { if (![...courseSelect.options].some(option => option.value === course.id)) { const option = document.createElement('option'); option.value = course.id; option.textContent = course.name; courseSelect.append(option); } });
  }
  courseList?.addEventListener('click', event => {
    const button = event.target.closest('[data-course]'); if (!button) return;
    if (courseSelect) courseSelect.value = button.dataset.course;
    if (registrationCourse) registrationCourse.value = button.dataset.course;
    updateCourse(button.dataset.course); courseSelect?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  courseSelect?.addEventListener('change', () => { if (registrationCourse) registrationCourse.value = courseSelect.value; updateCourse(courseSelect.value); });
  registrationCourse?.addEventListener('change', () => { if (courseSelect) courseSelect.value = registrationCourse.value; updateCourse(registrationCourse.value); });
  registrationFee?.addEventListener('input', updateTotal);
  if (courseFee && !courseFee.value) courseFee.value = '0';
  updateTotal();

  // Registration form: custom feedback plus native required/email/range validation.
  const registrationForm = $('#studentRegistrationForm');
  registrationForm?.addEventListener('submit', event => {
    event.preventDefault();
    const name = $('#studentName')?.value.trim() || '', email = $('#studentEmail')?.value.trim() || '';
    const age = Number($('#studentAge')?.value || 0), selected = registrationCourse?.value || courseSelect?.value || '';
    const feedback = $('#registrationMessage'), errors = [];
    if (name.length < 3) errors.push('Enter the learner’s full name (at least 3 characters).');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Enter a valid email address.');
    if (!Number.isInteger(age) || age < 10 || age > 25) errors.push('Enter an age between 10 and 25.');
    if (!selected) errors.push('Select a learning area.');
    if (feedback) { feedback.className = errors.length ? 'form-message error' : 'form-message success'; feedback.textContent = errors.length ? errors.join(' ') : `Thank you, ${name}. Your demonstration registration has been validated. No personal information has been sent or stored.`; feedback.setAttribute('role', 'status'); }
    if (!errors.length) registrationForm.reset();
  });

  // Message counter and visible field-state feedback.
  const messageField = $('#contactMessage'), counter = $('#messageCounter');
  messageField?.addEventListener('input', () => { if (counter) counter.textContent = `${messageField.value.length} characters`; });
  $$('form input, form select, form textarea').forEach(field => field.addEventListener('change', () => field.classList.toggle('has-value', Boolean(field.value))));
  $$('[data-current-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
})();
