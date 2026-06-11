<?php
/**
 * Hangout Hub Cafe — Mail Helper
 * --------------------------------
 * Sends HTML emails via PHP's built-in mail() function.
 * No SMTP / PHPMailer needed — works with Hostinger's mail server.
 *
 * Config constants (MAIL_FROM_NAME, MAIL_FROM_ADDRESS, MAIL_RECIPIENTS)
 * must be defined before calling these functions (done in each api endpoint
 * via config.php).
 */

/**
 * Core mailer — sends a single HTML email to all MAIL_RECIPIENTS.
 */
function send_html_mail(string $subject, string $htmlBody): bool {
    $fromName    = defined('MAIL_FROM_NAME')    ? MAIL_FROM_NAME    : 'Hangout Hub Cafe';
    $fromAddress = defined('MAIL_FROM_ADDRESS') ? MAIL_FROM_ADDRESS : 'hello@hangouthubcafe.com';
    $recipients  = defined('MAIL_RECIPIENTS')   ? MAIL_RECIPIENTS   : [$fromAddress];

    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
    $headers .= 'From: ' . $fromName . ' <' . $fromAddress . '>' . "\r\n";
    $headers .= 'Reply-To: ' . $fromAddress . "\r\n";
    $headers .= 'X-Mailer: PHP/' . phpversion();

    $toList = implode(', ', $recipients);
    $sent = mail($toList, $subject, $htmlBody, $headers);
    if (!$sent) {
        error_log('[HHCafe mailer] mail() returned false. To: ' . $toList . ' | Subject: ' . $subject);
    }
    return $sent;
}

/**
 * Gold-themed email wrapper — shared layout for all emails.
 */
function email_layout(string $headerTitle, string $subheading, string $bodyContent, string $footerNote = ''): string {
    return '<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:36px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;border:1px solid rgba(212,175,55,0.30);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a1400 0%,#2d2200 55%,#3d3000 100%);padding:32px 36px 24px;border-bottom:2px solid #D4AF37;">
            <div style="display:inline-block;background:rgba(212,175,55,0.15);border-radius:8px;padding:8px 12px;margin-bottom:14px;">
              <span style="font-size:22px;">&#9749;</span>
            </div>
            <h1 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#D4AF37;letter-spacing:1px;">' . $headerTitle . '</h1>
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.50);">' . $subheading . '</p>
            <div style="margin-top:18px;height:1px;background:linear-gradient(90deg,#D4AF37,rgba(212,175,55,0.1));"></div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#0d0d0d;padding:28px 36px;">' . $bodyContent . '</td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#080808;padding:16px 36px;text-align:center;border-top:1px solid rgba(212,175,55,0.10);">
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">' . ($footerNote ?: 'Hangout Hub Cafe &mdash; Kolkata, West Bengal') . '</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>';
}

/**
 * Field row helper for email tables.
 */
function email_field(string $label, string $value): string {
    return '
    <tr>
      <td style="padding:0 12px 16px 0;vertical-align:top;width:50%;">
        <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#D4AF37;margin-bottom:5px;">' . $label . '</div>
        <div style="font-size:14px;color:#ffffff;">' . $value . '</div>
      </td>';
}

// ── Order Email ───────────────────────────────────────────────────────────────

/**
 * @param string $orderNumber   e.g. ORD-20260530-0001
 * @param array  $user          ['name'=>..., 'whatsapp'=>..., 'email'=>...]
 * @param array  $items         [['item_name'=>..., 'variant_label'=>..., 'unit_price'=>..., 'quantity'=>..., 'subtotal'=>...], ...]
 * @param float  $total
 */
function send_order_email(string $orderNumber, array $user, array $items, float $total): bool {
    $subject = 'New Order ' . $orderNumber . ' || ' . $user['name'];

    // Item rows
    $itemRows = '';
    foreach ($items as $item) {
        $itemRows .= '
        <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
          <td style="padding:10px 8px;font-size:13px;color:#ffffff;">' . htmlspecialchars($item['item_name']) . '</td>
          <td style="padding:10px 8px;font-size:12px;color:rgba(255,255,255,0.60);">' . htmlspecialchars($item['variant_label']) . '</td>
          <td style="padding:10px 8px;font-size:13px;color:rgba(255,255,255,0.80);text-align:center;">' . (int)$item['quantity'] . '</td>
          <td style="padding:10px 8px;font-size:13px;color:#D4AF37;text-align:right;">&#8377;' . number_format($item['subtotal'], 2) . '</td>
        </tr>';
    }

    $emailEl = $user['email']
        ? '<a href="mailto:' . htmlspecialchars($user['email']) . '" style="color:#D4AF37;text-decoration:none;">' . htmlspecialchars($user['email']) . '</a>'
        : '<span style="color:rgba(255,255,255,0.35);font-style:italic;">Not provided</span>';

    $body = '
    <!-- Order number badge -->
    <div style="background:rgba(212,175,55,0.10);border:1px solid rgba(212,175,55,0.30);border-radius:8px;padding:14px 20px;margin-bottom:24px;text-align:center;">
      <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.40);margin-bottom:4px;">Order Number</div>
      <div style="font-size:22px;font-weight:700;color:#D4AF37;letter-spacing:2px;">' . $orderNumber . '</div>
    </div>

    <!-- Customer details -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        ' . email_field('Customer Name', htmlspecialchars($user['name'])) . '
        <td style="padding:0 0 16px 12px;vertical-align:top;width:50%;">
          <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#D4AF37;margin-bottom:5px;">WhatsApp</div>
          <div style="font-size:14px;color:#ffffff;">
            <a href="https://wa.me/' . preg_replace('/[^0-9]/', '', $user['whatsapp']) . '" style="color:#25D366;text-decoration:none;">&#128362; ' . htmlspecialchars($user['whatsapp']) . '</a>
          </div>
        </td>
      </tr>
      <tr>
        ' . email_field('Email', $emailEl) . '
        <td></td>
      </tr>
    </table>

    <div style="height:1px;background:rgba(255,255,255,0.07);margin-bottom:20px;"></div>

    <!-- Items table -->
    <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#D4AF37;margin-bottom:12px;">Order Items</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(212,175,55,0.15);border-radius:6px;overflow:hidden;margin-bottom:16px;">
      <tr style="background:rgba(212,175,55,0.08);">
        <th style="padding:8px 8px;text-align:left;font-size:11px;color:rgba(255,255,255,0.50);font-weight:600;">Item</th>
        <th style="padding:8px 8px;text-align:left;font-size:11px;color:rgba(255,255,255,0.50);font-weight:600;">Variant</th>
        <th style="padding:8px 8px;text-align:center;font-size:11px;color:rgba(255,255,255,0.50);font-weight:600;">Qty</th>
        <th style="padding:8px 8px;text-align:right;font-size:11px;color:rgba(255,255,255,0.50);font-weight:600;">Subtotal</th>
      </tr>
      ' . $itemRows . '
      <tr style="background:rgba(212,175,55,0.06);">
        <td colspan="3" style="padding:12px 8px;font-size:13px;font-weight:700;color:#ffffff;">Total</td>
        <td style="padding:12px 8px;font-size:16px;font-weight:700;color:#D4AF37;text-align:right;">&#8377;' . number_format($total, 2) . '</td>
      </tr>
    </table>

    <!-- Quick action -->
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.07);">
      <a href="https://wa.me/' . preg_replace('/[^0-9]/', '', $user['whatsapp']) . '" style="display:inline-block;background:linear-gradient(135deg,#25D366,#128C7E);color:#ffffff;font-size:13px;font-weight:600;padding:10px 22px;border-radius:50px;text-decoration:none;">&#128362; Confirm on WhatsApp</a>
    </div>';

    $html = email_layout(
        'New Order Received',
        'Hangout Hub Cafe &mdash; Kolkata',
        $body,
        'This order was placed via hangouthubcafe.com'
    );

    return send_html_mail($subject, $html);
}

// ── Reservation Email ─────────────────────────────────────────────────────────

/**
 * @param string $resNumber  e.g. RES-20260530-0001
 * @param array  $data       ['name'=>..., 'phone'=>..., 'date'=>..., 'time'=>..., 'guests'=>...]
 */
function send_reservation_email(string $resNumber, array $data): bool {
    $subject = 'New Table Reservation ' . $resNumber . ' || ' . $data['name'];

    $timeFormatted = date('g:i A', strtotime($data['time']));
    $dateFormatted = date('D, d M Y', strtotime($data['date']));

    $body = '
    <!-- Reservation number badge -->
    <div style="background:rgba(212,175,55,0.10);border:1px solid rgba(212,175,55,0.30);border-radius:8px;padding:14px 20px;margin-bottom:24px;text-align:center;">
      <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.40);margin-bottom:4px;">Reservation Number</div>
      <div style="font-size:22px;font-weight:700;color:#D4AF37;letter-spacing:2px;">' . $resNumber . '</div>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        ' . email_field('Guest Name', htmlspecialchars($data['name'])) . '
        <td style="padding:0 0 16px 12px;vertical-align:top;width:50%;">
          <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#D4AF37;margin-bottom:5px;">Phone</div>
          <div style="font-size:14px;color:#ffffff;">
            <a href="tel:' . preg_replace('/[^+\d]/', '', $data['phone']) . '" style="color:#D4AF37;text-decoration:none;">&#128222; ' . htmlspecialchars($data['phone']) . '</a>
          </div>
        </td>
      </tr>
      <tr>
        ' . email_field('Date', $dateFormatted) . '
        <td style="padding:0 0 16px 12px;vertical-align:top;width:50%;">
          <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#D4AF37;margin-bottom:5px;">Time</div>
          <div style="font-size:14px;color:#ffffff;">' . $timeFormatted . '</div>
        </td>
      </tr>
      <tr>
        ' . email_field('Guests', $data['guests'] . ' ' . ($data['guests'] == 1 ? 'Person' : 'People')) . '
        <td></td>
      </tr>
    </table>

    <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.07);">
      <a href="tel:' . preg_replace('/[^+\d]/', '', $data['phone']) . '" style="display:inline-block;background:linear-gradient(135deg,#D4AF37,#997A00);color:#000;font-size:13px;font-weight:700;padding:10px 22px;border-radius:50px;text-decoration:none;">&#128222; Call to Confirm</a>
    </div>';

    $html = email_layout(
        'New Table Reservation',
        'Hangout Hub Cafe &mdash; Kolkata',
        $body,
        'This reservation was made via hangouthubcafe.com'
    );

    return send_html_mail($subject, $html);
}
