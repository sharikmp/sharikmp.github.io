
(function () {
    'use strict';

    var CIRC = 314.159; // 2π × r(50)
    var currentPct = 0;
    var appLoaded = false;
    var loaderDismissed = false;
    var finishing = false;
    var loadStartTime = Date.now();
    var animId = null;
    var starAnimId = null;

    /* ---- Listen for full page load ---- */
    window.addEventListener('load', function () { appLoaded = true; });

    /* ---- Twinkling star canvas ---- */
    function initStars() {
        var canvas = document.getElementById('loader-star-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        var stars = [];
        for (var i = 0; i < 200; i++) {
            stars.push({
                x: Math.random(),
                y: Math.random(),
                r: Math.random() * 1.3 + 0.2,
                phase: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.007 + 0.003
            });
        }

        function drawStars() {
            if (loaderDismissed) return;
            starAnimId = requestAnimationFrame(drawStars);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < stars.length; i++) {
                var s = stars[i];
                s.phase += s.speed;
                var alpha = 0.2 + Math.abs(Math.sin(s.phase)) * 0.8;
                ctx.beginPath();
                ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,' + alpha.toFixed(2) + ')';
                ctx.fill();
            }
        }
        drawStars();
    }

    /* ---- UI updates ---- */
    function setProgress(pct) {
        currentPct = Math.min(Math.max(pct, 0), 100);
        var ring = document.getElementById('loader-ring-progress');
        if (ring) ring.style.strokeDashoffset = CIRC - CIRC * (currentPct / 100);
        var txt = document.getElementById('loader-ring-pct');
        if (txt) txt.textContent = Math.round(currentPct) + '%';
        var fill = document.getElementById('loader-brand-fill');
        if (fill) fill.style.clipPath = 'inset(' + (100 - currentPct).toFixed(1) + '% 0 0 0)';
    }

    function setStatus(msg, type) {
        var el = document.getElementById('loader-status-msg');
        if (!el) return;
        el.textContent = msg;
        el.className = 'loader-status-msg' + (type ? ' ' + type : '');
    }

    /* ---- Dismiss loader & reveal app ---- */
    function hideLoader() {
        loaderDismissed = true;
        if (starAnimId) cancelAnimationFrame(starAnimId);
        var screen = document.getElementById('loader-screen');
        if (screen) {
            screen.classList.add('hidden');
            setTimeout(function () {
                // Restore scroll and force viewport to top before revealing app
                window.scrollTo(0, 0);
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
                if (screen.parentNode) screen.parentNode.removeChild(screen);
                var landing = document.getElementById('view-landing');
                if (landing) landing.classList.add('active');
            }, 680);
        }
    }

    /* ---- Smooth progress animation ---- */
    function animateTo(target, duration, onComplete) {
        if (animId) { cancelAnimationFrame(animId); animId = null; }
        var from = currentPct;
        var startTs = performance.now();
        function step(now) {
            var t = Math.min((now - startTs) / duration, 1);
            var eased = 1 - Math.pow(1 - t, 3);
            setProgress(from + (target - from) * eased);
            if (t < 1) {
                animId = requestAnimationFrame(step);
            } else {
                setProgress(target);
                animId = null;
                if (onComplete) onComplete();
            }
        }
        animId = requestAnimationFrame(step);
    }

    /* ---- Complete & dismiss ---- */
    function completeAndHide() {
        if (finishing) return;
        finishing = true;
        setStatus('Ready!');
        animateTo(100, 420, function () {
            setTimeout(hideLoader, 180);
        });
    }

    /* ---- Main loading flow ---- */
    function startLoader() {
        if (!navigator.onLine) {
            setProgress(0);
            setStatus('No internet connection. Please check your network and reload.', 'error');
            return;
        }

        var target1 = Math.floor(Math.random() * 11) + 70; // 70–80

        setStatus('Loading...');
        animateTo(target1, 950, function () {
            if (appLoaded) {
                completeAndHide();
                return;
            }

            setStatus('Almost ready...');
            var slowTick = setInterval(function () {
                if (finishing) { clearInterval(slowTick); return; }

                if (appLoaded) {
                    clearInterval(slowTick);
                    completeAndHide();
                    return;
                }

                var elapsed = Date.now() - loadStartTime;
                if (elapsed >= 10000) {
                    clearInterval(slowTick);
                    setStatus('This is taking longer than expected. Try refreshing the page.', 'warning');
                    return;
                }

                if (!navigator.onLine) {
                    clearInterval(slowTick);
                    setStatus('Connection lost. Please check your network.', 'error');
                    return;
                }

                if (currentPct < 99 && !finishing) {
                    animateTo(currentPct + 1, 460, null);
                }
            }, 500);
        });
    }

    /* ---- Network offline mid-load ---- */
    window.addEventListener('offline', function () {
        if (!loaderDismissed) setStatus('Connection lost. Please check your network.', 'error');
    });

    /* ---- Lock body scroll while loader is visible ---- */
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    /* ---- Init ---- */
    function init() {
        initStars();
        startLoader();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();