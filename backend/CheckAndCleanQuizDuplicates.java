import java.sql.*;
import java.util.*;

public class CheckAndCleanQuizDuplicates {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/elearning";
        String user = "root";
        String password = "root";

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("Connected to database successfully!");
            
            // Step 1: Check for duplicates
            System.out.println("\n=== CHECKING FOR DUPLICATE QUIZZES ===");
            String checkDuplicates = 
                "SELECT module_id, COUNT(*) as count " +
                "FROM quiz " +
                "GROUP BY module_id " +
                "HAVING COUNT(*) > 1";
            
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(checkDuplicates);
            
            List<Long> duplicateModuleIds = new ArrayList<>();
            while (rs.next()) {
                long moduleId = rs.getLong("module_id");
                int count = rs.getInt("count");
                System.out.println("Module ID " + moduleId + " has " + count + " quizzes (DUPLICATE!)");
                duplicateModuleIds.add(moduleId);
            }
            
            if (duplicateModuleIds.isEmpty()) {
                System.out.println("No duplicate quizzes found!");
                return;
            }
            
            // Step 2: Show duplicate records
            System.out.println("\n=== DUPLICATE QUIZ RECORDS ===");
            for (Long moduleId : duplicateModuleIds) {
                String showDuplicates = 
                    "SELECT id, title, module_id, course_id, passing_score " +
                    "FROM quiz " +
                    "WHERE module_id = ? " +
                    "ORDER BY id";
                
                PreparedStatement pstmt = conn.prepareStatement(showDuplicates);
                pstmt.setLong(1, moduleId);
                ResultSet dupRs = pstmt.executeQuery();
                
                System.out.println("\nModule ID: " + moduleId);
                while (dupRs.next()) {
                    System.out.println("  Quiz ID: " + dupRs.getLong("id") + 
                                     ", Title: " + dupRs.getString("title") +
                                     ", Course ID: " + dupRs.getLong("course_id") +
                                     ", Passing Score: " + dupRs.getInt("passing_score"));
                }
            }
            
            // Step 3: Clean duplicates (keep only the latest one)
            System.out.println("\n=== CLEANING DUPLICATES ===");
            for (Long moduleId : duplicateModuleIds) {
                // Get all quiz IDs for this module
                String getQuizIds = 
                    "SELECT id FROM quiz WHERE module_id = ? ORDER BY id DESC";
                
                PreparedStatement pstmt = conn.prepareStatement(getQuizIds);
                pstmt.setLong(1, moduleId);
                ResultSet quizRs = pstmt.executeQuery();
                
                List<Long> quizIds = new ArrayList<>();
                while (quizRs.next()) {
                    quizIds.add(quizRs.getLong("id"));
                }
                
                // Keep the first (latest) quiz, delete the rest
                if (quizIds.size() > 1) {
                    Long keepQuizId = quizIds.get(0);
                    System.out.println("\nModule ID " + moduleId + ": Keeping Quiz ID " + keepQuizId);
                    
                    for (int i = 1; i < quizIds.size(); i++) {
                        Long deleteQuizId = quizIds.get(i);
                        
                        // First, delete associated questions
                        String deleteQuestions = "DELETE FROM question WHERE quiz_id = ?";
                        PreparedStatement delQuestStmt = conn.prepareStatement(deleteQuestions);
                        delQuestStmt.setLong(1, deleteQuizId);
                        int questionsDeleted = delQuestStmt.executeUpdate();
                        System.out.println("  Deleted " + questionsDeleted + " questions for Quiz ID " + deleteQuizId);
                        
                        // Then delete the quiz
                        String deleteQuiz = "DELETE FROM quiz WHERE id = ?";
                        PreparedStatement delQuizStmt = conn.prepareStatement(deleteQuiz);
                        delQuizStmt.setLong(1, deleteQuizId);
                        delQuizStmt.executeUpdate();
                        System.out.println("  Deleted Quiz ID " + deleteQuizId);
                    }
                }
            }
            
            // Step 4: Verify cleanup
            System.out.println("\n=== VERIFICATION AFTER CLEANUP ===");
            ResultSet verifyRs = stmt.executeQuery(checkDuplicates);
            
            boolean stillHasDuplicates = false;
            while (verifyRs.next()) {
                stillHasDuplicates = true;
                long moduleId = verifyRs.getLong("module_id");
                int count = verifyRs.getInt("count");
                System.out.println("WARNING: Module ID " + moduleId + " still has " + count + " quizzes!");
            }
            
            if (!stillHasDuplicates) {
                System.out.println("SUCCESS: All duplicates cleaned!");
            }
            
            // Show final count
            String countQuizzes = "SELECT COUNT(*) as total FROM quiz";
            ResultSet countRs = stmt.executeQuery(countQuizzes);
            if (countRs.next()) {
                System.out.println("\nTotal quizzes in database: " + countRs.getInt("total"));
            }
            
        } catch (SQLException e) {
            System.err.println("Database error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
