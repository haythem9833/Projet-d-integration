-- Check for duplicate quizzes by module_id
SELECT module_id, COUNT(*) as count
FROM quiz
GROUP BY module_id
HAVING COUNT(*) > 1;

-- Show all duplicate quiz records
SELECT q.id, q.title, q.module_id, q.course_id, q.passing_score
FROM quiz q
WHERE q.module_id IN (
    SELECT module_id
    FROM quiz
    GROUP BY module_id
    HAVING COUNT(*) > 1
)
ORDER BY q.module_id, q.id;

-- Count total quizzes
SELECT COUNT(*) as total_quizzes FROM quiz;
