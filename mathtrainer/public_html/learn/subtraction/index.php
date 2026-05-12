<?php
/**
 * public_html/learn/subtraction/index.php
 * Topic: Subtraction — terms, counting back, borrowing/regrouping.
 */
require_once __DIR__ . '/../../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../../includes');

$page = [
    'title'       => 'Learn Subtraction — Borrowing & Column Method | MathTrainer',
    'description' => 'Learn subtraction — minuend, subtrahend, difference, counting back, number bonds and the borrowing (regrouping) method explained clearly.',
    'canonical'   => url('learn/subtraction/'),
    'og_title'    => 'Learn Subtraction | MathTrainer',
    'og_desc'     => 'Master subtraction with counting back, number bonds and the borrowing method. Visual, easy lessons.',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
    <style>
        :root { --primary-accent:#d4af37; --neon-cyan:#00f3ff; --op-color:#ff6478; --glass-bg:rgba(20,20,20,0.65); --glass-border:rgba(255,100,120,0.18); }
        body { margin:0; padding:0; background:radial-gradient(circle at bottom, #1a0b2e 0%, #000000 100%); color:#fff; font-family:'Inter',sans-serif; overflow-x:hidden; min-height:100vh; }
        h1,h2,h3,h4 { font-family:'Space Grotesk',sans-serif; }
        #bg-canvas { position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1; pointer-events:none; }
        #page-content { position:relative; z-index:10; padding:1.5rem 1rem 3rem; }
        .page-nav { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0 1.5rem; }
        .page-nav .brand { font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:800; color:var(--primary-accent); text-shadow:0 0 12px rgba(212,175,55,0.5); text-decoration:none; letter-spacing:2px; }
        .btn-back { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.55); border-radius:50px; padding:6px 16px; font-size:0.82rem; display:inline-flex; align-items:center; gap:6px; text-decoration:none; transition:all 0.2s; }
        .btn-back:hover { background:rgba(255,255,255,0.12); color:#fff; }
        .page-card { background:var(--glass-bg); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid var(--glass-border); border-radius:20px; padding:1.6rem; margin-bottom:1.2rem; }
        .section-badge { display:inline-flex; align-items:center; gap:7px; background:rgba(255,100,120,0.08); border:1px solid rgba(255,100,120,0.28); border-radius:50px; padding:4px 13px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:1.4px; color:var(--op-color); margin-bottom:1rem; }
        .section-badge.gold { background:rgba(212,175,55,0.1); border-color:rgba(212,175,55,0.28); color:var(--primary-accent); }
        .definition-box { background:rgba(255,100,120,0.05); border-left:3px solid var(--op-color); border-radius:0 12px 12px 0; padding:12px 16px; margin:0.8rem 0; font-size:0.88rem; color:rgba(255,255,255,0.82); line-height:1.6; }
        .term-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:0.8rem 0; }
        .term-box { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:12px 10px; text-align:center; }
        .term-label { font-size:0.68rem; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:rgba(255,255,255,0.4); margin-bottom:4px; }
        .term-value { font-family:'Space Grotesk',sans-serif; font-size:1.2rem; font-weight:800; color:var(--op-color); }
        .term-name  { font-size:0.72rem; color:rgba(255,255,255,0.45); margin-top:3px; }
        .strategy-item { display:flex; align-items:flex-start; gap:12px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .strategy-item:last-child { border-bottom:none; }
        .strategy-num { width:32px; height:32px; border-radius:10px; background:rgba(255,100,120,0.1); color:var(--op-color); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:800; flex-shrink:0; }
        .strategy-text strong { display:block; color:#fff; font-size:0.88rem; margin-bottom:3px; }
        .strategy-text span { font-size:0.82rem; color:rgba(255,255,255,0.5); line-height:1.5; }
        .column-sub { display:inline-grid; grid-template-columns:repeat(4,36px); gap:4px; font-family:'Space Grotesk',sans-serif; font-size:1rem; font-weight:700; margin:0.8rem auto; }
        .cs-cell { height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; }
        .cs-label { background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.4); font-size:0.7rem; font-weight:600; }
        .cs-num { background:rgba(255,255,255,0.06); color:#fff; }
        .cs-result { background:rgba(255,100,120,0.12); color:var(--op-color); }
        .cs-borrow { background:rgba(212,175,55,0.12); color:var(--primary-accent); font-size:0.76rem; }
        .cs-sep { grid-column:1/-1; border-bottom:1px solid rgba(255,255,255,0.2); margin:2px 0; }
        .fact-row { display:flex; align-items:flex-start; gap:10px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.85rem; color:rgba(255,255,255,0.72); }
        .fact-row:last-child { border-bottom:none; }
        .fact-row i { color:var(--op-color); margin-top:2px; flex-shrink:0; }
        .btn-gold-page { background:linear-gradient(135deg,var(--primary-accent),#b8901b); color:#000; font-family:'Space Grotesk',sans-serif; font-weight:800; border:none; border-radius:50px; padding:0.85rem 2rem; text-transform:uppercase; letter-spacing:2px; font-size:0.95rem; box-shadow:0 0 20px rgba(212,175,55,0.4); text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:all 0.3s; }
        .btn-gold-page:hover { transform:scale(1.04); box-shadow:0 0 30px rgba(212,175,55,0.7); color:#000; }
        .btn-outline-page { background:transparent; color:rgba(255,255,255,0.65); border:1px solid rgba(255,255,255,0.2); border-radius:50px; padding:0.85rem 2rem; text-transform:uppercase; letter-spacing:1.5px; font-size:0.9rem; font-family:'Space Grotesk',sans-serif; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:7px; transition:all 0.2s; }
        .btn-outline-page:hover { background:rgba(255,255,255,0.07); color:#fff; }
    </style>
</head>
<body>

<canvas id="bg-canvas"></canvas>

<div id="page-content">
    <div class="container" style="max-width:640px;">

        <!-- Navbar -->
        <?php
        $nav_back_url   = url('learn/');
        $nav_back_label = 'Learn';
        require_once PATH_INCLUDES . '/navbar.php';
        ?>

        <!-- Hero -->
        <div class="text-center mb-4">
            <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:rgba(255,100,120,0.1);border:1px solid rgba(255,100,120,0.3);font-size:1.6rem;color:#ff6478;margin-bottom:1rem;">
                <i class="fas fa-minus"></i>
            </div>
            <h1 style="font-size:clamp(2rem,7vw,2.8rem);color:var(--primary-accent);text-shadow:0 0 20px rgba(212,175,55,0.4);margin-bottom:0.4rem;">
                Subtraction
            </h1>
            <p style="color:rgba(255,255,255,0.45);font-size:0.9rem;margin:0;">
                Terms · Counting Back · Borrowing · Properties
            </p>
        </div>

        <!-- What is subtraction -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-circle-info"></i> What is Subtraction?</div>
            <div class="definition-box">
                <strong>Subtraction</strong> is finding the <strong style="color:#ff6478;">difference</strong> between two numbers — how much is left after taking one away. The symbol is <strong style="color:#ff6478;">−</strong>.
            </div>
            <div class="term-grid">
                <div class="term-box">
                    <div class="term-label">Start with</div>
                    <div class="term-value">15</div>
                    <div class="term-name">Minuend</div>
                </div>
                <div class="term-box">
                    <div class="term-label">Take away</div>
                    <div class="term-value">6</div>
                    <div class="term-name">Subtrahend</div>
                </div>
                <div class="term-box" style="border-color:rgba(255,100,120,0.25);background:rgba(255,100,120,0.05);">
                    <div class="term-label">Result</div>
                    <div class="term-value">9</div>
                    <div class="term-name">Difference</div>
                </div>
            </div>
        </div>

        <!-- Strategies -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-brain"></i> Mental Strategies</div>
            <?php
            $strategies = [
                ['Count Back', 'Start from the minuend and count backwards. 14 − 5: count 13, 12, 11, 10, 9.'],
                ['Number Bonds', 'Use known pairs that make 10. 10 − 3 = 7 because 3 + 7 = 10.'],
                ['Count Up (Difference)', 'Count up from the smaller to the larger. 52 − 47: count 47→52 = 5.'],
                ['Round & Adjust', 'Round the number being subtracted. 63 − 29 → 63 − 30 + 1 = 34.'],
            ];
            foreach ($strategies as $i => [$title, $desc]):
            ?>
            <div class="strategy-item">
                <div class="strategy-num"><?= $i + 1 ?></div>
                <div class="strategy-text">
                    <strong><?= $title ?></strong>
                    <span><?= $desc ?></span>
                </div>
            </div>
            <?php endforeach; ?>
        </div>

        <!-- Column Subtraction with Borrowing -->
        <div class="page-card">
            <div class="section-badge gold"><i class="fas fa-arrow-down"></i> Column Subtraction &amp; Borrowing</div>
            <p style="font-size:0.85rem;color:rgba(255,255,255,0.6);margin-bottom:1rem;line-height:1.6;">
                Line up digits by place value. Subtract from <strong style="color:#fff;">right to left</strong>. When the top digit is smaller than the bottom, <strong style="color:var(--primary-accent);">borrow</strong> (regroup) 1 ten from the column to the left.
            </p>
            <p style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:0.5rem;text-align:center;">Example: 523 − 168</p>
            <div style="text-align:center;">
                <div class="column-sub">
                    <div class="cs-cell cs-label"></div>
                    <div class="cs-cell cs-label">H</div>
                    <div class="cs-cell cs-label">T</div>
                    <div class="cs-cell cs-label">O</div>

                    <div class="cs-cell cs-borrow"></div>
                    <div class="cs-cell cs-borrow">4</div>
                    <div class="cs-cell cs-borrow">11</div>
                    <div class="cs-cell cs-borrow">13</div>

                    <div class="cs-cell cs-num"></div>
                    <div class="cs-cell cs-num" style="text-decoration:line-through;opacity:0.4;">5</div>
                    <div class="cs-cell cs-num" style="text-decoration:line-through;opacity:0.4;">2</div>
                    <div class="cs-cell cs-num" style="text-decoration:line-through;opacity:0.4;">3</div>

                    <div class="cs-cell cs-num" style="color:var(--op-color);">−</div>
                    <div class="cs-cell cs-num">1</div>
                    <div class="cs-cell cs-num">6</div>
                    <div class="cs-cell cs-num">8</div>

                    <div class="cs-sep"></div>

                    <div class="cs-cell cs-result"></div>
                    <div class="cs-cell cs-result">3</div>
                    <div class="cs-cell cs-result">5</div>
                    <div class="cs-cell cs-result">5</div>
                </div>
            </div>
            <div class="definition-box" style="margin-top:1rem;">
                Ones: 3 &lt; 8 → borrow a ten: 13 − 8 = 5 &nbsp;|&nbsp; Tens: 1 &lt; 6 → borrow a hundred: 11 − 6 = 5 &nbsp;|&nbsp; Hundreds: 4 − 1 = <strong style="color:#ff6478;">3</strong>
            </div>
        </div>

        <!-- Key Facts -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-star"></i> Key Facts</div>
            <?php
            $facts = [
                ['fas fa-circle-check', 'Subtraction is the <strong>inverse</strong> (opposite) of addition: if 6 + 7 = 13, then 13 − 7 = 6.'],
                ['fas fa-circle-check', 'Subtracting 0 leaves a number unchanged: n − 0 = n.'],
                ['fas fa-circle-check', 'Subtracting a number from itself always gives 0: n − n = 0.'],
                ['fas fa-circle-check', 'Order matters — subtraction is <strong>not</strong> commutative: 9 − 3 ≠ 3 − 9.'],
            ];
            foreach ($facts as [$icon, $text]):
            ?>
            <div class="fact-row">
                <i class="<?= $icon ?>"></i>
                <span><?= $text ?></span>
            </div>
            <?php endforeach; ?>
        </div>

        <!-- CTA -->
        <div class="text-center mt-4 mb-2 d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <a href="<?= url() ?>" class="btn-gold-page"><i class="fas fa-bolt"></i> Practice Now</a>
            <a href="<?= url('learn/') ?>" class="btn-outline-page"><i class="fas fa-arrow-left"></i> All Topics</a>
        </div>

    </div>
</div>

<!-- Footer -->
<div style="position:relative;z-index:10;">
    <?php require_once PATH_INCLUDES . '/footer.php'; ?>
</div>

<?php
$galaxy_mode = 'full';
require_once PATH_INCLUDES . '/galaxy.php';
?>
</body>
</html>
