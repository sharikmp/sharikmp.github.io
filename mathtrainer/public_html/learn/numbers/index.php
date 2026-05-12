<?php
/**
 * public_html/learn/numbers/index.php
 * Topic: Numbers — counting, place value, odd/even, comparing.
 */
require_once __DIR__ . '/../../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../../includes');

$page = [
    'title'       => 'Learn Numbers — Place Value, Odd & Even | MathTrainer',
    'description' => 'Learn about numbers — counting, place value (ones, tens, hundreds), odd and even numbers, and how to compare numbers.',
    'canonical'   => url('learn/numbers/'),
    'og_title'    => 'Learn Numbers | MathTrainer',
    'og_desc'     => 'Understand numbers — place value, odd & even, comparing and ordering. Visual, easy lessons.',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
    <style>
        :root { --primary-accent:#d4af37; --neon-cyan:#00f3ff; --glass-bg:rgba(20,20,20,0.65); --glass-border:rgba(212,175,55,0.2); }
        body { margin:0; padding:0; background:radial-gradient(circle at bottom, #1a0b2e 0%, #000000 100%); color:#fff; font-family:'Inter',sans-serif; overflow-x:hidden; min-height:100vh; }
        h1,h2,h3,h4 { font-family:'Space Grotesk',sans-serif; }
        #bg-canvas { position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1; pointer-events:none; }
        #page-content { position:relative; z-index:10; padding:1.5rem 1rem 3rem; }
        .page-nav { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0 1.5rem; }
        .page-nav .brand { font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:800; color:var(--primary-accent); text-shadow:0 0 12px rgba(212,175,55,0.5); text-decoration:none; letter-spacing:2px; }
        .btn-back { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.55); border-radius:50px; padding:6px 16px; font-size:0.82rem; display:inline-flex; align-items:center; gap:6px; text-decoration:none; transition:all 0.2s; }
        .btn-back:hover { background:rgba(255,255,255,0.12); color:#fff; }
        .page-card { background:var(--glass-bg); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid var(--glass-border); border-radius:20px; padding:1.6rem; margin-bottom:1.2rem; }
        .section-badge { display:inline-flex; align-items:center; gap:7px; background:rgba(212,175,55,0.1); border:1px solid rgba(212,175,55,0.28); border-radius:50px; padding:4px 13px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:1.4px; color:var(--primary-accent); margin-bottom:1rem; }
        .section-badge.cyan { background:rgba(0,243,255,0.08); border-color:rgba(0,243,255,0.28); color:var(--neon-cyan); }
        .definition-box { background:rgba(212,175,55,0.06); border-left:3px solid var(--primary-accent); border-radius:0 12px 12px 0; padding:12px 16px; margin:0.8rem 0; font-size:0.88rem; color:rgba(255,255,255,0.82); line-height:1.6; }
        .digit-strip { display:flex; flex-wrap:wrap; gap:8px; margin:0.6rem 0; }
        .digit-box { width:44px; height:44px; border-radius:12px; background:rgba(212,175,55,0.1); border:1px solid rgba(212,175,55,0.3); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:1.2rem; font-weight:800; color:var(--primary-accent); }
        .place-table { width:100%; border-collapse:separate; border-spacing:6px; }
        .place-table th { background:rgba(212,175,55,0.12); color:var(--primary-accent); font-family:'Space Grotesk',sans-serif; font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:9px 10px; border-radius:10px; text-align:center; }
        .place-table td { background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.78); font-size:0.9rem; padding:10px; border-radius:10px; text-align:center; border:1px solid rgba(255,255,255,0.07); }
        .number-line { display:flex; align-items:center; gap:0; overflow-x:auto; padding:0.6rem 0; scrollbar-width:thin; }
        .nl-tick { display:flex; flex-direction:column; align-items:center; min-width:36px; }
        .nl-num { font-family:'Space Grotesk',sans-serif; font-size:0.82rem; font-weight:700; color:rgba(255,255,255,0.7); }
        .nl-dot { width:10px; height:10px; border-radius:50%; background:var(--primary-accent); margin:4px 0; box-shadow:0 0 6px rgba(212,175,55,0.5); }
        .nl-line { flex:1; height:2px; background:rgba(212,175,55,0.3); min-width:20px; }
        .oe-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:0.6rem; }
        .oe-card { background:rgba(255,255,255,0.04); border-radius:14px; padding:14px; border:1px solid rgba(255,255,255,0.08); }
        .oe-card h4 { font-size:0.85rem; margin:0 0 8px; }
        .oe-numbers { display:flex; flex-wrap:wrap; gap:6px; }
        .oe-num { width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:0.9rem; font-weight:700; }
        .oe-even { background:rgba(0,243,255,0.1); color:var(--neon-cyan); border:1px solid rgba(0,243,255,0.25); }
        .oe-odd  { background:rgba(212,175,55,0.1); color:var(--primary-accent); border:1px solid rgba(212,175,55,0.25); }
        .compare-row { display:flex; align-items:center; justify-content:center; gap:16px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:700; }
        .compare-row:last-child { border-bottom:none; }
        .compare-sym { font-size:1.3rem; color:var(--neon-cyan); }
        .key-fact { display:flex; align-items:flex-start; gap:10px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.85rem; color:rgba(255,255,255,0.72); }
        .key-fact:last-child { border-bottom:none; }
        .key-fact i { color:var(--primary-accent); margin-top:2px; flex-shrink:0; }
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
            <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.3);font-size:1.6rem;color:var(--primary-accent);margin-bottom:1rem;">
                <i class="fas fa-hashtag"></i>
            </div>
            <h1 style="font-size:clamp(2rem,7vw,2.8rem);color:var(--primary-accent);text-shadow:0 0 20px rgba(212,175,55,0.4);margin-bottom:0.4rem;">
                Numbers
            </h1>
            <p style="color:rgba(255,255,255,0.45);font-size:0.9rem;margin:0;">
                Counting · Place Value · Odd &amp; Even · Comparing
            </p>
        </div>

        <!-- The Digits -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-circle-info"></i> The 10 Digits</div>
            <p style="font-size:0.9rem;color:rgba(255,255,255,0.72);line-height:1.65;margin-bottom:1rem;">
                Every number in the world is written using just <strong style="color:#fff;">10 digits</strong>. Combine them in different ways to make any number you need.
            </p>
            <div class="digit-strip">
                <?php for ($i = 0; $i <= 9; $i++): ?>
                <div class="digit-box"><?= $i ?></div>
                <?php endfor; ?>
            </div>
            <div class="definition-box">
                A <strong>digit</strong> is a single symbol used to represent a number. The digits 0–9 are the building blocks of our number system.
            </div>
        </div>

        <!-- Number Line -->
        <div class="page-card">
            <div class="section-badge cyan"><i class="fas fa-arrows-left-right"></i> Number Line</div>
            <p style="font-size:0.88rem;color:rgba(255,255,255,0.65);line-height:1.6;margin-bottom:0.8rem;">
                Numbers increase as you move right and decrease as you move left.
            </p>
            <div class="number-line">
                <?php for ($i = 0; $i <= 10; $i++): ?>
                    <div class="nl-tick">
                        <div class="nl-num"><?= $i ?></div>
                        <div class="nl-dot"></div>
                    </div>
                    <?php if ($i < 10): ?><div class="nl-line"></div><?php endif; ?>
                <?php endfor; ?>
            </div>
            <div class="key-fact" style="margin-top:0.6rem;">
                <i class="fas fa-lightbulb"></i>
                <span>The further right on the number line, the <strong style="color:#fff;">bigger</strong> the number. Negative numbers go to the left of 0.</span>
            </div>
        </div>

        <!-- Place Value -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-layer-group"></i> Place Value</div>
            <p style="font-size:0.88rem;color:rgba(255,255,255,0.65);line-height:1.6;margin-bottom:1rem;">
                The <strong style="color:#fff;">position</strong> of a digit in a number tells you its value. The number <strong style="color:var(--primary-accent);">4,537</strong> breaks down like this:
            </p>
            <table class="place-table">
                <thead>
                    <tr>
                        <th>Thousands</th>
                        <th>Hundreds</th>
                        <th>Tens</th>
                        <th>Ones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>4 × 1,000<br><small style="color:var(--primary-accent);font-weight:700;">= 4,000</small></td>
                        <td>5 × 100<br><small style="color:var(--primary-accent);font-weight:700;">= 500</small></td>
                        <td>3 × 10<br><small style="color:var(--primary-accent);font-weight:700;">= 30</small></td>
                        <td>7 × 1<br><small style="color:var(--primary-accent);font-weight:700;">= 7</small></td>
                    </tr>
                </tbody>
            </table>
            <div class="definition-box" style="margin-top:1rem;">
                4,000 + 500 + 30 + 7 = <strong style="color:var(--primary-accent);">4,537</strong>
            </div>
        </div>

        <!-- Odd & Even -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-circle-half-stroke"></i> Odd &amp; Even</div>
            <p style="font-size:0.88rem;color:rgba(255,255,255,0.65);line-height:1.6;margin-bottom:0.8rem;">
                Every whole number is either <strong style="color:var(--neon-cyan);">even</strong> (divisible by 2) or <strong style="color:var(--primary-accent);">odd</strong> (not divisible by 2).
            </p>
            <div class="oe-grid">
                <div class="oe-card">
                    <h4 style="color:var(--neon-cyan);"><i class="fas fa-circle-half-stroke"></i> Even Numbers</h4>
                    <div class="oe-numbers">
                        <?php foreach ([0,2,4,6,8,10,12,14] as $n): ?>
                        <div class="oe-num oe-even"><?= $n ?></div>
                        <?php endforeach; ?>
                    </div>
                    <p style="font-size:0.75rem;color:rgba(255,255,255,0.45);margin:8px 0 0;">End in 0, 2, 4, 6 or 8</p>
                </div>
                <div class="oe-card">
                    <h4 style="color:var(--primary-accent);"><i class="fas fa-circle"></i> Odd Numbers</h4>
                    <div class="oe-numbers">
                        <?php foreach ([1,3,5,7,9,11,13,15] as $n): ?>
                        <div class="oe-num oe-odd"><?= $n ?></div>
                        <?php endforeach; ?>
                    </div>
                    <p style="font-size:0.75rem;color:rgba(255,255,255,0.45);margin:8px 0 0;">End in 1, 3, 5, 7 or 9</p>
                </div>
            </div>
        </div>

        <!-- Comparing Numbers -->
        <div class="page-card">
            <div class="section-badge cyan"><i class="fas fa-scale-balanced"></i> Comparing Numbers</div>
            <p style="font-size:0.88rem;color:rgba(255,255,255,0.65);margin-bottom:0.8rem;">
                Use these symbols to compare two numbers:
            </p>
            <div class="definition-box" style="margin-bottom:1rem;">
                <strong style="color:var(--neon-cyan);">&lt;</strong> Less than &nbsp;|&nbsp;
                <strong style="color:var(--primary-accent);">&gt;</strong> Greater than &nbsp;|&nbsp;
                <strong style="color:#fff;">=</strong> Equal to
            </div>
            <div class="compare-row">
                <span>25</span>
                <span class="compare-sym">&lt;</span>
                <span>40</span>
                <span style="font-size:0.78rem;color:rgba(255,255,255,0.4);margin-left:8px;">25 is less than 40</span>
            </div>
            <div class="compare-row">
                <span>99</span>
                <span class="compare-sym" style="color:var(--primary-accent);">&gt;</span>
                <span>56</span>
                <span style="font-size:0.78rem;color:rgba(255,255,255,0.4);margin-left:8px;">99 is greater than 56</span>
            </div>
            <div class="compare-row">
                <span>7 × 6</span>
                <span class="compare-sym" style="color:#fff;">=</span>
                <span>42</span>
                <span style="font-size:0.78rem;color:rgba(255,255,255,0.4);margin-left:8px;">Both sides equal 42</span>
            </div>
        </div>

        <!-- Key Facts -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-star"></i> Key Facts</div>
            <?php
            $facts = [
                ['fas fa-circle-check', '0 is the smallest whole number (and it is even).'],
                ['fas fa-circle-check', 'There is no largest number — numbers go on forever (∞).'],
                ['fas fa-circle-check', 'Adding any number to 0 leaves it unchanged: n + 0 = n.'],
                ['fas fa-circle-check', 'Multiplying by 10 shifts every digit one place to the left.'],
                ['fas fa-circle-check', 'A number with more digits is always larger (e.g. 100 > 99).'],
            ];
            foreach ($facts as [$icon, $text]):
            ?>
            <div class="key-fact">
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
