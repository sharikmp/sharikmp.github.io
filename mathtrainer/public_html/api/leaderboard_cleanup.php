<?php
/**
 * POST /api/leaderboard_cleanup.php
 * Deletes anonymous leaderboard rows older than 7 days.
 * Intended for weekly cron execution.
 */

require_once __DIR__ . '/_bootstrap.php';

api_require_method('POST');

$providedToken = trim((string) ($_GET['token'] ?? $_POST['token'] ?? ''));
$expectedToken = trim((string) ($_ENV['APP_SECRET'] ?? ''));

if ($expectedToken === '' || !hash_equals($expectedToken, $providedToken)) {
    api_json(403, ['success' => false, 'message' => 'Forbidden.']);
}

try {
    $pdo = db();
    $sevenDaysAgo = api_utc_days_ago(7);
    $stmt = $pdo->prepare(
        'DELETE FROM leaderboard_scores
         WHERE is_anonymous = 1
           AND created_at < :seven_days_ago'
    );
    $stmt->execute([':seven_days_ago' => $sevenDaysAgo]);

    api_json(200, [
        'success' => true,
        'deleted' => $stmt->rowCount(),
    ]);
} catch (Throwable $e) {
    if (is_dev()) {
        api_json(500, ['success' => false, 'message' => $e->getMessage()]);
    }
    api_json(200, ['success' => false, 'message' => 'Cleanup skipped: leaderboard storage unavailable.']);
}
