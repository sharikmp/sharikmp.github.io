/**
 * =============================================================================
 * EDUCARE KNOWLEDGE HUB — MAIN SCRIPT
 * Version: 1.0
 *
 * Module structure (App module pattern):
 *
 *   CanvasAnimation  — Hero background: animated particle-network on <canvas>
 *   Navigation       — Sticky nav scroll behaviour + active link scroll-spy
 *   Testimonials     — Auto-play carousel with dots, arrows, touch swipe
 *   StatsCounter     — Animated count-up triggered by IntersectionObserver
 *   ContactForm      — Client-side validation + mock async submission
 *   ScrollReveal     — Lightweight scroll-based reveal (replaces AOS library)
 *   BackToTop        — Floating scroll-to-top button
 *   App              — Root controller: calls init() on each module
 * =============================================================================
 */

'use strict';

/* =============================================================================
   1. HERO CANVAS ANIMATION
   -----------------------------------------------------------------------------
   Fluid, interactive abstract wave canvas injected into #canvas-container.
   • Three layered bezier-curve waves animate continuously.
   • Mouse / touch parallax warps the waves in real-time.
   • Click / tap spawns an expanding liquid ripple.
   • Pure Canvas 2D — no external libraries required.
   ============================================================================= */
const HeroCanvas = (() => {

  /**
   * Initialises the interactive fluid canvas and appends it to parentElement.
   * @param {HTMLElement} parentElement
   */
  function initAbstractHeroCanvas(parentElement) {
    const canvas = document.createElement('canvas');
    canvas.className = 'hero-canvas-bg';
    parentElement.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width, height;
    let animationFrameId;
    let time = 0;

    let mouse = { x: 0, y: 0, tx: 0, ty: 0, active: false };
    let ripples = [];

    const baseColor      = '#7585eb';
    const wave1Start     = 'rgba(130, 147, 240, 0.9)';
    const wave1End       = 'rgba(130, 147, 240, 0.0)';
    const wave2Start     = 'rgba(153, 169, 248, 0.85)';
    const wave2End       = 'rgba(153, 169, 248, 0.1)';
    const wave3Start     = 'rgba(180, 195, 255, 0.6)';
    const wave3End       = 'rgba(180, 195, 255, 0.0)';

    function resize() {
      width  = parentElement.clientWidth;
      height = parentElement.clientHeight;
      const dpr    = window.devicePixelRatio || 1;
      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      if (!mouse.active) {
        mouse.tx = width  / 2;
        mouse.ty = height / 2;
        mouse.x  = mouse.tx;
        mouse.y  = mouse.ty;
      }
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    /* Bind mouse / touch events to the hero section so they fire even over
       the text-overlay (which sits above #canvas-container) */
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
      const x    = clientX - rect.left;
      const y    = clientY - rect.top;
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
      const endX  = width + 100;
      const endY  = height * (offsetY - 0.4) + Math.cos(t * phaseY * 0.8) * 80 + py * 2;
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
      animationFrameId = requestAnimationFrame(draw);
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
   1b. TYPING EFFECT MODULE
   -----------------------------------------------------------------------------
   Types the hero heading gradient text (#heroTyped) one character at a time
   after a short delay, then blinks the cursor briefly and hides it.
   Text is pre-rendered in HTML for SEO; JS clears it and re-types so the
   feature degrades gracefully when JS is unavailable.
   ============================================================================= */
const TypingEffect = (() => {
  const SPEED       = 75;   // ms per character
  const START_DELAY = 650;  // ms before first keystroke (lets hero build first)

  function init() {
    const el     = document.getElementById('heroTyped');
    const cursor = document.querySelector('.typing-cursor');
    if (!el) return;

    /* Capture the full text from the pre-rendered HTML, then clear for re-type */
    const fullText = el.textContent.trim() || 'Shaping Futures.';
    el.textContent = '';

    let i = 0;
    setTimeout(() => {
      const timer = setInterval(() => {
        el.textContent += fullText[i];
        i++;
        if (i >= fullText.length) {
          clearInterval(timer);
          /* Blink ~3× then vanish */
          setTimeout(() => { cursor && cursor.classList.add('hide'); }, 2200);
        }
      }, SPEED);
    }, START_DELAY);
  }

  return { init };
})();


/* =============================================================================
   2. NAVIGATION MODULE
   -----------------------------------------------------------------------------
   – Adds `.scrolled` class to navbar after 50px scroll (triggers box-shadow).
   – Scroll-spy: highlights the matching nav-link for the visible section.
   – Closes Bootstrap mobile menu when a link is clicked.
   ============================================================================= */
const Navigation = (() => {
  let nav, sections, navLinks;

  function onScroll() {
    /* Toggle scrolled shadow */
    nav.classList.toggle('scrolled', window.scrollY > 50);

    /* Scroll-spy: find the deepest section whose top is above viewport mid */
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

    /* Mobile: close hamburger menu after clicking any nav link */
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
   4. STATS COUNTER MODULE
   -----------------------------------------------------------------------------
   Animates `data-count` numbers from 0 → target when the hero section scrolls
   into view. Uses an ease-out cubic function so high numbers decelerate.
   Only fires once per page load (guarded by `animated` flag).
   ============================================================================= */
const StatsCounter = (() => {
  let animated = false;

  /** Cubic ease-out: fast start, gentle stop */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800; // ms
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.floor(easeOutCubic(progress) * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target; // ensure exact final value
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
   5. CONTACT FORM MODULE
   -----------------------------------------------------------------------------
   Handles:
   – Real-time per-field validation on blur and on input (after first touch)
   – Full validation on submit
   – Mock async submission (simulated 1.5s network delay)
   – Success overlay display and reset

   Validation rules are declarative objects — easy to extend.
   ============================================================================= */
const ContactForm = (() => {

  /* Declarative validation rules ------------------------------------------- */
  const RULES = {
    name: {
      test:    v => v.trim().length >= 2,
      message: 'Please enter your full name (at least 2 characters).',
    },
    email: {
      test:    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: 'Please enter a valid email address.',
    },
    phone: {
      /* Allow 7–15 digits, optional spaces, +, -, parentheses */
      test:    v => /^[\d\s+\-()]{7,15}$/.test(v.trim()),
      message: 'Please enter a valid phone number.',
    },
    message: {
      test:    v => v.trim().length >= 10,
      message: 'Message must be at least 10 characters.',
    },
  };

  /* DOM helpers ------------------------------------------------------------- */
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

  /** Run all rules. Returns true only if every field passes. */
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

  /** Attach live feedback (blur + input) to each validated field */
  function bindLiveValidation() {
    Object.entries(RULES).forEach(([id, rule]) => {
      const field = getField(id);
      if (!field) return;

      field.addEventListener('blur', () => {
        clearError(id);
        if (field.value && !rule.test(field.value)) markError(id, rule.message);
      });

      /* Once an error is shown, clear it as soon as the user fixes the value */
      field.addEventListener('input', () => {
        if (field.classList.contains('error') && rule.test(field.value)) clearError(id);
      });
    });
  }

  /** Simulate an async POST (1.5 s delay) then show success overlay */
  function mockSubmit(form) {
    const btn     = document.getElementById('submitBtn');
    const btnLabel = btn?.querySelector('.btn-label');

    if (btn)      btn.classList.add('loading');
    if (btnLabel) btnLabel.textContent = 'Sending…';

    setTimeout(() => {
      if (btn)      btn.classList.remove('loading');
      if (btnLabel) btnLabel.textContent = 'Send Message';

      /* Show success panel */
      document.getElementById('formSuccess')?.classList.add('show');

      /* Reset form fields */
      form.reset();
    }, 1500);
  }

  function init() {
    const form       = document.getElementById('contactForm');
    const resetBtn   = document.getElementById('resetForm');
    const successEl  = document.getElementById('formSuccess');

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
   6. SCROLL REVEAL MODULE
   -----------------------------------------------------------------------------
   A minimal, dependency-free scroll-reveal using IntersectionObserver.
   Elements with [data-aos] are classed `.aos-animate` when they enter the
   viewport, which CSS then transitions (fade + translate).

   Supports `data-aos-delay` (ms) for staggered entrance animations.
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
   7. BACK TO TOP MODULE
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
   8. APP — ROOT CONTROLLER
   -----------------------------------------------------------------------------
   Single entry point. Initialises every module in dependency order after the
   DOM is ready.

   Usage pattern:
     App.init()  — called once on DOMContentLoaded
   ============================================================================= */
const App = {
  /**
   * Runs after DOM is fully parsed.
   * Order: animation first (avoids blank canvas flash), then UI modules.
   */
  init() {
    this.bindGlobalEvents();
    this.initModules();
  },

  bindGlobalEvents() {
    /* Placeholder for any future global event delegation */
  },

  initModules() {
    HeroCanvas.init();       // Hero fluid wave canvas animation
    TypingEffect.init();     // Hero heading typing animation
    Navigation.init();       // Sticky nav + scroll-spy
    // Testimonials: now handled natively by Bootstrap 5 Carousel (data-bs-ride)
    StatsCounter.init();     // Animated counter numbers
    ContactForm.init();      // Form validation and mock submit
    ScrollReveal.init();     // Reveal sections on scroll
    BackToTop.init();        // Floating scroll-up button
  },
};

/* Bootstrap — run when DOM is ready */
document.addEventListener('DOMContentLoaded', () => App.init());
