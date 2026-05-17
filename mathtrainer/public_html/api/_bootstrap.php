<?php
/**
 * public_html/api/_bootstrap.php
 * Shared helpers for leaderboard API endpoints.
 */

require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

/**
 * Sends JSON and exits.
 */
function api_json(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

/**
 * Rejects unsupported methods.
 */
function api_require_method(string $method): void {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== strtoupper($method)) {
        api_json(405, ['success' => false, 'message' => 'Method not allowed.']);
    }
}

/**
 * Reads JSON body safely.
 */
function api_read_json_body(): array {
    $raw = file_get_contents('php://input');
    if (!is_string($raw) || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        api_json(400, ['success' => false, 'message' => 'Invalid JSON body.']);
    }

    return $decoded;
}

/**
 * Gets client IP with proxy awareness.
 */
function api_client_ip(): string {
    $candidates = [];

    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        $candidates[] = $_SERVER['HTTP_CF_CONNECTING_IP'];
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        foreach ($parts as $part) {
            $candidates[] = trim($part);
        }
    }
    if (!empty($_SERVER['REMOTE_ADDR'])) {
        $candidates[] = $_SERVER['REMOTE_ADDR'];
    }

    foreach ($candidates as $candidate) {
        if (filter_var($candidate, FILTER_VALIDATE_IP)) {
            return $candidate;
        }
    }

    return '0.0.0.0';
}

/**
 * Monday date (UTC) for current week.
 */
function api_week_start_utc(): string {
    $dt = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    return $dt->modify('monday this week')->format('Y-m-d');
}

/**
 * UTC datetime string N hours ago.
 */
function api_utc_hours_ago(int $hours): string {
    $hours = max(0, $hours);
    $dt = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    return $dt->modify('-' . $hours . ' hours')->format('Y-m-d H:i:s');
}

/**
 * UTC datetime string N days ago.
 */
function api_utc_days_ago(int $days): string {
    $days = max(0, $days);
    $dt = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    return $dt->modify('-' . $days . ' days')->format('Y-m-d H:i:s');
}

/**
 * Looks up country by IP (best effort).
 */
function api_resolve_country(string $ip): array {
    $fallback = ['country_code' => 'ZZ', 'country_name' => 'Unknown'];

    if ($ip === '0.0.0.0') {
        return $fallback;
    }

    $url = 'https://ipwho.is/' . rawurlencode($ip);
    $opts = [
        'http' => [
            'method' => 'GET',
            'timeout' => 2,
            'ignore_errors' => true,
        ],
    ];

    $ctx = stream_context_create($opts);
    $raw = @file_get_contents($url, false, $ctx);
    if (!is_string($raw) || $raw === '') {
        return $fallback;
    }

    $data = json_decode($raw, true);
    if (!is_array($data) || empty($data['success'])) {
        return $fallback;
    }

    $code = strtoupper(trim((string) ($data['country_code'] ?? 'ZZ')));
    $name = trim((string) ($data['country'] ?? 'Unknown'));

    if (!preg_match('/^[A-Z]{2}$/', $code)) {
        $code = 'ZZ';
    }
    if ($name === '') {
        $name = 'Unknown';
    }

    return ['country_code' => $code, 'country_name' => $name];
}
