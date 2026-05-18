package com.example.back.controller;

import com.example.back.dto.request.PaymentRequest;
import com.example.back.dto.response.PaymentResponse;
import com.example.back.dto.response.SubscriptionPlanResponse;
import com.example.back.entity.Subscription;
import com.example.back.entity.SubscriptionPlan;
import com.example.back.entity.User;
import com.example.back.service.PaymentService;
import com.example.back.service.SubscriptionService;
import com.example.back.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final SubscriptionService subscriptionService;
    private final UserService userService;

    public PaymentController(PaymentService paymentService,
                           SubscriptionService subscriptionService,
                           UserService userService) {
        this.paymentService = paymentService;
        this.subscriptionService = subscriptionService;
        this.userService = userService;
    }

    // Process payment and create subscription
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(
            @Valid @RequestBody PaymentRequest request,
            Authentication authentication) {
        
        // Get user from authentication principal
        User user = (User) authentication.getPrincipal();
        
        // Process payment (simulated - no real Stripe)
        Map<String, Object> paymentResult = paymentService.processPayment(user, request);
        
        return ResponseEntity.ok(paymentResult);
    }

    // Get all subscription plans
    @GetMapping("/plans")
    public ResponseEntity<List<SubscriptionPlanResponse>> getSubscriptionPlans() {
        List<SubscriptionPlanResponse> plans = paymentService.getAllSubscriptionPlans();
        return ResponseEntity.ok(plans);
    }

    // Get active subscription for current user
    @GetMapping("/subscriptions/active")
    public ResponseEntity<Map<String, Object>> getActiveSubscription(
            Authentication authentication) {
        
        // Get user from authentication principal
        User user = (User) authentication.getPrincipal();
        
        Map<String, Object> response = new HashMap<>();
        
        if (subscriptionService.hasActiveSubscription(user)) {
            Subscription subscription = subscriptionService.getActiveSubscription(user);
            response.put("hasActiveSubscription", true);
            response.put("subscription", subscription);
        } else {
            response.put("hasActiveSubscription", false);
            response.put("subscription", null);
        }
        
        return ResponseEntity.ok(response);
    }

    // Create subscription after payment
    @PostMapping("/subscriptions/create")
    public ResponseEntity<Map<String, Object>> createSubscription(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        
        // Get user from authentication principal
        User user = (User) authentication.getPrincipal();
        Long planId = ((Number) request.get("planId")).longValue();
        
        Subscription subscription = paymentService.createSubscriptionForUser(user, planId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("subscription", subscription);
        
        return ResponseEntity.ok(response);
    }
}
