<?php
/**
 * config/config.php
 * ─────────────────────────────────────────────────────────────
 * Central configuration file.
 * Every page includes this first via:
 *   require_once __DIR__ . '/../../config/config.php';
 *   (path is relative to the file including it)
 * Provides:
 *   - Constants: BASE_URL, ASSETS_URL, APP_NAME …
 *   - Helper functions: asset(), url(), is_dev()
 *   - Loads private/env.php (outside web root)
 * ─────────────────────────────────────────────────────────────
 */

// ── 1. Guard against direct web access ───────────────────────
// (Belt-and-suspenders: the file shouldn't be reachable anyway,
// but this stops it being included more than once.)
if (defined('APP_CONFIGURED')) {
    return;
}
define('APP_CONFIGURED', true);

// ── 2. Load private environment variables ────────────────────
// __DIR__ is the config/ folder.
// Go one level up (..) then into private/.
$envFile = __DIR__ . '/../private/env.php';
if (file_exists($envFile)) {
    require_once $envFile;
} else {
    // Fallback: set safe defaults so the site doesn't crash
    $_ENV['APP_ENV']  = 'production';
    $_ENV['APP_NAME'] = 'MathTrainer';
    $_ENV['APP_URL']  = 'https://mathtrainer.net';
}

// ── 3. Core constants ────────────────────────────────────────

/** Current environment: 'development' or 'production' */
define('APP_ENV',  $_ENV['APP_ENV']);

/** Human-readable site name */
define('APP_NAME', $_ENV['APP_NAME']);

/**
 * Full canonical URL — no trailing slash.
 *
 * Auto-detected from $_SERVER so the site works out-of-the-box on localhost
 * (e.g. http://localhost/mathtrainer/public_html) without changing env.php.
 * On production the detected URL matches APP_URL anyway.
 */
if (!empty($_SERVER['HTTP_HOST'])) {
    $scheme    = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host      = $_SERVER['HTTP_HOST'];
    $publicDir = realpath(__DIR__ . '/../public_html');
    $docRoot   = rtrim(realpath($_SERVER['DOCUMENT_ROOT'] ?? ''), '/');

    if ($publicDir && $docRoot && str_starts_with($publicDir, $docRoot)) {
        // Compute the web-root-relative path to public_html
        $webPath = str_replace($docRoot, '', $publicDir);
        define('BASE_URL', rtrim($scheme . '://' . $host . $webPath, '/'));
    } else {
        define('BASE_URL', rtrim($scheme . '://' . $host, '/'));
    }
} else {
    // CLI or env where $_SERVER is unavailable — fall back to env.php value
    define('BASE_URL', rtrim($_ENV['APP_URL'], '/'));
}

/**
 * URL to the public assets folder — same as BASE_URL since CSS/JS sit
 * directly under public_html/css/ and public_html/js/.
 */
define('ASSETS_URL', BASE_URL);

/** Path to the public_html directory on disk */
define('PUBLIC_PATH', realpath(__DIR__ . '/../public_html'));

// ── 4. Environment helpers ───────────────────────────────────

/**
 * Returns true when running locally / in development.
 * Useful for showing verbose errors, disabling analytics, etc.
 */
function is_dev(): bool {
    return APP_ENV === 'development';
}

// ── 5. Error reporting ───────────────────────────────────────
if (is_dev()) {
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
    error_reporting(0);
}

// ── 6. Asset & URL helpers ───────────────────────────────────

/**
 * asset($path)
 * Returns the full URL to a public asset.
 * Usage:
 *   asset('css/style.css')        → https://mathtrainer.net/css/style.css
 *   asset('js/script.js')         → https://mathtrainer.net/js/script.js
 *   asset('favicon.svg')          → https://mathtrainer.net/favicon.svg
 */
function asset(string $path): string {
    return ASSETS_URL . '/' . ltrim($path, '/');
}

/**
 * url($path)
 * Returns the full URL to a page.
 * Usage:
 *   url('about/')           → https://mathtrainer.net/about/
 *   url('howitworks.php')   → https://mathtrainer.net/howitworks.php
 *   url()                   → https://mathtrainer.net/
 */
function url(string $path = ''): string {
    return BASE_URL . '/' . ltrim($path, '/');
}

/**
 * e($string)
 * Short alias for htmlspecialchars() — use this when outputting
 * ANY user-supplied or dynamic data into HTML to prevent XSS.
 * Usage:
 *   echo e($user_input);
 */
function e(string $str): string {
    return htmlspecialchars($str, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// ── 7. CSRF token helper ─────────────────────────────────────

/**
 * csrf_token()
 * Returns (and creates if missing) a per-session CSRF token.
 * Include in every POST form as a hidden input.
 */
function csrf_token(): string {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * csrf_verify()
 * Call at the top of any form-processing script.
 * Exits with 403 if the token is missing or invalid.
 */
function csrf_verify(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $token = $_POST['csrf_token'] ?? '';
    if (empty($token) || !hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        http_response_code(403);
        exit('Forbidden: invalid CSRF token.');
    }
}
