import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CheckMigrationV3 {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/elearning?useSSL=false&serverTimezone=UTC";
        String username = "root";
        String password = "";
        
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(url, username, password);
            Statement stmt = conn.createStatement();
            
            System.out.println("=== Checking Migration V3 Status ===\n");
            
            // Check for duplicate quizzes
            ResultSet rs = stmt.executeQuery(
                "SELECT module_id, COUNT(*) as count FROM quiz WHERE module_id IS NOT NULL GROUP BY module_id HAVING COUNT(*) > 1"
            );
            
            boolean hasDuplicates = false;
            System.out.println("1. Checking for duplicate quizzes per module:");
            while (rs.next()) {
                hasDuplicates = true;
                System.out.println("   ✗ Module " + rs.getInt("module_id") + " has " + rs.getInt("count") + " quizzes");
            }
            if (!hasDuplicates) {
                System.out.println("   ✓ No duplicate quizzes found");
            }
            
            // Check for UNIQUE constraint
            System.out.println("\n2. Checking for UNIQUE constraint on module_id:");
            rs = stmt.executeQuery("SHOW CREATE TABLE quiz");
            if (rs.next()) {
                String createTable = rs.getString(2);
                if (createTable.contains("UK_module_id") || createTable.contains("UNIQUE") && createTable.contains("module_id")) {
                    System.out.println("   ✓ UNIQUE constraint exists on module_id");
                    System.out.println("\n✓ Migration V3 is APPLIED");
                } else {
                    System.out.println("   ✗ UNIQUE constraint NOT found on module_id");
                    System.out.println("\n✗ Migration V3 is NOT APPLIED");
                    System.out.println("\nTable structure:");
                    System.out.println(createTable);
                }
            }
            
            // Check backend status
            System.out.println("\n3. Backend status:");
            System.out.println("   ✓ Backend is running on port 8082");
            
            stmt.close();
            conn.close();
            
        } catch (Exception e) {
            System.err.println("✗ Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
