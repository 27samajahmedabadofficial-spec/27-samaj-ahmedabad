# Quick Reference: API Integration

## What Changed?

### 1. Header Now Shows Real User Name
**Before:**
```
Welcome back,
Hi, Member
```

**After:**
```
Welcome back,
Hi, Amit
```
- Fetches from `families.full_name` for logged-in user
- Updated in `src/components/layout/Header.tsx`

---

### 2. Directory Shows Real Families
**Before:**
- Static hardcoded list of 5 members

**After:**
- Fetches all families from database with `payment_status = 'completed'`
- Shows family head name, occupation, city, phone
- Includes family size
- Supports live search
- Updated in `src/pages/Directory.tsx`

---

## Backend APIs Created

### 1. Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Amit Patel",
    "mobileNo": "98765 43210",
    "isProfileComplete": true,
    "createdAt": "2024-01-10T..."
  }
}
```

### 2. Get Directory Members
```
GET /api/directory/members?search=Amit

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Amit Patel",
      "occupation": "Business Owner",
      "city": "Ahmedabad",
      "phone": "98765 43210",
      "familySize": 4
    }
  ],
  "total": 1
}
```

### 3. Get Family Details
```
GET /api/directory/members/1

Response:
{
  "success": true,
  "data": {
    "familyHead": {
      "id": 1,
      "fullName": "Amit Patel",
      "mobileNo": "98765 43210",
      "villageName": "Ahmedabad",
      "currentAddress": "...",
      "dateOfBirth": "1985-05-10",
      "maritalStatus": "Married",
      "jobBusinessDetails": "Business Owner",
      "education": "B.Com",
      "photoUrl": "/uploads/families/...",
      "paymentStatus": "completed",
      "receiptUrl": "/uploads/families/...",
      "createdAt": "2024-01-10T..."
    },
    "familyMembers": [
      {
        "id": 1,
        "relationWithHead": "Spouse",
        "fullName": "Priya Patel",
        "mobileNo": "98765 43211",
        ...
      }
    ]
  }
}
```

---

## Files Modified/Created

### Backend
- ✅ `backend/src/controllers/authController.js` - Added `getMe()`
- ✅ `backend/src/routes/authRoutes.js` - Added `/me` route
- ✅ `backend/src/controllers/directoryController.js` - NEW
- ✅ `backend/src/routes/directoryRoutes.js` - NEW
- ✅ `backend/src/index.js` - Registered directory routes

### Frontend
- ✅ `src/components/layout/Header.tsx` - Fetch user name from API
- ✅ `src/pages/Directory.tsx` - Fetch families from API

---

## How to Test

### 1. Start Backend
```bash
cd backend
npm install
npm start
```
Server runs on `http://localhost:5000`

### 2. Start Frontend
```bash
npm run dev
```
App runs on `http://localhost:5173`

### 3. Test User Name
1. Login with a registered user
2. Ensure they have completed family registration
3. Navigate to home page
4. Header should show actual name (e.g., "Hi, Amit")

### 4. Test Directory
1. Register at least one family with payment status "completed"
2. Navigate to Directory page
3. Should see list of families
4. Test search by typing name or city
5. Tap a member card to see details

---

## Database Mapping

| Family Table Column | API Field | Usage |
|-------------------|-----------|-------|
| `full_name` | `name` | User greeting & directory |
| `mobile_no` | `phone` | Contact info |
| `job_business_details` | `occupation` | Job title |
| `village_name` | `city` | Location |
| `photo_url` | Profile picture | Avatar display |
| `payment_status` | Filter | Only show "completed" |

---

## Common Issues & Solutions

### User Name Shows "User 1"
- **Cause**: Family registration not completed
- **Solution**: Complete family registration form

### Directory Shows No Members
- **Cause**: No families with `payment_status = 'completed'`
- **Solution**: Register family and mark payment as completed

### API 401 Error
- **Cause**: Invalid or missing token
- **Solution**: Clear localStorage and login again

### CORS Error
- **Cause**: Backend CORS not configured for frontend URL
- **Solution**: Check `FRONTEND_URL` env var in backend

---

## Next Steps

💡 **Optional Enhancements:**
- Add member profile cards with swipe
- Add contact functionality (call/SMS)
- Add favorite members feature
- Add family relationship visualization
- Add member filtering by profession
- Add export directory to PDF
