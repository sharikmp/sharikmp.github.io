-- MathTrainer leaderboard schema (MySQL 8+)
-- Run this once on your database:
--   mysql -u <user> -p <db_name> < config/sql/leaderboard.sql

CREATE TABLE IF NOT EXISTS leaderboard_scores (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    anon_id VARCHAR(26) NOT NULL,
    display_name VARCHAR(24) NOT NULL,
    score INT UNSIGNED NOT NULL,
    questions SMALLINT UNSIGNED NOT NULL,
    accuracy TINYINT UNSIGNED NOT NULL,
    overall_level SMALLINT UNSIGNED NOT NULL,
    country_code CHAR(2) NOT NULL DEFAULT 'ZZ',
    country_name VARCHAR(80) NOT NULL DEFAULT 'Unknown',
    is_anonymous TINYINT(1) NOT NULL DEFAULT 1,
    week_start DATE NOT NULL,
    played_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_hash CHAR(64) NOT NULL,
    user_agent_hash CHAR(64) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_lb_global (created_at, score, accuracy, questions),
    KEY idx_lb_country (country_code, created_at, score),
    KEY idx_lb_week (week_start, score),
    KEY idx_lb_ip_hash (ip_hash, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS leaderboard_alias_counter (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
