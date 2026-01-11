# Backend Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Create .env File
```bash
copy .env.example .env
```

Edit `.env`:

**For MySQL (Default - Recommended for XAMPP):**
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=27_samaj_app
JWT_SECRET=change_this_to_a_random_string_in_production
FRONTEND_URL=http://localhost:8080
```

**For PostgreSQL:**
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=27_samaj_app
JWT_SECRET=change_this_to_a_random_string_in_production
FRONTEND_URL=http://localhost:8080
```

### Step 3: Setup Database

**For MySQL (Using XAMPP):**
```bash
# Open MySQL from XAMPP Control Panel
# Or use command line:
mysql -u root -p

# Then run:
CREATE DATABASE 27_samaj_app;
USE 27_samaj_app;

-- Create profiles table
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

CREATE UNIQUE INDEX idx_profiles_email ON profiles(email);
```

**For PostgreSQL:**
```sql
-- Add email and password columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE NOT NULL DEFAULT '';

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
```

### Step 4: Start Backend Server
```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║   🚀 Backend Server Running             ║
║   📍 http://localhost:5000              ║
║   📚 API: http://localhost:5000/api     ║
╚════════════════════════════════════════╝
```

### Step 5: Enable Backend in Frontend
Edit `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_USE_BACKEND_API=true
```

### Step 6: Test Login Page
1. Frontend running at: http://localhost:8080
2. Navigate to `/auth`
3. Sign up with new account
4. Login with credentials
5. Profile should load

---

## 📋 API Endpoints

### Public Endpoints

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Protected Endpoints (Require Token)

#### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "fullName": "Jane Doe",
    "phone": "+91-1234567890",
    "city": "Mumbai"
  }'
```

#### Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | (required) |
| DB_NAME | Database name | 27_samaj_app |
| JWT_SECRET | JWT signing key | (required) |
| JWT_EXPIRATION | Token expiration | 7d |
| FRONTEND_URL | Frontend origin | http://localhost:8080 |

---

## 🗄️ Database Setup

### Option 1: Manual SQL
```sql
-- Connect to PostgreSQL
psql -U postgres -d 27_samaj_app

-- Run these commands:
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE NOT NULL DEFAULT '';

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
```

### Option 2: Using Migration File
```bash
# Place migration in database client and run
psql -U postgres -d 27_samaj_app -f backend/migrations/001_add_auth_fields.sql
```

---

## 🧪 Testing

### Using Postman
1. Create new collection
2. Add requests:
   - **Register:** POST `http://localhost:5000/api/auth/register`
   - **Login:** POST `http://localhost:5000/api/auth/login`
   - **Get Profile:** GET `http://localhost:5000/api/auth/profile`
   - **Update Profile:** PUT `http://localhost:5000/api/auth/profile`

3. For protected endpoints, set Authorization header:
   - Type: Bearer Token
   - Token: (paste token from login response)

### Using Frontend
1. Start both frontend and backend servers
2. Go to http://localhost:8080/auth
3. Sign up with new account
4. Check backend logs for requests
5. Verify profile loads

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.js                    # Main server
│   ├── config/
│   │   └── database.js             # DB connection
│   ├── controllers/
│   │   └── authController.js       # Auth logic
│   ├── routes/
│   │   └── authRoutes.js           # API routes
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT check
│   └── utils/
│       ├── jwt.js                  # Token handling
│       ├── password.js             # Hashing
│       └── validation.js           # Input checks
├── migrations/
│   └── 001_add_auth_fields.sql     # DB migration
├── package.json
└── .env                            # Config (don't commit!)
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Error: "Cannot connect to database"
- Check PostgreSQL is running
- Verify DB credentials in `.env`
- Ensure database exists: `27_samaj_app`
- Run migration SQL

### Error: "Port already in use"
```bash
# Change PORT in .env or:
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

### Error: "Invalid token"
- Token may be expired (7 days default)
- User needs to login again
- Check token format: `Bearer <token>`

### CORS Error
- Check `FRONTEND_URL` in backend `.env`
- Verify frontend `VITE_API_URL` matches backend URL
- Both must be running and accessible

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS in production
- [ ] Set DB_PASSWORD to strong password
- [ ] Don't commit `.env` file
- [ ] Use environment variables in production
- [ ] Enable HTTPS on database connection
- [ ] Add rate limiting for production
- [ ] Monitor API logs

---

## 📊 API Response Format

All responses are JSON:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": { "field": "error message" }
}
```

---

## 🚀 Deployment

### Environment Variables for Production
```
PORT=5000
NODE_ENV=production
DB_HOST=your-production-db.com
DB_PORT=5432
DB_USER=db_user
DB_PASSWORD=STRONG_PASSWORD
DB_NAME=27_samaj_app
JWT_SECRET=VERY_LONG_RANDOM_STRING_HERE
FRONTEND_URL=https://yourdomain.com
```

### Recommended Platforms
- Heroku (easy deployment)
- AWS (scalable)
- DigitalOcean (affordable)
- Vercel (not recommended for Node backend)

---

## 📚 Documentation

For detailed API documentation, see: [BACKEND_API_DOCS.md](BACKEND_API_DOCS.md)

---

## Support

**Issues?**
1. Check backend logs (`npm run dev`)
2. Check frontend logs (F12 Console)
3. Verify database connectivity
4. Check network requests in DevTools
5. See troubleshooting section above

---

**Status:** ✅ Ready to use
**Backend Version:** 1.0.0
**Last Updated:** January 10, 2026
