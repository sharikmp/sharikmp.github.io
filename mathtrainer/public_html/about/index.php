<?php
/**
 * public_html/about/index.php
 * About page.
 * Path to config from here:
 *   about/ → up one → public_html/ → up one → config/config.php
 */
require_once __DIR__ . '/../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../includes');

$page = [
    'title'       => 'About MathTrainer | Free Adaptive Mental Math Game',
    'description' => 'Learn about MathTrainer — a free adaptive mental math game built to make math learning super easy, animated, and fun for growing kids and adults who want to sharpen their mental speed.',
    'canonical'   => url('about/'),
    'og_title'    => 'About MathTrainer',
    'og_desc'     => 'MathTrainer is built to make math learning easy, animated, and addictive — for kids and adults alike.',
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
        body { margin:0; padding:0; background:radial-gradient(circle at bottom, #1a0b2e 0%, #000000 100%); color:#fff; font-family:'Inter',sans-serif; overflow-x:hidden; min-height:100vh; }
        h1,h2,h3,h4 { font-family:'Space Grotesk',sans-serif; }
        #bg-canvas { position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1; pointer-events:none; }
        #page-content { position:relative; z-index:10; padding:1.5rem 1rem 5rem; min-height:100vh; }
        .page-nav { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0 1.5rem; }
        .page-nav .brand { font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:800; color:var(--primary-accent); text-shadow:0 0 12px rgba(212,175,55,0.5); text-decoration:none; letter-spacing:2px; }
        .btn-back { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.55); border-radius:50px; padding:6px 16px; font-size:0.82rem; display:flex; align-items:center; gap:6px; text-decoration:none; transition:all 0.2s; }
        .btn-back:hover { background:rgba(255,255,255,0.12); color:#fff; }
        .page-card { background:var(--glass-bg); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid var(--glass-border); border-radius:20px; padding:1.75rem; margin-bottom:1.2rem; }
        .section-badge { display:inline-flex; align-items:center; gap:7px; background:rgba(212,175,55,0.1); border:1px solid rgba(212,175,55,0.28); border-radius:50px; padding:4px 13px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:1.4px; color:var(--primary-accent); margin-bottom:1rem; }
        .section-badge.cyan { background:rgba(0,243,255,0.08); border-color:rgba(0,243,255,0.28); color:var(--neon-cyan); }
        .feature-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-top:0.5rem; }
        .feature-item { display:flex; align-items:flex-start; gap:10px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:10px 12px; }
        .feature-item i { color:var(--primary-accent); margin-top:2px; flex-shrink:0; font-size:0.85rem; }
        .feature-item span { font-size:0.83rem; color:rgba(255,255,255,0.72); line-height:1.4; }
        .roadmap-item { display:flex; align-items:flex-start; gap:14px; padding:11px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .roadmap-item:last-child { border-bottom:none; }
        .roadmap-icon { width:36px; height:36px; border-radius:10px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:1rem; }
        .roadmap-text strong { display:block; font-size:0.9rem; color:#fff; margin-bottom:2px; }
        .roadmap-text span { font-size:0.8rem; color:rgba(255,255,255,0.5); }
        .soon-badge { display:inline-block; background:rgba(212,175,55,0.12); border:1px solid rgba(212,175,55,0.3); color:var(--primary-accent); border-radius:20px; padding:1px 9px; font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-left:6px; }
        .dev-card { display:flex; gap:1.25rem; align-items:flex-start; }
        .dev-avatar { width:64px; height:64px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,#1a0b2e,#2e1060); border:2px solid rgba(212,175,55,0.35); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:1.5rem; font-weight:800; color:var(--primary-accent); }
        .dev-info h4 { font-size:1.05rem; margin:0 0 2px; }
        .dev-info .dev-role { font-size:0.78rem; color:rgba(255,255,255,0.45); margin-bottom:8px; }
        .dev-bio { font-size:0.83rem; color:rgba(255,255,255,0.65); line-height:1.55; margin-bottom:10px; }
        .dev-socials { display:flex; gap:8px; }
        .dev-social-link { width:30px; height:30px; border-radius:50%; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.5); font-size:0.78rem; text-decoration:none; transition:all 0.2s; }
        .dev-social-link:hover { background:rgba(255,255,255,0.14); color:#fff; }
        .btn-gold-page { background:linear-gradient(135deg,var(--primary-accent),#b8901b); color:#000; font-family:'Space Grotesk',sans-serif; font-weight:800; border:none; border-radius:50px; padding:0.9rem 2.5rem; text-transform:uppercase; letter-spacing:2px; font-size:1rem; box-shadow:0 0 20px rgba(212,175,55,0.4); transition:all 0.3s ease; text-decoration:none; display:inline-flex; align-items:center; gap:8px; }
        .btn-gold-page:hover { transform:scale(1.05); box-shadow:0 0 30px rgba(212,175,55,0.8); color:#000; }
        @media (max-width:480px) { .feature-grid { grid-template-columns:1fr; } .dev-card { flex-direction:column; } }
    </style>
</head>
<body>

<canvas id="bg-canvas"></canvas>

<div id="page-content">
    <div class="container" style="max-width:620px;">

        <!-- Nav -->
        <nav class="page-nav">
            <a href="<?= url() ?>" class="brand"><i class="fas fa-bolt"></i> MATH TRAINER</a>
            <a href="<?= url() ?>" class="btn-back"><i class="fas fa-chevron-left"></i> Play</a>
        </nav>

        <!-- Hero -->
        <div class="text-center mb-4">
            <h1 style="font-size:clamp(2rem,7vw,3rem); color:var(--primary-accent); text-shadow:0 0 20px rgba(212,175,55,0.5); margin-bottom:0.4rem;">
                About MathTrainer
            </h1>
            <p style="color:rgba(255,255,255,0.45); font-size:0.9rem; margin:0;">
                Making math learning fast, fun and addictive
            </p>
        </div>

        <!-- Mission -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-bullseye"></i> Our Mission</div>
            <p style="font-size:0.95rem; color:rgba(255,255,255,0.8); line-height:1.7; margin:0;">
                To make math learning <strong style="color:#fff;">super easy</strong> through beautiful animation,
                adaptive challenges, and game-based experiences — for
                <strong style="color:#fff;">growing kids</strong> who are building their foundation, and
                <strong style="color:#fff;">anyone</strong> who wants to sharpen their mental math speed.
            </p>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.5); line-height:1.65; margin-top:1rem; margin-bottom:0;">
                Right now MathTrainer starts with a speed game. But the bigger vision is a full animated
                learning platform — with guided lessons, interactive content, topic-specific drills, and
                challenges that make even the trickiest math feel like play.
            </p>
        </div>

        <!-- What's Inside -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-circle-check"></i> What's Inside Today</div>
            <div class="feature-grid">
                <div class="feature-item"><i class="fas fa-bolt"></i><span>60-second speed rounds</span></div>
                <div class="feature-item"><i class="fas fa-layer-group"></i><span>7 adaptive levels per operation</span></div>
                <div class="feature-item"><i class="fas fa-plus-minus"></i><span>All 4 math operations</span></div>
                <div class="feature-item"><i class="fas fa-star"></i><span>Level-based scoring system</span></div>
                <div class="feature-item"><i class="fas fa-trophy"></i><span>Personal best tracking</span></div>
                <div class="feature-item"><i class="fas fa-clock-rotate-left"></i><span>Score history (last 5)</span></div>
                <div class="feature-item"><i class="fas fa-mobile-screen"></i><span>Mobile-first design</span></div>
                <div class="feature-item"><i class="fas fa-lock-open"></i><span>No sign-up required</span></div>
            </div>
        </div>

        <!-- Roadmap -->
        <div class="page-card">
            <div class="section-badge cyan"><i class="fas fa-road"></i> What's Coming</div>
            <div class="roadmap-item">
                <div class="roadmap-icon" style="background:rgba(212,175,55,0.1);color:var(--primary-accent);"><i class="fas fa-film"></i></div>
                <div class="roadmap-text">
                    <strong>Animated Learning Content <span class="soon-badge">Soon</span></strong>
                    <span>Step-by-step animated lessons for kids covering core math topics</span>
                </div>
            </div>
            <div class="roadmap-item">
                <div class="roadmap-icon" style="background:rgba(0,243,255,0.1);color:var(--neon-cyan);"><i class="fas fa-bullseye"></i></div>
                <div class="roadmap-text">
                    <strong>Topic-Specific Training</strong>
                    <span>Fractions, percentages, algebra — focused drill modes</span>
                </div>
            </div>
            <div class="roadmap-item">
                <div class="roadmap-icon" style="background:rgba(191,163,255,0.1);color:#bfa3ff;"><i class="fas fa-ranking-star"></i></div>
                <div class="roadmap-text">
                    <strong>Global Leaderboards</strong>
                    <span>Compete with players around the world in daily challenges</span>
                </div>
            </div>
            <div class="roadmap-item">
                <div class="roadmap-icon" style="background:rgba(255,179,198,0.1);color:#ffb3c6;"><i class="fas fa-medal"></i></div>
                <div class="roadmap-text">
                    <strong>Achievements &amp; Badges</strong>
                    <span>Unlock rewards as you hit milestones and master operations</span>
                </div>
            </div>
            <div class="roadmap-item">
                <div class="roadmap-icon" style="background:rgba(0,255,128,0.1);color:#00ff80;"><i class="fas fa-users"></i></div>
                <div class="roadmap-text">
                    <strong>Multiplayer Challenges</strong>
                    <span>Real-time head-to-head math battles</span>
                </div>
            </div>
        </div>

        <!-- Developer -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-code"></i> Built By</div>
            <div class="dev-card">
                <div class="dev-avatar">J</div>
                <div class="dev-info">
                    <h4>Jordan Blake</h4>
                    <div class="dev-role">Full-Stack Developer &amp; UX Designer &bull; Remote</div>
                    <p class="dev-bio">
                        Passionate about building educational tools that make learning feel like play.
                        MathTrainer was born from a simple belief — math isn't boring, it just needs
                        to be presented the right way.
                    </p>
                    <div class="dev-socials">
                        <a href="#" class="dev-social-link" title="GitHub"><i class="fab fa-github"></i></a>
                        <a href="#" class="dev-social-link" title="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="dev-social-link" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
        </div>

        <!-- CTA -->
        <div class="text-center mt-4">
            <a href="<?= url() ?>" class="btn-gold-page">
                <i class="fas fa-play"></i> Start Playing
            </a>
        </div>

    </div>
</div>

<?php
$galaxy_mode = 'full';
require_once PATH_INCLUDES . '/galaxy.php';
?>
</body>
</html>
