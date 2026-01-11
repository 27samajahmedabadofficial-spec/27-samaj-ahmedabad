# Backend API - 27 Samaj Ahmedabad

A complete Node.js + Express REST API for user authentication and profile management.

## 🚀 Quick Start

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Run database migration (in PostgreSQL)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

# 4. Start server
npm run dev
```

Server runs at: `http://localhost:5000`

## 📋 API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/profile` | Yes | Get user profile |
| PUT | `/api/auth/profile` | Yes | Update profile |
| POST | `/api/auth/logout` | Yes | Logout user |
| GET | `/api/health` | No | Health check |

## 📚 Documentation

- **[BACKEND_SETUP.md](../BACKEND_SETUP.md)** - Setup guide
- **[BACKEND_API_DOCS.md](../BACKEND_API_DOCS.md)** - API documentation
- **[.env.example](.env.example)** - Configuration template

## 🛠️ Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Validator** - Input validation

## 📂 Project Structure

```
src/
├── index.js                 # Main server
├── config/database.js       # Database connection
├── controllers/             # Route handlers
├── routes/                  # API routes
├── middleware/              # Middleware
└── utils/                   # Utilities
```

## ⚙️ Configuration

Edit `.env`:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=27_samaj_app
JWT_SECRET=your_secret_key
```

## 🔐 Security

- Password hashing with bcryptjs
- JWT-based authentication
- Input validation
- CORS protection
- SQL injection prevention

## 🧪 Testing

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📖 Full Documentation

See [BACKEND_API_DOCS.md](../BACKEND_API_DOCS.md) for complete API reference.

---

**Status:** ✅ Ready to use
**Version:** 1.0.0
**Updated:** January 10, 2026
