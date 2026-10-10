/* Group 1 Education — progressively enhanced interactions. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  // Mobile navigation: the menu can be opened, closed, and dismissed with Escape.
  const menuToggle = $('.menu-toggle');
  const navigation = $('.primary-navigation');
  if (menuToggle && navigation) {
    const closeMenu = () => {
      navigation.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
    };
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
    $$('.nav-link, .nav-cta', navigation).forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1180) closeMenu(); });
  }

  // Footer year and back-to-top visibility.
  $$('[data-current-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });
  const backToTop = $('.back-to-top');
  if (backToTop) {
    const updateTopButton = () => backToTop.classList.toggle('is-visible', window.scrollY > 420);
    window.addEventListener('scroll', updateTopButton, { passive: true });
    updateTopButton();
  }

  // If an external photograph cannot load, keep a designed fallback surface instead of a broken-image icon.
  $$('img[data-remote-photo]').forEach(img => {
    img.addEventListener('error', () => {
      const frame = img.closest('.image-frame');
      if (!frame || frame.dataset.fallbackShown === 'true') return;
      frame.dataset.fallbackShown = 'true';
      frame.classList.add('image-unavailable');
      const message = document.createElement('span');
      message.className = 'image-status';
      message.textContent = 'Photograph unavailable';
      frame.appendChild(message);
    }, { once: true });
  });

  // Programme catalogue search and category filter.
  const programmeSearch = $('#programme-search');
  const programmeCards = $$('[data-programme-card]');
  const programmeRows = $$('[data-programme-row]');
  const programmeFilters = $$('[data-programme-filter]');
  const programmeCount = $('#programme-result-count');
  const noProgrammes = $('#no-programmes');
  const clearSearch = $('#clear-programme-search');
  let programmeCategory = 'all';
  const filterProgrammes = () => {
    if (!programmeCards.length) return;
    const query = programmeSearch ? programmeSearch.value.trim().toLocaleLowerCase() : '';
    let visible = 0;
    programmeCards.forEach(card => {
      const categoryMatch = programmeCategory === 'all' || (programmeCategory === 'professional' ? ['professional', 'practical'].includes(card.dataset.category) : card.dataset.category === programmeCategory);
      const textMatch = !query || card.textContent.toLocaleLowerCase().includes(query);
      const show = categoryMatch && textMatch;
      card.hidden = !show;
      if (show) visible++;
    });
    programmeRows.forEach(row => {
      const categoryMatch = programmeCategory === 'all' || (programmeCategory === 'professional' ? ['professional', 'practical'].includes(row.dataset.category) : row.dataset.category === programmeCategory);
      const textMatch = !query || row.textContent.toLocaleLowerCase().includes(query);
      row.hidden = !(categoryMatch && textMatch);
    });
    if (programmeCount) programmeCount.textContent = `${visible} learning ${visible === 1 ? 'area' : 'areas'}`;
    if (noProgrammes) noProgrammes.hidden = visible !== 0;
  };
  programmeFilters.forEach(button => button.addEventListener('click', () => {
    programmeCategory = button.dataset.programmeFilter || 'all';
    programmeFilters.forEach(other => {
      const active = other === button;
      other.classList.toggle('is-active', active);
      other.setAttribute('aria-pressed', String(active));
    });
    filterProgrammes();
  }));
  if (programmeSearch) programmeSearch.addEventListener('input', filterProgrammes);
  if (clearSearch && programmeSearch) clearSearch.addEventListener('click', () => { programmeSearch.value = ''; programmeSearch.focus(); filterProgrammes(); });
  filterProgrammes();

  // Schedule filtering keeps the original row order and reports the current view.
  const dayFilter = $('#day-filter');
  const scheduleRows = $$('[data-schedule-row]');
  const scheduleSummary = $('#schedule-summary');
  const noSchedule = $('#no-schedule');
  const filterSchedule = () => {
    if (!scheduleRows.length) return;
    const selected = dayFilter ? dayFilter.value : 'all';
    let visible = 0;
    scheduleRows.forEach(row => {
      const show = selected === 'all' || row.dataset.day === selected;
      row.hidden = !show;
      if (show) visible++;
    });
    if (scheduleSummary) scheduleSummary.textContent = selected === 'all'
      ? `Showing all ${visible} weekly study sessions.`
      : `Showing ${visible} ${visible === 1 ? 'session' : 'sessions'} for ${selected.charAt(0).toUpperCase() + selected.slice(1)}.`;
    if (noSchedule) noSchedule.hidden = visible !== 0;
  };
  if (dayFilter) dayFilter.addEventListener('change', filterSchedule);
  filterSchedule();

  // Gallery filter and lightbox. The dialog also closes with Escape or its close button.
  const galleryFilters = $$('[data-gallery-filter]');
  const galleryItems = $$('[data-gallery-item]');
  const noGallery = $('#no-gallery');
  const lightbox = $('#gallery-lightbox');
  const lightboxImage = $('#lightbox-image');
  const lightboxCaption = $('#lightbox-caption');
  galleryFilters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.galleryFilter || 'all';
    galleryFilters.forEach(other => {
      const active = other === button;
      other.classList.toggle('is-active', active);
      other.setAttribute('aria-pressed', String(active));
    });
    let shown = 0;
    galleryItems.forEach(item => {
      const show = category === 'all' || item.dataset.category === category;
      item.hidden = !show;
      if (show) shown++;
    });
    if (noGallery) noGallery.hidden = shown !== 0;
  }));
  galleryItems.forEach(item => item.addEventListener('click', () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    const source = item.dataset.full;
    const alt = item.dataset.alt || 'Learning gallery photograph';
    lightboxImage.src = source;
    lightboxImage.alt = alt;
    lightboxCaption.textContent = alt;
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
    else window.open(source, '_blank', 'noopener,noreferrer');
  }));
  if (lightbox) lightbox.addEventListener('click', event => {
    if (event.target === lightbox) lightbox.close();
  });

  // Fee calculator: input values are constrained before a total is displayed.
  const feeCalculator = $('#fee-calculator');
  if (feeCalculator) {
    feeCalculator.addEventListener('submit', event => {
      event.preventDefault();
      const feeInput = $('#fee-per-learner');
      const countInput = $('#learner-count');
      const totalOutput = $('#fee-total');
      const breakdown = $('#fee-breakdown');
      if (!feeInput || !countInput || !totalOutput || !breakdown) return;
      if (!feeCalculator.reportValidity()) return;
      const fee = Number(feeInput.value);
      const count = Number(countInput.value);
      if (!Number.isFinite(fee) || !Number.isFinite(count) || fee < 0 || count < 1 || !Number.isInteger(count)) {
        breakdown.textContent = 'Enter a non-negative fee and a whole number of learners greater than zero.';
        return;
      }
      const total = fee * count;
      const currency = new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 });
      totalOutput.textContent = currency.format(total);
      breakdown.textContent = `${currency.format(fee)} × ${count.toLocaleString('en-UG')} ${count === 1 ? 'learner' : 'learners'}. Estimate only.`;
    });
  }

  // Character counters.
  const bindCounter = (inputId, outputId, max) => {
    const input = $(`#${inputId}`);
    const output = $(`#${outputId}`);
    if (!input || !output) return;
    const update = () => { output.textContent = String(input.value.length); };
    input.addEventListener('input', update);
    input.addEventListener('reset', update);
    const form = input.closest('form');
    if (form) form.addEventListener('reset', () => window.setTimeout(update, 0));
    update();
  };
  bindCounter('enquiry', 'enquiry-count', 800);
  bindCounter('feedback-message', 'feedback-count', 1000);

  // Password matching uses browser custom validity so built-in validation remains available.
  const password = $('#password');
  const confirmPassword = $('#confirm-password');
  const passwordNote = $('#password-match-note');
  const updatePasswordMatch = () => {
    if (!password || !confirmPassword) return;
    const hasConfirm = confirmPassword.value.length > 0;
    const matches = password.value === confirmPassword.value;
    confirmPassword.setCustomValidity(hasConfirm && !matches ? 'The passwords do not match.' : '');
    if (passwordNote) {
      passwordNote.textContent = !hasConfirm ? 'Both password fields must match.' : (matches ? 'Passwords match.' : 'Passwords do not match yet.');
      passwordNote.classList.toggle('is-match', hasConfirm && matches);
      passwordNote.classList.toggle('is-mismatch', hasConfirm && !matches);
    }
  };
  if (password && confirmPassword) {
    password.addEventListener('input', updatePasswordMatch);
    confirmPassword.addEventListener('input', updatePasswordMatch);
    const form = password.closest('form');
    if (form) form.addEventListener('reset', () => window.setTimeout(updatePasswordMatch, 0));
  }

  // Small local persistence for the course project. Passwords are never stored.
  const setFormStatus = (node, kind, message) => {
    if (!node) return;
    node.className = `form-status status-${kind}`;
    node.textContent = message;
    node.hidden = false;
    node.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  };
  const clearStatusOnEdit = (form, status) => {
    if (!form || !status) return;
    form.addEventListener('input', () => { status.hidden = true; });
    form.addEventListener('change', () => { status.hidden = true; });
    form.addEventListener('reset', () => { status.hidden = true; });
  };
  const formToRecord = (form, omit = []) => {
    const record = {};
    const omitted = new Set(omit);
    for (const element of Array.from(form.elements)) {
      if (!element.name || omitted.has(element.name) || ['button', 'submit', 'reset', 'password'].includes(element.type)) continue;
      if (element.type === 'radio') {
        if (element.checked) record[element.name] = element.value;
      } else if (element.type === 'checkbox') {
        if (element.name === 'interests') {
          if (!record[element.name]) record[element.name] = [];
          if (element.checked) record[element.name].push(element.value);
        } else {
          record[element.name] = element.checked;
        }
      } else {
        record[element.name] = element.value.trim();
      }
    }
    return record;
  };
  const storeLocalRecord = (key, data) => {
    const record = { id: `G1-${Date.now().toString(36).toUpperCase()}`, savedAt: new Date().toISOString(), data };
    let records = [];
    try {
      const stored = window.localStorage.getItem(key);
      const parsed = stored ? JSON.parse(stored) : [];
      records = Array.isArray(parsed) ? parsed : [];
      records.unshift(record);
      window.localStorage.setItem(key, JSON.stringify(records.slice(0, 50)));
      return record;
    } catch (error) {
      throw new Error('This browser could not save the entry. Check browser storage settings and try again.');
    }
  };

  const registrationForm = $('#student-registration-form');
  const registrationStatus = $('#registration-status');
  if (registrationForm) {
    clearStatusOnEdit(registrationForm, registrationStatus);
    registrationForm.addEventListener('submit', event => {
      event.preventDefault();
      updatePasswordMatch();
      if (!registrationForm.checkValidity()) {
        registrationForm.reportValidity();
        setFormStatus(registrationStatus, 'error', 'Some details are missing or need correction. Review the marked fields and try again.');
        return;
      }
      try {
        const data = formToRecord(registrationForm, ['password', 'confirmPassword']);
        const record = storeLocalRecord('g1_education_registrations', data);
        const passwordField = $('#password');
        const confirmField = $('#confirm-password');
        if (passwordField) passwordField.value = '';
        if (confirmField) confirmField.value = '';
        updatePasswordMatch();
        setFormStatus(registrationStatus, 'success', `Registration details saved on this device. Reference: ${record.id}. Passwords are not saved. Keep this browser profile to access the saved record.`);
      } catch (error) {
        setFormStatus(registrationStatus, 'error', error.message || 'The entry could not be saved. Please try again.');
      }
    });
  }

  const feedbackForm = $('#feedback-form');
  const feedbackStatus = $('#feedback-status');
  if (feedbackForm) {
    clearStatusOnEdit(feedbackForm, feedbackStatus);
    feedbackForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!feedbackForm.checkValidity()) {
        feedbackForm.reportValidity();
        setFormStatus(feedbackStatus, 'error', 'Please complete the required fields and select a rating.');
        return;
      }
      try {
        const data = formToRecord(feedbackForm);
        const record = storeLocalRecord('g1_education_feedback', data);
        feedbackForm.reset();
        setFormStatus(feedbackStatus, 'success', `Thank you. Your feedback has been saved on this device. Reference: ${record.id}.`);
      } catch (error) {
        setFormStatus(feedbackStatus, 'error', error.message || 'Your feedback could not be saved. Please try again.');
      }
    });
  }

})();
