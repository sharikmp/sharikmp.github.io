<?php
/**
 * includes/galaxy.php
 * ─────────────────────────────────────────────────────────────
 * Reusable galaxy background script block.
 * Include just before </body> on any page that needs the 3-D star
 * / floating-symbols background.
 * Two modes controlled by $galaxy_mode (set before including):
 *   'full'    — stars + floating math symbols  (default)
 *   'minimal' — stars only  (lighter, used on contact page)
 *
 * On secondary pages Three.js is loaded lazily via
 * requestIdleCallback so it never blocks page rendering.
 * ─────────────────────────────────────────────────────────────
 */

$galaxy_mode = $galaxy_mode ?? 'full';
$three_url   = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
?>
<script>
(function () {
    'use strict';

    function initGalaxy() {
        const s = document.createElement('script');
        s.src = <?= json_encode($three_url) ?>;
        s.onload = function () {
            <?php if ($galaxy_mode === 'full'): ?>
            initFullGalaxy();
            <?php else: ?>
            initMinimalGalaxy();
            <?php endif; ?>
        };
        document.head.appendChild(s);
    }

    /* Stars + floating math symbols */
    function initFullGalaxy() {
        const canvas   = document.getElementById('bg-canvas');
        const scene    = new THREE.Scene();
        const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 30;

        // Stars
        const geo   = new THREE.BufferGeometry();
        const verts = [];
        for (let i = 0; i < 800; i++) {
            verts.push(
                THREE.MathUtils.randFloatSpread(200),
                THREE.MathUtils.randFloatSpread(200),
                THREE.MathUtils.randFloatSpread(200)
            );
        }
        geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        const stars = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.4, transparent: true, opacity: 0.7 }));
        scene.add(stars);

        // Floating math symbols
        const symbols = ['+', '-', '×', '÷', '=', 'π'];
        const colors  = ['#00f3ff', '#d4af37', '#bfa3ff'];
        const sprites = [];
        symbols.forEach(function (sym) {
            for (let j = 0; j < 3; j++) {
                const c   = document.createElement('canvas');
                c.width   = c.height = 128;
                const ctx = c.getContext('2d');
                ctx.font          = 'bold 80px Space Grotesk, sans-serif';
                ctx.fillStyle     = colors[Math.floor(Math.random() * colors.length)];
                ctx.textAlign     = 'center';
                ctx.textBaseline  = 'middle';
                ctx.shadowColor   = ctx.fillStyle;
                ctx.shadowBlur    = 10;
                ctx.fillText(sym, 64, 64);
                const sp = new THREE.Sprite(new THREE.SpriteMaterial({
                    map: new THREE.CanvasTexture(c), transparent: true, opacity: 0.3
                }));
                sp.position.set(
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 40 - 10
                );
                const sz = Math.random() * 2 + 1;
                sp.scale.set(sz, sz, 1);
                sp.userData = { sx: (Math.random() - 0.5) * 0.012, sy: (Math.random() - 0.5) * 0.012 };
                scene.add(sp);
                sprites.push(sp);
            }
        });

        window.addEventListener('resize', onResize);
        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        (function animate() {
            requestAnimationFrame(animate);
            const t = Date.now() * 0.001;
            stars.rotation.y = t * 0.04;
            stars.rotation.x = t * 0.015;
            sprites.forEach(function (sp) {
                sp.position.x += sp.userData.sx;
                sp.position.y += sp.userData.sy;
                if (sp.position.x >  40) sp.position.x = -40;
                if (sp.position.x < -40) sp.position.x =  40;
                if (sp.position.y >  40) sp.position.y = -40;
                if (sp.position.y < -40) sp.position.y =  40;
            });
            renderer.render(scene, camera);
        })();
    }

    /* Stars only */
    function initMinimalGalaxy() {
        const canvas   = document.getElementById('bg-canvas');
        const scene    = new THREE.Scene();
        const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 30;

        const geo   = new THREE.BufferGeometry();
        const verts = [];
        for (let i = 0; i < 800; i++) {
            verts.push(
                THREE.MathUtils.randFloatSpread(200),
                THREE.MathUtils.randFloatSpread(200),
                THREE.MathUtils.randFloatSpread(200)
            );
        }
        geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        const stars = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.4, transparent: true, opacity: 0.7 }));
        scene.add(stars);

        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        (function animate() {
            requestAnimationFrame(animate);
            const t = Date.now() * 0.001;
            stars.rotation.y = t * 0.04;
            stars.rotation.x = t * 0.015;
            renderer.render(scene, camera);
        })();
    }

    // Load Three.js when the browser is idle (non-blocking)
    if ('requestIdleCallback' in window) {
        requestIdleCallback(initGalaxy, { timeout: 1500 });
    } else {
        setTimeout(initGalaxy, 300);
    }
})();
</script>
