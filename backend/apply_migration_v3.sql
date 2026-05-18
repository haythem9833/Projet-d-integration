-- Apply Migration V3: Fix Quiz-Module One-to-One Relationship

-- Step 1: Remove duplicate quizzes (keep only the latest for each module)
DELETE FROM quiz 
WHERE module_id IS NOT NULL 
AND id NOT IN (
    SELECT MAX(id) FROM (
        SELECT MAX(id) as id FROM quiz WHERE module_id IS NOT NULL GROUP BY module_id
    ) as temp
);

-- Step 2: Add UNIQUE constraint on module_id
ALTER TABLE quiz ADD UNIQUE KEY UK_module_id (module_id);
