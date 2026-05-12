<?php
/**
 * public_html/learn/addition/index.php
 * Topic: Addition — terms, strategies, column addition, carrying.
 */
require_once __DIR__ . '/../../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../../includes');

$page = [
    'title'       => 'Learn Addition — Mental Tricks & Column Method | MathTrainer',
    'description' => 'Learn addition — addends, sum, the make-10 strategy, column addition and carrying explained with visual examples.',
    'canonical'   => url('learn/addition/'),
    'og_title'    => 'Learn Addition | MathTrainer',
    'og_desc'     => 'Master addition with mental tricks, column method and carrying. Visual, easy lessons.',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
    <style>
        :root { --primary-accent:#d4af37; --neon-cyan:#00f3ff; --op-color:#00ff80; --glass-bg:rgba(20,20,20,0.65); --glass-border:rgba(0,255,128,0.18); }
        body { margin:0; padding:0; background:radial-gradient(circle at bottom, #1a0b2e 0%, #000000 100%); color:#fff; font-family:'Inter',sans-serif; overflow-x:hidden; min-height:100vh; }
        h1,h2,h3,h4 { font-family:'Space Grotesk',sans-serif; }
        #bg-canvas { position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1; pointer-events:none; }
        #page-content { position:relative; z-index:10; padding:1.5rem 1rem 3rem; }
        .page-nav { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0 1.5rem; }
        .page-nav .brand { font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:800; color:var(--primary-accent); text-shadow:0 0 12px rgba(212,175,55,0.5); text-decoration:none; letter-spacing:2px; }
        .btn-back { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.55); border-radius:50px; padding:6px 16px; font-size:0.82rem; display:inline-flex; align-items:center; gap:6px; text-decoration:none; transition:all 0.2s; }
        .btn-back:hover { background:rgba(255,255,255,0.12); color:#fff; }
        .page-card { background:var(--glass-bg); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid var(--glass-border); border-radius:20px; padding:1.6rem; margin-bottom:1.2rem; }
        .section-badge { display:inline-flex; align-items:center; gap:7px; background:rgba(0,255,128,0.08); border:1px solid rgba(0,255,128,0.25); border-radius:50px; padding:4px 13px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:1.4px; color:var(--op-color); margin-bottom:1rem; }
        .section-badge.gold { background:rgba(212,175,55,0.1); border-color:rgba(212,175,55,0.28); color:var(--primary-accent); }
        .definition-box { background:rgba(0,255,128,0.05); border-left:3px solid var(--op-color); border-radius:0 12px 12px 0; padding:12px 16px; margin:0.8rem 0; font-size:0.88rem; color:rgba(255,255,255,0.82); line-height:1.6; }
        .term-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:0.8rem 0; }
        .term-box { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:12px 10px; text-align:center; }
        .term-label { font-size:0.68rem; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:rgba(255,255,255,0.4); margin-bottom:4px; }
        .term-value { font-family:'Space Grotesk',sans-serif; font-size:1.2rem; font-weight:800; color:var(--op-color); }
        .term-name  { font-size:0.72rem; color:rgba(255,255,255,0.45); margin-top:3px; }
        .strategy-item { display:flex; align-items:flex-start; gap:12px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .strategy-item:last-child { border-bottom:none; }
        .strategy-num { width:32px; height:32px; border-radius:10px; background:rgba(0,255,128,0.1); color:var(--op-color); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:800; flex-shrink:0; }
        .strategy-text strong { display:block; color:#fff; font-size:0.88rem; margin-bottom:3px; }
        .strategy-text span { font-size:0.82rem; color:rgba(255,255,255,0.5); line-height:1.5; }
        .column-add { display:inline-grid; grid-template-columns:repeat(4,36px); gap:4px; font-family:'Space Grotesk',sans-serif; font-size:1rem; font-weight:700; margin:0.8rem auto; }
        .ca-cell { height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; }
        .ca-label { background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.4); font-size:0.7rem; font-weight:600; }
        .ca-num { background:rgba(255,255,255,0.06); color:#fff; }
        .ca-result { background:rgba(0,255,128,0.12); color:var(--op-color); }
        .ca-carry { background:rgba(212,175,55,0.12); color:var(--primary-accent); font-size:0.76rem; }
        .ca-sep { grid-column:1/-1; border-bottom:1px solid rgba(255,255,255,0.2); margin:2px 0; }
        .prop-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.85rem; }
        .prop-row:last-child { border-bottom:none; }
        .prop-badge { background:rgba(0,255,128,0.08); border:1px solid rgba(0,255,128,0.22); border-radius:8px; padding:3px 10px; font-family:'Space Grotesk',sans-serif; font-size:0.75rem; font-weight:700; color:var(--op-color); white-space:nowrap; flex-shrink:0; }
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
            <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:rgba(0,255,128,0.1);border:1px solid rgba(0,255,128,0.3);font-size:1.6rem;color:#00ff80;margin-bottom:1rem;">
                <i class="fas fa-plus"></i>
            </div>
            <h1 style="font-size:clamp(2rem,7vw,2.8rem);color:var(--primary-accent);text-shadow:0 0 20px rgba(212,175,55,0.4);margin-bottom:0.4rem;">
                Addition
            </h1>
            <p style="color:rgba(255,255,255,0.45);font-size:0.9rem;margin:0;">
                Terms · Strategies · Column Method · Properties
            </p>
        </div>

        <!-- What is addition -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-circle-info"></i> What is Addition?</div>
            <div class="definition-box">
                <strong>Addition</strong> is combining two or more numbers to find a <strong style="color:#00ff80;">total</strong> (also called the sum). The symbol is <strong style="color:#00ff80;">+</strong>.
            </div>
            <div class="term-grid">
                <div class="term-box">
                    <div class="term-label">First</div>
                    <div class="term-value">8</div>
                    <div class="term-name">Addend</div>
                </div>
                <div class="term-box">
                    <div class="term-label">Second</div>
                    <div class="term-value">5</div>
                    <div class="term-name">Addend</div>
                </div>
                <div class="term-box" style="border-color:rgba(0,255,128,0.25);background:rgba(0,255,128,0.05);">
                    <div class="term-label">Result</div>
                    <div class="term-value">13</div>
                    <div class="term-name">Sum</div>
                </div>
            </div>
        </div>

        <!-- Mental Strategies -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-brain"></i> Mental Strategies</div>
            <?php
            $strategies = [
                ['Count On', 'Start from the bigger number and count up. 7 + 3: start at 7, count 8, 9, 10.'],
                ['Make 10', 'Break a number to reach 10 first. 8 + 6 → 8 + 2 + 4 = 10 + 4 = 14.'],
                ['Doubles', 'Memorise doubles, then adjust. 7 + 8 = 7 + 7 + 1 = 14 + 1 = 15.'],
                ['Round & Adjust', 'Round to a nice number, add, then correct. 49 + 36 → 50 + 36 − 1 = 85.'],
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

        <!-- Column Addition with Carrying -->
        <div class="page-card">
            <div class="section-badge gold"><i class="fas fa-arrow-up"></i> Column Addition &amp; Carrying</div>
            <p style="font-size:0.85rem;color:rgba(255,255,255,0.6);margin-bottom:1rem;line-height:1.6;">
                Line up digits by place value (ones under ones, tens under tens). Add from <strong style="color:#fff;">right to left</strong>. When a column totals 10 or more, carry the extra digit left.
            </p>
            <p style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:0.5rem;text-align:center;">Example: 347 + 285</p>
            <div style="text-align:center;">
                <div class="column-add">
                    <div class="ca-cell ca-label"></div>
                    <div class="ca-cell ca-label">H</div>
                    <div class="ca-cell ca-label">T</div>
                    <div class="ca-cell ca-label">O</div>

                    <div class="ca-cell ca-carry"></div>
                    <div class="ca-cell ca-carry">1</div>
                    <div class="ca-cell ca-carry">1</div>
                    <div class="ca-cell ca-carry"></div>

                    <div class="ca-cell ca-num"></div>
                    <div class="ca-cell ca-num">3</div>
                    <div class="ca-cell ca-num">4</div>
                    <div class="ca-cell ca-num">7</div>

                    <div class="ca-cell ca-num" style="color:var(--op-color);">+</div>
                    <div class="ca-cell ca-num">2</div>
                    <div class="ca-cell ca-num">8</div>
                    <div class="ca-cell ca-num">5</div>

                    <div class="ca-sep"></div>

                    <div class="ca-cell ca-result"></div>
                    <div class="ca-cell ca-result">6</div>
                    <div class="ca-cell ca-result">3</div>
                    <div class="ca-cell ca-result">2</div>
                </div>
            </div>
            <div class="definition-box" style="margin-top:1rem;">
                Ones: 7 + 5 = 12 → write 2, carry 1 &nbsp;|&nbsp; Tens: 4 + 8 + 1 = 13 → write 3, carry 1 &nbsp;|&nbsp; Hundreds: 3 + 2 + 1 = <strong style="color:#00ff80;">6</strong>
            </div>
        </div>

        <!-- Properties -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-star"></i> Properties</div>
            <?php
            $props = [
                ['Commutative', '3 + 5 = 5 + 3 — order does not matter'],
                ['Associative', '(2 + 3) + 4 = 2 + (3 + 4) — grouping does not matter'],
                ['Identity', 'n + 0 = n — adding zero changes nothing'],
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
