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

/**
 * Encode Unicode code point as UTF-8 bytes
 */
function api_codepoint_to_utf8(int $codePoint): string {
    if ($codePoint <= 0x7F) {
        return chr($codePoint);
    } elseif ($codePoint <= 0x7FF) {
        return chr(0xC0 | ($codePoint >> 6)) . chr(0x80 | ($codePoint & 0x3F));
    } elseif ($codePoint <= 0xFFFF) {
        return chr(0xE0 | ($codePoint >> 12)) . chr(0x80 | (($codePoint >> 6) & 0x3F)) . chr(0x80 | ($codePoint & 0x3F));
    } else {
        return chr(0xF0 | ($codePoint >> 18)) . chr(0x80 | (($codePoint >> 12) & 0x3F)) . chr(0x80 | (($codePoint >> 6) & 0x3F)) . chr(0x80 | ($codePoint & 0x3F));
    }
}

/**
 * Convert country code to flag emoji (e.g., 'US' → '🇺🇸', 'IN' → '🇮🇳')
 */
function api_country_flag_emoji(string $countryCode): string {
    $code = strtoupper(trim((string) $countryCode));
    
    if (!preg_match('/^[A-Z]{2}$/', $code)) {
        return '🌍'; // world emoji for unknown countries
    }
    
    // Regional indicator symbols start at U+1F1E6 (127462)
    $firstChar = 0x1F1E6 + (ord($code[0]) - ord('A'));
    $secondChar = 0x1F1E6 + (ord($code[1]) - ord('A'));
    
    // Encode both code points as UTF-8 and concatenate
    return api_codepoint_to_utf8($firstChar) . api_codepoint_to_utf8($secondChar);
}
