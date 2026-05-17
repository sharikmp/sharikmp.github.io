<?php
/**
 * POST /api/leaderboard_submit.php
 * Stores one anonymous leaderboard score.
 */

require_once __DIR__ . '/_bootstrap.php';

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
$body = api_read_json_body();

$anonId = strtoupper(trim((string) ($body['anon_id'] ?? '')));
$score = (int) ($body['score'] ?? 0);
$questions = (int) ($body['questions'] ?? 0);
$accuracy = (int) ($body['accuracy'] ?? 0);
$overallLevel = (int) ($body['overall_level'] ?? 1);
$countryHint = strtoupper(trim((string) ($body['country_hint'] ?? '')));

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
    $displayName = $existingName !== '' ? $existingName : generateSequentialAnonymousName($pdo);

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
    ]);
} catch (Throwable $e) {
    if (is_dev()) {
        api_json(500, ['success' => false, 'message' => $e->getMessage()]);
    }
    api_json(200, [
        'success' => false,
        'message' => 'Leaderboard storage is temporarily unavailable.',
        'display_name' => 'Anonymous000000',
        'country_code' => $country['country_code'] ?? 'ZZ',
        'country_name' => $country['country_name'] ?? 'Unknown',
    ]);
}
