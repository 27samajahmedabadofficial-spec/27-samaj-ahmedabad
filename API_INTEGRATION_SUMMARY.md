# User Details & Directory API Integration

## Changes Implemented

### 1. **Backend API Endpoints Added**

#### A. User Details Endpoint - `GET /api/auth/me`
- **Purpose**: Fetch logged-in user's details
- **Authentication**: Requires Bearer token
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Amit Patel",
    "mobileNo": "98765 43210",
    "isProfileComplete": true,
    "createdAt": "2024-01-10T10:30:00Z"
  }
}
```
- **Details**: 
  - Fetches user name from family registration (from `families.full_name`)
  - Falls back to `User {id}` if no family profile exists
  - User name is extracted from families table to match the header display

#### B. Directory Members Endpoint - `GET /api/directory/members`
- **Purpose**: Fetch all registered families for the directory
- **Query Parameters**: `search` (optional)
- **Response**:
```json
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
  "total": 5
}
```
- **Details**:
  - Shows only families with `payment_status = 'completed'`
  - Maps `job_business_details` to `occupation`
  - Maps `village_name` to `city`
  - Includes family size (head + members count)
  - Supports search by name or city

#### C. Family Details Endpoint - `GET /api/directory/members/:familyId`
- **Purpose**: Fetch detailed info about a specific family
- **Returns**: Complete family head details + all family members

### 2. **Frontend Changes**

#### A. Header Component (`src/components/layout/Header.tsx`)
**Before**: Displayed hardcoded "Member"
**After**: 
- Fetches logged-in user's actual name from `/api/auth/me` endpoint
- Shows first name only in header greeting
- Example: "Hi, Amit" instead of "Hi, Member"

#### B. Directory Page (`src/pages/Directory.tsx`)
**Before**: Static hardcoded member list
**After**:
- Fetches real family data from `/api/directory/members` API
- Shows loading state while fetching
- Displays error message if API fails
- Shows empty state when no members exist
- Supports client-side search filtering
- Real family data from database

### 3. **Backend Files Created**

#### New File: `backend/src/controllers/directoryController.js`
- Contains `getDirectoryMembers()` function
- Contains `getFamilyDetails()` function
- Handles database queries for family/member data

#### New File: `backend/src/routes/directoryRoutes.js`
- Public routes for directory endpoints
- No authentication required (showing community directory)

#### Updated File: `backend/src/index.js`
- Imported and registered directory routes
- Route: `/api/directory`

#### Updated File: `backend/src/controllers/authController.js`
- Added `getMe()` function
- Fetches current logged-in user with family name

#### Updated File: `backend/src/routes/authRoutes.js`
- Added new route: `GET /api/auth/me`
- Protected route (requires auth token)

### 4. **Database Queries**

#### User Name Query:
```sql
SELECT full_name FROM families WHERE user_id = ? LIMIT 1
```

#### Directory Members Query:
```sql
SELECT 
  f.id,
  f.full_name as name,
  f.mobile_no,
  f.job_business_details as occupation,
  f.village_name as city,
  f.photo_url,
  COUNT(fm.id) as family_size
FROM families f
LEFT JOIN family_members fm ON f.id = fm.family_id
WHERE f.payment_status = 'completed'
AND (f.full_name LIKE ? OR f.village_name LIKE ?)  -- optional search
GROUP BY f.id
ORDER BY f.created_at DESC
```

## API Endpoints Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/me` | GET | ✅ Required | Get logged-in user details |
| `/api/directory/members` | GET | ❌ No | List all families for directory |
| `/api/directory/members/:id` | GET | ❌ No | Get family details by ID |

## Flow Diagram

### User Header Display:
```
User Logs In
    ↓
Token Stored in localStorage
    ↓
Header Component Mounts
    ↓
Fetch /api/auth/me with token
    ↓
Get user name from families table
    ↓
Display "Hi, [FirstName]"
```

### Directory Member List:
```
Directory Page Loads
    ↓
useEffect triggers
    ↓
Fetch /api/directory/members
    ↓
Query families table with payment_status='completed'
    ↓
Map database fields to UI fields
    ↓
Display family list or loading/error states
    ↓
User can search by name or city
```

## Key Features

✅ **Dynamic User Name**: Shows actual family head name instead of "Member"
✅ **Real Family Data**: Directory displays actual registered families from database
✅ **Search Functionality**: Filter members by name or city
✅ **Loading States**: UI shows loader while fetching data
✅ **Error Handling**: Graceful error messages if API fails
✅ **Empty States**: Appropriate message when no data available
✅ **Payment Status**: Only shows families with completed payment status
✅ **Family Size**: Displays count of family members for each head

## Testing

### To test user name display:
1. Register/Login a user
2. Fill family registration form with full name
3. Navigate to home page
4. Header should show "Hi, [FirstName]"

### To test directory:
1. Ensure families are registered with `payment_status = 'completed'`
2. Navigate to Directory page
3. Should see list of families
4. Search by name or city
5. Click on member cards to view details

## Environment Variables

No new environment variables needed. Uses existing:
- `VITE_API_URL` (Frontend) - Backend API URL
- `PORT` (Backend) - Server port (default: 5000)
