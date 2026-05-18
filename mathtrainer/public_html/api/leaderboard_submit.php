<?php
/**
 * POST /api/leaderboard_submit.php
 * Stores one anonymous leaderboard score.
 */

require_once __DIR__ . '/_bootstrap.php';

function sendLeaderboardNotificationEmail(string $displayName, int $score, int $questions, int $accuracy, string $countryName): void {
    $contactTo = trim((string) ($_ENV['CONTACT_TO'] ?? ''));
    if (empty($contactTo)) {
        return;
    }

    $appName = $_ENV['APP_NAME'] ?? 'MathTrainer';
    $fromEmail = $_ENV['SMTP_USER'] ?? 'noreply@mathtrainer.net';
    
    $subject = "[{$appName}] New Score Submitted: {$displayName} - {$score}pts";
    
    $emailBody = <<<HTML
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .score-card { background: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; }
        .stat-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .stat-label { font-weight: bold; color: #667eea; }
        .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🎉 New {$appName} Score!</h2>
        </div>
        
        <div class="score-card">
            <div class="stat-row">
                <span class="stat-label">Player:</span>
                <span>{$displayName}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Score:</span>
                <span><strong>{$score} points</strong></span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Questions Solved:</span>
                <span>{$questions}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Accuracy:</span>
                <span>{$accuracy}%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Country:</span>
                <span>{$countryName}</span>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from {$appName} leaderboard.</p>
        </div>
    </div>
</body>
</html>
HTML;

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: {$fromEmail}\r\n";
    $headers .= "Reply-To: {$fromEmail}\r\n";

    @mail($contactTo, $subject, $emailBody, $headers);
}

function generateSequentialAnonymousName(PDO $pdo): string {
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS leaderboard_alias_counter (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $pdo->exec('INSERT INTO leaderboard_alias_counter () VALUES ()');
    $nextId = (int) $pdo->lastInsertId();

    return 'Anonymous' . str_pad((string) $nextId, 6, '0', STR_PAD_LEFT);
}

api_require_method('POST');

function api_sanitize_leaderboard_name(string $name): string {
    $name = trim($name);
    if ($name === '') {
        return '';
    }

    $name = preg_replace('/\s+/', ' ', $name);
    $name = preg_replace('/[^A-Za-z0-9 _.-]/', '', $name ?? '');
    $name = trim((string) $name);

    if (strlen($name) < 3) {
        return '';
    }

    return substr($name, 0, 24);
}

/**
 * Send notification via Telegram Bot.
 * Returns status details for diagnostics.
 */
function sendTelegramNotification(string $displayName, int $score, int $questions, int $accuracy, string $countryName): array {
    $botToken = trim((string) ($_ENV['TELEGRAM_BOT_TOKEN'] ?? ''));
    $chatId = trim((string) ($_ENV['TELEGRAM_CHAT_ID'] ?? ''));
    
    if (empty($botToken) || empty($chatId)) {
        return [
            'attempted' => false,
            'success' => false,
            'http_code' => 0,
            'error' => 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID',
        ];
    }
    
    $appName = $_ENV['APP_NAME'] ?? 'MathTrainer';
    
    // Format message with emojis
    $message = <<<TEXT
🎉 <b>New {$appName} Score!</b>

👤 <b>Player:</b> {$displayName}
🎯 <b>Score:</b> <b>{$score} points</b>
❓ <b>Questions:</b> {$questions}
✅ <b>Accuracy:</b> {$accuracy}%
🌍 <b>Country:</b> {$countryName}
TEXT;
    
    $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
    
    $data = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML',
    ];
    
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => http_build_query($data),
            'timeout' => 5,
            'ignore_errors' => true,
        ],
    ];
    
    $context = stream_context_create($options);
    $response = @file_get_contents($url, false, $context);

    $httpCode = 0;
    if (isset($http_response_header) && is_array($http_response_header)) {
        foreach ($http_response_header as $headerLine) {
            if (preg_match('/^HTTP\/\S+\s+(\d{3})/', $headerLine, $m)) {
                $httpCode = (int) $m[1];
                break;
            }
        }
    }

    $decoded = is_string($response) ? json_decode($response, true) : null;
    $ok = ($httpCode >= 200 && $httpCode < 300)
        && is_array($decoded)
        && !empty($decoded['ok']);

    if ($ok) {
        return [
            'attempted' => true,
            'success' => true,
            'http_code' => $httpCode,
            'error' => '',
        ];
    }

    $apiDescription = '';
    if (is_array($decoded) && isset($decoded['description'])) {
        $apiDescription = (string) $decoded['description'];
    }

    return [
        'attempted' => true,
        'success' => false,
        'http_code' => $httpCode,
        'error' => $apiDescription !== '' ? $apiDescription : 'Telegram API call failed',
    ];
}

$body = api_read_json_body();

$anonId = strtoupper(trim((string) ($body['anon_id'] ?? '')));
$score = (int) ($body['score'] ?? 0);
$questions = (int) ($body['questions'] ?? 0);
$accuracy = (int) ($body['accuracy'] ?? 0);
$overallLevel = (int) ($body['overall_level'] ?? 1);
$countryHint = strtoupper(trim((string) ($body['country_hint'] ?? '')));
$preferredDisplayName = api_sanitize_leaderboard_name((string) ($body['preferred_display_name'] ?? ''));

if (!preg_match('/^ANON-[A-Z0-9]{6,20}$/', $anonId)) {
    api_json(422, ['success' => false, 'message' => 'Invalid anonymous ID.']);
}
if ($score < 0 || $score > 10000000) {
    api_json(422, ['success' => false, 'message' => 'Invalid score.']);
}
if ($questions < 0 || $questions > 10000) {
    api_json(422, ['success' => false, 'message' => 'Invalid questions value.']);
}
if ($accuracy < 0 || $accuracy > 100) {
    api_json(422, ['success' => false, 'message' => 'Invalid accuracy value.']);
}
if ($overallLevel < 1 || $overallLevel > 999) {
    api_json(422, ['success' => false, 'message' => 'Invalid level value.']);
}

$ip = api_client_ip();
$country = api_resolve_country($ip);
if ($country['country_code'] === 'ZZ' && preg_match('/^[A-Z]{2}$/', $countryHint)) {
    $country['country_code'] = $countryHint;
}

$userAgent = substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255);
$ipHash = hash('sha256', $ip . '|' . ($_ENV['APP_SECRET'] ?? 'mathtrainer'));
$uaHash = hash('sha256', $userAgent . '|' . ($_ENV['APP_SECRET'] ?? 'mathtrainer'));
$weekStart = api_week_start_utc();
$oneHourAgo = api_utc_hours_ago(1);
$sevenDaysAgo = api_utc_days_ago(7);

try {
    $pdo = db();

    // Keep a stable backend-generated alias for each anonymous user per week.
    $nameStmt = $pdo->prepare(
        'SELECT display_name
         FROM leaderboard_scores
         WHERE anon_id = :anon_id
           AND week_start = :week_start
         ORDER BY id DESC
         LIMIT 1'
    );
    $nameStmt->execute([
        ':anon_id' => $anonId,
        ':week_start' => $weekStart,
    ]);
    $existingName = trim((string) ($nameStmt->fetch()['display_name'] ?? ''));
    if ($existingName !== '') {
        $displayName = $existingName;
    } elseif ($preferredDisplayName !== '') {
        $displayName = $preferredDisplayName;
    } else {
        $displayName = generateSequentialAnonymousName($pdo);
    }

    // Basic spam guard: max 25 submissions per IP hash per hour.
    $guardStmt = $pdo->prepare(
        'SELECT COUNT(*) AS c
         FROM leaderboard_scores
         WHERE ip_hash = :ip_hash
           AND created_at >= :one_hour_ago'
    );
    $guardStmt->execute([
        ':ip_hash' => $ipHash,
        ':one_hour_ago' => $oneHourAgo,
    ]);
    $count = (int) ($guardStmt->fetch()['c'] ?? 0);
    if ($count >= 25) {
        api_json(429, ['success' => false, 'message' => 'Too many score submissions. Please try later.']);
    }

    $insert = $pdo->prepare(
        'INSERT INTO leaderboard_scores
            (anon_id, display_name, score, questions, accuracy, overall_level, country_code, country_name, is_anonymous, week_start, ip_hash, user_agent_hash)
         VALUES
            (:anon_id, :display_name, :score, :questions, :accuracy, :overall_level, :country_code, :country_name, 1, :week_start, :ip_hash, :user_agent_hash)'
    );

    $insert->execute([
        ':anon_id' => $anonId,
        ':display_name' => $displayName,
        ':score' => $score,
        ':questions' => $questions,
        ':accuracy' => $accuracy,
        ':overall_level' => $overallLevel,
        ':country_code' => $country['country_code'],
        ':country_name' => $country['country_name'],
        ':week_start' => $weekStart,
        ':ip_hash' => $ipHash,
        ':user_agent_hash' => $uaHash,
    ]);

    // ── Email notification (DISABLED) ──
    // sendLeaderboardNotificationEmail($displayName, $score, $questions, $accuracy, $country['country_name']);
    
    // ── Telegram Bot notification ──
    $telegramResult = sendTelegramNotification($displayName, $score, $questions, $accuracy, $country['country_name']);

    // Opportunistic cleanup to avoid stale anonymous data buildup.
    if (random_int(1, 25) === 1) {
        $cleanup = $pdo->prepare(
            'DELETE FROM leaderboard_scores
             WHERE is_anonymous = 1
                             AND created_at < :seven_days_ago'
        );
                $cleanup->execute([':seven_days_ago' => $sevenDaysAgo]);
    }

    api_json(201, [
        'success' => true,
        'display_name' => $displayName,
        'country_code' => $country['country_code'],
        'country_name' => $country['country_name'],
        'telegram' => $telegramResult,
    ]);
} catch (Throwable $e) {
    if (is_dev()) {
        api_json(500, ['success' => false, 'message' => $e->getMessage()]);
    }
    api_json(200, [
        'success' => false,
        'message' => 'Leaderboard storage is temporarily unavailable.',
        'display_name' => 'User000000',
        'country_code' => $country['country_code'] ?? 'ZZ',
        'country_name' => $country['country_name'] ?? 'Unknown',
    ]);
}
