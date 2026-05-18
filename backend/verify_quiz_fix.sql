-- ============================================================================
-- VERIFICATION SCRIPT FOR QUIZ MODULE ONE-TO-ONE RELATIONSHIP FIX
-- ============================================================================
-- Run these queries to verify the fix was applied correctly

USE elearning;

-- ============================================================================
-- 1. VERIFY UNIQUE CONSTRAINT EXISTS
-- ============================================================================
SHOW INDEXES FROM quiz;
-- Expected: Should show UK_module_id with Non_unique = 0 (meaning it's unique)

-- ============================================================================
-- 2. VERIFY NO DUPLICATE MODULE_IDS
-- ============================================================================
SELECT module_id, COUNT(*) as count 
FROM quiz 
WHERE module_id IS NOT NULL 
GROUP BY module_id 
HAVING COUNT(*) > 1;
-- Expected: Empty result set (no duplicates)

-- ============================================================================
-- 3. VERIFY QUIZ TABLE STRUCTURE
-- ============================================================================
DESCRIBE quiz;
-- Expected: module_id column should exist with proper foreign key

-- ============================================================================
-- 4. VERIFY MULTIPLE QUIZZES PER COURSE (DIFFERENT MODULES)
-- ============================================================================
SELECT 
    c.id as course_id,
    c.title as course_title,
    COUNT(DISTINCT q.id) as quiz_count,
    COUNT(DISTINCT m.id) as module_count
FROM course c
LEFT JOIN modules m ON c.id = m.course_id
LEFT JOIN quiz q ON m.id = q.module_id
GROUP BY c.id, c.title
HAVING quiz_count > 0
ORDER BY quiz_count DESC;
-- Expected: Shows courses with multiple quizzes (in different modules)

-- ============================================================================
-- 5. VERIFY MODULE-QUIZ RELATIONSHIP
-- ============================================================================
SELECT 
    m.id as module_id,
    m.title as module_title,
    q.id as quiz_id,
    q.title as quiz_title,
    c.id as course_id,
    c.title as course_title
FROM modules m
LEFT JOIN quiz q ON m.id = q.module_id
LEFT JOIN course c ON m.course_id = c.id
ORDER BY m.id;
-- Expected: Each module has at most one quiz

-- ============================================================================
-- 6. VERIFY ORPHANED QUIZZES (IF ANY)
-- ============================================================================
SELECT q.id, q.title, q.module_id, q.course_id
FROM quiz q
WHERE q.module_id IS NULL;
-- Expected: Should be empty (all quizzes should have a module)

-- ============================================================================
-- 7. COUNT STATISTICS
-- ============================================================================
SELECT 
    (SELECT COUNT(*) FROM quiz) as total_quizzes,
    (SELECT COUNT(*) FROM modules) as total_modules,
    (SELECT COUNT(DISTINCT module_id) FROM quiz WHERE module_id IS NOT NULL) as modules_with_quiz,
    (SELECT COUNT(DISTINCT course_id) FROM quiz) as courses_with_quiz;
-- Expected: Shows overall statistics

-- ============================================================================
-- 8. TEST: TRY TO CREATE DUPLICATE (SHOULD FAIL)
-- ============================================================================
-- Uncomment to test - this should fail with UNIQUE constraint error
-- INSERT INTO quiz (title, description, passing_score, module_id, course_id)
-- SELECT 'Test Quiz', 'Test', 70, module_id, course_id FROM quiz LIMIT 1;
-- Expected: Error: Duplicate entry for key 'UK_module_id'

-- ============================================================================
-- END OF VERIFICATION SCRIPT
-- ============================================================================
