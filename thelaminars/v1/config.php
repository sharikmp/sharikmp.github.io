<?php

// ── Grand Opening Popup ─────────────────────────────────────────────────────
// Set to true to show the popup, false to hide it completely.
define('SHOW_OPENING_POPUP', false);

// ── Mail recipients ───────────────────────────────────────────────────────────
define('MAIL_RECIPIENTS', [
    'sharik.madhyapradeshi@gmail.com',
    'info@thelaminars.com',
    'tamkeenatnaaz@gmail.com'
]);

// ── Sender identity ───────────────────────────────────────────────────────────
define('MAIL_FROM_NAME',    'The Laminars');
define('MAIL_FROM_ADDRESS', 'info@thelaminars.com');   // must match your hosting domain

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Max submissions allowed per IP within the window below.
define('RATE_LIMIT_MAX',     3);    // submissions
define('RATE_LIMIT_WINDOW',  300);  // seconds (5 minutes)

// ── Allowed origins (CORS / referer check) ───────────────────────────────────
define('ALLOWED_ORIGINS', [
    'https://www.thelaminars.com',
    'https://thelaminars.com',
]);

// ── Example: if you ever add reCAPTCHA ───────────────────────────────────────
// define('RECAPTCHA_SECRET', 'your-secret-key-here');

// ── Example: if you ever connect to a database ───────────────────────────────
// define('DB_HOST', 'localhost');
// define('DB_NAME', 'your_db_name');
// define('DB_USER', 'your_db_user');
// define('DB_PASS', 'your_db_password');
