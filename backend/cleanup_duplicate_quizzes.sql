-- Step 1: Check for duplicate quiz IDs
SELECT 'Checking for duplicate quiz IDs...' AS step;
SELECT id, COUNT(*) as count FROM quiz GROUP BY id HAVING COUNT(*) > 1;

-- Step 2: Check for duplicate module_ids
SELECT 'Checking for duplicate module_ids...' AS step;
SELECT module_id, COUNT(*) as count FROM quiz WHERE module_id IS NOT NULL GROUP BY module_id HAVING COUNT(*) > 1;

-- Step 3: Show all quizzes with duplicate module_ids (to identify which to keep)
SELECT 'Showing all quizzes with duplicate module_ids...' AS step;
SELECT q.* FROM quiz q
WHERE q.module_id IN (
    SELECT module_id FROM quiz 
    WHERE module_id IS NOT NULL 
    GROUP BY module_id 
    HAVING COUNT(*) > 1
)
ORDER BY q.module_id, q.id;

-- Step 4: Delete duplicate quizzes, keeping only the one with the highest ID (latest)
SELECT 'Deleting duplicate quizzes (keeping latest)...' AS step;
DELETE q1 FROM quiz q1
INNER JOIN quiz q2 ON q1.module_id = q2.module_id AND q1.id < q2.id
WHERE q1.module_id IS NOT NULL;

-- Step 5: Verify no more duplicates exist
SELECT 'Verifying no duplicates remain...' AS step;
SELECT module_id, COUNT(*) as count FROM quiz WHERE module_id IS NOT NULL GROUP BY module_id HAVING COUNT(*) > 1;

-- Step 6: Check if UNIQUE constraint exists
SELECT 'Checking for UNIQUE constraint on module_id...' AS step;
SHOW INDEXES FROM quiz;

-- Step 7: Add UNIQUE constraint if it doesn't exist (will fail if constraint already exists, which is fine)
SELECT 'Adding UNIQUE constraint on module_id...' AS step;
ALTER TABLE quiz ADD UNIQUE KEY UK_module_id (module_id);

-- Step 8: Final verification
SELECT 'Final verification - showing all indexes...' AS step;
SHOW INDEXES FROM quiz;

SELECT 'Cleanup complete!' AS status;
