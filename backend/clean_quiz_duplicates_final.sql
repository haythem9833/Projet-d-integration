-- Clean Quiz Duplicates - Keep only the latest quiz per module
-- This script will delete older duplicate quizzes and their questions

-- Step 1: Show current duplicates
SELECT 'CURRENT DUPLICATES:' as status;
SELECT module_id, COUNT(*) as count
FROM quiz
GROUP BY module_id
HAVING COUNT(*) > 1;

-- Step 2: Delete questions for duplicate quizzes (keep only latest)
DELETE FROM question
WHERE quiz_id IN (
    SELECT id FROM (
        SELECT q1.id
        FROM quiz q1
        WHERE EXISTS (
            SELECT 1
            FROM quiz q2
            WHERE q2.module_id = q1.module_id
            AND q2.id > q1.id
        )
    ) AS temp
);

-- Step 3: Delete duplicate quizzes (keep only latest)
DELETE FROM quiz
WHERE id IN (
    SELECT id FROM (
        SELECT q1.id
        FROM quiz q1
        WHERE EXISTS (
            SELECT 1
            FROM quiz q2
            WHERE q2.module_id = q1.module_id
            AND q2.id > q1.id
        )
    ) AS temp
);

-- Step 4: Verify no more duplicates
SELECT 'AFTER CLEANUP:' as status;
SELECT module_id, COUNT(*) as count
FROM quiz
GROUP BY module_id
HAVING COUNT(*) > 1;

-- Step 5: Show total quizzes
SELECT 'TOTAL QUIZZES:' as status, COUNT(*) as total FROM quiz;
