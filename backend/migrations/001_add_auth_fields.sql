-- Migration: Add authentication fields to profiles table (MySQL)
-- This migration adds email and password_hash fields needed for backend authentication

USE 27_samaj_app;

-- Add email column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE NOT NULL DEFAULT '';

-- Add password_hash column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Create unique index on email for faster lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Add created_at and updated_at if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Display success message
SELECT 'Migration completed successfully!' AS Status;

