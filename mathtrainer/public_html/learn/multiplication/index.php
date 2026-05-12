<?php
/**
 * public_html/learn/multiplication/index.php
 * Topic: Multiplication — repeated addition, methods, properties.
 */
require_once __DIR__ . '/../../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../../includes');

$page = [
    'title'       => 'Learn Multiplication — Methods & Properties | MathTrainer',
    'description' => 'Learn multiplication — factors, product, repeated addition, multiplying by 10 & 100, grid method and key properties.',
    'canonical'   => url('learn/multiplication/'),
    'og_title'    => 'Learn Multiplication | MathTrainer',
    'og_desc'     => 'Master multiplication with repeated addition, the grid method and quick mental tricks.',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
    <style>
        :root { --primary-accent:#d4af37; --neon-cyan:#00f3ff; --op-color:#50a0ff; --glass-bg:rgba(20,20,20,0.65); --glass-border:rgba(80,160,255,0.18); }
        body { margin:0; padding:0; background:radial-gradient(circle at bottom, #1a0b2e 0%, #000000 100%); color:#fff; font-family:'Inter',sans-serif; overflow-x:hidden; min-height:100vh; }
        h1,h2,h3,h4 { font-family:'Space Grotesk',sans-serif; }
        #bg-canvas { position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1; pointer-events:none; }
        #page-content { position:relative; z-index:10; padding:1.5rem 1rem 3rem; }
        .page-nav { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0 1.5rem; }
        .page-nav .brand { font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:800; color:var(--primary-accent); text-shadow:0 0 12px rgba(212,175,55,0.5); text-decoration:none; letter-spacing:2px; }
        .btn-back { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.55); border-radius:50px; padding:6px 16px; font-size:0.82rem; display:inline-flex; align-items:center; gap:6px; text-decoration:none; transition:all 0.2s; }
        .btn-back:hover { background:rgba(255,255,255,0.12); color:#fff; }
        .page-card { background:var(--glass-bg); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid var(--glass-border); border-radius:20px; padding:1.6rem; margin-bottom:1.2rem; }
        .section-badge { display:inline-flex; align-items:center; gap:7px; background:rgba(80,160,255,0.08); border:1px solid rgba(80,160,255,0.28); border-radius:50px; padding:4px 13px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:1.4px; color:var(--op-color); margin-bottom:1rem; }
        .section-badge.gold { background:rgba(212,175,55,0.1); border-color:rgba(212,175,55,0.28); color:var(--primary-accent); }
        .definition-box { background:rgba(80,160,255,0.05); border-left:3px solid var(--op-color); border-radius:0 12px 12px 0; padding:12px 16px; margin:0.8rem 0; font-size:0.88rem; color:rgba(255,255,255,0.82); line-height:1.6; }
        .term-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:0.8rem 0; }
        .term-box { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:12px 10px; text-align:center; }
        .term-label { font-size:0.68rem; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:rgba(255,255,255,0.4); margin-bottom:4px; }
        .term-value { font-family:'Space Grotesk',sans-serif; font-size:1.2rem; font-weight:800; color:var(--op-color); }
        .term-name  { font-size:0.72rem; color:rgba(255,255,255,0.45); margin-top:3px; }
        /* Grid method */
        .grid-method { display:grid; grid-template-columns:auto 80px 60px; gap:4px; margin:0.8rem auto; max-width:260px; }
        .gm-cell { border-radius:10px; padding:10px; text-align:center; font-family:'Space Grotesk',sans-serif; font-size:0.9rem; font-weight:700; }
        .gm-header { background:rgba(80,160,255,0.14); color:var(--op-color); }
        .gm-body { background:rgba(255,255,255,0.05); color:#fff; border:1px solid rgba(255,255,255,0.07); }
        .gm-total { background:rgba(212,175,55,0.14); color:var(--primary-accent); }
        .strategy-item { display:flex; align-items:flex-start; gap:12px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .strategy-item:last-child { border-bottom:none; }
        .strategy-num { width:32px; height:32px; border-radius:10px; background:rgba(80,160,255,0.1); color:var(--op-color); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:800; flex-shrink:0; }
        .strategy-text strong { display:block; color:#fff; font-size:0.88rem; margin-bottom:3px; }
        .strategy-text span { font-size:0.82rem; color:rgba(255,255,255,0.5); line-height:1.5; }
        .prop-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.85rem; }
        .prop-row:last-child { border-bottom:none; }
        .prop-badge { background:rgba(80,160,255,0.08); border:1px solid rgba(80,160,255,0.22); border-radius:8px; padding:3px 10px; font-family:'Space Grotesk',sans-serif; font-size:0.75rem; font-weight:700; color:var(--op-color); white-space:nowrap; flex-shrink:0; }
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
            <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:rgba(80,160,255,0.1);border:1px solid rgba(80,160,255,0.3);font-size:1.6rem;color:#50a0ff;margin-bottom:1rem;">
                <i class="fas fa-xmark"></i>
            </div>
            <h1 style="font-size:clamp(2rem,7vw,2.8rem);color:var(--primary-accent);text-shadow:0 0 20px rgba(212,175,55,0.4);margin-bottom:0.4rem;">
                Multiplication
            </h1>
            <p style="color:rgba(255,255,255,0.45);font-size:0.9rem;margin:0;">
                Terms · Repeated Addition · Grid Method · Properties
            </p>
        </div>

        <!-- What is multiplication -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-circle-info"></i> What is Multiplication?</div>
            <div class="definition-box">
                <strong>Multiplication</strong> is a fast way to do repeated addition. <br>
                4 × 3 = 4 + 4 + 4 = <strong style="color:#50a0ff;">12</strong> &nbsp;&nbsp;(add 4 exactly 3 times)
            </div>
            <div class="term-grid">
                <div class="term-box">
                    <div class="term-label">First</div>
                    <div class="term-value">6</div>
                    <div class="term-name">Factor</div>
                </div>
                <div class="term-box">
                    <div class="term-label">Second</div>
                    <div class="term-value">7</div>
                    <div class="term-name">Factor</div>
                </div>
                <div class="term-box" style="border-color:rgba(80,160,255,0.25);background:rgba(80,160,255,0.05);">
                    <div class="term-label">Result</div>
                    <div class="term-value">42</div>
                    <div class="term-name">Product</div>
                </div>
            </div>
        </div>

        <!-- Quick mental tricks -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-brain"></i> Quick Mental Tricks</div>
            <?php
            $strategies = [
                ['× 2 — Double it', 'Doubling is the fastest trick: 2 × 13 = 26 (13 + 13).'],
                ['× 4 — Double twice', '4 × 8: double 8 = 16, double again = 32.'],
                ['× 5 — Halve then × 10', '5 × 14: half of 14 = 7, × 10 = 70.'],
                ['× 10 — Shift digits left', 'Just add a zero to the ones: 6 × 10 = 60, 45 × 10 = 450.'],
                ['× 9 — Use × 10 then subtract', '9 × 7 = 10 × 7 − 7 = 70 − 7 = 63.'],
                ['× 11 (2-digit)', 'Add the two digits and put the sum in the middle: 11 × 13 = 1_(1+3)_3 = 143.'],
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

        <!-- Grid method -->
        <div class="page-card">
            <div class="section-badge gold"><i class="fas fa-table-cells-large"></i> Grid Method (Partitioning)</div>
            <p style="font-size:0.85rem;color:rgba(255,255,255,0.6);margin-bottom:1rem;line-height:1.6;">
                Break numbers into tens and ones, multiply each part, then add the results. Great for 2-digit × 1-digit.
            </p>
            <p style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:0.5rem;text-align:center;">Example: 47 × 6</p>
            <div style="text-align:center;">
                <div class="grid-method">
                    <div class="gm-cell gm-header">×</div>
                    <div class="gm-cell gm-header">40</div>
                    <div class="gm-cell gm-header">7</div>

                    <div class="gm-cell gm-header">6</div>
                    <div class="gm-cell gm-body">240</div>
                    <div class="gm-cell gm-body">42</div>
                </div>
                <div style="margin-top:8px;font-size:0.88rem;color:rgba(255,255,255,0.65);">
                    240 + 42 = <strong style="color:var(--primary-accent);font-size:1.1rem;">282</strong>
                </div>
            </div>
        </div>

        <!-- Properties -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-star"></i> Properties</div>
            <?php
            $props = [
                ['Commutative', '6 × 7 = 7 × 6 — order does not matter'],
                ['Associative', '(2 × 3) × 4 = 2 × (3 × 4) — grouping does not matter'],
                ['Identity', 'n × 1 = n — multiplying by 1 changes nothing'],
                ['Zero', 'n × 0 = 0 — multiplying by 0 always gives 0'],
                ['Distributive', '6 × (4 + 3) = 6×4 + 6×3 = 42'],
            ];
            foreach ($props as [$name, $desc]):
            ?>
            <div class="prop-row">
                <div class="prop-badge"><?= $name ?></div>
                <span style="color:rgba(255,255,255,0.65);font-size:0.84rem;"><?= $desc ?></span>
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
