package com.example.back.controller;

import com.example.back.service.AdminService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // GET DASHBOARD STATS
    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {
        return ResponseEntity.ok(
                adminService.getDashboardStats()
        );
    }

    // DELETE USER
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id
    ) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // BLOCK USER
    @PutMapping("/users/{id}/block")
    public ResponseEntity<String> blockUser(
            @PathVariable Long id
    ) {
        adminService.blockUser(id);
        return ResponseEntity.ok("User blocked");
    }
}