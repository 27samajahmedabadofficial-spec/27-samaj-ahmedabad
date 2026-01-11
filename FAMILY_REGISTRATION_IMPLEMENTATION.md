# Family Registration Implementation Summary

## Overview
Complete family registration system with photo upload, family members management, and payment tracking.

---

## Database Schema

### families table
```
id (PK)
user_id (FK) - Links to users table
full_name
mobile_no
village_name
current_address
date_of_birth
marital_status (single, married, divorced, widowed)
job_business_details
education
photo_url - Path to uploaded photo
payment_status (pending, completed)
receipt_url - Path to payment receipt
created_at
updated_at
```

### family_members table
```
id (PK)
family_id (FK) - Links to families table
relation_with_head (spouse, son, daughter, father, mother, brother, sister, other)
full_name
mobile_no
date_of_birth
marital_status
job_business_details
education
created_at
updated_at
```

---

## Files Created/Modified

### Backend Files

#### 1. Database Migration
**File**: `backend/migrations/003_create_family_tables.sql`
- Creates families table with 14 columns
- Creates family_members table with 9 columns
- Sets up foreign key relationships
- Creates indexes for performance

#### 2. Family Controller
**File**: `backend/src/controllers/familyController.js`
- `registerFamily()` - Handle family registration with file uploads
- `getFamilyDetails()` - Retrieve family data
- `updateFamilyStatus()` - Update payment status
- Handles image upload to `/public/uploads/families/`
- Database transactions for data integrity

#### 3. Family Routes
**File**: `backend/src/routes/familyRoutes.js`
- POST `/api/family/register` - Register new family
- GET `/api/family/details` - Get family information
- PUT `/api/family/status/:familyId` - Update payment status
- All routes require authentication

#### 4. Backend Index
**File**: `backend/src/index.js` (Updated)
- Added `express-fileupload` middleware
- Imported family routes
- Registered `/api/family` routes

### Frontend Files

#### 1. Family Service
**File**: `src/services/familyService.ts`
- `registerFamily()` - Send family data with FormData
- `getFamilyDetails()` - Fetch family information
- `updateFamilyPaymentStatus()` - Update payment status
- Handles multipart/form-data for file uploads

#### 2. Family Page Component
**File**: `src/pages/Family.tsx` (Updated)
- Added photo upload field with preview
- Added payment section with conditional display
- Payment checkbox for already paid users
- Receipt upload for completed payments
- Form validation
- Loading states during submission
- Toast notifications for feedback

### Documentation
**File**: `FAMILY_REGISTRATION_SETUP.md`
- Complete setup guide
- Database schema documentation
- API endpoint documentation
- Testing instructions
- Troubleshooting guide

---

## API Endpoints

### 1. Register Family
```
POST /api/family/register
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
- fullName (string, required)
- mobileNo (string, required)
- villageName (string)
- currentAddress (string)
- dateOfBirth (date)
- maritalStatus (string)
- jobBusinessDetails (string)
- education (string)
- paymentStatus (string: 'pending' or 'completed')
- familyMembers (JSON string of array)
- photo (File, image)
- receipt (File, image/pdf)

Response:
{
  success: true,
  message: "Family registration completed successfully!",
  familyId: 123,
  paymentUrl: "/api/payment/initiate/123"
}
```

### 2. Get Family Details
```
GET /api/family/details
Authorization: Bearer {token}

Response:
{
  success: true,
  family: { /* family object */ },
  members: [ /* array of family members */ ]
}
```

### 3. Update Payment Status
```
PUT /api/family/status/:familyId
Authorization: Bearer {token}

Request:
{
  paymentStatus: 'completed',
  receiptUrl: '/uploads/families/receipt.pdf'
}

Response:
{
  success: true,
  message: "Family status updated successfully"
}
```

---

## Key Features

✅ **Family Head Registration**
- Full name, mobile number, village
- Address details, date of birth
- Marital status, job/business details
- Education information
- Photo upload with preview

✅ **Family Members Management**
- Add/remove family members
- Track relation with family head
- Store member details (name, DOB, phone, etc.)
- Support for multiple family members

✅ **Payment Tracking**
- ₹500 registration fee
- "Already Paid" checkbox
- Receipt upload for paid users
- Payment status in database

✅ **File Upload**
- Family head photo (JPEG, PNG, etc.)
- Payment receipt (Images, PDF)
- Automatic file storage
- File path saved in database

✅ **Security**
- JWT authentication required
- Authorization checks
- SQL injection prevention
- File upload validation

✅ **User Experience**
- Form validation
- Error messages
- Loading states
- Toast notifications
- Image preview before upload

---

## Installation Steps

### 1. Database Setup
```bash
# Run migration in MySQL
mysql -u root -p 27_samaj_app < backend/migrations/003_create_family_tables.sql
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install express-fileupload

# Frontend (if needed)
cd ..
npm install
```

### 3. Start Services
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

### 4. Test API
Use the registration form at `/family` route or test with curl

---

## File Structure
```
backend/
├── migrations/
│   └── 003_create_family_tables.sql
├── src/
│   ├── controllers/
│   │   └── familyController.js
│   ├── routes/
│   │   └── familyRoutes.js
│   └── index.js (updated)
└── package.json

frontend/
├── src/
│   ├── pages/
│   │   └── Family.tsx (updated)
│   └── services/
│       └── familyService.ts
└── FAMILY_REGISTRATION_SETUP.md
```

---

## Dependencies Added

**Backend**
- `express-fileupload` - For handling file uploads

**Frontend**
- Already have all dependencies (axios, react, typescript)

---

## Notes

- File uploads are stored in `/public/uploads/families/`
- Directory is created automatically by the application
- Maximum file size defaults to 50MB (configurable)
- Database uses transactions for consistency
- All timestamps are in UTC
- Foreign keys ensure data integrity

---

## Next Steps

1. ✅ Database tables created
2. ✅ Backend API implemented
3. ✅ Frontend form implemented
4. ⏳ **TODO**: Integrate payment gateway (Razorpay/PayPal)
5. ⏳ **TODO**: Email notifications
6. ⏳ **TODO**: Admin dashboard for family management
7. ⏳ **TODO**: Family directory/search functionality

