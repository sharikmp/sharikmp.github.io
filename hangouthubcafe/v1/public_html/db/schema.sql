-- =============================================================================
-- Hangout Hub Cafe — Database Schema
-- Run this once on Hostinger via phpMyAdmin → SQL tab
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ── menu_categories ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `menu_categories` (
    `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`          VARCHAR(100) NOT NULL,
    `category_line` VARCHAR(255) NOT NULL DEFAULT '',
    `tab_label`     VARCHAR(50)  NOT NULL,
    `display_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── menu_items ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `menu_items` (
    `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `category_id`    INT UNSIGNED NOT NULL,
    `name`           VARCHAR(150) NOT NULL,
    `image_url`      VARCHAR(255) NOT NULL DEFAULT './img/menu-items/default.jpeg',
    `is_best_seller` TINYINT(1)   NOT NULL DEFAULT 0,
    `is_active`      TINYINT(1)   NOT NULL DEFAULT 1,
    `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_item_category` FOREIGN KEY (`category_id`)
        REFERENCES `menu_categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── menu_item_pricing ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `menu_item_pricing` (
    `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `item_id`       INT UNSIGNED NOT NULL,
    `variant_label` VARCHAR(50)  NOT NULL,
    `price`         DECIMAL(8,2) NOT NULL,
    `display_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    CONSTRAINT `fk_pricing_item` FOREIGN KEY (`item_id`)
        REFERENCES `menu_items`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
    `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`       VARCHAR(100) NOT NULL,
    `whatsapp`   VARCHAR(20)  NOT NULL,
    `email`      VARCHAR(150)          DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_whatsapp` (`whatsapp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── orders ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `orders` (
    `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `order_number` VARCHAR(25)     NOT NULL UNIQUE,
    `user_id`      INT UNSIGNED    NOT NULL,
    `total_amount` DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    `status`       ENUM('pending','confirmed','completed','cancelled')
                   NOT NULL DEFAULT 'pending',
    `notes`        TEXT            DEFAULT NULL,
    `payment_mode` ENUM('cash','online','pending') NOT NULL DEFAULT 'pending',
    `order_type`   ENUM('online','dinein')          NOT NULL DEFAULT 'online',
    `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── order_items ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `order_items` (
    `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `order_id`      INT UNSIGNED  NOT NULL,
    `item_name`     VARCHAR(150)  NOT NULL,
    `variant_label` VARCHAR(50)   NOT NULL,
    `unit_price`    DECIMAL(8,2)  NOT NULL,
    `quantity`      SMALLINT UNSIGNED NOT NULL,
    `subtotal`      DECIMAL(10,2) NOT NULL,
    CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`)
        REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── reservations ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `reservations` (
    `id`                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `reservation_number` VARCHAR(25)  NOT NULL UNIQUE,
    `name`               VARCHAR(100) NOT NULL,
    `phone`              VARCHAR(20)  NOT NULL,
    `date`               DATE         NOT NULL,
    `time`               TIME         NOT NULL,
    `guests`             TINYINT UNSIGNED NOT NULL DEFAULT 2,
    `status`             ENUM('pending','confirmed','cancelled')
                         NOT NULL DEFAULT 'pending',
    `created_at`         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
