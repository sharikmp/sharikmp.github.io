<?php

// ── App environment ──────────────────────────────────────────
// Change to 'production' on a live server.
$_ENV['APP_ENV'] = 'development';

// ── Site ─────────────────────────────────────────────────────
$_ENV['APP_NAME']    = 'MathTrainer';
$_ENV['APP_URL']     = 'https://mathtrainer.net';   // no trailing slash
$_ENV['APP_VERSION'] = '1.0.0';

// ── Email / SMTP credentials ─────────────────────────────────
// Used by contact.php when sending emails.
$_ENV['SMTP_HOST']     = 'smtp.example.com';
$_ENV['SMTP_PORT']     = '587';
$_ENV['SMTP_USER']     = 'hello@mathtrainer.net';
$_ENV['SMTP_PASSWORD'] = 'REPLACE_WITH_REAL_PASSWORD';   // ← never commit real value
$_ENV['CONTACT_TO']    = 'hello@mathtrainer.net';

// ── Database (placeholder — not used yet) ────────────────────
$_ENV['DB_HOST']     = 'localhost';
$_ENV['DB_NAME']     = 'mathtrainer_db';
$_ENV['DB_USER']     = 'db_user';
$_ENV['DB_PASSWORD'] = 'REPLACE_WITH_REAL_DB_PASSWORD';

// ── Secret tokens ────────────────────────────────────────────
// Used for CSRF protection, API signing, etc.
// Generate a strong random value: php -r "echo bin2hex(random_bytes(32));"
$_ENV['APP_SECRET'] = 'REPLACE_WITH_32_BYTE_HEX_STRING';

// ── Analytics (optional) ─────────────────────────────────────
$_ENV['GA_MEASUREMENT_ID'] = '';   // e.g. G-XXXXXXXXXX
$_ENV['ADSENSE_PUB_ID']    = '';   // e.g. pub-XXXXXXXXXXXXXXXX
