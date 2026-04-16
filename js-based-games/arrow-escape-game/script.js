
// ─── GAME CONFIGURATION ──────────────────────────────────────────────────────
const STAGES_PER_LEVEL = 3;
const STAGE_BUS_INCREMENT = 5;
const LEADERBOARD_SIZE = 10;

// --- SOUND ---
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
const beepBeepAudio = document.getElementById('beep-beep-audio');
const incorrectAudio = document.getElementById('incorrect-audio');

const LEVELS = [
    { id: 'easy', name: 'Easy', time: 30, cols: 10, rows: 10, buses: 50 },
    { id: 'medium', name: 'Medium', time: 45, cols: 13, rows: 13, buses: 100 },
    { id: 'hard', name: 'Hard', time: 60, cols: 15, rows: 15, buses: 150 },
    { id: 'pro', name: 'Pro', time: 60, cols: 17, rows: 17, buses: 200 },
];

// --- THEMES ---
const busThemes = [
    { main: '#FFD700', dark: '#E6B800', light: '#FFE44D', window: '#A0E4FF', grill: '#334155' }, // Yellow
    { main: '#4ade80', dark: '#16a34a', light: '#86efac', window: '#ecfeff', grill: '#1e293b' }, // Mint
    { main: '#60a5fa', dark: '#2563eb', light: '#93c5fd', window: '#f0f9ff', grill: '#1e293b' }, // Blue
    { main: '#f87171', dark: '#dc2626', light: '#fca5a5', window: '#fff1f2', grill: '#450a0a' }, // Red
    { main: '#a855f7', dark: '#7e22ce', light: '#c084fc', window: '#faf5ff', grill: '#3b0764' }  // Purple
];

// --- REUSABLE BUS CLASS ---
class CartoonBus {
    constructor(canvas, themeIndex) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.theme = busThemes[themeIndex % busThemes.length];
        this.isEngineOn = false;
        this.speed = 0;
        this.wheelRotation = 0;
        this.particles = [];
        this.animationId = null;

        // Bind methods to maintain context
        this.loop = this.loop.bind(this);
    }

    startEngine() {
        this.isEngineOn = true;
        this.speed = 1.5; // Faster wheel spin for escaping
        this.loop();
    }

    stopEngine() {
        this.isEngineOn = false;
        this.speed = 0;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    loop() {
        this.draw();
        if (this.isEngineOn || this.particles.length > 0) {
            this.animationId = requestAnimationFrame(this.loop);
        }
    }

    draw() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        const dpr = window.devicePixelRatio || 1;

        const w = 180;
        const h = 100;

        // 3D top-view config: tvH = how many px of roof are visible above body
        // tvX = how much the far (rear) corners shift inward for perspective
        const tvH = 32;
        const tvX = 5;

        // Scale to fit canvas including front overhang (25px) and roof (tvH)
        const scale = Math.min(canvas.width / dpr / 225, canvas.height / dpr / 175);

        const centerX = (canvas.width / dpr) / 2;
        const centerY = (canvas.height / dpr) / 2;

        // Engine Physics
        const time = Date.now() / 1000;
        const bounce = this.isEngineOn ? Math.sin(time * 25) * 3 : 0;
        this.wheelRotation -= this.speed * 0.4;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.translate(centerX, centerY + bounce * scale);
        ctx.scale(scale, scale);

        // Coordinate aliases — bus faces LEFT, front is on the left
        const front = -w / 2 - 25;  // front bumper X  (-115)
        const bodyL = -w / 2;        // body left X      (-90)
        const bodyR = w / 2;        // body right X     (+90)
        const bodyT = -h / 2;        // body top Y       (-50)
        const bodyB = h / 2;        // body bottom Y    (+50)

        // Roof "far" edge (the edge you see from above, going back into perspective)
        const rfY = bodyT - tvH;       //  -82
        const rfFrontX = front - tvX;      // -120  (front-far corner)
        const rfRearX = bodyR - tvX;      //  +85  (rear-far corner)

        // 1. Shadow
        ctx.beginPath();
        ctx.ellipse(10, bodyB + 15, 80 + (this.isEngineOn ? 5 : 0), 14, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fill();

        // 2. Rear face — dark sliver on the right edge for 3D depth
        ctx.globalAlpha = 0.45;
        ctx.fillStyle = this.theme.dark;
        ctx.beginPath();
        ctx.moveTo(bodyR, bodyT);
        ctx.lineTo(rfRearX, rfY);
        ctx.lineTo(rfRearX, rfY + h);
        ctx.lineTo(bodyR, bodyB);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // 3. Wheels Back
        this.drawWheel(-45, bodyB + 5, 20, this.wheelRotation);
        this.drawWheel(45, bodyB + 5, 20, this.wheelRotation);

        // 4. Body Side (main visible face)
        const mainGrad = ctx.createLinearGradient(0, bodyT, 0, bodyB);
        mainGrad.addColorStop(0, this.theme.main);
        mainGrad.addColorStop(1, this.theme.dark);
        ctx.fillStyle = mainGrad;
        ctx.beginPath();
        ctx.roundRect(bodyL, bodyT, w, h, 15);
        ctx.fill();

        // 5. Front Face (the cab / nose)
        ctx.fillStyle = this.theme.dark;
        ctx.beginPath();
        ctx.moveTo(bodyL, bodyT + 5);
        ctx.lineTo(front, bodyT + 15);
        ctx.lineTo(front, bodyB - 5);
        ctx.lineTo(bodyL, bodyB - 5);
        ctx.closePath();
        ctx.fill();

        // Windshield
        ctx.fillStyle = this.theme.window;
        ctx.beginPath();
        ctx.moveTo(bodyL - 5, bodyT + 15);
        ctx.lineTo(front + 10, bodyT + 22);
        ctx.lineTo(front + 10, bodyB - 45);
        ctx.lineTo(bodyL - 5, bodyB - 45);
        ctx.fill();

        // 6. TOP SURFACE (roof) — drawn after body so it visually overhangs the side panel
        const roofGrad = ctx.createLinearGradient(0, bodyT, 0, rfY);
        roofGrad.addColorStop(0, this.theme.light);  // near edge: brightest (sun-lit)
        roofGrad.addColorStop(1, this.theme.main);   // far edge: same hue, slightly darker
        ctx.fillStyle = roofGrad;
        ctx.beginPath();
        ctx.moveTo(front, bodyT);   // near-front corner
        ctx.lineTo(bodyR, bodyT);   // near-rear corner
        ctx.lineTo(rfRearX, rfY);     // far-rear corner
        ctx.lineTo(rfFrontX, rfY);     // far-front corner
        ctx.closePath();
        ctx.fill();

        // Roof fold line (crease where sidewall meets roof)
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(front, bodyT);
        ctx.lineTo(bodyR, bodyT);
        ctx.stroke();

        // Roof far-edge highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(rfFrontX, rfY);
        ctx.lineTo(rfRearX, rfY);
        ctx.stroke();

        // Roof detail: AC unit visible from above (perspective-correct box)
        ctx.fillStyle = this.theme.dark;
        ctx.globalAlpha = 0.4;
        const acNX = bodyL + 25, acNW = 55;
        const acFX = acNX - tvX * 0.6;
        ctx.beginPath();
        ctx.moveTo(acNX, bodyT - 2);
        ctx.lineTo(acNX + acNW, bodyT - 2);
        ctx.lineTo(acFX + acNW, rfY + 3);
        ctx.lineTo(acFX, rfY + 3);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Roof centre longitudinal stripe
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo((front + bodyR) / 2, bodyT);
        ctx.lineTo((rfFrontX + rfRearX) / 2, rfY);
        ctx.stroke();

        // 7. Side Windows
        ctx.fillStyle = this.theme.window;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.roundRect(bodyL + 25 + i * 45, bodyT + 15, 35, 35, 6);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(bodyL + 30 + i * 45, bodyT + 22);
            ctx.lineTo(bodyL + 42 + i * 45, bodyT + 22);
            ctx.stroke();
        }

        // Headlight
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = this.isEngineOn ? 10 : 0;
        ctx.shadowColor = '#fff';
        ctx.beginPath();
        ctx.arc(bodyL - 15, bodyB - 25, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Grill
        ctx.strokeStyle = this.theme.grill;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(bodyL - 18, bodyB - 12 + i * 4);
            ctx.lineTo(bodyL - 5, bodyB - 12 + i * 4);
            ctx.stroke();
        }

        // Exhaust Particles
        if (this.isEngineOn && Math.random() > 0.4) {
            this.particles.push({
                x: bodyR,
                y: bodyB - 10,
                size: Math.random() * 8 + 4,
                vx: Math.random() * 2 + 1,
                vy: -(Math.random() * 1.5),
                life: 1
            });
        }

        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.04;
            p.size *= 0.96;
            ctx.fillStyle = `rgba(148, 163, 184, ${Math.max(0, p.life * 0.6)})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            if (p.life <= 0) this.particles.splice(i, 1);
        });

        ctx.restore();
    }

    drawWheel(x, y, radius, rotation) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(radius * 0.4, 0);
            ctx.stroke();
        }
        ctx.restore();
    }
}


// ─── STATE ───────────────────────────────────────────────────────────────────
let grid = [];
let activeBuses = 0;
let isPlaying = false;
let startTime = 0;
let timerInterval = null;
let currentRunTime = 0;
let currentLevel = null;   // reference into LEVELS[]
let currentStage = 0;      // 0-based, 0..STAGES_PER_LEVEL-1
let clearedCount = 0;
let totalBusesForStage = 0;
let criticalPopShown = false;

// ─── DEFAULT LEADERBOARD DATA ─────────────────────────────────────────────────
const DEFAULT_LEADERBOARD = [
    { name: 'Neo', time: 18.4 },
    { name: 'Trinity', time: 22.1 },
    { name: 'Morpheus', time: 26.5 },
    { name: 'Cipher', time: 31.0 },
    { name: 'Smith', time: 35.8 },
    { name: 'Oracle', time: 42.3 },
    { name: 'Link', time: 48.9 },
    { name: 'Dozer', time: 53.2 },
    { name: 'Tank', time: 57.5 },
    { name: 'Mouse', time: 59.9 },
];

// ─── DOM REFERENCES ───────────────────────────────────────────────────────────
const gridEl = document.getElementById('grid');

// ─── UTILITY ─────────────────────────────────────────────────────────────────
function hideAllModals() {
    ['start-modal', 'result-modal', 'leaderboard-modal'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    const soundToggle = document.getElementById('sound-toggle');
    if (soundEnabled) {
        soundToggle.classList.remove('muted');
        soundToggle.textContent = '🔊';
    } else {
        soundToggle.classList.add('muted');
        soundToggle.textContent = '🔇';
    }
}

function playSound(type) {
    if (!soundEnabled) return;
    try {
        if (type === 'correct') {
            beepBeepAudio.currentTime = 0;
            beepBeepAudio.play().catch(() => {});
        } else if (type === 'incorrect') {
            incorrectAudio.currentTime = 0;
            incorrectAudio.play().catch(() => {});
        }
    } catch (e) {
        // Silently handle sound errors
    }
}

function setHeaderInfo(levelName, stage) {
    const lvlEl = document.getElementById('header-level-name');
    const sep1 = document.getElementById('header-sep');
    const stgEl = document.getElementById('header-stage-label');
    const sep2 = document.getElementById('header-sep2');
    if (levelName) {
        lvlEl.innerText = levelName;
        stgEl.innerText = `Stage ${stage + 1}/${STAGES_PER_LEVEL}`;
        [lvlEl, sep1, stgEl, sep2].forEach(el => el.classList.remove('hidden'));
    } else {
        [lvlEl, sep1, stgEl, sep2].forEach(el => el.classList.add('hidden'));
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

// ─── COUNTDOWN ───────────────────────────────────────────────────────────────
function showCountdown(callback) {
    const overlay   = document.getElementById('countdown-overlay');
    const intro     = document.getElementById('countdown-intro');
    const busWrap   = document.getElementById('countdown-bus-wrap');
    const busCanvas = document.getElementById('countdown-bus-canvas');
    const startLbl  = document.getElementById('countdown-start-label');
    const numEl     = document.getElementById('countdown-number');

    // Size canvas responsively
    const size = Math.min(window.innerWidth * 0.46, 210);
    const dpr  = window.devicePixelRatio || 1;
    busCanvas.width  = size * dpr;
    busCanvas.height = size * dpr;
    busCanvas.style.width  = `${size}px`;
    busCanvas.style.height = `${size}px`;
    // Flip so bus faces right (towards where it will fly)
    busCanvas.style.transform = 'scaleX(-1)';

    // Draw a random-themed bus
    const bus = new CartoonBus(busCanvas, Math.floor(Math.random() * busThemes.length));
    bus.draw();

    // Reset classes
    busWrap.classList.remove('countdown-bus-tap', 'countdown-bus-fly');
    startLbl.classList.remove('label-fade-out');
    intro.classList.remove('hidden');
    numEl.classList.add('hidden');
    numEl.textContent = '';
    overlay.classList.remove('hidden');

    // Tap handler
    busWrap.onpointerdown = () => {
        busWrap.onpointerdown = null; // prevent double-fire

        // Step 1: enlarge pop on tap
        busWrap.classList.add('countdown-bus-tap');

        // Step 2: start engine at half speed (slower than in-game)
        setTimeout(() => {
            bus.isEngineOn = true;
            bus.speed = 0.6;
            bus.loop();
        }, 40);

        // Step 3: fly off right + fade label
        setTimeout(() => {
            busWrap.classList.remove('countdown-bus-tap');
            busWrap.classList.add('countdown-bus-fly');
            startLbl.classList.add('label-fade-out');
        }, 360);

        // Step 4: switch to countdown numbers
        setTimeout(() => {
            bus.stopEngine();
            intro.classList.add('hidden');
            numEl.classList.remove('hidden');
            startNumbers();
        }, 1150);
    };

    function startNumbers() {
        function flash(text, isGo) {
            numEl.classList.remove('count-pop', 'go-text');
            void numEl.offsetWidth;
            numEl.textContent = text;
            if (isGo) numEl.classList.add('go-text');
            numEl.classList.add('count-pop');
        }
        flash('3', false);
        setTimeout(() => flash('2', false), 1000);
        setTimeout(() => flash('1', false), 2000);
        setTimeout(() => flash('GO!', true), 3000);
        setTimeout(() => {
            overlay.classList.add('hidden');
            numEl.classList.add('hidden');
            callback();
        }, 3350);
    }
}

// ─── LEVEL SELECT ─────────────────────────────────────────────────────────────
function buildLevelCards() {
    const container = document.getElementById('level-cards');
    container.innerHTML = '';
    LEVELS.forEach((level, i) => {
        const card = document.createElement('div');
        card.className = 'level-card';
        const busImgs = Array(i + 1).fill('<img src="bus.png" alt="bus" class="lc-bus-img">').join('');
        card.innerHTML = `
                    <div class="lc-name">${level.name}</div>
                    <div class="lc-buses">${busImgs}</div>`;
        card.onclick = () => startGame(i);
        container.appendChild(card);
    });
}

function resetToStart() {
    hideAllModals();
    gridEl.innerHTML = '';
    document.getElementById('timer').innerText = '--';
    document.getElementById('timer').classList.remove('warning');
    setHeaderInfo(null, null);
    buildLevelCards();
    document.getElementById('start-modal').classList.remove('hidden');
    // Re-trigger entrance animation
    const busImg = document.getElementById('start-bus-img');
    busImg.style.animation = 'none';
    busImg.offsetHeight; // force reflow
    busImg.style.animation = '';
}

// ─── GAME START ───────────────────────────────────────────────────────────────
function startGame(levelIndex) {
    currentLevel = LEVELS[levelIndex];
    currentStage = 0;
    hideAllModals();
    showCountdown(() => startStage());
}

function startStage() {
    criticalPopShown = false;
    totalBusesForStage = currentLevel.buses + currentStage * STAGE_BUS_INCREMENT;
    clearedCount = 0;
    activeBuses = totalBusesForStage;
    generateSolvablePuzzle(currentLevel.cols, currentLevel.rows, totalBusesForStage);
    renderGrid();
    setHeaderInfo(currentLevel.name, currentStage);
    isPlaying = true;
    startTime = Date.now();
    // Timer entrance: appears big then quickly settles to normal size
    const timerEl = document.getElementById('timer');
    timerEl.classList.remove('warning', 'timer-enter', 'timer-critical-pop');
    void timerEl.offsetWidth;
    timerEl.classList.add('timer-enter');
    setTimeout(() => timerEl.classList.remove('timer-enter'), 700);
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 50);
}

// ─── PUZZLE GENERATION ────────────────────────────────────────────────────────
function generateSolvablePuzzle(cols, rows, targetBuses) {
    grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
    activeBuses = 0;
    let attempts = 0;
    const maxAttempts = targetBuses * 20;

    while (activeBuses < targetBuses && attempts < maxAttempts) {
        attempts++;
        const x = Math.floor(Math.random() * cols);
        const y = Math.floor(Math.random() * rows);
        if (grid[y][x] !== null) continue;

        const validDirs = [];
        if (isPathClear(x, y, 0, -1, cols, rows)) validDirs.push('U');
        if (isPathClear(x, y, 0, 1, cols, rows)) validDirs.push('D');
        if (isPathClear(x, y, -1, 0, cols, rows)) validDirs.push('L');
        if (isPathClear(x, y, 1, 0, cols, rows)) validDirs.push('R');

        if (validDirs.length > 0) {
            const isBorder = (x === 0 || x === cols - 1 || y === 0 || y === rows - 1);
            const insideDirs = validDirs.filter(d =>
                !((x === 0 && d === 'L') || (x === cols - 1 && d === 'R') ||
                    (y === 0 && d === 'U') || (y === rows - 1 && d === 'D')));

            const pool = (isBorder && insideDirs.length > 0 && Math.random() < 0.8)
                ? insideDirs : validDirs;
            const chosenDir = pool[Math.floor(Math.random() * pool.length)];

            grid[y][x] = {
                dir: chosenDir,
                themeIndex: Math.floor(Math.random() * busThemes.length),
                busInstance: null
            };
            activeBuses++;
        }
    }
}

function isPathClear(x, y, dx, dy, cols, rows) {
    let cx = x + dx, cy = y + dy;
    while (cy >= 0 && cy < rows && cx >= 0 && cx < cols) {
        if (grid[cy][cx] !== null) return false;
        cx += dx;
        cy += dy;
    }
    return true;
}

// ─── RENDER ───────────────────────────────────────────────────────────────────
function renderGrid() {
    gridEl.innerHTML = '';
    const cols = currentLevel.cols;
    const rows = currentLevel.rows;
    gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const gameArea = document.getElementById('game-area');
    const padding = 16;
    const maxWidth = gameArea.clientWidth - padding;
    const maxHeight = gameArea.clientHeight - padding;
    const cellSize = Math.floor(Math.min(maxWidth / cols, maxHeight / rows));

    gridEl.style.width = `${cellSize * cols}px`;
    gridEl.style.height = `${cellSize * rows}px`;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            if (grid[y][x]) {
                const cellData = grid[y][x];
                const wrapper = document.createElement('div');
                wrapper.className = `bus-wrapper dir-${cellData.dir}`;

                const canvas = document.createElement('canvas');
                canvas.className = 'bus-canvas';
                const dpr = window.devicePixelRatio || 1;
                canvas.width = cellSize * dpr;
                canvas.height = cellSize * dpr;
                canvas.style.width = `${cellSize}px`;
                canvas.style.height = `${cellSize}px`;

                const bus = new CartoonBus(canvas, cellData.themeIndex);
                bus.draw();
                cellData.busInstance = bus;

                wrapper.appendChild(canvas);
                wrapper.onpointerdown = (e) => { e.preventDefault(); handleTap(x, y, wrapper, bus); };
                cell.appendChild(wrapper);
            }
            gridEl.appendChild(cell);
        }
    }
}

// ─── GAMEPLAY ─────────────────────────────────────────────────────────────────
function handleTap(x, y, wrapper, bus) {
    if (!isPlaying) return;
    const cellData = grid[y][x];
    if (!cellData) return;
    const dir = cellData.dir;

    let dx = 0, dy = 0;
    if (dir === 'U') dy = -1;
    if (dir === 'D') dy = 1;
    if (dir === 'L') dx = -1;
    if (dir === 'R') dx = 1;

    if (isPathClear(x, y, dx, dy, currentLevel.cols, currentLevel.rows)) {
        grid[y][x] = null;
        activeBuses--;
        clearedCount++;
        playSound('correct');
        // Visual feedback: enlarge and vibrate on tap
        wrapper.classList.add('bus-tap');
        // Start engine after tap animation starts
        setTimeout(() => bus.startEngine(), 15);
        // Fly out after tap animation ends
        setTimeout(() => animateFlyOut(wrapper, dir, bus), 250);
        if (activeBuses === 0) handleStageWin();
    } else {
        playSound('incorrect');
        wrapper.classList.remove('shake');
        void wrapper.offsetWidth;
        wrapper.classList.add('shake');
    }
}

function animateFlyOut(wrapper, dir, bus) {
    const rect = wrapper.getBoundingClientRect();
    wrapper.style.position = 'fixed';
    wrapper.style.left = `${rect.left}px`;
    wrapper.style.top = `${rect.top}px`;
    wrapper.style.width = `${rect.width}px`;
    wrapper.style.height = `${rect.height}px`;
    document.body.appendChild(wrapper);
    wrapper.classList.add('flying');
    wrapper.classList.remove('bus-tap');
    requestAnimationFrame(() => {
        const dist = Math.max(window.innerWidth, window.innerHeight) * 1.5;
        if (dir === 'U') wrapper.style.top = `${rect.top - dist}px`;
        if (dir === 'D') wrapper.style.top = `${rect.top + dist}px`;
        if (dir === 'L') wrapper.style.left = `${rect.left - dist}px`;
        if (dir === 'R') wrapper.style.left = `${rect.left + dist}px`;
    });
    setTimeout(() => { bus.stopEngine(); if (wrapper.parentNode) wrapper.remove(); }, 600);
}

// ─── TIMER ────────────────────────────────────────────────────────────────────
function updateTimer() {
    if (!isPlaying) return;
    const elapsed = (Date.now() - startTime) / 1000;
    const timeLeft = Math.max(0, currentLevel.time - elapsed);
    const timerEl = document.getElementById('timer');
    timerEl.innerText = `${timeLeft.toFixed(1)}s`;
    if (timeLeft <= 5 && !timerEl.classList.contains('warning')) {
        timerEl.classList.add('warning');
        if (!criticalPopShown) {
            criticalPopShown = true;
            timerEl.classList.remove('timer-critical-pop');
            void timerEl.offsetWidth;
            timerEl.classList.add('timer-critical-pop');
            setTimeout(() => timerEl.classList.remove('timer-critical-pop'), 600);
        }
    }
    if (timeLeft <= 0) handleLose();
}

// ─── WIN / LOSE ───────────────────────────────────────────────────────────────
function handleStageWin() {
    isPlaying = false;
    clearInterval(timerInterval);
    currentRunTime = ((Date.now() - startTime) / 1000).toFixed(1);
    showResultModal(true, currentStage >= STAGES_PER_LEVEL - 1);
}

function handleLose() {
    isPlaying = false;
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '0.0s';
    showResultModal(false, false);
}

function showResultModal(isWin, isLastStage) {
    const cleared = clearedCount;
    const remaining = activeBuses;
    const total = totalBusesForStage;
    const pct = total > 0 ? Math.round((cleared / total) * 100) : 0;

    document.getElementById('result-title').innerText = isWin ? 'Stage Clear!' : "Time's Up!";
    document.getElementById('result-title').style.color = isWin ? 'var(--accent)' : 'var(--error-color)';

    // Reset animated values
    document.getElementById('stat-cleared').innerText = '0';
    document.getElementById('stat-remaining').innerText = '0';
    document.getElementById('stat-pct').innerText = '0%';
    document.getElementById('pct-arc').style.strokeDashoffset = '197.9';

    // Build action buttons
    const btnBox = document.getElementById('result-buttons');
    const nameRow = document.getElementById('result-name-row');
    btnBox.innerHTML = '';
    nameRow.classList.add('hidden');

    if (isWin && !isLastStage) {
        addBtn(btnBox, 'NEXT STAGE', 'primary', () => { hideAllModals(); currentStage++; startStage(); });
    }
    if (isWin && isLastStage) {
        nameRow.classList.remove('hidden');
        document.getElementById('player-name').value = '';
        addBtn(btnBox, 'SUBMIT SCORE', 'primary', submitScore);
    }
    if (!isWin) {
        addBtn(btnBox, 'RETRY STAGE', 'primary', () => { hideAllModals(); startStage(); });
    }
    addBtn(btnBox, 'MAIN MENU', '', resetToStart);

    document.getElementById('result-modal').classList.remove('hidden');

    // Animate counters after short delay
    setTimeout(() => {
        animateCounter(document.getElementById('stat-cleared'), 0, cleared, 800);
        animateCounter(document.getElementById('stat-remaining'), 0, remaining, 800);
        animateCounter(document.getElementById('stat-pct'), 0, pct, 900, '%');
        animatePctRing(pct);
    }, 200);
}

function addBtn(container, label, cls, fn) {
    const btn = document.createElement('button');
    btn.innerText = label;
    if (cls) btn.classList.add(cls);
    btn.onclick = fn;
    container.appendChild(btn);
}

// ─── ANIMATED COUNTERS ────────────────────────────────────────────────────────
function animateCounter(el, from, to, duration, suffix = '') {
    const startTs = performance.now();
    (function tick(now) {
        const t = Math.min(1, (now - startTs) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        el.innerText = Math.round(from + (to - from) * ease) + suffix;
        if (t < 1) requestAnimationFrame(tick);
    })(performance.now());
}

function animatePctRing(pct) {
    const circumference = 197.9;
    const offset = circumference - (pct / 100) * circumference;
    setTimeout(() => { document.getElementById('pct-arc').style.strokeDashoffset = offset; }, 50);
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────
function getLeaderboard(levelId) {
    const stored = localStorage.getItem(`busEscapeLB_${levelId}`);
    return stored ? JSON.parse(stored) : [...DEFAULT_LEADERBOARD];
}

function submitScore() {
    let name = document.getElementById('player-name').value.trim();
    if (!name) name = 'Anonymous';

    let lb = getLeaderboard(currentLevel.id);
    lb.push({ name, time: parseFloat(currentRunTime), isPlayer: true });
    lb.sort((a, b) => a.time - b.time);
    lb = lb.slice(0, LEADERBOARD_SIZE);
    localStorage.setItem(`busEscapeLB_${currentLevel.id}`,
        JSON.stringify(lb.map(e => ({ name: e.name, time: e.time }))));

    hideAllModals();
    renderLeaderboard(lb, currentLevel.name);
    buildLbTabs(currentLevel.id);
    document.getElementById('leaderboard-modal').classList.remove('hidden');
}

function showLeaderboardModal() {
    hideAllModals();
    const lvl = currentLevel || LEVELS[0];
    renderLeaderboard(getLeaderboard(lvl.id), lvl.name);
    buildLbTabs(lvl.id);
    document.getElementById('leaderboard-modal').classList.remove('hidden');
}

function buildLbTabs(activeLevelId) {
    const tabsEl = document.getElementById('lb-tabs');
    tabsEl.innerHTML = '';
    LEVELS.forEach(lvl => {
        const btn = document.createElement('button');
        btn.innerText = lvl.name;
        if (lvl.id === activeLevelId) btn.classList.add('active');
        btn.onclick = () => {
            renderLeaderboard(getLeaderboard(lvl.id), lvl.name);
            buildLbTabs(lvl.id);
        };
        tabsEl.appendChild(btn);
    });
}

function renderLeaderboard(data, levelName) {
    document.getElementById('lb-level-name').innerText = levelName || '';
    const lbBody = document.getElementById('leaderboard-body');
    lbBody.innerHTML = '';
    data.forEach((entry, index) => {
        const tr = document.createElement('tr');
        if (entry.isPlayer) tr.classList.add('highlight');
        tr.innerHTML = `<td>#${index + 1}</td><td>${escapeHTML(entry.name)}</td><td class="time-col">${entry.time.toFixed(1)}</td>`;
        lbBody.appendChild(tr);
    });
}

// ─── RESIZE ───────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
    if (isPlaying || gridEl.innerHTML !== '') renderGrid();
});

// ─── BOOT ─────────────────────────────────────────────────────────────────────
// Initialize sound toggle state
const soundToggle = document.getElementById('sound-toggle');
if (soundEnabled) {
    soundToggle.classList.remove('muted');
    soundToggle.textContent = '🔊';
} else {
    soundToggle.classList.add('muted');
    soundToggle.textContent = '🔇';
}

// Start the app
buildLevelCards();