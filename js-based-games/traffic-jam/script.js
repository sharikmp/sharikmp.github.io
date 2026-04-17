
// ─── GAME CONFIGURATION ──────────────────────────────────────────────────────
const STAGES_PER_LEVEL = 3;
const STAGE_BUS_INCREMENT = 5;
const LEADERBOARD_SIZE = 10;

// --- SOUND ---
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
const beepBeepAudio = document.getElementById('beep-beep-audio');
const incorrectAudio = document.getElementById('incorrect-audio');

// ── GAME RULES ───────────────────────────────────────────────────────────────
// 1. The grid is filled with buses. Each bus faces one direction: U / D / L / R.
// 2. A bus can escape when every active cell along its path to the grid edge is empty.
// 3. The player taps an escapable bus to clear it from the grid.
// 4. EXACTLY 1 bus is escapable at any point in time (guaranteed by pre-computation).
// 5. Win by clearing all buses before the timer reaches zero.
// 6. Difficulty scales via: more buses on screen, denser grid shapes, and less time.
// 7. A 2-second idle hint glows the one escapable bus when the player is inactive.
// ─────────────────────────────────────────────────────────────────────────────

const LEVELS = [
    { id: 'easy',   name: 'Easy',   time: 60, cols: 15, rows: 15, buses: 100  },
    { id: 'medium', name: 'Medium', time: 60, cols: 15, rows: 15, buses: 120 },
    { id: 'hard',   name: 'Hard',   time: 60, cols: 15, rows: 15, buses: 150 },
    { id: 'pro',    name: 'Pro',    time: 60, cols: 15, rows: 15, buses: 200 },
];

// --- SHAPE LIBRARY ---
// Each entry: { id, name, tags, minCells, buildMask(cols, rows) → boolean[][] }
// Tags: 'shape' | 'letter' | 'digit'
const SHAPE_LIBRARY = (() => {
    // ── Helpers ──────────────────────────────────────────────────────────────
    function emptyMask(cols, rows) {
        return Array.from({ length: rows }, () => new Array(cols).fill(false));
    }

    // Point-in-convex-polygon test (vertices as [x,y] in 0..1 space)
    function polyMask(verts, cols, rows) {
        const mask = emptyMask(cols, rows);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const px = (c + 0.5) / cols;
                const py = (r + 0.5) / rows;
                let inside = false;
                const n = verts.length;
                for (let i = 0, j = n - 1; i < n; j = i++) {
                    const [xi, yi] = verts[i], [xj, yj] = verts[j];
                    if (((yi > py) !== (yj > py)) &&
                        (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
                        inside = !inside;
                    }
                }
                if (inside) mask[r][c] = true;
            }
        }
        return mask;
    }

    // Pixel-font: scale a 5×7 bitmap (row-major, left-to-right) into cols×rows
    function letterMask(bitmap5x7, cols, rows) {
        const mask = emptyMask(cols, rows);
        const scale = Math.max(1, Math.min(3, Math.floor(cols / 5), Math.floor(rows / 7)));
        const bw = 5 * scale, bh = 7 * scale;
        const offC = Math.floor((cols - bw) / 2);
        const offR = Math.floor((rows - bh) / 2);
        for (let sr = 0; sr < 7; sr++) {
            for (let sc = 0; sc < 5; sc++) {
                if (!bitmap5x7[sr][sc]) continue;
                for (let dr = 0; dr < scale; dr++) {
                    for (let dc = 0; dc < scale; dc++) {
                        const rr = offR + sr * scale + dr;
                        const cc = offC + sc * scale + dc;
                        if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) mask[rr][cc] = true;
                    }
                }
            }
        }
        return mask;
    }

    function countCells(mask) { return mask.flat().filter(Boolean).length; }

    // ── 5×7 Pixel bitmaps (row 0 = top) ─────────────────────────────────────
    const GLYPHS = {
        A: [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
        B: [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],
        C: [[0,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[0,1,1,1,1]],
        D: [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],
        E: [[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
        F: [[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0]],
        G: [[0,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,1]],
        H: [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
        I: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1]],
        J: [[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
        K: [[1,0,0,0,1],[1,0,0,1,0],[1,0,1,0,0],[1,1,0,0,0],[1,0,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],
        L: [[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
        M: [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
        N: [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
        O: [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
        P: [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0]],
        Q: [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,1,0],[0,1,1,0,1]],
        R: [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],
        S: [[0,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[0,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[1,1,1,1,0]],
        T: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
        U: [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
        V: [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,1,0,1,0],[0,0,1,0,0]],
        W: [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,1,0,1],[1,1,0,1,1],[1,0,0,0,1]],
        X: [[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1],[1,0,0,0,1]],
        Y: [[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
        Z: [[1,1,1,1,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
        0: [[0,1,1,1,0],[1,0,0,1,1],[1,0,1,0,1],[1,0,1,0,1],[1,1,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
        1: [[0,0,1,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,1,1,0]],
        2: [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,1,1,1,1]],
        3: [[1,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[0,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[1,1,1,1,0]],
        4: [[0,0,0,1,0],[0,0,1,1,0],[0,1,0,1,0],[1,0,0,1,0],[1,1,1,1,1],[0,0,0,1,0],[0,0,0,1,0]],
        5: [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1],[1,1,1,1,0]],
        6: [[0,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
        7: [[1,1,1,1,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
        8: [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
        9: [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[0,1,1,1,0]],
    };

    // ── Build entries ─────────────────────────────────────────────────────────
    const entries = [];

    // Letters A–Z
    for (const ch of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        entries.push({
            id: `letter_${ch}`, name: ch, tags: ['letter'],
            buildMask: (c, r) => letterMask(GLYPHS[ch], c, r),
        });
    }
    // Digits 0–9
    for (const d of '0123456789') {
        entries.push({
            id: `digit_${d}`, name: d, tags: ['digit'],
            buildMask: (c, r) => letterMask(GLYPHS[d], c, r),
        });
    }

    // ── Geometric shapes ─────────────────────────────────────────────────────

    // Heart
    entries.push({ id: 'heart', name: '❤', tags: ['shape'], buildMask(cols, rows) {
        const mask = emptyMask(cols, rows);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Normalise to [-1.3, 1.3] x [-1.0, 1.5]
                const x = (c + 0.5) / cols * 2.6 - 1.3;
                const y = (r + 0.5) / rows * 2.5 - 1.0;
                // Heart curve: (x²+y²-1)³ - x²y³ ≤ 0
                const v = x*x + y*y - 1;
                if (v*v*v - x*x*y*y*y <= 0) mask[r][c] = true;
            }
        }
        return mask;
    }});

    // Triangle (equilateral, pointing up)
    entries.push({ id: 'triangle', name: '▲', tags: ['shape'], buildMask(cols, rows) {
        const margin = 0.1;
        const verts = [
            [0.5, margin],
            [1 - margin, 1 - margin],
            [margin, 1 - margin],
        ];
        return polyMask(verts, cols, rows);
    }});

    // Diamond
    entries.push({ id: 'diamond', name: '◆', tags: ['shape'], buildMask(cols, rows) {
        const mask = emptyMask(cols, rows);
        const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
        const rx = cols / 2 - 0.5, ry = rows / 2 - 0.5;
        for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
                if (Math.abs(c - cx) / rx + Math.abs(r - cy) / ry <= 1) mask[r][c] = true;
        return mask;
    }});

    // 5-pointed Star
    entries.push({ id: 'star', name: '★', tags: ['shape'], buildMask(cols, rows) {
        const verts = [];
        const outerR = 0.46, innerR = 0.19;
        const cx = 0.5, cy = 0.5;
        for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI / 5) - Math.PI / 2;
            const r = i % 2 === 0 ? outerR : innerR;
            verts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
        }
        return polyMask(verts, cols, rows);
    }});

    // Cross / Plus
    entries.push({ id: 'cross', name: '✚', tags: ['shape'], buildMask(cols, rows) {
        const mask = emptyMask(cols, rows);
        const armW = Math.max(2, Math.floor(Math.min(cols, rows) * 0.28));
        const cC = Math.floor(cols / 2), cR = Math.floor(rows / 2);
        for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
                if (Math.abs(c - cC) <= armW || Math.abs(r - cR) <= armW) mask[r][c] = true;
        return mask;
    }});

    // Arrow (pointing right)
    entries.push({ id: 'arrow', name: '➡', tags: ['shape'], buildMask(cols, rows) {
        const verts = [
            [0.1, 0.35],[0.55, 0.35],[0.55, 0.1],[0.95, 0.5],
            [0.55, 0.9],[0.55, 0.65],[0.1, 0.65],
        ];
        return polyMask(verts, cols, rows);
    }});

    // Pentagon
    entries.push({ id: 'pentagon', name: '⬠', tags: ['shape'], buildMask(cols, rows) {
        const verts = [];
        for (let i = 0; i < 5; i++) {
            const a = (i * 2 * Math.PI / 5) - Math.PI / 2;
            verts.push([0.5 + 0.45 * Math.cos(a), 0.5 + 0.45 * Math.sin(a)]);
        }
        return polyMask(verts, cols, rows);
    }});

    // Hexagon
    entries.push({ id: 'hexagon', name: '⬡', tags: ['shape'], buildMask(cols, rows) {
        const verts = [];
        for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI / 3) - Math.PI / 6;
            verts.push([0.5 + 0.46 * Math.cos(a), 0.5 + 0.46 * Math.sin(a)]);
        }
        return polyMask(verts, cols, rows);
    }});

    // Circle
    entries.push({ id: 'circle', name: '●', tags: ['shape'], buildMask(cols, rows) {
        const mask = emptyMask(cols, rows);
        const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
        const r = Math.min(cols, rows) / 2 - 0.5;
        for (let row = 0; row < rows; row++)
            for (let col = 0; col < cols; col++)
                if ((col - cx) ** 2 + (row - cy) ** 2 <= r * r) mask[row][col] = true;
        return mask;
    }});

    // Ring (donut)
    entries.push({ id: 'ring', name: '◯', tags: ['shape'], buildMask(cols, rows) {
        const mask = emptyMask(cols, rows);
        const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
        const rOuter = Math.min(cols, rows) / 2 - 0.5;
        const rInner = rOuter * 0.52;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const d2 = (col - cx) ** 2 + (row - cy) ** 2;
                if (d2 <= rOuter * rOuter && d2 >= rInner * rInner) mask[row][col] = true;
            }
        }
        return mask;
    }});

    // Crescent (Moon)
    entries.push({ id: 'moon', name: '🌙', tags: ['shape'], buildMask(cols, rows) {
        const mask = emptyMask(cols, rows);
        const cx = (cols - 1) / 2 - cols * 0.05;
        const cy = (rows - 1) / 2;
        const rOuter = Math.min(cols, rows) / 2 - 0.5;
        const cx2 = cx + rOuter * 0.42, cy2 = cy - rOuter * 0.08;
        const rInner = rOuter * 0.78;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const inOuter = (col - cx) ** 2 + (row - cy) ** 2 <= rOuter * rOuter;
                const inInner = (col - cx2) ** 2 + (row - cy2) ** 2 <= rInner * rInner;
                if (inOuter && !inInner) mask[row][col] = true;
            }
        }
        return mask;
    }});

    // Lightning bolt (zigzag slash)
    entries.push({ id: 'lightning', name: '⚡', tags: ['shape'], buildMask(cols, rows) {
        const verts = [
            [0.55, 0.05],[0.25, 0.50],[0.50, 0.45],
            [0.45, 0.95],[0.75, 0.50],[0.50, 0.55],
        ];
        return polyMask(verts, cols, rows);
    }});

    return entries;
})();

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
let shapeGrid = [];          // boolean[][] — active cell mask for current stage
let currentShapeName = '';  // name of the active shape (e.g. "A", "❤")

// ─── HINT / NO-ESCAPE STATE ──────────────────────────────────────────────────
const IDLE_HINT_DELAY = 2000;          // ms of inactivity before showing hint
let idleHintTimer    = null;           // setTimeout handle
let hintedWrapper    = null;           // DOM wrapper currently glowing as hint
let hintedBusObj     = null;           // CartoonBus of the hinted bus
let timerFrozen      = false;          // true while no-escape rotation is playing
let frozenTimeLeft   = 0;             // remaining time saved when timer froze
let noEscapeOverlayActive = false;     // true while no-escape overlay is showing

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

        // Step 2: engine starts after pop settles — visible rev-up before moving
        setTimeout(() => {
            bus.isEngineOn = true;
            bus.speed = 0.35;
            bus.loop();
        }, 350);

        // Step 3: fly off right + fade label (after engine has been visibly running)
        setTimeout(() => {
            busWrap.classList.remove('countdown-bus-tap');
            busWrap.classList.add('countdown-bus-fly');
            startLbl.classList.add('label-fade-out');
        }, 950);

        // Step 4: switch to countdown numbers
        setTimeout(() => {
            bus.stopEngine();
            intro.classList.add('hidden');
            numEl.classList.remove('hidden');
            startNumbers();
        }, 1750);
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

// ─── SHAPE SELECTION ──────────────────────────────────────────────────────────

// Returns a pool of shapes appropriate for the given mode at the given grid size.
// Easy  → fewer active cells (below-median density) — simpler / less cluttered
// Medium → mid-range density
// Hard   → higher density shapes
// Pro    → densest shapes only
function getShapesForMode(modeId, cols, rows) {
    // Pre-compute active cell counts for every shape at this grid size
    const withCounts = SHAPE_LIBRARY.map(s => ({
        shape: s,
        cells: s.buildMask(cols, rows).flat().filter(Boolean).length,
    }));
    // Sort ascending by cell count
    withCounts.sort((a, b) => a.cells - b.cells);
    const total = withCounts.length;

    let pool;
    switch (modeId) {
        case 'easy':
            // Bottom third of density — shapes with fewer active cells
            pool = withCounts.slice(0, Math.ceil(total * 0.35)).map(e => e.shape);
            break;
        case 'medium':
            // Middle third
            pool = withCounts.slice(Math.floor(total * 0.30), Math.ceil(total * 0.70)).map(e => e.shape);
            break;
        case 'hard':
            // Upper half
            pool = withCounts.slice(Math.floor(total * 0.50)).map(e => e.shape);
            break;
        case 'pro':
            // Top quarter — densest shapes only
            pool = withCounts.slice(Math.floor(total * 0.75)).map(e => e.shape);
            break;
        default:
            pool = SHAPE_LIBRARY;
    }

    // Fallback: ensure pool is never empty
    return pool.length > 0 ? pool : SHAPE_LIBRARY;
}

function selectShapeForStage(cols, rows) {
    const modeId = currentLevel ? currentLevel.id : 'easy';
    const pool = getShapesForMode(modeId, cols, rows);
    const shape = pool[Math.floor(Math.random() * pool.length)];
    shapeGrid = shape.buildMask(cols, rows);
    currentShapeName = shape.name;
    return shapeGrid.flat().filter(Boolean).length; // return active cell count
}

function startStage() {
    criticalPopShown = false;
    // Reset hint / freeze state from any previous stage
    stopHintSystem();
    // Dismiss no-escape overlay immediately if it was open
    const _ov = document.getElementById('no-escape-overlay');
    if (_ov) { _ov.classList.add('hidden'); _ov.classList.remove('noe-enter','noe-exit'); }
    timerFrozen = false;
    // Compute initial bus target for this stage
    const baseBuses = currentLevel.buses + currentStage * STAGE_BUS_INCREMENT;
    // Select a shape and cap buses to 82% of its active cell count
    const activeCellCount = selectShapeForStage(currentLevel.cols, currentLevel.rows);
    const effectiveBuses = Math.min(baseBuses, Math.floor(activeCellCount * 0.82));
    totalBusesForStage = effectiveBuses;
    clearedCount = 0;
    activeBuses = effectiveBuses;
    generateSolvablePuzzle(currentLevel.cols, currentLevel.rows, effectiveBuses);
    // totalBusesForStage & activeBuses may be higher now if chain pass added blockers
    renderGrid();
    setHeaderInfo(currentLevel.name, currentStage);
    isPlaying = true;
    startTime = Date.now();
    // Timer entrance: appears big then quickly settles to normal size
    const timerEl = document.getElementById('timer');
    timerEl.classList.remove('warning', 'timer-enter', 'timer-critical-pop', 'timer-frozen');
    void timerEl.offsetWidth;
    timerEl.classList.add('timer-enter');
    setTimeout(() => timerEl.classList.remove('timer-enter'), 700);
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 50);
    // Start the idle hint timer right away
    resetIdleHint();
}


// ─── PUZZLE GENERATION ────────────────────────────────────────────────────────
function generateSolvablePuzzle(cols, rows, targetBuses) {
    grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
    activeBuses = 0;
    let attempts = 0;
    const maxAttempts = targetBuses * 20;

    // Collect active cells from the shape mask to pick placement positions
    const activeCells = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (shapeGrid[r][c]) activeCells.push({ x: c, y: r });

    // Fisher-Yates shuffle for the active cell pool
    for (let i = activeCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [activeCells[i], activeCells[j]] = [activeCells[j], activeCells[i]];
    }

    while (activeBuses < targetBuses && attempts < maxAttempts) {
        attempts++;
        // Pick from the shape-masked active cells only
        const pick = activeCells[Math.floor(Math.random() * activeCells.length)];
        const { x, y } = pick;
        if (grid[y][x] !== null) continue;

        const validDirs = [];
        if (isPathClear(x, y, 0, -1, cols, rows)) validDirs.push('U');
        if (isPathClear(x, y, 0, 1, cols, rows)) validDirs.push('D');
        if (isPathClear(x, y, -1, 0, cols, rows)) validDirs.push('L');
        if (isPathClear(x, y, 1, 0, cols, rows)) validDirs.push('R');

        if (validDirs.length > 0) {
            // Prefer directions that escape the shape (toward an inactive or edge cell)
            const isShapeBorder = isOnShapeBorder(x, y, cols, rows);
            const escapePool = isShapeBorder ? validDirs.filter(d => leadsToExit(x, y, d)) : [];
            const pool = (escapePool.length > 0 && Math.random() < 0.8) ? escapePool : validDirs;
            const chosenDir = pool[Math.floor(Math.random() * pool.length)];

            grid[y][x] = {
                dir: chosenDir,
                themeIndex: Math.floor(Math.random() * busThemes.length),
                busInstance: null
            };
            activeBuses++;
        }
    }

    // Pre-compute a valid solve sequence guaranteeing exactly 1 escapable bus at all times
    precomputeValidGrid(cols, rows);
}

// ─── PRE-COMPUTATION ─────────────────────────────────────────────────────────
// Simulates the entire game on a grid clone, enforcing EXACTLY 1 escapable bus
// per step. All direction changes are tracked in dirAdjustments and written back
// to the live grid at the end — including buses that escaped early in simulation
// (fixes the bug where early-escapers kept their original free direction).
function precomputeValidGrid(cols, rows) {
    const DIRS = ['U', 'D', 'L', 'R'];
    const MAX_ITERS = 800;

    // Clone grid for simulation
    const simGrid = grid.map(row =>
        row.map(cell => cell ? { dir: cell.dir, themeIndex: cell.themeIndex, busInstance: null } : null)
    );

    // Every direction change is recorded here so early-escaped buses are also
    // updated when results are written back to the live grid.
    const dirAdjustments = new Map();

    function setDir(x, y, dir) {
        simGrid[y][x].dir = dir;
        dirAdjustments.set(`${x},${y}`, dir);
    }

    function pathClear(x, y, dx, dy) {
        let cx = x + dx, cy = y + dy;
        while (cy >= 0 && cy < rows && cx >= 0 && cx < cols) {
            if (!shapeGrid[cy][cx]) { cx += dx; cy += dy; continue; }
            if (simGrid[cy][cx] !== null) return false;
            cx += dx; cy += dy;
        }
        return true;
    }

    function getEscapable() {
        const free = [];
        for (let y = 0; y < rows; y++)
            for (let x = 0; x < cols; x++) {
                if (!simGrid[y][x]) continue;
                const { dx, dy } = dirVec(simGrid[y][x].dir);
                if (pathClear(x, y, dx, dy)) free.push({ x, y });
            }
        return free;
    }

    // Point bus at (bx, by) into an existing bus so it is no longer escapable.
    // Includes deadlock guard to prevent A↔B cycles.
    function rotateToBlocked(bx, by) {
        for (const d of shuffle([...DIRS])) {
            const { dx, dy } = dirVec(d);
            if (pathClear(bx, by, dx, dy)) continue; // still free — skip
            // Find the first bus blocking in direction d
            let cx = bx + dx, cy = by + dy, fx = -1, fy = -1;
            while (cx >= 0 && cy >= 0 && cx < cols && cy < rows) {
                if (!shapeGrid[cy][cx]) { cx += dx; cy += dy; continue; }
                if (simGrid[cy][cx]) { fx = cx; fy = cy; break; }
                cx += dx; cy += dy;
            }
            if (fx === -1) continue; // no blocker bus — path hits edge
            // Deadlock guard: skip if that bus points straight back at us
            const { dx: odx, dy: ody } = dirVec(simGrid[fy][fx].dir);
            let rx = fx + odx, ry = fy + ody, cycle = false;
            while (rx >= 0 && ry >= 0 && rx < cols && ry < rows) {
                if (!shapeGrid[ry][rx]) { rx += odx; ry += ody; continue; }
                if (rx === bx && ry === by) { cycle = true; break; }
                if (simGrid[ry][rx]) break;
                rx += odx; ry += ody;
            }
            if (!cycle) { setDir(bx, by, d); return true; }
        }
        return false;
    }

    // Point bus at (bx, by) toward any clear escape path.
    function rotateToFree(bx, by) {
        for (const d of shuffle([...DIRS])) {
            const { dx, dy } = dirVec(d);
            if (pathClear(bx, by, dx, dy)) { setDir(bx, by, d); return true; }
        }
        return false;
    }

    // ── Main simulation loop ─────────────────────────────────────────────────
    for (let iter = 0; iter < MAX_ITERS; iter++) {
        let remaining = 0;
        for (let y = 0; y < rows; y++)
            for (let x = 0; x < cols; x++)
                if (simGrid[y][x]) remaining++;
        if (remaining === 0) break;

        let escapable = getEscapable();

        // Guarantee at least 1 escape: try outer (border) buses first, then any bus
        if (escapable.length === 0) {
            const candidates = [];
            for (let y = 0; y < rows; y++)
                for (let x = 0; x < cols; x++)
                    if (simGrid[y][x])
                        candidates.push({ x, y, outer: isOnShapeBorder(x, y, cols, rows) });
            candidates.sort((a, b) => (b.outer ? 1 : 0) - (a.outer ? 1 : 0));
            let unlocked = false;
            for (const b of candidates) {
                if (rotateToFree(b.x, b.y)) { unlocked = true; break; }
            }
            if (!unlocked) break; // truly stuck — stop gracefully
            escapable = getEscapable();
        }

        // Cap to exactly 1: rotate all excess escapable buses to blocked directions
        let capAttempts = 0;
        while (escapable.length > 1 && capAttempts++ < 30) {
            const toBlock = shuffle([...escapable]).slice(1); // keep index 0 free, block rest
            for (const b of toBlock) rotateToBlocked(b.x, b.y);
            escapable = getEscapable();
        }

        if (escapable.length === 0) continue; // safety — shouldn't happen

        // Remove one bus from simulation (simulate the player escaping it)
        const pick = escapable[0];
        simGrid[pick.y][pick.x] = null;
    }

    // ── Write all recorded direction changes back to the live grid ───────────
    // Using dirAdjustments (not simGrid) ensures buses that escaped mid-simulation
    // also get their adjusted directions applied to the live grid.
    for (const [key, dir] of dirAdjustments) {
        const [x, y] = key.split(',').map(Number);
        if (grid[y] && grid[y][x]) grid[y][x].dir = dir;
    }
}

// Returns true if (x,y) is on the border of the active shape (has at least one inactive neighbour or grid edge)
function isOnShapeBorder(x, y, cols, rows) {
    for (const [dx, dy] of [[0,-1],[0,1],[-1,0],[1,0]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return true;
        if (!shapeGrid[ny][nx]) return true;
    }
    return false;
}

// Returns true if the direction from (x,y) leads directly to an escape (inactive cell or edge)
function leadsToExit(x, y, dir) {
    const dx = dir === 'R' ? 1 : dir === 'L' ? -1 : 0;
    const dy = dir === 'D' ? 1 : dir === 'U' ? -1 : 0;
    const nx = x + dx, ny = y + dy;
    const cols = currentLevel.cols, rows = currentLevel.rows;
    if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return true;
    return !shapeGrid[ny][nx];
}

function isPathClear(x, y, dx, dy, cols, rows) {
    let cx = x + dx, cy = y + dy;
    while (cy >= 0 && cy < rows && cx >= 0 && cx < cols) {
        if (!shapeGrid[cy][cx]) { cx += dx; cy += dy; continue; } // inactive gap: passable
        if (grid[cy][cx] !== null) return false; // active cell with a bus: blocked
        cx += dx;
        cy += dy;
    }
    return true; // reached grid edge = open exit
}

// ─── BUS UTILITIES ───────────────────────────────────────────────────────────
function getAllFreeBuses() {
    const free = [];
    const cols = currentLevel.cols, rows = currentLevel.rows;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (!grid[y][x]) continue;
            const dir = grid[y][x].dir;
            const dx = dir === 'R' ? 1 : dir === 'L' ? -1 : 0;
            const dy = dir === 'D' ? 1 : dir === 'U' ? -1 : 0;
            if (isPathClear(x, y, dx, dy, cols, rows)) free.push({ x, y });
        }
    }
    return free;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function dirVec(dir) {
    return { dx: dir==='R'?1:dir==='L'?-1:0, dy: dir==='D'?1:dir==='U'?-1:0 };
}



// ─── RENDER ───────────────────────────────────────────────────────────────────
function renderGrid() {
    if (!currentLevel || shapeGrid.length === 0) return;
    gridEl.innerHTML = '';
    const cols = currentLevel.cols;
    const rows = currentLevel.rows;
    gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const gameArea = document.getElementById('game-area');
    const padding = 104; // matches 52px CSS padding on each side
    const maxWidth = gameArea.clientWidth - padding;
    const maxHeight = gameArea.clientHeight - padding;
    const cellSize = Math.floor(Math.min(maxWidth / cols, maxHeight / rows));

    gridEl.style.width = `${cellSize * cols}px`;
    gridEl.style.height = `${cellSize * rows}px`;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = document.createElement('div');

            if (!shapeGrid[y][x]) {
                // Inactive cell — not part of the current shape
                cell.className = 'cell cell-inactive';
            } else if (grid[y][x]) {
                cell.className = 'cell';
                const cellData = grid[y][x];
                const wrapper = document.createElement('div');
                wrapper.className = `bus-wrapper dir-${cellData.dir}`;
                wrapper.dataset.x = x;
                wrapper.dataset.y = y;

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
            } else {
                // Active but empty cell — show faint dot to reveal shape outline
                cell.className = 'cell cell-empty';
            }
            gridEl.appendChild(cell);
        }
    }
}

// Highlight free buses (Easy mode only)
function refreshFreeIndicators() {
    const cols = currentLevel.cols, rows = currentLevel.rows;
    const wrappers = gridEl.querySelectorAll('.bus-wrapper');
    wrappers.forEach(wrapper => {
        const x = parseInt(wrapper.dataset.x, 10);
        const y = parseInt(wrapper.dataset.y, 10);
        if (isNaN(x) || isNaN(y)) return;
        const cell = grid[y] && grid[y][x];
        if (!cell) { wrapper.classList.remove('bus-free'); return; }
        const { dx, dy } = dirVec(cell.dir);
        if (isPathClear(x, y, dx, dy, cols, rows)) {
            wrapper.classList.add('bus-free');
        } else {
            wrapper.classList.remove('bus-free');
        }
    });
}

// ─── HINT SYSTEM ─────────────────────────────────────────────────────────────

// Remove hint glow/vibrate from whatever bus is currently highlighted
function clearHint() {
    if (hintedWrapper) {
        hintedWrapper.classList.remove('bus-hint');
        if (hintedBusObj) { hintedBusObj.stopEngine(); }
        hintedWrapper = null;
        hintedBusObj  = null;
    }
}

// Show hint on a single free bus (glow + engine + vibrate)
function showHint() {
    clearHint();
    const free = getAllFreeBuses();
    if (free.length === 0) return;
    const pick = free[Math.floor(Math.random() * free.length)];
    const wrapper = gridEl.querySelector(`.bus-wrapper[data-x="${pick.x}"][data-y="${pick.y}"]`);
    if (!wrapper) return;
    const cellData = grid[pick.y][pick.x];
    if (!cellData || !cellData.busInstance) return;
    hintedWrapper = wrapper;
    hintedBusObj  = cellData.busInstance;
    wrapper.classList.add('bus-hint');
    cellData.busInstance.startEngine();
}

// Reset the 5-second idle hint timer (call on every tap attempt)
function resetIdleHint() {
    clearTimeout(idleHintTimer);
    idleHintTimer = null;
    if (!isPlaying || timerFrozen) return;
    idleHintTimer = setTimeout(() => {
        if (isPlaying && !timerFrozen) showHint();
    }, IDLE_HINT_DELAY);
}

// Stop and clean up all hint-related state (call on stage end / start)
function stopHintSystem() {
    clearTimeout(idleHintTimer);
    idleHintTimer = null;
    clearHint();
}

// ─── NO-ESCAPE HANDLER ───────────────────────────────────────────────────────

// Show the full-screen overlay and return a promise that resolves after `ms`
function showNoEscapeOverlay(ms) {
    return new Promise(resolve => {
        const el = document.getElementById('no-escape-overlay');
        if (!el) { setTimeout(resolve, ms); return; }
        el.classList.remove('hidden', 'noe-exit');
        // Force reflow then add enter class to trigger transition
        void el.offsetWidth;
        el.classList.add('noe-enter');
        setTimeout(resolve, ms);
    });
}

function hideNoEscapeOverlay() {
    return new Promise(resolve => {
        const el = document.getElementById('no-escape-overlay');
        if (!el) { resolve(); return; }
        el.classList.remove('noe-enter');
        el.classList.add('noe-exit');
        setTimeout(() => {
            el.classList.add('hidden');
            el.classList.remove('noe-exit');
            resolve();
        }, 420);
    });
}

// Animate timer to "frozen" state (amber, bigger, pulsing)
function freezeTimer() {
    if (timerFrozen) return;
    timerFrozen = true;
    const elapsed = (Date.now() - startTime) / 1000;
    frozenTimeLeft = Math.max(0, currentLevel.time - elapsed);
    const timerEl = document.getElementById('timer');
    timerEl.innerText = `${frozenTimeLeft.toFixed(1)}s`;
    // Play freeze-in animation, then switch to hold pulse
    timerEl.classList.remove('timer-frozen', 'timer-frozen-hold', 'timer-resume');
    void timerEl.offsetWidth;
    timerEl.classList.add('timer-frozen');
    setTimeout(() => {
        if (!timerFrozen) return;
        timerEl.classList.remove('timer-frozen');
        timerEl.classList.add('timer-frozen-hold');
    }, 460);
}

// Animate timer resuming (green bounce back to normal)
function unfreezeTimer() {
    if (!timerFrozen) return;
    timerFrozen = false;
    // Adjust startTime so remaining time matches where we froze
    startTime = Date.now() - (currentLevel.time - frozenTimeLeft) * 1000;
    const timerEl = document.getElementById('timer');
    timerEl.classList.remove('timer-frozen', 'timer-frozen-hold');
    void timerEl.offsetWidth;
    timerEl.classList.add('timer-resume');
    setTimeout(() => timerEl.classList.remove('timer-resume'), 600);
}

// Rotate outer buses (data only) and animate them.
// `delay` = ms to wait before starting animations (overlay already visible by then).
// Returns a promise that resolves when all animations complete.
function rotateOuterBusesUntilFree(delay) {
    return new Promise(resolve => {
        const cols = currentLevel.cols, rows = currentLevel.rows;

        // Collect outer buses (shape-border)
        const outerBuses = [];
        for (let y = 0; y < rows; y++)
            for (let x = 0; x < cols; x++)
                if (grid[y][x] && isOnShapeBorder(x, y, cols, rows))
                    outerBuses.push({ x, y });

        const DIRS = ['U', 'D', 'L', 'R'];
        const rotated = [];
        let attempts = 0;

        while (getAllFreeBuses().length === 0 && attempts < 40) {
            attempts++;
            const shuffled = shuffle([...outerBuses]);
            const toRotate = shuffled.slice(0, Math.min(3, shuffled.length));
            for (const bus of toRotate) {
                const clearDirs = DIRS.filter(d => {
                    const { dx, dy } = dirVec(d);
                    return isPathClear(bus.x, bus.y, dx, dy, cols, rows);
                });
                if (clearDirs.length > 0) {
                    grid[bus.y][bus.x].dir = clearDirs[Math.floor(Math.random() * clearDirs.length)];
                    if (!rotated.some(r => r.x === bus.x && r.y === bus.y)) rotated.push(bus);
                }
            }
        }

        if (rotated.length === 0) { setTimeout(resolve, delay); return; }

        // After `delay` ms, play the animation on each rotated bus
        setTimeout(() => {
            let pending = rotated.length;
            rotated.forEach(bus => {
                const wrapper = gridEl.querySelector(`.bus-wrapper[data-x="${bus.x}"][data-y="${bus.y}"]`);
                if (!wrapper) { if (--pending === 0) done(); return; }

                wrapper.classList.add('bus-rotate-reveal');
                setTimeout(() => {
                    wrapper.classList.remove('bus-rotate-reveal');
                    // Update direction class and redraw
                    wrapper.className = wrapper.className.replace(/\bdir-[UDLR]\b/, `dir-${grid[bus.y][bus.x].dir}`);
                    if (grid[bus.y][bus.x].busInstance) grid[bus.y][bus.x].busInstance.draw();
                    if (--pending === 0) done();
                }, 1050);
            });
        }, delay);

        function done() {
            resolve();
        }
    });
}

// Called after each successful bus escape
async function checkAndHintAfterEscape() {
    clearHint();
    if (!isPlaying) return;

    if (getAllFreeBuses().length > 0) {
        resetIdleHint();
        return;
    }

    // ── No free buses: begin the no-escape sequence ──────────────────────────
    stopHintSystem();

    // T=0: freeze timer + show overlay simultaneously
    freezeTimer();
    await showNoEscapeOverlay(500);  // overlay fades in over 0.35 s, hold for 0.5 s total

    // T=0.5s: buses rotate (animation plays over ~1.05 s); overlay stays visible
    await rotateOuterBusesUntilFree(0);  // zero delay — we're already in the right window

    // T≈1.6s: wait a beat so player can see the settled buses before overlay leaves
    await new Promise(r => setTimeout(r, 500));

    // T≈2.1s: hide overlay, unfreeze timer with bounce animation
    await hideNoEscapeOverlay();
    unfreezeTimer();

    // Now highlight the newly-freed bus and restart idle-hint timer
    showHint();
    resetIdleHint();
}

// ─── GAMEPLAY ─────────────────────────────────────────────────────────────────
function handleTap(x, y, wrapper, bus) {
    if (!isPlaying || timerFrozen) return;
    const cellData = grid[y][x];
    if (!cellData) return;
    const dir = cellData.dir;

    // Every tap attempt resets the idle hint timer
    resetIdleHint();

    let dx = 0, dy = 0;
    if (dir === 'U') dy = -1;
    if (dir === 'D') dy = 1;
    if (dir === 'L') dx = -1;
    if (dir === 'R') dx = 1;

    if (isPathClear(x, y, dx, dy, currentLevel.cols, currentLevel.rows)) {
        // If this was the hinted bus, clear the hint before flying it out
        if (hintedWrapper === wrapper) clearHint();
        else clearHint();

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
        if (activeBuses === 0) {
            handleStageWin();
        } else {
            // Check for free buses and hint / rotate as needed
            checkAndHintAfterEscape();
        }
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
    if (!isPlaying || timerFrozen) return;
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
function _dismissNoEscapeOverlay() {
    const ov = document.getElementById('no-escape-overlay');
    if (ov) { ov.classList.add('hidden'); ov.classList.remove('noe-enter', 'noe-exit'); }
}

function handleStageWin() {
    isPlaying = false;
    stopHintSystem();
    _dismissNoEscapeOverlay();
    timerFrozen = false;
    clearInterval(timerInterval);
    const timerEl = document.getElementById('timer');
    timerEl.classList.remove('timer-frozen', 'timer-frozen-hold', 'timer-resume');
    currentRunTime = ((Date.now() - startTime) / 1000).toFixed(1);
    showResultModal(true, currentStage >= STAGES_PER_LEVEL - 1);
}

function handleLose() {
    isPlaying = false;
    stopHintSystem();
    _dismissNoEscapeOverlay();
    timerFrozen = false;
    clearInterval(timerInterval);
    const timerEl = document.getElementById('timer');
    timerEl.classList.remove('timer-frozen', 'timer-frozen-hold', 'timer-resume');
    timerEl.innerText = '0.0s';
    showResultModal(false, false);
}

function showResultModal(isWin, isLastStage) {
    const cleared = clearedCount;
    const remaining = activeBuses;
    const total = totalBusesForStage;
    const pct = total > 0 ? Math.round((cleared / total) * 100) : 0;

    // Title & icon
    const titleEl = document.getElementById('result-title');
    const iconEl  = document.getElementById('result-icon');
    titleEl.innerText = isWin ? 'Stage Clear!' : "Time's Up!";
    titleEl.style.color = isWin ? 'var(--accent)' : 'var(--error-color)';
    iconEl.innerText = isWin ? '🏆' : '💥';

    // Card win/lose class
    const cardEl = document.getElementById('result-card');
    cardEl.classList.toggle('result-lose', !isWin);

    // Level label on card
    const levelLabelEl = document.getElementById('result-card-level');
    if (currentLevel) {
        levelLabelEl.innerText = `${currentLevel.name} · Stage ${currentStage + 1}/${STAGES_PER_LEVEL}`;
    }

    // Time row
    const timeRowEl   = document.getElementById('result-time-row');
    const timeLabelEl = document.getElementById('result-time-label');
    const timeValueEl = document.getElementById('result-time-value');
    if (isWin) {
        timeLabelEl.innerText = 'Time Taken';
        timeValueEl.innerText = `${currentRunTime}s`;
        timeRowEl.classList.remove('result-time-timeout');
        timeRowEl.classList.add('result-time-win');
    } else {
        timeLabelEl.innerText = 'Time Limit';
        timeValueEl.innerText = currentLevel ? `${currentLevel.time}s` : '--';
        timeRowEl.classList.remove('result-time-win');
        timeRowEl.classList.add('result-time-timeout');
    }

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

    // Share button
    addBtn(btnBox, '📤 SHARE RESULT', 'share-btn', () => shareResult(isWin, pct));

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

// ─── SHARE RESULT AS IMAGE ────────────────────────────────────────────────────
function shareResult(isWin, pct) {
    const card = document.getElementById('result-card');

    // Use html2canvas-like approach via built-in OffscreenCanvas + DOM snapshot isn't available
    // without a library, so we draw a nice card onto a <canvas> directly.
    const DPR   = Math.min(window.devicePixelRatio || 1, 3);
    const CW    = 420;
    const CH    = 320;
    const canvas = document.createElement('canvas');
    canvas.width  = CW * DPR;
    canvas.height = CH * DPR;
    const ctx = canvas.getContext('2d');
    ctx.scale(DPR, DPR);

    // --- Background ---
    const bg = ctx.createLinearGradient(0, 0, CW, CH);
    bg.addColorStop(0, '#0a0a14');
    bg.addColorStop(1, '#0c1428');
    ctx.fillStyle = bg;
    roundRectFill(ctx, 0, 0, CW, CH, 20);

    // Border glow
    ctx.save();
    ctx.strokeStyle = isWin ? 'rgba(56,189,248,0.55)' : 'rgba(239,68,68,0.55)';
    ctx.lineWidth = 2.5;
    roundRectStroke(ctx, 1.5, 1.5, CW - 3, CH - 3, 19);
    ctx.restore();

    // --- Top bar ---
    ctx.fillStyle = isWin ? 'rgba(56,189,248,0.08)' : 'rgba(239,68,68,0.08)';
    roundRectFill(ctx, 0, 0, CW, 54, { tl: 20, tr: 20, bl: 0, br: 0 });

    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillStyle = isWin ? '#38bdf8' : '#ef4444';
    ctx.textAlign = 'left';
    ctx.fillText('🚌 Bus Escape', 20, 33);

    if (currentLevel) {
        ctx.font = '13px "Courier New", monospace';
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'right';
        ctx.fillText(`${currentLevel.name} · Stage ${currentStage + 1}/${STAGES_PER_LEVEL}`, CW - 20, 33);
    }

    // --- Result title ---
    ctx.textAlign = 'center';
    const titleIcon = isWin ? '🏆' : '💥';
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.fillStyle = isWin ? '#38bdf8' : '#ef4444';
    ctx.shadowColor = isWin ? 'rgba(56,189,248,0.6)' : 'rgba(239,68,68,0.6)';
    ctx.shadowBlur = 18;
    ctx.fillText(`${titleIcon}  ${isWin ? 'Stage Clear!' : "Time's Up!"}`, CW / 2, 100);
    ctx.shadowBlur = 0;

    // --- Stats row ---
    const statY = 140;
    const cols = [
        { label: 'Cleared',   value: String(clearedCount) },
        { label: 'Remaining', value: String(activeBuses) },
        { label: '% Done',    value: `${pct}%` },
    ];
    const colW = CW / 3;
    cols.forEach((col, i) => {
        const cx = colW * i + colW / 2;
        // stat card bg
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        roundRectFill(ctx, colW * i + 12, statY - 28, colW - 24, 68, 12);

        ctx.font = 'bold 26px "Courier New", monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText(col.value, cx, statY + 10);

        ctx.font = '10px "Courier New", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(col.label.toUpperCase(), cx, statY + 28);
    });

    // --- Dividers between stats ---
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    [1, 2].forEach(i => {
        ctx.beginPath();
        ctx.moveTo(colW * i, statY - 20);
        ctx.lineTo(colW * i, statY + 36);
        ctx.stroke();
    });

    // --- Time row ---
    const timeY = 238;
    ctx.fillStyle = isWin ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)';
    roundRectFill(ctx, 20, timeY - 22, CW - 40, 44, 12);

    const timeIcon = '⏱';
    const timeLabel = isWin ? 'Time Taken' : 'Time Limit';
    const timeVal   = isWin
        ? `${currentRunTime}s`
        : (currentLevel ? `${currentLevel.time}s` : '--');

    ctx.font = '13px "Courier New", monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText(`${timeIcon}  ${timeLabel}`, 36, timeY + 4);

    ctx.font = 'bold 17px "Courier New", monospace';
    ctx.fillStyle = isWin ? '#4ade80' : '#ef4444';
    ctx.textAlign = 'right';
    ctx.fillText(timeVal, CW - 36, timeY + 4);

    // --- Footer branding ---
    ctx.font = '11px "Courier New", monospace';
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'center';
    ctx.fillText('sharikmp.github.io · Bus Escape', CW / 2, CH - 16);

    // --- Export ---
    canvas.toBlob(async (blob) => {
        const file = new File([blob], 'bus-escape-result.png', { type: 'image/png' });
        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

        if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: 'Bus Escape Result',
                    text: isWin
                        ? `🏆 Stage Clear! ${pct}% buses cleared in ${currentRunTime}s — Bus Escape`
                        : `💥 Time's Up! Cleared ${pct}% — Bus Escape`,
                    files: [file],
                });
                return;
            } catch (err) {
                if (err.name !== 'AbortError') console.warn('Share failed, falling back to download', err);
                else return; // user cancelled
            }
        }

        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bus-escape-result.png';
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    }, 'image/png');
}

function roundRectFill(ctx, x, y, w, h, r) {
    const radii = typeof r === 'number'
        ? { tl: r, tr: r, bl: r, br: r }
        : { tl: r.tl ?? 0, tr: r.tr ?? 0, bl: r.bl ?? 0, br: r.br ?? 0 };
    ctx.beginPath();
    ctx.moveTo(x + radii.tl, y);
    ctx.lineTo(x + w - radii.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radii.tr);
    ctx.lineTo(x + w, y + h - radii.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radii.br, y + h);
    ctx.lineTo(x + radii.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radii.bl);
    ctx.lineTo(x, y + radii.tl);
    ctx.quadraticCurveTo(x, y, x + radii.tl, y);
    ctx.closePath();
    ctx.fill();
}

function roundRectStroke(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.stroke();
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