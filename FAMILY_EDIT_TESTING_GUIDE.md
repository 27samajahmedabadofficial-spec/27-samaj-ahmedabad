# Family Edit Feature - Testing Guide

## Quick Start

### Prerequisites
- Backend running on http://localhost:5000
- Frontend running on appropriate dev server
- User logged in with valid JWT token

### Feature Overview
The Family page now has TWO modes:

1. **NEW FAMILY MODE** - First time registration
2. **EXISTING FAMILY MODE** - View & Edit mode

---

## Testing Workflow

### Step 1: Register New Family
1. Navigate to Family page
2. Fill in Family Head Details:
   - Full Name ✓
   - Mobile No ✓
   - Village Name (optional)
   - Address (optional)
   - DOB (optional)
   - Marital Status (optional)
   - Job/Business (optional)
   - Education (optional)
   - Photo (optional)

3. Add Family Members:
   - Click "Add Family Member"
   - Fill Relation (required)
   - Fill Full Name (required)
   - Fill optional details
   - Repeat to add more

4. Payment Section:
   - Check "I have already paid"
   - Upload receipt or
   - Leave unchecked for online payment

5. Click "Submit"
6. Should see success toast and redirect

### Step 2: View Family Details
After registration:
1. Go back to Family page
2. Should see VIEW MODE with:
   - Family Head Card (all details)
   - Edit Button
   - Family Members Grid
   - Add Member Button
   - Delete buttons on members

### Step 3: Edit Family Head
1. In View Mode, click "Edit" button
2. Form loads with current data pre-filled
3. Modify any field (photo optional)
4. Click "Update Family"
5. Should see success toast
6. Should return to View Mode

### Step 4: Add New Member
1. In View Mode, click "Add Member"
2. Goes to Edit Mode
3. New Member form appears at bottom
4. Fill Relation (required)
5. Fill Full Name (required)
6. Fill optional details
7. Click "Add Member" button
8. Should see success toast
9. Member appears in list
10. Form clears for next member

### Step 5: Delete Member
1. In View Mode, hover over member card
2. Click trash icon
3. Confirm deletion
4. Member removed immediately
5. Count updates

---

## API Test Cases

### Test 1: Update Family Details
```bash
curl -X PUT http://localhost:5000/api/family/update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "fullName=John Doe" \
  -F "mobileNo=9876543210" \
  -F "villageName=Devpura" \
  -F "currentAddress=123 Main St" \
  -F "dateOfBirth=1980-01-15" \
  -F "maritalStatus=married" \
  -F "jobBusinessDetails=Business Owner" \
  -F "education=12th Pass"
```

### Test 2: Add Family Member
```bash
curl -X POST http://localhost:5000/api/family/members \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "relation": "son",
    "fullName": "John Jr",
    "mobileNo": "9876543211",
    "dateOfBirth": "2005-06-20",
    "maritalStatus": "single",
    "jobBusinessDetails": "Student",
    "education": "12th"
  }'
```

### Test 3: Update Family Member
```bash
curl -X PUT http://localhost:5000/api/family/members/5 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "relation": "son",
    "fullName": "John Jr Updated",
    "mobileNo": "9876543211",
    "dateOfBirth": "2005-06-20",
    "maritalStatus": "single",
    "jobBusinessDetails": "Engineer",
    "education": "B.Tech"
  }'
```

### Test 4: Delete Family Member
```bash
curl -X DELETE http://localhost:5000/api/family/members/5 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Expected Behaviors

### When Family Exists
- ✅ Page loads in VIEW MODE
- ✅ Shows all family details in card
- ✅ Shows all members in grid
- ✅ Edit button visible
- ✅ Add Member button visible
- ✅ Delete buttons on members

### When Editing
- ✅ Form fields pre-filled
- ✅ Photo shows current image
- ✅ Member list shows existing members
- ✅ New member form at bottom
- ✅ Cancel button to discard changes

### File Upload
- ✅ Photo preview shows after selection
- ✅ Existing photo shows in edit mode
- ✅ Files optional on update
- ✅ Files stored in /public/uploads/families/

### Member Management
- ✅ Can add multiple members
- ✅ Each member has unique ID
- ✅ Can delete any member (except head)
- ✅ Member count updates
- ✅ Can add after deleting

---

## Common Issues & Solutions

### Issue: Form not pre-filling
**Solution:** Clear browser cache and refresh

### Issue: Member not appearing after add
**Solution:** Check browser console for errors, verify API response

### Issue: Edit button not working
**Solution:** Check token validity, verify authentication

### Issue: File upload failing
**Solution:** Check file size, verify directory permissions

### Issue: Changes not persisting
**Solution:** Check Network tab in DevTools for failed requests

---

## Database Verification

Check if changes saved:

```sql
-- View family details
SELECT * FROM families WHERE user_id = 1;

-- View family members
SELECT * FROM family_members WHERE family_id = 1;

-- Count members
SELECT COUNT(*) FROM family_members WHERE family_id = 1;
```

---

## Success Criteria

After implementation:
- ✅ New family can be registered
- ✅ Existing family shows in view mode
- ✅ Family details can be edited
- ✅ New members can be added
- ✅ Members can be deleted
- ✅ Changes persist on page refresh
- ✅ Photos upload and display
- ✅ Proper error handling
- ✅ Loading states show
- ✅ Toast notifications appear

---

## Screenshots/UI Elements

### View Mode
```
┌─────────────────────────────────┐
│  Family Details                 │
│  ┌─────────────────────────────┐│
│  │ Family Head             Edit ││
│  │ Name: John Doe             ││
│  │ Mobile: 9876543210         ││
│  │ Village: Devpura           ││
│  │ ...                         ││
│  └─────────────────────────────┘│
│                                 │
│  Family Members (3)  Add Member │
│  ┌──────────────┐ ┌──────────────┐
│  │ Son          │ │ Daughter     │
│  │ John Jr      │ │ Jane         │
│  │ ...          │ │ ...          │
│  │ [delete]     │ │ [delete]     │
│  └──────────────┘ └──────────────┘
└─────────────────────────────────┘
```

### Edit Mode
```
┌──────────────────────────────────┐
│  Edit Family Details             │
│  ┌──────────────────────────────┐│
│  │ Family Head Details          ││
│  │ Name: [____________________] ││
│  │ Mobile: [_______________]    ││
│  │ Village: [_____________]     ││
│  │ ...                          ││
│  └──────────────────────────────┘│
│                                  │
│  Existing Members (3)            │
│  ┌──────────────┐ ┌─────────────┐│
│  │ John Jr      │ │ [delete] ││
│  │ (son)        │ │         ││
│  └──────────────┘ └─────────────┘│
│                                  │
│  ┌──────────────────────────────┐│
│  │ Add New Member               ││
│  │ Relation: [____________]     ││
│  │ Full Name: [____________]    ││
│  │ ...                          ││
│  │ [Add Member] [+ Add More]   ││
│  └──────────────────────────────┘│
│                                  │
│  [Update Family]                 │
└──────────────────────────────────┘
```

---

## Notes for Testers

1. **Clear Cache:** After deployment, clear browser cache
2. **Check Console:** Open DevTools to see any errors
3. **Network Tab:** Check if API calls are successful
4. **Token:** Ensure token is valid and not expired
5. **Database:** Verify MySQL is running and accessible
6. **Uploads:** Check `/public/uploads/families/` for files

---

## Support

For issues, check:
1. Console errors
2. Network tab
3. Database logs
4. Backend logs
5. File permissions

