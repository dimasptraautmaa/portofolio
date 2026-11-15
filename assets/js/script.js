'use strict';

/*-----------------------------------*\
  #script.js — Dimas Putra portfolio
\*-----------------------------------*/

const $  = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/* Footer year */
$('#year').textContent = new Date().getFullYear();


/*-----------------------------------*\
  #PROJECT FILTER
  Re-applies the "wide" pattern to whatever is visible,
  so the grid never leaves gaps after filtering.
\*-----------------------------------*/
const filterButtons = $$('[data-filter]');
const projectItems  = $$('.project-item');

function applyFilter(category) {
  let visibleIndex = 0;

  projectItems.forEach((item) => {
    const show = category === 'all' || item.dataset.category === category;
    item.hidden = !show;
    item.classList.remove('wide');

    if (show) {
      if (visibleIndex % 5 === 0 || visibleIndex % 5 === 3) item.classList.add('wide');
      visibleIndex++;
    }
  });

  filterButtons.forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.filter === category));
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
});

applyFilter('all');


/*-----------------------------------*\
  #SKILL RINGS — fill when scrolled into view
\*-----------------------------------*/
const skills = $('#skills');

if ('IntersectionObserver' in window) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        skills.classList.add('on');
        skillObserver.disconnect();
      }
    });
  }, { threshold: 0.35 });
  skillObserver.observe(skills);
} else {
  skills.classList.add('on');
}


/*-----------------------------------*\
  #NAV — highlight the section in view
\*-----------------------------------*/
const navLinks = $$('.nav a');
const sections = navLinks.map((link) => $(link.getAttribute('href'))).filter(Boolean);

if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => navObserver.observe(section));
}


/*-----------------------------------*\
  #CERTIFICATE LIGHTBOX
\*-----------------------------------*/
const lightbox      = $('#lightbox');
const lightboxClose = $('#lightboxClose');
const certButton    = $('#certBtn');

function openLightbox() {
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  certButton.focus();
}

certButton.addEventListener('click', openLightbox);
lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
});
