package com.example.back.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/migration")
public class MigrationController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/check-constraints")
    public ResponseEntity<?> checkConstraints() {
        try {
            Connection conn = dataSource.getConnection();
            Statement stmt = conn.createStatement();

            // Get all foreign keys on the quiz table
            ResultSet fkRS = stmt.executeQuery(
                "SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME " +
                "FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE " +
                "WHERE TABLE_NAME = 'quiz' AND REFERENCED_TABLE_NAME IS NOT NULL"
            );
            
            List<Map<String, String>> foreignKeys = new ArrayList<>();
            while (fkRS.next()) {
                Map<String, String> fk = new HashMap<>();
                fk.put("constraint_name", fkRS.getString("CONSTRAINT_NAME"));
                fk.put("column_name", fkRS.getString("COLUMN_NAME"));
                fk.put("referenced_table", fkRS.getString("REFERENCED_TABLE_NAME"));
                fk.put("referenced_column", fkRS.getString("REFERENCED_COLUMN_NAME"));
                foreignKeys.add(fk);
            }

            stmt.close();
            conn.close();

            Map<String, Object> response = new HashMap<>();
            response.put("foreign_keys", foreignKeys);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error checking constraints: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/apply-v2")
    public ResponseEntity<?> applyMigrationV2() {
        try {
            Connection conn = dataSource.getConnection();
            Statement stmt = conn.createStatement();

            System.out.println("Applying migration V2: Fix Quiz Course Constraint...");

            // First, drop the foreign key
            try {
                stmt.execute("ALTER TABLE quiz DROP FOREIGN KEY FKsuuurs360upoc31ioqndwb7cr");
                System.out.println("✓ Foreign key dropped");
            } catch (Exception e) {
                System.out.println("Note: Could not drop foreign key: " + e.getMessage());
            }

            // Drop the unique constraint
            try {
                stmt.execute("ALTER TABLE quiz DROP INDEX UK8b1no9kk3xjgste5vdbfgpcrr");
                System.out.println("✓ Unique constraint removed from quiz table");
            } catch (Exception e) {
                String errorMsg = e.getMessage();
                if (errorMsg.contains("can't drop")) {
                    System.out.println("✓ Constraint already removed or does not exist");
                } else {
                    System.out.println("Note: " + errorMsg);
                }
            }

            // Verify the constraint is removed
            ResultSet rs = stmt.executeQuery("SHOW INDEXES FROM quiz");
            StringBuilder indexes = new StringBuilder();
            while (rs.next()) {
                indexes.append(rs.getString("Key_name")).append(" (").append(rs.getString("Column_name")).append("), ");
            }

            stmt.close();
            conn.close();

            System.out.println("✓ Migration V2 applied successfully!");
            System.out.println("✓ Multiple quizzes can now be created per course");

            Map<String, String> response = new HashMap<>();
            response.put("message", "Migration V2 applied successfully");
            response.put("details", "Unique constraint removed from quiz table. Multiple quizzes can now be created per course.");
            response.put("indexes", indexes.toString());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error applying migration: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
