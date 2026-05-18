# Stripe Payment Integration Guide

## Overview
This document describes the Stripe payment integration for the e-learning platform. After student registration, users must pay via Stripe to create a subscription.

## Architecture

### Components

1. **StripeService** - Handles all Stripe API interactions
2. **PaymentService** - Business logic for payment processing and subscription creation
3. **PaymentController** - REST endpoints for payment operations
4. **PaymentStatus Enum** - Payment status tracking (PENDING, COMPLETED, FAILED, CANCELLED, REFUNDED)
5. **Payment Entity** - Database model for payment records
6. **DTOs** - Request/Response objects for API communication

## Setup Instructions

### 1. Environment Configuration

Add your Stripe API key to `application.yaml`:

```yaml
stripe:
  api:
    key: ${STRIPE_API_KEY:sk_test_your_test_key_here}
```

Or set the environment variable:
```bash
export STRIPE_API_KEY=sk_test_your_actual_key
```

### 2. Dependencies

The Stripe Java library has been added to `pom.xml`:

```xml
<dependency>
    <groupId>com.stripe</groupId>
    <artifactId>stripe-java</artifactId>
    <version>23.0.0</version>
</dependency>
```

### 3. Database Schema

The Payment entity has been updated with Stripe-specific fields:

```sql
ALTER TABLE payments ADD COLUMN stripe_payment_intent_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN stripe_customer_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN subscription_plan_id BIGINT;
ALTER TABLE payments MODIFY COLUMN status ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');
ALTER TABLE payments MODIFY COLUMN method VARCHAR(50);
```

## API Endpoints

### 1. Create Payment Intent

**Endpoint:** `POST /api/payments/create-intent`

**Purpose:** Create a Stripe payment intent for a subscription plan

**Request Body:**
```json
{
  "userId": 1,
  "subscriptionPlanId": 1,
  "currency": "usd"
}
```

**Response:**
```json
{
  "paymentId": 1,
  "userId": 1,
  "amount": 99.99,
  "status": "PENDING",
  "method": "STRIPE",
  "stripePaymentIntentId": "pi_1234567890",
  "clientSecret": "pi_1234567890_secret_abcdefg",
  "subscriptionPlan": {
    "id": 1,
    "name": "PRO",
    "price": 99.99,
    "billingCycle": "MONTHLY",
    "maxCourses": 50,
    "maxStudents": 1000,
    "features": "[\"feature1\", \"feature2\"]"
  },
  "createdAt": "2024-01-15T10:30:00"
}
```

**Status Codes:**
- `201 Created` - Payment intent created successfully
- `400 Bad Request` - Invalid request or Stripe error
- `500 Internal Server Error` - Server error

### 2. Confirm Payment and Create Subscription

**Endpoint:** `POST /api/payments/confirm`

**Purpose:** Confirm payment with Stripe and create subscription

**Request Body:**
```json
{
  "userId": 1,
  "subscriptionPlanId": 1,
  "amount": 99.99,
  "currency": "usd",
  "paymentIntentId": "pi_1234567890"
}
```

**Response:**
```json
{
  "paymentId": 1,
  "userId": 1,
  "amount": 99.99,
  "status": "COMPLETED",
  "method": "STRIPE",
  "stripePaymentIntentId": "pi_1234567890",
  "subscriptionId": 1,
  "subscriptionPlan": {
    "id": 1,
    "name": "PRO",
    "price": 99.99,
    "billingCycle": "MONTHLY",
    "maxCourses": 50,
    "maxStudents": 1000,
    "features": "[\"feature1\", \"feature2\"]"
  },
  "paidAt": "2024-01-15T10:35:00"
}
```

**Status Codes:**
- `200 OK` - Payment confirmed and subscription created
- `400 Bad Request` - Payment failed or invalid request
- `500 Internal Server Error` - Server error

### 3. Get Payment History

**Endpoint:** `GET /api/payments/user/{userId}`

**Purpose:** Retrieve all payments for a user

**Response:**
```json
[
  {
    "paymentId": 1,
    "userId": 1,
    "amount": 99.99,
    "status": "COMPLETED",
    "method": "STRIPE",
    "stripePaymentIntentId": "pi_1234567890",
    "paidAt": "2024-01-15T10:35:00",
    "createdAt": "2024-01-15T10:30:00",
    "subscriptionPlan": {
      "id": 1,
      "name": "PRO",
      "price": 99.99,
      "billingCycle": "MONTHLY"
    }
  }
]
```

**Status Codes:**
- `200 OK` - Payments retrieved successfully
- `500 Internal Server Error` - Server error

### 4. Get Payment by ID

**Endpoint:** `GET /api/payments/{paymentId}`

**Purpose:** Retrieve a specific payment

**Response:** Same as individual payment object from payment history

**Status Codes:**
- `200 OK` - Payment retrieved successfully
- `404 Not Found` - Payment not found
- `500 Internal Server Error` - Server error

## Payment Flow

### Step 1: User Registration
1. User registers via `/api/auth/signup`
2. User account is created WITHOUT a subscription
3. User receives confirmation

### Step 2: Create Payment Intent
1. Frontend calls `POST /api/payments/create-intent`
2. Backend creates Stripe PaymentIntent
3. Backend creates Payment record with PENDING status
4. Backend returns `clientSecret` to frontend
5. Frontend receives payment details and client secret

### Step 3: Payment Processing (Frontend)
1. Frontend uses Stripe.js to collect payment details
2. Frontend confirms payment with Stripe using clientSecret
3. Frontend receives payment confirmation from Stripe

### Step 4: Confirm Payment (Backend)
1. Frontend calls `POST /api/payments/confirm` with paymentIntentId
2. Backend verifies payment with Stripe
3. Backend updates Payment status to COMPLETED
4. Backend creates Subscription record with ACTIVE status
5. Backend logs audit trail
6. Backend returns subscription details

### Step 5: Access Granted
1. User can now access courses based on subscription plan
2. Subscription is valid until endDate

## Service Methods

### StripeService

```java
// Create payment intent
PaymentIntent createPaymentIntent(Long amount, String currency, String email)

// Confirm payment
PaymentIntent confirmPayment(String paymentIntentId)

// Retrieve payment intent
PaymentIntent retrievePaymentIntent(String paymentIntentId)

// Create or get customer
Customer createOrGetCustomer(String email, String name)

// Check if payment successful
boolean isPaymentSuccessful(String paymentIntentId)
```

### PaymentService

```java
// Create payment intent
PaymentResponse createPaymentIntent(CreatePaymentIntentRequest request)

// Confirm payment and create subscription
PaymentResponse confirmPaymentAndCreateSubscription(PaymentRequest request)

// Get payment history
List<PaymentResponse> getPaymentsByUser(Long userId)

// Get payment by ID
PaymentResponse getPaymentById(Long paymentId)
```

## Error Handling

### Common Errors

1. **User Not Found**
   - Status: 500
   - Message: "User not found with ID: {userId}"

2. **Subscription Plan Not Found**
   - Status: 500
   - Message: "Subscription plan not found with ID: {planId}"

3. **Payment Not Found**
   - Status: 500
   - Message: "Payment record not found for intent: {intentId}"

4. **Payment Failed**
   - Status: 400
   - Message: "Payment was not successful"

5. **Stripe Error**
   - Status: 400
   - Message: "Stripe error: {error details}"

## Audit Logging

All payment operations are logged in the audit trail:

- `PAYMENT_INTENT_CREATED` - When payment intent is created
- `PAYMENT_COMPLETED` - When payment is confirmed and subscription created

## Security Considerations

1. **API Key Management**
   - Store Stripe API key in environment variables
   - Never commit API keys to version control
   - Use separate keys for test and production

2. **Payment Intent Verification**
   - Always verify payment status with Stripe before creating subscription
   - Check payment intent status on backend

3. **User Validation**
   - Verify user exists before processing payment
   - Validate subscription plan exists

4. **Subscription Management**
   - Cancel existing subscriptions before creating new ones
   - Set appropriate expiration dates

## Testing

### Test Stripe Cards

Use these test card numbers in Stripe test mode:

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Authentication:** 4000 0025 0000 3155

### Test Flow

1. Create payment intent with test user
2. Use test card to complete payment
3. Confirm payment on backend
4. Verify subscription was created
5. Check audit logs

## Frontend Integration

### Required Frontend Steps

1. **Install Stripe.js**
   ```html
   <script src="https://js.stripe.com/v3/"></script>
   ```

2. **Create Payment Intent**
   ```javascript
   const response = await fetch('/api/payments/create-intent', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       userId: userId,
       subscriptionPlanId: planId,
       currency: 'usd'
     })
   });
   const data = await response.json();
   const clientSecret = data.clientSecret;
   ```

3. **Collect Payment Details**
   ```javascript
   const stripe = Stripe('pk_test_your_public_key');
   const elements = stripe.elements();
   const cardElement = elements.create('card');
   cardElement.mount('#card-element');
   ```

4. **Confirm Payment**
   ```javascript
   const result = await stripe.confirmCardPayment(clientSecret, {
     payment_method: {
       card: cardElement,
       billing_details: { email: userEmail }
     }
   });
   ```

5. **Confirm on Backend**
   ```javascript
   if (result.paymentIntent.status === 'succeeded') {
     const confirmResponse = await fetch('/api/payments/confirm', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         userId: userId,
         subscriptionPlanId: planId,
         amount: amount,
         currency: 'usd',
         paymentIntentId: result.paymentIntent.id
       })
     });
     const subscription = await confirmResponse.json();
     // Redirect to dashboard
   }
   ```

## Troubleshooting

### Maven Build Issues

If you encounter certificate issues with Maven:

1. **Update Maven Settings**
   - Create/update `~/.m2/settings.xml`
   - Add repository mirrors if needed

2. **Use HTTP Instead of HTTPS**
   - Temporarily use HTTP repositories (not recommended for production)

3. **Clear Maven Cache**
   ```bash
   mvn clean
   rm -rf ~/.m2/repository
   ```

### Stripe Connection Issues

1. **Verify API Key**
   - Check that STRIPE_API_KEY environment variable is set
   - Verify key format (should start with `sk_test_` or `sk_live_`)

2. **Check Network**
   - Ensure backend can reach Stripe API
   - Check firewall rules

3. **Review Logs**
   - Check application logs for Stripe error messages
   - Enable debug logging in StripeService

## Production Deployment

### Before Going Live

1. **Switch to Live Keys**
   - Update STRIPE_API_KEY with live key
   - Update Stripe public key on frontend

2. **Enable Webhooks**
   - Configure Stripe webhooks for payment events
   - Implement webhook handlers for payment confirmations

3. **Security Audit**
   - Review all payment handling code
   - Ensure PCI compliance
   - Test error scenarios

4. **Load Testing**
   - Test payment processing under load
   - Monitor Stripe API rate limits

5. **Backup and Recovery**
   - Ensure database backups are in place
   - Test recovery procedures

## References

- [Stripe Java Library Documentation](https://github.com/stripe/stripe-java)
- [Stripe Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [PCI Compliance](https://stripe.com/docs/security/pci-compliance)
