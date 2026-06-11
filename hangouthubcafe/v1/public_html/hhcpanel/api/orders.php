<?php
/**
 * Hangout Hub Cafe — Admin Panel Orders API
 * ─────────────────────────────────────────
 * GET    ?view=today|all&status=all|pending|confirmed|completed|cancelled&page=1&per_page=20
 *        [&from=YYYY-MM-DD&to=YYYY-MM-DD] (only for view=all)
 *
 * POST   { action: "update_status", order_id: N, status: "..." }
 *        Header: X-CSRF-Token: <token>
 *        Allowed roles: admin, staff
 *
 * DELETE { order_id: N }
 *        Header: X-CSRF-Token: <token>
 *        Allowed roles: admin only
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../../includes/db.php';

header('Content-Type: application/json; charset=utf-8');

require_auth_api();

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = get_db();

// ── GET ───────────────────────────────────────────────────────────────────────
if ($method === 'GET') {

    // Single order fetch: ?id=N
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        if ($id < 1) { echo json_encode(['ok'=>false,'error'=>'Invalid id']); exit; }
        $stmt = $pdo->prepare(
            "SELECT o.id, o.order_number,
                    u.name AS customer_name, u.whatsapp, u.email,
                    o.notes, o.total_amount, o.status, o.payment_mode, o.order_type, o.created_at
             FROM orders o JOIN users u ON u.id = o.user_id
             WHERE o.id = ? LIMIT 1"
        );
        $stmt->execute([$id]);
        $order = $stmt->fetch();
        if (!$order) { echo json_encode(['ok'=>false,'error'=>'Order not found']); exit; }
        $iStmt = $pdo->prepare(
            "SELECT item_name, variant_label, unit_price, quantity, subtotal
             FROM order_items WHERE order_id = ? ORDER BY id ASC"
        );
        $iStmt->execute([$id]);
        $order['items'] = $iStmt->fetchAll();
        echo json_encode(['ok'=>true,'order'=>$order]);
        exit;
    }

    $view    = in_array($_GET['view'] ?? '', ['today','all']) ? ($_GET['view']) : 'today';
    $status  = $_GET['status'] ?? 'all';
    $page    = max(1, (int)($_GET['page']     ?? 1));
    $perPage = min(50, max(10, (int)($_GET['per_page'] ?? 20)));
    $offset  = ($page - 1) * $perPage;

    $validStatuses = ['pending','confirmed','completed','cancelled'];
    $validTypes    = ['online','dinein'];
    $validPayments = ['pending','cash','online'];
    $conditions = [];
    $params     = [];

    if ($view === 'today') {
        $conditions[] = 'DATE(o.created_at) = CURDATE()';
    } else {
        // Date range (all orders)
        $from = $_GET['from'] ?? '';
        $to   = $_GET['to']   ?? '';
        if ($from && preg_match('/^\d{4}-\d{2}-\d{2}$/', $from)) {
            $conditions[] = 'DATE(o.created_at) >= ?';
            $params[]     = $from;
        }
        if ($to && preg_match('/^\d{4}-\d{2}-\d{2}$/', $to)) {
            $conditions[] = 'DATE(o.created_at) <= ?';
            $params[]     = $to;
        }
    }

    if ($status !== 'all' && in_array($status, $validStatuses, true)) {
        $conditions[] = 'o.status = ?';
        $params[]     = $status;
    }

    $orderType  = $_GET['order_type']   ?? 'all';
    $paymentFil = $_GET['payment_mode'] ?? 'all';

    if ($orderType !== 'all' && in_array($orderType, $validTypes, true)) {
        $conditions[] = 'o.order_type = ?';
        $params[]     = $orderType;
    }
    if ($paymentFil !== 'all' && in_array($paymentFil, $validPayments, true)) {
        $conditions[] = 'o.payment_mode = ?';
        $params[]     = $paymentFil;
    }

    $where = $conditions ? 'WHERE ' . implode(' AND ', $conditions) : '';

    // Total count
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM orders o $where");
    $countStmt->execute($params);
    $totalCount = (int)$countStmt->fetchColumn();

    // Orders list (paginated)
    $sql = "
        SELECT o.id, o.order_number,
               u.name    AS customer_name,
               u.whatsapp,
               u.email,
               o.notes,
               o.total_amount,
               o.status,
               o.payment_mode,
               o.order_type,
               o.created_at,
               (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
        FROM orders o
        JOIN users u ON u.id = o.user_id
        $where
        ORDER BY o.created_at DESC
        LIMIT $perPage OFFSET $offset
    ";
    $listStmt = $pdo->prepare($sql);
    $listStmt->execute($params);
    $orders = $listStmt->fetchAll();

    // Fetch items for these orders in one query
    if ($orders) {
        $orderIds     = array_column($orders, 'id');
        $placeholders = implode(',', array_fill(0, count($orderIds), '?'));
        $itemsStmt    = $pdo->prepare(
            "SELECT order_id, item_name, variant_label, unit_price, quantity, subtotal
             FROM order_items
             WHERE order_id IN ($placeholders)
             ORDER BY id ASC"
        );
        $itemsStmt->execute($orderIds);
        $allItems = $itemsStmt->fetchAll();

        // Group by order_id
        $byOrder = [];
        foreach ($allItems as $item) {
            $byOrder[$item['order_id']][] = $item;
        }
        foreach ($orders as &$order) {
            $order['items']      = $byOrder[$order['id']] ?? [];
            $order['item_count'] = (int)$order['item_count'];
        }
        unset($order);
    }

    echo json_encode([
        'ok'          => true,
        'orders'      => $orders,
        'total_count' => $totalCount,
        'page'        => $page,
        'per_page'    => $perPage,
    ]);
    exit;
}

// ── POST: update_status | update_payment ──────────────────────────────────────
if ($method === 'POST') {
    csrf_check();

    $body    = json_decode(file_get_contents('php://input'), true) ?? [];
    $action  = $body['action']   ?? '';
    $orderId = (int)($body['id'] ?? $body['order_id'] ?? 0);

    if ($orderId <= 0) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'msg' => 'Invalid order_id']);
        exit;
    }

    // ── action: update_status ────────────────────────────────────────────────
    if ($action === 'update_status') {
        $newStatus     = $body['status'] ?? '';
        $validStatuses = ['pending','confirmed','completed','cancelled'];

        if (!in_array($newStatus, $validStatuses, true)) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'msg' => 'Invalid status']);
            exit;
        }

        if ($newStatus === 'cancelled') {
            $stmt = $pdo->prepare('UPDATE orders SET status = ?, total_amount = 0 WHERE id = ?');
        } else {
            $stmt = $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?');
        }
        $stmt->execute([$newStatus, $orderId]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'msg' => 'Order not found']);
            exit;
        }

        echo json_encode(['ok' => true]);
        exit;
    }

    // ── action: update_customer ────────────────────────────────────────────────
    if ($action === 'update_customer') {
        $name  = trim($body['customer_name'] ?? '');
        $phone = trim($body['whatsapp']       ?? '');
        $email = trim($body['email']          ?? '');

        $stmt = $pdo->prepare('UPDATE orders SET customer_name = ?, whatsapp = ?, email = ? WHERE id = ?');
        $stmt->execute([$name, $phone, $email, $orderId]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'msg' => 'Order not found']);
            exit;
        }

        echo json_encode(['ok' => true]);
        exit;
    }

    // ── action: update_payment ────────────────────────────────────────────────
    if ($action === 'update_payment') {
        $newMode     = $body['payment_mode'] ?? '';
        $validModes  = ['cash', 'online', 'pending'];

        if (!in_array($newMode, $validModes, true)) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'msg' => 'Invalid payment_mode']);
            exit;
        }

        $stmt = $pdo->prepare('UPDATE orders SET payment_mode = ? WHERE id = ?');
        $stmt->execute([$newMode, $orderId]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['ok' => false, 'msg' => 'Order not found']);
            exit;
        }

        echo json_encode(['ok' => true]);
        exit;
    }

    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Unknown action']);
    exit;
}

// ── DELETE: remove order (admin only) ─────────────────────────────────────────
if ($method === 'DELETE') {
    require_role_api('admin');
    csrf_check();

    $body    = json_decode(file_get_contents('php://input'), true) ?? [];
    $orderId = (int)($body['order_id'] ?? 0);

    if ($orderId <= 0) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'msg' => 'Invalid order_id']);
        exit;
    }

    // order_items cascade via FK on DELETE CASCADE
    $stmt = $pdo->prepare('DELETE FROM orders WHERE id = ?');
    $stmt->execute([$orderId]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'msg' => 'Order not found']);
        exit;
    }

    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'msg' => 'Method not allowed']);
