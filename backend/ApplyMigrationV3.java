import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.nio.file.Files;
import java.nio.file.Paths;

public class ApplyMigrationV3 {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/elearning?useSSL=false&serverTimezone=UTC";
        String username = "root";
        String password = "";
        
        try {
            // Load MySQL JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            // Connect to database
            Connection conn = DriverManager.getConnection(url, username, password);
            System.out.println("✓ Connected to database");
            
            // Read migration SQL
            String sql = new String(Files.readAllBytes(Paths.get("apply_migration_v3.sql")));
            
            // Split by semicolon and execute each statement
            String[] statements = sql.split(";");
            Statement stmt = conn.createStatement();
            
            for (String statement : statements) {
                String trimmed = statement.trim();
                if (!trimmed.isEmpty() && !trimmed.startsWith("--")) {
                    System.out.println("Executing: " + trimmed.substring(0, Math.min(50, trimmed.length())) + "...");
                    stmt.execute(trimmed);
                    System.out.println("✓ Success");
                }
            }
            
            // Verify the constraint was added
            var rs = stmt.executeQuery("SHOW CREATE TABLE quiz");
            if (rs.next()) {
                String createTable = rs.getString(2);
                if (createTable.contains("UK_module_id")) {
                    System.out.println("\n✓ Migration V3 applied successfully!");
                    System.out.println("✓ UNIQUE constraint UK_module_id added to quiz.module_id");
                } else {
                    System.out.println("\n⚠ Warning: Constraint may not have been added");
                }
            }
            
            stmt.close();
            conn.close();
            
        } catch (Exception e) {
            System.err.println("✗ Error: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
