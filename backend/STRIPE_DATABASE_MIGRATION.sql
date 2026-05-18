-- Stripe Payment Integration Database Migration
-- This script updates the payments table to support Stripe integration

-- 1. Add Stripe-specific columns to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS subscription_plan_id BIGINT;

-- 2. Add timestamps if not present
ALTER TABLE payments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- 3. Update status column to use ENUM instead of VARCHAR
-- First, create a backup of existing data
CREATE TABLE IF NOT EXISTS payments_backup AS SELECT * FROM payments;

-- Update status values to match PaymentStatus enum
UPDATE payments SET status = 'COMPLETED' WHERE status = 'SUCCESS' OR status = 'PAID';
UPDATE payments SET status = 'PENDING' WHERE status = 'PENDING' OR status IS NULL;
UPDATE payments SET status = 'FAILED' WHERE status = 'FAILED' OR status = 'ERROR';

-- Modify the status column to use ENUM
ALTER TABLE payments MODIFY COLUMN status ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING';

-- 4. Ensure method column is properly sized
ALTER TABLE payments MODIFY COLUMN method VARCHAR(50);

-- 5. Add foreign key constraint for subscription_plan_id
ALTER TABLE payments ADD CONSTRAINT IF NOT EXISTS fk_payment_subscription_plan 
  FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id) ON DELETE SET NULL;

-- 6. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payment_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payment_created_at ON payments(created_at);

-- 7. Verify the changes
SELECT 
  COLUMN_NAME, 
  COLUMN_TYPE, 
  IS_NULLABLE, 
  COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'payments' 
ORDER BY ORDINAL_POSITION;

-- 8. Check for any data issues
SELECT COUNT(*) as total_payments FROM payments;
SELECT status, COUNT(*) as count FROM payments GROUP BY status;

-- 9. Verify foreign key relationships
SELECT 
  CONSTRAINT_NAME, 
  TABLE_NAME, 
  COLUMN_NAME, 
  REFERENCED_TABLE_NAME, 
  REFERENCED_COLUMN_NAME 
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE TABLE_NAME = 'payments' AND REFERENCED_TABLE_NAME IS NOT NULL;

-- 10. Optional: Clean up backup table after verification
-- DROP TABLE IF EXISTS payments_backup;

-- Verification queries
-- Check payment status distribution
SELECT 'Payment Status Distribution' as report;
SELECT status, COUNT(*) as count FROM payments GROUP BY status;

-- Check payments with Stripe intent IDs
SELECT 'Payments with Stripe Intent IDs' as report;
SELECT COUNT(*) as count FROM payments WHERE stripe_payment_intent_id IS NOT NULL;

-- Check payments with subscription plans
SELECT 'Payments with Subscription Plans' as report;
SELECT COUNT(*) as count FROM payments WHERE subscription_plan_id IS NOT NULL;

-- Check for any NULL status values
SELECT 'Payments with NULL Status' as report;
SELECT COUNT(*) as count FROM payments WHERE status IS NULL;
