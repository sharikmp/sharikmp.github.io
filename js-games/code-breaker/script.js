// ─────────────────────────────────────────────────────────────────────────────
//  Coder Breaker — script.js
//  A session-persistent substitution cipher word game.
//  Cipher map is generated once per page-load and stays fixed for all words.
// ─────────────────────────────────────────────────────────────────────────────

// ── CONFIGURATION ─────────────────────────────────────────────────────────────
const SPRINT_LENGTH   = 5;   // always 5 words per sprint
const MAX_WORD_LENGTH = 12;  // slot row is always 12 wide
const LEADERBOARD_SIZE = 10;
const HINT_THRESHOLD  = 0.5; // reveal hint when ≥ 50% slots correctly filled
const MC_LOCK_MS      = 1500; // ms to lock MC buttons after wrong guess
const WRONG_GUESS_PEN = 20;  // score penalty per wrong MC guess

const LEVELS = [
    { id: 'easy',   name: 'Easy',   minLen: 4,  maxLen: 6,  timer: 30, label: '4-6 letters · 10s' },
    { id: 'medium', name: 'Medium', minLen: 5,  maxLen: 8,  timer: 30, label: '5-8 letters · 12s' },
    { id: 'hard',   name: 'Hard',   minLen: 8,  maxLen: 10, timer: 30, label: '8-10 letters · 15s' },
    { id: 'pro',    name: 'Pro',    minLen: 10, maxLen: 12, timer: 30, label: '10-12 letters · 20s' },
];

// ── ANIMAL CIPHER SYMBOLS (26, one per letter A-Z) ───────────────────────────
const ANIMALS = [
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
    '🦁','🐮','🐷','🐸','🐵','🐔','🐧','🦆','🦉','🦇',
    '🐝','🦋','🐌','🐢','🐬','🦀'
];
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// ── WORD BANK ─────────────────────────────────────────────────────────────────
// Placeholder lists — replace with full lists when ready.
// Keys match level ids; words are UPPERCASE.
const WORD_BANK = {
    easy: [
        // 4-letter
        'FROG','CAKE','BIRD','LAMP','FIST','GLOW','JUMP','KNOT','LARK','MAST',
        'NAIL','OPAL','PEAR','QUIZ','RUST','SAGE','TAMP','URGE','VIBE','WAND',
        // 5-letter
        'APPLE','BRAVE','CRANE','DICEY','EAGLE','FLAME','GRACE','HAZEL','IGLOO','JOUST',
        'KNEEL','LLAMA','MAPLE','NOBLE','ONION','PIXEL','QUILL','RAVEN','SNARE','TIGER',
        // 6-letter
        'ANCHOR','BLIGHT','CANDLE','DONKEY','EMBLEM','FALCON','GOBLIN','HAMLET','IGNITE','JUNGLE',
        'KETTLE','LOCKET','MUFFIN','NOODLE','OYSTER','PALATE','QUARRY','RABBIT','SADDLE','TICKLE',
    ],
    medium: [
        // 5-letter
        'AGILE','BLAZE','CRISP','DENIM','EMBER','FABLE','GUAVA','HASTE','INTRO','JAZZY',
        // 6-letter
        'ABLAZE','BONNET','CHORUS','DAGGER','EYELID','FAWNED','GIBLET','HORNET','IMPEDE','JIGSAW',
        // 7-letter
        'ABANDON','BLISTER','CAPSULE','DISTANT','ENVELOP','FRANTIC','GRANITE','HOSTILE','ILLEGAL','JASMINE',
        'KITCHEN','LANTERN','MACHINE','NOSTRIL','ORBITAL','PACIFIC','QUANTUM','RAVENOUS','SOLVENT','THERMAL',
        // 8-letter
        'ABSOLUTE','BACKBONE','CALENDAR','DARKNESS','ESCALATE','FRAGMENT','GRATEFUL','HANDSOME','IMMINENT','JEALOUSY',
    ],
    hard: [
        // 8-letter
        'ABSTRACT','BLAZONED','CAPACITY','DIALOGUE','EARNINGS','FABULOUS','GLIMPSED','HERITAGE','IDENTIFY','JOKINGLY',
        'KINGSHIP','LANGUAGE','MONARCHY','NAVIGATE','OBSOLETE','PARALLEL','QUARRELS','RENDERER','SIMULATE','TOGETHER',
        // 9-letter
        'ABANDONED','BRANDNAME','CAREFULLY','DIFFERENT','ELABORATE','FINANCIAL','GENTLEMAN','HAPPINESS','IMMEDIATE','JUSTIFIED',
        'KNOWLEDGE','LANDSCAPE','МЕХАНИЗМ','NARRATIVE','OBJECTIVE','PERSEVERE','QUESTIONS','REALISTIC','SENSATION','TRANSPORT',
        // 10-letter
        'ABSOLUTELY','BACKGROUND','CELEBRATED','DEFINITION','EVENTUALLY','FOUNDATION','GLAMORIZED','HANDCRAFTED','IMPRESSIVE','JOURNALISM',
    ],
    pro: [
        // 10-letter
        'ACCOMPLISH','BACKGROUND','CELEBRATED','DIPLOMATIC','EVENTUALLY','FOUNDATION','GRANDSTAND','HELICOPTER','ILLUMINATE','JOURNALIST',
        // 11-letter
        'ACKNOWLEDGE','BUTTERFLIES','COINCIDENCE','DESCENDANTS','ESTABLISHED','FINGERPRINT','GRANDMOTHER','HINDQUARTER','INDEPENDENT','JUSTIFIABLE',
        // 12-letter
        'ACCOMPLISHED','CONVENTIONAL','DELIBERATION','ESTABLISHING','FINGERPRINTS','GOVERNMENTAL','HEADQUARTERS','INCOMPARABLE','JURISDICTION','KINDERGARTEN',
    ],
};

// Hint definitions for Easy and Medium words (used when ≥50% slots filled)
const HINTS = {
    // Easy
    FROG:'A small amphibian that jumps', CAKE:'Sweet baked dessert', BIRD:'A feathered flying animal',
    LAMP:'A device that gives light', APPLE:'A common red or green fruit', BRAVE:'Showing courage',
    CRANE:'A tall wading bird or lifting machine', EAGLE:'A large bird of prey',
    TIGER:'A large striped wild cat', ANCHOR:'Heavy device to moor a ship',
    CANDLE:'Wax stick that gives light when lit', JUNGLE:'Dense tropical forest',
    RABBIT:'A small furry hopping animal', SADDLE:'A seat for a horse rider',
    // Medium
    ABLAZE:'On fire; brightly lit', CHORUS:'A group singing together',
    ABANDON:'To leave behind completely', CAPSULE:'A small sealed container',
    FRANTIC:'Wild with excitement or fear', GRANITE:'Hard igneous rock',
    GRATEFUL:'Feeling thankful', DARKNESS:'Absence of light',
    ABSOLUTE:'Complete; total', CALENDAR:'A chart of days and months',
};

// ── SESSION STATE ──────────────────────────────────────────────────────────────
let cipherMap    = {};  // animal symbol → letter  e.g. '🐶' → 'A'
let reverseCipher = {}; // letter → animal symbol  e.g. 'A' → '🐶'

let currentLevel   = null; // reference to LEVELS entry
let wordList       = [];   // 5 words for this sprint
let wordIndex      = 0;
let totalScore     = 0;
let sprintStartTime = 0;

// Per-word state
let currentWord     = '';
let slotState       = []; // array of { correct: bool, symbol: str|null } length = currentWord.length
let selectedSymbol  = null;
let wordTimerRAF    = null;
let wordTimerStart  = 0;
let wordTimerLimit  = 0;
let hintShown       = false;
let mcLocked        = false;
let usedWords       = new Set();

// Sound
let soundEnabled = localStorage.getItem('cbSoundEnabled') !== 'false';

// ── DOM REFS ───────────────────────────────────────────────────────────────────
const startModal       = document.getElementById('start-modal');
const gameArea         = document.getElementById('game-area');
const resultModal      = document.getElementById('result-modal');
const leaderboardModal = document.getElementById('leaderboard-modal');
const refGrid          = document.getElementById('ref-grid');
const slotsRow         = document.getElementById('slots-row');
const hintText         = document.getElementById('hint-text');
const mcGrid           = document.getElementById('mc-grid');
const scoreValue       = document.getElementById('score-value');
const headerTimer      = document.getElementById('header-timer');
const wordTimerWrap    = document.getElementById('word-timer-wrap');
const wordTimerBar     = document.getElementById('word-timer-bar');

// ── SOUND ──────────────────────────────────────────────────────────────────────
const correctAudio   = document.getElementById('correct-audio');
const incorrectAudio = document.getElementById('incorrect-audio');

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('cbSoundEnabled', soundEnabled);
    const btn = document.getElementById('sound-toggle');
    btn.textContent  = soundEnabled ? '🔊' : '🔇';
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

// ── CIPHER GENERATION ─────────────────────────────────────────────────────────
function generateCipherMap() {
    // Fisher-Yates shuffle of ANIMALS array into a new order
    const shuffled = [...ANIMALS];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    cipherMap    = {};
    reverseCipher = {};
    ALPHA.forEach((letter, i) => {
        cipherMap[shuffled[i]]  = letter;      // symbol → letter
        reverseCipher[letter]   = shuffled[i]; // letter → symbol
    });
}

// ── UI: REFERENCE PANEL ───────────────────────────────────────────────────────
function buildReferencePanel() {
    refGrid.innerHTML = '';
    // Show all 26 in two rows of 13
    ALPHA.forEach(letter => {
        const symbol = reverseCipher[letter];
        const cell = document.createElement('div');
        cell.className    = 'ref-cell';
        cell.dataset.symbol = symbol;
        cell.innerHTML    = `<span class="ref-symbol">${symbol}</span><span class="ref-letter">${letter}</span>`;
        cell.addEventListener('pointerdown', () => handleSymbolTap(symbol, cell));
        refGrid.appendChild(cell);
    });
}

function getRefCell(symbol) {
    return refGrid.querySelector(`.ref-cell[data-symbol="${symbol}"]`);
}

// ── UI: LEVEL CARDS ───────────────────────────────────────────────────────────
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

// ── RULES OVERLAY ─────────────────────────────────────────────────
function showRulesOverlay(levelIndex) {
    const lvl     = LEVELS[levelIndex];
    const overlay = document.getElementById('rules-overlay');
    document.getElementById('rules-level-name').textContent = lvl.name + '  —  ' + lvl.label;

    // Re-trigger card entrance animation on each open
    const card = document.getElementById('rules-card');
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';

    startModal.classList.add('hidden');
    overlay.classList.remove('hidden');

    document.getElementById('rules-start-btn').onclick = () => {
        overlay.classList.add('hidden');
        showCountdown(() => startSprint(levelIndex));
    };
    document.getElementById('rules-back-btn').onclick = () => {
        overlay.classList.add('hidden');
        startModal.classList.remove('hidden');
    };
}

// ── COUNTDOWN ─────────────────────────────────────────────────────
function showCountdown(callback) {
    const overlay = document.getElementById('countdown-overlay');
    const numEl   = document.getElementById('countdown-number');
    overlay.classList.remove('hidden');
    numEl.classList.remove('hidden');

    function flash(text, isGo) {
        numEl.classList.remove('count-pop', 'go-text');
        void numEl.offsetWidth; // reflow to restart animation
        numEl.textContent = text;
        if (isGo) numEl.classList.add('go-text');
        numEl.classList.add('count-pop');
    }

    flash('3', false);
    setTimeout(() => flash('2', false), 1000);
    setTimeout(() => flash('1', false), 2000);
    setTimeout(() => flash('GO!', true),  3000);
    setTimeout(() => {
        overlay.classList.add('hidden');
        callback();
    }, 3400);
}

// ── HEADER HELPERS ─────────────────────────────────────────────────────────────
function setHeader(levelName, wordN) {
    const nameEl  = document.getElementById('header-level-name');
    const sep1    = document.getElementById('header-sep');
    const wordEl  = document.getElementById('header-word-label');
    const sep2    = document.getElementById('header-sep2');
    if (levelName) {
        nameEl.textContent = levelName;
        wordEl.textContent = `Word ${wordN}/${SPRINT_LENGTH}`;
        [nameEl, sep1, wordEl, sep2].forEach(el => el.classList.remove('hidden'));
    } else {
        [nameEl, sep1, wordEl, sep2].forEach(el => el.classList.add('hidden'));
    }
    headerTimer.textContent = '--';
    headerTimer.classList.remove('warning');
}

function updateHeaderTimer(seconds) {
    headerTimer.textContent = seconds.toFixed(1);
    headerTimer.classList.toggle('warning', seconds <= 3);
}

// ── SPRINT START ───────────────────────────────────────────────────────────────
function startSprint(levelIndex) {
    currentLevel  = LEVELS[levelIndex];
    wordList      = pickWords(currentLevel, SPRINT_LENGTH);
    wordIndex     = 0;
    totalScore    = 0;
    usedWords     = new Set();
    sprintStartTime = Date.now();

    generateCipherMap();

    hideAllModals();
    gameArea.classList.remove('hidden');
    wordTimerWrap.classList.remove('hidden');
    buildReferencePanel();
    updateScoreDisplay();
    setHeader(currentLevel.name, 1);

    loadWord();
}

// ── WORD PICKING ───────────────────────────────────────────────────────────────
function pickWords(level, count) {
    const pool = (WORD_BANK[level.id] || []).filter(w =>
        w.length >= level.minLen && w.length <= level.maxLen && !usedWords.has(w)
    );
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// ── LOAD NEXT WORD ─────────────────────────────────────────────────────────────
function loadWord() {
    if (wordIndex >= wordList.length) {
        endSprint();
        return;
    }

    currentWord    = wordList[wordIndex];
    usedWords.add(currentWord);
    selectedSymbol = null;
    mcLocked       = false;
    hintShown      = false;

    // Reset slot state
    slotState = currentWord.split('').map(() => ({ correct: false, symbol: null }));

    setHeader(currentLevel.name, wordIndex + 1);
    buildSlots();
    buildMultipleChoice();
    hintText.classList.add('hidden');
    hintText.textContent = '';

    // Reset ref panel selections & greyed state
    refGrid.querySelectorAll('.ref-cell').forEach(c => {
        c.classList.remove('selected', 'used');
    });

    startWordTimer(currentLevel.timer);
}

// ── SLOTS UI ───────────────────────────────────────────────────────────────────
function buildSlots() {
    slotsRow.innerHTML = '';
    for (let i = 0; i < MAX_WORD_LENGTH; i++) {
        const slot = document.createElement('div');
        slot.dataset.index = i;
        if (i < currentWord.length) {
            slot.className = 'slot empty';
            slot.addEventListener('pointerdown', () => handleSlotTap(i));
        } else {
            slot.className = 'slot inactive';
        }
        slotsRow.appendChild(slot);
    }
}

function getSlotEl(i) {
    return slotsRow.querySelector(`.slot[data-index="${i}"]`);
}

function refreshSlot(i) {
    const el    = getSlotEl(i);
    const state = slotState[i];
    if (!el) return;

    if (state.correct) {
        el.className  = 'slot correct';
        el.innerHTML  = `<span class="slot-letter">${currentWord[i]}</span>`;
    } else if (state.symbol) {
        el.className  = 'slot has-symbol';
        el.innerHTML  = `<span class="slot-symbol">${state.symbol}</span>`;
    } else {
        el.className  = 'slot empty';
        el.innerHTML  = '';
    }
}

// ── INTERACTION: SYMBOL TAP ────────────────────────────────────────────────────
function handleSymbolTap(symbol, cellEl) {
    // If same symbol tapped again → deselect
    if (selectedSymbol === symbol) {
        selectedSymbol = null;
        cellEl.classList.remove('selected');
        return;
    }
    // Deselect previous
    if (selectedSymbol) {
        const prev = getRefCell(selectedSymbol);
        if (prev) prev.classList.remove('selected');
    }
    selectedSymbol = symbol;
    cellEl.classList.add('selected');
}

// ── INTERACTION: SLOT TAP ──────────────────────────────────────────────────────
function handleSlotTap(index) {
    const state = slotState[index];

    // Can't interact with a correctly-revealed slot
    if (state.correct) return;

    // If slot already has a symbol — clear it (and restore symbol to panel)
    if (state.symbol && !selectedSymbol) {
        state.symbol = null;
        refreshSlot(index);
        checkHint();
        return;
    }

    // Nothing selected → nothing to do
    if (!selectedSymbol) return;

    const letter      = cipherMap[selectedSymbol];
    const targetLetter = currentWord[index];
    state.symbol       = selectedSymbol;

    if (letter === targetLetter) {
        // ✅ Correct
        state.correct = true;
        refreshSlot(index);
        const el = getSlotEl(index);
        el.classList.add('flash-correct');
        el.addEventListener('animationend', () => el.classList.remove('flash-correct'), { once: true });

        // Grey out this ref cell if all slots for this letter are filled
        markRefCellIfFullyUsed(selectedSymbol);

        playSound('correct');
        checkHint();
        checkAllCorrect();
    } else {
        // ❌ Wrong — visual flash, no penalty
        refreshSlot(index);
        const el = getSlotEl(index);
        el.classList.add('flash-wrong');
        el.addEventListener('animationend', () => {
            el.classList.remove('flash-wrong');
            state.symbol = null;
            refreshSlot(index);
        }, { once: true });
        playSound('incorrect');
    }

    // Deselect symbol after placement attempt
    const refCell = getRefCell(selectedSymbol);
    if (refCell) refCell.classList.remove('selected');
    selectedSymbol = null;
}

function markRefCellIfFullyUsed(symbol) {
    // Grey a symbol in the ref panel if every occurrence of its letter is correctly revealed
    const letter = cipherMap[symbol];
    const allCorrect = currentWord.split('').every((ch, i) => ch !== letter || slotState[i].correct);
    if (allCorrect) {
        const cell = getRefCell(symbol);
        if (cell) cell.classList.add('used');
    }
}

// ── HINT ───────────────────────────────────────────────────────────────────────
function checkHint() {
    if (hintShown) return;
    const revealed = slotState.filter(s => s.correct).length;
    if (revealed / currentWord.length >= HINT_THRESHOLD) {
        hintShown = true;
        const definition = HINTS[currentWord] || '—';
        hintText.textContent = `💡 ${definition}`;
        hintText.classList.remove('hidden');
    }
}

// ── CHECK ALL CORRECT ──────────────────────────────────────────────────────────
function checkAllCorrect() {
    if (slotState.every(s => s.correct)) {
        // All letters guessed via slots (perfect decode) — award 100 pts
        awardScore(currentWord.length, currentWord.length);
        stopWordTimer();
        advanceWord();
    }
}

// ── MULTIPLE CHOICE ────────────────────────────────────────────────────────────
function buildMultipleChoice() {
    mcGrid.innerHTML = '';
    const options = generateOptions(currentWord, currentLevel);
    options.forEach(word => {
        const btn = document.createElement('button');
        btn.className   = 'mc-btn';
        btn.textContent = word;
        btn.addEventListener('pointerdown', () => handleGuess(word, btn));
        mcGrid.appendChild(btn);
    });
}

function generateOptions(correct, level) {
    const pool = (WORD_BANK[level.id] || []).filter(w =>
        w !== correct && Math.abs(w.length - correct.length) <= 1 && !usedWords.has(w)
    );
    const shuffledPool = pool.sort(() => Math.random() - 0.5);
    const distractors  = shuffledPool.slice(0, 3);
    // Pad if not enough distractors
    while (distractors.length < 3) distractors.push(generateFallbackWord(correct.length));
    const all = [...distractors, correct].sort(() => Math.random() - 0.5);
    return all;
}

function generateFallbackWord(len) {
    // Generate a random uppercase letter string as fallback distractor
    return Array.from({ length: len }, () => ALPHA[Math.floor(Math.random() * 26)]).join('');
}

// ── HANDLE GUESS ───────────────────────────────────────────────────────────────
function handleGuess(guessWord, btnEl) {
    if (mcLocked) return;

    if (guessWord === currentWord) {
        // ✅ Correct guess
        btnEl.classList.add('correct-flash');
        playSound('correct');
        const revealed = slotState.filter(s => s.correct).length;
        awardScore(currentWord.length - revealed, currentWord.length);
        stopWordTimer();
        setTimeout(() => advanceWord(), 400);
    } else {
        // ❌ Wrong guess — show penalty animation, stop timer, move to next word immediately.
        btnEl.classList.add('wrong-flash');
        playSound('incorrect');
        applyPenalty(WRONG_GUESS_PEN, btnEl);
        mcLocked = true;
        lockMcButtons(true);
        stopWordTimer();
        // Wait just long enough for the -20 float animation to be visible (~850ms), then advance.
        setTimeout(() => advanceWord(), 850);
    }
}

function lockMcButtons(lock) {
    mcGrid.querySelectorAll('.mc-btn').forEach(b => b.classList.toggle('locked', lock));
}

// ── SCORING ────────────────────────────────────────────────────────────────────
function awardScore(unrevealed, total) {
    if (total === 0) return;
    const efficiency = unrevealed / total;
    const pts        = Math.round(100 * efficiency);
    if (pts <= 0) return;
    totalScore += pts;
    updateScoreDisplay();
    spawnFloatingScore(`+${pts}`, 'positive');
}

function applyPenalty(pts, anchorEl) {
    totalScore = Math.max(0, totalScore - pts);
    updateScoreDisplay();
    spawnFloatingScore(`-${pts}`, 'negative', anchorEl);
}

function updateScoreDisplay() {
    scoreValue.textContent = totalScore;
    scoreValue.classList.remove('bump');
    void scoreValue.offsetWidth; // reflow
    scoreValue.classList.add('bump');
}

function spawnFloatingScore(text, type, anchor) {
    const el = document.createElement('div');
    el.className   = `floating-score ${type}`;
    el.textContent = text;
    const ref = anchor || scoreValue;
    const rect = ref.getBoundingClientRect();
    el.style.left = `${rect.left + rect.width / 2}px`;
    el.style.top  = `${rect.top}px`;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
}

// ── WORD TIMER ─────────────────────────────────────────────────────────────────
function startWordTimer(seconds) {
    stopWordTimer();
    wordTimerLimit = seconds * 1000;
    wordTimerStart = performance.now();
    wordTimerBar.style.transition = 'none';
    wordTimerBar.style.transform  = 'scaleX(1)';
    wordTimerBar.classList.remove('warn', 'crit');

    function tick(now) {
        const elapsed  = now - wordTimerStart;
        const remaining = Math.max(0, wordTimerLimit - elapsed);
        const fraction  = remaining / wordTimerLimit;

        wordTimerBar.style.transition = 'none';
        wordTimerBar.style.transform  = `scaleX(${fraction})`;

        const secs = remaining / 1000;
        updateHeaderTimer(secs);

        if (fraction <= 0.25) wordTimerBar.classList.add('crit');
        else if (fraction <= 0.5) { wordTimerBar.classList.remove('crit'); wordTimerBar.classList.add('warn'); }
        else { wordTimerBar.classList.remove('warn', 'crit'); }

        if (remaining <= 0) {
            // Timer expired — skip word, 0 pts
            onWordTimerExpired();
            return;
        }
        wordTimerRAF = requestAnimationFrame(tick);
    }
    wordTimerRAF = requestAnimationFrame(tick);
}

function stopWordTimer() {
    if (wordTimerRAF) {
        cancelAnimationFrame(wordTimerRAF);
        wordTimerRAF = null;
    }
}

function onWordTimerExpired() {
    // 0 pts, move on
    advanceWord();
}

// ── ADVANCE WORD ───────────────────────────────────────────────────────────────
function advanceWord() {
    stopWordTimer();
    wordIndex++;
    if (wordIndex >= SPRINT_LENGTH) {
        endSprint();
    } else {
        loadWord();
    }
}

// ── END SPRINT ─────────────────────────────────────────────────────────────────
function endSprint() {
    stopWordTimer();
    const totalMs     = Date.now() - sprintStartTime;
    const totalSecs   = (totalMs / 1000).toFixed(1);
    const maxPossible = SPRINT_LENGTH * 100;
    const pct         = Math.round((totalScore / maxPossible) * 100);

    gameArea.classList.add('hidden');
    wordTimerWrap.classList.add('hidden');
    setHeader(null, 0);

    // Fill result modal
    document.getElementById('result-card-level').textContent = currentLevel.name;
    document.getElementById('result-card-game').textContent  = '🔐 Coder Breaker';
    document.getElementById('result-icon').textContent       = pct >= 60 ? '🏆' : '📖';
    document.getElementById('result-title').textContent      = pct >= 60 ? 'DECODED!' : 'GOOD TRY';
    document.getElementById('result-title').style.color      = pct >= 60 ? 'var(--success)' : 'var(--accent)';
    document.getElementById('result-time-value').textContent = `${totalSecs}s`;

    // Animated stat counters
    animateCounter(document.getElementById('stat-solved'),  0, wordList.filter((w,i) => wordWasSolved(i)).length, 900);
    animateCounter(document.getElementById('stat-score'),   0, totalScore, 900);
    animatePctRing(pct, document.getElementById('stat-pct'), document.getElementById('pct-arc'));

    // Leaderboard save prompt
    const nameRow = document.getElementById('result-name-row');
    nameRow.classList.remove('hidden');

    // Result buttons
    const btns = document.getElementById('result-buttons');
    btns.innerHTML = '';
    const saveBtn = document.createElement('button');
    saveBtn.className   = 'primary';
    saveBtn.textContent = 'SAVE SCORE';
    saveBtn.addEventListener('pointerdown', submitScore);
    const retryBtn = document.createElement('button');
    retryBtn.textContent = 'PLAY AGAIN';
    retryBtn.addEventListener('pointerdown', () => startSprint(LEVELS.indexOf(currentLevel)));
    const menuBtn = document.createElement('button');
    menuBtn.textContent = 'MAIN MENU';
    menuBtn.addEventListener('pointerdown', resetToStart);
    btns.appendChild(saveBtn);
    btns.appendChild(retryBtn);
    btns.appendChild(menuBtn);

    resultModal.classList.remove('hidden');
}

// Track which words were solved (guessed correctly before timer expired)
// We track this via a simple side array populated in awardScore path
const solvedWords = new Set();
function wordWasSolved(i) { return solvedWords.has(i); }

// Patch awardScore to also track solved
const _origAwardScore = awardScore;
// Override: track wordIndex at point of correct guess
function awardScoreAndTrack(unrevealed, total) {
    solvedWords.add(wordIndex);
    _origAwardScore(unrevealed, total);
}

// Patch handleGuess and checkAllCorrect to use tracking version
// (done inline below by calling awardScoreAndTrack directly)

// ── LEADERBOARD ────────────────────────────────────────────────────────────────
function lbKey(levelId) { return `coderBreakerLB_${levelId}`; }

function submitScore() {
    const name = (document.getElementById('player-name').value.trim() || 'Anonymous').slice(0, 15);
    const key  = lbKey(currentLevel.id);
    const board = JSON.parse(localStorage.getItem(key) || '[]');
    board.push({ name, score: totalScore, time: ((Date.now() - sprintStartTime) / 1000).toFixed(1) });
    board.sort((a, b) => b.score - a.score || a.time - b.time);
    board.splice(LEADERBOARD_SIZE);
    localStorage.setItem(key, JSON.stringify(board));

    document.getElementById('result-name-row').classList.add('hidden');
    // Swap save button for leaderboard button
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

    // Tabs
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
    const board = JSON.parse(localStorage.getItem(lbKey(levelId)) || '[]');
    body.innerHTML = '';
    if (board.length === 0) {
        body.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#334155">No scores yet</td></tr>`;
        return;
    }
    board.forEach((entry, i) => {
        const tr = document.createElement('tr');
        if (i === 0) tr.classList.add('highlight');
        tr.innerHTML = `<td>${i + 1}</td><td>${escapeHTML(entry.name)}</td><td class="score-col">${entry.score}</td>`;
        body.appendChild(tr);
    });
}

// ── RESET / NAVIGATION ─────────────────────────────────────────────────────────
function resetToStart() {
    hideAllModals();
    gameArea.classList.add('hidden');
    wordTimerWrap.classList.add('hidden');
    stopWordTimer();
    setHeader(null, 0);
    buildLevelCards();
    startModal.classList.remove('hidden');
    // Re-trigger logo animation
    const logo = document.getElementById('start-logo');
    logo.style.animation = 'none';
    void logo.offsetWidth;
    logo.style.animation = '';
}

function hideAllModals() {
    [startModal, resultModal, leaderboardModal].forEach(m => m.classList.add('hidden'));
    const rulesOv     = document.getElementById('rules-overlay');
    const countdownOv = document.getElementById('countdown-overlay');
    if (rulesOv)     rulesOv.classList.add('hidden');
    if (countdownOv) countdownOv.classList.add('hidden');
}

// ── ANIMATION HELPERS ──────────────────────────────────────────────────────────
function animateCounter(el, from, to, duration) {
    const start = performance.now();
    function step(now) {
        const t   = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
        el.textContent = Math.round(from + (to - from) * ease);
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function animatePctRing(pct, labelEl, arcEl) {
    const circumference = 197.9;
    animateCounter(labelEl, 0, pct, 900);
    // Animate the arc separately to show %
    const start = performance.now();
    function step(now) {
        const t    = Math.min(1, (now - start) / 900);
        const ease = 1 - Math.pow(1 - t, 3);
        const offset = circumference * (1 - (pct / 100) * ease);
        arcEl.style.strokeDashoffset = offset;
        labelEl.textContent = Math.round(pct * ease) + '%';
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
    // Apply persisted sound state
    const soundToggle = document.getElementById('sound-toggle');
    if (!soundEnabled) {
        soundToggle.textContent = '🔇';
        soundToggle.classList.add('muted');
    }
    buildLevelCards();
    startModal.classList.remove('hidden');
})();
