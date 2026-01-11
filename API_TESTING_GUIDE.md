# API Testing Guide

## cURL Examples for Testing

### 1. Get Current User Details
```bash
# After login, use the token from response
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Amit Patel",
    "mobileNo": "9876543210",
    "isProfileComplete": true,
    "createdAt": "2024-01-10T10:30:00Z"
  }
}
```

### 2. Get Directory Members (No Auth)
```bash
# Get all members
curl -X GET http://localhost:5000/api/directory/members

# Search by name
curl -X GET "http://localhost:5000/api/directory/members?search=Amit"

# Search by city
curl -X GET "http://localhost:5000/api/directory/members?search=Ahmedabad"

# Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Amit Patel",
      "occupation": "Business Owner",
      "city": "Ahmedabad",
      "phone": "9876543210",
      "familySize": 4
    },
    {
      "id": 2,
      "name": "Priya Shah",
      "occupation": "Doctor",
      "city": "Mumbai",
      "phone": "9876543211",
      "familySize": 3
    }
  ],
  "total": 2
}
```

### 3. Get Family Details (No Auth)
```bash
curl -X GET http://localhost:5000/api/directory/members/1

# Response:
{
  "success": true,
  "data": {
    "familyHead": {
      "id": 1,
      "fullName": "Amit Patel",
      "mobileNo": "9876543210",
      "villageName": "Ahmedabad",
      "currentAddress": "123 Main Street, Ahmedabad",
      "dateOfBirth": "1985-05-10",
      "maritalStatus": "Married",
      "jobBusinessDetails": "Business Owner - IT Company",
      "education": "B.Tech (IT)",
      "photoUrl": "/public/uploads/families/family_1_photo.jpg",
      "paymentStatus": "completed",
      "receiptUrl": "/public/uploads/families/family_1_receipt.pdf",
      "createdAt": "2024-01-10T10:30:00Z"
    },
    "familyMembers": [
      {
        "id": 1,
        "relationWithHead": "Spouse",
        "fullName": "Priya Patel",
        "mobileNo": "9876543211",
        "dateOfBirth": "1987-08-15",
        "maritalStatus": "Married",
        "jobBusinessDetails": "Teacher",
        "education": "B.Ed"
      },
      {
        "id": 2,
        "relationWithHead": "Son",
        "fullName": "Arjun Patel",
        "mobileNo": null,
        "dateOfBirth": "2010-03-20",
        "maritalStatus": "Single",
        "jobBusinessDetails": null,
        "education": "10th Standard"
      },
      {
        "id": 3,
        "relationWithHead": "Daughter",
        "fullName": "Isha Patel",
        "mobileNo": null,
        "dateOfBirth": "2012-07-10",
        "maritalStatus": "Single",
        "jobBusinessDetails": null,
        "education": "8th Standard"
      }
    ]
  }
}
```

---

## Postman Collection

### Import this JSON into Postman

```json
{
  "info": {
    "name": "Samaj Directory API",
    "description": "API endpoints for user details and directory members",
    "version": "1.0"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{auth_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "auth_token",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Get Current User",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "pm.test('Response has user name', function () {",
              "    var jsonData = pm.response.json();",
              "    pm.expect(jsonData.data.name).to.exist;",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{auth_token}}",
            "type": "text"
          }
        ],
        "url": {
          "raw": "{{base_url}}/auth/me",
          "host": ["{{base_url}}"],
          "path": ["auth", "me"]
        }
      }
    },
    {
      "name": "Get Directory Members",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/directory/members",
          "host": ["{{base_url}}"],
          "path": ["directory", "members"],
          "query": [
            {
              "key": "search",
              "value": "Amit",
              "disabled": true
            }
          ]
        }
      }
    },
    {
      "name": "Get Family Details",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/directory/members/1",
          "host": ["{{base_url}}"],
          "path": ["directory", "members", "1"]
        }
      }
    },
    {
      "name": "Search Members",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/directory/members?search=Ahmedabad",
          "host": ["{{base_url}}"],
          "path": ["directory", "members"],
          "query": [
            {
              "key": "search",
              "value": "Ahmedabad"
            }
          ]
        }
      }
    }
  ]
}
```

---

## Frontend Testing in Browser Console

### Test 1: Fetch Current User
```javascript
const token = localStorage.getItem('authToken');
const API_URL = 'http://localhost:5000/api';

fetch(`${API_URL}/auth/me`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log('User:', data.data))
```

### Test 2: Fetch Directory Members
```javascript
const API_URL = 'http://localhost:5000/api';

fetch(`${API_URL}/directory/members`)
  .then(r => r.json())
  .then(data => console.log('Members:', data.data))
```

### Test 3: Search Members
```javascript
const API_URL = 'http://localhost:5000/api';
const searchTerm = 'Amit';

fetch(`${API_URL}/directory/members?search=${searchTerm}`)
  .then(r => r.json())
  .then(data => console.log(`Members matching "${searchTerm}":`, data.data))
```

### Test 4: Get Family Details
```javascript
const API_URL = 'http://localhost:5000/api';
const familyId = 1;

fetch(`${API_URL}/directory/members/${familyId}`)
  .then(r => r.json())
  .then(data => console.log('Family Details:', data.data))
```

---

## Expected Test Results

### Successful Response Structure
```json
{
  "success": true,
  "data": { /* actual data */ },
  "total": 5  // optional, for list endpoints
}
```

### Error Response Structure
```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes
- `200` - Success
- `400` - Bad request (missing parameters)
- `401` - Unauthorized (invalid token)
- `404` - Not found (family/user doesn't exist)
- `500` - Server error

---

## Testing Scenarios

### Scenario 1: New User Without Family Registration
**Setup**: User registered but no family profile
**Expected**:
- Header shows: "Hi, User 1"
- Directory: Doesn't appear in list

### Scenario 2: User With Complete Registration
**Setup**: User registered with complete family details
**Expected**:
- Header shows: "Hi, [FirstName]"
- Directory: Appears in list with all details
- Can search by name and find them

### Scenario 3: Family With Members
**Setup**: Family head + 3 family members registered
**Expected**:
- Directory shows `familySize: 4`
- Details endpoint returns 1 head + 3 members

### Scenario 4: Incomplete Payment
**Setup**: Family registered but `payment_status = 'pending'`
**Expected**:
- Directory: Family doesn't appear in list
- Details endpoint: Still accessible (no filter)

### Scenario 5: Search Filtering
**Setup**: Multiple families with similar names
**Expected**:
- Search "Patel" returns all Patels
- Search "Ahmedabad" returns families from that city
- Case-insensitive matching

---

## Database Verification Queries

### Check User with Family Name
```sql
SELECT u.id, u.mobile_no, f.full_name 
FROM users u
LEFT JOIN families f ON u.id = f.user_id
WHERE u.id = 1;
```

### Check Directory Members
```sql
SELECT 
  f.id,
  f.full_name,
  f.job_business_details,
  f.village_name,
  f.mobile_no,
  f.payment_status,
  COUNT(fm.id) as member_count
FROM families f
LEFT JOIN family_members fm ON f.id = fm.family_id
WHERE f.payment_status = 'completed'
GROUP BY f.id;
```

### Check Specific Family with Members
```sql
SELECT 
  f.id, f.full_name, f.job_business_details, f.village_name,
  fm.id as member_id, fm.full_name as member_name, fm.relation_with_head
FROM families f
LEFT JOIN family_members fm ON f.id = fm.family_id
WHERE f.id = 1
ORDER BY f.id, fm.id;
```

---

## Performance Notes

- Header user fetch: ~50-100ms (single DB query)
- Directory list fetch: ~100-200ms (JOIN query)
- Directory details: ~50-100ms (two queries)
- Search filtering: ~100-150ms (LIKE query)

**Optimization Tips** (if needed):
- Add database indexes on `payment_status`, `full_name`
- Cache directory list for 5 minutes
- Use pagination for large member lists
- Add `LIMIT 100` to directory query

---

## Troubleshooting

### 401 Unauthorized on /auth/me
- [ ] Verify token is in localStorage
- [ ] Check token hasn't expired
- [ ] Verify Authorization header format: `Bearer {token}`

### Empty directory list
- [ ] Check if families exist in database
- [ ] Verify `payment_status = 'completed'`
- [ ] Check if `full_name` is not null

### Wrong user name in header
- [ ] Verify family registration is saved
- [ ] Check `families` table for correct `user_id`
- [ ] Clear browser cache and re-login

### Search not working
- [ ] Verify search term matches case-insensitive
- [ ] Check data in `full_name` and `village_name` columns
- [ ] Verify database connection
