/**
 * =============================================================================
 * THE LAMINARS v2 — MAIN SCRIPT
 * Design: Educare Knowledge Hub pattern, Laminars content
 *
 * Module structure:
 *   HeroCanvas      — Animated wave canvas background
 *   TypingEffect    — Hero heading typing animation
 *   Navigation      — Sticky nav + scroll-spy + mobile close
 *   CourseFilter    — Category filter tabs for programs section
 *   StatsCounter    — Animated count-up on hero intersection
 *   ContactForm     — Client-side validation + async submit
 *   ScrollReveal    — Lightweight scroll-based reveal (no AOS dep)
 *   BackToTop       — Floating scroll-to-top button
 *   App             — Root controller
 * =============================================================================
 */

'use strict';

/* =============================================================================
   1. HERO CANVAS ANIMATION
   – Fluid, interactive abstract wave canvas injected into #canvas-container.
   – Three bezier-curve waves animate continuously.
   – Mouse / touch parallax warps the waves in real-time.
   – Click / tap spawns an expanding ripple.
   ============================================================================= */
const HeroCanvas = (() => {

  function initAbstractHeroCanvas(parentElement) {
    const canvas = document.createElement('canvas');
    canvas.className = 'hero-canvas-bg';
    parentElement.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width, height;
    let time = 0;
    let mouse = { x: 0, y: 0, tx: 0, ty: 0, active: false };
    let ripples = [];

    const baseColor  = '#3b4fce';
    const wave1Start = 'rgba(90, 75, 210, 0.9)';
    const wave1End   = 'rgba(90, 75, 210, 0.0)';
    const wave2Start = 'rgba(124, 58, 237, 0.85)';
    const wave2End   = 'rgba(124, 58, 237, 0.1)';
    const wave3Start = 'rgba(67, 56, 202, 0.6)';
    const wave3End   = 'rgba(67, 56, 202, 0.0)';

    function resize() {
      width  = parentElement.clientWidth;
      height = parentElement.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      if (!mouse.active) {
        mouse.tx = width / 2;
        mouse.ty = height / 2;
        mouse.x  = mouse.tx;
        mouse.y  = mouse.ty;
      }
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const hero = parentElement.parentElement || parentElement;

    function updateMouse(clientX, clientY) {
      const rect = hero.getBoundingClientRect();
      mouse.tx     = clientX - rect.left;
      mouse.ty     = clientY - rect.top;
      mouse.active = true;
    }

    hero.addEventListener('mousemove', e => updateMouse(e.clientX, e.clientY), { passive: true });
    hero.addEventListener('touchmove', e => {
      if (e.touches.length > 0) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    function createRipple(clientX, clientY) {
      const rect = hero.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ripples.push({ x, y, radius: 0, maxRadius: Math.max(width, height) * 0.6, alpha: 0.6 });
      mouse.tx = x; mouse.ty = y; mouse.active = true;
    }

    hero.addEventListener('mousedown',  e => createRipple(e.clientX, e.clientY));
    hero.addEventListener('touchstart', e => {
      if (e.touches.length > 0) createRipple(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    function drawWaveLayer(offsetY, phaseX, phaseY, ampX, ampY, colorStart, colorEnd, px, py) {
      ctx.beginPath();
      ctx.moveTo(-100, height + 100);
      ctx.lineTo(-100, height * offsetY + Math.sin(time * 0.0004 * phaseY) * 80 + py * 0.2);
      const t   = time * 0.0004;
      const cp1x = width * 0.3 + Math.cos(t * phaseX) * ampX + px;
      const cp1y = height * (offsetY + 0.1) + Math.sin(t * phaseY * 0.9) * ampY + py;
      const cp2x = width * 0.7 + Math.cos(t * phaseX * 0.7) * ampX + px * 1.5;
      const cp2y = height * (offsetY - 0.2) + Math.sin(t * phaseY * 1.2) * ampY + py * 1.5;
      const endX = width + 100;
      const endY = height * (offsetY - 0.4) + Math.cos(t * phaseY * 0.8) * 80 + py * 2;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
      ctx.lineTo(width + 100, height + 100);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, height, width * 0.8, 0);
      grad.addColorStop(0, colorStart);
      grad.addColorStop(1, colorEnd);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, width, height);

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      const dx = (mouse.x - width  / 2) * 0.25;
      const dy = (mouse.y - height / 2) * 0.25;

      drawWaveLayer(0.8, 1.1, 0.9, 100, 100, wave1Start, wave1End, dx * 0.4, dy * 0.4);
      drawWaveLayer(0.6, 0.8, 1.4, 120,  80, wave2Start, wave2End, dx * 0.9, dy * 0.9);
      drawWaveLayer(0.4, 1.3, 1.1,  80, 120, wave3Start, wave3End, dx * 1.6, dy * 1.6);

      if (mouse.active) {
        const gr = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, width * 0.3);
        gr.addColorStop(0, 'rgba(255,255,255,0.15)');
        gr.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, width * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += (r.maxRadius - r.radius) * 0.03 + 1;
        r.alpha  -= 0.006;
        if (r.alpha <= 0) { ripples.splice(i, 1); continue; }
        const rg = ctx.createRadialGradient(r.x, r.y, r.radius * 0.4, r.x, r.y, r.radius);
        rg.addColorStop(0,   'rgba(255,255,255,0)');
        rg.addColorStop(0.5, `rgba(200,220,255,${(r.alpha * 0.4).toFixed(3)})`);
        rg.addColorStop(1,   'rgba(255,255,255,0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 16;
      requestAnimationFrame(draw);
    }

    draw();
  }

  function init() {
    const container = document.getElementById('canvas-container');
    if (container) initAbstractHeroCanvas(container);
  }

  return { init };
})();


/* =============================================================================
   2. TYPING EFFECT
   – Types the hero gradient-text span one character at a time.
   – Degrades gracefully if JS is disabled (pre-rendered text visible).
   ============================================================================= */
const TypingEffect = (() => {
  const SPEED       = 70;
  const START_DELAY = 600;

  function init() {
    const el     = document.getElementById('heroTyped');
    const cursor = document.querySelector('.typing-cursor');
    if (!el) return;

    const fullText = el.textContent.trim() || 'Where Knowledge Meets Ambition.';
    el.textContent = '';

    let i = 0;

    setTimeout(() => {
      const timer = setInterval(() => {
        el.textContent += fullText[i];
        i++;
        if (i >= fullText.length) {
          clearInterval(timer);
          setTimeout(() => { cursor && cursor.classList.add('hide'); }, 2200);
        }
      }, SPEED);
    }, START_DELAY);
  }

  return { init };
})();


/* =============================================================================
   3. NAVIGATION MODULE
   – Adds .scrolled after 50px scroll.
   – Scroll-spy: highlights active nav link.
   – Closes mobile menu on link click.
   ============================================================================= */
const Navigation = (() => {
  let nav, sections, navLinks;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }

  function init() {
    nav      = document.getElementById('mainNav');
    sections = Array.from(document.querySelectorAll('section[id]'));
    navLinks = Array.from(document.querySelectorAll('#navbarNav .nav-link'));

    if (!nav) return;

    window.addEventListener('scroll', onScroll, { passive: true });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const collapseEl = document.getElementById('navbarNav');
        if (collapseEl && collapseEl.classList.contains('show')) {
          const toggler = document.querySelector('.navbar-toggler');
          toggler && toggler.click();
        }
      });
    });
  }

  return { init };
})();


/* =============================================================================
   4. COURSE FILTER MODULE
   – Filters course cards by data-category attribute.
   – Smooth hide/show with CSS transition classes.
   ============================================================================= */
const CourseFilter = (() => {

  function init() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards      = document.querySelectorAll('#courseGrid [data-category]');
    const headers    = document.querySelectorAll('#courseGrid [data-category-header]');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;

        /* Update button states */
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        /* Filter category header rows */
        headers.forEach(header => {
          header.style.display =
            (category === 'all' || header.dataset.categoryHeader === category) ? '' : 'none';
        });

        /* Filter cards */
        cards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  return { init };
})();


/* =============================================================================
   5. STATS COUNTER MODULE
   – Animates stat numbers from 0 → target on hero intersection.
   – Cubic ease-out for smooth deceleration.
   ============================================================================= */
const StatsCounter = (() => {
  let animated = false;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.floor(easeOutCubic(progress) * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  function init() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    const hero = document.getElementById('home');
    if (!hero) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        counters.forEach(animateCounter);
        observer.disconnect();
      }
    }, { threshold: 0.4 });

    observer.observe(hero);
  }

  return { init };
})();


/* =============================================================================
   6. CONTACT FORM MODULE
   – Per-field validation on blur/input.
   – Full validation on submit.
   – Simulates async POST with 1.5s delay then shows success overlay.
   ============================================================================= */
const ContactForm = (() => {

  const RULES = {
    name: {
      test:    v => v.trim().length >= 2,
      message: 'Please enter your full name (at least 2 characters).',
    },
    phone: {
      test:    v => /^[\d\s+\-()]{7,15}$/.test(v.trim()),
      message: 'Please enter a valid phone number (7–15 digits).',
    },
  };

  function getField(id) { return document.getElementById(id); }
  function getError(id) { return document.getElementById(id + 'Error'); }

  function markError(id, msg) {
    getField(id)?.classList.add('error');
    const err = getError(id);
    if (err) err.textContent = msg;
  }

  function clearError(id) {
    getField(id)?.classList.remove('error');
    const err = getError(id);
    if (err) err.textContent = '';
  }

  function validateAll() {
    let valid = true;
    Object.entries(RULES).forEach(([id, rule]) => {
      clearError(id);
      const field = getField(id);
      if (!field || !rule.test(field.value)) {
        markError(id, rule.message);
        valid = false;
      }
    });
    return valid;
  }

  function bindLiveValidation() {
    Object.entries(RULES).forEach(([id, rule]) => {
      const field = getField(id);
      if (!field) return;

      field.addEventListener('blur', () => {
        clearError(id);
        if (field.value && !rule.test(field.value)) markError(id, rule.message);
      });

      field.addEventListener('input', () => {
        if (field.classList.contains('error') && rule.test(field.value)) clearError(id);
      });
    });
  }

  function mockSubmit(form) {
    const btn      = document.getElementById('submitBtn');
    const btnLabel = btn?.querySelector('.btn-label');

    if (btn)      btn.classList.add('loading');
    if (btnLabel) btnLabel.textContent = 'Sending…';

    setTimeout(() => {
      if (btn)      btn.classList.remove('loading');
      if (btnLabel) btnLabel.textContent = 'Send Enquiry';

      document.getElementById('formSuccess')?.classList.add('show');
      form.reset();
    }, 1500);
  }

  function init() {
    const form      = document.getElementById('contactForm');
    const resetBtn  = document.getElementById('resetForm');
    const successEl = document.getElementById('formSuccess');

    if (!form) return;

    bindLiveValidation();

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (validateAll()) mockSubmit(form);
    });

    resetBtn?.addEventListener('click', () => {
      successEl?.classList.remove('show');
    });
  }

  return { init };
})();


/* =============================================================================
   7. ENROLL PICKER
   – When an "Enroll Now" button with data-course is clicked, pre-selects that
     course in the contact form before the page scrolls to #contact.
   ============================================================================= */
const EnrollPicker = (() => {
  function init() {
    document.querySelectorAll('.btn-course[data-course]').forEach(btn => {
      btn.addEventListener('click', () => {
        const select = document.getElementById('course');
        if (select && btn.dataset.course) {
          select.value = btn.dataset.course;
        }
      });
    });
  }
  return { init };
})();


/* =============================================================================
   8. SCROLL REVEAL MODULE
   – Minimal IntersectionObserver-based reveal; replaces AOS dependency.
   – [data-aos] elements fade/slide in when they enter the viewport.
   ============================================================================= */
const ScrollReveal = (() => {
  function init() {
    const targets = document.querySelectorAll('[data-aos]');
    if (!targets.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.aosDelay || '0', 10);
        setTimeout(() => entry.target.classList.add('aos-animate'), delay);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

    targets.forEach(el => observer.observe(el));
  }

  return { init };
})();


/* =============================================================================
   9. BACK TO TOP
   ============================================================================= */
const BackToTop = (() => {
  function init() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 420);
    }, { passive: true });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  return { init };
})();


/* =============================================================================
   10. ORBIT LABEL MODULE
   – Cycles a gradient label above the top orbit icon in sync with the 30s
     CSS step-rotation animation (one step = 60deg = 5 seconds).
   – Sequence matches the clockwise rotation order: oi-1 → oi-6 → oi-5 →
     oi-4 → oi-3 → oi-2 (then loops).
   ============================================================================= */
const OrbitLabel = (() => {
  const SEQUENCE = [
    'Science & Maths',  // oi-1 — flask
    'Languages',         // oi-6 — language
    'Excellence',        // oi-5 — trophy
    'Tech Careers',      // oi-4 — laptop-code
    'Literature',        // oi-3 — book-open
    'Programming',       // oi-2 — code
  ];

  function init() {
    const label = document.querySelector('.hdl-label-text');
    if (!label) return;

    let idx = 0;
    setInterval(() => {
      label.classList.add('fade-out');
      setTimeout(() => {
        idx = (idx + 1) % SEQUENCE.length;
        label.textContent = SEQUENCE[idx];
        label.classList.remove('fade-out');
      }, 350);
    }, 5000);
  }

  return { init };
})();


/* =============================================================================
   11. APP — ROOT CONTROLLER
   ============================================================================= */
const App = {
  init() {
    this.initModules();
  },

  initModules() {
    HeroCanvas.init();
    TypingEffect.init();
    Navigation.init();
    CourseFilter.init();
    EnrollPicker.init();
    StatsCounter.init();
    ContactForm.init();
    OrbitLabel.init();
    ScrollReveal.init();
    BackToTop.init();
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
