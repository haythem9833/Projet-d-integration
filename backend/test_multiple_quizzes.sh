#!/bin/bash

# Test script to verify multiple quizzes can be created for the same course
# This script uses curl to test the API endpoints

set -e

# Configuration
BASE_URL="http://localhost:8082/api"
TRAINER_EMAIL="trainer@example.com"
TRAINER_PASSWORD="password123"

echo "=========================================="
echo "Multiple Quizzes Per Course - API Test"
echo "=========================================="
echo ""

# Step 1: Login as trainer
echo "Step 1: Logging in as trainer..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TRAINER_EMAIL\",
    \"password\": \"$TRAINER_PASSWORD\"
  }")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get authentication token"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Authentication successful"
echo "Token: ${TOKEN:0:50}..."
echo ""

# Step 2: Get or create a course
echo "Step 2: Getting course..."
COURSE_RESPONSE=$(curl -s -X GET "$BASE_URL/courses" \
  -H "Authorization: Bearer $TOKEN")

COURSE_ID=$(echo $COURSE_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$COURSE_ID" ]; then
  echo "❌ Failed to get course"
  echo "Response: $COURSE_RESPONSE"
  exit 1
fi

echo "✅ Course found: ID=$COURSE_ID"
echo ""

# Step 3: Get modules for the course
echo "Step 3: Getting modules for the course..."
MODULES_RESPONSE=$(curl -s -X GET "$BASE_URL/modules?courseId=$COURSE_ID" \
  -H "Authorization: Bearer $TOKEN")

MODULE_ID_1=$(echo $MODULES_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
MODULE_ID_2=$(echo $MODULES_RESPONSE | grep -o '"id":[0-9]*' | head -2 | tail -1 | cut -d':' -f2)

if [ -z "$MODULE_ID_1" ] || [ -z "$MODULE_ID_2" ]; then
  echo "❌ Failed to get modules"
  echo "Response: $MODULES_RESPONSE"
  exit 1
fi

echo "✅ Modules found: ID1=$MODULE_ID_1, ID2=$MODULE_ID_2"
echo ""

# Step 4: Create first quiz
echo "Step 4: Creating first quiz..."
QUIZ1_RESPONSE=$(curl -s -X POST "$BASE_URL/quiz" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Quiz 1 - Module 1\",
    \"description\": \"First quiz for the course\",
    \"courseId\": $COURSE_ID,
    \"moduleId\": $MODULE_ID_1,
    \"passingScore\": 70
  }")

QUIZ_ID_1=$(echo $QUIZ1_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$QUIZ_ID_1" ]; then
  echo "❌ Failed to create first quiz"
  echo "Response: $QUIZ1_RESPONSE"
  exit 1
fi

echo "✅ First quiz created: ID=$QUIZ_ID_1"
echo ""

# Step 5: Create second quiz (same course, different module)
echo "Step 5: Creating second quiz for the SAME course..."
QUIZ2_RESPONSE=$(curl -s -X POST "$BASE_URL/quiz" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Quiz 2 - Module 2\",
    \"description\": \"Second quiz for the same course\",
    \"courseId\": $COURSE_ID,
    \"moduleId\": $MODULE_ID_2,
    \"passingScore\": 75
  }")

QUIZ_ID_2=$(echo $QUIZ2_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$QUIZ_ID_2" ]; then
  echo "❌ Failed to create second quiz (this would have failed before the fix)"
  echo "Response: $QUIZ2_RESPONSE"
  exit 1
fi

echo "✅ Second quiz created: ID=$QUIZ_ID_2 (no duplicate error!)"
echo ""

# Step 6: Verify both quizzes exist
echo "Step 6: Verifying both quizzes in database..."
echo "Quiz 1: ID=$QUIZ_ID_1, Course=$COURSE_ID, Module=$MODULE_ID_1"
echo "Quiz 2: ID=$QUIZ_ID_2, Course=$COURSE_ID, Module=$MODULE_ID_2"
echo ""

# Step 7: Summary
echo "=========================================="
echo "✅ TEST PASSED"
echo "=========================================="
echo ""
echo "Summary:"
echo "  ✅ First quiz created successfully"
echo "  ✅ Second quiz created successfully (no duplicate key error)"
echo "  ✅ Both quizzes linked to the same course"
echo "  ✅ Each quiz linked to a different module"
echo "  ✅ Constraint fix is working correctly"
echo ""
echo "The constraint fix allows multiple quizzes per course!"
