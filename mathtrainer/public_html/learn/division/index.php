<?php
/**
 * public_html/learn/division/index.php
 * Topic: Division — terms, short division, long division, relationship to multiplication.
 */
require_once __DIR__ . '/../../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../../includes');

$page = [
    'title'       => 'Learn Division — Short & Long Division | MathTrainer',
    'description' => 'Learn division — dividend, divisor, quotient, short division, remainders, and how division relates to multiplication.',
    'canonical'   => url('learn/division/'),
    'og_title'    => 'Learn Division | MathTrainer',
    'og_desc'     => 'Master division with short division, remainders and the link to multiplication. Visual lessons.',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
    <style>
        :root { --primary-accent:#d4af37; --neon-cyan:#00f3ff; --op-color:#b464ff; --glass-bg:rgba(20,20,20,0.65); --glass-border:rgba(180,100,255,0.18); }
        body { margin:0; padding:0; background:radial-gradient(circle at bottom, #1a0b2e 0%, #000000 100%); color:#fff; font-family:'Inter',sans-serif; overflow-x:hidden; min-height:100vh; }
        h1,h2,h3,h4 { font-family:'Space Grotesk',sans-serif; }
        #bg-canvas { position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1; pointer-events:none; }
        #page-content { position:relative; z-index:10; padding:1.5rem 1rem 3rem; }
        .page-nav { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0 1.5rem; }
        .page-nav .brand { font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:800; color:var(--primary-accent); text-shadow:0 0 12px rgba(212,175,55,0.5); text-decoration:none; letter-spacing:2px; }
        .btn-back { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.55); border-radius:50px; padding:6px 16px; font-size:0.82rem; display:inline-flex; align-items:center; gap:6px; text-decoration:none; transition:all 0.2s; }
        .btn-back:hover { background:rgba(255,255,255,0.12); color:#fff; }
        .page-card { background:var(--glass-bg); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid var(--glass-border); border-radius:20px; padding:1.6rem; margin-bottom:1.2rem; }
        .section-badge { display:inline-flex; align-items:center; gap:7px; background:rgba(180,100,255,0.08); border:1px solid rgba(180,100,255,0.28); border-radius:50px; padding:4px 13px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:1.4px; color:var(--op-color); margin-bottom:1rem; }
        .section-badge.gold { background:rgba(212,175,55,0.1); border-color:rgba(212,175,55,0.28); color:var(--primary-accent); }
        .definition-box { background:rgba(180,100,255,0.05); border-left:3px solid var(--op-color); border-radius:0 12px 12px 0; padding:12px 16px; margin:0.8rem 0; font-size:0.88rem; color:rgba(255,255,255,0.82); line-height:1.6; }
        .term-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin:0.8rem 0; }
        .term-box { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:12px 10px; text-align:center; }
        .term-label { font-size:0.68rem; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:rgba(255,255,255,0.4); margin-bottom:4px; }
        .term-value { font-family:'Space Grotesk',sans-serif; font-size:1.2rem; font-weight:800; color:var(--op-color); }
        .term-name  { font-size:0.72rem; color:rgba(255,255,255,0.45); margin-top:3px; }
        .strategy-item { display:flex; align-items:flex-start; gap:12px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .strategy-item:last-child { border-bottom:none; }
        .strategy-num { width:32px; height:32px; border-radius:10px; background:rgba(180,100,255,0.1); color:var(--op-color); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:800; flex-shrink:0; }
        .strategy-text strong { display:block; color:#fff; font-size:0.88rem; margin-bottom:3px; }
        .strategy-text span { font-size:0.82rem; color:rgba(255,255,255,0.5); line-height:1.5; }
        /* Short division layout */
        .short-div { font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:700; margin:0.8rem 0; }
        .sd-quotient { display:flex; justify-content:center; gap:0; }
        .sd-q-cell { width:40px; text-align:center; color:var(--op-color); border-bottom:2px solid rgba(255,255,255,0.25); padding-bottom:4px; }
        .sd-body { display:flex; align-items:center; justify-content:center; gap:4px; margin-top:6px; }
        .sd-divisor { color:var(--primary-accent); }
        .sd-bracket { color:rgba(255,255,255,0.5); font-size:1.4rem; }
        .sd-dividend { display:flex; gap:2px; font-size:1.1rem; }
        .sd-d-cell { width:40px; text-align:center; background:rgba(255,255,255,0.05); border-radius:6px; padding:6px 0; }
        .sd-remainder { margin-top:6px; font-size:0.8rem; text-align:center; color:var(--primary-accent); }
        .fact-row { display:flex; align-items:flex-start; gap:10px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.85rem; color:rgba(255,255,255,0.72); }
        .fact-row:last-child { border-bottom:none; }
        .fact-row i { color:var(--op-color); margin-top:2px; flex-shrink:0; }
        .divisibility-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.84rem; }
        .divisibility-row:last-child { border-bottom:none; }
        .div-by { width:40px; height:28px; border-radius:8px; background:rgba(180,100,255,0.1); color:var(--op-color); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:700; flex-shrink:0; }
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
            <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:rgba(180,100,255,0.1);border:1px solid rgba(180,100,255,0.3);font-size:1.6rem;color:#b464ff;margin-bottom:1rem;">
                <i class="fas fa-divide"></i>
            </div>
            <h1 style="font-size:clamp(2rem,7vw,2.8rem);color:var(--primary-accent);text-shadow:0 0 20px rgba(212,175,55,0.4);margin-bottom:0.4rem;">
                Division
            </h1>
            <p style="color:rgba(255,255,255,0.45);font-size:0.9rem;margin:0;">
                Terms · Short Division · Remainders · Divisibility
            </p>
        </div>

        <!-- What is division -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-circle-info"></i> What is Division?</div>
            <div class="definition-box">
                <strong>Division</strong> is splitting a number into equal groups. If 12 sweets are shared among 4 people, each gets <strong style="color:#b464ff;">3</strong>. The symbol is <strong style="color:#b464ff;">÷</strong>.
            </div>
            <div class="term-grid">
                <div class="term-box">
                    <div class="term-label">Number to split</div>
                    <div class="term-value">56</div>
                    <div class="term-name">Dividend</div>
                </div>
                <div class="term-box">
                    <div class="term-label">Split by</div>
                    <div class="term-value">8</div>
                    <div class="term-name">Divisor</div>
                </div>
                <div class="term-box" style="border-color:rgba(180,100,255,0.25);background:rgba(180,100,255,0.05);">
                    <div class="term-label">Answer</div>
                    <div class="term-value">7</div>
                    <div class="term-name">Quotient</div>
                </div>
                <div class="term-box">
                    <div class="term-label">Left over</div>
                    <div class="term-value">0</div>
                    <div class="term-name">Remainder</div>
                </div>
            </div>
        </div>

        <!-- Short division -->
        <div class="page-card">
            <div class="section-badge gold"><i class="fas fa-calculator"></i> Short Division (Bus Stop)</div>
            <p style="font-size:0.85rem;color:rgba(255,255,255,0.6);margin-bottom:1rem;line-height:1.6;">
                Divide from <strong style="color:#fff;">left to right</strong>, one digit at a time. Write the quotient above. Carry any remainder to the next digit.
            </p>
            <p style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:0.8rem;text-align:center;">Example: 952 ÷ 4</p>
            <div style="text-align:center;font-family:'Space Grotesk',sans-serif;">
                <div style="display:inline-block;text-align:left;">
                    <!-- Quotient line -->
                    <div style="display:flex;gap:0;padding-left:36px;border-bottom:2px solid rgba(255,255,255,0.25);padding-bottom:4px;margin-bottom:4px;">
                        <div style="width:36px;text-align:center;color:var(--op-color);font-size:1.1rem;">2</div>
                        <div style="width:36px;text-align:center;color:var(--op-color);font-size:1.1rem;">3</div>
                        <div style="width:36px;text-align:center;color:var(--op-color);font-size:1.1rem;">8</div>
                    </div>
                    <!-- Bus stop symbol + dividend -->
                    <div style="display:flex;align-items:center;">
                        <div style="color:var(--primary-accent);font-size:1.2rem;font-weight:800;padding-right:6px;">4</div>
                        <div style="border-left:2px solid rgba(255,255,255,0.4);padding-left:6px;display:flex;gap:0;">
                            <?php
                            $digits = [9, 5, 2];
                            $carries = ['', '<sup style="color:var(--primary-accent);font-size:0.65rem;">1</sup>', '<sup style="color:var(--primary-accent);font-size:0.65rem;">3</sup>'];
                            foreach ($digits as $k => $d):
                            ?>
                            <div style="width:36px;text-align:center;font-size:1.1rem;color:#fff;"><?= $carries[$k] . $d ?></div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>
            <div class="definition-box" style="margin-top:1rem;">
                9 ÷ 4 = 2 rem <strong style="color:var(--primary-accent);">1</strong> &nbsp;|&nbsp; 15 ÷ 4 = 3 rem <strong style="color:var(--primary-accent);">3</strong> &nbsp;|&nbsp; 32 ÷ 4 = <strong style="color:#b464ff;">8</strong> &nbsp;&nbsp;→ Answer: <strong style="color:#b464ff;">238</strong>
            </div>
        </div>

        <!-- Remainder -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-circle-half-stroke"></i> Remainders</div>
            <p style="font-size:0.88rem;color:rgba(255,255,255,0.65);line-height:1.6;margin-bottom:0.8rem;">
                When a number cannot be divided exactly, the leftover amount is the <strong style="color:#fff;">remainder</strong>.
            </p>
            <div class="definition-box">
                17 ÷ 5 = <strong style="color:#b464ff;">3</strong> remainder <strong style="color:var(--primary-accent);">2</strong> &nbsp;
                <span style="color:rgba(255,255,255,0.45);font-size:0.82rem;">(because 5 × 3 = 15, and 17 − 15 = 2)</span>
            </div>
            <div class="fact-row" style="margin-top:0.4rem;">
                <i class="fas fa-lightbulb"></i>
                <span>The remainder is <strong style="color:#fff;">always less than the divisor</strong>. If it's equal or larger, you can divide once more.</span>
            </div>
        </div>

        <!-- Divisibility rules -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-wand-magic-sparkles"></i> Divisibility Rules</div>
            <p style="font-size:0.85rem;color:rgba(255,255,255,0.55);margin-bottom:0.8rem;">Quick ways to check if a number can be divided without a remainder:</p>
            <?php
            $rules = [
                [2,  'Last digit is even (0, 2, 4, 6 or 8)'],
                [3,  'Sum of all digits is divisible by 3'],
                [4,  'Last 2 digits are divisible by 4'],
                [5,  'Last digit is 0 or 5'],
                [9,  'Sum of all digits is divisible by 9'],
                [10, 'Last digit is 0'],
            ];
            foreach ($rules as [$n, $rule]):
            ?>
            <div class="divisibility-row">
                <div class="div-by">÷<?= $n ?></div>
                <span style="color:rgba(255,255,255,0.68);font-size:0.84rem;"><?= $rule ?></span>
            </div>
            <?php endforeach; ?>
        </div>

        <!-- Link to multiplication -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-arrows-rotate"></i> Division &amp; Multiplication</div>
            <p style="font-size:0.88rem;color:rgba(255,255,255,0.65);line-height:1.6;margin-bottom:0.6rem;">
                Division is the <strong style="color:#fff;">inverse</strong> of multiplication. Knowing one fact gives you four related facts:
            </p>
            <div style="background:rgba(255,255,255,0.04);border-radius:14px;padding:14px;display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <?php
                $facts = ['6 × 8 = 48', '8 × 6 = 48', '48 ÷ 6 = 8', '48 ÷ 8 = 6'];
                foreach ($facts as $f):
                ?>
                <div style="background:rgba(180,100,255,0.07);border:1px solid rgba(180,100,255,0.2);border-radius:10px;padding:8px 12px;font-family:'Space Grotesk',sans-serif;font-size:0.9rem;font-weight:700;color:#fff;text-align:center;"><?= $f ?></div>
                <?php endforeach; ?>
            </div>
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
