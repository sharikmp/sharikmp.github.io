<?php
/**
 * Hangout Hub Cafe — PDO Database Connection
 * -------------------------------------------
 * Returns a singleton PDO instance.
 * Config loaded from config.php one level above public_html.
 */

function get_db(): PDO {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $configPath = __DIR__ . '/../../config.php';
    if (file_exists($configPath)) {
        require_once $configPath;
    } else {
        // Local dev fallback — update these for local MySQL
        define('DB_HOST',    'localhost');
        define('DB_NAME',    'hangouthubcafe');
        define('DB_USER',    'root');
        define('DB_PASS',    '');
        define('DB_CHARSET', 'utf8mb4');
    }

    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        DB_HOST, DB_NAME, DB_CHARSET
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    return $pdo;
}
