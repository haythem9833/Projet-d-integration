package com.example.back.service;

import com.example.back.dto.request.PaymentRequest;
import com.example.back.dto.response.PaymentResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentService {

    public PaymentResponse processPayment(
            PaymentRequest request
    ) {

        PaymentResponse response = new PaymentResponse();
        response.setPaymentId(1L);
        response.setUserId(request.getUserId());
        response.setAmount(request.getAmount());
        response.setStatus("SUCCESS");

        return response;
    }

    public List<PaymentResponse> getPaymentsByUser(
            Long userId
    ) {

        List<PaymentResponse> list = new ArrayList<>();

        PaymentResponse payment = new PaymentResponse();
        payment.setPaymentId(1L);
        payment.setUserId(userId);
        payment.setAmount(99.0);
        payment.setStatus("SUCCESS");

        list.add(payment);

        return list;
    }
}