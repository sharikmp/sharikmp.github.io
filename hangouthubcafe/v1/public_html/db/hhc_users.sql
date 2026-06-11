-- =============================================================================
-- Hangout Hub Cafe — Admin Users Table
-- Run this in phpMyAdmin (SQL tab) or via MySQL CLI after schema.sql
-- =============================================================================

CREATE TABLE IF NOT EXISTS `hhc_users` (
    `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username`       VARCHAR(50)  NOT NULL,
    `password_hash`  VARCHAR(255) NOT NULL,
    `role`           ENUM('admin','staff') NOT NULL DEFAULT 'staff',
    `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `last_login_at`  DATETIME DEFAULT NULL,
    `login_attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `locked_until`   DATETIME DEFAULT NULL,
    UNIQUE KEY `uq_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
