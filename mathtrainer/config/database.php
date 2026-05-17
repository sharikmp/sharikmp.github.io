<?php
/**
 * config/database.php
 * Central PDO connection helper for MathTrainer APIs.
 */

require_once __DIR__ . '/config.php';

/**
 * Returns a shared PDO instance.
 */
function db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = $_ENV['DB_HOST'] ?? 'localhost';
    $name = $_ENV['DB_NAME'] ?? '';
    $user = $_ENV['DB_USER'] ?? '';
    $pass = $_ENV['DB_PASSWORD'] ?? '';

    if ($name === '' || $user === '' || $pass === '') {
        throw new RuntimeException('Database credentials are not configured.');
    }

    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $host, $name);

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}
