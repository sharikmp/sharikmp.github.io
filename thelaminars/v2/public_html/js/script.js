/**
 * =============================================================================
 * THE LAMINARS v2 - MAIN SCRIPT
 * Design: Educare Knowledge Hub pattern, Laminars content
 *
 * Module structure:
 *   HeroCanvas      - Animated wave canvas background
 *   TypingEffect    - Hero heading typing animation
 *   Navigation      - Sticky nav + scroll-spy + mobile close
 *   CourseFilter    - Category filter tabs for programs section
 *   StatsCounter    - Animated count-up on hero intersection
 *   ContactForm     - Client-side validation + async submit
 *   ScrollReveal    - Lightweight scroll-based reveal (no AOS dep)
 *   BackToTop       - Floating scroll-to-top button
 *   App             - Root controller
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

    const baseColor  = '#0c0c12';
    const wave1Start = 'rgba(59, 79, 206, 0.85)';    /* --primary */
    const wave1End   = 'rgba(59, 79, 206, 0.0)';
    const wave2Start = 'rgba(91, 111, 214, 0.70)';   /* --primary-light */
    const wave2End   = 'rgba(91, 111, 214, 0.0)';
    const wave3Start = 'rgba(45, 61, 184, 0.55)';    /* --primary-dark */
    const wave3End   = 'rgba(45, 61, 184, 0.0)';

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

    // Close on Enroll Now click
    const enrollBtn = nav.querySelector('.btn-enroll');
    if (enrollBtn) {
      enrollBtn.addEventListener('click', () => {
        const collapseEl = document.getElementById('navbarNav');
        if (collapseEl && collapseEl.classList.contains('show')) {
          const toggler = document.querySelector('.navbar-toggler');
          toggler && toggler.click();
        }
      });
    }

    // Close on click outside the navbar
    document.addEventListener('click', e => {
      const collapseEl = document.getElementById('navbarNav');
      if (collapseEl && collapseEl.classList.contains('show') && !nav.contains(e.target)) {
        const toggler = document.querySelector('.navbar-toggler');
        toggler && toggler.click();
      }
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

    targets.forEach(el => {
      // If already in viewport on load, animate immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const delay = parseInt(el.dataset.aosDelay || '0', 10);
        setTimeout(() => el.classList.add('aos-animate'), delay);
      } else {
        observer.observe(el);
      }
    });
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
   – ORBIT_ITEMS is the single source of truth for subject images and labels.
   – Each orbit icon displays the course image; the center circle swaps to
     match whichever icon is at the top position.
   – Sequence: hold → slide label out → rotate 60° → slide label in → repeat.
   ============================================================================= */
const OrbitLabel = (() => {

  /* ─────────────────────────────── DATA ──────────────────────────────────── */
  const ORBIT_ITEMS = [
    { img: 'img/course/science.png',     label: 'Science'     },  // pos 0 - top (0°)
    { img: 'img/course/coding.png',      label: 'Coding'      },  // pos 1 - 60°
    { img: 'img/course/english.png',     label: 'English'     },  // pos 2 - 120°
    { img: 'img/course/technology.png',  label: 'Technology'  },  // pos 3 - 180°
    { img: 'img/course/mathematics.png', label: 'Mathematics' },  // pos 4 - 240°
    { img: 'img/course/hindi.png',       label: 'Hindi'       },  // pos 5 - 300°
  ];

  /* ──────────────────────────── TIMING (ms) ──────────────────────────────── */
  const ROTATE_MS = 1100;   // duration of the 60° CSS transition
  const SLIDE_MS  = 480;    // label slide-out time (≈ CSS transition length)
  const HOLD_MS   = 2000;   // how long the label stays visible before sliding out

  /* ──────────── Positional classes matching .hdl-oi-N CSS rules ───────────── */
  const POS_CLASS = ['hdl-oi-1','hdl-oi-2','hdl-oi-3','hdl-oi-4','hdl-oi-5','hdl-oi-6'];
  // Indices 0 (top) and 3 (bottom) use left:50% and need translateX(-50%)
  const CENTERED  = new Set([0, 3]);
  const N         = ORBIT_ITEMS.length;

  /* ───────────────── Build icon DOM nodes from ORBIT_ITEMS ───────────────── */
  function buildIcons(ring) {
    ring.innerHTML = '';
    ORBIT_ITEMS.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = `hdl-orbit-icon ${POS_CLASS[i]}`;
      el.innerHTML = `<img src="${item.img}" alt="${item.label}" class="hdl-oi-img" />`;
      ring.appendChild(el);
    });
  }

  /* ──────── Apply rotation to ring + counter-rotate each icon ────────── */
  function applyAngle(ring, icons, angle, animated) {
    const dur    = animated ? `${ROTATE_MS}ms` : '0ms';
    const easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    ring.style.transition = `transform ${dur} ${easing}`;
    ring.style.transform  = `rotate(${angle}deg)`;
    icons.forEach((icon, i) => {
      icon.style.transition = `transform ${dur} ${easing}`;
      icon.style.transform  = CENTERED.has(i)
        ? `translateX(-50%) rotate(${-angle}deg)`
        : `rotate(${-angle}deg)`;
    });
  }

  /* ──────────────────── Item at top for a given step ─────────────────── */
  // When ring has rotated step×60° CW, physical pos (N-step)%N is at top.
  function itemAt(step) { return ORBIT_ITEMS[(N - step) % N]; }

  /* ──────────────────────── Label helpers ────────────────────────────── */
  function showLabel(el, text) {
    el.textContent = text;
    el.offsetHeight; // force reflow so transition fires from hidden state
    el.classList.add('visible');
  }
  function hideLabel(el) { el.classList.remove('visible'); }

  /* ─────── Swap center circle to the subject image now at top ────────── */
  function updateCenter(step) {
    const centerImg = document.getElementById('hdl-center-img');
    if (!centerImg) return;
    const item = itemAt(step);
    centerImg.style.opacity = '0';
    setTimeout(() => {
      centerImg.src = item.img;
      centerImg.alt = item.label;
      centerImg.style.opacity = '1';
    }, 220);
  }

  /* ──────────────────────────── Main init ────────────────────────────── */
  function init() {
    const ring    = document.querySelector('.hdl-orbit-ring');
    const labelEl = document.querySelector('.hdl-label-text');
    if (!ring || !labelEl) return;

    buildIcons(ring);
    const icons = Array.from(ring.querySelectorAll('.hdl-orbit-icon'));

    let step       = 0;
    let totalAngle = 0;

    // Place ring at 0° immediately (no animation)
    applyAngle(ring, icons, 0, false);

    // Show the first label + center image (Science - pos 0)
    showLabel(labelEl, itemAt(0).label);
    updateCenter(0);

    function cycle() {
      // Phase 1 - slide out current label
      hideLabel(labelEl);

      // Phase 2 - after label is gone, smoothly rotate 60°
      setTimeout(() => {
        step        = (step + 1) % N;
        totalAngle += 60;
        applyAngle(ring, icons, totalAngle, true);

        // Phase 3 - after rotation lands, slide new label in + swap center
        setTimeout(() => {
          showLabel(labelEl, itemAt(step).label);
          updateCenter(step);

          // Phase 4 - hold, then repeat
          setTimeout(cycle, HOLD_MS);
        }, ROTATE_MS + 80);

      }, SLIDE_MS);
    }

    // Kick off the first cycle after the initial hold
    setTimeout(cycle, HOLD_MS);
  }

  return { init };
})();


/* =============================================================================
   11. LEGACY STORY TIMELINE
   – IntersectionObserver activates each .story-step, fills the spine.
   – .lss-count[data-target] animate count-up on enter.
   ============================================================================= */
const LegacyStory = (() => {
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function countUp(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start    = performance.now();
    (function step(ts) {
      const p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(easeOut(p) * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    })(start);
  }

  function init() {
    const steps    = document.querySelectorAll('.story-step');
    const progress = document.getElementById('storyProgress');
    const counters = document.querySelectorAll('.lss-count[data-target]');
    const total    = steps.length;

    if (steps.length) {
      const stepObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-active');
          if (progress) {
            const n = document.querySelectorAll('.story-step.is-active').length;
            progress.style.height = `${(n / total) * 100}%`;
          }
          stepObs.unobserve(entry.target);
        });
      }, { threshold: 0.3 });
      steps.forEach(s => stepObs.observe(s));
    }

    if (counters.length) {
      const cntObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          countUp(entry.target);
          cntObs.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(c => cntObs.observe(c));
    }
  }

  return { init };
})();


/* =============================================================================
   12. APP - ROOT CONTROLLER
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
    LegacyStory.init();
    ScrollReveal.init();
    BackToTop.init();
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
