
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
                this.mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
                this.mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
            });

            window.addEventListener('resize', () => this.handleResize());
            this.animate();
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
            const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true, opacity: 0.8 });
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

            // Camera parallax
            this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
            this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
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

    /* ---- Adaptive Difficulty: Level → Digit Config ---- */
    const LEVEL_CONFIGS = [
        null,           // index 0 unused (levels are 1-based)
        { d1: 1, d2: 1 }, // Level 1: 1-digit op 1-digit
        { d1: 1, d2: 2 }, // Level 2: 1-digit op 2-digit
        { d1: 2, d2: 2 }, // Level 3: 2-digit op 2-digit
        { d1: 1, d2: 3 }, // Level 4: 1-digit op 3-digit
        { d1: 2, d2: 3 }, // Level 5: 2-digit op 3-digit
        { d1: 3, d2: 3 }, // Level 6: 3-digit op 3-digit
        // Level 7+: 3-number questions (threeNum flag)
    ];

    function getRange(d) {
        if (d === 1) return [1, 9];
        if (d === 2) return [10, 99];
        return [100, 999];
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

    function saveLevels() {
        localStorage.setItem('mathTrainerLevels', JSON.stringify(STATE.levels));
        localStorage.setItem('mathTrainerLevelProgress', JSON.stringify(STATE.levelProgress));
    }

    const STATE = {
        score: 0,
        streak: 0,
        timeLeft: 60,
        totalQuestions: 0,
        correctAnswers: 0,
        currentAnswer: 0,
        currentOp: 'add',
        interval: null,
        isPlaying: false,
        levels: loadLevels(),
        levelProgress: loadLevelProgress()
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

    // View Transition Logic
    function switchView(viewId) {
        document.querySelectorAll('.view-section').forEach(el => {
            el.classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');

        // Hide footer during gameplay to maximize screen space
        if (viewId === 'view-game') {
            footer.style.display = 'none';
        } else {
            footer.style.display = 'block';
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
        const cfgIdx = Math.min(level, 6);
        const cfg = LEVEL_CONFIGS[cfgIdx];
        const threeNum = level >= 7;

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
                n3 = getRandomInt(2, 9); // keep 3rd factor small for mental math sanity
                answer = n1 * n2 * n3;
                elProblem.textContent = `${n1} × ${n2} × ${n3}`;
            } else {
                answer = n1 * n2;
                elProblem.textContent = `${n1} × ${n2}`;
            }

        } else { // ÷ — always generates clean integer answers
            // Level-specific division config: [answerDigits, divisorMin, divisorMax]
            const divMaps = [
                null,
                { ad: 1, dMin: 2, dMax: 9 },    // L1: answer 1d ÷ 1d
                { ad: 2, dMin: 2, dMax: 9 },    // L2: answer 2d ÷ 1d
                { ad: 2, dMin: 10, dMax: 12 },  // L3: answer 2d ÷ small 2d
                { ad: 3, dMin: 2, dMax: 9 },    // L4: answer 3d ÷ 1d
                { ad: 3, dMin: 10, dMax: 15 },  // L5: answer 3d ÷ mid 2d
                { ad: 3, dMin: 10, dMax: 20 },  // L6+: answer 3d ÷ 2d
            ];
            const dmap = divMaps[Math.min(level, 6)];
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
        // Reset State
        STATE.score = 0;
        STATE.streak = 0;
        STATE.timeLeft = 60;
        STATE.totalQuestions = 0;
        STATE.correctAnswers = 0;
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
        generateProblem();

        // Start Timer
        clearInterval(STATE.interval);
        STATE.interval = setInterval(gameTick, 1000);
    }

    function gameTick() {
        if (!STATE.isPlaying) return;

        STATE.timeLeft--;
        const percentage = (STATE.timeLeft / 60) * 100;
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

        // Save to history & render
        saveScoreToHistory(STATE.score, accuracy);
        renderScoreHistory();

        // Personal Best Logic
        const currentPB = localStorage.getItem('mathTrainerPB') || 0;
        const badge = document.getElementById('pb-badge');

        if (STATE.score > currentPB) {
            localStorage.setItem('mathTrainerPB', STATE.score);
            badge.style.display = 'block';
            // Confetti!
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#d4af37', '#00f3ff', '#ffffff']
            });
        } else {
            badge.style.display = 'none';
        }

        switchView('view-results');
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

        // Level-based scoring: operationLevel × 10
        const opKey = STATE.currentOp;
        const points = STATE.levels[opKey] * 10;
        STATE.score += points;

        elScore.textContent = STATE.score;
        elStreak.textContent = STATE.streak;

        // Track level progress — level up after 10 correct per op per level
        STATE.levelProgress[opKey]++;
        if (STATE.levelProgress[opKey] >= 10) {
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

        generateProblem();
    }

    function handleIncorrect() {
        playSound('incorrect');
        STATE.totalQuestions++;
        STATE.streak = 0;
        elStreak.textContent = STATE.streak;

        // Visual Feedback
        elInput.classList.add('shake');
        elInput.value = ''; // clear field
        setTimeout(() => elInput.classList.remove('shake'), 400);
    }

    function renderLandingStats() {
        const l = STATE.levels;
        const pb = localStorage.getItem('mathTrainerPB') || 0;
        const elLvl = document.getElementById('landing-levels');
        const elPb = document.getElementById('landing-pb');
        if (elLvl) elLvl.textContent = `${l.add}-${l.sub}-${l.mul}-${l.div}`;
        if (elPb) elPb.textContent = pb;
    }

    function showLevelUpToast(opKey, newLevel) {
        const opNames = { add: 'Addition', sub: 'Subtraction', mul: 'Multiplication', div: 'Division' };
        const toast = document.getElementById('levelup-toast');
        if (!toast) return;
        document.getElementById('levelup-op-name').textContent = opNames[opKey];
        document.getElementById('levelup-new-level').textContent = newLevel;
        toast.style.display = 'flex';
        clearTimeout(toast._hideTimer);
        toast._hideTimer = setTimeout(() => { toast.style.display = 'none'; }, 2500);
    }

    // Button Listeners
    btnStart.addEventListener('click', () => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const visited = localStorage.getItem('mathTrainerHowItWorksVisited');
        if (!visited) {
            window.location.href = 'howitworks.html?from=start';
        } else {
            startGame();
        }
    });
    btnReplay.addEventListener('click', startGame);

    /* =========================================
       4. SCORE HISTORY
       ========================================= */
    function loadScoreHistory() {
        return JSON.parse(localStorage.getItem('mathTrainerHistory') || '[]');
    }

    function saveScoreToHistory(score, accuracy) {
        const history = loadScoreHistory();
        history.unshift({ score, accuracy, date: new Date().toLocaleDateString() });
        if (history.length > 5) history.length = 5;
        localStorage.setItem('mathTrainerHistory', JSON.stringify(history));
    }

    function renderScoreHistory() {
        const history = loadScoreHistory();
        const section = document.getElementById('score-history-section');
        const list = document.getElementById('score-history-list');
        if (history.length === 0) { section.style.display = 'none'; return; }
        section.style.display = 'block';

        const scores = history.map(e => e.score);
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);

        list.innerHTML = history.map((entry, i) => {
            let cls = '';
            let label = `#${i + 1}`;
            if (i === 0) { cls = 'latest'; label = 'Latest'; }
            else if (entry.score === maxScore) { cls = 'best'; label = 'Best'; }
            else if (entry.score === minScore && entry.score < 100) { cls = 'worst'; label = 'Worst'; }
            return `<div class="score-pill ${cls}">
                        <span class="pill-label">${label}</span>
                        <span class="pill-score">${entry.score}</span>
                        <span class="pill-accuracy">${entry.accuracy}%</span>
                    </div>`;
        }).join('');
    }

    /* =========================================
       5. SHARING FUNCTIONALITY (html2canvas)
       ========================================= */

    async function generateShareImage() {
        const resultsCard = document.getElementById('results-card');
        try {
            const canvas = await html2canvas(resultsCard, {
                backgroundColor: '#1a0b2e',
                scale: 2,
                useCORS: true
            });
            return canvas.toDataURL('image/jpeg', 0.92);
        } catch (err) {
            console.error("Error generating image:", err);
            return null;
        }
    }

    async function shareScore(platform) {
        const imageDataUrl = await generateShareImage();

        if (platform === 'native' && navigator.share) {
            try {
                if (imageDataUrl) {
                    const res = await fetch(imageDataUrl);
                    const blob = await res.blob();
                    const file = new File([blob], 'mathtrainer-score.jpg', { type: 'image/jpeg' });
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({ title: 'MathTrainer Score', files: [file] });
                        return;
                    }
                }
                if (imageDataUrl) triggerDownload(imageDataUrl);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        }
        else if (platform === 'whatsapp') {
            // On mobile, use Web Share API so OS share sheet opens (WhatsApp listed there)
            if (imageDataUrl && navigator.share) {
                try {
                    const res = await fetch(imageDataUrl);
                    const blob = await res.blob();
                    const file = new File([blob], 'mathtrainer-score.jpg', { type: 'image/jpeg' });
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({ title: 'MathTrainer Score', files: [file] });
                        return;
                    }
                } catch (err) {
                    console.log('WhatsApp share error:', err);
                }
            }
            // Desktop fallback: download image + open WhatsApp web with text
            if (imageDataUrl) triggerDownload(imageDataUrl);
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out my MathTrainer scorecard! 🚀')}`);
        }
        else if (platform === 'download') {
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
    renderScoreHistory();
    renderLandingStats();

    // Auto-start if redirected back from howitworks.html via the Start button
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autostart') === '1') {
        const loaderEl = document.getElementById('loader-screen');
        if (loaderEl) {
            const loaderWatcher = new MutationObserver(() => {
                if (!document.getElementById('loader-screen')) {
                    loaderWatcher.disconnect();
                    setTimeout(() => {
                        if (audioCtx.state === 'suspended') audioCtx.resume();
                        startGame();
                    }, 300);
                }
            });
            loaderWatcher.observe(document.body, { childList: true });
        } else {
            startGame();
        }
    }
});