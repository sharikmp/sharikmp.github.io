<?php
/**
 * Hangout Hub Cafe — Helpers
 * ---------------------------
 * Utility functions for generating unique reference numbers.
 */

require_once __DIR__ . '/db.php';

/**
 * Generates a unique order number: ORD-YYYYMMDD-NNNN
 * NNNN is the count of today's orders + 1, zero-padded to 4 digits.
 */
function generate_order_number(): string {
    $pdo   = get_db();
    $today = date('Y-m-d');
    $stmt  = $pdo->prepare(
        "SELECT COUNT(*) FROM `orders` WHERE DATE(`created_at`) = ?"
    );
    $stmt->execute([$today]);
    $count = (int) $stmt->fetchColumn();
    return 'ORD-' . date('Ymd') . '-' . str_pad($count + 1, 4, '0', STR_PAD_LEFT);
}

/**
 * Generates a unique reservation number: RES-YYYYMMDD-NNNN
 */
function generate_reservation_number(): string {
    $pdo   = get_db();
    $today = date('Y-m-d');
    $stmt  = $pdo->prepare(
        "SELECT COUNT(*) FROM `reservations` WHERE DATE(`created_at`) = ?"
    );
    $stmt->execute([$today]);
    $count = (int) $stmt->fetchColumn();
    return 'RES-' . date('Ymd') . '-' . str_pad($count + 1, 4, '0', STR_PAD_LEFT);
}

/**
 * Sanitize a string value from user input.
 */
function clean(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}
