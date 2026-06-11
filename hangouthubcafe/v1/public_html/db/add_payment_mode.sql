-- =============================================================================
-- Migration: Add payment_mode column to orders table
-- Run this ONLY if your orders table already exists (schema.sql was run before).
-- =============================================================================
ALTER TABLE `orders`
    ADD COLUMN `payment_mode` ENUM('cash','online','pending') NOT NULL DEFAULT 'pending'
    AFTER `notes`;
