// ─────────────────────────────────────────────────────────────────────────────
//  Sudoku — script.js
//  Neural Minds · sudoku/script.js
//  Backtracking generator with uniqueness guarantee, 4 difficulty levels.
//  Interaction: tap cell → number picker overlay.
//  Scoring: elapsed seconds + (mistakes × 30s penalty). Lower is better.
// ─────────────────────────────────────────────────────────────────────────────

// ── CONFIGURATION ─────────────────────────────────────────────────────────────
const LEADERBOARD_SIZE = 10;
const MISTAKE_PENALTY  = 30; // seconds added per mistake

const LEVELS = [
    { id: 'easy',   name: 'Easy',   clues: 46, label: '46 clues  ·  Relaxed'    },
    { id: 'medium', name: 'Medium', clues: 36, label: '36 clues  ·  Balanced'   },
    { id: 'hard',   name: 'Hard',   clues: 28, label: '28 clues  ·  Challenging' },
    { id: 'pro',    name: 'Pro',    clues: 22, label: '22 clues  ·  Expert'      },
];

// ── SESSION STATE ──────────────────────────────────────────────────────────────
let solution    = [];    // 9×9 complete solution
let board       = [];    // 9×9 current player state (0 = empty)
let givenMask   = [];    // 9×9 booleans: true = clue cell (immutable)
let wrongMask   = [];    // 9×9 booleans: true = wrong value placed

let selectedR   = -1;
let selectedC   = -1;
let mistakes    = 0;
let elapsedSecs = 0;
let timerInterval = null;
let gameActive  = false;
let currentLevel = null;
let gameStartTime = 0;

let soundEnabled = localStorage.getItem('sdkSoundEnabled') !== 'false';

// ── DOM REFS ───────────────────────────────────────────────────────────────────
const startModal       = document.getElementById('start-modal');
const gameArea         = document.getElementById('game-area');
const resultModal      = document.getElementById('result-modal');
const leaderboardModal = document.getElementById('leaderboard-modal');
const grid             = document.getElementById('sudoku-grid');
const numPicker        = document.getElementById('num-picker');
const headerLevelName  = document.getElementById('header-level-name');
const headerSep        = document.getElementById('header-sep');
const headerTimer      = document.getElementById('header-timer');
const headerSep2       = document.getElementById('header-sep2');
const headerMistakes   = document.getElementById('header-mistakes');

// ── SOUND ──────────────────────────────────────────────────────────────────────
const correctAudio   = document.getElementById('correct-audio');
const incorrectAudio = document.getElementById('incorrect-audio');

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('sdkSoundEnabled', soundEnabled);
    const btn = document.getElementById('sound-toggle');
    btn.textContent = soundEnabled ? '🔊' : '🔇';
    btn.classList.toggle('muted', !soundEnabled);
}

function playSound(type) {
    if (!soundEnabled) return;
    try {
        const a = type === 'correct' ? correctAudio : incorrectAudio;
        a.currentTime = 0;
        a.play().catch(() => {});
    } catch (_) {}
}

// ── PUZZLE GENERATOR ───────────────────────────────────────────────────────────

function makeEmpty9x9() {
    return Array.from({ length: 9 }, () => new Array(9).fill(0));
}

function cloneGrid(g) {
    return g.map(row => [...row]);
}

/* Fill the three diagonal 3×3 boxes (they're independent of each other) */
function fillDiagonalBoxes(g) {
    for (let box = 0; box < 3; box++) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        let idx = 0;
        const r0 = box * 3, c0 = box * 3;
        for (let r = r0; r < r0 + 3; r++) {
            for (let c = c0; c < c0 + 3; c++) {
                g[r][c] = nums[idx++];
            }
        }
    }
}

function isValidPlacement(g, r, c, n) {
    for (let i = 0; i < 9; i++) {
        if (g[r][i] === n) return false;
        if (g[i][c] === n) return false;
    }
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let dr = 0; dr < 3; dr++) {
        for (let dc = 0; dc < 3; dc++) {
            if (g[br + dr][bc + dc] === n) return false;
        }
    }
    return true;
}

/* Backtracking solver. If findAll=true counts up to `limit` solutions. */
function solve(g, findAll = false, limit = 2) {
    let count = 0;

    function backtrack() {
        // Find first empty cell
        let r = -1, c = -1;
        outer: for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (g[i][j] === 0) { r = i; c = j; break outer; }
            }
        }
        if (r === -1) { // no empty cell — complete
            count++;
            return;
        }
        const candidates = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const n of candidates) {
            if (isValidPlacement(g, r, c, n)) {
                g[r][c] = n;
                backtrack();
                if (!findAll && count > 0) return; // first solution found
                if (findAll && count >= limit) return;
                g[r][c] = 0;
            }
        }
    }

    backtrack();
    return count;
}

function generateFull() {
    const g = makeEmpty9x9();
    fillDiagonalBoxes(g);
    solve(g); // fills remaining cells
    return g;
}

function generatePuzzle(clueCount) {
    const full = generateFull();
    solution = cloneGrid(full);

    const puzzle = cloneGrid(full);
    const positions = shuffle([...Array(81).keys()]); // 0..80

    let removed = 0;
    const target = 81 - clueCount;

    for (const pos of positions) {
        if (removed >= target) break;
        const r = Math.floor(pos / 9);
        const c = pos % 9;
        const backup = puzzle[r][c];
        puzzle[r][c] = 0;

        // Count solutions with a clone — restore if not unique
        const clone = cloneGrid(puzzle);
        const count = solve(clone, true, 2);
        if (count !== 1) {
            puzzle[r][c] = backup; // not unique — restore
        } else {
            removed++;
        }
    }

    return puzzle;
}

// ── SHUFFLE ────────────────────────────────────────────────────────────────────
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ── LEVEL CARDS ────────────────────────────────────────────────────────────────
function buildLevelCards() {
    const container = document.getElementById('level-cards');
    container.innerHTML = '';
    LEVELS.forEach((lvl, i) => {
        const card = document.createElement('div');
        card.className = 'level-card';
        card.innerHTML = `<div class="lc-name">${lvl.name}</div><div class="lc-detail">${lvl.label}</div>`;
        card.addEventListener('pointerdown', () => showRulesOverlay(i));
        container.appendChild(card);
    });
}

// ── RULES OVERLAY ──────────────────────────────────────────────────────────────
function showRulesOverlay(levelIndex) {
    const lvl     = LEVELS[levelIndex];
    const overlay = document.getElementById('rules-overlay');
    document.getElementById('rules-level-name').textContent = lvl.name + '  —  ' + lvl.label;

    const card = document.getElementById('rules-card');
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';

    startModal.classList.add('hidden');
    overlay.classList.remove('hidden');

    document.getElementById('rules-start-btn').onclick = () => {
        overlay.classList.add('hidden');
        showCountdown(() => startGame(levelIndex));
    };
    document.getElementById('rules-back-btn').onclick = () => {
        overlay.classList.add('hidden');
        startModal.classList.remove('hidden');
    };
}

// ── COUNTDOWN ──────────────────────────────────────────────────────────────────
function showCountdown(callback) {
    const overlay = document.getElementById('countdown-overlay');
    const numEl   = document.getElementById('countdown-number');
    overlay.classList.remove('hidden');

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
        callback();
    }, 3400);
}

// ── START GAME ─────────────────────────────────────────────────────────────────
function startGame(levelIndex) {
    currentLevel = LEVELS[levelIndex];
    mistakes     = 0;
    elapsedSecs  = 0;
    selectedR    = -1;
    selectedC    = -1;
    gameActive   = true;

    // Generate puzzle (may take a moment for Pro)
    const puzzle = generatePuzzle(currentLevel.clues);
    board      = cloneGrid(puzzle);
    givenMask  = puzzle.map(row => row.map(v => v !== 0));
    wrongMask  = makeEmpty9x9().map(row => row.map(() => false));

    hideAllModals();
    gameArea.classList.remove('hidden');
    renderGrid();
    setHeader(true);
    startTimer();
}

// ── RENDER GRID ────────────────────────────────────────────────────────────────
function renderGrid() {
    grid.innerHTML = '';
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.className    = 'cell';
            cell.dataset.r    = r;
            cell.dataset.c    = c;
            applyCellState(cell, r, c);
            cell.addEventListener('pointerdown', () => handleCellTap(r, c));
            grid.appendChild(cell);
        }
    }
}

function getCellEl(r, c) {
    return grid.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
}

function applyCellState(cell, r, c) {
    const val = board[r][c];
    cell.classList.remove('given', 'user-correct', 'wrong', 'selected', 'peer', 'match');

    if (givenMask[r][c]) {
        cell.classList.add('given');
        cell.textContent = val;
        return;
    }

    if (val !== 0) {
        if (wrongMask[r][c]) {
            cell.classList.add('wrong');
        } else {
            cell.classList.add('user-correct');
        }
        cell.textContent = val;
    } else {
        cell.textContent = '';
    }
}

function refreshHighlights() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const el  = getCellEl(r, c);
            if (!el) continue;
            // Reset peer/match/selected
            el.classList.remove('selected', 'peer', 'match');

            if (selectedR === -1) continue;

            if (r === selectedR && c === selectedC) {
                el.classList.add('selected');
                continue;
            }

            const isPeer = (r === selectedR) || (c === selectedC) ||
                (Math.floor(r / 3) === Math.floor(selectedR / 3) &&
                 Math.floor(c / 3) === Math.floor(selectedC / 3));

            const selVal = board[selectedR][selectedC];
            const isMatch = selVal !== 0 && board[r][c] === selVal;

            if (isMatch) { el.classList.add('match'); }
            else if (isPeer) { el.classList.add('peer'); }
        }
    }
}

// ── INTERACTION ────────────────────────────────────────────────────────────────
function handleCellTap(r, c) {
    if (!gameActive) return;
    if (givenMask[r][c]) {
        // Tap on a given cell — just update highlights, no picker
        selectedR = r;
        selectedC = c;
        refreshHighlights();
        return;
    }
    selectedR = r;
    selectedC = c;
    refreshHighlights();
    showNumPicker();
}

function showNumPicker() {
    numPicker.classList.remove('hidden');
}

function hideNumPicker() {
    numPicker.classList.add('hidden');
}

// Backdrop tap → close picker
document.getElementById('num-picker-backdrop').addEventListener('pointerdown', hideNumPicker);

// Number buttons
document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        const n = parseInt(btn.dataset.n, 10);
        hideNumPicker();
        placeNumber(n);
    });
});

function placeNumber(n) {
    if (selectedR === -1 || !gameActive) return;
    const r = selectedR, c = selectedC;
    if (givenMask[r][c]) return;

    if (n === 0) {
        // Erase — only clear user-placed, non-wrong cells (or wrong cells)
        board[r][c]     = 0;
        wrongMask[r][c] = false;
        const el = getCellEl(r, c);
        if (el) applyCellState(el, r, c);
        refreshHighlights();
        return;
    }

    if (n === solution[r][c]) {
        // ✅ Correct
        board[r][c]     = n;
        wrongMask[r][c] = false;
        const el = getCellEl(r, c);
        if (el) applyCellState(el, r, c);
        playSound('correct');
        refreshHighlights();
        checkWin();
    } else {
        // ❌ Wrong
        board[r][c]     = n;
        wrongMask[r][c] = true;
        mistakes++;
        const el = getCellEl(r, c);
        if (el) {
            applyCellState(el, r, c);
            // Re-trigger animation
            el.classList.remove('wrong');
            void el.offsetWidth;
            el.classList.add('wrong');
        }
        updateHeaderMistakes();
        playSound('incorrect');
        refreshHighlights();
    }
}

// ── WIN CHECK ──────────────────────────────────────────────────────────────────
function checkWin() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] !== solution[r][c]) return;
        }
    }
    // All cells match solution
    gameActive = false;
    stopTimer();
    // Short celebratory delay
    setTimeout(showResultModal, 500);
}

// ── TIMER ──────────────────────────────────────────────────────────────────────
function startTimer() {
    stopTimer();
    gameStartTime = Date.now();
    timerInterval = setInterval(() => {
        elapsedSecs = Math.floor((Date.now() - gameStartTime) / 1000);
        updateHeaderTimer();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function fmtTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}

// ── HEADER ─────────────────────────────────────────────────────────────────────
function setHeader(visible) {
    if (visible) {
        headerLevelName.textContent = currentLevel.name;
        [headerLevelName, headerSep, headerTimer, headerSep2, headerMistakes].forEach(el => el.classList.remove('hidden'));
        updateHeaderTimer();
        updateHeaderMistakes();
    } else {
        [headerLevelName, headerSep, headerTimer, headerSep2, headerMistakes].forEach(el => el.classList.add('hidden'));
    }
}

function updateHeaderTimer() {
    headerTimer.textContent = `⏱\u00a0${fmtTime(elapsedSecs)}`;
}

function updateHeaderMistakes() {
    headerMistakes.textContent = `✗\u00a0${mistakes}`;
}

// ── RESULT MODAL ───────────────────────────────────────────────────────────────
function showResultModal() {
    const score = elapsedSecs + mistakes * MISTAKE_PENALTY;
    const pct   = Math.max(0, Math.round((1 - mistakes / Math.max(1, mistakes + 10)) * 100));
    const grade = mistakes === 0 ? 'A+' : mistakes <= 2 ? 'A' : mistakes <= 5 ? 'B' : mistakes <= 10 ? 'C' : 'D';

    document.getElementById('result-card-level').textContent   = currentLevel.name;
    document.getElementById('result-card-game').textContent    = '🔢 Sudoku';
    document.getElementById('result-icon').textContent         = mistakes === 0 ? '🏆' : '✅';
    document.getElementById('result-title').textContent        = mistakes === 0 ? 'PERFECT!' : 'SOLVED!';
    document.getElementById('result-title').style.color        = 'var(--success)';

    document.getElementById('stat-time').textContent      = fmtTime(elapsedSecs);
    document.getElementById('stat-mistakes').textContent  = mistakes;
    document.getElementById('stat-pct').textContent       = grade;

    const timeRow = document.getElementById('result-time-row');
    timeRow.classList.add('sudoku-score');
    document.getElementById('result-time-label').textContent = 'Final Score (lower = better)';
    document.getElementById('result-time-value').textContent = `${score}s`;
    document.getElementById('result-time-icon').textContent  = '⭐';

    // Arc animation — show accuracy visually (inverted: fewer mistakes = higher %)
    const accuracy = Math.max(0, Math.min(100, Math.round(100 - (mistakes / Math.max(1, board.flat().filter((_,i) => !givenMask[Math.floor(i/9)][i%9]).length)) * 100)));
    setTimeout(() => {
        animatePctRing(accuracy,
            document.getElementById('stat-pct'),
            document.getElementById('pct-arc'),
            grade
        );
    }, 200);

    // Leaderboard prompt
    const nameRow = document.getElementById('result-name-row');
    nameRow.classList.remove('hidden');
    document.getElementById('player-name').value = '';

    // Buttons
    const btns = document.getElementById('result-buttons');
    btns.innerHTML = '';

    const saveBtn = document.createElement('button');
    saveBtn.className   = 'primary';
    saveBtn.textContent = 'SAVE SCORE';
    saveBtn.addEventListener('pointerdown', submitScore);

    const shareBtn = document.createElement('button');
    shareBtn.className   = 'share-btn';
    shareBtn.textContent = '📤 SHARE RESULT';
    shareBtn.addEventListener('pointerdown', () => shareResult(score));

    const retryBtn = document.createElement('button');
    retryBtn.textContent = 'PLAY AGAIN';
    retryBtn.addEventListener('pointerdown', () => startGame(LEVELS.indexOf(currentLevel)));

    const menuBtn = document.createElement('button');
    menuBtn.textContent = 'MAIN MENU';
    menuBtn.addEventListener('pointerdown', resetToStart);

    btns.appendChild(saveBtn);
    btns.appendChild(shareBtn);
    btns.appendChild(retryBtn);
    btns.appendChild(menuBtn);

    resultModal.classList.remove('hidden');
}

// ── SHARE RESULT (canvas-based — matches Bus Escape pattern) ──────────────────
function shareResult(score) {
    const DPR = Math.min(window.devicePixelRatio || 1, 3);
    const CW  = 420;
    const CH  = 300;
    const canvas = document.createElement('canvas');
    canvas.width  = CW * DPR;
    canvas.height = CH * DPR;
    const ctx = canvas.getContext('2d');
    ctx.scale(DPR, DPR);

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, CW, CH);
    bg.addColorStop(0, '#061008');
    bg.addColorStop(1, '#081814');
    ctx.fillStyle = bg;
    rrFill(ctx, 0, 0, CW, CH, 20);

    // Border glow
    ctx.save();
    ctx.strokeStyle = 'rgba(74,222,128,0.55)';
    ctx.lineWidth = 2.5;
    rrStroke(ctx, 1.5, 1.5, CW - 3, CH - 3, 19);
    ctx.restore();

    // Top bar
    ctx.fillStyle = 'rgba(74,222,128,0.08)';
    rrFill(ctx, 0, 0, CW, 52, { tl: 20, tr: 20, bl: 0, br: 0 });

    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillStyle = '#4ade80';
    ctx.textAlign = 'left';
    ctx.fillText('🔢 Sudoku', 20, 32);

    ctx.font = '13px "Courier New", monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';
    ctx.fillText(currentLevel ? currentLevel.name : '', CW - 20, 32);

    // Title
    ctx.textAlign = 'center';
    const icon  = mistakes === 0 ? '🏆' : '✅';
    const title = mistakes === 0 ? 'PERFECT SOLVE!' : 'PUZZLE SOLVED!';
    ctx.font = 'bold 26px "Courier New", monospace';
    ctx.fillStyle = '#4ade80';
    ctx.shadowColor = 'rgba(74,222,128,0.6)';
    ctx.shadowBlur = 18;
    ctx.fillText(`${icon}  ${title}`, CW / 2, 95);
    ctx.shadowBlur = 0;

    // Stats row
    const statY = 138;
    const cols  = [
        { label: 'TIME',     value: fmtTime(elapsedSecs) },
        { label: 'MISTAKES', value: String(mistakes)       },
        { label: 'SCORE',    value: `${score}s`            },
    ];
    const colW = CW / 3;
    cols.forEach((col, i) => {
        const cx = colW * i + colW / 2;
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        rrFill(ctx, colW * i + 12, statY - 28, colW - 24, 64, 12);
        ctx.font = 'bold 22px "Courier New", monospace';
        ctx.fillStyle = '#4ade80';
        ctx.textAlign = 'center';
        ctx.fillText(col.value, cx, statY + 8);
        ctx.font = '10px "Courier New", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(col.label, cx, statY + 26);
    });

    // Dividers
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    [1, 2].forEach(i => {
        ctx.beginPath();
        ctx.moveTo(colW * i, statY - 20);
        ctx.lineTo(colW * i, statY + 32);
        ctx.stroke();
    });

    // Footer branding
    ctx.font = '11px "Courier New", monospace';
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'center';
    ctx.fillText('sharikmp.github.io · Neural Minds · Sudoku', CW / 2, CH - 16);

    // Export / share
    canvas.toBlob(async (blob) => {
        const file    = new File([blob], 'sudoku-result.png', { type: 'image/png' });
        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

        if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: 'Sudoku Result',
                    text: `🔢 ${mistakes === 0 ? 'Perfect solve!' : 'Solved!'} ${currentLevel.name} in ${fmtTime(elapsedSecs)} with ${mistakes} mistake${mistakes !== 1 ? 's' : ''} — Neural Minds Sudoku`,
                    files: [file],
                });
                return;
            } catch (err) {
                if (err.name !== 'AbortError') console.warn('Share failed, falling back to download', err);
                else return;
            }
        }

        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href     = url;
        a.download = 'sudoku-result.png';
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    }, 'image/png');
}

// Canvas helpers (mirrors Bus Escape)
function rrFill(ctx, x, y, w, h, r) {
    const rad = typeof r === 'number'
        ? { tl: r, tr: r, bl: r, br: r }
        : { tl: r.tl ?? 0, tr: r.tr ?? 0, bl: r.bl ?? 0, br: r.br ?? 0 };
    ctx.beginPath();
    ctx.moveTo(x + rad.tl, y);
    ctx.lineTo(x + w - rad.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad.tr);
    ctx.lineTo(x + w, y + h - rad.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad.br, y + h);
    ctx.lineTo(x + rad.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad.bl);
    ctx.lineTo(x, y + rad.tl);
    ctx.quadraticCurveTo(x, y, x + rad.tl, y);
    ctx.closePath();
    ctx.fill();
}

function rrStroke(ctx, x, y, w, h, r) {
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

// ── LEADERBOARD ────────────────────────────────────────────────────────────────
function lbKey(levelId) { return `nm_sudoku_${levelId}`; }

function submitScore() {
    const name  = (document.getElementById('player-name').value.trim() || 'Anonymous').slice(0, 15);
    const score = elapsedSecs + mistakes * MISTAKE_PENALTY;
    const key   = lbKey(currentLevel.id);
    const board = JSON.parse(localStorage.getItem(key) || '[]');

    board.push({
        name,
        score,
        time:     fmtTime(elapsedSecs),
        mistakes,
        date: new Date().toLocaleDateString(),
    });
    board.sort((a, b) => a.score - b.score); // lower score = better
    board.splice(LEADERBOARD_SIZE);
    localStorage.setItem(key, JSON.stringify(board));

    document.getElementById('result-name-row').classList.add('hidden');
    const btns    = document.getElementById('result-buttons');
    const saveBtn = btns.querySelector('.primary');
    if (saveBtn) saveBtn.remove();
    const lbBtn = document.createElement('button');
    lbBtn.className   = 'leaderboard-btn';
    lbBtn.textContent = 'VIEW LEADERBOARD';
    lbBtn.addEventListener('pointerdown', showLeaderboardModal);
    btns.prepend(lbBtn);
}

function showLeaderboardModal() {
    hideAllModals();
    leaderboardModal.classList.remove('hidden');
    const activeLvl = currentLevel || LEVELS[0];
    document.getElementById('lb-level-name').textContent = activeLvl.name;
    renderLeaderboard(activeLvl.id);

    const tabs = document.getElementById('lb-tabs');
    tabs.innerHTML = '';
    LEVELS.forEach(lvl => {
        const btn = document.createElement('button');
        btn.textContent = lvl.name;
        if (lvl.id === activeLvl.id) btn.classList.add('active');
        btn.addEventListener('pointerdown', () => {
            tabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('lb-level-name').textContent = lvl.name;
            renderLeaderboard(lvl.id);
        });
        tabs.appendChild(btn);
    });
}

function renderLeaderboard(levelId) {
    const body  = document.getElementById('leaderboard-body');
    const saved = JSON.parse(localStorage.getItem(lbKey(levelId)) || '[]');
    body.innerHTML = '';
    if (saved.length === 0) {
        body.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#334155">No scores yet</td></tr>`;
        return;
    }
    saved.forEach((entry, i) => {
        const tr = document.createElement('tr');
        if (i === 0) tr.classList.add('highlight');
        tr.innerHTML = `<td>${i + 1}</td><td>${escapeHTML(entry.name)}</td><td class="score-col">${entry.score}s</td>`;
        body.appendChild(tr);
    });
}

// ── RESET / NAV ────────────────────────────────────────────────────────────────
function resetToStart() {
    gameActive = false;
    stopTimer();
    hideAllModals();
    gameArea.classList.add('hidden');
    hideNumPicker();
    setHeader(false);
    buildLevelCards();
    startModal.classList.remove('hidden');

    // Re-trigger start logo animation
    const logo = document.getElementById('start-logo');
    logo.style.animation = 'none';
    void logo.offsetWidth;
    logo.style.animation = '';
}

function hideAllModals() {
    [startModal, resultModal, leaderboardModal].forEach(m => m.classList.add('hidden'));
    const rules     = document.getElementById('rules-overlay');
    const countdown = document.getElementById('countdown-overlay');
    if (rules)     rules.classList.add('hidden');
    if (countdown) countdown.classList.add('hidden');
}

// ── ANIMATION HELPERS ──────────────────────────────────────────────────────────
function animateCounter(el, from, to, duration) {
    const start = performance.now();
    function step(now) {
        const t    = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(from + (to - from) * ease);
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function animatePctRing(pct, labelEl, arcEl, gradeLabel) {
    const circumference = 197.9;
    const start = performance.now();
    function step(now) {
        const t      = Math.min(1, (now - start) / 900);
        const ease   = 1 - Math.pow(1 - t, 3);
        const offset = circumference * (1 - (pct / 100) * ease);
        arcEl.style.strokeDashoffset = offset;
        arcEl.style.stroke = '#4ade80'; // green for Sudoku
        labelEl.textContent = gradeLabel;
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c] || c)
    );
}

// ── INIT ───────────────────────────────────────────────────────────────────────
(function init() {
    // Apply persisted sound state to toggle button
    const soundToggle = document.getElementById('sound-toggle');
    if (!soundEnabled) {
        soundToggle.textContent = '🔇';
        soundToggle.classList.add('muted');
    }
    buildLevelCards();
    startModal.classList.remove('hidden');
})();
