-- Migration: Create family registration tables
-- This migration creates tables to store family head details and family members information

USE 27_samaj_app;

-- Create families table
CREATE TABLE IF NOT EXISTS families (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  mobile_no VARCHAR(20),
  village_name VARCHAR(255),
  current_address TEXT,
  date_of_birth DATE,
  marital_status VARCHAR(50),
  job_business_details TEXT,
  education VARCHAR(255),
  photo_url VARCHAR(500),
  payment_status ENUM('pending', 'completed') DEFAULT 'pending',
  receipt_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- Create family_members table
CREATE TABLE IF NOT EXISTS family_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  family_id INT NOT NULL,
  relation_with_head VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  mobile_no VARCHAR(20),
  date_of_birth DATE,
  marital_status VARCHAR(50),
  job_business_details TEXT,
  education VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  INDEX idx_family_id (family_id),
  INDEX idx_created_at (created_at)
);

-- Display success message
SELECT 'Family tables created successfully!' AS Status;
