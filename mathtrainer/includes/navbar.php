<?php
/**
 * includes/navbar.php
 * ─────────────────────────────────────────────────────────────
 * Simple branded top-bar used on inner pages (How It Works,
 * About, Contact).  NOT used on index.php (the game embeds
 * its own footer-only layout).
 * Usage:
 *   $nav_back_url   = url();
 *   $nav_back_label = 'Home';
 *   require_once PATH_INCLUDES . '/navbar.php';
 * ─────────────────────────────────────────────────────────────
 */

$nav_back_url   = $nav_back_url   ?? url();
$nav_back_label = $nav_back_label ?? 'Play';
$nav_close      = $nav_close      ?? false;
?>
<nav class="page-nav">
    <!-- Brand / logo -->
    <a href="<?= e($nav_back_url) ?>" class="brand">
        <i class="fas fa-bolt"></i> MATH TRAINER
    </a>

    <!-- Back / close button -->
    <?php if ($nav_close): ?>
    <a href="<?= e($nav_back_url) ?>" class="btn-close-hiw" title="Back">
        <i class="fas fa-xmark"></i>
    </a>
    <?php else: ?>
    <a href="<?= e($nav_back_url) ?>" class="btn-back">
        <i class="fas fa-chevron-left"></i> <?= e($nav_back_label) ?>
    </a>
    <?php endif; ?>
</nav>
