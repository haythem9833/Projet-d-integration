-- Test script to verify that multiple quizzes can be created for the same course
-- This validates the fix for the unique constraint issue on course_id in the quiz table

USE elearning;

-- Step 1: Create a test course
INSERT INTO course (title, description, trainer_id, price, category, created_at)
VALUES ('Test Course for Multiple Quizzes', 'A course to test multiple quizzes', 1, 99.99, 'Technology', NOW());

SET @course_id = LAST_INSERT_ID();

-- Step 2: Create two modules for the course
INSERT INTO module (title, description, course_id, created_at)
VALUES ('Module 1', 'First module', @course_id, NOW());

SET @module1_id = LAST_INSERT_ID();

INSERT INTO module (title, description, course_id, created_at)
VALUES ('Module 2', 'Second module', @course_id, NOW());

SET @module2_id = LAST_INSERT_ID();

-- Step 3: Create first quiz for the course with module 1
INSERT INTO quiz (title, description, passing_score, module_id, course_id)
VALUES ('Quiz 1 - Module 1', 'First quiz for the course', 70, @module1_id, @course_id);

SET @quiz1_id = LAST_INSERT_ID();

-- Step 4: Verify first quiz is created successfully
SELECT 'First Quiz Created' as status, @quiz1_id as quiz_id, @course_id as course_id;

-- Step 5: Create second quiz for the SAME course with module 2
-- This would have failed before the constraint fix with "Duplicate entry" error
INSERT INTO quiz (title, description, passing_score, module_id, course_id)
VALUES ('Quiz 2 - Module 2', 'Second quiz for the same course', 75, @module2_id, @course_id);

SET @quiz2_id = LAST_INSERT_ID();

-- Step 6: Verify second quiz is created successfully
SELECT 'Second Quiz Created' as status, @quiz2_id as quiz_id, @course_id as course_id;

-- Step 7: Verify both quizzes exist in the database
SELECT 'Both Quizzes in Database' as status;
SELECT id, title, course_id, module_id, passing_score FROM quiz WHERE id IN (@quiz1_id, @quiz2_id);

-- Step 8: Verify both quizzes are linked to the same course but different modules
SELECT 'Verification Results' as status;
SELECT 
    q.id as quiz_id,
    q.title as quiz_title,
    q.course_id,
    q.module_id,
    m.title as module_title,
    q.passing_score
FROM quiz q
JOIN module m ON q.module_id = m.id
WHERE q.id IN (@quiz1_id, @quiz2_id)
ORDER BY q.id;

-- Step 9: Count quizzes for the course
SELECT 
    'Quiz Count for Course' as status,
    COUNT(*) as total_quizzes,
    @course_id as course_id
FROM quiz
WHERE course_id = @course_id;

-- Step 10: Verify no "Duplicate entry" error occurred
-- If we reach this point without errors, the constraint fix is working
SELECT 'SUCCESS: Multiple quizzes created for the same course without duplicate key error' as result;

-- Cleanup (optional - comment out if you want to keep test data)
-- DELETE FROM quiz WHERE id IN (@quiz1_id, @quiz2_id);
-- DELETE FROM module WHERE id IN (@module1_id, @module2_id);
-- DELETE FROM course WHERE id = @course_id;
