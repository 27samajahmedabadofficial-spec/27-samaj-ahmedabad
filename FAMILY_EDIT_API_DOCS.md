# Family Edit & Management API Documentation

## Overview
This document describes the new family editing and member management APIs added to the backend.

## New Endpoints

### 1. Update Family Details
**Endpoint:** `PUT /api/family/update`  
**Authentication:** Required (Bearer Token)  
**Description:** Update family head details and upload new photo/receipt

#### Request Headers
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Request Body (FormData)
```
- fullName: string (required)
- mobileNo: string (required)
- villageName: string
- currentAddress: string
- dateOfBirth: string (YYYY-MM-DD)
- maritalStatus: string (single|married|divorced|widowed)
- jobBusinessDetails: string
- education: string
- paymentStatus: string (optional - completed|pending)
- photo: File (optional - image file)
- receipt: File (optional - image/pdf)
```

#### Success Response
```json
{
  "success": true,
  "message": "Family details updated successfully",
  "familyId": 1
}
```

#### Error Response
```json
{
  "error": "No family registration found"
}
```

---

### 2. Add Family Member
**Endpoint:** `POST /api/family/members`  
**Authentication:** Required (Bearer Token)  
**Description:** Add a new family member to existing family

#### Request Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body (JSON)
```json
{
  "relation": "son",
  "fullName": "John Doe",
  "mobileNo": "9876543210",
  "dateOfBirth": "2000-01-15",
  "maritalStatus": "single",
  "jobBusinessDetails": "Student",
  "education": "B.Tech"
}
```

#### Success Response
```json
{
  "success": true,
  "message": "Family member added successfully",
  "memberId": 5
}
```

#### Error Response
```json
{
  "error": "Relation and full name are required"
}
```

---

### 3. Update Family Member
**Endpoint:** `PUT /api/family/members/:memberId`  
**Authentication:** Required (Bearer Token)  
**Description:** Update details of an existing family member

#### URL Parameters
```
memberId: number (family member ID)
```

#### Request Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body (JSON)
```json
{
  "relation": "son",
  "fullName": "John Doe",
  "mobileNo": "9876543210",
  "dateOfBirth": "2000-01-15",
  "maritalStatus": "single",
  "jobBusinessDetails": "Engineer",
  "education": "B.Tech"
}
```

#### Success Response
```json
{
  "success": true,
  "message": "Family member updated successfully"
}
```

#### Error Response
```json
{
  "error": "Family member not found"
}
```

---

### 4. Delete Family Member
**Endpoint:** `DELETE /api/family/members/:memberId`  
**Authentication:** Required (Bearer Token)  
**Description:** Remove a family member from the family

#### URL Parameters
```
memberId: number (family member ID)
```

#### Request Headers
```
Authorization: Bearer <token>
```

#### Success Response
```json
{
  "success": true,
  "message": "Family member deleted successfully"
}
```

#### Error Response
```json
{
  "error": "Family member not found"
}
```

---

## Frontend Integration

### Service Methods (familyService.ts)

#### updateFamily()
```typescript
const response = await familyService.updateFamily(
  familyData,
  photoFile,    // optional
  receiptFile   // optional
);
```

#### addFamilyMember()
```typescript
const response = await familyService.addFamilyMember({
  relation: "son",
  fullName: "John",
  mobileNo: "9876543210",
  dateOfBirth: "2000-01-15",
  maritalStatus: "single",
  jobBusinessDetails: "Student",
  education: "B.Tech"
});
```

#### updateFamilyMember()
```typescript
const response = await familyService.updateFamilyMember(memberId, {
  relation: "son",
  fullName: "John",
  // ... other fields
});
```

#### deleteFamilyMember()
```typescript
const response = await familyService.deleteFamilyMember(memberId);
```

---

## Family.tsx UI Workflow

### 1. Initial Load
- Component fetches existing family on mount
- If family exists → shows VIEW MODE
- If no family → shows REGISTRATION FORM

### 2. View Mode
When family is registered:
- Shows family head details in a card
- Displays all family members in a grid
- "Edit" button to enter edit mode
- "Add Member" button to add new members
- Delete buttons on members for removal

### 3. Edit Mode
When editing:
- Form fields pre-filled with current data
- Can update family head details
- Can add new members via form
- Can delete existing members (with confirmation)
- Photo/receipt upload optional (leave blank to keep existing)

### 4. Member Management
- **Add New Member:** Fill form → Click "Add Member" button
- **Delete Member:** Click trash icon → Confirm deletion
- **Edit Member:** Delete and re-add (or implement inline edit in future)

---

## Database Schema

### families table
```sql
id              INT PRIMARY KEY AUTO_INCREMENT
user_id         INT FOREIGN KEY
full_name       VARCHAR(255)
mobile_no       VARCHAR(10)
village_name    VARCHAR(100)
current_address TEXT
date_of_birth   DATE
marital_status  VARCHAR(20)
job_business_details TEXT
education       VARCHAR(255)
photo_url       VARCHAR(500)
payment_status  VARCHAR(20) DEFAULT 'pending'
receipt_url     VARCHAR(500)
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

### family_members table
```sql
id                   INT PRIMARY KEY AUTO_INCREMENT
family_id            INT FOREIGN KEY
relation_with_head   VARCHAR(50)
full_name            VARCHAR(255)
mobile_no            VARCHAR(10)
date_of_birth        DATE
marital_status       VARCHAR(20)
job_business_details TEXT
education            VARCHAR(255)
created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

---

## Testing Checklist

- [ ] Register new family with members
- [ ] View family details in view mode
- [ ] Edit family head details
- [ ] Upload new photo
- [ ] Upload receipt
- [ ] Add new family member
- [ ] Delete family member
- [ ] Verify data persists on refresh
- [ ] Check error handling for validation
- [ ] Verify member count updates
- [ ] Test with multiple family members
- [ ] Test token expiration handling
- [ ] Test concurrent updates

---

## Error Handling

All endpoints return proper error responses:
- **401 Unauthorized:** User not authenticated
- **400 Bad Request:** Missing required fields
- **404 Not Found:** Family or member not found
- **500 Server Error:** Database or file upload error

---

## Notes

1. All file uploads are stored in `/public/uploads/families/`
2. Files are named: `{userId}_{timestamp}_{originalName}`
3. Transactions are used for data consistency
4. All timestamps are automatically managed by MySQL
5. Photo and receipt are optional on update
6. Existing photo/receipt are preserved if not replaced

