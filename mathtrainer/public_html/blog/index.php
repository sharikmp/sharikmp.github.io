<?php
/**
 * public_html/blog/index.php
 * Blog / Articles home page — lists all 10 articles.
 */
require_once __DIR__ . '/../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../includes');

$articles = [
    [
        'slug'     => 'improve-mental-math-speed',
        'icon'     => 'fa-gauge-high',
        'title'    => 'How to Improve Mental Math Speed: 7 Science-Backed Tips',
        'desc'     => 'Practical techniques grounded in cognitive science to help you calculate faster — without a calculator.',
        'category' => 'Tips & Techniques',
        'read'     => '6 min read',
    ],
    [
        'slug'     => 'mental-math-for-kids',
        'icon'     => 'fa-child-reaching',
        'title'    => 'Why Mental Math Matters for Your Child\'s Future',
        'desc'     => 'Research shows early mental arithmetic skills predict academic success. Here\'s what the science says and how to help.',
        'category' => 'Kids & Education',
        'read'     => '5 min read',
    ],
    [
        'slug'     => 'addition-tricks',
        'icon'     => 'fa-plus',
        'title'    => 'Mental Addition Tricks That Make Arithmetic Instant',
        'desc'     => 'From left-to-right addition to the compensation method — master these and you\'ll never reach for a calculator again.',
        'category' => 'Tips & Techniques',
        'read'     => '5 min read',
    ],
    [
        'slug'     => 'multiplication-shortcuts',
        'icon'     => 'fa-xmark',
        'title'    => 'Fast Multiplication Tricks You Wish You Learned in School',
        'desc'     => 'Multiply large numbers in seconds using doubling-halving, the grid method, and more mental shortcuts.',
        'category' => 'Tips & Techniques',
        'read'     => '6 min read',
    ],
    [
        'slug'     => 'division-mental-math',
        'icon'     => 'fa-divide',
        'title'    => 'Mental Division Made Simple: Proven Techniques',
        'desc'     => 'Division is the operation most people avoid. These strategies make it approachable and fast.',
        'category' => 'Tips & Techniques',
        'read'     => '5 min read',
    ],
    [
        'slug'     => 'daily-math-practice',
        'icon'     => 'fa-calendar-check',
        'title'    => 'Why 5 Minutes of Daily Math Practice Beats 1 Hour a Week',
        'desc'     => 'The power of distributed practice — how short daily sessions build deeper, more durable math skills.',
        'category' => 'Learning Science',
        'read'     => '5 min read',
    ],
    [
        'slug'     => 'adaptive-learning-math',
        'icon'     => 'fa-brain',
        'title'    => 'How Adaptive Learning Technology Makes Math Training More Effective',
        'desc'     => 'What adaptive difficulty is, why it works, and how MathTrainer uses it to keep you in the learning "sweet spot".',
        'category' => 'Learning Science',
        'read'     => '5 min read',
    ],
    [
        'slug'     => 'mental-math-vs-calculator',
        'icon'     => 'fa-calculator',
        'title'    => 'Mental Math vs Calculator: Why You Still Need to Train Your Brain',
        'desc'     => 'Calculators are everywhere — so why bother with mental math? Here\'s the compelling case for keeping your brain sharp.',
        'category' => 'Learning Science',
        'read'     => '4 min read',
    ],
    [
        'slug'     => 'overcome-math-anxiety',
        'icon'     => 'fa-heart',
        'title'    => 'Overcoming Math Anxiety: A Practical Step-by-Step Guide',
        'desc'     => 'Math anxiety affects millions. Learn what causes it, how it holds you back, and proven strategies to beat it.',
        'category' => 'Mindset',
        'read'     => '6 min read',
    ],
    [
        'slug'     => 'math-games-for-kids',
        'icon'     => 'fa-gamepad',
        'title'    => 'Best Math Games for Kids (And Why Games Beat Worksheets)',
        'desc'     => 'A parent\'s guide to math games that build real skills without the struggle — including what to look for in good math apps.',
        'category' => 'Kids & Education',
        'read'     => '5 min read',
    ],
];

// Blog listing schema
$schemaItems = array_map(fn($a, $i) => [
    '@type'    => 'ListItem',
    'position' => $i + 1,
    'url'      => url('blog/' . $a['slug'] . '.php'),
    'name'     => $a['title'],
], $articles, array_keys($articles));

$page_schema_json = json_encode([
    '@context'        => 'https://schema.org',
    '@type'           => 'ItemList',
    'name'            => 'MathTrainer Blog',
    'description'     => 'Articles and guides on mental math, learning science, and math education.',
    'url'             => url('blog/'),
    'numberOfItems'   => count($articles),
    'itemListElement' => $schemaItems,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$page = [
    'title'       => 'Blog — Mental Math Tips, Learning Science & More | MathTrainer',
    'description' => 'Explore MathTrainer\'s blog: science-backed tips to improve mental math speed, guides for kids, learning strategies, and more.',
    'canonical'   => url('blog/'),
    'og_title'    => 'MathTrainer Blog — Mental Math Guides & Articles',
    'og_desc'     => 'Tips, guides, and learning science articles to help you get faster at mental math.',
];

$nav_back_url   = '';
$nav_back_label = 'Home';
$header_title   = 'Blog';
$header_subtitle = 'Mental math tips, learning science, and guides for every level';

require_once PATH_INCLUDES . '/blog-page-open.php';
?>

        <!-- Breadcrumb -->
        <div class="breadcrumb-row">
            <a href="<?= url() ?>">Home</a>
            <span class="sep">›</span>
            <span>Blog</span>
        </div>

        <!-- Article list -->
        <div class="blog-grid">
            <?php foreach ($articles as $a): ?>
            <a href="<?= url('blog/' . $a['slug'] . '.php') ?>" class="blog-card">
                <div class="blog-card-icon"><i class="fas <?= e($a['icon']) ?>"></i></div>
                <div class="blog-card-body">
                    <div class="blog-card-title"><?= e($a['title']) ?></div>
                    <div class="blog-card-desc"><?= e($a['desc']) ?></div>
                    <div class="blog-card-meta">
                        <span><i class="fas fa-tag"></i> <?= e($a['category']) ?></span>
                        <span><i class="fas fa-clock"></i> <?= e($a['read']) ?></span>
                    </div>
                </div>
                <div class="blog-card-arrow"><i class="fas fa-chevron-right"></i></div>
            </a>
            <?php endforeach; ?>
        </div>

        <!-- Link to FAQ -->
        <div class="page-card" style="text-align:center; margin-top:1.5rem;">
            <div class="section-badge"><i class="fas fa-circle-question"></i> Got questions?</div>
            <p style="color:rgba(255,255,255,0.6); font-size:0.9rem; margin-bottom:1rem;">
                Check our FAQ for quick answers on gameplay, scoring, levels, and more.
            </p>
            <a href="<?= url('faq/') ?>" class="btn-gold-page" style="font-size:0.85rem; padding:0.6rem 1.5rem;">
                <i class="fas fa-circle-question"></i> Read the FAQ
            </a>
        </div>

<?php require_once PATH_INCLUDES . '/blog-page-close.php'; ?>
