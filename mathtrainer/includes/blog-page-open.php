<?php
/**
 * includes/blog-page-open.php
 * ─────────────────────────────────────────────────────────────
 * Reusable opening shell for blog articles and content pages.
 * Variables to set BEFORE including:
 *   $page            — meta array (passed through to head.php)
 *   $nav_back_url    — href for back button  (default: home)
 *   $nav_back_label  — label for back button (default: 'Home')
 *   $header_title    — visible h1 (required)
 *   $header_subtitle — optional sub-line
 *   $page_schema_json — JSON-LD string (optional, for SEO schema)
 * ─────────────────────────────────────────────────────────────
 */

$nav_back_url    = $nav_back_url    ?? '';
$nav_back_label  = $nav_back_label  ?? 'Home';
$header_title    = $header_title    ?? '';
$header_subtitle = $header_subtitle ?? '';
$page_schema_json = $page_schema_json ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <link rel="stylesheet" href="<?= asset('css/blog.css') ?>">
    <?php if (!empty($page_schema_json)): ?>
    <script type="application/ld+json"><?= $page_schema_json ?></script>
    <?php endif; ?>
</head>
<body>

<canvas id="bg-canvas"></canvas>

<div id="page-content">
    <div class="container" style="max-width:760px;">

        <nav class="page-nav">
            <a href="<?= url() ?>" class="brand"><i class="fas fa-bolt"></i> MATH TRAINER</a>
            <a href="<?= url($nav_back_url) ?>" class="btn-back">
                <i class="fas fa-chevron-left"></i> <?= e($nav_back_label) ?>
            </a>
        </nav>
