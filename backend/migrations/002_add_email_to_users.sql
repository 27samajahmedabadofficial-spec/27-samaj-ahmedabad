-- Add email column to existing users table for authentication
-- This migration adds email and ensures it's unique for login functionality

USE 27_samaj_app;

-- Add email column if it doesn't exist
ALTER TABLE users 
ADD COLUMN email VARCHAR(255) UNIQUE NOT NULL DEFAULT '' AFTER id;

-- Add index on email for faster lookups
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Note: You'll need to update the email values for existing users
-- Run this to see existing users:
-- SELECT id, mobile_no FROM users;

-- Then update with actual emails:
-- UPDATE users SET email = CONCAT('user', id, '@27samaj.local') WHERE email = '';

-- Verification
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND TABLE_SCHEMA = '27_samaj_app'
ORDER BY ORDINAL_POSITION;
