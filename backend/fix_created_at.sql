-- Fix the created_at column issue
-- Drop the column if it exists and recreate it
ALTER TABLE users DROP COLUMN IF EXISTS created_at;
ALTER TABLE users ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing records with current timestamp
UPDATE users SET created_at = NOW() WHERE created_at IS NULL;
