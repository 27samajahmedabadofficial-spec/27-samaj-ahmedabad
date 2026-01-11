# Backend API Documentation

## Overview

Your **27-Samaj Ahmedabad** application now has a complete backend REST API for authentication and user management. This document explains the API endpoints, setup, and integration.

---

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=27_samaj_app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FRONTEND_URL=http://localhost:8080
```

### 3. Setup Database
Run the migration to add authentication fields:
```sql
-- Connect to your PostgreSQL database and run:
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE NOT NULL DEFAULT '';

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
```

### 4. Start Backend Server
```bash
npm run dev
```

Server will start at: **http://localhost:5000**

---

## API Endpoints

### Authentication Routes

#### 1. **Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "fullName": "John Doe",
      "createdAt": "2026-01-10T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Please provide a valid email address",
    "password": "Password must be at least 6 characters"
  }
}
```

---

#### 2. **Login User**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "fullName": "John Doe",
      "phone": null,
      "city": null,
      "avatarUrl": null,
      "createdAt": "2026-01-10T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

#### 3. **Get Profile** ⭐ (Requires Authentication)
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "+91-1234567890",
    "city": "Ahmedabad",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2026-01-10T10:30:00Z",
    "updatedAt": "2026-01-10T10:45:00Z"
  }
}
```

---

#### 4. **Update Profile** ⭐ (Requires Authentication)
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe Updated",
  "phone": "+91-1234567890",
  "city": "Ahmedabad",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "fullName": "John Doe Updated",
    "phone": "+91-1234567890",
    "city": "Ahmedabad",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2026-01-10T10:30:00Z",
    "updatedAt": "2026-01-10T10:50:00Z"
  }
}
```

---

#### 5. **Logout** ⭐ (Requires Authentication)
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

#### 6. **Health Check**
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-01-10T10:30:00Z"
}
```

---

## Authentication

### Bearer Token
All protected endpoints require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Structure
```javascript
{
  "id": "user-uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "iat": 1673356800,
  "exp": 1674048000
}
```

### Token Expiration
- Default: 7 days
- Can be changed in `.env` with `JWT_EXPIRATION` setting

---

## Error Handling

### Common Error Responses

#### 400 - Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Please provide a valid email address"
  }
}
```

#### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

#### 404 - Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

#### 409 - Conflict
```json
{
  "success": false,
  "message": "Email already registered"
}
```

#### 500 - Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Frontend Integration

### Using the Backend API

#### 1. **Enable Backend API in Frontend**

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_USE_BACKEND_API=true
```

#### 2. **Import Auth Service**

```typescript
import { authApiService } from "@/services/authApiService";

// Register
const result = await authApiService.register(email, password, fullName);
if (result.success) {
  console.log("Registered:", result.data);
} else {
  console.error("Error:", result.error);
}

// Login
const result = await authApiService.login(email, password);
if (result.success) {
  console.log("Logged in:", result.data);
}

// Get profile
const result = await authApiService.getProfile();
if (result.success) {
  console.log("Profile:", result.data);
}

// Update profile
const result = await authApiService.updateProfile({
  fullName: "Jane Doe",
  phone: "+91-9876543210",
  city: "Mumbai"
});

// Logout
authApiService.logout();
```

#### 3. **Use AuthContext (Dual Mode)**

The updated `AuthContextWithBackend` supports both:
- Supabase Auth (when `VITE_USE_BACKEND_API=false`)
- Backend API (when `VITE_USE_BACKEND_API=true`)

Just replace the AuthProvider:

```typescript
import { AuthProvider } from "@/contexts/AuthContextWithBackend";

// In App.tsx
<AuthProvider>
  {/* Your app */}
</AuthProvider>
```

---

## Database Schema

### profiles Table (Updated)

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name TEXT,
  phone TEXT,
  city TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_profiles_email ON public.profiles(email);
```

---

## File Structure

```
backend/
├── src/
│   ├── index.js                    # Main server file
│   ├── config/
│   │   └── database.js             # PostgreSQL connection
│   ├── controllers/
│   │   └── authController.js       # Auth logic
│   ├── routes/
│   │   └── authRoutes.js           # API routes
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification
│   └── utils/
│       ├── jwt.js                  # Token generation
│       ├── password.js             # Password hashing
│       └── validation.js           # Input validation
├── migrations/
│   └── 001_add_auth_fields.sql     # Database migration
├── package.json
├── .env.example
└── .env                            # (Don't commit this!)
```

---

## Security Features

✅ **Password Hashing**
- Uses bcrypt with 10 salt rounds
- Passwords never stored in plain text

✅ **JWT Authentication**
- Secure token-based authentication
- Token expiration (7 days default)
- Token refresh support

✅ **CORS Protection**
- Configured for specific origin
- Credentials allowed
- Methods restricted

✅ **Input Validation**
- Email validation
- Password strength requirements
- Full name validation

✅ **Error Handling**
- Generic error messages (don't leak info)
- Detailed server logs
- Proper HTTP status codes

---

## Performance Optimization

### Database Queries
- Indexed email column for fast lookups
- Efficient user profile updates
- Connection pooling (pg library)

### API Optimization
- CORS headers caching
- JSON compression support
- Request body size limits

---

## Testing Endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Profile (with token)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Update Profile
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "fullName": "Updated Name",
    "city": "Mumbai"
  }'
```

### Using Postman

1. Create a new collection
2. Add requests for each endpoint
3. Use environment variables for `{{token}}`
4. Test each endpoint sequentially

---

## Troubleshooting

### "Cannot connect to database"
- Check DB credentials in `.env`
- Verify PostgreSQL is running
- Run migration SQL to create tables

### "Invalid or expired token"
- Token may have expired (7 days default)
- User needs to login again
- Check token format: `Bearer <token>`

### "Email already registered"
- User already exists
- Try login instead of register
- Check exact email spelling

### "Validation failed"
- Check input format
- Email must be valid format
- Password minimum 6 characters
- Full name minimum 2 characters

### CORS errors
- Check `FRONTEND_URL` in `.env`
- Ensure frontend is making requests to correct API URL
- Verify `VITE_API_URL` in frontend `.env`

---

## Deployment

### Environment Variables for Production
```
PORT=5000
NODE_ENV=production
DB_HOST=your-db-host.com
DB_PORT=5432
DB_USER=db-user
DB_PASSWORD=strong-password
DB_NAME=27_samaj_app
JWT_SECRET=very-long-random-string-change-this
FRONTEND_URL=https://yourdomain.com
```

### Deployment Platforms
- **Heroku:** Set environment variables, push to Heroku
- **AWS:** Use ElasticBeanstalk or EC2
- **DigitalOcean:** App Platform or Droplet
- **Vercel/Netlify:** Not recommended (Node.js backend needs server)

---

## API Response Format

All responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": { ... }
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- `express-rate-limit` package
- Redis for distributed rate limiting
- Custom middleware

---

## Next Steps

1. ✅ Setup database with migration
2. ✅ Configure `.env` with database credentials
3. ✅ Start backend server: `npm run dev`
4. ✅ Enable backend in frontend: `VITE_USE_BACKEND_API=true`
5. ✅ Test endpoints using cURL or Postman
6. ✅ Integrate with frontend components
7. ⏳ Add email verification
8. ⏳ Implement password reset
9. ⏳ Add rate limiting
10. ⏳ Deploy to production

---

## Support

For issues or questions:
1. Check error messages in backend logs
2. Review frontend console (F12)
3. Verify database connectivity
4. Check request/response in Postman
5. See troubleshooting section above

---

**Backend API Version:** 1.0.0
**Last Updated:** January 10, 2026
