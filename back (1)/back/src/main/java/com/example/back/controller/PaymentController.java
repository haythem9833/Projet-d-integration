package com.example.back.controller;

import com.example.back.dto.request.PaymentRequest;
import com.example.back.dto.response.PaymentResponse;
import com.example.back.service.PaymentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // PAY SUBSCRIPTION / COURSE
    @PostMapping
    public ResponseEntity<PaymentResponse> makePayment(
            @Valid @RequestBody PaymentRequest request
    ) {
        PaymentResponse response = paymentService.processPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // PAYMENT HISTORY
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserPayments(@PathVariable Long userId) {
        return ResponseEntity.ok(
                paymentService.getPaymentsByUser(userId)
        );
    }
}