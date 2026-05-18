import java.sql.*;

public class CleanupDuplicateQuizzes {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/elearning?useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "";

    public static void main(String[] args) {
        Connection conn = null;
        try {
            // Load MySQL JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            // Connect to database
            System.out.println("Connecting to database...");
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
            System.out.println("Connected successfully!\n");

            // Step 1: Check for duplicate quiz IDs
            System.out.println("=== Step 1: Checking for duplicate quiz IDs ===");
            checkDuplicateIds(conn);

            // Step 2: Check for duplicate module_ids
            System.out.println("\n=== Step 2: Checking for duplicate module_ids ===");
            int duplicateCount = checkDuplicateModuleIds(conn);

            if (duplicateCount > 0) {
                // Step 3: Show all quizzes with duplicate module_ids
                System.out.println("\n=== Step 3: Showing quizzes with duplicate module_ids ===");
                showDuplicateQuizzes(conn);

                // Step 4: Delete duplicate quizzes
                System.out.println("\n=== Step 4: Deleting duplicate quizzes ===");
                int deletedCount = deleteDuplicates(conn);
                System.out.println("Deleted " + deletedCount + " duplicate quiz(zes).");

                // Step 5: Verify no more duplicates
                System.out.println("\n=== Step 5: Verifying no duplicates remain ===");
                checkDuplicateModuleIds(conn);
            } else {
                System.out.println("No duplicate module_ids found.");
            }

            // Step 6: Check existing indexes
            System.out.println("\n=== Step 6: Checking existing indexes ===");
            showIndexes(conn);

            // Step 7: Add UNIQUE constraint if it doesn't exist
            System.out.println("\n=== Step 7: Adding UNIQUE constraint on module_id ===");
            addUniqueConstraint(conn);

            // Step 8: Final verification
            System.out.println("\n=== Step 8: Final verification - All indexes ===");
            showIndexes(conn);

            System.out.println("\n=== Cleanup Complete! ===");
            System.out.println("Next step: Restart the backend to clear Hibernate cache.");

        } catch (ClassNotFoundException e) {
            System.err.println("MySQL JDBC Driver not found!");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("Database error!");
            e.printStackTrace();
        } finally {
            try {
                if (conn != null && !conn.isClosed()) {
                    conn.close();
                    System.out.println("\nDatabase connection closed.");
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    private static void checkDuplicateIds(Connection conn) throws SQLException {
        String query = "SELECT id, COUNT(*) as count FROM quiz GROUP BY id HAVING COUNT(*) > 1";
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            
            boolean found = false;
            while (rs.next()) {
                found = true;
                System.out.println("Quiz ID: " + rs.getInt("id") + " - Count: " + rs.getInt("count"));
            }
            if (!found) {
                System.out.println("No duplicate quiz IDs found.");
            }
        }
    }

    private static int checkDuplicateModuleIds(Connection conn) throws SQLException {
        String query = "SELECT module_id, COUNT(*) as count FROM quiz WHERE module_id IS NOT NULL GROUP BY module_id HAVING COUNT(*) > 1";
        int duplicateCount = 0;
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            
            while (rs.next()) {
                duplicateCount++;
                System.out.println("Module ID: " + rs.getInt("module_id") + " - Count: " + rs.getInt("count"));
            }
            if (duplicateCount == 0) {
                System.out.println("No duplicate module_ids found.");
            }
        }
        return duplicateCount;
    }

    private static void showDuplicateQuizzes(Connection conn) throws SQLException {
        String query = "SELECT q.id, q.module_id, q.title, q.created_at " +
                      "FROM quiz q " +
                      "WHERE q.module_id IN ( " +
                      "    SELECT module_id FROM quiz " +
                      "    WHERE module_id IS NOT NULL " +
                      "    GROUP BY module_id " +
                      "    HAVING COUNT(*) > 1 " +
                      ") " +
                      "ORDER BY q.module_id, q.id";
        
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            
            System.out.printf("%-10s %-15s %-50s %-20s%n", "Quiz ID", "Module ID", "Title", "Created At");
            System.out.println("-".repeat(100));
            
            while (rs.next()) {
                System.out.printf("%-10d %-15d %-50s %-20s%n",
                    rs.getInt("id"),
                    rs.getInt("module_id"),
                    rs.getString("title") != null ? rs.getString("title").substring(0, Math.min(50, rs.getString("title").length())) : "NULL",
                    rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toString() : "NULL"
                );
            }
        }
    }

    private static int deleteDuplicates(Connection conn) throws SQLException {
        String query = "DELETE q1 FROM quiz q1 " +
                      "INNER JOIN quiz q2 ON q1.module_id = q2.module_id AND q1.id < q2.id " +
                      "WHERE q1.module_id IS NOT NULL";
        
        try (Statement stmt = conn.createStatement()) {
            return stmt.executeUpdate(query);
        }
    }

    private static void showIndexes(Connection conn) throws SQLException {
        String query = "SHOW INDEXES FROM quiz";
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            
            System.out.printf("%-20s %-20s %-20s %-10s%n", "Table", "Key Name", "Column Name", "Unique");
            System.out.println("-".repeat(80));
            
            while (rs.next()) {
                System.out.printf("%-20s %-20s %-20s %-10s%n",
                    rs.getString("Table"),
                    rs.getString("Key_name"),
                    rs.getString("Column_name"),
                    rs.getInt("Non_unique") == 0 ? "YES" : "NO"
                );
            }
        }
    }

    private static void addUniqueConstraint(Connection conn) throws SQLException {
        String query = "ALTER TABLE quiz ADD UNIQUE KEY UK_module_id (module_id)";
        try (Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(query);
            System.out.println("UNIQUE constraint added successfully.");
        } catch (SQLException e) {
            if (e.getErrorCode() == 1061) { // Duplicate key name
                System.out.println("UNIQUE constraint already exists (this is OK).");
            } else {
                throw e;
            }
        }
    }
}
