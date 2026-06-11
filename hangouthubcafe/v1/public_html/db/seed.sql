-- =============================================================================
-- Hangout Hub Cafe — Seed Data
-- Run AFTER schema.sql. Idempotent: clears and re-inserts cleanly.
-- =============================================================================

-- Delete in child→parent order (no FK_CHECKS toggle needed)
DELETE FROM `menu_item_pricing`;
DELETE FROM `menu_items`;
DELETE FROM `menu_categories`;

-- ── Categories ────────────────────────────────────────────────────────────────
INSERT INTO `menu_categories` (`id`, `name`, `category_line`, `tab_label`, `display_order`) VALUES
(1,  'THE PASTA PORT',      'Every strand tells a story',              'PASTA',    1),
(2,  'THE BURGER BARN',     'Stacking joy, one layer at a time',       'BURGER',   2),
(3,  'THE PIZZA PATIO',     'Hand-stretched crust, heart-warming flavors', 'PIZZA', 3),
(4,  'THE SANDWICH STUDIO', 'Crafted layers of flavor',                'SANDWICH', 4),
(5,  'THE MOMO MEADOW',     'Steam, spice, and everything nice',       'MOMO',     5),
(6,  'THE CRISPY CORNER',   'Golden, crunchy, and packed with punch',  'CRISPY',   6),
(7,  'HAND-TOSSED CHOW',    'From the Wok to your Soul',               'CHOW',     7),
(8,  'THE MAGGIE HUB',      'Your daily dose of comfort',              'MAGGIE',   8),
(9,  'THE ROLL ROAD',       'Wrapped to perfection',                   'ROLL',     9),
(10, 'THE FRY FACTORY',     'Crispy, golden, and irresistible',        'FRIES',   10);

-- ── Items ─────────────────────────────────────────────────────────────────────
-- THE PASTA PORT (category_id=1)
INSERT INTO `menu_items` (`id`, `category_id`, `name`, `image_url`, `is_best_seller`) VALUES
(1,  1, 'Veg Red Sauce',           './img/menu-items/pasta.jpeg', 0),
(2,  1, 'Veg White Sauce',         './img/menu-items/pasta.jpeg', 0),
(3,  1, 'Veg Mix Sauce',           './img/menu-items/pasta.jpeg', 0),
(4,  1, 'Egg Red Sauce',           './img/menu-items/pasta.jpeg', 0),
(5,  1, 'Chicken Red Sauce',       './img/menu-items/pasta.jpeg', 0),
(6,  1, 'Chicken White Sauce',     './img/menu-items/pasta.jpeg', 0),
(7,  1, 'Chicken Mix Sauce',       './img/menu-items/pasta.jpeg', 0),
(8,  1, 'Chkn Cheese White Sauce', './img/menu-items/pasta.jpeg', 1),
(9,  1, 'Chkn Cheese Mix Sauce',   './img/menu-items/pasta.jpeg', 0);

-- THE BURGER BARN (category_id=2)
INSERT INTO `menu_items` (`id`, `category_id`, `name`, `image_url`, `is_best_seller`) VALUES
(10, 2, 'Aloo Tikki Burger',              './img/menu-items/burger.jpeg', 0),
(11, 2, 'Chicken Burger',                 './img/menu-items/burger.jpeg', 0),
(12, 2, 'Chicken & Aloo Tikki Burger',    './img/menu-items/burger.jpeg', 0),
(13, 2, 'Double Chicken Burger',          './img/menu-items/burger.jpeg', 1),
(14, 2, 'Extra Cheese (Add-on)',          './img/menu-items/burger.jpeg', 0);

-- THE PIZZA PATIO (category_id=3)
INSERT INTO `menu_items` (`id`, `category_id`, `name`, `image_url`, `is_best_seller`) VALUES
(15, 3, 'Classic Chicken Pizza',          './img/menu-items/pizza.jpeg', 0),
(16, 3, 'Bbq Chicken Pizza',              './img/menu-items/pizza.jpeg', 1),
(17, 3, 'Chicken Popcorn Pizza',          './img/menu-items/pizza.jpeg', 0),
(18, 3, 'Chicken Momo Pizza',             './img/menu-items/pizza.jpeg', 0),
(19, 3, 'Half Corn/Half Chkn Pizza',      './img/menu-items/pizza.jpeg', 0),
(20, 3, 'Golden Corn Pizza',              './img/menu-items/pizza.jpeg', 0),
(21, 3, 'Margarita Pizza',                './img/menu-items/pizza.jpeg', 0),
(22, 3, 'Mix Veg Pizza',                  './img/menu-items/pizza.jpeg', 0),
(23, 3, 'Extra Cheese Burst (Add-on)',    './img/menu-items/pizza.jpeg', 0);

-- THE SANDWICH STUDIO (category_id=4)
INSERT INTO `menu_items` (`id`, `category_id`, `name`, `image_url`, `is_best_seller`) VALUES
(24, 4, 'Corn Sandwich',                  './img/menu-items/sandwich.jpeg', 0),
(25, 4, 'Egg Sandwich',                   './img/menu-items/sandwich.jpeg', 0),
(26, 4, 'Corn And Aloo Tikki',            './img/menu-items/sandwich.jpeg', 0),
(27, 4, 'Chicken And Corn',               './img/menu-items/sandwich.jpeg', 0),
(28, 4, 'Chicken And Aloo Tikki',         './img/menu-items/sandwich.jpeg', 0),
(29, 4, 'Club Chicken Sandwich',          './img/menu-items/sandwich.jpeg', 0),
(30, 4, 'Chicken Pizza Sandwich (Spl)',   './img/menu-items/sandwich.jpeg', 0);

-- THE MOMO MEADOW (category_id=5)
INSERT INTO `menu_items` (`id`, `category_id`, `name`, `image_url`, `is_best_seller`) VALUES
(31, 5, 'Steam Momo',    './img/menu-items/momo.jpeg', 0),
(32, 5, 'Fry Momo',      './img/menu-items/momo.jpeg', 0),
(33, 5, 'Pan Fried Momo','./img/menu-items/momo.jpeg', 1),
(34, 5, 'Baked Momo',    './img/menu-items/momo.jpeg', 0);

-- THE CRISPY CORNER (category_id=6)
INSERT INTO `menu_items` (`id`, `category_id`, `name`, `image_url`, `is_best_seller`) VALUES
(35, 6, 'Chicken Popcorn',       './img/menu-items/crispy.jpeg', 1),
(36, 6, 'Chicken Finger',        './img/menu-items/crispy.jpeg', 0),
(37, 6, 'Chicken Nuggets',       './img/menu-items/crispy.jpeg', 0),
(38, 6, 'Chicken Wings',         './img/menu-items/crispy.jpeg', 0),
(39, 6, 'Bbq Chicken Wings',     './img/menu-items/crispy.jpeg', 0),
(40, 6, 'Chicken Cutlet',        './img/menu-items/crispy.jpeg', 0),
(41, 6, 'Chicken Double Down',   './img/menu-items/crispy.jpeg', 0),
(42, 6, 'Chicken Chizza',        './img/menu-items/crispy.jpeg', 0);

-- HAND-TOSSED CHOW (category_id=7)
INSERT INTO `menu_items` (`id`, `category_id`, `name`, `image_url`, `is_best_seller`) VALUES
(43, 7, 'Veg Chow',     './img/menu-items/chowmin.jpeg', 0),
(44, 7, 'Egg Chow',     './img/menu-items/chowmin.jpeg', 0),
(45, 7, 'Chicken Chow', './img/menu-items/chowmin.jpeg', 0),
(46, 7, 'Mix Chow',     './img/menu-items/chowmin.jpeg', 0);

-- THE MAGGIE HUB (category_id=8)
INSERT INTO `menu_items` (`id`, `category_id`, `name`, `image_url`, `is_best_seller`) VALUES
(47, 8, 'Veg Maggie',           './img/menu-items/maggie.jpeg', 0),
(48, 8, 'Corn Maggie',          './img/menu-items/maggie.jpeg', 0),
(49, 8, 'Masala Corn',          './img/menu-items/maggie.jpeg', 0),
(50, 8, 'Egg Maggie',           './img/menu-items/maggie.jpeg', 0),
(51, 8, 'Chicken Maggie',       './img/menu-items/maggie.jpeg', 0),
(52, 8, 'Extra Cheese (Add-on)','./img/menu-items/maggie.jpeg', 0);

-- THE ROLL ROAD (category_id=9)
INSERT INTO `menu_items` (`id`, `category_id`, `name`, `image_url`, `is_best_seller`) VALUES
(53, 9, 'Egg Roll',             './img/menu-items/roll.jpeg', 0),
(54, 9, 'Double Egg Roll',      './img/menu-items/roll.jpeg', 0),
(55, 9, 'Egg Aloo Tikki Roll',  './img/menu-items/roll.jpeg', 0),
(56, 9, 'Chicken Roll',         './img/menu-items/roll.jpeg', 1),
(57, 9, 'Egg Chicken Roll',     './img/menu-items/roll.jpeg', 0);

-- THE FRY FACTORY (category_id=10)
INSERT INTO `menu_items` (`id`, `category_id`, `name`, `image_url`, `is_best_seller`) VALUES
(58, 10, 'Salted Fries',   './img/menu-items/fries.jpeg', 0),
(59, 10, 'Peri Peri Fries','./img/menu-items/fries.jpeg', 0),
(60, 10, 'Potato Smily',   './img/menu-items/fries.jpeg', 0),
(61, 10, 'Chilli Fries',   './img/menu-items/fries.jpeg', 0),
(62, 10, 'Cheesy Fries',   './img/menu-items/fries.jpeg', 0);

-- ── Pricing ───────────────────────────────────────────────────────────────────
INSERT INTO `menu_item_pricing` (`item_id`, `variant_label`, `price`, `display_order`) VALUES
-- Pasta: Veg Red Sauce
(1, 'Half', 40, 1), (1, 'Full', 70, 2),
-- Pasta: Veg White Sauce
(2, 'Half', 60, 1), (2, 'Full', 100, 2),
-- Pasta: Veg Mix Sauce
(3, 'Half', 60, 1), (3, 'Full', 100, 2),
-- Pasta: Egg Red Sauce
(4, 'Half', 50, 1), (4, 'Full', 80, 2),
-- Pasta: Chicken Red Sauce
(5, 'Half', 60, 1), (5, 'Full', 100, 2),
-- Pasta: Chicken White Sauce
(6, 'Half', 80, 1), (6, 'Full', 120, 2),
-- Pasta: Chicken Mix Sauce
(7, 'Half', 80, 1), (7, 'Full', 120, 2),
-- Pasta: Chkn Cheese White Sauce
(8, 'Half', 100, 1), (8, 'Full', 150, 2),
-- Pasta: Chkn Cheese Mix Sauce
(9, 'Half', 100, 1), (9, 'Full', 150, 2),

-- Burger: Aloo Tikki
(10, 'Regular', 40, 1),
-- Burger: Chicken Burger
(11, 'Regular', 60, 1),
-- Burger: Chicken & Aloo Tikki
(12, 'Regular', 80, 1),
-- Burger: Double Chicken Burger
(13, 'Regular', 90, 1),
-- Burger: Extra Cheese Add-on
(14, 'Regular', 10, 1),

-- Pizza: Classic Chicken
(15, 'Small', 130, 1), (15, 'Medium', 190, 2), (15, 'Large', 250, 3),
-- Pizza: Bbq Chicken
(16, 'Small', 140, 1), (16, 'Medium', 200, 2), (16, 'Large', 260, 3),
-- Pizza: Chicken Popcorn Pizza
(17, 'Small', 150, 1), (17, 'Medium', 200, 2), (17, 'Large', 270, 3),
-- Pizza: Chicken Momo Pizza
(18, 'Small', 160, 1), (18, 'Medium', 220, 2), (18, 'Large', 280, 3),
-- Pizza: Half Corn/Half Chkn
(19, 'Small', 160, 1), (19, 'Medium', 220, 2), (19, 'Large', 280, 3),
-- Pizza: Golden Corn
(20, 'Small', 100, 1), (20, 'Medium', 170, 2), (20, 'Large', 220, 3),
-- Pizza: Margarita
(21, 'Small', 100, 1), (21, 'Medium', 170, 2), (21, 'Large', 220, 3),
-- Pizza: Mix Veg
(22, 'Small', 120, 1), (22, 'Medium', 180, 2), (22, 'Large', 220, 3),
-- Pizza: Extra Cheese Burst Add-on
(23, 'Small', 30, 1), (23, 'Medium', 50, 2), (23, 'Large', 70, 3),

-- Sandwich
(24, 'Regular', 50, 1),
(25, 'Regular', 60, 1),
(26, 'Regular', 70, 1),
(27, 'Regular', 70, 1),
(28, 'Regular', 80, 1),
(29, 'Regular', 100, 1),
(30, 'Regular', 100, 1),

-- Momo: Steam
(31, 'Half (5pcs)', 50, 1), (31, 'Full (10pcs)', 100, 2),
-- Momo: Fry
(32, 'Half (5pcs)', 60, 1), (32, 'Full (10pcs)', 110, 2),
-- Momo: Pan Fried
(33, 'Half (5pcs)', 80, 1), (33, 'Full (10pcs)', 150, 2),
-- Momo: Baked
(34, 'Half (5pcs)', 100, 1), (34, 'Full (10pcs)', 180, 2),

-- Crispy: Chicken Popcorn
(35, 'Half (10 Pcs)', 60, 1), (35, 'Full (20 Pcs)', 120, 2),
-- Crispy: Chicken Finger
(36, 'Half (3 Pcs)', 60, 1), (36, 'Full (6 Pcs)', 120, 2),
-- Crispy: Chicken Nuggets
(37, 'Half (5 Pcs)', 60, 1), (37, 'Full (10 Pcs)', 120, 2),
-- Crispy: Chicken Wings
(38, 'Half (5 Pcs)', 80, 1), (38, 'Full (10 Pcs)', 150, 2),
-- Crispy: Bbq Chicken Wings
(39, 'Half (5 Pcs)', 100, 1), (39, 'Full (10 Pcs)', 180, 2),
-- Crispy: Chicken Cutlet
(40, '1 Pc', 60, 1),
-- Crispy: Chicken Double Down
(41, '1 Pc', 150, 1),
-- Crispy: Chicken Chizza
(42, '1 Pc', 150, 1),

-- Chow
(43, 'Half', 30, 1), (43, 'Full', 50, 2),
(44, 'Half', 30, 1), (44, 'Full', 60, 2),
(45, 'Half', 40, 1), (45, 'Full', 80, 2),
(46, 'Half', 50, 1), (46, 'Full', 100, 2),

-- Maggie
(47, 'Regular', 30, 1),
(48, 'Regular', 40, 1),
(49, 'Regular', 40, 1),
(50, 'Regular', 50, 1),
(51, 'Regular', 60, 1),
(52, 'Regular', 10, 1),

-- Roll
(53, 'Regular', 40, 1),
(54, 'Regular', 50, 1),
(55, 'Regular', 50, 1),
(56, 'Regular', 50, 1),
(57, 'Regular', 60, 1),

-- Fries
(58, 'Regular', 60, 1),
(59, 'Regular', 80, 1),
(60, 'Regular', 80, 1),
(61, 'Regular', 100, 1),
(62, 'Regular', 100, 1);
