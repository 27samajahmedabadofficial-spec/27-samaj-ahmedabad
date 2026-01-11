# Family Registration - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Database Tables
```bash
# Run the SQL migration in your MySQL client or terminal
mysql -u root -p 27_samaj_app < FAMILY_REGISTRATION_DB_SETUP.sql
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install express-fileupload
npm install  # if not already installed
```

### Step 3: Start Backend
```bash
npm run dev
# Should see: ✓ Database connected (MySQL)
# Should see: 🚀 Backend Server Running
```

### Step 4: Start Frontend
```bash
npm run dev
# Navigate to http://localhost:5173/family
```

---

## 📋 Database Tables

### families table (14 columns)
- `id` - Primary key
- `user_id` - Foreign key to users
- `full_name` - Family head name
- `mobile_no` - Contact number
- `village_name` - Native village
- `current_address` - Current address
- `date_of_birth` - DOB
- `marital_status` - Status (single/married/divorced/widowed)
- `job_business_details` - Job/business info
- `education` - Education details
- `photo_url` - Path to photo
- `payment_status` - Payment status (pending/completed)
- `receipt_url` - Path to receipt
- `created_at`, `updated_at` - Timestamps

### family_members table (9 columns)
- `id` - Primary key
- `family_id` - Foreign key to families
- `relation_with_head` - Relationship type
- `full_name` - Member name
- `mobile_no` - Member phone
- `date_of_birth` - Member DOB
- `marital_status` - Member status
- `job_business_details` - Job/business info
- `education` - Education details

---

## 🔌 API Endpoints

### 1️⃣ Register Family
```
POST /api/family/register
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- fullName (required)
- mobileNo (required)
- villageName
- currentAddress
- dateOfBirth
- maritalStatus
- jobBusinessDetails
- education
- paymentStatus ('pending' or 'completed')
- familyMembers (JSON string)
- photo (File)
- receipt (File, optional)
```

**Response**: Family registered successfully
```json
{
  "success": true,
  "message": "Family registration completed successfully!",
  "familyId": 123
}
```

### 2️⃣ Get Family Details
```
GET /api/family/details
Authorization: Bearer {token}
```

**Response**: Family data with all members
```json
{
  "success": true,
  "family": { /* family object */ },
  "members": [ /* family members array */ ]
}
```

### 3️⃣ Update Payment Status
```
PUT /api/family/status/{familyId}
Authorization: Bearer {token}

Body:
{
  "paymentStatus": "completed",
  "receiptUrl": "/uploads/families/receipt.pdf"
}
```

---

## 📁 Files Created/Modified

### New Backend Files
- `backend/src/controllers/familyController.js` - API logic
- `backend/src/routes/familyRoutes.js` - API routes
- `backend/migrations/003_create_family_tables.sql` - Database tables

### New Frontend Files
- `src/services/familyService.ts` - API client

### Updated Files
- `backend/src/index.js` - Added family routes
- `src/pages/Family.tsx` - Added API integration

---

## 🧪 Testing

### cURL Example
```bash
# Register family (without files)
curl -X POST http://localhost:5000/api/family/register \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "mobileNo": "9876543210",
    "villageName": "Village1",
    "currentAddress": "123 Main St",
    "dateOfBirth": "1990-01-15",
    "maritalStatus": "married",
    "jobBusinessDetails": "Software Engineer",
    "education": "Bachelor",
    "paymentStatus": "completed",
    "familyMembers": []
  }'
```

### Browser Test
1. Go to `http://localhost:5173/family`
2. Fill in family head details
3. (Optional) Add family members
4. Check "Already paid" or leave unchecked
5. Click Submit
6. Check browser console for response

---

## 🎯 Features

✅ Family head registration with photo  
✅ Multiple family members support  
✅ Payment tracking (₹500 fee)  
✅ Receipt upload for paid users  
✅ Form validation  
✅ Loading states  
✅ Toast notifications  
✅ File upload with preview  

---

## 📁 File Locations

- **Uploads**: `/public/uploads/families/`
- **DB Migration**: `FAMILY_REGISTRATION_DB_SETUP.sql`
- **Setup Docs**: `FAMILY_REGISTRATION_SETUP.md`
- **Implementation**: `FAMILY_REGISTRATION_IMPLEMENTATION.md`

---

## ⚠️ Troubleshooting

### Issue: "Database table not found"
**Solution**: Run the migration script
```bash
mysql -u root -p 27_samaj_app < FAMILY_REGISTRATION_DB_SETUP.sql
```

### Issue: "File upload failed"
**Solution**: Create uploads directory
```bash
mkdir -p public/uploads/families
chmod 755 public/uploads/families
```

### Issue: "express-fileupload not installed"
**Solution**: Install it
```bash
cd backend
npm install express-fileupload
```

### Issue: "401 Unauthorized"
**Solution**: Check JWT token
- Ensure user is logged in
- Check token in localStorage
- Verify auth header format

### Issue: "CORS error"
**Solution**: Check backend CORS settings in `backend/src/index.js`

---

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=27_samaj_app
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

---

## 🔒 Security Notes

- ✅ JWT authentication required
- ✅ File upload validation
- ✅ Database transactions
- ✅ SQL parameterized queries
- ⚠️ TODO: File size limits
- ⚠️ TODO: File type validation
- ⚠️ TODO: Rate limiting

---

## 📦 Dependencies

### Backend
- `express-fileupload` - File upload handling

### Frontend
- Uses existing dependencies (axios, react, etc.)

---

## ✅ Verification Checklist

- [ ] Database tables created
- [ ] Backend dependencies installed
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can access family registration form
- [ ] Can fill and submit form
- [ ] Photo preview working
- [ ] Payment section showing
- [ ] Form data saving to database

---

## 🎓 Next Steps

1. **Immediate**: Test the basic registration
2. **Short-term**: Add payment gateway (Razorpay/PayPal)
3. **Medium-term**: Email confirmations
4. **Long-term**: Admin dashboard, family directory

---

**Last Updated**: 2026-01-10  
**Status**: ✅ Complete & Ready to Use
