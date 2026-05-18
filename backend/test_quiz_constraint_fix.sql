-- Test script to verify the quiz constraint fix
-- This script tests that multiple quizzes can be created for the same course

USE elearning;

-- Step 1: Check current indexes on quiz table
SHOW INDEXES FROM quiz;

-- Step 2: Verify the unique constraint is removed
-- The index UK8b1no9kk3xjgste5vdbfgpcrr should NOT appear in the results above

-- Step 3: Test creating multiple quizzes for the same course
-- First, find an existing course
SELECT id FROM course LIMIT 1;

-- Step 4: Create multiple quizzes for the same course
-- Replace 1 with an actual course_id if needed
-- Note: module_id must be unique for each quiz (one-to-one relationship)

-- Example test (adjust IDs as needed):
-- INSERT INTO quiz (title, description, course_id, module_id, passing_score) 
-- VALUES ('Module 1 Quiz', 'Quiz for module 1', 1, 1, 70);

-- INSERT INTO quiz (title, description, course_id, module_id, passing_score) 
-- VALUES ('Module 2 Quiz', 'Quiz for module 2', 1, 2, 70);

-- Step 5: Verify both quizzes were created
-- SELECT * FROM quiz WHERE course_id = 1;

-- Expected Result: Both quizzes should be visible without any duplicate key errors

-- Step 6: Check the quiz table structure
DESCRIBE quiz;

-- Step 7: Verify relationships
-- Check that each module has exactly one quiz
SELECT m.id as module_id, m.title as module_title, q.id as quiz_id, q.title as quiz_title, q.course_id
FROM module m
LEFT JOIN quiz q ON m.id = q.module_id
ORDER BY m.id;
