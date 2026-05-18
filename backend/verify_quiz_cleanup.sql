-- Verification script for quiz cleanup
-- Run this to verify the database state after cleanup

USE elearning;

-- 1. Count total quizzes
SELECT 'Total Quizzes' AS metric, COUNT(*) AS value FROM quiz;

-- 2. Check for duplicate quiz IDs (should be 0)
SELECT 'Duplicate Quiz IDs' AS metric, COUNT(*) AS value 
FROM (
    SELECT id, COUNT(*) as count 
    FROM quiz 
    GROUP BY id 
    HAVING COUNT(*) > 1
) AS duplicates;

-- 3. Check for duplicate module_ids (should be 0)
SELECT 'Duplicate Module IDs' AS metric, COUNT(*) AS value 
FROM (
    SELECT module_id, COUNT(*) as count 
    FROM quiz 
    WHERE module_id IS NOT NULL 
    GROUP BY module_id 
    HAVING COUNT(*) > 1
) AS duplicates;

-- 4. Show all unique constraints on quiz table
SELECT 'Unique Constraints on Quiz Table' AS info;
SELECT 
    INDEX_NAME,
    COLUMN_NAME,
    NON_UNIQUE
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'elearning'
  AND TABLE_NAME = 'quiz'
  AND NON_UNIQUE = 0
ORDER BY INDEX_NAME, SEQ_IN_INDEX;

-- 5. Show quiz distribution by module
SELECT 'Quiz Distribution by Module' AS info;
SELECT 
    module_id,
    COUNT(*) as quiz_count,
    GROUP_CONCAT(id) as quiz_ids
FROM quiz
WHERE module_id IS NOT NULL
GROUP BY module_id
ORDER BY module_id;

-- 6. Show modules without quizzes
SELECT 'Modules Without Quizzes' AS info;
SELECT 
    m.id as module_id,
    m.title as module_title,
    m.course_id
FROM module m
LEFT JOIN quiz q ON m.id = q.module_id
WHERE q.id IS NULL
ORDER BY m.course_id, m.id;
