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
const lightbox     = $('#lightbox');
const lightboxImg  = $('#lightboxImg');
const lightboxCap  = $('#lightboxCaption');
const lightboxCnt  = $('#lightboxCount');
const lightboxOpen = $('#lightboxOpen');
const lightboxPrev = $('#lightboxPrev');
const lightboxNext = $('#lightboxNext');
const certButtons  = $$('[data-cert]');

let current = 0;
let lastTrigger = null;

/* Only one certificate? Hide the arrows and the counter. */
const hasMany = certButtons.length > 1;
lightboxPrev.hidden = lightboxNext.hidden = lightboxCnt.hidden = !hasMany;

function showCert(index) {
  const total = certButtons.length;
  current = (index + total) % total;

  const button = certButtons[current];
  const img    = $('img', button);
  const src    = img.getAttribute('src');

  lightboxImg.src = src;
  lightboxImg.alt = img.alt;
  lightboxCap.textContent = $('span', button).textContent;
  lightboxCnt.textContent = `${current + 1} / ${total}`;
  lightboxOpen.href = src;
}

function openLightbox(index) {
  lastTrigger = certButtons[index];
  showCert(index);
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  $('#lightboxClose').focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  if (lastTrigger) lastTrigger.focus();
}

certButtons.forEach((button, index) => {
  button.addEventListener('click', () => openLightbox(index));
});

$('#lightboxClose').addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => showCert(current - 1));
lightboxNext.addEventListener('click', () => showCert(current + 1));

/* click on the dark backdrop closes the viewer */
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

/* keyboard: Esc closes, ← → navigate */
document.addEventListener('keydown', (event) => {
  if (lightbox.hidden) return;
  if (event.key === 'Escape') closeLightbox();
  if (hasMany && event.key === 'ArrowLeft')  showCert(current - 1);
  if (hasMany && event.key === 'ArrowRight') showCert(current + 1);
});

/* touch: swipe left / right */
let touchStartX = 0;
lightbox.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', (event) => {
  if (!hasMany) return;
  const dx = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) showCert(current + (dx < 0 ? 1 : -1));
}, { passive: true });
