# MySQL Setup Guide for Backend API

## 🚀 Quick Setup with MySQL (5 Minutes)

### Step 1: Install MySQL
- **Windows/Mac/Linux:** Download from [mysql.com](https://dev.mysql.com/downloads/mysql/)
- **XAMPP:** MySQL is included! Check your XAMPP installation

### Step 2: Create Database
```bash
# Connect to MySQL
mysql -u root -p

# Create database (if not exists)
CREATE DATABASE 27_samaj_app;
USE 27_samaj_app;

# Show existing tables
SHOW TABLES;
```

Or using MySQL Workbench:
1. New Connection to localhost
2. Create new schema: `27_samaj_app`
3. Done!

### Step 3: Create Profiles Table
```sql
USE 27_samaj_app;

CREATE TABLE profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  city VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for faster email lookups
CREATE UNIQUE INDEX idx_profiles_email ON profiles(email);

-- Verify table creation
DESCRIBE profiles;
```

### Step 4: Configure Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=27_samaj_app
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:8080
```

### Step 5: Install & Start Backend
```bash
# Install dependencies
npm install

# Start server
npm run dev
```

You should see:
```
✓ Database connected (MySQL)
🚀 Backend Server Running
📍 http://localhost:5000
```

---

## 📝 MySQL vs PostgreSQL

| Feature | MySQL | PostgreSQL |
|---------|-------|-----------|
| Syntax | `AUTO_INCREMENT` | `SERIAL` |
| Returning data | Not native | `RETURNING` |
| Parameters | `?` | `$1, $2` |
| Pool library | `mysql2/promise` | `pg` |
| Timestamps | `CURRENT_TIMESTAMP` | `now()` |

---

## 🔧 Environment Configuration

### For XAMPP Users
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=27_samaj_app
```

### For Remote MySQL Server
```
DB_HOST=your-server.com
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=27_samaj_app
```

---

## 🧪 Test MySQL Connection

```bash
# From backend directory
mysql -h localhost -u root -p 27_samaj_app

# Or using MySQL CLI
mysql -u root -e "USE 27_samaj_app; SELECT * FROM profiles LIMIT 1;"
```

---

## 📊 Database Schema

### profiles Table
```sql
+------------------+--------------+----------+----------+-------+
| Field            | Type         | Null    | Key     | Extra |
+------------------+--------------+----------+----------+-------+
| id               | int(11)      | NO      | PRI     | auto  |
| email            | varchar(255) | NO      | UNI     |       |
| password_hash    | varchar(255) | NO      |         |       |
| full_name        | varchar(255) | YES     |         |       |
| phone            | varchar(20)  | YES     |         |       |
| city             | varchar(100) | YES     |         |       |
| avatar_url       | text         | YES     |         |       |
| created_at       | timestamp    | NO      |         | def.  |
| updated_at       | timestamp    | NO      |         | auto  |
+------------------+--------------+----------+----------+-------+
```

---

## 🚨 Troubleshooting

### "Can't connect to MySQL server"
```bash
# Check MySQL is running
mysql -u root -p

# Or start MySQL service
# Windows: mysql.server start
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql
```

### "Access denied for user 'root'@'localhost'"
```bash
# Reset MySQL password (if needed)
mysql -u root

# Or use no password:
DB_PASSWORD=
```

### "Database doesn't exist"
```sql
-- Create database
CREATE DATABASE 27_samaj_app;

-- Verify
SHOW DATABASES;
```

### "Table doesn't exist"
```bash
# Run migration SQL from Step 3
mysql -u root -p 27_samaj_app < backend/migrations/001_add_auth_fields.sql
```

---

## 🔐 Security for Production

### Change Root Password
```bash
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'strong_password';
FLUSH PRIVILEGES;
```

### Create Dedicated User
```sql
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON 27_samaj_app.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

### Update .env
```
DB_USER=app_user
DB_PASSWORD=strong_password
```

---

## 📚 MySQL Commands Reference

```bash
# Connect to MySQL
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use specific database
USE 27_samaj_app;

# Show tables
SHOW TABLES;

# Describe table
DESCRIBE profiles;

# View data
SELECT * FROM profiles;

# Check indexes
SHOW INDEXES FROM profiles;

# Check column info
SHOW COLUMNS FROM profiles;

# Export database
mysqldump -u root -p 27_samaj_app > backup.sql

# Import database
mysql -u root -p 27_samaj_app < backup.sql
```

---

## 🐳 Using Docker (Optional)

If you prefer Docker:

```bash
# docker-compose.yml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: 27_samaj_app
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

```bash
# Start MySQL
docker-compose up -d

# Connect
mysql -h localhost -u root -p 27_samaj_app
```

---

## 🔄 Migration from PostgreSQL

If switching from PostgreSQL:

```sql
-- MySQL version of migration
USE 27_samaj_app;

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  city VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index
CREATE UNIQUE INDEX idx_profiles_email ON profiles(email);
```

---

## ✅ Verification

After setup, verify everything works:

```bash
# 1. Test database connection
npm run dev

# 2. Test API endpoints
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test"}'

# 3. Check database
mysql -u root -p 27_samaj_app -e "SELECT * FROM profiles;"
```

---

## 🎯 Summary

✅ MySQL is now configured for your backend API
✅ All SQL queries use MySQL syntax (? parameters instead of $1, $2)
✅ Connection pooling enabled for better performance
✅ Automatic timestamp management
✅ Ready for both development and production

Next step: Start backend server with `npm run dev`

---

**MySQL Version:** 5.7+
**Backend:** Node.js + Express + MySQL2
**Driver:** mysql2/promise (modern async/await support)
