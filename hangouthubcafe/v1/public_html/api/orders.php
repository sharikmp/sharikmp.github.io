<?php
/**
 * Hangout Hub Cafe — Orders API
 * POST /api/orders.php
 *
 * Security: origin check → honeypot → rate limiting → validation
 * Saves order to DB, sends email to restaurant, returns order number.
 *
 * Request (JSON):
 *   { name, whatsapp, email?, notes?, website (honeypot),
 *     items: [{name, variantLabel, quantity}] }
 *
 * Response:
 *   { ok: true,  order_number: "ORD-20260530-0001" }
 *   { ok: false, msg: "..." }
 */

header('Content-Type: application/json; charset=utf-8');

// ── Load config ───────────────────────────────────────────────────────────────
$configPath = __DIR__ . '/../../config.php';
if (file_exists($configPath)) {
    require_once $configPath;
} else {
    define('MAIL_RECIPIENTS',   ['hello@hangouthubcafe.com']);
    define('MAIL_FROM_NAME',    'Hangout Hub Cafe');
    define('MAIL_FROM_ADDRESS', 'hello@hangouthubcafe.com');
    define('RATE_LIMIT_MAX',    10);
    define('RATE_LIMIT_WINDOW', 300);
    define('ALLOWED_ORIGINS',   []);
}

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../includes/mailer.php';
require_once __DIR__ . '/../includes/telegram.php';

// ── POST only ─────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'msg' => 'Method not allowed.']);
    exit;
}

// ── Origin check ──────────────────────────────────────────────────────────────
$origin  = $_SERVER['HTTP_ORIGIN']  ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$allowedOrigins = ALLOWED_ORIGINS;
$originOk = empty($allowedOrigins); // allow all if not configured
foreach ($allowedOrigins as $allowed) {
    if ($origin === $allowed || str_starts_with($referer, $allowed)) {
        $originOk = true;
        break;
    }
}
if ($origin === '' && $referer === '') $originOk = true; // local dev
if (!$originOk) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'msg' => 'Forbidden.']);
    exit;
}

// ── Parse JSON body ───────────────────────────────────────────────────────────
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Invalid request body.']);
    exit;
}

// ── Honeypot ──────────────────────────────────────────────────────────────────
if (!empty($input['website'])) {
    echo json_encode(['ok' => true, 'order_number' => 'ORD-BOT-0000']);
    exit;
}

// ── Rate limiting (per IP) ────────────────────────────────────────────────────
$ip       = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/hhcafe_ord_rl_' . md5($ip) . '.json';
$now      = time();
$window   = RATE_LIMIT_WINDOW;
$maxHits  = RATE_LIMIT_MAX;

$log = file_exists($rateFile) ? json_decode(file_get_contents($rateFile), true) : [];
if (!is_array($log)) $log = [];
$log = array_values(array_filter($log, fn($t) => ($now - $t) < $window));
if (count($log) >= $maxHits) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'msg' => 'Too many requests. Please wait a few minutes.']);
    exit;
}
$log[] = $now;
file_put_contents($rateFile, json_encode($log));

// ── Sanitize & validate ───────────────────────────────────────────────────────
$name     = clean($input['name']     ?? '');
$whatsapp = clean($input['whatsapp'] ?? '');
$email    = clean($input['email']    ?? '');
$notes    = clean($input['notes']    ?? '');
$items    = $input['items']          ?? [];

if ($name === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Name is required.']);
    exit;
}
if ($whatsapp === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'WhatsApp number is required.']);
    exit;
}
if (!preg_match('/^[+\d\s\-]{7,20}$/', $whatsapp)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Enter a valid WhatsApp number.']);
    exit;
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Invalid email address.']);
    exit;
}
if (!is_array($items) || empty($items)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Your cart is empty.']);
    exit;
}

// ── Validate items & look up prices from DB (server-authoritative) ────────────
$pdo = get_db();

$validatedItems = [];
$total = 0.0;

foreach ($items as $item) {
    $itemName     = clean($item['name']         ?? '');
    $variantLabel = clean($item['variantLabel'] ?? '');
    $quantity     = max(1, (int)($item['quantity'] ?? 1));

    if ($itemName === '' || $variantLabel === '') continue;

    // Look up price from DB — never trust client price
    $priceStmt = $pdo->prepare(
        "SELECT p.price FROM menu_item_pricing p
         JOIN menu_items i ON i.id = p.item_id
         WHERE i.name = ? AND p.variant_label = ? AND i.is_active = 1
         LIMIT 1"
    );
    $priceStmt->execute([$itemName, $variantLabel]);
    $dbPrice = $priceStmt->fetchColumn();

    if ($dbPrice === false) continue; // item or variant not found, skip

    $unitPrice = (float)$dbPrice;
    $subtotal  = $unitPrice * $quantity;
    $total    += $subtotal;

    $validatedItems[] = [
        'item_name'     => $itemName,
        'variant_label' => $variantLabel,
        'unit_price'    => $unitPrice,
        'quantity'      => $quantity,
        'subtotal'      => $subtotal,
    ];
}

if (empty($validatedItems)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'No valid items found. Please refresh and try again.']);
    exit;
}

// ── DB: find or create user, insert order in transaction ─────────────────────
try {
    $pdo->beginTransaction();

    // Upsert user by whatsapp
    $userStmt = $pdo->prepare("SELECT id FROM users WHERE whatsapp = ? LIMIT 1");
    $userStmt->execute([$whatsapp]);
    $userId = $userStmt->fetchColumn();

    if ($userId === false) {
        $insertUser = $pdo->prepare(
            "INSERT INTO users (name, whatsapp, email) VALUES (?, ?, ?)"
        );
        $insertUser->execute([$name, $whatsapp, $email ?: null]);
        $userId = (int)$pdo->lastInsertId();
    } else {
        // Update name; only overwrite email if a new one was provided
        if ($email !== '') {
            $updateUser = $pdo->prepare(
                "UPDATE users SET name = ?, email = ? WHERE id = ?"
            );
            $updateUser->execute([$name, $email, $userId]);
        } else {
            $updateUser = $pdo->prepare(
                "UPDATE users SET name = ? WHERE id = ?"
            );
            $updateUser->execute([$name, $userId]);
        }
    }

    // Generate unique order number
    $orderNumber = generate_order_number();

    // Insert order
    $insertOrder = $pdo->prepare(
        "INSERT INTO orders (order_number, user_id, total_amount, notes, payment_mode, order_type)
         VALUES (?, ?, ?, ?, 'pending', 'online')"
    );
    $insertOrder->execute([$orderNumber, $userId, $total, $notes ?: null]);
    $orderId = (int)$pdo->lastInsertId();

    // Insert order items
    $insertItem = $pdo->prepare(
        "INSERT INTO order_items (order_id, item_name, variant_label, unit_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    foreach ($validatedItems as $vi) {
        $insertItem->execute([
            $orderId,
            $vi['item_name'],
            $vi['variant_label'],
            $vi['unit_price'],
            $vi['quantity'],
            $vi['subtotal'],
        ]);
    }

    $pdo->commit();

} catch (Throwable $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    error_log('[HHCafe orders] ' . $e->getMessage() . ' | File: ' . $e->getFile() . ':' . $e->getLine());
    http_response_code(500);
    echo json_encode(['ok' => false, 'msg' => 'Could not save order. Please try again.']);
    exit;
}

// ── Notify (non-fatal: order already saved) ─────────────────────────────────
$user = ['name' => $name, 'whatsapp' => $whatsapp, 'email' => $email, 'notes' => $notes];
send_order_email($orderNumber, $user, $validatedItems, $total);
send_telegram_order($orderNumber, $user, $validatedItems, $total);

// ── Success ───────────────────────────────────────────────────────────────────
echo json_encode(['ok' => true, 'order_number' => $orderNumber]);
