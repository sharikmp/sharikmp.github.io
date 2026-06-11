<?php
/**
 * Hangout Hub Cafe — Admin Panel Auth Module
 * ───────────────────────────────────────────
 * Provides session management, route guards, CSRF helpers, and security headers.
 * Include at the top of every hhcpanel file.
 */

define('HHC_SESSION_TIMEOUT', 3600);   // 60 min idle
define('HHC_MAX_ATTEMPTS',    5);      // failed logins before lockout
define('HHC_LOCKOUT_MIN',     15);     // lockout duration in minutes

// ── Session start ─────────────────────────────────────────────────────────────
function hhc_session_start(): void {
    if (session_status() !== PHP_SESSION_NONE) return;
    session_start([
        'cookie_httponly' => true,
        'cookie_samesite' => 'Strict',
        'cookie_secure'   => !empty($_SERVER['HTTPS']),
        'use_strict_mode' => 1,
        'gc_maxlifetime'  => HHC_SESSION_TIMEOUT,
    ]);
}

// ── Security headers ──────────────────────────────────────────────────────────
function security_headers(): void {
    header('X-Frame-Options: DENY');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: no-referrer');
    header('Cache-Control: no-store, private');
    header(
        "Content-Security-Policy: default-src 'self'; " .
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " .
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; " .
        "font-src https://fonts.gstatic.com https://cdn.jsdelivr.net; " .
        "img-src 'self' data: blob:; " .
        "connect-src 'self';"
    );
}

// ── Internal: check if session is valid ───────────────────────────────────────
function _hhc_session_valid(): bool {
    if (empty($_SESSION['hhc_uid']))          return false;
    if (empty($_SESSION['hhc_last_active']))  return false;
    if ((time() - (int)$_SESSION['hhc_last_active']) >= HHC_SESSION_TIMEOUT) return false;
    return true;
}

// ── Page guard — redirects to login ──────────────────────────────────────────
function require_auth(): void {
    hhc_session_start();
    security_headers();

    if (!_hhc_session_valid()) {
        // Invalidate session cookie
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $p['path'], $p['domain'], $p['secure'], $p['httponly']);
        }
        $_SESSION = [];
        session_destroy();

        $r = urlencode($_SERVER['REQUEST_URI'] ?? '/hhcpanel/');
        header('Location: /hhcpanel/login.php?r=' . $r);
        exit;
    }

    $_SESSION['hhc_last_active'] = time();
}

// ── API guard — returns 401 JSON ──────────────────────────────────────────────
function require_auth_api(): void {
    hhc_session_start();

    if (!_hhc_session_valid()) {
        http_response_code(401);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => false, 'msg' => 'Unauthorized']);
        exit;
    }

    $_SESSION['hhc_last_active'] = time();
}

// ── Role guard for APIs — returns 403 JSON ────────────────────────────────────
function require_role_api(string $role): void {
    if (($_SESSION['hhc_role'] ?? '') !== $role) {
        http_response_code(403);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => false, 'msg' => 'Forbidden']);
        exit;
    }
}

// ── CSRF token ────────────────────────────────────────────────────────────────
function csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// ── CSRF check — kills with 403 on mismatch ───────────────────────────────────
function csrf_check(): void {
    $submitted = $_POST['csrf_token'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    $stored    = $_SESSION['csrf_token'] ?? '';

    if (!$stored || !hash_equals($stored, $submitted)) {
        http_response_code(403);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => false, 'msg' => 'CSRF check failed']);
        exit;
    }
}
