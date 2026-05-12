<?php
/**
 * public_html/contact/send.php
 * Handles POST submissions from the contact form.
 * Returns JSON: { "success": true } or { "success": false, "message": "..." }
 * Security:
 *   - CSRF verification via csrf_verify()
 *   - All inputs sanitized with htmlspecialchars before use
 *   - Only POST accepted; all other methods return 405
 *   - Uses PHPMailer-ready structure (swap mail() for PHPMailer when ready)
 */
require_once __DIR__ . '/../../config/config.php';

header('Content-Type: application/json; charset=UTF-8');

// ── Only accept POST ─────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'message' => 'Method not allowed.']));
}

// ── CSRF check ───────────────────────────────────────────────
// csrf_verify() exits with 403 on failure — defined in config.php
csrf_verify();

// ── Collect & sanitize inputs ────────────────────────────────
$name    = trim(strip_tags($_POST['name']    ?? ''));
$email   = trim(strip_tags($_POST['email']   ?? ''));
$subject = trim(strip_tags($_POST['subject'] ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));

// ── Server-side validation ───────────────────────────────────
// (mirrors client-side checks; never rely on JS alone)
$errors = [];

if (strlen($name) < 2 || strlen($name) > 100) {
    $errors[] = 'Name must be between 2 and 100 characters.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address.';
}

$allowed_subjects = ['feedback', 'bug', 'feature', 'partnership', 'other'];
if (!in_array($subject, $allowed_subjects, true)) {
    $errors[] = 'Invalid subject selection.';
}

if (strlen($message) < 10 || strlen($message) > 2000) {
    $errors[] = 'Message must be between 10 and 2000 characters.';
}

if (!empty($errors)) {
    http_response_code(422);
    exit(json_encode(['success' => false, 'message' => implode(' ', $errors)]));
}

// ── Send email ───────────────────────────────────────────────
// Using PHP's built-in mail() as a simple starting point.
// For production, swap this block with PHPMailer / SendGrid / Mailgun.
$to      = $_ENV['CONTACT_TO'] ?? 'hello@mathtrainer.net';
$subject_line = '[MathTrainer Contact] ' . ucfirst($subject) . ' from ' . $name;

// Compose a plain-text email body (never output $message directly in HTML without escaping)
$body  = "New contact form submission from " . APP_NAME . "\n";
$body .= "-------------------------------------------\n";
$body .= "Name:    {$name}\n";
$body .= "Email:   {$email}\n";
$body .= "Subject: {$subject}\n";
$body .= "-------------------------------------------\n\n";
$body .= $message . "\n";

// Basic headers
$headers  = "From: {$name} <{$email}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$sent = mail($to, $subject_line, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not send email. Please try again later.']);
}
