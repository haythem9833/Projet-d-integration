package com.example.back.controller;

import com.example.back.entity.Certificate;
import com.example.back.entity.User;
import com.example.back.repository.CertificateRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {
    
    private final CertificateRepository certificateRepository;
    
    public CertificateController(CertificateRepository certificateRepository) {
        this.certificateRepository = certificateRepository;
    }
    
    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Certificate>> getStudentCertificates(
        Authentication authentication
    ) {
        Long studentId = Long.parseLong(authentication.getName());
        
        User user = new User();
        user.setId(studentId);
        
        List<Certificate> certificates = certificateRepository.findByUser(user);
        
        return ResponseEntity.ok(certificates);
    }
    
    @GetMapping("/{certificateId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Certificate> getCertificate(
        @PathVariable Long certificateId,
        Authentication authentication
    ) {
        Long studentId = Long.parseLong(authentication.getName());
        
        Certificate certificate = certificateRepository.findById(certificateId)
            .filter(cert -> cert.getUser().getId().equals(studentId))
            .orElseThrow(() -> new RuntimeException("Certificate not found"));
        
        return ResponseEntity.ok(certificate);
    }
}
