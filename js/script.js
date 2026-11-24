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



/* Bright Future Secondary School — assignment JavaScript layer */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Responsive navigation: accessible, keyboard-friendly and phone-first.
  const menuButton = $("[data-menu-toggle], .menu-toggle, .nav-toggle, #menuToggle");
  const nav = $("nav ul, .main-nav, .nav-links");
  if (menuButton && nav) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
      nav.classList.toggle("active", !isOpen);
      menuButton.classList.toggle("is-active", !isOpen);
    });
    $$(".main-nav a, nav a, .nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open", "active");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Course catalogue: objects, arrays, iteration, selection and DOM rendering.
  const courses = [
    { id: "ict", name: "ICT & Digital Skills", category: "Technology", duration: "School programme", fee: 180000, description: "Build confidence using computers, digital tools and responsible technology." },
    { id: "science", name: "Science", category: "Sciences", duration: "School programme", fee: 160000, description: "Explore scientific ideas through observation, investigation and practical learning." },
    { id: "business", name: "Business Studies", category: "Humanities", duration: "School programme", fee: 140000, description: "Develop enterprise awareness, financial literacy and problem-solving skills." },
    { id: "languages", name: "Languages & Communication", category: "Languages", duration: "School programme", fee: 120000, description: "Strengthen reading, writing, speaking and effective communication." }
  ];
  const courseList = $("#courseList");
  const courseSelect = $("#courseSelect");
  const courseDetails = $("#courseDetails");
  const registrationCourse = $("#registrationCourse");
  const courseFee = $("#courseFee");
  const registrationFee = $("#registrationFee");
  const totalFee = $("#totalFee");

  const money = amount => new Intl.NumberFormat("en-UG", {
    style: "currency", currency: "UGX", maximumFractionDigits: 0
  }).format(amount);

  function calculateTotal(courseCost, registrationCost) {
    return Number(courseCost) + Number(registrationCost);
  }

  function renderCourses() {
    if (courseList) {
      courseList.innerHTML = "";
      courses.forEach(course => {
        const card = document.createElement("article");
        card.className = "course-card";
        card.innerHTML = `<span class="course-tag">${course.category}</span>
          <h3>${course.name}</h3><p>${course.description}</p>
          <small>${course.duration}</small>
          <button class="button button-outline course-choose" type="button" data-course="${course.id}">View course</button>`;
        courseList.appendChild(card);
      });
    }
    if (courseSelect) {
      courses.forEach(course => {
        const option = document.createElement("option");
        option.value = course.id;
        option.textContent = course.name;
        courseSelect.appendChild(option);
      });
    }
  }

  function updateCourse(courseId) {
    const selected = courses.find(course => course.id === courseId);
    if (!selected) {
      if (courseDetails) courseDetails.textContent = "Choose a course to view its details.";
      if (courseFee) courseFee.value = "";
      updateTotal();
      return;
    }
    if (courseDetails) {
      courseDetails.innerHTML = `<strong>${selected.name}</strong><p>${selected.description}</p><span>${selected.duration}</span>`;
    }
    if (courseFee) courseFee.value = selected.fee;
    updateTotal();
  }

  function updateTotal() {
    if (!totalFee) return;
    const courseCost = Number(courseFee?.value || 0);
    const registrationCost = Number(registrationFee?.value || 0);
    totalFee.textContent = money(calculateTotal(courseCost, registrationCost));
  }

  renderCourses();
  courseList?.addEventListener("click", event => {
    const button = event.target.closest("[data-course]");
    if (!button) return;
    if (courseSelect) courseSelect.value = button.dataset.course;
    updateCourse(button.dataset.course);
    courseSelect?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  courseSelect?.addEventListener("change", event => {
    updateCourse(event.target.value);
    if (registrationCourse) registrationCourse.value = event.target.value;
  });
  registrationCourse?.addEventListener("change", event => {
    if (courseSelect) courseSelect.value = event.target.value;
    updateCourse(event.target.value);
  });
  registrationFee?.addEventListener("input", updateTotal);

  // Student registration: validate at least two fields and show confirmation.
  const registrationForm = $("#studentRegistrationForm");
  registrationForm?.addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#studentName")?.value.trim() || "";
    const email = $("#studentEmail")?.value.trim() || "";
    const age = Number($("#studentAge")?.value || 0);
    const selectedCourse = registrationCourse?.value || courseSelect?.value || "";
    const message = $("#registrationMessage");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = [];

    if (name.length < 3) errors.push("Enter the student's full name (at least 3 characters).");
    if (!emailPattern.test(email)) errors.push("Enter a valid email address.");
    if (!Number.isInteger(age) || age < 10 || age > 25) errors.push("Enter an age between 10 and 25.");
    if (!selectedCourse) errors.push("Please select a course.");

    if (message) {
      message.className = errors.length ? "form-message error" : "form-message success";
      message.textContent = errors.length
        ? errors.join(" ")
        : `Thank you, ${name}. Your demonstration registration for ${courses.find(c => c.id === selectedCourse).name} has been received on this page. No data has been sent or stored.`;
      message.setAttribute("role", "status");
    }
    if (errors.length) return;
    registrationForm.reset();
    if (courseFee) courseFee.value = "";
    if (courseDetails) courseDetails.textContent = "Choose a course to view its details.";
    updateTotal();
  });

  // A small live character counter demonstrates input events and DOM updates.
  const messageField = $("#contactMessage");
  const counter = $("#messageCounter");
  messageField?.addEventListener("input", () => {
    if (counter) counter.textContent = `${messageField.value.length} characters`;
  });

  // Existing form controls remain compatible; add accessible feedback to required fields.
  $$("form input, form select, form textarea").forEach(field => {
    field.addEventListener("change", () => field.classList.toggle("has-value", Boolean(field.value)));
  });

  // Current year helper for any footer year placeholder.
  $$("[data-current-year]").forEach(node => node.textContent = new Date().getFullYear());
});
