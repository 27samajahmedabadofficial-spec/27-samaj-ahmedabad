#!/bin/bash

# Test Family Registration API with Family Members

TOKEN="your_jwt_token_here"
API_URL="http://localhost:5000/api/family/register"

# Sample payload with family members
curl -X POST "$API_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -F "fullName=Babaubhai Patel" \
  -F "mobileNo=7359519628" \
  -F "villageName=village1" \
  -F "currentAddress=C-203, Shree Vishnudhara CrossRoad, Gota Ahmedabad" \
  -F "dateOfBirth=1992-01-04" \
  -F "maritalStatus=married" \
  -F "jobBusinessDetails=Software Engineer At TCS" \
  -F "education=B.Tech" \
  -F "paymentStatus=completed" \
  -F 'familyMembers=[{"relation":"son","fullName":"Samarth Patel","mobileNo":"","dateOfBirth":"2015-12-15","maritalStatus":"single","jobBusinessDetails":"Study","education":"Class 5th"},{"relation":"spouse","fullName":"Daxa Patel","mobileNo":"9316844510","dateOfBirth":"1990-02-05","maritalStatus":"married","jobBusinessDetails":"HouseWife","education":"B.Ed"}]'

# Verify in database with:
# mysql -u root -p 27_samaj_app
# SELECT * FROM families;
# SELECT * FROM family_members;
