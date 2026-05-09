<?php
/**
 * The Laminars — Enquiry Form Mailer
 * ------------------------------------
 * Receives a POST request from the contact form,
 * sanitizes input, and sends an email to all recipients.
 *
 * Sensitive config (recipients, keys) lives in ../config.php
 * which is outside public_html and never web-accessible.
 */

header('Content-Type: application/json; charset=utf-8');

// ── Load config (one level above public_html, never browser-accessible) ───────
$configPath = __DIR__ . '/../config.php';
if (!file_exists($configPath)) {
    // Fallback: inline defaults so local dev / preview still works.
    // On the live server this block should never run.
    define('MAIL_RECIPIENTS',   ['sharik.madhyapradeshi@gmail.com', 'info@thelaminars.com']);
    define('MAIL_FROM_NAME',    'The Laminars');
    define('MAIL_FROM_ADDRESS', 'info@thelaminars.com');
    define('RATE_LIMIT_MAX',    3);
    define('RATE_LIMIT_WINDOW', 300);
    define('ALLOWED_ORIGINS',   ['https://www.thelaminars.com', 'https://thelaminars.com']);
} else {
    require_once $configPath;
}

// ── Only allow POST ───────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'msg' => 'Method not allowed.']);
    exit;
}

// ── Origin check (blocks cross-site form submissions) ────────────────────────
$origin  = $_SERVER['HTTP_ORIGIN']  ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$allowedOrigins = ALLOWED_ORIGINS;
$originOk = false;
foreach ($allowedOrigins as $allowed) {
    if ($origin === $allowed || str_starts_with($referer, $allowed)) {
        $originOk = true;
        break;
    }
}
// Allow when running locally (no origin header) — remove in production if you prefer strict
if ($origin === '' && $referer === '') {
    $originOk = true;
}
if (!$originOk) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'msg' => 'Forbidden.']);
    exit;
}

// ── Honeypot: bots fill hidden fields, humans don't ──────────────────────────
if (!empty($_POST['website'])) {
    // Silently succeed so bots don't know they were blocked
    echo json_encode(['ok' => true]);
    exit;
}

// ── Rate limiting (file-based, no database needed) ───────────────────────────
$ip       = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/laminars_rl_' . md5($ip) . '.json';
$now      = time();
$window   = RATE_LIMIT_WINDOW;
$maxHits  = RATE_LIMIT_MAX;

$log = file_exists($rateFile) ? json_decode(file_get_contents($rateFile), true) : [];
$log = array_values(array_filter($log, fn($t) => ($now - $t) < $window));

if (count($log) >= $maxHits) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'msg' => 'Too many requests. Please wait a few minutes and try again.']);
    exit;
}
$log[] = $now;
file_put_contents($rateFile, json_encode($log));

// ── Recipients ────────────────────────────────────────────────────────────────
$recipients = MAIL_RECIPIENTS;

// ── Helper: sanitize a string ─────────────────────────────────────────────────
function clean(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

// ── Read & sanitize POST fields ───────────────────────────────────────────────
$name    = clean($_POST['name']    ?? '');
$email   = clean($_POST['email']   ?? '');
$phone   = clean($_POST['phone']   ?? '');
$subject = clean($_POST['subject'] ?? '');
$message = clean($_POST['message'] ?? '');

// ── Basic server-side validation ──────────────────────────────────────────────
if ($name === '' || $phone === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Name and phone are required.']);
    exit;
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'msg' => 'Invalid email address.']);
    exit;
}

// ── Map course page path → display name ──────────────────────────────────────
$subjectMap = [
    'pages/little-minds.html'        => 'Laminars Little Minds',
    'pages/foundation-academy.html'  => 'Laminars Foundation Academy',
    'pages/senior-academy.html'      => 'Laminars Senior Academy',
    'pages/tech-academy.html'        => 'Laminars Tech Academy',
    'pages/code-juniors.html'        => 'Laminars Code Juniors',
    'pages/career-launchpad.html'    => 'Laminars Career Launchpad',
    'pages/english-academic.html'    => 'English Academic',
    'pages/english-spoken.html'      => 'English Spoken',
    'pages/hindi-academic.html'      => 'Hindi Academic',
    'pages/hindi-basics.html'        => 'Hindi Basics',
    'pages/language-lab.html'        => 'Laminars Language Lab',
];
$subjectLabel = $subjectMap[$subject] ?? ($subject !== '' ? $subject : 'General Enquiry');

// ── Build email ───────────────────────────────────────────────────────────────
$mailSubject = 'New Enquiry || ' . $name . ' || ' . $subjectLabel;

$mailBody = '<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">

        <!-- Header -->
        <tr>
          <td style="background:#1d4ed8;padding:24px 32px;">
            <h2 style="margin:0;font-size:20px;color:#ffffff;font-family:Arial,sans-serif;">&#128233; New Enquiry &mdash; The Laminars</h2>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;color:#333333;line-height:1.6;font-family:Arial,sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:16px;">
                  <div style="font-weight:bold;color:#1d4ed8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Full Name</div>
                  <div style="margin-top:4px;font-size:15px;color:#1a202c;">' . $name . '</div>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:16px;">
                  <div style="font-weight:bold;color:#1d4ed8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Phone</div>
                  <div style="margin-top:4px;font-size:15px;color:#1a202c;">' . $phone . '</div>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:16px;">
                  <div style="font-weight:bold;color:#1d4ed8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Email</div>
                  <div style="margin-top:4px;font-size:15px;color:#1a202c;">' . ($email !== '' ? '<a href="mailto:' . $email . '" style="color:#1d4ed8;text-decoration:none;">' . $email . '</a>' : '<em style="color:#888888;">Not provided</em>') . '</div>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:16px;">
                  <div style="font-weight:bold;color:#1d4ed8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Course Interest</div>
                  <div style="margin-top:4px;font-size:15px;color:#1a202c;">' . ($subject !== '' ? $subjectLabel : '<em style="color:#888888;">Not selected</em>') . '</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style="font-weight:bold;color:#1d4ed8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Message</div>
                  <div style="margin-top:8px;font-size:15px;color:#1a202c;background:#f9fafb;border-left:4px solid #1d4ed8;padding:12px 16px;border-radius:4px;white-space:pre-wrap;word-break:break-word;">' . $message . '</div>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f0f4ff;padding:14px 32px;font-size:12px;color:#666666;text-align:center;font-family:Arial,sans-serif;border-top:1px solid #e2e8f0;">
            Sent from the contact form at thelaminars.com
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body></html>';

// ── Mail headers ──────────────────────────────────────────────────────────────
$fromName    = MAIL_FROM_NAME;
$fromAddress = MAIL_FROM_ADDRESS;
$replyTo     = $email !== '' ? $email : $fromAddress;

$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
$headers .= 'From: ' . $fromName . ' <' . $fromAddress . '>' . "\r\n";
$headers .= 'Reply-To: ' . $replyTo . "\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion();

// ── Send to all recipients ────────────────────────────────────────────────────
$toList  = implode(', ', $recipients);
$success = mail($toList, $mailSubject, $mailBody, $headers);

if ($success) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'msg' => 'Mail server error. Please try calling us directly.']);
}
