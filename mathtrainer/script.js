/**
 * ================================================================
 * MATHTRAINER — SCRIPT.JS
 * Full game engine for "Math Blitz"
 *
 * SECTIONS:
 *  1. Constants & Config
 *  2. State Management
 *  3. Sound Manager
 *  4. Three.js Background Scene Manager
 *  5. UI Renderer
 *  6. Game Engine (question generation, scoring, timer)
 *  7. Animation Utilities
 *  8. Screen Router
 *  9. Share API
 * 10. Initialization
 * ================================================================
 */

'use strict';

/* ================================================================
   1. CONSTANTS & CONFIG
   ================================================================ */

const CONFIG = {
  GAME_DURATION:  60,          // seconds per blitz
  DIFFICULTY_SETTINGS: {
    easy: {
      ops:  ['+', '-'],
      range: [1, 12],
      label: 'Easy Mode'
    },
    medium: {
      ops:  ['+', '-', '×'],
      range: [2, 20],
      label: 'Medium Mode'
    },
    hard: {
      ops:  ['+', '-', '×', '÷'],
      range: [3, 30],
      label: 'Hard Mode'
    }
  },
  STREAK_MILESTONES: [3, 5, 10, 15, 20],
  POINTS_CORRECT:   10,        // base points
  POINTS_STREAK_BONUS: 2,      // extra per 5-streak
  STORAGE_KEY:       'mathblitz_v2',
  THREE_OBJECT_COUNT: 24       // max low-poly objects
};

/* ================================================================
   2. STATE MANAGEMENT
   Central source of truth for all runtime data
   ================================================================ */

/** @type {Object} Live game state (reset each round) */
const gameState = {
  score:          0,
  streak:         0,
  bestStreak:     0,
  timer:          CONFIG.GAME_DURATION,
  totalQuestions: 0,
  correctAnswers: 0,
  currentAnswer:  null,
  timerInterval:  null,
  difficulty:     'medium',
  active:         false,
  animFrame:      null,
};

/**
 * Persistent high-score data saved to localStorage.
 * @type {{highScore: number, gamesPlayed: number}}
 */
let savedData = loadSavedData();

function loadSavedData() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* ignore */ }
  return { highScore: 0, gamesPlayed: 0 };
}

function persistData() {
  try {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(savedData));
  } catch (_) { /* quota exceeded — fail silently */ }
}

function resetGameState() {
  gameState.score          = 0;
  gameState.streak         = 0;
  gameState.bestStreak     = 0;
  gameState.timer          = CONFIG.GAME_DURATION;
  gameState.totalQuestions = 0;
  gameState.correctAnswers = 0;
  gameState.currentAnswer  = null;
  gameState.active         = false;
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }
}

/* ================================================================
   3. SOUND MANAGER
   Web Audio API — synthesized sounds, zero file loading.
   ================================================================ */

const SoundManager = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (_) { return null; }
    }
    // Resume if suspended (required by browsers after user gesture)
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /**
   * Play a synthesized tone.
   * @param {number} freq  — frequency in Hz
   * @param {string} type  — OscillatorNode.type
   * @param {number} dur   — duration in seconds
   * @param {number} vol   — gain (0–1)
   * @param {number} decay — decay time (for satisfying click)
   */
  function playTone(freq, type = 'sine', dur = 0.12, vol = 0.25, decay = 0.08) {
    const c = getCtx();
    if (!c) return;
    try {
      const osc  = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type      = type;
      osc.frequency.setValueAtTime(freq, c.currentTime);
      gain.gain.setValueAtTime(vol, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + dur + decay);
    } catch (_) { /* ignore */ }
  }

  return {
    /** Satisfying soft click — correct answer */
    correct() {
      playTone(880, 'sine',    0.10, 0.22);
      setTimeout(() => playTone(1100, 'sine', 0.08, 0.15), 60);
    },
    /** Low muted thud — incorrect */
    incorrect() {
      playTone(160, 'sawtooth', 0.18, 0.18);
      playTone(120, 'triangle', 0.15, 0.12);
    },
    /** Countdown urgency tick */
    tick() {
      playTone(440, 'sine', 0.05, 0.08);
    },
    /** Game-over sound */
    gameOver() {
      playTone(440, 'sine',    0.2, 0.25);
      setTimeout(() => playTone(330, 'sine', 0.2, 0.22), 180);
      setTimeout(() => playTone(220, 'sine', 0.3, 0.20), 360);
    },
    /** Milestone streak chime */
    milestone() {
      playTone(660, 'sine', 0.12, 0.2);
      setTimeout(() => playTone(880, 'sine', 0.10, 0.18), 80);
      setTimeout(() => playTone(1320,'sine', 0.09, 0.15), 160);
    }
  };
})();

/* ================================================================
   4. THREE.JS BACKGROUND SCENE MANAGER
   Renders floating 3D numbers and geometric low-poly wireframes.
   Mouse / gyro interaction shifts object positions subtly.
   ================================================================ */

class BackgroundScene {
  constructor() {
    this.canvas    = document.getElementById('bg-canvas');
    this.renderer  = null;
    this.scene     = null;
    this.camera    = null;
    this.objects   = [];
    this.mouse     = { x: 0, y: 0 };      // normalised -1..1
    this.gyro      = { x: 0, y: 0 };      // device tilt
    this.raf       = null;
    this.isMobile  = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    this._gyroEnabled = false;
    this._clock    = null;                 // for time-based animation
  }

  /** Initialise renderer, scene, camera, objects */
  init() {
    if (!window.THREE) return;

    /* Renderer */
    this.renderer = new THREE.WebGLRenderer({
      canvas:     this.canvas,
      antialias:  false,    // off for perf on mobile
      alpha:      true,
      powerPreference: 'low-power'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);

    /* Scene */
    this.scene = new THREE.Scene();

    /* Camera — perspective, moderate FOV */
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 0, 30);

    /* Ambient + directional light for subtle shading */
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffd700, 0.6);
    dirLight.position.set(10, 20, 10);
    this.scene.add(dirLight);

    /* Build objects */
    this._buildObjects();

    /* Clock for delta-time */
    this._clock = new THREE.Clock();

    /* Events */
    this.handleResize = this.handleResize.bind(this);
    this.handleInteraction = this.handleInteraction.bind(this);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.handleInteraction);

    /* Device tilt (mobile) */
    if (this.isMobile && window.DeviceOrientationEvent) {
      const handler = (e) => {
        this.gyro.x = (e.gamma || 0) / 45; // -1 .. 1
        this.gyro.y = (e.beta  || 0) / 90; // -1 .. 1
      };
      // Requires permission on iOS 13+
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        document.getElementById('btn-start').addEventListener('click', () => {
          DeviceOrientationEvent.requestPermission()
            .then(state => { if (state === 'granted') window.addEventListener('deviceorientation', handler); })
            .catch(() => {});
        }, { once: true });
      } else {
        window.addEventListener('deviceorientation', handler);
        this._gyroEnabled = true;
      }
    }

    this.animate();
  }

  /** Create floating numbers and geometric wireframes */
  _buildObjects() {
    const count    = CONFIG.THREE_OBJECT_COUNT;
    const symbols  = ['1','2','3','4','5','6','7','8','9','×','+','−','÷','?'];
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Spread factor: wider on big screens
    const spread = Math.max(W, H) / 30;

    for (let i = 0; i < count; i++) {
      let mesh;

      if (i % 3 === 0) {
        /* Wireframe tetrahedron */
        const geo = new THREE.TetrahedronGeometry(0.6 + Math.random() * 0.7, 0);
        const mat = new THREE.MeshBasicMaterial({
          color:     0xffd700,
          wireframe: true,
          transparent: true,
          opacity:   0.12 + Math.random() * 0.1
        });
        mesh = new THREE.Mesh(geo, mat);
      } else if (i % 3 === 1) {
        /* Wireframe icosahedron */
        const geo = new THREE.IcosahedronGeometry(0.4 + Math.random() * 0.5, 0);
        const mat = new THREE.MeshBasicMaterial({
          color:     0x00e5ff,
          wireframe: true,
          transparent: true,
          opacity:   0.08 + Math.random() * 0.1
        });
        mesh = new THREE.Mesh(geo, mat);
      } else {
        /* Wireframe torus knot — number-like loop */
        const geo = new THREE.TorusGeometry(0.3 + Math.random() * 0.25, 0.08, 6, 6);
        const mat = new THREE.MeshBasicMaterial({
          color:     0xb06fff,
          wireframe: true,
          transparent: true,
          opacity:   0.1 + Math.random() * 0.08
        });
        mesh = new THREE.Mesh(geo, mat);
      }

      // Random position in 3D space
      mesh.position.set(
        (Math.random() - 0.5) * spread * 2.0,
        (Math.random() - 0.5) * spread * 1.4,
        (Math.random() - 0.5) * spread * 0.5
      );

      // Random rotation seed
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      // Store animation params
      mesh.userData = {
        rotSpeed: { x: (Math.random() - 0.5) * 0.004, y: (Math.random() - 0.5) * 0.006 },
        floatAmp:  0.04 + Math.random() * 0.08,
        floatFreq: 0.3  + Math.random() * 0.5,
        floatOff:  Math.random() * Math.PI * 2,
        basePos:   mesh.position.clone()
      };

      this.scene.add(mesh);
      this.objects.push(mesh);
    }
  }

  /** rAF loop — called every frame */
  animate() {
    this.raf = requestAnimationFrame(() => this.animate());
    const delta = this._clock.getDelta();
    const time  = this._clock.getElapsedTime();

    // Determine parallax input (mouse or gyro)
    const px = this.isMobile ? this.gyro.x : this.mouse.x;
    const py = this.isMobile ? this.gyro.y : this.mouse.y;

    // Smooth camera drift toward parallax target
    this.camera.position.x += (px * 3 - this.camera.position.x) * 0.04;
    this.camera.position.y += (-py * 2 - this.camera.position.y) * 0.04;
    this.camera.lookAt(0, 0, 0);

    // Animate each object
    for (const obj of this.objects) {
      const d = obj.userData;
      // Gentle continuous rotation
      obj.rotation.x += d.rotSpeed.x;
      obj.rotation.y += d.rotSpeed.y;
      // Sine wave floating
      obj.position.y = d.basePos.y + Math.sin(time * d.floatFreq + d.floatOff) * d.floatAmp;
    }

    this.renderer.render(this.scene, this.camera);
  }

  /** Pause / slow down the scene (used for results screen) */
  slow() {
    for (const obj of this.objects) {
      obj.userData.rotSpeed.x *= 0.1;
      obj.userData.rotSpeed.y *= 0.1;
    }
  }

  /** Resume normal speed */
  resume() {
    for (const obj of this.objects) {
      obj.userData.rotSpeed.x = (Math.random() - 0.5) * 0.004;
      obj.userData.rotSpeed.y = (Math.random() - 0.5) * 0.006;
    }
  }

  /** Handle window resize — keep canvas full-screen */
  handleResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /** Normalise mouse position to -1..1 range */
  handleInteraction(e) {
    this.mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
    this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  }

  /** Cleanup (not strictly needed for SPA, but good practice) */
  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleInteraction);
  }
}

/* ================================================================
   5. UI RENDERER
   Handles all DOM updates — decoupled from game logic
   ================================================================ */

const UI = (() => {

  /* Cached DOM references */
  const els = {
    timerBar:       document.getElementById('timer-bar'),
    hudStreak:      document.getElementById('hud-streak'),
    hudScore:       document.getElementById('hud-score'),
    hudTimer:       document.getElementById('hud-timer'),
    problemText:    document.getElementById('problem-text'),
    answerInput:    document.getElementById('answer-input'),
    inputWrap:      document.getElementById('input-wrap'),
    feedbackBar:    document.getElementById('feedback-bar'),
    qBadge:         document.getElementById('q-badge'),
    qCorrect:       document.getElementById('q-correct'),
    qTotal:         document.getElementById('q-total'),
    gameCard:       document.getElementById('game-card'),
    timerChip:      document.querySelector('.timer-chip'),

    // Results
    pbBanner:       document.getElementById('pb-banner'),
    resultsDiff:    document.getElementById('results-diff-label'),
    resultsScore:   document.getElementById('results-score'),
    tileQpm:        document.getElementById('tile-qpm'),
    tileAccuracy:   document.getElementById('tile-accuracy'),
    tileStreak:     document.getElementById('tile-streak'),
    statTotal:      document.getElementById('stat-total'),
    statCorrect:    document.getElementById('stat-correct'),
    statBest:       document.getElementById('stat-best'),

    // Hero
    heroBest:       document.getElementById('hero-best'),
    heroGames:      document.getElementById('hero-games'),
  };

  /** Update timer progress bar + color phase */
  function updateTimerBar(secondsLeft, total) {
    const pct = (secondsLeft / total) * 100;
    els.timerBar.style.width = pct + '%';
    // Colour phases
    els.timerBar.classList.remove('phase-orange', 'phase-red');
    if (secondsLeft <= 10) {
      els.timerBar.classList.add('phase-red');
    } else if (secondsLeft <= 25) {
      els.timerBar.classList.add('phase-orange');
    }
    // HUD timer
    els.hudTimer.textContent = secondsLeft;
    // Urgent state
    if (secondsLeft <= 10) {
      els.timerChip.classList.add('urgent');
    } else {
      els.timerChip.classList.remove('urgent');
    }
  }

  /** Update HUD score + streak */
  function updateHUD(score, streak) {
    els.hudScore.textContent  = score;
    els.hudStreak.textContent = streak;
  }

  /** Render a new question with slide-in animation */
  function showQuestion(text, index) {
    els.problemText.classList.remove('slide-in');
    // Trigger reflow for re-animation
    void els.problemText.offsetWidth;
    els.problemText.textContent = text;
    els.problemText.classList.add('slide-in');
    els.qBadge.textContent = 'Q' + (index + 1);
  }

  /** Show answer feedback (correct / incorrect) */
  function showFeedback(type, message) {
    els.feedbackBar.textContent = message;
    els.feedbackBar.className   = 'feedback-bar ' + type;
    // Auto-clear
    setTimeout(() => { els.feedbackBar.textContent = ''; els.feedbackBar.className = 'feedback-bar'; }, 600);
  }

  /** Flash input border and bloom overlay */
  function flashInput(type) {
    const cls = type === 'correct' ? 'correct' : 'incorrect';
    els.inputWrap.classList.remove('correct', 'incorrect');
    void els.inputWrap.offsetWidth;
    els.inputWrap.classList.add(cls);
    setTimeout(() => els.inputWrap.classList.remove(cls), 520);

    // Add bloom overlay to card
    const bloom = document.createElement('div');
    bloom.className = 'bloom-overlay ' + (type === 'correct' ? 'green' : 'red');
    els.gameCard.appendChild(bloom);
    setTimeout(() => bloom.remove(), 500);
  }

  /** Floating score pop "+N" */
  function showScorePop(points) {
    const el = document.createElement('div');
    el.className   = 'score-pop';
    el.textContent = '+' + points;
    els.gameCard.appendChild(el);
    setTimeout(() => el.remove(), 750);
  }

  /** Update progress counts */
  function updateProgress(correct, total) {
    els.qCorrect.textContent = '✓ ' + correct + ' correct';
    els.qTotal.textContent   = total + ' answered';
  }

  /** Clear and focus input */
  function clearInput() {
    els.answerInput.value = '';
    // Defer re-focus briefly so virtual keyboard stays open
    setTimeout(() => {
      try { els.answerInput.focus({ preventScroll: true }); } catch (_) {}
    }, 30);
  }

  /** Show streak milestone toast */
  function showStreakToast(n) {
    const existing = document.querySelector('.streak-toast');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className   = 'streak-toast';
    el.textContent = '🔥 ' + n + ' Streak!';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2300);
  }

  /** Populate results screen */
  function renderResults(state, saved) {
    const qpm      = Math.round((state.totalQuestions / CONFIG.GAME_DURATION) * 60);
    const accuracy = state.totalQuestions > 0
      ? Math.round((state.correctAnswers / state.totalQuestions) * 100)
      : 0;
    const diffCfg  = CONFIG.DIFFICULTY_SETTINGS[state.difficulty];

    els.resultsDiff.textContent  = diffCfg.label;
    els.resultsScore.textContent = state.score;
    els.tileQpm.textContent      = qpm;
    els.tileAccuracy.textContent = accuracy + '%';
    els.tileStreak.textContent   = state.bestStreak;
    els.statTotal.textContent    = state.totalQuestions;
    els.statCorrect.textContent  = state.correctAnswers;
    els.statBest.textContent     = saved.highScore || '—';

    // Personal best banner
    const isPB = state.score > 0 && state.score >= saved.highScore;
    els.pbBanner.style.display = isPB ? 'flex' : 'none';
  }

  /** Update hero screen stat chips */
  function updateHeroStats(saved) {
    els.heroBest.textContent  = saved.highScore || '—';
    els.heroGames.textContent = saved.gamesPlayed || 0;
  }

  return {
    updateTimerBar,
    updateHUD,
    showQuestion,
    showFeedback,
    flashInput,
    showScorePop,
    showStreakToast,
    updateProgress,
    clearInput,
    renderResults,
    updateHeroStats,
    els
  };
})();

/* ================================================================
   6. GAME ENGINE
   Question generation, answer validation, scoring, timer loop
   ================================================================ */

const GameEngine = (() => {

  /** Generate a math question based on current difficulty */
  function generateQuestion() {
    const cfg = CONFIG.DIFFICULTY_SETTINGS[gameState.difficulty];
    const op  = cfg.ops[Math.floor(Math.random() * cfg.ops.length)];
    const [min, max] = cfg.range;

    let a, b, answer, display;

    switch (op) {
      case '+': {
        a = randInt(min, max);
        b = randInt(min, max);
        answer  = a + b;
        display = `${a} + ${b}`;
        break;
      }
      case '-': {
        a = randInt(min, max);
        b = randInt(min, a);  // ensure non-negative result
        answer  = a - b;
        display = `${a} − ${b}`;
        break;
      }
      case '×': {
        a = randInt(2, Math.min(max, 20));
        b = randInt(2, Math.min(max, 15));
        answer  = a * b;
        display = `${a} × ${b}`;
        break;
      }
      case '÷': {
        b = randInt(2, Math.min(max, 12));
        answer  = randInt(2, Math.min(max, 12));
        a       = answer * b;
        display = `${a} ÷ ${b}`;
        break;
      }
      default:
        a = randInt(1, 10); b = randInt(1, 10);
        answer  = a + b;
        display = `${a} + ${b}`;
    }

    return { display, answer };
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /** Present next question */
  function nextQuestion() {
    const q = generateQuestion();
    gameState.currentAnswer = q.answer;
    gameState.totalQuestions++;
    UI.showQuestion(q.display, gameState.totalQuestions - 1);
    UI.clearInput();
  }

  /** Validate submitted answer */
  function submitAnswer() {
    if (!gameState.active) return;
    const raw    = UI.els.answerInput.value.trim();
    const parsed = parseInt(raw, 10);
    if (raw === '' || isNaN(parsed)) return;

    if (parsed === gameState.currentAnswer) {
      handleCorrect();
    } else {
      handleIncorrect(gameState.currentAnswer);
    }
  }

  /** Handle correct answer */
  function handleCorrect() {
    gameState.streak++;
    if (gameState.streak > gameState.bestStreak) gameState.bestStreak = gameState.streak;

    // Calculate points with streak bonus
    const bonus  = Math.floor(gameState.streak / 5) * CONFIG.POINTS_STREAK_BONUS;
    const points = CONFIG.POINTS_CORRECT + bonus;
    gameState.score += points;
    gameState.correctAnswers++;

    // UI feedback
    UI.flashInput('correct');
    UI.showFeedback('correct', '✓ Correct!');
    UI.showScorePop(points);
    UI.updateHUD(gameState.score, gameState.streak);
    UI.updateProgress(gameState.correctAnswers, gameState.totalQuestions);

    // Sound
    SoundManager.correct();

    // Streak milestone
    if (CONFIG.STREAK_MILESTONES.includes(gameState.streak)) {
      SoundManager.milestone();
      UI.showStreakToast(gameState.streak);
    }

    // Next question immediately
    nextQuestion();
  }

  /** Handle incorrect answer */
  function handleIncorrect(correctAns) {
    gameState.streak = 0;
    UI.flashInput('incorrect');
    UI.showFeedback('incorrect', `✗ Answer: ${correctAns}`);
    UI.updateHUD(gameState.score, gameState.streak);
    SoundManager.incorrect();
    // DO NOT advance question — player must try again or wait for timer
    // Clear input for re-entry
    setTimeout(() => {
      UI.els.answerInput.value = '';
      try { UI.els.answerInput.focus({ preventScroll: true }); } catch (_) {}
    }, 30);
  }

  /** Start the 60-second countdown timer */
  function startTimer() {
    gameState.timer = CONFIG.GAME_DURATION;
    UI.updateTimerBar(gameState.timer, CONFIG.GAME_DURATION);

    gameState.timerInterval = setInterval(() => {
      gameState.timer--;
      UI.updateTimerBar(gameState.timer, CONFIG.GAME_DURATION);

      // Urgency tick in final 10 seconds
      if (gameState.timer <= 10 && gameState.timer > 0) {
        SoundManager.tick();
      }

      if (gameState.timer <= 0) {
        endGame();
      }
    }, 1000);
  }

  /** Start a fresh game */
  function startGame(difficulty) {
    resetGameState();
    gameState.difficulty = difficulty || 'medium';
    gameState.active     = true;

    UI.updateHUD(0, 0);
    UI.updateProgress(0, 0);
    UI.updateTimerBar(CONFIG.GAME_DURATION, CONFIG.GAME_DURATION);

    startTimer();
    nextQuestion();
  }

  /** End game — save data, show results */
  function endGame() {
    gameState.active = false;
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;

    SoundManager.gameOver();

    // Update persistent data
    savedData.gamesPlayed++;
    const isNewBest = gameState.score > savedData.highScore;
    if (isNewBest) savedData.highScore = gameState.score;
    persistData();

    // Slow down Three.js scene
    bgScene.slow();

    // Show results after brief pause
    setTimeout(() => {
      UI.renderResults(gameState, savedData);
      ScreenRouter.go('results');

      // Confetti for new personal best
      if (isNewBest && gameState.score > 0 && typeof confetti === 'function') {
        triggerConfetti();
      }
    }, 400);
  }

  return { startGame, submitAnswer, nextQuestion };
})();

/* ================================================================
   7. ANIMATION UTILITIES
   ================================================================ */

/** Trigger canvas-confetti burst for personal best */
function triggerConfetti() {
  const count = 160;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#FFD700','#FFA500'] });
  fire(0.20, { spread: 60, colors: ['#00e5ff','#b06fff'] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#FFD700'] });
  fire(0.10, { spread: 120, startVelocity: 25 });
  fire(0.10, { spread: 120, startVelocity: 45, colors: ['#39ff87'] });
}

/** Animate a number counting up (for score display) */
function animateCountUp(el, targetVal, duration = 600) {
  const start  = 0;
  const startT = performance.now();

  function step(now) {
    const elapsed = now - startT;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (targetVal - start) * eased);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = targetVal;
  }

  requestAnimationFrame(step);
}

/* ================================================================
   8. SCREEN ROUTER
   Manages screen transitions (Hero → Game → Results)
   ================================================================ */

const ScreenRouter = (() => {
  const screens = {
    hero:    document.getElementById('screen-hero'),
    game:    document.getElementById('screen-game'),
    results: document.getElementById('screen-results'),
  };

  let current = 'hero';

  function go(name) {
    const prev = screens[current];
    const next = screens[name];
    if (!next || name === current) return;

    // Exit current screen
    prev.classList.remove('active');
    prev.classList.add('exit');
    setTimeout(() => prev.classList.remove('exit'), 420);

    // Enter next screen
    next.classList.add('active');

    current = name;
  }

  return { go, current: () => current };
})();

/* ================================================================
   9. SHARE API
   ================================================================ */

function shareScore() {
  const score    = gameState.score;
  const accuracy = gameState.totalQuestions > 0
    ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)
    : 0;
  const diff     = gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);

  const text = `⚡ Math Blitz — ${diff} Mode\n💯 Score: ${score}\n🎯 Accuracy: ${accuracy}%\n🏆 Best: ${savedData.highScore}\n\nChallenge me → https://mathblitz.app`;

  if (navigator.share) {
    navigator.share({ title: 'Math Blitz Score', text })
      .catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  navigator.clipboard.writeText(text)
    .then(() => showCopyToast())
    .catch(() => {
      // Last-resort — legacy execCommand
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity  = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        showCopyToast();
      } catch (_) {}
    });
}

function showCopyToast() {
  const el = document.createElement('div');
  el.className   = 'streak-toast';
  el.textContent = '📋 Score copied!';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2300);
}

/* ================================================================
   10. INITIALIZATION
   Wire up all DOM events, init Three.js, start app
   ================================================================ */

// Three.js background instance (global so GameEngine can reference it)
const bgScene = new BackgroundScene();

document.addEventListener('DOMContentLoaded', () => {

  /* ── Init Three.js ── */
  bgScene.init();

  /* ── Populate hero stats ── */
  UI.updateHeroStats(savedData);

  /* ── Difficulty selector ── */
  let selectedDifficulty = 'medium';
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDifficulty = btn.dataset.diff;
    });
  });

  /* ── Start Blitz button ── */
  document.getElementById('btn-start').addEventListener('click', () => {
    SoundManager.correct(); // unlock audio context on first user gesture
    ScreenRouter.go('game');
    // Brief delay so transition completes before game starts
    setTimeout(() => {
      GameEngine.startGame(selectedDifficulty);
      // Focus input after screen is visible
      setTimeout(() => {
        try { UI.els.answerInput.focus({ preventScroll: true }); } catch (_) {}
      }, 80);
    }, 300);
  });

  /* ── Answer submit — Enter key ── */
  UI.els.answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      GameEngine.submitAnswer();
    }
  });

  /* ── Submit button click ── */
  document.getElementById('btn-submit').addEventListener('click', () => {
    GameEngine.submitAnswer();
  });

  /* ── Quit button ── */
  document.getElementById('btn-quit').addEventListener('click', () => {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    resetGameState();
    bgScene.resume();
    ScreenRouter.go('hero');
    UI.updateHeroStats(savedData);
  });

  /* ── Go Again (replay) ── */
  document.getElementById('btn-replay').addEventListener('click', () => {
    bgScene.resume();
    ScreenRouter.go('game');
    setTimeout(() => {
      GameEngine.startGame(gameState.difficulty);
      setTimeout(() => {
        try { UI.els.answerInput.focus({ preventScroll: true }); } catch (_) {}
      }, 80);
    }, 300);
  });

  /* ── Share button ── */
  document.getElementById('btn-share').addEventListener('click', shareScore);

  /* ── Back to menu ── */
  document.getElementById('btn-menu').addEventListener('click', () => {
    bgScene.resume();
    ScreenRouter.go('hero');
    UI.updateHeroStats(savedData);
  });

  /* ── Prevent pull-to-refresh & pinch-zoom on mobile ── */
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });

  /* ── Input: only allow numeric (handles clipboard etc.) ── */
  UI.els.answerInput.addEventListener('input', (e) => {
    // Strip non-numeric characters (allow minus sign)
    e.target.value = e.target.value.replace(/[^0-9\-]/g, '');
  });

  /*
   * Auto-submit when value is "long enough" to be correct.
   * This gives near-instant mobile UX without needing Enter.
   * Fires after a short debounce so user can type multi-digit numbers.
   */
  let autoSubmitTimer = null;
  UI.els.answerInput.addEventListener('input', () => {
    clearTimeout(autoSubmitTimer);
    const val = UI.els.answerInput.value;
    if (val.length >= 1 && gameState.active) {
      autoSubmitTimer = setTimeout(() => {
        // Check if the entered value matches — if not, let user keep typing
        const parsed   = parseInt(val, 10);
        const expected = gameState.currentAnswer;
        // Auto-submit when value is impossible to be correct by adding more digits
        // (e.g., typed 9, answer is 9 — submit; or typed 4 digits — submit)
        if (!isNaN(parsed) && (parsed === expected || val.length >= 4)) {
          GameEngine.submitAnswer();
        }
      }, 350);
    }
  });

  /* Animate score counter on results screen entry */
  const resultsObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.target.classList.contains('active') && m.target.id === 'screen-results') {
        const scoreEl = document.getElementById('results-score');
        const target  = parseInt(scoreEl.textContent, 10) || 0;
        animateCountUp(scoreEl, target, 700);
      }
    }
  });
  resultsObserver.observe(document.getElementById('screen-results'), {
    attributes: true, attributeFilter: ['class']
  });

});
