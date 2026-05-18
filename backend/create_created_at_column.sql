-- Add created_at column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
