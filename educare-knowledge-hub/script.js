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
   1. THREE.JS 3D MESH ANIMATION (ported from index2.html ThreeAnim)
   -----------------------------------------------------------------------------
   Mounts a rotating 3D interconnected knowledge-network on #canvas-container.
   • WebGLRenderer with alpha:true — background is fully transparent so the
     hero CSS background image (Layer 1) shows through underneath.
   • Spherically-distributed white particles connected by semi-transparent lines.
   • auto-rotation + smooth mouse/touch camera parallax.
   ============================================================================= */
const ThreeAnim = (() => {
  let container, scene, camera, renderer, group;
  let mouseX = 0, mouseY = 0;
  let halfW = window.innerWidth  / 2;
  let halfH = window.innerHeight / 2;

  function init() {
    container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    /* Scene */
    scene = new THREE.Scene();

    /* Camera */
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 800;

    /* Renderer — alpha:true keeps canvas transparent so bg image shows below */
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    /* Group that rotates each frame */
    group = new THREE.Group();
    scene.add(group);

    /* Adaptive particle count for performance */
    const isMobile      = window.innerWidth < 768;
    const particleCount = isMobile ? 200 : 450;
    const maxDist       = isMobile ? 100 : 120;

    /* Generate particle positions uniformly inside a sphere */
    const pos = [];
    for (let i = 0; i < particleCount; i++) {
      const r     = 500 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }

    /* White particle dots */
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    group.add(new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 3, transparent: true, opacity: 0.8, sizeAttenuation: true })
    ));

    /* Connecting line segments between nearby particles */
    const linePts = [];
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const ix = i * 3, jx = j * 3;
        const dx = pos[ix]   - pos[jx];
        const dy = pos[ix+1] - pos[jx+1];
        const dz = pos[ix+2] - pos[jx+2];
        if (Math.sqrt(dx*dx + dy*dy + dz*dz) < maxDist) {
          linePts.push(pos[ix], pos[ix+1], pos[ix+2], pos[jx], pos[jx+1], pos[jx+2]);
        }
      }
    }
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
    group.add(new THREE.LineSegments(
      lGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 })
    ));

    /* Events */
    window.addEventListener('resize',     onResize,    { passive: true });
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });

    animate();
  }

  function onResize() {
    halfW = window.innerWidth  / 2;
    halfH = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(e) {
    mouseX = (e.clientX - halfW) * 0.2;
    mouseY = (e.clientY - halfH) * 0.2;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      mouseX = (e.touches[0].clientX - halfW) * 0.3;
      mouseY = (e.touches[0].clientY - halfH) * 0.3;
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    /* Slow continuous rotation */
    group.rotation.x += 0.001;
    group.rotation.y += 0.002;
    /* Smooth camera parallax based on mouse/touch position */
    camera.position.x += (mouseX  - camera.position.x) * 0.02;
    camera.position.y += (-mouseY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
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
    ThreeAnim.init();        // Hero Three.js 3D mesh (transparent over bg image)
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
