-- Fix the one-to-one relationship between Module and Quiz
-- This script adds a UNIQUE constraint on module_id to enforce one-to-one relationship

USE elearning;

-- First, let's check the current state of the quiz table
SHOW INDEXES FROM quiz;
DESCRIBE quiz;

-- Check for duplicate module_ids
SELECT module_id, COUNT(*) as count FROM quiz WHERE module_id IS NOT NULL GROUP BY module_id HAVING COUNT(*) > 1;

-- If there are duplicates, we need to clean them up
-- Keep only the most recent quiz for each module (highest id)
DELETE FROM quiz 
WHERE module_id IS NOT NULL 
AND id NOT IN (
    SELECT MAX(id) FROM (
        SELECT MAX(id) as id FROM quiz WHERE module_id IS NOT NULL GROUP BY module_id
    ) as temp
);

-- Now add the UNIQUE constraint on module_id
ALTER TABLE quiz ADD UNIQUE KEY UK_module_id (module_id);

-- Verify the constraint was added
SHOW INDEXES FROM quiz;

-- Verify the quiz table structure
DESCRIBE quiz;

-- Test: Verify that we can still have multiple quizzes per course
SELECT course_id, COUNT(*) as quiz_count FROM quiz GROUP BY course_id;
