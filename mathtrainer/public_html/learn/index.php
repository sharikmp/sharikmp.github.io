<?php
/**
 * public_html/learn/index.php
 * Learning hub — topic cards for all math topics.
 */
require_once __DIR__ . '/../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../includes');

$page = [
    'title'       => 'Learn Math — Numbers, Tables & Operations | MathTrainer',
    'description' => 'Explore math topics with MathTrainer — Numbers, Multiplication Tables, Addition, Subtraction, Multiplication and Division. Fun visual lessons for all ages.',
    'canonical'   => url('learn/'),
    'og_title'    => 'Learn Math | MathTrainer',
    'og_desc'     => 'Free interactive math lessons — Numbers, Tables, Addition, Subtraction, Multiplication and Division.',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
    <style>
        :root {
            --primary-accent: #d4af37;
            --neon-cyan: #00f3ff;
        }
        body { margin:0; padding:0; background:radial-gradient(circle at bottom, #1a0b2e 0%, #000000 100%); color:#fff; font-family:'Inter',sans-serif; overflow-x:hidden; min-height:100vh; }
        h1,h2,h3 { font-family:'Space Grotesk',sans-serif; }
        #bg-canvas { position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1; pointer-events:none; }
        #page-content { position:relative; z-index:10; padding:1.5rem 1rem 3rem; }

        /* Navbar */
        .page-nav { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0 1.5rem; }
        .page-nav .brand { font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:800; color:var(--primary-accent); text-shadow:0 0 12px rgba(212,175,55,0.5); text-decoration:none; letter-spacing:2px; }
        .btn-back { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.55); border-radius:50px; padding:6px 16px; font-size:0.82rem; display:inline-flex; align-items:center; gap:6px; text-decoration:none; transition:all 0.2s; }
        .btn-back:hover { background:rgba(255,255,255,0.12); color:#fff; }

        /* Topic grid */
        .topic-grid { display:grid; grid-template-columns:repeat(2, 1fr); gap:14px; margin-top:1rem; }
        .topic-card { background:rgba(20,20,20,0.65); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(212,175,55,0.18); border-radius:20px; padding:1.4rem 1.2rem; text-decoration:none; color:#fff; display:flex; flex-direction:column; align-items:flex-start; gap:8px; transition:transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease; min-height:160px; }
        .topic-card:hover { transform:translateY(-4px); border-color:rgba(212,175,55,0.5); box-shadow:0 8px 28px rgba(212,175,55,0.18); color:#fff; }
        .topic-icon { width:46px; height:46px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0; }
        .topic-card h3 { font-family:'Space Grotesk',sans-serif; font-size:1rem; font-weight:800; margin:0; color:#fff; }
        .topic-card p { font-size:0.78rem; color:rgba(255,255,255,0.5); margin:0; line-height:1.45; flex-grow:1; }
        .topic-arrow { margin-top:auto; font-size:0.72rem; color:var(--primary-accent); font-weight:700; letter-spacing:0.5px; }
        .ic-gold   { background:rgba(212,175,55,0.12); color:var(--primary-accent); }
        .ic-cyan   { background:rgba(0,243,255,0.1);   color:var(--neon-cyan); }
        .ic-green  { background:rgba(0,255,128,0.1);   color:#00ff80; }
        .ic-pink   { background:rgba(255,100,120,0.12);color:#ff6478; }
        .ic-blue   { background:rgba(80,160,255,0.12); color:#50a0ff; }
        .ic-purple { background:rgba(180,100,255,0.12);color:#b464ff; }

        @media (min-width:600px) { .topic-grid { grid-template-columns:repeat(3, 1fr); } }
        @media (max-width:360px) { .topic-grid { grid-template-columns:1fr; } }
    </style>
</head>
<body>

<canvas id="bg-canvas"></canvas>

<div id="page-content">
    <div class="container" style="max-width:700px;">

        <!-- Navbar -->
        <?php
        $nav_back_url   = url();
        $nav_back_label = 'Play';
        require_once PATH_INCLUDES . '/navbar.php';
        ?>

        <!-- Hero -->
        <div class="text-center mb-4">
            <div style="display:inline-flex;align-items:center;gap:7px;background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.25);border-radius:50px;padding:5px 16px;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1.4px;color:var(--primary-accent);margin-bottom:1rem;">
                <i class="fas fa-book-open"></i> Learning Hub
            </div>
            <h1 style="font-size:clamp(2rem,7vw,3rem);color:var(--primary-accent);text-shadow:0 0 20px rgba(212,175,55,0.4);margin-bottom:0.4rem;">
                Learn Math
            </h1>
            <p style="color:rgba(255,255,255,0.45);font-size:0.9rem;margin:0;">
                Pick a topic and start exploring
            </p>
        </div>

        <!-- Topic Cards -->
        <div class="topic-grid">

            <a href="<?= url('learn/numbers/') ?>" class="topic-card">
                <div class="topic-icon ic-gold"><i class="fas fa-hashtag"></i></div>
                <h3>Numbers</h3>
                <p>Counting, place value, odd &amp; even</p>
                <span class="topic-arrow">Explore →</span>
            </a>

            <a href="<?= url('learn/table/') ?>" class="topic-card">
                <div class="topic-icon ic-cyan"><i class="fas fa-table-cells"></i></div>
                <h3>Table</h3>
                <p>Multiplication tables 1–20</p>
                <span class="topic-arrow">Explore →</span>
            </a>

            <a href="<?= url('learn/addition/') ?>" class="topic-card">
                <div class="topic-icon ic-green"><i class="fas fa-plus"></i></div>
                <h3>Addition</h3>
                <p>Adding numbers with mental tricks</p>
                <span class="topic-arrow">Explore →</span>
            </a>

            <a href="<?= url('learn/subtraction/') ?>" class="topic-card">
                <div class="topic-icon ic-pink"><i class="fas fa-minus"></i></div>
                <h3>Subtraction</h3>
                <p>Subtracting with borrowing</p>
                <span class="topic-arrow">Explore →</span>
            </a>

            <a href="<?= url('learn/multiplication/') ?>" class="topic-card">
                <div class="topic-icon ic-blue"><i class="fas fa-xmark"></i></div>
                <h3>Multiplication</h3>
                <p>Times tables &amp; quick methods</p>
                <span class="topic-arrow">Explore →</span>
            </a>

            <a href="<?= url('learn/division/') ?>" class="topic-card">
                <div class="topic-icon ic-purple"><i class="fas fa-divide"></i></div>
                <h3>Division</h3>
                <p>Sharing equally, long division</p>
                <span class="topic-arrow">Explore →</span>
            </a>

        </div>

        <!-- Play CTA -->
        <div class="text-center mt-5 pb-2">
            <p style="color:rgba(255,255,255,0.32);font-size:0.82rem;margin-bottom:1.2rem;">
                Ready to test your speed?
            </p>
            <a href="<?= url() ?>" style="background:linear-gradient(135deg,var(--primary-accent),#b8901b);color:#000;font-family:'Space Grotesk',sans-serif;font-weight:800;border-radius:50px;padding:0.9rem 2.5rem;text-transform:uppercase;letter-spacing:2px;font-size:1rem;box-shadow:0 0 20px rgba(212,175,55,0.4);text-decoration:none;display:inline-flex;align-items:center;gap:8px;">
                <i class="fas fa-bolt"></i> Play Now
            </a>
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
