<?php
/**
 * Hangout Hub Cafe — POS Order API
 * POST /hhcpanel/api/pos_order.php
 *
 * Saves a new order placed via POS.
 * Request body (JSON):
 * {
 *   customer_phone : "9876543210",   // required if no email
 *   customer_email : "a@b.com",      // required if no phone
 *   customer_name  : "Rahul",        // optional
 *   payment_mode   : "cash"|"online"|"pending",
 *   total          : 240.00,
 *   notes          : "extra spicy",  // optional
 *   cart: [
 *     { item_id, pricing_id, item_name, variant_label, unit_price, quantity, subtotal }
 *   ]
 * }
 *
 * Response: { ok, order_number }
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../../includes/db.php';
require_auth_api();
csrf_check();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON body.']);
    exit;
}

// ── Input sanitization ────────────────────────────────────────────────────────
$phone    = trim($body['customer_phone'] ?? '');
$email    = trim($body['customer_email'] ?? '');
$name     = trim($body['customer_name']  ?? 'Walk-in');
$pmtMode  = $body['payment_mode'] ?? 'pending';
$total    = (float)($body['total'] ?? 0);
$notes    = trim($body['notes'] ?? '');
$cart     = $body['cart'] ?? [];

// Validate at least one contact
if ($phone === '' && $email === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Phone or email is required.']);
    exit;
}

// Validate phone format
if ($phone !== '' && !preg_match('/^[0-9]{10}$/', $phone)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid phone number.']);
    exit;
}

// Validate email format
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid email address.']);
    exit;
}

// Whitelist payment mode
$allowedModes = ['cash', 'online', 'pending'];
if (!in_array(strtolower($pmtMode), $allowedModes, true)) {
    $pmtMode = 'pending';
} else {
    $pmtMode = strtolower($pmtMode);
}

// Validate cart
if (empty($cart) || !is_array($cart)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Cart cannot be empty.']);
    exit;
}

try {
    $pdo = get_db();
    $pdo->beginTransaction();

    // ── 1. Upsert user (match by whatsapp phone, or email if phone absent) ────
    if ($phone !== '') {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE whatsapp = ?');
        $stmt->execute([$phone]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $userId = (int)$user['id'];
            // Update name if provided and not already Walk-in default
            if ($name !== '' && $name !== 'Walk-in') {
                $pdo->prepare('UPDATE users SET name = ? WHERE id = ?')
                    ->execute([$name, $userId]);
            }
        } else {
            $pdo->prepare('INSERT INTO users (name, whatsapp, email) VALUES (?, ?, ?)')
                ->execute([
                    $name !== '' ? $name : 'Walk-in',
                    $phone,
                    $email !== '' ? $email : null,
                ]);
            $userId = (int)$pdo->lastInsertId();
        }
    } else {
        // No phone — look up by email
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $userId = (int)$user['id'];
        } else {
            $pdo->prepare('INSERT INTO users (name, whatsapp, email) VALUES (?, ?, ?)')
                ->execute([
                    $name !== '' ? $name : 'Walk-in',
                    'email_' . substr(md5($email), 0, 8), // placeholder — whatsapp is UNIQUE NOT NULL
                    $email,
                ]);
            $userId = (int)$pdo->lastInsertId();
        }
    }

    // ── 2. Generate order number ──────────────────────────────────────────────
    $orderNumber = 'POS-' . strtoupper(substr(uniqid(), -6));

    // ── 3. Insert order ───────────────────────────────────────────────────────
    $pdo->prepare(
        'INSERT INTO orders
            (order_number, user_id, total_amount, status, notes, payment_mode, order_type)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    )->execute([
        $orderNumber,
        $userId,
        $total,
        'confirmed',          // POS orders are confirmed immediately
        $notes !== '' ? $notes : null,
        $pmtMode,
        'dinein',
    ]);
    $orderId = (int)$pdo->lastInsertId();

    // ── 4. Insert order items ─────────────────────────────────────────────────
    $itemStmt = $pdo->prepare(
        'INSERT INTO order_items
            (order_id, item_name, variant_label, unit_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    foreach ($cart as $ci) {
        $itemName     = substr(trim((string)($ci['item_name']     ?? '')), 0, 150);
        $variantLabel = substr(trim((string)($ci['variant_label'] ?? '')), 0, 50);
        $unitPrice    = (float)($ci['unit_price'] ?? 0);
        $quantity     = max(1, (int)($ci['quantity'] ?? 1));
        $subtotal     = (float)($ci['subtotal'] ?? $unitPrice * $quantity);

        if ($itemName === '' || $unitPrice <= 0) continue;

        $itemStmt->execute([$orderId, $itemName, $variantLabel, $unitPrice, $quantity, $subtotal]);
    }

    $pdo->commit();

    echo json_encode(['ok' => true, 'order_number' => $orderNumber, 'order_id' => $orderId]);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Failed to save order.']);
}
