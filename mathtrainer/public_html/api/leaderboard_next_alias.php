<?php
/**
 * GET /api/leaderboard_next_alias.php
 * Reserves and returns the next anonymous alias from DB counter.
 */

require_once __DIR__ . '/_bootstrap.php';

api_require_method('GET');

function reserveNextAnonymousAlias(PDO $pdo): string {
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

try {
    $pdo = db();
    $alias = reserveNextAnonymousAlias($pdo);

    api_json(200, [
        'success' => true,
        'alias' => $alias,
    ]);
} catch (Throwable $e) {
    if (is_dev()) {
        api_json(500, ['success' => false, 'message' => $e->getMessage()]);
    }

    api_json(200, [
        'success' => false,
        'alias' => '',
        'message' => 'Could not reserve leaderboard alias right now.',
    ]);
}
