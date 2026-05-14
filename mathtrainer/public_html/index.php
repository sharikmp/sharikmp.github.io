<?php
/**
 * public_html/index.php
 * Main game page — the landing screen, gameplay and results.
 * Path to config from here:
 *   public_html/ → up one level → config/config.php
 */
require_once __DIR__ . '/../config/config.php';

// Constant for this file's depth so includes know where they live
define('PATH_INCLUDES', __DIR__ . '/../includes');

$startFromHiw = isset($_COOKIE['mt_start_game_next_load']) && $_COOKIE['mt_start_game_next_load'] === '1';
if ($startFromHiw) {
    setcookie('mt_start_game_next_load', '', time() - 3600, '/');
}

// ── Page-specific meta ───────────────────────────────────────
$page = [
    'title'       => 'MathTrainer &mdash; Free Adaptive Mental Math Game | Train Speed &amp; Precision',
    'description' => 'MathTrainer is a free adaptive mental math game. Practice addition, subtraction, multiplication and division at speed. Level up as you improve — no download, no sign-up needed.',
    'canonical'   => url(),
    'og_title'    => 'MathTrainer — Free Adaptive Mental Math Game',
    'og_desc'     => 'Practice mental math at speed. Adaptive difficulty levels, 4 operations, and instant scoring. Free to play, no sign-up needed.',
    // Inline CSS lives only on this page (game-specific vars already in style.css)
    'extra_css'   => '',
];

// ── JSON-LD structured data (only on home page) ──────────────
$json_ld = json_encode([
    '@context'            => 'https://schema.org',
    '@type'               => 'WebApplication',
    'name'                => 'MathTrainer',
    'url'                 => BASE_URL,
    'description'         => 'Free adaptive mental math game for kids and adults.',
    'applicationCategory' => 'EducationalApplication',
    'genre'               => 'Educational Game',
    'operatingSystem'     => 'Web Browser',
    'browserRequirements' => 'Requires JavaScript. Recommended: Chrome 90+, Firefox 88+, Safari 14+',
    'inLanguage'          => 'en',
    'isAccessibleForFree' => true,
    'offers'              => ['@type' => 'Offer', 'price' => '0', 'priceCurrency' => 'USD'],
    'creator'             => ['@type' => 'Organization', 'name' => 'MathTrainer', 'url' => BASE_URL],
    'featureList'         => [
        'Adaptive difficulty — 7 levels per operation',
        '4 mathematical operations',
        'Independent level progression',
        '60-second speed rounds',
        'Personal best tracking',
        'Mobile-first design',
    ],
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
<!DOCTYPE html>
<html lang="en" class="<?= $startFromHiw ? 'start-game-from-hiw' : '' ?>">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>

    <script>
        window.__MT_START_FROM_HIW = <?= $startFromHiw ? 'true' : 'false' ?>;
    </script>

    <!-- Structured Data (home page only) -->
    <script type="application/ld+json"><?= $json_ld ?></script>

    <!-- Main stylesheet -->
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
</head>
<body>

    <!-- ===================== FULL-PAGE LOADER ===================== -->
    <div id="loader-screen">
        <canvas id="loader-star-canvas"></canvas>
        <div id="loader-content">
            <div class="loader-brand-wrap" aria-label="MATH TRAINER">
                <div class="loader-brand-bg">MATH<br>TRAINER</div>
                <div class="loader-brand-fill" id="loader-brand-fill">MATH<br>TRAINER</div>
            </div>
            <div class="loader-ring-wrap">
                <svg class="loader-ring-svg" viewBox="0 0 120 120">
                    <circle class="loader-ring-track"    cx="60" cy="60" r="50"/>
                    <circle class="loader-ring-progress" id="loader-ring-progress" cx="60" cy="60" r="50"/>
                </svg>
                <span class="loader-ring-pct" id="loader-ring-pct">0%</span>
            </div>
            <div class="loader-status-msg" id="loader-status-msg">Loading...</div>
        </div>
    </div>

    <!-- 3D Background Canvas -->
    <canvas id="bg-canvas"></canvas>

    <!-- UI Overlay -->
    <div id="ui-layer">

        <!-- Timer Bar (hidden initially) -->
        <div class="timer-container" id="timer-container" style="display:none;">
            <div id="timer-bar"></div>
        </div>

        <!-- ── View 1: Hero / Landing ─────────────────────────── -->
        <section id="view-landing" class="view-section interactive-layer">
            <div class="container text-center">
                <h1 class="display-1 text-glow mb-2" style="font-weight:800;">MATH TRAINER</h1>
                <p class="lead text-light mb-4 fs-4">Train Speed. Sharpen Precision.</p>

                <!-- Level & Best Score display -->
                <div class="landing-stats mb-4">
                    <div class="landing-stat-item">
                        <span class="landing-stat-label">Levels (+&minus;&times;&divide;)</span>
                        <span class="landing-stat-value" id="landing-levels">1-1-1-1</span>
                    </div>
                    <div class="landing-stat-divider"></div>
                    <div class="landing-stat-item">
                        <span class="landing-stat-label">Best Score</span>
                        <span class="landing-stat-value" id="landing-pb">0</span>
                    </div>
                </div>

                <div class="d-flex gap-3 justify-content-center align-items-center flex-wrap">
                    <a href="<?= url('learn/') ?>" class="btn btn-gold">
                        <i class="fas fa-book-open"></i> Learn
                    </a>
                    <a href="<?= url('howitworks.php') ?>" class="btn btn-hiw" id="btn-how-it-works">
                        <i class="fas fa-circle-info"></i> How it works
                    </a>
                    <button class="btn btn-gold pulse" id="btn-start">
                        <i class="fas fa-bolt"></i> Play Now
                    </button>
                </div>
            </div>
        </section>

        <!-- ── View 2: Active Gameplay ────────────────────────── -->
        <section id="view-game" class="view-section interactive-layer">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-8 col-lg-6">

                        <div class="d-flex justify-content-between align-items-center mb-3 px-2">
                            <button class="btn-game-home" id="btn-home-game" title="Home">
                                <i class="fas fa-house"></i>
                            </button>
                            <div class="stat-badge">
                                <i class="fas fa-star text-warning"></i>
                                <span id="ui-score">0</span>
                            </div>
                            <div class="stat-badge game-level-badge">
                                <span id="ui-levels">1-1-1-1</span>
                            </div>
                            <div class="stat-badge">
                                <i class="fas fa-fire text-danger"></i>
                                <span id="ui-streak">0</span>
                            </div>
                        </div>

                        <div class="glass-panel text-center py-5 px-3">
                            <div id="math-problem" class="math-font text-white">0 + 0</div>
                            <input type="number" id="math-input" inputmode="none"
                                   autocomplete="off" placeholder="=">
                        </div>

                        <!-- Custom Number Keyboard -->
                        <div id="num-keyboard">
                            <div class="num-keyboard-grid">
                                <button class="key-btn" data-key="7">7</button>
                                <button class="key-btn" data-key="8">8</button>
                                <button class="key-btn" data-key="9">9</button>
                                <button class="key-btn" data-key="4">4</button>
                                <button class="key-btn" data-key="5">5</button>
                                <button class="key-btn" data-key="6">6</button>
                                <button class="key-btn" data-key="1">1</button>
                                <button class="key-btn" data-key="2">2</button>
                                <button class="key-btn" data-key="3">3</button>
                                <button class="key-btn key-clear"     data-key="clear">CLR</button>
                                <button class="key-btn"               data-key="0">0</button>
                                <button class="key-btn key-backspace" data-key="backspace">
                                    <i class="fas fa-delete-left"></i>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>

        <!-- ── View 3: Post-Game Dashboard ───────────────────── -->
        <section id="view-results" class="view-section interactive-layer">
            <div class="container text-center">
                <div class="row justify-content-center">
                    <div class="col-md-8 col-lg-6">
                        <div class="glass-panel p-4" id="results-card">
                            <h3 class="mb-4">
                                Final Score:
                                <span id="final-score" class="text-glow" style="font-size:3rem;">0</span>
                                <span id="pb-crown-badge" class="pb-crown-inline" style="display:none;" title="New Personal Best!"><i class="fas fa-crown"></i></span>
                            </h3>

                            <div class="row g-3 mb-4">
                                <div class="col-4">
                                    <div class="data-tile">
                                        <div class="x-small text-muted mb-1 text-uppercase">Ques</div>
                                        <div class="fs-2 fw-bold" style="color:#fff;">
                                            <span id="final-qpm">0</span>
                                            <small class="fs-6 text-muted"></small>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="data-tile">
                                        <div class="x-small text-muted mb-1 text-uppercase">Accuracy</div>
                                        <div class="fs-2 fw-bold" style="color:#fff;">
                                            <span id="final-accuracy">0</span>%
                                        </div>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="data-tile">
                                        <div class="x-small text-muted mb-1 text-uppercase">LEVEL</div>
                                        <div class="fs-2 fw-bold" style="color:var(--primary-accent);">
                                            <span id="final-overall-lvl">1</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Milestone Badges -->
                            <div class="milestone-badges-row mb-3" id="milestone-badges"></div>
                        </div><!-- /results-card -->

                        <div class="mt-4">
                            <div class="d-flex gap-2 justify-content-center mb-3">
                                <a href="<?= url('learn/') ?>" class="btn btn-results-outline">
                                    <i class="fas fa-book-open"></i> Learn
                                </a>
                                <button class="btn btn-results-primary" id="btn-replay">
                                    <i class="fas fa-rotate-right"></i> Go Again
                                </button>
                            </div>
                            <div class="d-flex gap-3 justify-content-center">
                                <button class="btn-icon-round" id="btn-home-result"    title="Home">
                                    <i class="fas fa-house"></i>
                                </button>
                                <button class="btn-icon-round" id="btn-share-wa"       title="WhatsApp">
                                    <i class="fab fa-whatsapp"></i>
                                </button>
                                <button class="btn-icon-round" id="btn-share-download" title="Save Card">
                                    <i class="fas fa-download"></i>
                                </button>
                                <button class="btn-icon-round" id="btn-share-native"   title="Share">
                                    <i class="fas fa-share-nodes"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Level Up Toast (mid-game) -->
        <div id="levelup-toast" class="levelup-toast" style="display:none;">
            <i class="fas fa-arrow-trend-up"></i>
            &nbsp;Level Up!&nbsp;<strong id="levelup-op-name"></strong>
            &rarr; Lv.<strong id="levelup-new-level"></strong>
        </div>

        <!-- Site Footer -->
        <?php require_once PATH_INCLUDES . '/footer.php'; ?>

    </div><!-- /ui-layer -->

    <!-- ── Scripts ──────────────────────────────────────────── -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="<?= asset('js/loader.js') ?>"></script>
    <script src="<?= asset('js/script.js') ?>?v=<?= filemtime(__DIR__ . '/js/script.js') ?>"></script>

</body>
</html>
