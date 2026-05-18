<?php
/**
 * public_html/faq/index.php
 * Frequently Asked Questions — 20 curated Q&As with FAQPage schema.
 */
require_once __DIR__ . '/../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../includes');

$faqs = [
    // ── About the App ──────────────────────────────────────────────
    [
        'cat' => 'About MathTrainer',
        'q'   => 'What is MathTrainer?',
        'a'   => 'MathTrainer is a free, browser-based mental math game that helps you practice addition, subtraction, multiplication, and division at speed. Each round is 60 seconds, and the difficulty adapts automatically to your skill level — no sign-up required.',
    ],
    [
        'cat' => 'About MathTrainer',
        'q'   => 'Is MathTrainer completely free?',
        'a'   => 'Yes — 100% free. There are no paywalls, subscriptions, or premium features. Everything, including the adaptive levels, leaderboard, and learn section, is available to all players.',
    ],
    [
        'cat' => 'About MathTrainer',
        'q'   => 'Do I need to create an account?',
        'a'   => 'No account is needed to play. MathTrainer automatically creates an anonymous player profile stored in your browser, so your progress, levels, and personal best are saved locally without any sign-up.',
    ],
    [
        'cat' => 'About MathTrainer',
        'q'   => 'What math operations does MathTrainer cover?',
        'a'   => 'MathTrainer covers all four core arithmetic operations: addition (+), subtraction (−), multiplication (×), and division (÷). Each operation has its own independent level that advances as you improve.',
    ],
    // ── Gameplay ──────────────────────────────────────────────────
    [
        'cat' => 'Gameplay & Scoring',
        'q'   => 'How long does each game round last?',
        'a'   => 'Each round lasts 60 seconds. During this time you solve as many problems as possible. The timer is displayed as a colour-coded bar at the top of the screen — it turns yellow when 30 seconds remain and red for the final 15 seconds.',
    ],
    [
        'cat' => 'Gameplay & Scoring',
        'q'   => 'How is the score calculated?',
        'a'   => 'Your score for each correct answer equals your current level for that operation multiplied by 10. For example, a correct answer at Level 3 earns 30 points. This means higher-difficulty problems are worth more, rewarding players who push to harder levels.',
    ],
    [
        'cat' => 'Gameplay & Scoring',
        'q'   => 'What is a "streak" and does it affect my score?',
        'a'   => 'A streak counts how many answers you get right in a row without a mistake. While streaks do not currently multiply your score, they are tracked and displayed in real time as a motivational cue. Future updates may introduce streak bonuses.',
    ],
    [
        'cat' => 'Gameplay & Scoring',
        'q'   => 'How is accuracy calculated in results?',
        'a'   => 'Accuracy = (correct answers ÷ total attempts) × 100. Every time you submit a wrong answer it counts as an attempt, so thinking quickly but also carefully gives you the best accuracy score.',
    ],
    // ── Levels & Difficulty ───────────────────────────────────────
    [
        'cat' => 'Levels & Adaptive Difficulty',
        'q'   => 'How does the adaptive difficulty system work?',
        'a'   => 'Each of the four operations starts at Level 1 and advances independently. After every 10 consecutive correct answers for an operation, that operation\'s level increases automatically, introducing larger numbers or more complex combinations. You never get "stuck" — difficulty always matches your current ability.',
    ],
    [
        'cat' => 'Levels & Adaptive Difficulty',
        'q'   => 'How many difficulty levels are there?',
        'a'   => 'There are 7 base levels for each operation, ranging from single-digit problems (Level 1) all the way to multi-digit combinations (Level 7+). Beyond Level 7 the system continues to generate progressively harder problems with no hard cap — MathTrainer grows with you indefinitely.',
    ],
    [
        'cat' => 'Levels & Adaptive Difficulty',
        'q'   => 'What happens when I level up during a game?',
        'a'   => 'A level-up toast notification briefly appears on screen announcing the new level and which operation improved. The next problem for that operation will immediately reflect the higher difficulty.',
    ],
    [
        'cat' => 'Levels & Adaptive Difficulty',
        'q'   => 'Can I practice just one specific operation?',
        'a'   => 'Not as a dedicated mode today — problems are randomly picked from all four operations each round. However, your per-operation level progress is always preserved, so if one operation is weaker your overall gameplay naturally surfaces it more as you improve.',
    ],
    // ── Progress & Data ───────────────────────────────────────────
    [
        'cat' => 'Progress & Data',
        'q'   => 'Is my progress saved automatically?',
        'a'   => 'Yes. Your levels, level progress, personal best score, and lifetime statistics are saved to your browser\'s localStorage after every correct answer. As long as you use the same browser and device, your data persists between sessions even without an account.',
    ],
    [
        'cat' => 'Progress & Data',
        'q'   => 'How do I reset my progress?',
        'a'   => 'You can reset by clearing your browser\'s localStorage for mathtrainer.net. In most browsers go to DevTools → Application → Local Storage → select the site → delete all entries. Note: this action is irreversible.',
    ],
    [
        'cat' => 'Progress & Data',
        'q'   => 'What is the Weekly Leaderboard?',
        'a'   => 'The Weekly Leaderboard shows the top scores submitted by all players during the current rolling 7-day window. You can view scores globally or filtered to your country. At the end of each round your score is automatically submitted — no extra step needed.',
    ],
    // ── Technical ─────────────────────────────────────────────────
    [
        'cat' => 'Technical & Compatibility',
        'q'   => 'Does MathTrainer work on mobile devices?',
        'a'   => 'Yes. MathTrainer is fully mobile-optimised. On smartphones and tablets a custom on-screen number keypad appears automatically so you can answer without the browser\'s native keyboard interfering with the layout.',
    ],
    [
        'cat' => 'Technical & Compatibility',
        'q'   => 'Which browsers are supported?',
        'a'   => 'MathTrainer works in all modern browsers: Chrome, Firefox, Safari, and Edge on both desktop and mobile. The 3-D galaxy background uses Three.js and requires WebGL; on older devices the background may fall back to a simpler effect without any impact on gameplay.',
    ],
    // ── Learning & Improvement ────────────────────────────────────
    [
        'cat' => 'Learning & Improvement',
        'q'   => 'What is the Learn section?',
        'a'   => 'The Learn section contains animated lesson content covering core math topics. It is designed to let players study before practising — watch a concept explained visually, then jump straight into a game to reinforce it.',
    ],
    [
        'cat' => 'Learning & Improvement',
        'q'   => 'Who is MathTrainer designed for?',
        'a'   => 'MathTrainer is built for anyone who wants sharper mental arithmetic, but it is especially well-suited for: school-age children (ages 7-16) building foundational skills; adults who want to re-sharpen number sense; and competitive learners chasing leaderboard rankings.',
    ],
    [
        'cat' => 'Learning & Improvement',
        'q'   => 'How do I improve my score quickly?',
        'a'   => 'Focus on accuracy first — wrong answers waste time and hurt your accuracy stat. Then practise the operation you find hardest until it levels up, since higher-level correct answers earn more points. Daily short sessions of 5-10 minutes are more effective than infrequent long ones.',
    ],
];

// Build FAQPage schema
$schemaEntities = array_map(fn($f) => [
    '@type'          => 'Question',
    'name'           => $f['q'],
    'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f['a']],
], $faqs);

$page_schema_json = json_encode([
    '@context'   => 'https://schema.org',
    '@type'      => 'FAQPage',
    'mainEntity' => $schemaEntities,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$page = [
    'title'       => 'FAQ — Frequently Asked Questions | MathTrainer',
    'description' => 'Got questions about MathTrainer? Find answers to 20 frequently asked questions about gameplay, scoring, levels, progress saving, and more.',
    'canonical'   => url('faq/'),
    'og_title'    => 'MathTrainer FAQ — All Your Questions Answered',
    'og_desc'     => 'Answers to the 20 most-asked questions about MathTrainer: how it works, scoring, levels, leaderboard, and more.',
];

$nav_back_url   = '';
$nav_back_label = 'Home';
$header_title   = 'FAQ';
$header_subtitle = 'Everything you need to know about MathTrainer';

require_once PATH_INCLUDES . '/blog-page-open.php';
?>

        <!-- Breadcrumb -->
        <div class="breadcrumb-row">
            <a href="<?= url() ?>">Home</a>
            <span class="sep">›</span>
            <span>FAQ</span>
        </div>

        <div class="page-card">
            <!-- <div class="section-badge"><i class="fas fa-circle-question"></i> 20 Questions</div> -->

            <?php
            $currentCat = '';
            foreach ($faqs as $i => $faq):
                if ($faq['cat'] !== $currentCat):
                    $currentCat = $faq['cat'];
            ?>
            <div class="faq-category-title"><?= e($currentCat) ?></div>
            <?php endif; ?>

            <div class="faq-item" id="faq-<?= $i ?>">
                <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-<?= $i ?>">
                    <?= e($faq['q']) ?>
                    <i class="fas fa-chevron-down faq-icon"></i>
                </button>
                <div class="faq-answer" id="faq-answer-<?= $i ?>" role="region">
                    <p><?= e($faq['a']) ?></p>
                </div>
            </div>

            <?php endforeach; ?>
        </div>

        <!-- Quick links to articles -->
        <div class="page-card" style="text-align:center;">
            <div class="section-badge cyan"><i class="fas fa-book-open"></i> Want to learn more?</div>
            <p style="color:rgba(255,255,255,0.6); font-size:0.9rem; margin-bottom:1rem;">
                Explore our articles for tips on improving mental math speed, overcoming math anxiety, and more.
            </p>
            <a href="<?= url('blog/') ?>" class="btn-gold-page" style="font-size:0.85rem; padding:0.6rem 1.5rem;">
                <i class="fas fa-newspaper"></i> Read the Blog
            </a>
        </div>

<?php require_once PATH_INCLUDES . '/blog-page-close.php'; ?>

<script>
(function () {
    'use strict';
    document.querySelectorAll('.faq-question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item   = this.closest('.faq-item');
            var isOpen = item.classList.contains('is-open');
            // Close all
            document.querySelectorAll('.faq-item.is-open').forEach(function (el) {
                el.classList.remove('is-open');
                el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            // Toggle clicked
            if (!isOpen) {
                item.classList.add('is-open');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });
}());
</script>
