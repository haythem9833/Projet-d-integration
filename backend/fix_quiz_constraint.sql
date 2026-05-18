-- Fix the unique constraint on course_id in quiz table
-- This allows multiple quizzes per course
-- The constraint name is: UK8b1no9kk3xjgste5vdbfgpcrr

USE elearning;

-- Drop the unique constraint on course_id
ALTER TABLE quiz DROP INDEX UK8b1no9kk3xjgste5vdbfgpcrr;

-- Verify the constraint is removed
SHOW INDEXES FROM quiz;

-- Verify the quiz table structure
DESCRIBE quiz;

-- Test: Create multiple quizzes for the same course
-- This should now work without duplicate key errors
