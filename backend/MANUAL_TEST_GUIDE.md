# Manual Test Guide: Multiple Quizzes Per Course

## Quick Start

This guide provides step-by-step instructions to manually test that multiple quizzes can be created for the same course.

## Prerequisites

1. Backend server running on `http://localhost:8082`
2. MySQL database running with the `elearning` database
3. Postman or similar API testing tool (or use curl)
4. A trainer account (or admin account)

## Test Steps

### Step 1: Get Authentication Token

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "trainer@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "role": "TRAINER"
}
```

**Save the token for subsequent requests.**

### Step 2: Get or Create a Course

**Option A: Get Existing Course**

**Endpoint:** `GET /api/courses`

**Headers:**
```
Authorization: Bearer <token>
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "Sample Course",
    "description": "A sample course",
    "price": 99.99,
    "category": "Technology"
  }
]
```

**Save the course ID (e.g., 1)**

**Option B: Create New Course**

**Endpoint:** `POST /api/courses`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Test Course for Multiple Quizzes",
  "description": "A course to test multiple quizzes",
  "price": 99.99,
  "category": "Technology"
}
```

**Expected Response:**
```json
{
  "id": 5,
  "title": "Test Course for Multiple Quizzes",
  "description": "A course to test multiple quizzes",
  "price": 99.99,
  "category": "Technology"
}
```

**Save the course ID (e.g., 5)**

### Step 3: Get or Create Modules

**Option A: Get Existing Modules**

**Endpoint:** `GET /api/modules?courseId=<course_id>`

**Headers:**
```
Authorization: Bearer <token>
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "Module 1",
    "description": "First module",
    "courseId": 5
  },
  {
    "id": 2,
    "title": "Module 2",
    "description": "Second module",
    "courseId": 5
  }
]
```

**Save module IDs (e.g., 1 and 2)**

**Option B: Create New Modules**

**Endpoint:** `POST /api/modules`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body for Module 1:**
```json
{
  "title": "Module 1",
  "description": "First module",
  "courseId": 5
}
```

**Expected Response:**
```json
{
  "id": 1,
  "title": "Module 1",
  "description": "First module",
  "courseId": 5
}
```

**Repeat for Module 2:**
```json
{
  "title": "Module 2",
  "description": "Second module",
  "courseId": 5
}
```

**Save module IDs (e.g., 1 and 2)**

### Step 4: Create First Quiz

**Endpoint:** `POST /api/quiz`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Quiz 1 - Module 1",
  "description": "First quiz for the course",
  "courseId": 5,
  "moduleId": 1,
  "passingScore": 70
}
```

**Expected Response:**
```json
{
  "id": 1,
  "title": "Quiz 1 - Module 1",
  "description": "First quiz for the course",
  "passingScore": 70
}
```

**✅ First quiz created successfully**

**Save the quiz ID (e.g., 1)**

### Step 5: Create Second Quiz (Same Course, Different Module)

**Endpoint:** `POST /api/quiz`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Quiz 2 - Module 2",
  "description": "Second quiz for the same course",
  "courseId": 5,
  "moduleId": 2,
  "passingScore": 75
}
```

**Expected Response:**
```json
{
  "id": 2,
  "title": "Quiz 2 - Module 2",
  "description": "Second quiz for the same course",
  "passingScore": 75
}
```

**✅ Second quiz created successfully (this would have failed before the fix)**

**Save the quiz ID (e.g., 2)**

### Step 6: Verify Both Quizzes in Database

**SQL Query:**
```sql
SELECT id, title, course_id, module_id, passing_score 
FROM quiz 
WHERE course_id = 5
ORDER BY id;
```

**Expected Result:**
```
+----+-------------------+-----------+-----------+---------------+
| id | title             | course_id | module_id | passing_score |
+----+-------------------+-----------+-----------+---------------+
|  1 | Quiz 1 - Module 1 |         5 |         1 |            70 |
|  2 | Quiz 2 - Module 2 |         5 |         2 |            75 |
+----+-------------------+-----------+-----------+---------------+
```

**✅ Both quizzes exist in the database**

### Step 7: Verify Constraint Fix

**SQL Query:**
```sql
SHOW INDEXES FROM quiz;
```

**Expected Result:**
- No unique index on `course_id`
- The index `UK8b1no9kk3xjgste5vdbfgpcrr` should NOT exist

**✅ Constraint fix is working correctly**

## Test Results Summary

| Step | Test | Result | Status |
|------|------|--------|--------|
| 1 | Get authentication token | Token received | ✅ |
| 2 | Get/Create course | Course ID obtained | ✅ |
| 3 | Get/Create modules | Module IDs obtained | ✅ |
| 4 | Create first quiz | Quiz 1 created with ID | ✅ |
| 5 | Create second quiz | Quiz 2 created with ID (no duplicate error) | ✅ |
| 6 | Verify in database | Both quizzes found in database | ✅ |
| 7 | Verify constraint | No unique constraint on course_id | ✅ |

## Success Criteria

✅ **All steps completed successfully**
✅ **No "Duplicate entry" error occurred**
✅ **Multiple quizzes created for the same course**
✅ **Each quiz has its own properties**
✅ **Constraint fix is working correctly**

## Troubleshooting

### Issue: 401 Unauthorized
**Solution:** Ensure the token is valid and included in the Authorization header:
```
Authorization: Bearer <your_token_here>
```

### Issue: 404 Course Not Found
**Solution:** Verify the course ID is correct:
```sql
SELECT id, title FROM course LIMIT 10;
```

### Issue: 404 Module Not Found
**Solution:** Verify the module ID is correct and belongs to the course:
```sql
SELECT id, title, course_id FROM module WHERE course_id = 5;
```

### Issue: "Duplicate entry" error on second quiz creation
**Solution:** The constraint fix may not have been applied. Check:
```sql
SHOW INDEXES FROM quiz;
-- Should not show a unique index on course_id
```

If the index still exists, run:
```sql
ALTER TABLE quiz DROP INDEX UK8b1no9kk3xjgste5vdbfgpcrr;
```

### Issue: 500 Internal Server Error
**Solution:** Check the server logs for detailed error messages. Common causes:
- Database connection issue
- Invalid course/module ID
- Missing required fields in request

## Additional Tests

### Test 3: Create Three Quizzes

Repeat the quiz creation process with a third module to verify unlimited quizzes per course:

**Request Body:**
```json
{
  "title": "Quiz 3 - Module 3",
  "description": "Third quiz for the same course",
  "courseId": 5,
  "moduleId": 3,
  "passingScore": 80
}
```

**Expected Result:** Quiz 3 created successfully

### Test 4: Different Passing Scores

Create quizzes with different passing scores to verify each quiz maintains its own properties:

**Quiz 1:** Passing Score 60
**Quiz 2:** Passing Score 90

**Expected Result:** Each quiz has its own passing score in the database

## Conclusion

If all steps complete successfully without "Duplicate entry" errors, the constraint fix is working correctly and multiple quizzes can now be created for the same course.
