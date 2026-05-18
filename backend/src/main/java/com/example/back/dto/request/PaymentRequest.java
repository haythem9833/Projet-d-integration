package com.example.back.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

public class PaymentRequest {

    @NotNull(message = "Plan ID is required")
    private Long planId;

    @NotBlank(message = "Card number is required")
    private String cardNumber;

    @NotBlank(message = "Cardholder name is required")
    private String cardholderName;

    @NotBlank(message = "Expiry date is required")
    private String expiryDate;

    @NotBlank(message = "CVV is required")
    private String cvv;

    // Constructors
    public PaymentRequest() {}

    public PaymentRequest(Long planId, String cardNumber, String cardholderName, String expiryDate, String cvv) {
        this.planId = planId;
        this.cardNumber = cardNumber;
        this.cardholderName = cardholderName;
        this.expiryDate = expiryDate;
        this.cvv = cvv;
    }

    // Getters and Setters
    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCardholderName() {
        return cardholderName;
    }

    public void setCardholderName(String cardholderName) {
        this.cardholderName = cardholderName;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }
}
