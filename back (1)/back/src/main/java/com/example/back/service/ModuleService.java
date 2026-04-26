package com.example.back.service;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.back.repository.ModuleRepository;

@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public ModuleService(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    public com.example.back.entity.Module save(com.example.back.entity.Module module) {
        return moduleRepository.save(module);
    }

    public List<com.example.back.entity.Module> getByCourse(Long courseId) {
        return moduleRepository.findByCourseId(courseId);
    }
}