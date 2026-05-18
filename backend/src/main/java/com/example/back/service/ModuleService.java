package com.example.back.service;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.back.repository.ModuleRepository;
import com.example.back.entity.Module;

@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public ModuleService(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    public Module save(Module module) {
        return moduleRepository.save(module);
    }

    public List<Module> getByCourse(Long courseId) {
        return moduleRepository.findByCourseId(courseId);
    }

    public Module getModuleById(Long id) {
        return moduleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Module not found with id: " + id));
    }

    public void delete(Long id) {
        Module module = getModuleById(id);
        moduleRepository.delete(module);
    }
}