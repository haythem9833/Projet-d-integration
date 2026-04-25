package com.example.back.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    public Map<String, Object> getDashboardStats() {

        Map<String, Object> stats =
                new HashMap<>();

        stats.put("users", 120);
        stats.put("courses", 45);
        stats.put("payments", 320);
        stats.put("certificates", 80);

        return stats;
    }

    public void deleteUser(Long id) {

        System.out.println(
                "Deleted user with id: " + id
        );
    }

    public void blockUser(Long id) {

        System.out.println(
                "Blocked user with id: " + id
        );
    }
}