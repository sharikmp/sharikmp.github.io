<?php
/**
 * GET /api/leaderboard_list.php
 * Returns leaderboard rows for global and optional country views.
 */

require_once __DIR__ . '/_bootstrap.php';

api_require_method('GET');

$limit = (int) ($_GET['limit'] ?? 10);
$limit = max(5, min(50, $limit));

$countryCode = strtoupper(trim((string) ($_GET['country_code'] ?? '')));
if ($countryCode !== '' && !preg_match('/^[A-Z]{2}$/', $countryCode)) {
    api_json(422, ['success' => false, 'message' => 'Invalid country code.']);
}

try {
    $pdo = db();
    $sevenDaysAgo = api_utc_days_ago(7);

    $globalSql =
        'SELECT
            id,
            anon_id,
            display_name,
            score,
            questions,
            accuracy,
            overall_level,
            country_code,
            country_name,
            played_at
         FROM leaderboard_scores
            WHERE created_at >= :seven_days_ago
         ORDER BY score DESC, accuracy DESC, questions DESC, played_at ASC
         LIMIT :limit';

    $globalStmt = $pdo->prepare($globalSql);
        $globalStmt->bindValue(':seven_days_ago', $sevenDaysAgo, PDO::PARAM_STR);
    $globalStmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $globalStmt->execute();
    $globalRows = $globalStmt->fetchAll();
    $globalRows = array_map(fn($row) => [...$row, 'country_flag' => api_country_flag_emoji($row['country_code'] ?? 'ZZ')], $globalRows);

    $countryRows = [];
    $resolvedCountryCode = $countryCode;

    if ($resolvedCountryCode === '') {
        $resolvedCountryCode = api_resolve_country(api_client_ip())['country_code'];
    }

    if (preg_match('/^[A-Z]{2}$/', $resolvedCountryCode) && $resolvedCountryCode !== 'ZZ') {
        $countrySql =
            'SELECT
                id,
                anon_id,
                display_name,
                score,
                questions,
                accuracy,
                overall_level,
                country_code,
                country_name,
                played_at
             FROM leaderboard_scores
             WHERE country_code = :country_code
                             AND created_at >= :seven_days_ago
             ORDER BY score DESC, accuracy DESC, questions DESC, played_at ASC
             LIMIT :limit';

        $countryStmt = $pdo->prepare($countrySql);
        $countryStmt->bindValue(':country_code', $resolvedCountryCode, PDO::PARAM_STR);
                $countryStmt->bindValue(':seven_days_ago', $sevenDaysAgo, PDO::PARAM_STR);
        $countryStmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $countryStmt->execute();
        $countryRows = $countryStmt->fetchAll();
        $countryRows = array_map(fn($row) => [...$row, 'country_flag' => api_country_flag_emoji($row['country_code'] ?? 'ZZ')], $countryRows);
    }

    api_json(200, [
        'success' => true,
        'country_code' => $resolvedCountryCode ?: 'ZZ',
        'global' => $globalRows,
        'country' => $countryRows,
    ]);
} catch (Throwable $e) {
    if (is_dev()) {
        api_json(500, ['success' => false, 'message' => $e->getMessage()]);
    }
    api_json(200, [
        'success' => false,
        'country_code' => $countryCode ?: 'ZZ',
        'global' => [],
        'country' => [],
        'message' => 'Leaderboard storage is temporarily unavailable.',
    ]);
}
