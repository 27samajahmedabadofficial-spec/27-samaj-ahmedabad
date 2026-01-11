# Family Registration API Setup Guide

## Database Setup

### 1. Create Family Tables
Run the following SQL migration to create the necessary tables:

```sql
-- Migration: Create family registration tables
-- Location: backend/migrations/003_create_family_tables.sql

CREATE TABLE families (
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

CREATE TABLE family_members (
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
```

## Backend Setup

### 2. Install Required Dependencies
```bash
cd backend
npm install express-fileupload
npm install
```

### 3. Backend Files Created/Updated

#### New Files:
- `backend/migrations/003_create_family_tables.sql` - Database migration
- `backend/src/controllers/familyController.js` - Family registration logic
- `backend/src/routes/familyRoutes.js` - Family API routes

#### Updated Files:
- `backend/src/index.js` - Added family routes and file upload middleware

### 4. API Endpoints

#### Register Family
**POST** `/api/family/register`
- **Auth**: Required (Bearer token)
- **Content-Type**: `multipart/form-data`
- **Request Body**:
```javascript
{
  fullName: string,
  mobileNo: string,
  villageName: string,
  currentAddress: string,
  dateOfBirth: date,
  maritalStatus: string,
  jobBusinessDetails: string,
  education: string,
  paymentStatus: 'pending' | 'completed',
  familyMembers: [{
    relation: string,
    fullName: string,
    mobileNo: string,
    dateOfBirth: date,
    maritalStatus: string,
    jobBusinessDetails: string,
    education: string
  }],
  photo: File (image file),
  receipt: File (image/pdf)
}
```
- **Response**:
```javascript
{
  success: true,
  message: "Family registration completed successfully!",
  familyId: number,
  paymentUrl: string (if payment pending)
}
```

#### Get Family Details
**GET** `/api/family/details`
- **Auth**: Required (Bearer token)
- **Response**:
```javascript
{
  success: true,
  family: {
    id: number,
    user_id: number,
    full_name: string,
    mobile_no: string,
    // ... other fields
    payment_status: 'pending' | 'completed',
    created_at: timestamp
  },
  members: [{
    id: number,
    family_id: number,
    relation_with_head: string,
    full_name: string,
    // ... other fields
  }]
}
```

#### Update Payment Status
**PUT** `/api/family/status/:familyId`
- **Auth**: Required (Bearer token)
- **Request Body**:
```javascript
{
  paymentStatus: 'completed',
  receiptUrl: string (optional)
}
```
- **Response**:
```javascript
{
  success: true,
  message: "Family status updated successfully"
}
```

## Frontend Setup

### 5. Frontend Files Created

#### New Files:
- `src/services/familyService.ts` - API service for family registration

#### Updated Files:
- `src/pages/Family.tsx` - Integrated API calls

### 6. Environment Variables

Add to your `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## File Upload Paths

- **Family Photos**: `/public/uploads/families/`
- **Payment Receipts**: `/public/uploads/families/`

Make sure the directory exists or is created automatically by the application.

## Testing the API

### 1. Register a Family
```bash
curl -X POST http://localhost:5000/api/family/register \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "fullName=John Doe" \
  -F "mobileNo=9876543210" \
  -F "villageName=Village1" \
  -F "currentAddress=123 Main Street" \
  -F "dateOfBirth=1990-01-15" \
  -F "maritalStatus=married" \
  -F "jobBusinessDetails=Software Engineer" \
  -F "education=Bachelor's Degree" \
  -F "paymentStatus=completed" \
  -F "familyMembers=[...]" \
  -F "photo=@/path/to/photo.jpg" \
  -F "receipt=@/path/to/receipt.pdf"
```

### 2. Get Family Details
```bash
curl -X GET http://localhost:5000/api/family/details \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Queries

### Check Family Registration
```sql
SELECT * FROM families WHERE user_id = 1;
```

### Check Family Members
```sql
SELECT * FROM family_members WHERE family_id = 1;
```

### Payment Status
```sql
SELECT id, full_name, payment_status, receipt_url FROM families WHERE payment_status = 'pending';
```

## Features Implemented

✅ Family head registration with photo upload
✅ Multiple family members support
✅ Payment status tracking
✅ Receipt upload for completed payments
✅ File upload with validation
✅ Database transactions for data integrity
✅ Error handling and validation
✅ Loading states in UI
✅ Toast notifications

## Troubleshooting

### Files Not Uploading
- Check that `/public/uploads/families/` directory exists
- Ensure backend has write permissions
- Verify express-fileupload is installed

### Database Errors
- Run the migration script in MySQL
- Check database credentials in `.env`
- Verify foreign key relationships

### API Errors
- Check authorization token in headers
- Verify all required fields are provided
- Check backend console for detailed errors

## Next Steps

1. Run database migration: `003_create_family_tables.sql`
2. Install backend dependencies: `npm install express-fileupload`
3. Start backend server: `npm run dev`
4. Test the Family Registration form
5. Integrate payment gateway (Razorpay/PayPal) for actual payments
