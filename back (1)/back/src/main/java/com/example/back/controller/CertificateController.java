package com.example.back.controller;

import com.example.back.dto.response.CertificateResponse;
import com.example.back.service.CertificateService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;
    private String category;

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public CertificateController(
            CertificateService certificateService
    ) {
        this.certificateService = certificateService;
    }

    // GENERATE CERTIFICATE
    @PostMapping("/generate/{userId}/{courseId}")
    public ResponseEntity<CertificateResponse> generateCertificate(
            @PathVariable Long userId,
            @PathVariable Long courseId
    ) {
        CertificateResponse response =
                certificateService.generate(userId, courseId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    // GET USER CERTIFICATES
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCertificates(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
                certificateService.getUserCertificates(userId)
        );
    }
}