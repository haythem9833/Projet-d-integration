import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.ResultSet;

public class ApplyMigration {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/elearning?useSSL=false&serverTimezone=UTC";
        String user = "root";
        String password = "root";

        try {
            // Load MySQL driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            // Create connection
            Connection conn = DriverManager.getConnection(url, user, password);
            Statement stmt = conn.createStatement();
            
            System.out.println("Applying migration V2: Fix Quiz Course Constraint...");
            
            try {
                // Drop the unique constraint
                stmt.execute("ALTER TABLE quiz DROP INDEX UK8b1no9kk3xjgste5vdbfgpcrr");
                System.out.println("✓ Unique constraint removed from quiz table");
            } catch (Exception e) {
                if (e.getMessage().contains("can't drop")) {
                    System.out.println("✓ Constraint already removed or does not exist");
                } else {
                    throw e;
                }
            }
            
            // Verify the constraint is removed
            System.out.println("✓ Current indexes on quiz table:");
            ResultSet rs = stmt.executeQuery("SHOW INDEXES FROM quiz");
            while (rs.next()) {
                System.out.println("  - " + rs.getString("Key_name") + " (" + rs.getString("Column_name") + ")");
            }
            
            System.out.println("\n✓ Migration V2 applied successfully!");
            System.out.println("✓ Multiple quizzes can now be created per course");
            
            stmt.close();
            conn.close();
        } catch (Exception e) {
            System.err.println("Error applying migration: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
