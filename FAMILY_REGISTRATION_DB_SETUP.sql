-- ============================================
-- FAMILY REGISTRATION DATABASE SETUP
-- Database: 27_samaj_app
-- Date: 2026-01-10
-- ============================================

USE 27_samaj_app;

-- ============================================
-- 1. FAMILIES TABLE
-- Stores family head information
-- ============================================
CREATE TABLE IF NOT EXISTS families (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  
  -- Family Head Details
  full_name VARCHAR(255) NOT NULL COMMENT 'Full name of family head',
  mobile_no VARCHAR(20) COMMENT 'Primary mobile number',
  village_name VARCHAR(255) COMMENT 'Native village name',
  current_address TEXT COMMENT 'Current residential address',
  date_of_birth DATE COMMENT 'Date of birth (YYYY-MM-DD)',
  marital_status VARCHAR(50) COMMENT 'single, married, divorced, widowed',
  job_business_details TEXT COMMENT 'Job or business description',
  education VARCHAR(255) COMMENT 'Educational qualification',
  
  -- Media & Payment
  photo_url VARCHAR(500) COMMENT 'Path to family head photo',
  payment_status ENUM('pending', 'completed') DEFAULT 'pending' COMMENT 'Registration fee payment status',
  receipt_url VARCHAR(500) COMMENT 'Path to payment receipt',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Registration date/time',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update date/time',
  
  -- Relationships & Indexes
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_family (user_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Family head registration information';

-- ============================================
-- 2. FAMILY_MEMBERS TABLE
-- Stores information about family members
-- ============================================
CREATE TABLE IF NOT EXISTS family_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  family_id INT NOT NULL,
  
  -- Member Details
  relation_with_head VARCHAR(100) NOT NULL COMMENT 'Relationship: spouse, son, daughter, etc.',
  full_name VARCHAR(255) NOT NULL COMMENT 'Full name of family member',
  mobile_no VARCHAR(20) COMMENT 'Mobile number',
  date_of_birth DATE COMMENT 'Date of birth (YYYY-MM-DD)',
  marital_status VARCHAR(50) COMMENT 'single, married, divorced, widowed',
  job_business_details TEXT COMMENT 'Job or business description',
  education VARCHAR(255) COMMENT 'Educational qualification',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation date/time',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update date/time',
  
  -- Relationships & Indexes
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  INDEX idx_family_id (family_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Family members information linked to family head';

-- ============================================
-- 3. VERIFICATION & SUCCESS MESSAGE
-- ============================================
SELECT '========================================' AS Status;
SELECT 'Family Registration Tables Created' AS Status;
SELECT '========================================' AS Status;

-- Display table structure
SELECT 'FAMILIES TABLE STRUCTURE:' AS Info;
DESCRIBE families;

SELECT '' AS Separator;
SELECT 'FAMILY_MEMBERS TABLE STRUCTURE:' AS Info;
DESCRIBE family_members;

-- ============================================
-- 4. SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment below to add sample data

/*
-- Sample Family Head
INSERT INTO families (
  user_id, full_name, mobile_no, village_name, 
  current_address, date_of_birth, marital_status, 
  job_business_details, education, payment_status
) VALUES (
  1, 'Rajesh Kumar Patel', '9876543210', 'Ahmedabad',
  '123 Main Street, Ahmedabad', '1985-05-15', 'married',
  'Software Engineer at Tech Company', 'Bachelor in Computer Science',
  'completed'
);

-- Sample Family Members
INSERT INTO family_members (
  family_id, relation_with_head, full_name, mobile_no, 
  date_of_birth, marital_status, job_business_details, education
) VALUES 
  (1, 'spouse', 'Priya Rajesh Patel', '9876543211', '1988-08-22', 'married', 'Housewife', 'Bachelor in Arts'),
  (1, 'son', 'Aarav Rajesh Patel', NULL, '2010-03-10', 'single', NULL, 'Student'),
  (1, 'daughter', 'Anika Rajesh Patel', NULL, '2012-07-18', 'single', NULL, 'Student');
*/

-- ============================================
-- 5. USEFUL QUERIES FOR MANAGEMENT
-- ============================================

/*
-- Get all families with member count
SELECT 
  f.id, f.full_name, f.mobile_no, f.payment_status,
  COUNT(fm.id) as member_count,
  f.created_at
FROM families f
LEFT JOIN family_members fm ON f.id = fm.family_id
GROUP BY f.id
ORDER BY f.created_at DESC;

-- Get families pending payment
SELECT id, full_name, mobile_no, created_at 
FROM families 
WHERE payment_status = 'pending'
ORDER BY created_at DESC;

-- Get family details with members
SELECT 
  f.id, f.full_name as 'Family Head', 
  fm.relation_with_head, fm.full_name as 'Member Name',
  fm.date_of_birth, fm.job_business_details
FROM families f
LEFT JOIN family_members fm ON f.id = fm.family_id
WHERE f.id = ?
ORDER BY fm.created_at;
*/

-- ============================================
-- 6. END OF MIGRATION
-- ============================================
SELECT 'Migration completed successfully!' AS Result;
