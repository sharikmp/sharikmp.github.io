<?php
/**
 * public_html/learn/table/index.php
 * Topic: Multiplication Tables 1–12
 */
require_once __DIR__ . '/../../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../../includes');

$page = [
    'title'       => 'Multiplication Tables 1–12 | MathTrainer',
    'description' => 'Learn and memorise multiplication tables from 1 to 12 with tips, patterns and a full visual times table grid.',
    'canonical'   => url('learn/table/'),
    'og_title'    => 'Multiplication Tables | MathTrainer',
    'og_desc'     => 'Visual times table grid, memorable patterns and tips to master multiplication facts 1–12.',
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

        /* Times table grid */
        .tt-wrap { overflow-x:auto; border-radius:14px; }
        .tt-grid { border-collapse:separate; border-spacing:3px; width:100%; }
        .tt-grid th { background:rgba(212,175,55,0.15); color:var(--primary-accent); font-family:'Space Grotesk',sans-serif; font-size:0.72rem; font-weight:800; padding:7px 5px; border-radius:8px; text-align:center; min-width:32px; }
        .tt-grid td { background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.72); font-size:0.78rem; padding:7px 5px; border-radius:8px; text-align:center; border:1px solid rgba(255,255,255,0.05); cursor:default; transition:background 0.15s; }
        .tt-grid td:hover { background:rgba(212,175,55,0.18); color:#fff; }
        .tt-grid td.highlight { background:rgba(0,243,255,0.1); color:var(--neon-cyan); border-color:rgba(0,243,255,0.2); }
        .tt-grid td.square { background:rgba(212,175,55,0.14); color:var(--primary-accent); font-weight:700; }

        /* Tip rows */
        .tip-row { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:0.85rem; color:rgba(255,255,255,0.72); }
        .tip-row:last-child { border-bottom:none; }
        .tip-icon { width:34px; height:34px; border-radius:10px; background:rgba(212,175,55,0.1); color:var(--primary-accent); display:flex; align-items:center; justify-content:center; font-size:0.9rem; flex-shrink:0; }
        .tip-text strong { color:#fff; display:block; margin-bottom:2px; }

        .btn-gold-page { background:linear-gradient(135deg,var(--primary-accent),#b8901b); color:#000; font-family:'Space Grotesk',sans-serif; font-weight:800; border:none; border-radius:50px; padding:0.85rem 2rem; text-transform:uppercase; letter-spacing:2px; font-size:0.95rem; box-shadow:0 0 20px rgba(212,175,55,0.4); text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:all 0.3s; }
        .btn-gold-page:hover { transform:scale(1.04); box-shadow:0 0 30px rgba(212,175,55,0.7); color:#000; }
        .btn-outline-page { background:transparent; color:rgba(255,255,255,0.65); border:1px solid rgba(255,255,255,0.2); border-radius:50px; padding:0.85rem 2rem; text-transform:uppercase; letter-spacing:1.5px; font-size:0.9rem; font-family:'Space Grotesk',sans-serif; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:7px; transition:all 0.2s; }
        .btn-outline-page:hover { background:rgba(255,255,255,0.07); color:#fff; }
    </style>
</head>
<body>

<canvas id="bg-canvas"></canvas>

<div id="page-content">
    <div class="container" style="max-width:700px;">

        <!-- Navbar -->
        <?php
        $nav_back_url   = url('learn/');
        $nav_back_label = 'Learn';
        require_once PATH_INCLUDES . '/navbar.php';
        ?>

        <!-- Hero -->
        <div class="text-center mb-4">
            <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:rgba(0,243,255,0.1);border:1px solid rgba(0,243,255,0.3);font-size:1.6rem;color:var(--neon-cyan);margin-bottom:1rem;">
                <i class="fas fa-table-cells"></i>
            </div>
            <h1 style="font-size:clamp(2rem,7vw,2.8rem);color:var(--primary-accent);text-shadow:0 0 20px rgba(212,175,55,0.4);margin-bottom:0.4rem;">
                Times Tables
            </h1>
            <p style="color:rgba(255,255,255,0.45);font-size:0.9rem;margin:0;">
                Multiplication facts from 1 × 1 to 12 × 12
            </p>
        </div>

        <!-- What is multiplication? -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-circle-info"></i> Quick Recap</div>
            <div class="definition-box">
                <strong>Multiplication</strong> is repeated addition. <br>
                3 × 4 means "add 3 together four times" → 3 + 3 + 3 + 3 = <strong style="color:var(--primary-accent);">12</strong>
            </div>
            <p style="font-size:0.88rem;color:rgba(255,255,255,0.6);margin:0.8rem 0 0;line-height:1.6;">
                Knowing your times tables by heart means you can solve problems <strong style="color:#fff;">instantly</strong> without working them out each time.
            </p>
        </div>

        <!-- Full 12×12 Table Grid -->
        <div class="page-card">
            <div class="section-badge cyan"><i class="fas fa-grid"></i> 12 × 12 Grid</div>
            <p style="font-size:0.8rem;color:rgba(255,255,255,0.45);margin-bottom:0.8rem;"><i class="fas fa-circle-info fa-xs"></i> Hover a cell to highlight. <span style="color:var(--primary-accent);">Gold = square numbers</span>.</p>
            <div class="tt-wrap">
                <table class="tt-grid">
                    <thead>
                        <tr>
                            <th>×</th>
                            <?php for ($c = 1; $c <= 12; $c++): ?>
                            <th><?= $c ?></th>
                            <?php endfor; ?>
                        </tr>
                    </thead>
                    <tbody>
                        <?php for ($r = 1; $r <= 12; $r++): ?>
                        <tr>
                            <th><?= $r ?></th>
                            <?php for ($c = 1; $c <= 12; $c++): ?>
                                <?php
                                $val = $r * $c;
                                $cls = ($r === $c) ? ' square' : (($val % 2 === 0) ? '' : '');
                                ?>
                            <td class="<?= trim($cls) ?>"><?= $val ?></td>
                            <?php endfor; ?>
                        </tr>
                        <?php endfor; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Tips to memorize -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-lightbulb"></i> Memorisation Tips</div>
            <?php
            $tips = [
                ['fas fa-circle-xmark', '× 1 is always the number itself', '7 × 1 = 7, 15 × 1 = 15'],
                ['fas fa-circle-xmark', '× 0 is always 0', 'Any number multiplied by 0 equals 0'],
                ['fas fa-arrow-right', '× 2 — just double it', '6 × 2 = 12, 9 × 2 = 18'],
                ['fas fa-hand-point-right', '× 5 — ends in 0 or 5', '4 × 5 = 20, 7 × 5 = 35'],
                ['fas fa-arrow-up-right-dots', '× 10 — add a zero', '8 × 10 = 80, 13 × 10 = 130'],
                ['fas fa-rotate', '× 9 trick — fingers', 'Fold the Nth finger: digits left = tens, right = ones'],
                ['fas fa-shuffle', 'Commutative rule', '6 × 7 = 7 × 6 — halves what you need to memorise!'],
            ];
            foreach ($tips as [$icon, $title, $desc]):
            ?>
            <div class="tip-row">
                <div class="tip-icon"><i class="<?= $icon ?>"></i></div>
                <div class="tip-text">
                    <strong><?= $title ?></strong>
                    <span style="font-size:0.82rem;color:rgba(255,255,255,0.5);"><?= $desc ?></span>
                </div>
            </div>
            <?php endforeach; ?>
        </div>

        <!-- Patterns -->
        <div class="page-card">
            <div class="section-badge cyan"><i class="fas fa-wand-magic-sparkles"></i> Patterns to Spot</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:0.4rem;">
                <?php
                $patterns = [
                    ['Square numbers', 'Diagonal of the grid: 1, 4, 9, 16, 25, 36…', 'var(--primary-accent)'],
                    ['× 11 up to 9', '11×2=22, 11×3=33 — digits repeat!', 'var(--neon-cyan)'],
                    ['Even × Even', 'Always gives an even product', 'rgba(0,255,128,0.85)'],
                    ['Odd × Odd', 'Always gives an odd product', '#ff6478'],
                ];
                foreach ($patterns as [$title, $desc, $color]):
                ?>
                <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:12px;">
                    <div style="font-family:'Space Grotesk',sans-serif;font-size:0.85rem;font-weight:700;color:<?= $color ?>;margin-bottom:4px;"><?= $title ?></div>
                    <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);line-height:1.4;"><?= $desc ?></div>
                </div>
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
