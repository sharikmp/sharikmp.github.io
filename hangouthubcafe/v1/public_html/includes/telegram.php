<?php
/**
 * Hangout Hub Cafe — Telegram Notifier
 * --------------------------------------
 * Sends order and reservation details to a Telegram group via a bot.
 *
 * Required constants (defined in config.php):
 *   TELEGRAM_BOT_TOKEN  — bot token from @BotFather, e.g. "123456:ABCdef..."
 *   TELEGRAM_CHAT_ID    — group/channel chat_id, e.g. "-1001234567890"
 *
 * If either constant is empty/missing, notifications are silently skipped.
 */

/**
 * Core sender — posts a plain text or HTML message to the configured chat.
 * Uses cURL with a 5-second timeout so it never blocks the API response.
 *
 * @param string $text     Message text (HTML formatted, parse_mode=HTML)
 * @return bool            true on success, false on failure
 */
function send_telegram(string $text): bool {
    $token  = defined('TELEGRAM_BOT_TOKEN') ? TELEGRAM_BOT_TOKEN : '';
    $chatId = defined('TELEGRAM_CHAT_ID')   ? TELEGRAM_CHAT_ID   : '';

    if ($token === '' || $chatId === '') {
        return false; // Telegram not configured — skip silently
    }

    $url     = 'https://api.telegram.org/bot' . $token . '/sendMessage';
    $payload = json_encode([
        'chat_id'                  => $chatId,
        'text'                     => $text,
        'parse_mode'               => 'HTML',
        'disable_web_page_preview' => true,
    ]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 5,
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $response = curl_exec($ch);
    $errno    = curl_errno($ch);
    curl_close($ch);

    if ($errno) {
        error_log('[HHCafe Telegram] cURL error ' . $errno . ' sending message.');
        return false;
    }

    $result = json_decode($response, true);
    if (!($result['ok'] ?? false)) {
        error_log('[HHCafe Telegram] API error: ' . ($result['description'] ?? 'unknown'));
        return false;
    }

    return true;
}

/**
 * Sends a new order notification to the Telegram group.
 *
 * @param string $orderNumber   e.g. "ORD-20260530-0001"
 * @param array  $user          ['name', 'whatsapp', 'email']
 * @param array  $items         [['item_name', 'variant_label', 'quantity', 'unit_price', 'subtotal'], ...]
 * @param float  $total         Order total
 */
function send_telegram_order(string $orderNumber, array $user, array $items, float $total): bool {
    $lines   = [];
    $lines[] = '🛒 <b>NEW ORDER</b>';
    $lines[] = '━━━━━━━━━━━━━━━━━';
    $lines[] = '📋 <b>' . htmlspecialchars($orderNumber) . '</b>';
    $lines[] = '';
    $lines[] = '👤 <b>Customer</b>';
    $lines[] = '  Name:     ' . htmlspecialchars($user['name']);
    $lines[] = '  WhatsApp: <a href="https://wa.me/' . preg_replace('/[^+\d]/', '', $user['whatsapp']) . '">' . htmlspecialchars($user['whatsapp']) . '</a>';
    if (!empty($user['email'])) {
        $lines[] = '  Email:    ' . htmlspecialchars($user['email']);
    }
    $lines[] = '';
    $lines[] = '🍽️ <b>Items</b>';

    foreach ($items as $item) {
        $variant = !empty($item['variant_label']) && $item['variant_label'] !== 'Regular'
            ? ' (' . htmlspecialchars($item['variant_label']) . ')'
            : '';
        $lines[] = '  • ' . htmlspecialchars($item['item_name']) . $variant
                 . ' × ' . $item['quantity']
                 . ' — ₹' . number_format($item['subtotal'], 2);
    }

    $lines[] = '';
    $lines[] = '💰 <b>Total: ₹' . number_format($total, 2) . '</b>';

    if (!empty($user['notes'])) {
        $lines[] = '';
        $lines[] = '📝 <b>Notes:</b> ' . htmlspecialchars($user['notes']);
    }

    $lines[] = '';
    $lines[] = '⏰ ' . date('d M Y, h:i A');

    return send_telegram(implode("\n", $lines));
}

/**
 * Sends a new reservation notification to the Telegram group.
 *
 * @param string $resNumber  e.g. "RES-20260530-0001"
 * @param array  $data       ['name', 'phone', 'date', 'time', 'guests']
 */
function send_telegram_reservation(string $resNumber, array $data): bool {
    $dateFormatted = date('D, d M Y', strtotime($data['date']));
    $timeFormatted = date('g:i A', strtotime($data['time']));

    $lines   = [];
    $lines[] = '📅 <b>NEW RESERVATION</b>';
    $lines[] = '━━━━━━━━━━━━━━━━━';
    $lines[] = '🎫 <b>' . htmlspecialchars($resNumber) . '</b>';
    $lines[] = '';
    $lines[] = '👤 <b>Guest</b>';
    $lines[] = '  Name:   ' . htmlspecialchars($data['name']);
    $lines[] = '  Phone:  <a href="tel:' . preg_replace('/[^+\d]/', '', $data['phone']) . '">' . htmlspecialchars($data['phone']) . '</a>';
    $lines[] = '';
    $lines[] = '🗓️ <b>Booking Details</b>';
    $lines[] = '  Date:   ' . $dateFormatted;
    $lines[] = '  Time:   ' . $timeFormatted;
    $lines[] = '  Guests: ' . $data['guests'] . ' ' . ($data['guests'] == 1 ? 'Person' : 'People');
    $lines[] = '';
    $lines[] = '⏰ ' . date('d M Y, h:i A');

    return send_telegram(implode("\n", $lines));
}
