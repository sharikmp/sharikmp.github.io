<?php
/**
 * Hangout Hub Cafe — Admin Panel Logout
 */
require_once __DIR__ . '/includes/auth.php';

hhc_session_start();

// Invalidate session cookie
if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $p['path'], $p['domain'], $p['secure'], $p['httponly']);
}

$_SESSION = [];
session_destroy();

header('Location: /hhcpanel/login.php');
exit;
