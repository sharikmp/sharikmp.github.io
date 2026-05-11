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
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#0c0c12;font-family:Arial,Helvetica,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c12;padding:36px 16px;">
    <tr><td align="center">

      <!-- Card -->
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;border:1px solid rgba(91,111,214,0.30);">

        <!-- ── HEADER: gradient + brand ───────────────────────────────── -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a1f5e 0%,#2d3db8 55%,#3b4fce 100%);padding:32px 36px 28px;">
            <div style="display:inline-block;background:rgba(255,255,255,0.12);border-radius:10px;padding:8px 12px;margin-bottom:16px;">
              <span style="font-size:22px;line-height:1;">&#127891;</span>
            </div>
            <h1 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">New Enquiry Received</h1>
            <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.60);">The Laminars &mdash; Coaching Center, Kolkata</p>
            <!-- decorative divider -->
            <div style="margin-top:20px;height:2px;background:linear-gradient(90deg,#a5b4fc,#e879f9,#fb923c);border-radius:2px;"></div>
          </td>
        </tr>

        <!-- ── BODY: dark card ─────────────────────────────────────────── -->
        <tr>
          <td style="background:#13131f;padding:32px 36px;">

            <!-- 2-col: Name + Phone -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
              <tr>
                <td width="50%" style="padding:0 8px 20px 0;vertical-align:top;">
                  <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#a5b4fc;margin-bottom:6px;">Full Name</div>
                  <div style="font-size:15px;color:#ffffff;font-weight:600;">' . $name . '</div>
                </td>
                <td width="50%" style="padding:0 0 20px 8px;vertical-align:top;">
                  <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#a5b4fc;margin-bottom:6px;">Phone</div>
                  <div style="font-size:15px;color:#ffffff;font-weight:600;">' . $phone . '</div>
                </td>
              </tr>
            </table>

            <!-- separator -->
            <div style="height:1px;background:rgba(255,255,255,0.07);margin-bottom:20px;"></div>

            <!-- 2-col: Email + Course Interest -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
              <tr>
                <td width="50%" style="padding:0 8px 20px 0;vertical-align:top;">
                  <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#a5b4fc;margin-bottom:6px;">Email</div>
                  <div style="font-size:14px;color:#ffffff;">'
                  . ($email !== ''
                      ? '<a href="mailto:' . $email . '" style="color:#a5b4fc;text-decoration:none;">' . $email . '</a>'
                      : '<span style="color:rgba(255,255,255,0.35);font-style:italic;">Not provided</span>')
                  . '</div>
                </td>
                <td width="50%" style="padding:0 0 20px 8px;vertical-align:top;">
                  <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#a5b4fc;margin-bottom:6px;">Course Interest</div>
                  <div style="font-size:14px;">'
                  . ($subject !== ''
                      ? '<span style="display:inline-block;background:rgba(91,111,214,0.20);border:1px solid rgba(91,111,214,0.35);color:#c7d2fe;font-size:12px;font-weight:600;padding:3px 11px;border-radius:50px;">' . $subjectLabel . '</span>'
                      : '<span style="color:rgba(255,255,255,0.35);font-style:italic;">Not selected</span>')
                  . '</div>
                </td>
              </tr>
            </table>

            <!-- separator -->
            <div style="height:1px;background:rgba(255,255,255,0.07);margin-bottom:20px;"></div>

            <!-- Message -->
            <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#a5b4fc;margin-bottom:10px;">Message</div>'
            . ($message !== ''
                ? '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-left:3px solid #7c3aed;border-radius:8px;padding:14px 18px;font-size:14px;color:rgba(255,255,255,0.78);line-height:1.75;white-space:pre-wrap;word-break:break-word;">' . $message . '</div>'
                : '<div style="font-size:14px;color:rgba(255,255,255,0.35);font-style:italic;">No message provided.</div>')
            . '

          </td>
        </tr>

        <!-- ── QUICK ACTIONS ───────────────────────────────────────────── -->
        <tr>
          <td style="background:#0f0f1c;padding:20px 36px;border-top:1px solid rgba(255,255,255,0.07);">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0 0 12px;font-size:11px;color:rgba(255,255,255,0.40);text-transform:uppercase;letter-spacing:1px;">Quick Actions</p>
                </td>
              </tr>
              <tr>
                <td>'
                . ($phone !== ''
                    ? '<a href="tel:' . preg_replace('/[^+\d]/', '', $phone) . '" style="display:inline-block;background:linear-gradient(135deg,#3b4fce,#7c3aed);color:#ffffff;font-size:13px;font-weight:600;padding:9px 20px;border-radius:50px;text-decoration:none;margin-right:10px;">&#128222; Call Back</a>'
                    : '')
                . ($email !== ''
                    ? '<a href="mailto:' . $email . '" style="display:inline-block;background:rgba(91,111,214,0.15);border:1px solid rgba(91,111,214,0.40);color:#a5b4fc;font-size:13px;font-weight:600;padding:9px 20px;border-radius:50px;text-decoration:none;">&#9993; Reply by Email</a>'
                    : '')
                . '
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── FOOTER ──────────────────────────────────────────────────── -->
        <tr>
          <td style="background:#0a0a10;padding:16px 36px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;color:rgba(255,255,255,0.25);">This enquiry was submitted via the contact form at</p>
            <a href="https://www.thelaminars.com" style="font-size:12px;color:rgba(165,180,252,0.60);text-decoration:none;">www.thelaminars.com</a>
          </td>
        </tr>

      </table>

    </td></tr>
  </table>

</body>
</html>';

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
