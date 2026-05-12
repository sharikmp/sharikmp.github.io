<?php
/**
 * public_html/howitworks.php
 * "How It Works" onboarding/rules page.
 */
require_once __DIR__ . '/../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../includes');

$page = [
    'title'       => 'How It Works | MathTrainer',
    'description' => 'Learn how MathTrainer works — the rules, adaptive level system, scoring, and all four operations explained. Start training smarter.',
    'canonical'   => url('howitworks.php'),
    'og_title'    => 'How It Works | MathTrainer',
    'og_desc'     => 'Learn how MathTrainer works — rules, levels, scoring and operations explained.',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <style>
        :root {
            --primary-accent: #d4af37;
            --secondary-accent: #f9d77e;
            --glass-bg: rgba(20, 20, 20, 0.65);
            --glass-border: rgba(212, 175, 55, 0.2);
            --neon-cyan: #00f3ff;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0; padding: 0;
            background: radial-gradient(circle at bottom, #1a0b2e 0%, #000000 100%);
            color: #fff; font-family: 'Inter', sans-serif;
            overflow-x: hidden; min-height: 100vh;
        }
        h1, h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; }
        #bg-canvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; pointer-events: none; }
        #hiw-content { position: relative; z-index: 10; padding: 1.5rem 1rem 5rem; }
        .hiw-nav { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0 1.5rem; }
        .hiw-nav .brand {
            font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 800;
            color: var(--primary-accent); text-shadow: 0 0 12px rgba(212,175,55,0.5);
            text-decoration: none; letter-spacing: 2px;
        }
        .btn-close-hiw {
            background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15);
            color: rgba(255,255,255,0.55); border-radius: 50%; width: 36px; height: 36px;
            display: flex; align-items: center; justify-content: center;
            text-decoration: none; transition: all 0.2s; font-size: 0.9rem;
        }
        .btn-close-hiw:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .hiw-card {
            background: var(--glass-bg); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--glass-border); border-radius: 20px; padding: 1.5rem; margin-bottom: 1.1rem;
        }
        .section-badge {
            display: inline-flex; align-items: center; gap: 7px;
            background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.28);
            border-radius: 50px; padding: 4px 13px; font-size: 0.72rem; font-weight: 700;
            text-transform: uppercase; letter-spacing: 1.4px; color: var(--primary-accent); margin-bottom: 1rem;
        }
        .rule-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .rule-item:last-child { border-bottom: none; }
        .rule-icon {
            width: 34px; height: 34px; border-radius: 10px; background: rgba(212,175,55,0.1);
            border: 1px solid rgba(212,175,55,0.22); display: flex; align-items: center;
            justify-content: center; flex-shrink: 0; color: var(--primary-accent); font-size: 0.82rem;
        }
        .rule-text { font-size: 0.88rem; color: rgba(255,255,255,0.75); line-height: 1.5; padding-top: 6px; }
        .rule-text strong { color: #fff; }
        .level-display-demo {
            font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem,8vw,2.8rem); font-weight: 800;
            color: var(--primary-accent); text-shadow: 0 0 20px rgba(212,175,55,0.5);
            letter-spacing: 6px; text-align: center; padding: 0.75rem 0 0.25rem;
        }
        .level-display-labels { display: flex; justify-content: center; gap: 0; font-size: 0.68rem; color: rgba(255,255,255,0.38); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; }
        .level-display-labels span { width: 4ch; text-align: center; }
        .level-display-labels .sep { width: 2ch; text-align: center; color: rgba(212,175,55,0.25); }
        .level-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 9px; margin-top: 1.1rem; }
        .level-row { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 12px; padding: 9px 12px; display: flex; align-items: center; gap: 10px; }
        .lv-badge { background: var(--primary-accent); color: #000; font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 0.75rem; border-radius: 7px; padding: 2px 8px; white-space: nowrap; flex-shrink: 0; }
        .lv-badge.cyan { background: var(--neon-cyan); }
        .lv-desc { font-size: 0.8rem; color: rgba(255,255,255,0.7); line-height: 1.3; }
        .prog-wrap { margin-top: 0.75rem; }
        .prog-label { font-size: 0.72rem; color: rgba(255,255,255,0.38); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
        .prog-bar { height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; }
        .prog-fill { height: 100%; background: var(--neon-cyan); border-radius: 4px; box-shadow: 0 0 8px rgba(0,243,255,0.4); }
        .score-example { background: rgba(0,243,255,0.06); border: 1px solid rgba(0,243,255,0.18); border-radius: 12px; padding: 11px 15px; font-size: 0.86rem; color: rgba(255,255,255,0.78); margin-top: 8px; }
        .score-example strong { color: var(--neon-cyan); }
        .op-tag { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.13); border-radius: 10px; padding: 7px 13px; font-size: 0.88rem; font-weight: 600; color: #fff; margin: 4px; }
        .op-tag i { color: var(--primary-accent); }
        .btn-gold-hiw {
            background: linear-gradient(135deg, var(--primary-accent), #b8901b); color: #000;
            font-family: 'Space Grotesk', sans-serif; font-weight: 800; border: none;
            border-radius: 50px; padding: 0.9rem 2.5rem; text-transform: uppercase;
            letter-spacing: 2px; font-size: 1rem; box-shadow: 0 0 20px rgba(212,175,55,0.4);
            transition: all 0.3s ease; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-gold-hiw:hover { transform: scale(1.05); box-shadow: 0 0 30px rgba(212,175,55,0.8); color: #000; }
        .btn-outline-hiw {
            background: transparent; color: rgba(255,255,255,0.7); font-weight: 600;
            border: 1px solid rgba(255,255,255,0.22); border-radius: 50px; padding: 0.85rem 2rem;
            font-size: 0.95rem; transition: all 0.3s ease; text-decoration: none;
            display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-outline-hiw:hover { border-color: rgba(255,255,255,0.45); color: #fff; background: rgba(255,255,255,0.05); }
        @media (max-width: 400px) { .level-grid { grid-template-columns: 1fr; } .btn-gold-hiw { padding: 0.8rem 1.75rem; font-size: 0.92rem; } }
    </style>
</head>
<body>

<canvas id="bg-canvas"></canvas>

<div id="hiw-content">
    <div class="container" style="max-width:580px;">

        <!-- Nav -->
        <nav class="hiw-nav">
            <a href="<?= url() ?>" class="brand"><i class="fas fa-bolt"></i> MATH TRAINER</a>
            <a href="<?= url() ?>" class="btn-close-hiw" title="Back"><i class="fas fa-xmark"></i></a>
        </nav>

        <!-- Hero -->
        <div class="text-center mb-4">
            <h1 style="font-size:clamp(1.9rem,6vw,2.8rem); color:var(--primary-accent); text-shadow:0 0 20px rgba(212,175,55,0.5); margin-bottom:0.4rem;">
                How It Works
            </h1>
            <p style="color:rgba(255,255,255,0.45); font-size:0.9rem; margin:0;">
                Everything you need to know before you play
            </p>
        </div>

        <!-- Operations -->
        <div class="hiw-card">
            <div class="section-badge"><i class="fas fa-calculator"></i> Operations</div>
            <div class="d-flex flex-wrap justify-content-center mt-1">
                <span class="op-tag"><i class="fas fa-plus"></i> Addition</span>
                <span class="op-tag"><i class="fas fa-minus"></i> Subtraction</span>
                <span class="op-tag"><i class="fas fa-xmark" style="font-size:0.8rem;"></i> Multiply</span>
                <span class="op-tag"><i class="fas fa-divide"></i> Division</span>
            </div>
            <p style="font-size:0.78rem; color:rgba(255,255,255,0.38); margin-top:0.9rem; margin-bottom:0;">
                Each question is drawn randomly from all four operations during a session.
            </p>
        </div>

        <!-- The Game -->
        <div class="hiw-card">
            <div class="section-badge"><i class="fas fa-gamepad"></i> The Game</div>
            <div class="rule-item">
                <div class="rule-icon"><i class="fas fa-stopwatch"></i></div>
                <div class="rule-text"><strong>60 seconds</strong> on the clock. Answer as many questions as you can before time runs out.</div>
            </div>
            <div class="rule-item">
                <div class="rule-icon"><i class="fas fa-bolt"></i></div>
                <div class="rule-text">Your answer is <strong>checked instantly</strong> as you type — no submit button needed.</div>
            </div>
            <div class="rule-item">
                <div class="rule-icon"><i class="fas fa-shuffle"></i></div>
                <div class="rule-text">Questions cycle through <strong>all four operations</strong> randomly every round.</div>
            </div>
            <div class="rule-item">
                <div class="rule-icon"><i class="fas fa-divide"></i></div>
                <div class="rule-text">All division answers are <strong>clean integers</strong> — no decimals, ever.</div>
            </div>
        </div>

        <!-- Your Levels -->
        <div class="hiw-card">
            <div class="section-badge"><i class="fas fa-layer-group"></i> Your Levels</div>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.65); margin-bottom:0.5rem;">
                Each operation has its <strong style="color:#fff;">own independent level</strong>. Your levels are displayed as:
            </p>
            <div class="level-display-demo" id="demo-levels">2-1-3-1</div>
            <div class="level-display-labels">
                <span>Add</span><span class="sep">-</span>
                <span>Sub</span><span class="sep">-</span>
                <span>Mul</span><span class="sep">-</span>
                <span>Div</span>
            </div>
            <p style="font-size:0.8rem; color:rgba(255,255,255,0.4); margin:0.5rem 0 0;">
                Levels persist permanently across sessions. They never reset.
            </p>
        </div>

        <!-- Level Up -->
        <div class="hiw-card">
            <div class="section-badge"><i class="fas fa-arrow-trend-up"></i> Level Up</div>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.65); margin-bottom:0.9rem;">
                Answer <strong style="color:#fff;">10 correct questions</strong> for any operation to level it up.
            </p>
            <div class="prog-label">Addition Progress — example (7 / 10)</div>
            <div class="prog-bar"><div class="prog-fill" style="width:70%;"></div></div>
            <div class="level-grid">
                <div class="level-row"><span class="lv-badge">Lv 1</span><span class="lv-desc">1-digit op 1-digit</span></div>
                <div class="level-row"><span class="lv-badge">Lv 2</span><span class="lv-desc">1-digit op 2-digit</span></div>
                <div class="level-row"><span class="lv-badge">Lv 3</span><span class="lv-desc">2-digit op 2-digit</span></div>
                <div class="level-row"><span class="lv-badge">Lv 4</span><span class="lv-desc">1-digit op 3-digit</span></div>
                <div class="level-row"><span class="lv-badge">Lv 5</span><span class="lv-desc">2-digit op 3-digit</span></div>
                <div class="level-row"><span class="lv-badge">Lv 6</span><span class="lv-desc">3-digit op 3-digit</span></div>
                <div class="level-row" style="grid-column:1/-1;">
                    <span class="lv-badge cyan">Lv 7+</span>
                    <span class="lv-desc">3-number questions unlock — the real challenge begins!</span>
                </div>
            </div>
        </div>

        <!-- Scoring -->
        <div class="hiw-card">
            <div class="section-badge"><i class="fas fa-star"></i> Scoring</div>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.65); margin-bottom:0.6rem;">
                Points per correct answer = <strong style="color:#fff;">your level for that operation × 10</strong>
            </p>
            <div class="score-example"><strong>Level 3</strong> on Addition → each correct add = <strong>30 pts</strong></div>
            <div class="score-example"><strong>Level 1</strong> on Division → each correct division = <strong>10 pts</strong></div>
            <p style="font-size:0.78rem; color:rgba(255,255,255,0.38); margin-top:0.9rem; margin-bottom:0;">
                Master higher-level operations first — they earn more points per question.
            </p>
        </div>

        <!-- CTA -->
        <div class="text-center mt-4 pb-2 d-flex gap-3 justify-content-center flex-wrap">
            <a href="<?= url() ?>" class="btn-gold-hiw"><i class="fas fa-play"></i> Start Game</a>
            <a href="<?= url() ?>" class="btn-outline-hiw"><i class="fas fa-house"></i> Home</a>
        </div>

    </div>
</div>

<script>
    // Mark page as visited so index.php won't redirect here again
    localStorage.setItem('mathTrainerHowItWorksVisited', 'true');

    // Level demo animation (no Three.js dependency)
    (function () {
        const demos = ['1-1-1-1', '2-1-1-1', '2-2-1-1', '3-2-2-1', '3-2-2-2', '4-3-3-2'];
        let i = 0;
        const el = document.getElementById('demo-levels');
        el.style.transition = 'opacity 0.3s ease';
        setInterval(function () {
            i = (i + 1) % demos.length;
            el.style.opacity = 0;
            setTimeout(function () { el.textContent = demos[i]; el.style.opacity = 1; }, 300);
        }, 2000);
    })();
</script>

<?php
// Galaxy: full (stars + symbols)
require_once PATH_INCLUDES . '/galaxy.php';
?>
</body>
</html>
