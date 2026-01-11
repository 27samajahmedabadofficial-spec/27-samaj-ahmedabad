# Family Registration System - Architecture & Documentation

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + TypeScript)                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  src/pages/Family.tsx (Family Registration Form)              │ │
│  │  - Form state management                                       │ │
│  │  - Photo upload with preview                                   │ │
│  │  - Family members dynamic list                                 │ │
│  │  - Payment checkbox & receipt upload                           │ │
│  │  - Form validation                                             │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              ↓                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  src/services/familyService.ts (API Client)                   │ │
│  │  - registerFamily()                                            │ │
│  │  - getFamilyDetails()                                          │ │
│  │  - updateFamilyPaymentStatus()                                 │ │
│  │  - Axios instance with auth headers                            │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ HTTP/REST
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Express.js)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  API Routes (backend/src/routes/familyRoutes.js)              │ │
│  │  POST   /api/family/register          - Register family       │ │
│  │  GET    /api/family/details           - Get family info       │ │
│  │  PUT    /api/family/status/:familyId  - Update payment        │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              ↓                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Controllers (backend/src/controllers/familyController.js)     │ │
│  │  - registerFamily() - Handle registration & file uploads      │ │
│  │  - getFamilyDetails() - Fetch data                            │ │
│  │  - updateFamilyStatus() - Update payment status               │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              ↓                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Middleware                                                    │ │
│  │  - authMiddleware - JWT verification                          │ │
│  │  - fileUpload - Express-fileupload                            │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              ↓                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Database Layer                                                │ │
│  │  - MySQL connection pool                                       │ │
│  │  - Transaction support                                         │ │
│  │  - Parameterized queries                                       │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE (MySQL)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────┐    ┌────────────────────────────────────┐ │
│  │   families           │    │   family_members                   │ │
│  ├──────────────────────┤    ├────────────────────────────────────┤ │
│  │ id (PK)              │    │ id (PK)                            │ │
│  │ user_id (FK)         │───→│ family_id (FK)                     │ │
│  │ full_name            │    │ relation_with_head                 │ │
│  │ mobile_no            │    │ full_name                          │ │
│  │ village_name         │    │ mobile_no                          │ │
│  │ current_address      │    │ date_of_birth                      │ │
│  │ date_of_birth        │    │ marital_status                     │ │
│  │ marital_status       │    │ job_business_details               │ │
│  │ job_business_details │    │ education                          │ │
│  │ education            │    │ created_at                         │ │
│  │ photo_url            │    │ updated_at                         │ │
│  │ payment_status       │    └────────────────────────────────────┘ │
│  │ receipt_url          │                                           │ │
│  │ created_at           │    ┌────────────────────────────────────┐ │
│  │ updated_at           │    │   users (existing)                 │ │
│  └──────────────────────┘    ├────────────────────────────────────┤ │
│         ↑                    │ id (PK)                            │ │
│         └────────────────────│ ... (other fields)                 │ │
│                              └────────────────────────────────────┘ │
│                                                                      │
│  File Storage: /public/uploads/families/                             │
│  - {userId}_{timestamp}_photo.jpg                                    │
│  - {userId}_receipt_{timestamp}.pdf                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### Registration Flow
```
1. User fills form (Family.tsx)
   ↓
2. Submits with files (photo, receipt)
   ↓
3. familyService.registerFamily() called
   ↓
4. POST /api/family/register
   ↓
5. authMiddleware verifies JWT
   ↓
6. familyController.registerFamily()
   a. Upload photo → /public/uploads/families/
   b. Upload receipt → /public/uploads/families/
   ↓
7. Database Transaction
   a. INSERT into families
   b. INSERT into family_members (if any)
   c. COMMIT
   ↓
8. Return response with familyId
   ↓
9. Toast notification
   ↓
10. Redirect to home
```

### Retrieval Flow
```
1. GET /api/family/details
   ↓
2. authMiddleware verifies JWT
   ↓
3. familyController.getFamilyDetails()
   a. SELECT from families WHERE user_id = ?
   b. SELECT from family_members WHERE family_id = ?
   ↓
4. Return combined data
   ↓
5. Frontend updates display
```

---

## 📊 Database Relationships

```
users (existing)
  │
  │ 1:1
  │
  └─→ families
        │
        │ 1:n
        │
        └─→ family_members
```

**Keys**:
- `families.user_id` → `users.id` (Foreign Key, Unique)
- `family_members.family_id` → `families.id` (Foreign Key)

---

## 🔐 Security Layers

### Authentication
- JWT token in Authorization header
- authMiddleware validates token
- User ID extracted from token

### Authorization
- Only authenticated users can register
- Users can only access their own data
- Database enforces user_id association

### Data Validation
- Form validation in frontend
- Server-side validation in backend
- Parameterized SQL queries (prevents SQL injection)

### File Upload Security
- File type validation (images, pdf)
- Unique filename generation
- File size limits (configurable)
- Stored outside root directory

---

## 📈 Scalability Considerations

### Database
- Indexes on `user_id`, `family_id`, `created_at`
- Connection pooling (MySQL2)
- Transaction support for data consistency

### Backend
- Stateless API (can scale horizontally)
- File upload middleware
- Error handling and logging

### Frontend
- React lazy loading (code splitting)
- Form state optimization
- Toast notifications instead of alerts

---

## 🎯 API Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Family registration completed successfully!",
  "familyId": 42,
  "paymentUrl": null
}
```

### Error Response
```json
{
  "error": "Full name and mobile number are required"
}
```

### Get Details Response
```json
{
  "success": true,
  "family": {
    "id": 42,
    "user_id": 1,
    "full_name": "John Doe",
    "mobile_no": "9876543210",
    "village_name": "Village1",
    "payment_status": "pending",
    "photo_url": "/uploads/families/1_1704873600000_photo.jpg",
    "created_at": "2026-01-10T10:00:00Z"
  },
  "members": [
    {
      "id": 1,
      "family_id": 42,
      "relation_with_head": "spouse",
      "full_name": "Jane Doe",
      "mobile_no": "9876543211",
      "date_of_birth": "1992-03-15"
    }
  ]
}
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **HTTP Client**: Axios
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Routing**: React Router

### Backend
- **Framework**: Express.js
- **Language**: JavaScript (ES Modules)
- **Database**: MySQL 8.0+
- **Auth**: JWT (jsonwebtoken)
- **File Upload**: express-fileupload
- **Password**: bcryptjs
- **Validation**: validator.js

### Database
- **Type**: Relational (MySQL)
- **Storage**: InnoDB
- **Charset**: UTF-8 MB4 (Unicode support)

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Database migration executed
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] File upload directories created
- [ ] Permissions set correctly

### Testing
- [ ] Form submission works
- [ ] Photo upload works
- [ ] Database records created
- [ ] Payment status updates
- [ ] API returns correct data

### Production
- [ ] Use production database
- [ ] Enable HTTPS
- [ ] Set proper CORS origins
- [ ] Implement rate limiting
- [ ] Add monitoring/logging
- [ ] Backup strategy

---

## 🚀 Performance Optimization

### Database
```sql
-- Indexes created for:
- user_id (for quick lookups)
- family_id (for joins)
- created_at (for sorting)
- payment_status (for filtering)
```

### Backend
- Connection pooling (default: 10 connections)
- Async/await for non-blocking operations
- Transaction batching

### Frontend
- Form input debouncing
- Loading states to prevent double-submit
- Local file validation before upload

---

## 📞 Support & Maintenance

### Monitoring
- Check MySQL error logs
- Monitor Node.js process
- Track upload folder size

### Common Issues
- See FAMILY_REGISTRATION_QUICK_START.md for troubleshooting

### Backup
```bash
mysqldump -u root -p 27_samaj_app > backup.sql
```

### Restore
```bash
mysql -u root -p 27_samaj_app < backup.sql
```

---

## 📚 Documentation Files

1. **FAMILY_REGISTRATION_QUICK_START.md** - Get started in 5 minutes
2. **FAMILY_REGISTRATION_SETUP.md** - Complete setup guide
3. **FAMILY_REGISTRATION_IMPLEMENTATION.md** - Implementation details
4. **FAMILY_REGISTRATION_DB_SETUP.sql** - Database creation script
5. **FAMILY_REGISTRATION_ARCHITECTURE.md** - This file

---

**Last Updated**: 2026-01-10  
**Version**: 1.0.0  
**Status**: Production Ready ✅
