package com.example.back.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cleanup")
@CrossOrigin(origins = "*")
public class CleanupController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/check-quiz-duplicates")
    public Map<String, Object> checkQuizDuplicates() {
        Map<String, Object> result = new HashMap<>();
        
        // Check for duplicates
        String checkSql = "SELECT module_id, COUNT(*) as count FROM quiz GROUP BY module_id HAVING COUNT(*) > 1";
        List<Map<String, Object>> duplicates = jdbcTemplate.queryForList(checkSql);
        
        result.put("duplicates", duplicates);
        result.put("hasDuplicates", !duplicates.isEmpty());
        
        // Get total count
        Integer totalQuizzes = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM quiz", Integer.class);
        result.put("totalQuizzes", totalQuizzes);
        
        return result;
    }

    @PostMapping("/clean-quiz-duplicates")
    public Map<String, Object> cleanQuizDuplicates() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Special handling for quizzes with null module_id
            // These are orphaned quizzes that should be deleted
            
            // Step 1: Count quizzes with null module_id
            Integer nullModuleQuizzes = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM quiz WHERE module_id IS NULL", 
                Integer.class
            );
            result.put("nullModuleQuizzes", nullModuleQuizzes);
            
            if (nullModuleQuizzes != null && nullModuleQuizzes > 0) {
                // Delete questions for quizzes with null module_id
                int questionsDeleted = jdbcTemplate.update(
                    "DELETE FROM question WHERE quiz_id IN (SELECT id FROM quiz WHERE module_id IS NULL)"
                );
                result.put("questionsDeletedForNullModule", questionsDeleted);
                
                // Delete quizzes with null module_id
                int quizzesDeleted = jdbcTemplate.update(
                    "DELETE FROM quiz WHERE module_id IS NULL"
                );
                result.put("quizzesDeletedWithNullModule", quizzesDeleted);
            }
            
            // Step 2: Delete questions for duplicate quizzes (keep only latest)
            String deleteQuestionsSql = 
                "DELETE FROM question WHERE quiz_id IN (" +
                "  SELECT id FROM (" +
                "    SELECT q1.id FROM quiz q1 WHERE q1.module_id IS NOT NULL AND EXISTS (" +
                "      SELECT 1 FROM quiz q2 WHERE q2.module_id = q1.module_id AND q2.id > q1.id" +
                "    )" +
                "  ) AS temp" +
                ")";
            
            int questionsDeleted = jdbcTemplate.update(deleteQuestionsSql);
            result.put("questionsDeleted", questionsDeleted);
            
            // Step 3: Delete duplicate quizzes (keep only latest)
            String deleteQuizzesSql = 
                "DELETE FROM quiz WHERE id IN (" +
                "  SELECT id FROM (" +
                "    SELECT q1.id FROM quiz q1 WHERE q1.module_id IS NOT NULL AND EXISTS (" +
                "      SELECT 1 FROM quiz q2 WHERE q2.module_id = q1.module_id AND q2.id > q1.id" +
                "    )" +
                "  ) AS temp" +
                ")";
            
            int quizzesDeleted = jdbcTemplate.update(deleteQuizzesSql);
            result.put("quizzesDeleted", quizzesDeleted);
            
            // Step 4: Verify no more duplicates
            String checkSql = "SELECT module_id, COUNT(*) as count FROM quiz GROUP BY module_id HAVING COUNT(*) > 1";
            List<Map<String, Object>> remainingDuplicates = jdbcTemplate.queryForList(checkSql);
            
            result.put("remainingDuplicates", remainingDuplicates);
            result.put("success", remainingDuplicates.isEmpty());
            
            // Get final count
            Integer totalQuizzes = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM quiz", Integer.class);
            result.put("totalQuizzes", totalQuizzes);
            
            result.put("message", "Cleanup completed successfully. Please restart the backend to clear Hibernate cache.");
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            e.printStackTrace();
        }
        
        return result;
    }
}
