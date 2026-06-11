<?php
/**
 * Hangout Hub Cafe — Reservations API
 * POST /api/reservations.php
 *
 * Security: origin check → honeypot → rate limiting → validation
 * Inserts reservation, sends email to restaurant, returns reservation number.
 *
 * Request (JSON):
 *   { name, phone, date (YYYY-MM-DD), time (HH:MM), guests, website (honeypot) }
 *
 * Response:
 *   { ok: true,  reservation_number: "RES-20260530-0001" }
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
$originOk = empty($allowedOrigins);
foreach ($allowedOrigins as $allowed) {
    if ($origin === $allowed || str_starts_with($referer, $allowed)) {
        $originOk = true;
        break;
    }
}
if ($origin === '' && $referer === '') $originOk = true;
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
    echo json_encode(['ok' => true, 'reservation_number' => 'RES-BOT-0000']);
    exit;
}

// ── Rate limiting (per IP) ────────────────────────────────────────────────────
$ip       = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/hhcafe_res_rl_' . md5($ip) . '.json';
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
$name   = clean($input['name']   ?? '');
$phone  = clean($input['phone']  ?? '');
$date   = clean($input['date']   ?? '');
$time   = clean($input['time']   ?? '');
$guests = (int)($input['guests'] ?? 0);

if ($name === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Name is required.']);
    exit;
}
if ($phone === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Phone number is required.']);
    exit;
}
if (!preg_match('/^[+\d\s\-]{7,20}$/', $phone)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Enter a valid phone number.']);
    exit;
}
if ($date === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Select a valid date.']);
    exit;
}
// Ensure date is not in the past (compare date strings — server timezone)
if ($date < date('Y-m-d')) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Please select a future date.']);
    exit;
}
if ($time === '' || !preg_match('/^\d{2}:\d{2}$/', $time)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Select a valid time.']);
    exit;
}
if ($guests < 1 || $guests > 20) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Guests must be between 1 and 20.']);
    exit;
}

// ── Insert reservation ────────────────────────────────────────────────────────
try {
    $pdo = get_db();

    $resNumber = generate_reservation_number();

    $stmt = $pdo->prepare(
        "INSERT INTO reservations (reservation_number, name, phone, date, time, guests)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([$resNumber, $name, $phone, $date, $time, $guests]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'msg' => 'Could not save reservation. Please try again.']);
    exit;
}

// ── Send email (non-fatal) ────────────────────────────────────────────────────
$emailSent = false;
$data = [
    'name'   => $name,
    'phone'  => $phone,
    'date'   => $date,
    'time'   => $time,
    'guests' => $guests,
];
$emailSent = send_reservation_email($resNumber, $data);
if (!$emailSent) {
    error_log('[HHCafe reservations] Email failed for ' . $resNumber);
}
send_telegram_reservation($resNumber, $data);

// ── Success ───────────────────────────────────────────────────────────────────
echo json_encode(['ok' => true, 'reservation_number' => $resNumber]);
