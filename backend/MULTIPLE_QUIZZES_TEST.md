# Multiple Quizzes Per Course - Test Documentation

## Overview
This document describes the comprehensive test suite created to verify that multiple quizzes can now be created for the same course. This test validates the fix for the unique constraint issue on the `course_id` column in the `quiz` table.

## Problem Statement
Previously, the `quiz` table had a unique constraint on the `course_id` column, which prevented creating multiple quizzes for the same course. This was a limitation that needed to be fixed.

## Solution
The constraint was removed by executing the following SQL:
```sql
ALTER TABLE quiz DROP INDEX UK8b1no9kk3xjgste5vdbfgpcrr;
```

This allows multiple quizzes to be associated with the same course while maintaining the relationship through the `course_id` foreign key.

## Test Files Created

### 1. Integration Test: `QuizControllerIntegrationTest.java`
**Location:** `src/test/java/com/example/back/controller/QuizControllerIntegrationTest.java`

This is a comprehensive Spring Boot integration test that validates the constraint fix through the REST API.

#### Test Methods:

##### `testCreateMultipleQuizzesForSameCourse()`
**Purpose:** Main test to verify multiple quizzes can be created for the same course

**Test Steps:**
1. Login as trainer to get authentication
2. Get a course ID and two different module IDs
3. Create first quiz for the course with module 1
4. Verify first quiz is created successfully
5. Create second quiz for the SAME course with module 2
6. Verify second quiz is created successfully (this would have failed before)
7. Verify both quizzes exist in the database
8. Verify both quizzes are linked to the same course but different modules
9. Verify no "Duplicate entry" error occurs

**Expected Results:**
- First quiz created successfully with ID
- Second quiz created successfully with ID (no duplicate key error)
- Both quizzes are saved to database
- Both quizzes are linked to the same course but different modules
- The constraint fix is working correctly

##### `testCreateThreeQuizzesForSameCourse()`
**Purpose:** Further validates that the constraint allows unlimited quizzes per course

**Test Steps:**
1. Create three modules for the test course
2. Create three quizzes, each linked to a different module but the same course
3. Verify all three quizzes are created successfully
4. Verify all three quizzes exist in the database
5. Verify all three quizzes are linked to the same course
6. Verify all three quizzes have different IDs

**Expected Results:**
- All three quizzes created successfully
- No duplicate key errors
- All quizzes linked to the same course with different modules

##### `testMultipleQuizzesWithDifferentPassingScores()`
**Purpose:** Ensures each quiz can have its own passing score

**Test Steps:**
1. Create first quiz with passing score 60
2. Create second quiz with passing score 90 (same course, different module)
3. Verify passing scores are different
4. Verify in database that passing scores are correctly stored

**Expected Results:**
- Both quizzes created successfully
- Each quiz has its own passing score
- Passing scores are correctly persisted in the database

### 2. SQL Test Script: `test_multiple_quizzes.sql`
**Location:** `backend/test_multiple_quizzes.sql`

This is a direct SQL test script that can be executed against the database to verify the constraint fix.

**Test Steps:**
1. Create a test course
2. Create two modules for the course
3. Create first quiz for the course with module 1
4. Verify first quiz is created successfully
5. Create second quiz for the SAME course with module 2
6. Verify second quiz is created successfully
7. Verify both quizzes exist in the database
8. Verify both quizzes are linked to the same course but different modules
9. Count quizzes for the course
10. Verify no "Duplicate entry" error occurred

**How to Run:**
```bash
mysql -u root -p elearning < test_multiple_quizzes.sql
```

Or in MySQL client:
```sql
SOURCE test_multiple_quizzes.sql;
```

## Test Configuration

### Test Profile: `application-test.yaml`
**Location:** `src/test/resources/application-test.yaml`

Configuration for running tests:
- Uses separate test database: `elearning_test`
- Hibernate DDL mode: `create-drop` (creates schema for each test, drops after)
- SQL logging disabled for cleaner output
- Same JWT secret as production for testing

## Running the Tests

### Option 1: Run Integration Tests with Maven
```bash
cd backend
mvn test -Dtest=QuizControllerIntegrationTest
```

### Option 2: Run Specific Test Method
```bash
mvn test -Dtest=QuizControllerIntegrationTest#testCreateMultipleQuizzesForSameCourse
```

### Option 3: Run SQL Test Script
```bash
mysql -u root -p elearning < test_multiple_quizzes.sql
```

## Expected Test Results

### Success Criteria
✅ All three integration test methods pass
✅ No "Duplicate entry" errors occur
✅ Multiple quizzes can be created for the same course
✅ Each quiz maintains its own properties (title, description, passing score)
✅ Each quiz is linked to a different module
✅ All quizzes are linked to the same course

### Database Verification
After running the tests, you can verify the data:

```sql
-- Check all quizzes for a specific course
SELECT id, title, course_id, module_id, passing_score 
FROM quiz 
WHERE course_id = <course_id>;

-- Check the quiz table structure
DESCRIBE quiz;

-- Verify no unique constraint on course_id
SHOW INDEXES FROM quiz;
```

## Constraint Fix Details

### Before Fix
```sql
-- The quiz table had a unique constraint on course_id
ALTER TABLE quiz ADD UNIQUE KEY UK8b1no9kk3xjgste5vdbfgpcrr (course_id);
```

This prevented multiple quizzes from being associated with the same course.

### After Fix
```sql
-- The unique constraint was removed
ALTER TABLE quiz DROP INDEX UK8b1no9kk3xjgste5vdbfgpcrr;
```

Now the `course_id` is a regular foreign key that allows multiple quizzes per course.

### Entity Mapping
In the `Quiz.java` entity:
```java
@ManyToOne
@JoinColumn(name = "course_id", unique = false)
private Course course;
```

The `unique = false` annotation confirms that multiple quizzes can be associated with the same course.

## Test Data Structure

### Course
- Title: "Test Course for Multiple Quizzes"
- Description: "A course to test multiple quizzes"
- Price: 99.99
- Category: "Technology"

### Modules
- Module 1: "Module 1" - First module
- Module 2: "Module 2" - Second module
- Module 3: "Module 3" - Third module (for three-quiz test)

### Quizzes
- Quiz 1: "Quiz 1 - Module 1" - Passing Score: 70
- Quiz 2: "Quiz 2 - Module 2" - Passing Score: 75
- Quiz 3: "Quiz 3 - Module 3" - Passing Score: 80 (for three-quiz test)

## Troubleshooting

### Issue: "Duplicate entry" error still occurs
**Solution:** Verify that the constraint was properly removed:
```sql
SHOW INDEXES FROM quiz;
-- Should not show a unique index on course_id
```

### Issue: Test database connection fails
**Solution:** Ensure the test database exists:
```sql
CREATE DATABASE IF NOT EXISTS elearning_test;
```

### Issue: Maven certificate error
**Solution:** This is a network/certificate issue. Try:
```bash
mvn test -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true
```

## Conclusion

The test suite comprehensively validates that:
1. ✅ Multiple quizzes can be created for the same course
2. ✅ Each quiz maintains its own properties
3. ✅ The constraint fix is working correctly
4. ✅ No duplicate key errors occur
5. ✅ The database relationships are properly maintained

The constraint fix successfully allows the LMS to support multiple quizzes per course, enabling more flexible course design and assessment strategies.
