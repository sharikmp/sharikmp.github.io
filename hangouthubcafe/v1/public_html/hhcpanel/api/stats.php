<?php
/**
 * Hangout Hub Cafe — Admin Panel Stats API
 * ─────────────────────────────────────────
 * GET  ?period=today|week|month&scope=today|alltime
 *
 * Response:
 *   {
 *     ok: true,
 *     summary: { order_count, pending_count, cancelled_count, revenue, avg_order },
 *     top_sellers: [ { item_name, variant_label, qty_sold, revenue }, ... ]  (max 3)
 *   }
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../../includes/db.php';

header('Content-Type: application/json; charset=utf-8');

require_auth_api();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'msg' => 'Method not allowed']);
    exit;
}

$pdo = get_db();

// Whitelist period & scope to prevent injection
$periodMap = [
    'today' => "DATE(created_at) = CURDATE()",
    'week'  => "created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
    'month' => "created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)",
];
$scopeMap = [
    'today'   => "DATE(o.created_at) = CURDATE()",
    'alltime' => "1 = 1",
];

$period = array_key_exists($_GET['period'] ?? '', $periodMap) ? $_GET['period'] : 'today';
$scope  = array_key_exists($_GET['scope']  ?? '', $scopeMap)  ? $_GET['scope']  : 'today';

$periodWhere = $periodMap[$period];
$scopeWhere  = $scopeMap[$scope];

// ── Summary ───────────────────────────────────────────────────────────────────
$summaryStmt = $pdo->query("
    SELECT
        COUNT(*)                                                              AS order_count,
        SUM(status = 'pending')                                               AS pending_count,
        SUM(status = 'confirmed')                                             AS confirmed_count,
        SUM(status = 'completed')                                             AS completed_count,
        SUM(status = 'cancelled')                                             AS cancelled_count,
        COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total_amount ELSE 0 END), 0)  AS revenue,
        COALESCE(SUM(CASE WHEN payment_mode = 'cash'   THEN total_amount ELSE 0 END), 0) AS cash_revenue,
        COALESCE(SUM(CASE WHEN payment_mode = 'online' THEN total_amount ELSE 0 END), 0) AS online_revenue,
        COALESCE(AVG(CASE WHEN status != 'cancelled' THEN total_amount END), 0)          AS avg_order
    FROM orders
    WHERE $periodWhere
");
$summary = $summaryStmt->fetch();

$summary['order_count']     = (int)$summary['order_count'];
$summary['pending_count']   = (int)$summary['pending_count'];
$summary['confirmed_count'] = (int)$summary['confirmed_count'];
$summary['completed_count'] = (int)$summary['completed_count'];
$summary['cancelled_count'] = (int)$summary['cancelled_count'];
$summary['revenue']         = round((float)$summary['revenue'], 2);
$summary['cash_revenue']    = round((float)$summary['cash_revenue'], 2);
$summary['online_revenue']  = round((float)$summary['online_revenue'], 2);
$summary['avg_order']       = round((float)$summary['avg_order'], 2);

// ── Top 3 bestsellers ─────────────────────────────────────────────────────────
$topStmt = $pdo->query("
    SELECT
        oi.item_name,
        oi.variant_label,
        SUM(oi.quantity) AS qty_sold,
        SUM(oi.subtotal) AS revenue
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE $scopeWhere AND o.status != 'cancelled'
    GROUP BY oi.item_name, oi.variant_label
    ORDER BY qty_sold DESC
    LIMIT 3
");
$topSellers = $topStmt->fetchAll();

foreach ($topSellers as &$row) {
    $row['qty_sold'] = (int)$row['qty_sold'];
    $row['revenue']  = round((float)$row['revenue'], 2);
}
unset($row);

echo json_encode([
    'ok'          => true,
    'summary'     => $summary,
    'top_sellers' => $topSellers,
]);
