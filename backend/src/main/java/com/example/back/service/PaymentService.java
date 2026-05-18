package com.example.back.service;

import com.example.back.dto.request.PaymentRequest;
import com.example.back.dto.response.SubscriptionPlanResponse;
import com.example.back.entity.*;
import com.example.back.repository.PaymentRepository;
import com.example.back.repository.SubscriptionPlanRepository;
import com.example.back.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionService subscriptionService;

    public PaymentService(PaymentRepository paymentRepository,
                         SubscriptionPlanRepository subscriptionPlanRepository,
                         SubscriptionRepository subscriptionRepository,
                         SubscriptionService subscriptionService) {
        this.paymentRepository = paymentRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionService = subscriptionService;
    }

    // Process payment (simulated - no real Stripe)
    public Map<String, Object> processPayment(User user, PaymentRequest request) {
        // Get subscription plan
        SubscriptionPlan plan = subscriptionPlanRepository.findById(request.getPlanId())
            .orElseThrow(() -> new RuntimeException("Subscription plan not found"));

        // Create payment record
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setSubscriptionPlan(plan);
        payment.setAmount(plan.getPrice());
        payment.setMethod("SIMULATED"); // Simulated payment
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setPaidAt(LocalDateTime.now());
        
        Payment savedPayment = paymentRepository.save(payment);

        // Create subscription
        Subscription subscription = subscriptionService.createSubscription(user, plan);

        // Return simplified response (avoid circular references)
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Payment processed successfully");
        response.put("paymentId", savedPayment.getId());
        response.put("amount", savedPayment.getAmount());
        response.put("status", savedPayment.getStatus().toString());
        response.put("subscriptionId", subscription.getId());
        response.put("planName", plan.getName());

        return response;
    }

    // Get all subscription plans
    public List<SubscriptionPlanResponse> getAllSubscriptionPlans() {
        return subscriptionPlanRepository.findAll().stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    // Create subscription for user
    public Subscription createSubscriptionForUser(User user, Long planId) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(planId)
            .orElseThrow(() -> new RuntimeException("Subscription plan not found"));

        return subscriptionService.createSubscription(user, plan);
    }

    // Convert SubscriptionPlan to SubscriptionPlanResponse
    private SubscriptionPlanResponse convertToResponse(SubscriptionPlan plan) {
        SubscriptionPlanResponse response = new SubscriptionPlanResponse();
        response.setId(plan.getId());
        response.setName(plan.getName());
        response.setPrice(plan.getPrice());
        response.setBillingCycle(plan.getBillingCycle().toString());
        response.setMaxCourses(plan.getMaxCourses());
        response.setMaxStudents(plan.getMaxStudents());
        response.setFeatures(plan.getFeatures());
        return response;
    }
}
