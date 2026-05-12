<?php
/**
 * includes/header.php
 * ─────────────────────────────────────────────────────────────
 * Page-level hero header / title block used on inner pages.
 * Optional variables (set before including):
 *   $header_title    — Main H1 text          (required)
 *   $header_subtitle — Sub-text below title  (optional)
 *
 * Usage:
 *   $header_title    = 'About MathTrainer';
 *   $header_subtitle = 'Making math learning fast, fun and addictive';
 *   require_once PATH_INCLUDES . '/header.php';
 * ─────────────────────────────────────────────────────────────
 */

$header_title    = $header_title    ?? APP_NAME;
$header_subtitle = $header_subtitle ?? '';
?>
<div class="text-center mb-4">
    <h1 style="font-size:clamp(2rem,7vw,3rem); color:var(--primary-accent);
               text-shadow:0 0 20px rgba(212,175,55,0.5); margin-bottom:0.4rem;">
        <?= e($header_title) ?>
    </h1>
    <?php if ($header_subtitle): ?>
    <p style="color:rgba(255,255,255,0.45); font-size:0.9rem; margin:0;">
        <?= e($header_subtitle) ?>
    </p>
    <?php endif; ?>
</div>
