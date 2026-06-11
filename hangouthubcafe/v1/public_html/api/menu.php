<?php
/**
 * Hangout Hub Cafe — Menu API
 * GET /api/menu.php
 * Returns the full menu as JSON, matching the shape of the original menu.js
 * so the frontend JS works without changes.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300'); // 5-min browser cache

require_once __DIR__ . '/../includes/db.php';

try {
    $pdo = get_db();

    // Fetch all categories ordered by display_order
    $catStmt = $pdo->query(
        "SELECT id, name, category_line, tab_label FROM menu_categories ORDER BY display_order ASC"
    );
    $categories = $catStmt->fetchAll();

    // Fetch all active items with their pricing in one query
    $itemStmt = $pdo->query(
        "SELECT
            i.id,
            i.category_id,
            i.name,
            i.image_url,
            i.is_best_seller,
            p.variant_label,
            p.price
         FROM menu_items i
         JOIN menu_item_pricing p ON p.item_id = i.id
         WHERE i.is_active = 1
         ORDER BY i.id ASC, p.display_order ASC"
    );
    $rows = $itemStmt->fetchAll();

    // Group pricing by item_id
    $itemsMap = [];
    foreach ($rows as $row) {
        $iid = $row['id'];
        if (!isset($itemsMap[$iid])) {
            $itemsMap[$iid] = [
                'id'             => $iid,
                'category_id'    => $row['category_id'],
                'name'           => $row['name'],
                'image_url'      => $row['image_url'],
                'is_best_seller' => (bool)$row['is_best_seller'],
                'pricing'        => [],
            ];
        }
        $itemsMap[$iid]['pricing'][$row['variant_label']] = (float)$row['price'];
    }

    // Build best-sellers virtual category
    $bestSellers = array_values(array_filter($itemsMap, fn($item) => $item['is_best_seller']));

    // Build regular category sections
    $menuSections = [];

    if (!empty($bestSellers)) {
        $menuSections[] = [
            'category'      => 'BEST SELLERS',
            'category_line' => 'Most loved picks from the full menu',
            'tab'           => 'BEST SELLERS',
            'items'         => array_map(fn($i) => [
                'name'      => $i['name'],
                'pricing'   => $i['pricing'],
                'image_url' => $i['image_url'],
            ], $bestSellers),
        ];
    }

    foreach ($categories as $cat) {
        $catItems = array_values(array_filter($itemsMap, fn($i) => $i['category_id'] == $cat['id']));
        if (empty($catItems)) continue;

        $menuSections[] = [
            'category'      => $cat['name'],
            'category_line' => $cat['category_line'],
            'tab'           => $cat['tab_label'],
            'items'         => array_map(fn($i) => [
                'name'      => $i['name'],
                'pricing'   => $i['pricing'],
                'image_url' => $i['image_url'],
            ], $catItems),
        ];
    }

    // Build filter_tabs
    $filterTabs = ['All Items', 'BEST SELLERS'];
    foreach ($categories as $cat) {
        $filterTabs[] = $cat['tab_label'];
    }

    echo json_encode([
        'restaurant' => [
            'name'    => 'HANGOUT Hub CAFE',
            'tagline' => 'GOOD FOOD GOOD MOOD GOOD TIMES',
        ],
        'filter_tabs' => $filterTabs,
        'menu'        => $menuSections,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
    error_log('[HHCafe menu.php] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'msg' => 'Could not load menu. Please refresh.']);
}
