-- Fix the role column in users table
-- This script increases the size of the role column to accommodate longer enum values

-- First, check current structure
DESCRIBE elearning.users;

-- Modify the role column to be VARCHAR(50) instead of smaller size
ALTER TABLE elearning.users MODIFY COLUMN role VARCHAR(50);

-- Verify the change
DESCRIBE elearning.users;

-- Optional: Add default value
ALTER TABLE elearning.users MODIFY COLUMN role VARCHAR(50) DEFAULT 'STUDENT';

-- Check the result
SELECT * FROM elearning.users LIMIT 5;
