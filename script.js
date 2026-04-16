/* =============================================================
   VANT PROJECT PORTFOLIO — script.js
   Author  : Achmad Arditio Sumartono (Azurakun)
   Stack   : Pure Vanilla JS (no framework, GitHub Pages safe)
   ============================================================= */


/* ─────────────────────────────────────────────────────────────
   1. PARTICLE CANVAS BACKGROUND (Hero Section)
   ───────────────────────────────────────────────────────────── */

/**
 * Draws an animated field of connected particles on a <canvas> element.
 * Particles float gently and connect with lines when close enough.
 */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Responsive sizing: match canvas to its CSS dimensions
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particle configuration
  const PARTICLE_COUNT  = 55;
  const CONNECT_DIST    = 130;   // px — max distance to draw a line
  const PARTICLE_COLOR  = '#7c5cfc';
  const LINE_COLOR      = 'rgba(124, 92, 252, ';

  // Build particles array
  let particles = [];

  function createParticle() {
    return {
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      vx:   (Math.random() - 0.5) * 0.4,
      vy:   (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  // Animation loop
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move & draw each particle
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0)             p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0)             p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = PARTICLE_COLOR;
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw connecting lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DIST) {
          // Opacity fades as distance increases
          const opacity = 1 - dist / CONNECT_DIST;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = LINE_COLOR + (opacity * 0.35) + ')';
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}


/* ─────────────────────────────────────────────────────────────
   2. TYPEWRITER EFFECT (Hero subtitle)
   ───────────────────────────────────────────────────────────── */

/**
 * Cycles through an array of role strings, typing and erasing
 * each one character-by-character for a typewriter effect.
 */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = {
    en: ['AI Engineer', 'Web Developer', 'App Builder', 'Prompt Engineer', 'Language Translator', 'Creative Technologist'],
    id: ['AI Engineer', 'Pengembang Web', 'Pembangun Aplikasi', 'Prompt Engineer', 'Penerjemah Bahasa', 'Teknolog Kreatif']
  };

  let roleIndex   = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPausing   = false;

  function getCurrentLang() {
    return document.documentElement.getAttribute('data-lang') || 'en';
  }

  function tick() {
    const lang    = getCurrentLang();
    const roleSet = roles[lang];
    const current = roleSet[roleIndex % roleSet.length];

    if (isPausing) return;

    if (isDeleting) {
      // Remove one character
      el.textContent = current.substring(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        roleIndex++;
        setTimeout(tick, 400); // brief pause before typing new word
        return;
      }
      setTimeout(tick, 50);
    } else {
      // Add one character
      el.textContent = current.substring(0, charIndex++);
      if (charIndex > current.length) {
        // Finished typing — pause then start deleting
        isPausing = true;
        setTimeout(() => { isPausing = false; isDeleting = true; tick(); }, 1800);
        return;
      }
      setTimeout(tick, 80);
    }
  }

  tick();
}


/* ─────────────────────────────────────────────────────────────
   3. NAVBAR — hide on scroll down, show on scroll up
   ───────────────────────────────────────────────────────────── */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;

    if (currentY > lastScrollY && currentY > 80) {
      navbar.classList.add('hidden');    // scrolling down → hide
    } else {
      navbar.classList.remove('hidden'); // scrolling up  → show
    }

    lastScrollY = currentY < 0 ? 0 : currentY;
  }, { passive: true });
}


/* ─────────────────────────────────────────────────────────────
   4. NAVBAR — active link highlighting based on scroll position
   ───────────────────────────────────────────────────────────── */
function initActiveLinks() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.navbar__links a[href^="#"]');

  function updateActive() {
    let current = '';

    sections.forEach(section => {
      const top    = section.getBoundingClientRect().top;
      const offset = 120; // offset so link activates before reaching exact top
      if (top <= offset) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}


/* ─────────────────────────────────────────────────────────────
   5. MOBILE HAMBURGER MENU
   ───────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when any link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   6. SCROLL-REVEAL ANIMATION (IntersectionObserver)
   ───────────────────────────────────────────────────────────── */

/**
 * Adds 'js-loaded' class to <body> immediately, which activates the
 * CSS scroll-reveal hiding (opacity: 0). Without this, .reveal elements
 * are always fully visible as a no-JS fallback — keeping the site
 * readable even when JS hasn't executed yet.
 *
 * Then adds the 'revealed' class to elements with class 'reveal'
 * when they enter the viewport, triggering CSS transitions.
 */
function initScrollReveal() {
  // Signal to CSS that JS is active — enables the reveal animation system
  document.body.classList.add('js-loaded');
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.12 }  // trigger when 12% of element is visible
  );

  revealEls.forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────────────────────────
   7. PROJECT FILTER BUTTONS
   ───────────────────────────────────────────────────────────── */

/**
 * Clicking a filter button shows only project cards
 * whose data-category attribute matches the active filter.
 */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const activeFilter = btn.getAttribute('data-filter');

      // Show or hide cards based on category
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        const match = activeFilter === 'all' || categories.includes(activeFilter);
        card.classList.toggle('hidden', !match);
      });
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   8. BILINGUAL LANGUAGE TOGGLE (EN / ID)
   ───────────────────────────────────────────────────────────── */

/**
 * Switches all translatable text elements between English and Bahasa Indonesia.
 * Elements must have data-en and data-id attributes.
 * The selected language is saved in localStorage.
 */
function initLanguageToggle() {
  const toggleBtn = document.getElementById('lang-toggle');
  if (!toggleBtn) return;

  /**
   * Apply the given language to all translatable elements.
   * @param {string} lang - 'en' or 'id'
   */
  function applyLanguage(lang) {
    // Set data-lang on <html> so CSS pseudo-elements or JS can query it
    document.documentElement.setAttribute('data-lang', lang);

    // Update every element that has both data-en and data-id
    document.querySelectorAll('[data-en][data-id]').forEach(el => {
      el.textContent = lang === 'id' ? el.getAttribute('data-id') : el.getAttribute('data-en');
    });

    // Handle placeholder attributes (for inputs, if any)
    document.querySelectorAll('[data-en-placeholder][data-id-placeholder]').forEach(el => {
      el.setAttribute('placeholder', lang === 'id'
        ? el.getAttribute('data-id-placeholder')
        : el.getAttribute('data-en-placeholder')
      );
    });

    // Update toggle button label
    toggleBtn.textContent = lang === 'en' ? '🌐 ID' : '🌐 EN';

    // Persist choice
    localStorage.setItem('portfolio-lang', lang);
  }

  toggleBtn.addEventListener('click', () => {
    const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
    applyLanguage(currentLang === 'en' ? 'id' : 'en');
  });

  // On load: restore saved language or default to English
  const savedLang = localStorage.getItem('portfolio-lang') || 'en';
  applyLanguage(savedLang);
}


/* ─────────────────────────────────────────────────────────────
   9. INIT — Run everything when DOM is ready
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTypewriter();
  initNavbarScroll();
  initActiveLinks();
  initMobileMenu();
  initScrollReveal();
  initProjectFilter();
  initLanguageToggle();
});
