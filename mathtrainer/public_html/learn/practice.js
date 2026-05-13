/**
 * practice.js  —  Shared practice engine for all /learn/* topic pages.
 *
 * Usage: each page calls  initPractice(config)  after DOM ready.
 *
 * config = {
 *   op        : 'add' | 'sub' | 'mul' | 'div'
 *   opColor   : CSS color string  (e.g. '#00ff80')
 *   containerId : id of the practice-tab panel element
 * }
 *
 * Level definitions (same for all operations):
 *   L1 — single digit    (1–9  op  1–9)
 *   L2 — 1+2 digit       (1–9  op  10–99)
 *   L3 — 2 digit         (10–99 op 10–99)
 *   L4 — 2+3 digit       (10–99 op 100–999)
 *   L5 — 3 digit         (100–999 op 100–999)
 *
 * Badges earned per topic based on L5 sums solved (cumulative across sessions):
 *   Bronze 🥉 — 20 solved
 *   Silver 🥈 — 50 solved
 *   Gold   🥇 — 100 solved
 */

(function () {
    'use strict';

    /* ── Number generators per level ───────────────────────────── */
    const LEVEL_RANGES = [
        { min1: 1,   max1: 9,   min2: 1,   max2: 9   },   // L1
        { min1: 1,   max1: 9,   min2: 10,  max2: 99  },   // L2
        { min1: 10,  max1: 99,  min2: 10,  max2: 99  },   // L3
        { min1: 10,  max1: 99,  min2: 100, max2: 999 },   // L4
        { min1: 100, max1: 999, min2: 100, max2: 999 },   // L5
    ];

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateQuestion(op, level) {
        const r   = LEVEL_RANGES[level];
        let a     = rand(r.min1, r.max1);
        let b     = rand(r.min2, r.max2);
        let ans;

        if (op === 'add') {
            ans = a + b;
        } else if (op === 'sub') {
            // ensure positive result
            if (a < b) [a, b] = [b, a];
            if (a === b) a += rand(1, 5);
            ans = a - b;
        } else if (op === 'mul') {
            // Multiplication has its own progressive ranges (shared ranges have 3-digit mins that break capping)
            const MUL_RANGES = [
                { min1: 2,   max1: 9,   min2: 2,  max2: 9  },  // L1: single digit × single digit
                { min1: 2,   max1: 12,  min2: 2,  max2: 12 },  // L2: times tables up to 12
                { min1: 10,  max1: 99,  min2: 2,  max2: 9  },  // L3: 2-digit × 1-digit
                { min1: 10,  max1: 99,  min2: 10, max2: 99 },  // L4: 2-digit × 2-digit
                { min1: 100, max1: 999, min2: 2,  max2: 9  },  // L5: 3-digit × 1-digit
            ];
            const mr = MUL_RANGES[level];
            a = rand(mr.min1, mr.max1);
            b = rand(mr.min2, mr.max2);
            ans = a * b;
        } else { // div
            // Division has its own ranges to avoid the shared min2>=100 clamping bug
            const DIV_RANGES = [
                { maxDivisor: 9,  maxQuotient: 9   },  // L1: single digit ÷ single digit
                { maxDivisor: 9,  maxQuotient: 12  },  // L2: up to ÷9, quotient ≤ 12
                { maxDivisor: 12, maxQuotient: 99  },  // L3: divisor ≤ 12, 2-digit quotient
                { maxDivisor: 20, maxQuotient: 99  },  // L4: divisor ≤ 20, 2-digit quotient
                { maxDivisor: 20, maxQuotient: 999 },  // L5: divisor ≤ 20, 3-digit quotient
            ];
            const dr = DIV_RANGES[level];
            // generate a clean division (no remainder)
            b   = rand(2, dr.maxDivisor);               // divisor
            ans = rand(2, dr.maxQuotient);               // quotient
            a   = b * ans;                               // dividend = divisor × quotient
        }
        return { a, b, ans };
    }

    /* ── Format a sum in a "written on paper" HTML block ─────── */
    const OP_SYMBOLS = { add: '+', sub: '−', mul: '×', div: '÷' };

    function digits(n) {
        return String(n).split('').join(' ');
    }

    function buildSumCard(q, op, idx, opColor) {
        const sym  = OP_SYMBOLS[op];
        const wA   = String(q.a).length;
        const wB   = String(q.b).length;
        const wAns = String(q.ans).length;
        const colW = Math.max(wA, wB, wAns) * 14 + 20;

        const card  = document.createElement('div');
        card.className = 'sum-card';
        card.dataset.ans = q.ans;
        card.dataset.idx = idx;

        card.innerHTML = `
            <div class="sum-top">${digits(q.a)}</div>
            <div class="sum-bottom">
                <span class="sum-op-sym" style="color:${opColor}">${sym}</span>
                <span>${digits(q.b)}</span>
            </div>
            <div class="sum-line"></div>
            <div class="sum-answer-row">
                <input class="sum-input" type="number" placeholder="?" autocomplete="off"
                       style="width:${colW}px;color:${opColor};"
                       aria-label="Enter answer">
                <button class="sum-check">✓</button>
            </div>
            <span class="sum-badge-solved">✓</span>
        `;

        const input = card.querySelector('.sum-input');
        const check = card.querySelector('.sum-check');

        function verify() {
            const val = parseInt(input.value, 10);
            if (isNaN(val)) return;
            if (val === q.ans) {
                card.classList.add('solved');
                card.classList.remove('wrong');
                input.readOnly = true;
            } else {
                card.classList.add('wrong');
                card.classList.remove('solved');
                setTimeout(() => card.classList.remove('wrong'), 600);
            }
        }

        input.addEventListener('keydown', e => { if (e.key === 'Enter') verify(); });
        check.addEventListener('click', verify);

        return card;
    }

    /* ── Main init ──────────────────────────────────────────────── */
    window.initPractice = function (config) {
        const { op, opColor, containerId } = config;
        const container = document.getElementById(containerId);
        if (!container) return;

        const LEVEL_COUNT   = 5;
        const SUMS_PER_LEVEL = 20;
        const BADGE_LEVELS  = { bronze: 20, silver: 50, gold: 100 };
        const STORAGE_KEY   = `mt_badges_${op}`;

        /* ── State ── */
        let currentLevel = 0;   // 0-based
        const levelSums  = [];  // levelSums[l] = array of question objects

        // Load badge progress from localStorage
        function storedSolved() {
            return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
        }
        function addSolved(n) {
            localStorage.setItem(STORAGE_KEY, storedSolved() + n);
            refreshBadges();
        }

        /* ── Generate initial 20 sums per level ── */
        for (let l = 0; l < LEVEL_COUNT; l++) {
            levelSums[l] = [];
            for (let s = 0; s < SUMS_PER_LEVEL; s++) {
                levelSums[l].push(generateQuestion(op, l));
            }
        }

        /* ── Render ── */
        container.innerHTML = `
            <div class="practice-header">
                <div class="level-pills" id="level-pills-${op}"></div>
                <div class="practice-progress" id="prac-progress-${op}"></div>
            </div>
            <div id="sums-area-${op}" class="sums-grid"></div>
            <div class="load-more-row" id="load-more-row-${op}">
                <button class="btn-load-more" id="btn-load-more-${op}">
                    <i class="fas fa-plus"></i> Load 10 more
                </button>
                <div style="font-size:0.72rem;color:rgba(255,255,255,0.3);margin-top:6px;">Infinite practice — keep going!</div>
            </div>
            <div class="badges-section">
                <div style="font-family:'Space Grotesk',sans-serif;font-size:0.82rem;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1px;margin-bottom:0.9rem;">
                    <i class="fas fa-medal"></i> Badges (Level 5 sums solved)
                </div>
                <div class="badges-grid" id="badges-grid-${op}"></div>
            </div>
        `;

        /* ── Level pills ── */
        const pillsEl = container.querySelector(`#level-pills-${op}`);
        for (let l = 0; l < LEVEL_COUNT; l++) {
            const pill = document.createElement('button');
            pill.className = 'level-pill' + (l === 0 ? ' active' : '');
            pill.textContent = `Level ${l + 1}`;
            pill.dataset.level = l;
            pill.addEventListener('click', () => switchLevel(l));
            pillsEl.appendChild(pill);
        }

        /* ── Render level sums ── */
        const sumsArea = container.querySelector(`#sums-area-${op}`);

        function renderSums(l) {
            sumsArea.innerHTML = '';
            levelSums[l].forEach((q, i) => {
                sumsArea.appendChild(buildSumCard(q, op, i, opColor));
            });
            updateProgress(l);
            updateLoadMore(l);
        }

        function switchLevel(l) {
            currentLevel = l;
            pillsEl.querySelectorAll('.level-pill').forEach((p, i) => {
                p.classList.toggle('active', i === l);
            });
            renderSums(l);
        }

        /* ── Progress counter ── */
        const progressEl = container.querySelector(`#prac-progress-${op}`);

        function updateProgress(l) {
            const total  = levelSums[l].length;
            const solved = sumsArea.querySelectorAll('.sum-card.solved').length;
            progressEl.textContent = `${solved} / ${total} solved`;

            // Mark pill as done if all solved
            if (solved === total) {
                pillsEl.querySelectorAll('.level-pill')[l].classList.add('done');
                // If L5, track badge progress
                if (l === 4) addSolved(solved);
            }
        }

        // Re-check progress whenever an input is checked (event delegation)
        sumsArea.addEventListener('click', e => {
            if (e.target.classList.contains('sum-check')) {
                setTimeout(() => updateProgress(currentLevel), 50);
            }
        });
        sumsArea.addEventListener('keydown', e => {
            if (e.key === 'Enter' && e.target.classList.contains('sum-input')) {
                setTimeout(() => updateProgress(currentLevel), 50);
            }
        });

        /* ── Load more ── */
        const loadMoreRow = container.querySelector(`#load-more-row-${op}`);
        const btnLoadMore = container.querySelector(`#btn-load-more-${op}`);

        function updateLoadMore(l) {
            const solved = sumsArea.querySelectorAll('.sum-card.solved').length;
            const total  = levelSums[l].length;
            // Show load-more only when all current sums solved
            loadMoreRow.classList.toggle('visible', solved === total && total > 0);
        }

        // Re-check after solve
        sumsArea.addEventListener('click', e => {
            if (e.target.classList.contains('sum-check')) {
                setTimeout(() => updateLoadMore(currentLevel), 50);
            }
        });
        sumsArea.addEventListener('keydown', e => {
            if (e.key === 'Enter' && e.target.classList.contains('sum-input')) {
                setTimeout(() => updateLoadMore(currentLevel), 50);
            }
        });

        btnLoadMore.addEventListener('click', () => {
            loadMoreRow.classList.remove('visible');
            const newSums = [];
            for (let s = 0; s < 10; s++) {
                newSums.push(generateQuestion(op, currentLevel));
            }
            levelSums[currentLevel].push(...newSums);
            newSums.forEach((q, i) => {
                sumsArea.appendChild(buildSumCard(q, op, levelSums[currentLevel].length - 10 + i, opColor));
            });
            updateProgress(currentLevel);
        });

        /* ── Badges ── */
        const badgesGrid = container.querySelector(`#badges-grid-${op}`);
        const BADGE_DEF = [
            { key: 'bronze', icon: '🥉', name: 'Bronze',  req: 20  },
            { key: 'silver', icon: '🥈', name: 'Silver',  req: 50  },
            { key: 'gold',   icon: '🥇', name: 'Gold',    req: 100 },
        ];

        function refreshBadges() {
            const solved = storedSolved();
            badgesGrid.innerHTML = '';
            BADGE_DEF.forEach(b => {
                const earned = solved >= b.req;
                const card   = document.createElement('div');
                card.className = 'badge-card' + (earned ? ' earned' : '');
                card.innerHTML = `
                    <div class="badge-icon">${b.icon}</div>
                    <div class="badge-name">${b.name}</div>
                    <div class="badge-req">${b.req} L5 sums</div>
                `;
                badgesGrid.appendChild(card);
            });
        }

        /* ── Initial render ── */
        renderSums(0);
        refreshBadges();
    };

    /* ── Tab switcher (shared for all pages) ────────────────────── */
    window.initLearnTabs = function () {
        document.querySelectorAll('.learn-tabs').forEach(tabBar => {
            tabBar.querySelectorAll('.learn-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    const target = tab.dataset.tab;
                    // deactivate all
                    tabBar.querySelectorAll('.learn-tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.learn-tab-panel').forEach(p => p.classList.remove('active'));
                    // activate selected
                    tab.classList.add('active');
                    const panel = document.getElementById(target);
                    if (panel) panel.classList.add('active');
                });
            });
        });
    };

})();
