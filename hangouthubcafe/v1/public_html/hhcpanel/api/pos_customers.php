<?php
/**
 * Hangout Hub Cafe — POS Customer Lookup API
 * GET /hhcpanel/api/pos_customers.php?q=<partial_phone>
 *
 * Returns up to 5 matching customers for phone autocomplete.
 * Response: { ok, customers: [ {name, whatsapp, email}, ... ] }
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../../includes/db.php';
require_auth_api();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

$q = trim($_GET['q'] ?? '');

if (strlen($q) < 3) {
    echo json_encode(['ok' => true, 'customers' => []]);
    exit;
}

// Only allow digit queries for phone lookup
if (!preg_match('/^[0-9]+$/', $q)) {
    echo json_encode(['ok' => true, 'customers' => []]);
    exit;
}

try {
    $pdo  = get_db();
    $stmt = $pdo->prepare(
        'SELECT name, whatsapp, email
         FROM users
         WHERE whatsapp LIKE ?
         ORDER BY id DESC
         LIMIT 5'
    );
    $stmt->execute([$q . '%']);
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['ok' => true, 'customers' => $customers]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Lookup failed.']);
}
