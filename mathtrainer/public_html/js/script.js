
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. AUDIO SYNTHESIZER (Low Latency UI Sounds)
       ========================================= */
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playSound(type) {
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (type === 'correct') {
            // Soft satisfying click/bell
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'incorrect') {
            // Low muted thud
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.15);
            gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        }
    }


    /* =========================================
       2. THREE.JS BACKGROUND SCENE (Galaxy + Math Symbols)
       ========================================= */
    class BackgroundScene {
        constructor() {
            this.canvas = document.getElementById('bg-canvas');
            this.scene = new THREE.Scene();
            // Optional: add a slight fog to blend symbols into the galaxy
            this.scene.fog = new THREE.FogExp2(0x1a0b2e, 0.002);

            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });

            this.objects = [];
            this.stars = null;
            this.mouseX = 0;
            this.mouseY = 0;
            this.enableParallax = true;

            this.init();
        }

        init() {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance
            this.camera.position.z = 30;

            this.createStars();
            this.createMathSymbols();

            // Mouse tracking for parallax
            document.addEventListener('mousemove', (e) => {
                if (!this.enableParallax) return;
                this.mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
                this.mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
            });

            window.addEventListener('resize', () => this.handleResize());
            this.animate();
        }

        createStarTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.95)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(16, 16, 16, 0, Math.PI * 2);
            ctx.fill();
            return new THREE.CanvasTexture(canvas);
        }

        createStars() {
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            // Create 1000 stars
            for (let i = 0; i < 1000; i++) {
                vertices.push(
                    THREE.MathUtils.randFloatSpread(200), // x
                    THREE.MathUtils.randFloatSpread(200), // y
                    THREE.MathUtils.randFloatSpread(200)  // z
                );
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            const material = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 2,
                sizeAttenuation: false,
                map: this.createStarTexture(),
                transparent: true,
                opacity: 0.7,
                alphaTest: 0.02,
                depthWrite: false
            });
            this.stars = new THREE.Points(geometry, material);
            this.scene.add(this.stars);
        }

        createTextSprite(text, color) {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            ctx.font = 'bold 80px Space Grotesk, sans-serif';
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Add slight glow
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.fillText(text, 64, 64);

            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.4 });
            const sprite = new THREE.Sprite(material);
            return sprite;
        }

        createMathSymbols() {
            const symbols = ['+', '-', '×', '÷', '%', 'π', '=', '1', '7', '9'];
            const colors = ['#00f3ff', '#d4af37', '#bfa3ff', '#ffb3c6'];

            for (let i = 0; i < 25; i++) {
                const symbol = symbols[Math.floor(Math.random() * symbols.length)];
                const color = colors[Math.floor(Math.random() * colors.length)];

                const sprite = this.createTextSprite(symbol, color);

                // Random positioning
                sprite.position.x = (Math.random() - 0.5) * 60;
                sprite.position.y = (Math.random() - 0.5) * 60;
                sprite.position.z = (Math.random() - 0.5) * 40 - 10; // keep slightly behind

                // Store random rotation/movement speeds
                sprite.userData = {
                    speedX: (Math.random() - 0.5) * 0.02,
                    speedY: (Math.random() - 0.5) * 0.02,
                    bobSpeed: Math.random() * 0.02 + 0.01,
                    bobOffset: Math.random() * Math.PI * 2
                };

                // Scale sprite
                const scale = Math.random() * 2 + 1;
                sprite.scale.set(scale, scale, 1);

                this.scene.add(sprite);
                this.objects.push(sprite);
            }
        }

        animate() {
            requestAnimationFrame(() => this.animate());

            const time = Date.now() * 0.001;

            // Rotate starfield slowly
            if (this.stars) {
                this.stars.rotation.y = time * 0.05;
                this.stars.rotation.x = time * 0.02;
            }

            // Animate math symbols
            this.objects.forEach(obj => {
                obj.position.x += obj.userData.speedX;
                obj.position.y += obj.userData.speedY;

                // Gentle bobbing
                obj.position.y += Math.sin(time * 2 + obj.userData.bobOffset) * 0.01;

                // Wrap around bounds
                if (obj.position.x > 40) obj.position.x = -40;
                if (obj.position.x < -40) obj.position.x = 40;
                if (obj.position.y > 40) obj.position.y = -40;
                if (obj.position.y < -40) obj.position.y = 40;
            });

            // Camera parallax — disabled during gameplay
            if (this.enableParallax) {
                this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
                this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
            } else {
                this.camera.position.x += (0 - this.camera.position.x) * 0.05;
                this.camera.position.y += (0 - this.camera.position.y) * 0.05;
            }
            this.camera.lookAt(this.scene.position);

            this.renderer.render(this.scene, this.camera);
        }

        handleResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    const bgScene = new BackgroundScene();


    /* =========================================
       3. GAME STATE & LOGIC
       ========================================= */

        const LEVEL_UP_CORRECT_ANSWERS = 10;
        const THREE_NUMBER_START_LEVEL = 7;
        const MAX_DIGITS_PER_OPERAND = 7;
        const THIRD_MULTIPLIER_MAX = 9;
        const PRE_GAME_AUTO_START_SECONDS = 15;

        /* ---- Adaptive Difficulty: Level → Digit Config ---- */
        const BASE_LEVEL_CONFIGS = [
            null,             // index 0 unused (levels are 1-based)
            { d1: 1, d2: 1 }, // Level 1: 1-digit op 1-digit
            { d1: 1, d2: 2 }, // Level 2: 1-digit op 2-digit
            { d1: 2, d2: 2 }, // Level 3: 2-digit op 2-digit
            { d1: 1, d2: 3 }, // Level 4: 1-digit op 3-digit
            { d1: 2, d2: 3 }, // Level 5: 2-digit op 3-digit
            { d1: 3, d2: 3 }, // Level 6: 3-digit op 3-digit
        ];

        const BASE_DIVISION_LEVEL_CONFIGS = [
            null,
            { ad: 1, dd: 1 }, // Level 1: 1-digit answer, 1-digit divisor
            { ad: 2, dd: 1 }, // Level 2: 2-digit answer, 1-digit divisor
            { ad: 2, dd: 2 }, // Level 3: 2-digit answer, 2-digit divisor
            { ad: 3, dd: 1 }, // Level 4: 3-digit answer, 1-digit divisor
            { ad: 3, dd: 2 }, // Level 5: 3-digit answer, 2-digit divisor
            { ad: 3, dd: 2 }, // Level 6: 3-digit answer, 2-digit divisor
        ];

        function getRange(digits) {
            if (digits <= 1) return [1, 9];
            const min = Math.pow(10, digits - 1);
            const max = Math.pow(10, digits) - 1;
            return [min, max];
        }

        function getLevelDigitConfig(level) {
            if (level < BASE_LEVEL_CONFIGS.length) {
                return BASE_LEVEL_CONFIGS[level];
            }

            const extraLevels = level - (BASE_LEVEL_CONFIGS.length - 1);
            const d1 = Math.min(MAX_DIGITS_PER_OPERAND, 3 + Math.floor(extraLevels / 2));
            const d2 = Math.min(MAX_DIGITS_PER_OPERAND, 3 + Math.ceil(extraLevels / 2));
            return { d1, d2 };
        }

        function getDivisionLevelConfig(level) {
            if (level < BASE_DIVISION_LEVEL_CONFIGS.length) {
                const baseConfig = BASE_DIVISION_LEVEL_CONFIGS[level];
                const [dMin, dMax] = getRange(baseConfig.dd);
                return { ad: baseConfig.ad, dMin, dMax };
            }

            const digitConfig = getLevelDigitConfig(level);
            const answerDigits = digitConfig.d2;
            const divisorDigits = Math.max(1, digitConfig.d1 - 1);
            const [dMin, dMax] = getRange(divisorDigits);
            return { ad: answerDigits, dMin, dMax };
    }

    function loadLevels() {
        const def = { add: 1, sub: 1, mul: 1, div: 1 };
        try { return Object.assign(def, JSON.parse(localStorage.getItem('mathTrainerLevels') || '{}')); }
        catch (e) { return def; }
    }

    function loadLevelProgress() {
        const def = { add: 0, sub: 0, mul: 0, div: 0 };
        try { return Object.assign(def, JSON.parse(localStorage.getItem('mathTrainerLevelProgress') || '{}')); }
        catch (e) { return def; }
    }

    function loadLifetimeStats() {
        const def = {
            answered: 0,
            solved: 0,
            answeredPerOp: { add: 0, sub: 0, mul: 0, div: 0 },
            solvedPerOp: { add: 0, sub: 0, mul: 0, div: 0 }
        };
        try {
            const raw = JSON.parse(localStorage.getItem('mathTrainerLifetimeStats') || '{}');
            return {
                answered: Number(raw.answered) || 0,
                solved: Number(raw.solved) || 0,
                answeredPerOp: Object.assign({ add: 0, sub: 0, mul: 0, div: 0 }, raw.answeredPerOp || {}),
                solvedPerOp: Object.assign({ add: 0, sub: 0, mul: 0, div: 0 }, raw.solvedPerOp || {})
            };
        } catch (e) {
            return def;
        }
    }

    function saveLevels() {
        localStorage.setItem('mathTrainerLevels', JSON.stringify(STATE.levels));
        localStorage.setItem('mathTrainerLevelProgress', JSON.stringify(STATE.levelProgress));
    }

    function saveLifetimeStats() {
        localStorage.setItem('mathTrainerLifetimeStats', JSON.stringify(STATE.lifetimeStats));
    }

    const GAME_DURATION_SECONDS = 5;

    const LEADERBOARD_MAX_ROWS = 10;
    const LEADERBOARD = {
        activeTab: 'global',
        player: null,
        displayName: 'Me',
        countryCode: 'ZZ'
    };

    const STATE = {
        score: 0,
        streak: 0,
        timeLeft: GAME_DURATION_SECONDS,
        totalQuestions: 0,
        correctAnswers: 0,
        currentAnswer: 0,
        currentOp: 'add',
        interval: null,
        pregameTimer: null,
        isPlaying: false,
        levels: loadLevels(),
        levelProgress: loadLevelProgress(),
        questionsPerOp: { add: 0, sub: 0, mul: 0, div: 0 },
        lifetimeStats: loadLifetimeStats()
    };

    // DOM Elements
    const viewLanding = document.getElementById('view-landing');
    const viewGame = document.getElementById('view-game');
    const viewResults = document.getElementById('view-results');
    const footer = document.getElementById('site-footer');

    const btnStart = document.getElementById('btn-start');
    const btnReplay = document.getElementById('btn-replay');

    const elProblem = document.getElementById('math-problem');
    const elInput = document.getElementById('math-input');
    const elScore = document.getElementById('ui-score');
    const elStreak = document.getElementById('ui-streak');
    const timerContainer = document.getElementById('timer-container');
    const timerBar = document.getElementById('timer-bar');
    const pregameModal = document.getElementById('pregame-modal');
    const pregameRingProgress = document.getElementById('pregame-ring-progress');
    const pregameSecondsLeft = document.getElementById('pregame-seconds-left');
    const pregameAutostartText = document.getElementById('pregame-autostart-text');

    // Per-Operation Stats Elements
    const elTotalQuestions = document.getElementById('ui-total-questions');
    const elOpStats = {
        add: document.getElementById('op-stat-add'),
        sub: document.getElementById('op-stat-sub'),
        mul: document.getElementById('op-stat-mul'),
        div: document.getElementById('op-stat-div')
    };

    const elPregameLevels = {
        add: document.getElementById('pregame-level-add'),
        sub: document.getElementById('pregame-level-sub'),
        mul: document.getElementById('pregame-level-mul'),
        div: document.getElementById('pregame-level-div')
    };

    const elPregameSolvedPerOp = {
        add: document.getElementById('pregame-solved-add'),
        sub: document.getElementById('pregame-solved-sub'),
        mul: document.getElementById('pregame-solved-mul'),
        div: document.getElementById('pregame-solved-div')
    };

    function getOverallLevel() {
        return Math.max(STATE.levels.add, STATE.levels.sub, STATE.levels.mul, STATE.levels.div);
    }

    function hidePregameModal() {
        if (STATE.pregameTimer) {
            clearInterval(STATE.pregameTimer);
            STATE.pregameTimer = null;
        }
        pregameModal.style.display = 'none';
        pregameModal.setAttribute('aria-hidden', 'true');
    }

    function updatePregameCountdownUI(secondsLeft) {
        const clamped = Math.max(0, Math.min(PRE_GAME_AUTO_START_SECONDS, secondsLeft));
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const progress = clamped / PRE_GAME_AUTO_START_SECONDS;
        const dashOffset = circumference * (1 - progress);

        pregameRingProgress.style.strokeDasharray = `${circumference}`;
        pregameRingProgress.style.strokeDashoffset = `${dashOffset}`;
        pregameSecondsLeft.textContent = String(clamped);
        pregameAutostartText.textContent = `Auto start in ${clamped} sec`;
    }

    function fillPregameSummary() {
        document.getElementById('pregame-overall-level').textContent = getOverallLevel();
        document.getElementById('pregame-total-solved').textContent = STATE.lifetimeStats.solved;
        document.getElementById('pregame-total-answered').textContent = STATE.lifetimeStats.answered;

        ['add', 'sub', 'mul', 'div'].forEach(op => {
            if (elPregameLevels[op]) elPregameLevels[op].textContent = STATE.levels[op];
            if (elPregameSolvedPerOp[op]) elPregameSolvedPerOp[op].textContent = STATE.lifetimeStats.solvedPerOp[op];
        });
    }

    function openPregameModal() {
        fillPregameSummary();
        pregameModal.style.display = 'flex';
        pregameModal.setAttribute('aria-hidden', 'false');

        let secondsLeft = PRE_GAME_AUTO_START_SECONDS;
        updatePregameCountdownUI(secondsLeft);

        if (STATE.pregameTimer) clearInterval(STATE.pregameTimer);
        STATE.pregameTimer = setInterval(() => {
            secondsLeft--;
            updatePregameCountdownUI(secondsLeft);
            if (secondsLeft <= 0) {
                hidePregameModal();
                startGame();
            }
        }, 1000);
    }

    function updateResultLifetimeStats() {
        const elFinalTotalSolved = document.getElementById('final-total-solved');
        if (elFinalTotalSolved) elFinalTotalSolved.textContent = STATE.lifetimeStats.solved;
    }

    // View Transition Logic
    function switchView(viewId) {
        document.querySelectorAll('.view-section').forEach(el => {
            el.classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');

        // Hide footer during gameplay to maximize screen space
        if (viewId === 'view-game') {
            footer.style.display = 'none';
            bgScene.enableParallax = false;
        } else {
            footer.style.display = 'block';
            bgScene.enableParallax = true;
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateProblem() {
        const ops = ['+', '-', '×', '÷'];
        const opKeys = ['add', 'sub', 'mul', 'div'];
        const idx = getRandomInt(0, 3);
        const op = ops[idx];
        STATE.currentOp = opKeys[idx];

        const level = STATE.levels[STATE.currentOp];
        const cfg = getLevelDigitConfig(level);
        const threeNum = level >= THREE_NUMBER_START_LEVEL;

        let n1, n2, n3, answer;

        if (op === '+') {
            const [r1min, r1max] = getRange(cfg.d1);
            const [r2min, r2max] = getRange(cfg.d2);
            n1 = getRandomInt(r1min, r1max);
            n2 = getRandomInt(r2min, r2max);
            if (threeNum) {
                n3 = getRandomInt(r1min, r1max);
                answer = n1 + n2 + n3;
                elProblem.textContent = `${n1} + ${n2} + ${n3}`;
            } else {
                answer = n1 + n2;
                elProblem.textContent = `${n1} + ${n2}`;
            }

        } else if (op === '-') {
            // Always keep result positive: n1 from the larger digit range
            const dBig = Math.max(cfg.d1, cfg.d2);
            const dSml = Math.min(cfg.d1, cfg.d2);
            const [bigMin, bigMax] = getRange(dBig);
            const [smlMin, smlMax] = getRange(dSml);
            n1 = getRandomInt(bigMin, bigMax);
            n2 = getRandomInt(smlMin, Math.min(smlMax, n1 - 1));
            if (n2 < 1) n2 = 1;
            if (threeNum) {
                n3 = getRandomInt(smlMin, Math.max(smlMin, n1 - n2 - 1));
                if (n1 - n2 - n3 < 0) n3 = Math.max(1, n1 - n2 - 1);
                answer = n1 - n2 - n3;
                elProblem.textContent = `${n1} - ${n2} - ${n3}`;
            } else {
                answer = n1 - n2;
                elProblem.textContent = `${n1} - ${n2}`;
            }

        } else if (op === '×') {
            const [r1min, r1max] = getRange(cfg.d1);
            const [r2min, r2max] = getRange(cfg.d2);
            n1 = getRandomInt(r1min, r1max);
            n2 = getRandomInt(r2min, r2max);
            if (threeNum) {
                n3 = getRandomInt(2, THIRD_MULTIPLIER_MAX); // keep 3rd factor small for mental math sanity
                answer = n1 * n2 * n3;
                elProblem.textContent = `${n1} × ${n2} × ${n3}`;
            } else {
                answer = n1 * n2;
                elProblem.textContent = `${n1} × ${n2}`;
            }

        } else { // ÷ — always generates clean integer answers
            const dmap = getDivisionLevelConfig(level);
            const [ansMin, ansMax] = getRange(dmap.ad);
            answer = getRandomInt(Math.max(2, ansMin), ansMax);
            n2 = getRandomInt(dmap.dMin, dmap.dMax);
            n1 = answer * n2;
            elProblem.textContent = `${n1} ÷ ${n2}`;
        }

        STATE.currentAnswer = answer;
        elInput.value = '';
        elInput.focus();
    }

    function startGame() {
        hidePregameModal();
        document.documentElement.classList.remove('start-game-from-hiw');

        // Reset State
        STATE.score = 0;
        STATE.streak = 0;
        STATE.timeLeft = GAME_DURATION_SECONDS;
        STATE.totalQuestions = 0;
        STATE.correctAnswers = 0;
        STATE.questionsPerOp = { add: 0, sub: 0, mul: 0, div: 0 };
        STATE.isPlaying = true;

        // Update UI
        elScore.textContent = STATE.score;
        elStreak.textContent = STATE.streak;
        timerContainer.style.display = 'block';
        timerBar.style.width = '100%';
        timerBar.style.backgroundColor = '#00f3ff';

        // Show custom keyboard on mobile, use native input on desktop
        if (isMobileDevice()) {
            document.getElementById('num-keyboard').style.display = 'block';
            elInput.readOnly = true;
        } else {
            document.getElementById('num-keyboard').style.display = 'none';
            elInput.readOnly = false;
        }

        switchView('view-game');
        updateGameStats();
        generateProblem();

        // Start Timer
        clearInterval(STATE.interval);
        STATE.interval = setInterval(gameTick, 1000);
    }

    function updateGameStats() {
        // Update total questions
        elTotalQuestions.textContent = STATE.totalQuestions;
        
        // Update per-operation progress in current level
        const ops = ['add', 'sub', 'mul', 'div'];
        ops.forEach(op => {
            const el = elOpStats[op];
            if (el) {
                const countSpan = el.querySelector('.op-count');
                if (countSpan) {
                    countSpan.textContent = `${STATE.levelProgress[op]}/${LEVEL_UP_CORRECT_ANSWERS}`;
                }
            }
        });
    }

    function gameTick() {
        if (!STATE.isPlaying) return;

        STATE.timeLeft--;
        const percentage = (STATE.timeLeft / GAME_DURATION_SECONDS) * 100;
        timerBar.style.width = `${percentage}%`;

        // Color coding timer
        if (STATE.timeLeft <= 15) {
            timerBar.style.backgroundColor = '#ff3366';
        } else if (STATE.timeLeft <= 30) {
            timerBar.style.backgroundColor = '#f9d77e';
        }

        if (STATE.timeLeft <= 0) {
            endGame();
        }
    }

    function endGame() {
        STATE.isPlaying = false;
        clearInterval(STATE.interval);
        timerContainer.style.display = 'none';

        // Hide custom keyboard
        document.getElementById('num-keyboard').style.display = 'none';

        // Calculate Stats
        const qpm = STATE.totalQuestions;
        const accuracy = STATE.totalQuestions > 0 ? Math.round((STATE.correctAnswers / STATE.totalQuestions) * 100) : 0;

        // Populate Results
        document.getElementById('final-score').textContent = STATE.score;
        document.getElementById('final-qpm').textContent = qpm;
        document.getElementById('final-accuracy').textContent = accuracy;

        const overallLvl = getOverallLevel();
        const elOvLvl = document.getElementById('final-overall-lvl');
        if (elOvLvl) elOvLvl.textContent = overallLvl;

        // Save to history & render
        // (history tracking removed)

        // Personal Best Logic
        const currentPB = localStorage.getItem('mathTrainerPB') || 0;
        const crownBadge = document.getElementById('pb-crown-badge');

        if (STATE.score > currentPB) {
            localStorage.setItem('mathTrainerPB', STATE.score);
            if (crownBadge) crownBadge.style.display = 'inline-block';
            // Confetti!
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#d4af37', '#00f3ff', '#ffffff']
            });
        } else {
            if (crownBadge) crownBadge.style.display = 'none';
        }

        const allTimePB = parseInt(localStorage.getItem('mathTrainerPB') || 0);
        renderMilestoneBadges(allTimePB);
        renderSolvedMilestoneBadges(STATE.lifetimeStats.solved);
        updateResultLifetimeStats();

        switchView('view-results');
        submitAndRefreshLeaderboard();
    }

    function getLeaderboardApiUrl(key) {
        if (window.MathTrainerApi && typeof window.MathTrainerApi[key] === 'string') {
            return window.MathTrainerApi[key];
        }
        return null;
    }

    function getCurrentWeekKeyUtc() {
        const now = new Date();
        const day = now.getUTCDay() || 7;
        const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        monday.setUTCDate(monday.getUTCDate() - (day - 1));
        return monday.toISOString().slice(0, 10);
    }

    function createAnonymousProfile() {
        const rand = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
        return {
            anonId: `ANON-${rand}`
        };
    }

    function getOrCreateWeeklyAnonymousProfile() {
        const storageKey = 'mathTrainerAnonProfile';
        const weekKey = getCurrentWeekKeyUtc();

        try {
            const existing = JSON.parse(localStorage.getItem(storageKey) || 'null');
            if (existing && existing.weekKey === weekKey && existing.anonId) {
                return existing;
            }
        } catch (e) {
            // Ignore malformed localStorage and regenerate profile.
        }

        const generated = createAnonymousProfile();
        const profile = {
            anonId: generated.anonId,
            weekKey
        };
        localStorage.setItem(storageKey, JSON.stringify(profile));
        return profile;
    }

    function inferCountryHintFromLocale() {
        const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
        for (let i = 0; i < langs.length; i++) {
            const lang = String(langs[i] || '').trim();
            const match = lang.match(/-([A-Za-z]{2})$/);
            if (match) return match[1].toUpperCase();
        }
        return 'ZZ';
    }

    function leaderboardStatus(text, isError) {
        const el = document.getElementById('leaderboard-status');
        if (!el) return;
        el.textContent = text;
        el.classList.toggle('is-error', Boolean(isError));
    }

    function setMeConnectionState(isConnected) {
        const label = document.getElementById('leaderboard-player-label');
        if (!label) return;
        label.classList.toggle('is-connected', Boolean(isConnected));
    }

    function showLeaderboardTab(tab) {
        LEADERBOARD.activeTab = tab === 'country' ? 'country' : 'global';

        document.querySelectorAll('[data-leaderboard-tab]').forEach(btn => {
            const active = btn.getAttribute('data-leaderboard-tab') === LEADERBOARD.activeTab;
            btn.classList.toggle('is-active', active);
            btn.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        document.querySelectorAll('[data-leaderboard-list]').forEach(list => {
            const active = list.getAttribute('data-leaderboard-list') === LEADERBOARD.activeTab;
            list.classList.toggle('is-active', active);
        });
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderLeaderboardRows(rows, listKey) {
        const listEl = document.querySelector(`[data-leaderboard-list="${listKey}"]`);
        if (!listEl) return;

        if (!Array.isArray(rows) || rows.length === 0) {
            listEl.innerHTML = '<div class="leaderboard-empty">No scores yet this week.</div>';
            return;
        }

        const currentAnonId = LEADERBOARD.player ? LEADERBOARD.player.anonId : '';

        listEl.innerHTML = rows.map((row, index) => {
            const rank = index + 1;
            const isMe = currentAnonId && String(row.anon_id || '') === currentAnonId;
            const mineClass = isMe ? ' is-me' : '';
            const countryFlag = String(row.country_flag || '🌍');
            const safeName = escapeHtml(String(row.display_name || 'Anonymous').slice(0, 24));
            const safeScore = Number(row.score || 0);
            const safeAcc = Number(row.accuracy || 0);
            const safeQ = Number(row.questions || 0);

            return `<div class="leaderboard-row${mineClass}">
                        <div class="leaderboard-rank">#${rank}</div>
                        <div class="leaderboard-name-wrap">
                            <div class="leaderboard-name"><span class="leaderboard-flag">${countryFlag}</span> ${safeName}</div>
                            <div class="leaderboard-metrics">${safeQ} ques • ${safeAcc}% acc</div>
                        </div>
                        <div class="leaderboard-score">${safeScore}</div>
                    </div>`;
        }).join('');
    }

    async function submitLeaderboardScore(profile) {
        const submitUrl = getLeaderboardApiUrl('submitLeaderboardUrl');
        if (!submitUrl) {
            setMeConnectionState(false);
            return { ok: false, message: 'Leaderboard submit endpoint is not configured.' };
        }

        const payload = {
            anon_id: profile.anonId,
            score: STATE.score,
            questions: STATE.totalQuestions,
            accuracy: STATE.totalQuestions > 0 ? Math.round((STATE.correctAnswers / STATE.totalQuestions) * 100) : 0,
            overall_level: getOverallLevel(),
            country_hint: inferCountryHintFromLocale()
        };

        try {
            const res = await fetch(submitUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) {
                setMeConnectionState(false);
                return {
                    ok: false,
                    message: String(data.message || 'Could not save score to leaderboard.')
                };
            }
            if (data.display_name) {
                LEADERBOARD.displayName = String(data.display_name).slice(0, 24);
            }
            LEADERBOARD.countryCode = String(data.country_code || 'ZZ').toUpperCase();
            setMeConnectionState(true);
            return { ok: true, message: '' };
        } catch (err) {
            setMeConnectionState(false);
            return { ok: false, message: 'Could not reach leaderboard submit API.' };
        }
    }

    async function loadLeaderboard(countryCode) {
        const listUrl = getLeaderboardApiUrl('listLeaderboardUrl');
        if (!listUrl) {
            leaderboardStatus('Leaderboard endpoint is not configured.', true);
            setMeConnectionState(false);
            return;
        }

        const params = new URLSearchParams({ limit: String(LEADERBOARD_MAX_ROWS) });
        if (countryCode && /^[A-Z]{2}$/.test(countryCode)) {
            params.set('country_code', countryCode);
        }

        try {
            const res = await fetch(`${listUrl}?${params.toString()}`);
            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.success) {
                leaderboardStatus('Leaderboard unavailable right now.', true);
                setMeConnectionState(false);
                return;
            }

            setMeConnectionState(true);

            const resolvedCountry = String(data.country_code || countryCode || 'ZZ').toUpperCase();
            LEADERBOARD.countryCode = resolvedCountry;

            renderLeaderboardRows(data.global || [], 'global');
            renderLeaderboardRows(data.country || [], 'country');

            if (resolvedCountry === 'ZZ') {
                document.getElementById('leaderboard-tab-country')?.setAttribute('disabled', 'disabled');
                leaderboardStatus('Showing global weekly leaderboard.', false);
                showLeaderboardTab('global');
            } else {
                document.getElementById('leaderboard-tab-country')?.removeAttribute('disabled');
                leaderboardStatus(`Showing weekly scores for ${resolvedCountry} and Global.`, false);
            }
        } catch (err) {
            leaderboardStatus('Could not load leaderboard.', true);
            setMeConnectionState(false);
        }
    }

    async function submitAndRefreshLeaderboard() {
        const profile = getOrCreateWeeklyAnonymousProfile();
        LEADERBOARD.player = profile;

        const label = document.getElementById('leaderboard-player-label');
        if (label) {
            label.textContent = 'Me';
        }
        setMeConnectionState(false);

        leaderboardStatus('Submitting your score...', false);
        const submitResult = await submitLeaderboardScore(profile);
        if (!submitResult.ok) {
            leaderboardStatus(submitResult.message || 'Score not saved, but leaderboard is still available.', true);
        }
        await loadLeaderboard(LEADERBOARD.countryCode);
    }

    async function initializeLeaderboard() {
        const profile = getOrCreateWeeklyAnonymousProfile();
        LEADERBOARD.player = profile;

        const label = document.getElementById('leaderboard-player-label');
        if (label) {
            label.textContent = 'Me';
        }
        setMeConnectionState(false);

        leaderboardStatus('Loading leaderboard...', false);
        await loadLeaderboard(LEADERBOARD.countryCode || inferCountryHintFromLocale());
    }

    // Input Handling (Real-time evaluation)
    elInput.addEventListener('input', (e) => {
        if (!STATE.isPlaying) return;

        const val = e.target.value.trim();
        if (val === '') return;

        // Only evaluate if length matches or user presses enter (handled below). 
        // For instant feel, we check string match.
        if (parseInt(val) === STATE.currentAnswer) {
            handleCorrect();
        } else {
            // Check if they over-typed (wrong length) or typed something definitely wrong
            const answerStr = STATE.currentAnswer.toString();
            if (val.length >= answerStr.length && parseInt(val) !== STATE.currentAnswer) {
                handleIncorrect();
            }
        }
    });

    // Handle pressing Enter for quick submission
    elInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const val = parseInt(elInput.value.trim());
            if (val === STATE.currentAnswer) {
                handleCorrect();
            } else {
                handleIncorrect();
            }
        }
    });

    function handleCorrect() {
        playSound('correct');
        STATE.totalQuestions++;
        STATE.correctAnswers++;
        STATE.streak++;

        // Track questions per operation
        STATE.questionsPerOp[STATE.currentOp]++;

        // Track lifetime totals
        STATE.lifetimeStats.answered++;
        STATE.lifetimeStats.solved++;
        STATE.lifetimeStats.answeredPerOp[STATE.currentOp]++;
        STATE.lifetimeStats.solvedPerOp[STATE.currentOp]++;
        saveLifetimeStats();

        // Level-based scoring: operationLevel × 10
        const opKey = STATE.currentOp;
        const points = STATE.levels[opKey] * 10;
        STATE.score += points;

        elScore.textContent = STATE.score;
        elStreak.textContent = STATE.streak;

        // Track level progress per operation and promote after the configured threshold.
        STATE.levelProgress[opKey]++;
        if (STATE.levelProgress[opKey] >= LEVEL_UP_CORRECT_ANSWERS) {
            STATE.levelProgress[opKey] = 0;
            STATE.levels[opKey]++;
            saveLevels();
            showLevelUpToast(opKey, STATE.levels[opKey]);
            renderLandingStats();
        } else {
            saveLevels();
        }

        // Visual Feedback
        elInput.classList.add('glow-success');
        setTimeout(() => elInput.classList.remove('glow-success'), 200);

        updateGameStats();
        generateProblem();
    }

    function handleIncorrect() {
        playSound('incorrect');
        STATE.totalQuestions++;
        STATE.questionsPerOp[STATE.currentOp]++;
        STATE.lifetimeStats.answered++;
        STATE.lifetimeStats.answeredPerOp[STATE.currentOp]++;
        saveLifetimeStats();
        STATE.streak = 0;
        elStreak.textContent = STATE.streak;

        // Visual Feedback
        elInput.classList.add('shake');
        elInput.value = ''; // clear field
        setTimeout(() => elInput.classList.remove('shake'), 400);

        updateGameStats();
    }

    function renderLandingStats() {
        const l = STATE.levels;
        const pb = localStorage.getItem('mathTrainerPB') || 0;
        const levelStr = `${l.add}-${l.sub}-${l.mul}-${l.div}`;
        const overallLevel = getOverallLevel();
        const visualLevel = Math.min(7, Math.max(1, overallLevel));
        const characterScale = 0.94 + ((visualLevel - 1) * 0.04);
        const elPb = document.getElementById('landing-pb');
        const elUiLvl = document.getElementById('ui-levels');
        const charWrap = document.querySelector('.landing-character-wrap');
        const levelPillsWrap = document.getElementById('landing-level-pills');
        if (elPb) elPb.textContent = pb;
        if (elUiLvl) elUiLvl.textContent = levelStr;

        if (charWrap) {
            charWrap.style.setProperty('--character-scale', characterScale.toFixed(2));
        }

        if (levelPillsWrap) {
            const levelsToShow = [];
            const maxLevel = 7;
            for (let lv = visualLevel; lv <= Math.min(maxLevel, visualLevel + 2); lv++) {
                levelsToShow.push(lv);
            }

            levelPillsWrap.innerHTML = levelsToShow
                .map(lv => `<span class="landing-level-pill ${lv === visualLevel ? 'is-active' : ''}" data-level="${lv}">${lv}</span>`)
                .join('');
        }
    }

    /* ─── Mathie Speech Bubble ─────────────────────────────────────
       Shows a typed or instant message in the .mathie-speech bubble
       above the character, then auto-hides after `duration` ms.
    ──────────────────────────────────────────────────────────────── */
    /* ─── Mathie Speech Bubble ─────────────────────────────────────
       opts.typing    : true = char-by-char typewriter effect
       opts.persistent: true = message stays visible until replaced
       opts.duration  : ms to keep visible when not persistent (default 3500)
    ──────────────────────────────────────────────────────────────── */
    function showMathieSpeech(msg, opts) {
        opts = Object.assign({ duration: 3500, typing: true, persistent: false }, opts || {});
        var el = document.getElementById('mathie-speech');
        if (!el) return;

        // Cancel any in-progress timers
        if (el._speakTimer)  clearTimeout(el._speakTimer);
        if (el._typeTimer)   clearTimeout(el._typeTimer);
        el._speakTimer = null;
        el._typeTimer  = null;

        el.innerHTML = '';
        el.classList.add('is-visible');

        if (opts.typing) {
            var cursor = document.createElement('span');
            cursor.className = 'speech-cursor';
            el.appendChild(cursor);

            var i = 0;
            function typeChar() {
                if (i < msg.length) {
                    var ch = msg[i];
                    el.insertBefore(document.createTextNode(ch), cursor);
                    i++;
                    // Pause after spaces (inter-word gap) and punctuation
                    var delay;
                    if (ch === ' ') {
                        delay = 160 + Math.random() * 80;  // word pause
                    } else if (ch === ',' || ch === ';') {
                        delay = 220 + Math.random() * 60;
                    } else if (ch === '!' || ch === '?' || ch === '.') {
                        delay = 300 + Math.random() * 80;
                    } else {
                        delay = 68 + Math.random() * 38;   // per-char base speed
                    }
                    el._typeTimer = setTimeout(typeChar, delay);
                } else {
                    // Typing done: remove cursor, then optionally hide
                    setTimeout(function () { cursor.remove(); }, 480);
                    if (!opts.persistent) {
                        el._speakTimer = setTimeout(function () {
                            el.classList.remove('is-visible');
                        }, opts.duration);
                    }
                }
            }
            typeChar();
        } else {
            el.textContent = msg;
            if (!opts.persistent) {
                el._speakTimer = setTimeout(function () {
                    el.classList.remove('is-visible');
                }, opts.duration);
            }
        }
    }

    /* ─── Preview a level by clicking its pill ─────────────────────
       Temporarily scales the character to the target level,
       shows a motivational tip, then reverts to actual level
       and restores the persistent intro speech.
    ──────────────────────────────────────────────────────────────── */
    function previewCharacterLevel(lv) {
        var charWrap = document.querySelector('.landing-character-wrap');
        if (!charWrap) return;

        var actualLevel = Math.min(7, Math.max(1, getOverallLevel()));
        var previewScale = (0.94 + (lv - 1) * 0.04).toFixed(2);

        charWrap.style.setProperty('--character-scale', previewScale);
        charWrap.classList.add('is-previewing');

        var msg;
        if (lv === actualLevel) {
            msg = "You're at Level " + lv + "! Keep solving to grow Mathie bigger! \u2B50";
        } else if (lv > actualLevel) {
            var diff = lv - actualLevel;
            msg = "Level " + lv + " Mathie! Crush " + diff + " more level" + (diff > 1 ? 's' : '') + " to make Mathie grow this big! \uD83D\uDE80";
        } else {
            msg = "Mathie was Level " + lv + " once. Look how far you've come! \uD83C\uDFC6";
        }

        // Show preview (non-persistent, instant)
        showMathieSpeech(msg, { duration: 99999, typing: false, persistent: false });

        // Revert scale AND restore persistent intro speech after preview
        if (charWrap._previewTimer) clearTimeout(charWrap._previewTimer);
        charWrap._previewTimer = setTimeout(function () {
            var actualScale = (0.94 + (actualLevel - 1) * 0.04).toFixed(2);
            charWrap.style.setProperty('--character-scale', actualScale);
            charWrap.classList.remove('is-previewing');
            // Restore the persistent intro message (instant, no typing)
            showMathieSpeech(
                "Hey There! Can you solve some maths to help me level up and grow? \uD83E\uDDE0",
                { typing: false, persistent: true }
            );
        }, 2600);
    }

    function showLevelUpToast(opKey, newLevel) {
        const opNames = { add: 'Addition', sub: 'Subtraction', mul: 'Multiplication', div: 'Division' };
        const toast = document.getElementById('levelup-toast');
        if (!toast) return;
        document.getElementById('levelup-op-name').textContent = opNames[opKey];
        document.getElementById('levelup-new-level').textContent = newLevel;
        toast.style.display = 'flex';
        clearTimeout(toast._hideTimer);
        toast._hideTimer = setTimeout(() => { toast.style.display = 'none'; }, 4500);
    }

    // Button Listeners
    btnStart.addEventListener('click', () => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        openPregameModal();
    });
    btnReplay.addEventListener('click', () => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        openPregameModal();
    });

    document.getElementById('btn-pregame-start').addEventListener('click', () => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        hidePregameModal();
        startGame();
    });

    document.getElementById('btn-pregame-close').addEventListener('click', hidePregameModal);
    document.getElementById('btn-pregame-cancel').addEventListener('click', hidePregameModal);

    document.getElementById('btn-home-game').addEventListener('click', () => {
        hidePregameModal();
        STATE.isPlaying = false;
        clearInterval(STATE.interval);
        timerContainer.style.display = 'none';
        document.getElementById('num-keyboard').style.display = 'none';
        switchView('view-landing');
        renderLandingStats();
    });

    document.getElementById('btn-home-result').addEventListener('click', () => {
        hidePregameModal();
        switchView('view-landing');
        renderLandingStats();
    });

    /* =========================================
       4. SCORE HISTORY  (removed)
       ========================================= */

    function renderMilestoneBadges(bestPB) {
        const milestones = [
            { score: 100,  icon: 'fa-medal',  name: 'Bronze',  color: '#cd7f32' },
            { score: 200,  icon: 'fa-medal',  name: 'Silver',  color: '#c0c0c0' },
            { score: 500,  icon: 'fa-trophy', name: 'Gold',    color: '#ffd700' },
            { score: 1000, icon: 'fa-gem',    name: 'Diamond', color: '#00f3ff' },
        ];
        const container = document.getElementById('milestone-badges');
        if (!container) return;
        container.innerHTML = milestones.map(m => {
            const unlocked = bestPB >= m.score;
            const borderStyle = unlocked ? `border:1px solid ${m.color};` : '';
            const glowStyle   = unlocked ? `box-shadow:0 0 14px ${m.color}66;` : '';
            const iconStyle   = unlocked ? `color:${m.color};filter:drop-shadow(0 0 6px ${m.color});` : '';
            return `<div class="milestone-badge ${unlocked ? 'unlocked' : 'locked'}" style="${borderStyle}${glowStyle}">
                        <div class="mb-icon" style="${iconStyle}"><i class="fas ${m.icon}"></i></div>
                        <div class="mb-score">${m.score}</div>
                        <div class="mb-name">${m.name}</div>
                        ${!unlocked ? '<div class="mb-lock"><i class="fas fa-lock"></i></div>' : ''}
                    </div>`;
        }).join('');
    }

    function renderSolvedMilestoneBadges(totalSolved) {
        const milestones = [
            { score: 100,  icon: 'fa-seedling', name: 'Starter', color: '#8bc34a' },
            { score: 200,  icon: 'fa-rocket',   name: 'Rising',  color: '#4cafef' },
            { score: 500,  icon: 'fa-bolt',     name: 'Swift',   color: '#f4c542' },
            { score: 1000, icon: 'fa-crown',    name: 'Master',  color: '#ff8a65' },
        ];

        const container = document.getElementById('solved-milestone-badges');
        if (!container) return;

        container.innerHTML = milestones.map(m => {
            const unlocked = totalSolved >= m.score;
            const borderStyle = unlocked ? `border:1px solid ${m.color};` : '';
            const glowStyle = unlocked ? `box-shadow:0 0 14px ${m.color}66;` : '';
            const iconStyle = unlocked ? `color:${m.color};filter:drop-shadow(0 0 6px ${m.color});` : '';
            return `<div class="milestone-badge ${unlocked ? 'unlocked' : 'locked'}" style="${borderStyle}${glowStyle}">
                        <div class="mb-icon" style="${iconStyle}"><i class="fas ${m.icon}"></i></div>
                        <div class="mb-score">${m.score}</div>
                        <div class="mb-name">${m.name}</div>
                        ${!unlocked ? '<div class="mb-lock"><i class="fas fa-lock"></i></div>' : ''}
                    </div>`;
        }).join('');
    }

    /* =========================================
       5. SHARING FUNCTIONALITY (html2canvas)
       ========================================= */

    async function renderShareCanvas() {
        const resultsSection = document.getElementById('view-results');
        const resultsCard = document.getElementById('results-card');
        if (!resultsSection || !resultsCard) return null;

        let clone = null;
        try {
            // Clone the full results hierarchy so ancestor styles stay intact in the screenshot.
            clone = resultsSection.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.top = '-9999px';
            clone.style.left = '-9999px';
            clone.style.width = resultsSection.offsetWidth + 'px';
            clone.style.height = 'auto';
            clone.style.maxHeight = 'none';
            clone.style.overflow = 'visible';
            clone.style.overflowY = 'visible';
            clone.style.border = 'none';
            clone.style.minHeight = 'auto';
            clone.style.display = 'block';

            const cloneCard = clone.querySelector('#results-card');
            if (cloneCard) {
                cloneCard.style.maxHeight = 'none';
                cloneCard.style.height = 'auto';
                cloneCard.style.overflow = 'visible';
                cloneCard.style.overflowY = 'visible';
            }

            document.body.appendChild(clone);

            const captureTarget = clone.querySelector('#results-card') || clone;

            return await html2canvas(captureTarget, {
                backgroundColor: '#1a0b2e',
                scale: 2,
                useCORS: true,
                windowHeight: captureTarget.scrollHeight
            });
        } catch (err) {
            console.error('Error rendering share canvas:', err);
            return null;
        } finally {
            if (clone && document.body.contains(clone)) {
                document.body.removeChild(clone);
            }
        }
    }

    async function generateShareImage() {
        const canvas = await renderShareCanvas();
        if (!canvas) return null;
        return canvas.toDataURL('image/jpeg', 0.92);
    }

    async function generateShareBlob() {
        const canvas = await renderShareCanvas();
        if (!canvas) return null;

        return await new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob || null), 'image/png');
        });
    }

    function buildShareMessage() {
        const score = document.getElementById('final-score')?.textContent?.trim() || String(STATE.score || 0);
        const qpm = document.getElementById('final-qpm')?.textContent?.trim() || String(STATE.totalQuestions || 0);
        const accuracy = document.getElementById('final-accuracy')?.textContent?.trim() || '0';
        return `I scored ${score} on MathTrainer. ${qpm} questions, ${accuracy}% accuracy. Can you beat my score? Play now: ${window.location.origin}`;
    }

    async function shareWithWebApi({ title, text, imageBlob }) {
        if (!navigator.share) return 'failed';

        try {
            if (imageBlob) {
                const file = new File([imageBlob], `MathTrainer_Score_${Date.now()}.png`, { type: 'image/png' });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({ title, text, files: [file] });
                    return 'shared';
                }
            }

            await navigator.share({ title, text });
            return 'shared';
        } catch (err) {
            if (err && err.name === 'AbortError') return 'cancelled';
            console.log('Share failed:', err);
            return 'failed';
        }
    }

    function fallbackWhatsAppText(text) {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    }

    async function copyShareText(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch (err) {
            console.log('Clipboard copy failed:', err);
        }
        return false;
    }

    async function shareScore(platform) {
        const shareText = buildShareMessage();
        const shareTitle = 'MathTrainer Score';

        if (platform === 'whatsapp') {
            const imageBlob = await generateShareBlob();
            const shareState = await shareWithWebApi({ title: shareTitle, text: shareText, imageBlob });
            if (shareState === 'shared' || shareState === 'cancelled') return;
            fallbackWhatsAppText(shareText);
            return;
        }

        if (platform === 'native') {
            const imageBlob = await generateShareBlob();
            const shareState = await shareWithWebApi({ title: shareTitle, text: shareText, imageBlob });
            if (shareState === 'shared' || shareState === 'cancelled') return;

            if (await copyShareText(shareText)) return;
            const imageDataUrl = await generateShareImage();
            if (imageDataUrl) triggerDownload(imageDataUrl);
            return;
        }

        else if (platform === 'download') {
            const imageDataUrl = await generateShareImage();
            if (imageDataUrl) triggerDownload(imageDataUrl);
        }
    }

    function triggerDownload(dataUrl) {
        const link = document.createElement('a');
        link.download = 'MathTrainer_Score.jpg';
        link.href = dataUrl;
        link.click();
    }

    document.getElementById('btn-share-wa').addEventListener('click', () => shareScore('whatsapp'));
    document.getElementById('btn-share-download').addEventListener('click', () => shareScore('download'));
    document.getElementById('btn-share-native').addEventListener('click', () => shareScore('native'));

    document.querySelectorAll('[data-leaderboard-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-leaderboard-tab') || 'global';
            showLeaderboardTab(tab);
        });
    });

    // Prevent zoom on double tap (mobile)
    document.addEventListener('dblclick', function (event) {
        event.preventDefault();
    }, { passive: false });

    /* =========================================
       6. CUSTOM NUMBER KEYBOARD LOGIC
       ========================================= */
    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
    }

    document.getElementById('num-keyboard').addEventListener('click', (e) => {
        const btn = e.target.closest('.key-btn');
        if (!btn || !STATE.isPlaying) return;

        const key = btn.dataset.key;

        if (key === 'backspace') {
            elInput.value = elInput.value.slice(0, -1);
        } else if (key === 'clear') {
            elInput.value = '';
        } else {
            if (elInput.value.length >= 5) return;
            elInput.value += key;
        }

        // Trigger evaluation after key press
        const val = elInput.value;
        if (val === '') return;
        const answerStr = STATE.currentAnswer.toString();
        if (parseInt(val) === STATE.currentAnswer) {
            handleCorrect();
        } else if (val.length >= answerStr.length && parseInt(val) !== STATE.currentAnswer) {
            handleIncorrect();
        }
    });

    // Show history on page load if available
    renderLandingStats();
    renderSolvedMilestoneBadges(STATE.lifetimeStats.solved);
    updateResultLifetimeStats();
    initializeLeaderboard();

    // ── Level-pill click delegation (preview character at any level) ──
    var levelsDiv = document.getElementById('landing-character-levels');
    if (levelsDiv) {
        levelsDiv.addEventListener('click', function (ev) {
            var pill = ev.target.closest('.landing-level-pill:not(.landing-level-pill-best)');
            if (!pill) return;
            var lv = parseInt(pill.dataset.level, 10);
            if (!lv) return;
            previewCharacterLevel(lv);
        });
    }

    // ── Mathie intro greeting (fires once after loader is dismissed) ─
    document.addEventListener('mathtrainer:ready', function onMathieReady() {
        document.removeEventListener('mathtrainer:ready', onMathieReady);
        setTimeout(function () {
            showMathieSpeech(
                "Hey There! Can you solve some maths to help me level up and grow? \uD83E\uDDE0",
                { typing: true, persistent: true }
            );

            // After typing finishes, pulse the non-active pills once
            var approxTypingMs = "Hey There! Can you solve some maths to help me level up and grow? \uD83E\uDDE0".length * 110 + 500;
            setTimeout(function () {
                var pills = document.querySelectorAll('#landing-level-pills .landing-level-pill:not(.is-active)');
                pills.forEach(function (p) { p.classList.add('pill-hint'); });
                setTimeout(function () {
                    pills.forEach(function (p) { p.classList.remove('pill-hint'); });
                }, 2200);
            }, approxTypingMs);
        }, 350);
    });

    // Dismiss tap hint on first pill click
    var levelsDiv2 = document.getElementById('landing-character-levels');
    if (levelsDiv2) {
        levelsDiv2.addEventListener('click', function dismissHint() {
            var hint = document.getElementById('pill-tap-hint');
            if (hint) hint.classList.add('is-hidden');
            levelsDiv2.removeEventListener('click', dismissHint);
        }, { capture: true });
    }

    // Reveal landing character panel on scroll for mobile/tablet layout.
    var landingCharacterCol = document.querySelector('.landing-character-col');
    var landingRevealObserver = null;

    function setupLandingCharacterReveal() {
        if (!landingCharacterCol) return;

        var mobileLayout = window.matchMedia('(max-width: 991.98px)').matches;

        if (!mobileLayout) {
            if (landingRevealObserver) {
                landingRevealObserver.disconnect();
                landingRevealObserver = null;
            }
            landingCharacterCol.classList.add('is-revealed');
            return;
        }

        landingCharacterCol.classList.remove('is-revealed');

        if (landingRevealObserver) landingRevealObserver.disconnect();
        landingRevealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                landingCharacterCol.classList.add('is-revealed');
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.24, rootMargin: '0px 0px -8% 0px' });

        landingRevealObserver.observe(landingCharacterCol);
    }

    setupLandingCharacterReveal();
    window.addEventListener('resize', setupLandingCharacterReveal);

    // Hide bottom mobile flash when footer crosses into viewport.
    var mobileScrollFlash = document.getElementById('mobile-scroll-flash');
    var siteFooter = document.querySelector('#ui-layer footer');
    var footerFlashObserver = null;

    function setupFooterFlashOverlapGuard() {
        if (!mobileScrollFlash || !siteFooter) return;

        var mobileLayout = window.matchMedia('(max-width: 991.98px)').matches;
        if (!mobileLayout) {
            mobileScrollFlash.classList.remove('is-hidden-near-footer');
            if (footerFlashObserver) {
                footerFlashObserver.disconnect();
                footerFlashObserver = null;
            }
            return;
        }

        if (footerFlashObserver) footerFlashObserver.disconnect();
        footerFlashObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    mobileScrollFlash.classList.add('is-hidden-near-footer');
                } else {
                    mobileScrollFlash.classList.remove('is-hidden-near-footer');
                }
            });
        }, { threshold: 0.01 });

        footerFlashObserver.observe(siteFooter);
    }

    setupFooterFlashOverlapGuard();
    window.addEventListener('resize', setupFooterFlashOverlapGuard);

});