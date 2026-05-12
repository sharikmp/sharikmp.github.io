<?php

// Defaults
$page = array_merge([
    'title'       => APP_NAME . ' — Free Adaptive Mental Math Game',
    'description' => 'MathTrainer is a free adaptive mental math game. Practice addition, subtraction, multiplication and division at speed.',
    'canonical'   => url(),
    'og_title'    => '',
    'og_desc'     => '',
    'extra_css'   => '',
], $page ?? []);

$og_title = $page['og_title'] ?: $page['title'];
$og_desc  = $page['og_desc']  ?: $page['description'];
?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- Primary Meta -->
    <title><?= e($page['title']) ?></title>
    <meta name="description" content="<?= e($page['description']) ?>">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#1a0b2e">
    <meta name="application-name" content="<?= APP_NAME ?>">
    <meta name="msapplication-TileColor" content="#1a0b2e">
    <link rel="canonical" href="<?= e($page['canonical']) ?>">
    <link rel="sitemap" type="application/xml" href="<?= url('sitemap.xml') ?>">

    <!-- Favicon -->
    <link rel="icon" href="<?= asset('favicon.svg') ?>" type="image/svg+xml">
    <link rel="apple-touch-icon" href="<?= asset('favicon.svg') ?>">

    <!-- Open Graph -->
    <meta property="og:type"        content="website">
    <meta property="og:url"         content="<?= e($page['canonical']) ?>">
    <meta property="og:title"       content="<?= e($og_title) ?>">
    <meta property="og:description" content="<?= e($og_desc) ?>">
    <meta property="og:image"       content="<?= asset('og-image.jpg') ?>">
    <meta property="og:site_name"   content="<?= APP_NAME ?>">
    <meta property="og:locale"      content="en_US">

    <!-- Twitter Card -->
    <meta name="twitter:card"        content="summary_large_image">
    <meta name="twitter:url"         content="<?= e($page['canonical']) ?>">
    <meta name="twitter:title"       content="<?= e($og_title) ?>">
    <meta name="twitter:description" content="<?= e($og_desc) ?>">
    <meta name="twitter:image"       content="<?= asset('og-image.jpg') ?>">

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">

    <?php if (!empty($page['extra_css'])): ?>
    <style>
        <?= $page['extra_css'] ?>
    </style>
    <?php endif; ?>
