package com.example.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.back.service.ModuleService;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {

    private final ModuleService moduleService;

    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody com.example.back.entity.Module module) {
        return ResponseEntity.ok(moduleService.save(module));
    }

    @GetMapping("/course/{id}")
    public ResponseEntity<?> getByCourse(@PathVariable Long id) {
        return ResponseEntity.ok(
            moduleService.getByCourse(id)
        );
    }
}