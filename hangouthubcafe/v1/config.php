<?php
/**
 * Hangout Hub Cafe — App Config
 * --------------------------------
 * This file lives ONE LEVEL ABOVE public_html so it is
 * never directly accessible via the browser.
 *
 * On Hostinger: ~/config.php  (not inside public_html/)
 * On local dev:  hangouthubcafe/v1/config.php
 *
 * DO NOT commit real credentials. Add this file to .gitignore.
 */

// ── Database ───────────────────────────────────────────────────────────────
define('DB_HOST',    'localhost');
define('DB_NAME',    'u321385075_hhcafe');       // e.g. u123456789_hangouthub
define('DB_USER',    'u321385075_hhc_admin');       // e.g. u123456789_hh
define('DB_PASS',    'Hhc_admin#786#01');
define('DB_CHARSET', 'utf8mb4');

// ── Mail ───────────────────────────────────────────────────────────────────
define('MAIL_RECIPIENTS',   ['tnasmp2011@gmail.com']);
define('MAIL_FROM_NAME',    'Hangout Hub Cafe');
define('MAIL_FROM_ADDRESS', 'hello@hangouthubcafe.com');

// ── Rate Limiting ──────────────────────────────────────────────────────────
define('RATE_LIMIT_MAX',    10);   // max requests per window
define('RATE_LIMIT_WINDOW', 300);  // seconds (5 min)

// ── Telegram Notifications ─────────────────────────────────────────────────
// Leave empty strings to disable Telegram notifications.
// Setup: see includes/telegram.php for step-by-step instructions.
define('TELEGRAM_BOT_TOKEN', '8922300745:AAHkVE7H7rQ0wrtB881JQkgA04EuAo5oNhs');   // e.g. '7123456789:AAF0xxxxxxxxxxxxxxxxxxxxxxxxxxx'
define('TELEGRAM_CHAT_ID',   '-1003930415262');   // e.g. '-1001234567890'  (note the minus sign for groups)

// ── Allowed Origins (CORS / origin check) ─────────────────────────────────
define('ALLOWED_ORIGINS', [
    'https://hangouthubcafe.com',
    'https://www.hangouthubcafe.com',
]);
