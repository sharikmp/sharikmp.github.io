<?php
/**
 * Hangout Hub Cafe — Menu API
 * GET /hhcpanel/api/menu.php
 *
 * Returns all active categories and their items with pricing variants.
 * Response shape:
 * {
 *   ok: true,
 *   categories: [ {id, name, tab_label, display_order}, ... ],
 *   items: [
 *     {
 *       id, category_id, category, name, image_url, is_best_seller,
 *       variants: [ {id, variant_label, price, display_order}, ... ]
 *     }, ...
 *   ]
 * }
 */

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../../includes/db.php';
require_auth_api();

header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = get_db();

    // ── Categories ────────────────────────────────────────────────────────────
    $cats = $pdo->query(
        'SELECT id, name, tab_label, display_order
         FROM menu_categories
         ORDER BY display_order ASC, id ASC'
    )->fetchAll(PDO::FETCH_ASSOC);

    // ── Items + variants in one query (join) ──────────────────────────────────
    $rows = $pdo->query(
        'SELECT
            mi.id          AS item_id,
            mi.category_id,
            mc.name        AS category,
            mi.name        AS item_name,
            mi.image_url,
            mi.is_best_seller,
            p.id           AS pricing_id,
            p.variant_label,
            p.price,
            p.display_order AS variant_order
         FROM menu_items mi
         JOIN menu_categories mc ON mc.id = mi.category_id
         JOIN menu_item_pricing p ON p.item_id = mi.id
         WHERE mi.is_active = 1
         ORDER BY mc.display_order ASC, mi.id ASC, p.display_order ASC'
    )->fetchAll(PDO::FETCH_ASSOC);

    // ── Group variants under each item ────────────────────────────────────────
    $itemsMap = [];
    foreach ($rows as $r) {
        $iid = (int)$r['item_id'];
        if (!isset($itemsMap[$iid])) {
            $itemsMap[$iid] = [
                'id'            => $iid,
                'category_id'   => (int)$r['category_id'],
                'category'      => $r['category'],
                'name'          => $r['item_name'],
                'image_url'     => $r['image_url'],
                'is_best_seller'=> (bool)$r['is_best_seller'],
                'variants'      => [],
            ];
        }
        $itemsMap[$iid]['variants'][] = [
            'id'            => (int)$r['pricing_id'],
            'variant_label' => $r['variant_label'],
            'price'         => (float)$r['price'],
            'display_order' => (int)$r['variant_order'],
        ];
    }

    echo json_encode([
        'ok'         => true,
        'categories' => array_values($cats),
        'items'      => array_values($itemsMap),
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Failed to load menu.']);
}
