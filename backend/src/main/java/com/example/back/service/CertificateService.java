package com.example.back.service;

import com.example.back.dto.response.CertificateResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CertificateService {

    public CertificateResponse generate(
            Long userId,
            Long courseId
    ) {

        CertificateResponse response =
                new CertificateResponse();

        response.setCertificateId(1L);
        response.setUserId(userId);
        response.setCourseId(courseId);
        response.setCertificateUrl(
                "https://example.com/certificate.pdf"
        );

        return response;
    }

    public List<CertificateResponse> getUserCertificates(
            Long userId
    ) {

        List<CertificateResponse> list =
                new ArrayList<>();

        CertificateResponse response =
                new CertificateResponse();

        response.setCertificateId(1L);
        response.setUserId(userId);
        response.setCourseId(10L);
        response.setCertificateUrl(
                "https://example.com/certificate.pdf"
        );

        list.add(response);

        return list;
    }
}