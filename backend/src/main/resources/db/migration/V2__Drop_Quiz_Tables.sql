-- ============================================================================
-- MIGRATION 2: Drop Quiz-Related Tables
-- ============================================================================
-- This migration removes all quiz functionality from the platform as
-- the vision is to use only video content for learning

-- Drop tables in reverse order of their foreign key relationships
DROP TABLE IF EXISTS elearning.answer;
DROP TABLE IF EXISTS elearning.quiz_attempt;
DROP TABLE IF EXISTS elearning.question;
DROP TABLE IF EXISTS elearning.quiz;

-- ============================================================================
-- FIN DE LA MIGRATION 2
-- ============================================================================
