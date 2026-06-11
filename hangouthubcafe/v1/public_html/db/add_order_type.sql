-- =============================================================================
-- Migration: Add order_type column to orders table
-- Run this ONLY if your orders table already exists (schema.sql was run before).
-- =============================================================================
ALTER TABLE `orders`
    ADD COLUMN `order_type` ENUM('online','dinein') NOT NULL DEFAULT 'online'
    AFTER `payment_mode`;
