# Stripe Integration - Quick Reference

## Setup (5 minutes)

### 1. Set Environment Variable
```bash
export STRIPE_API_KEY=sk_test_your_key_here
```

### 2. Verify Configuration
Check `application.yaml` has:
```yaml
stripe:
  api:
    key: ${STRIPE_API_KEY:sk_test_your_test_key_here}
```

### 3. Build Project
```bash
mvn clean install
```

## API Quick Reference

### Create Payment Intent
```bash
curl -X POST http://localhost:8082/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "subscriptionPlanId": 1,
    "currency": "usd"
  }'
```

**Response:**
```json
{
  "paymentId": 1,
  "clientSecret": "pi_xxx_secret_xxx",
  "status": "PENDING",
  "amount": 99.99,
  "subscriptionPlan": {
    "id": 1,
    "name": "PRO",
    "price": 99.99
  }
}
```

### Confirm Payment
```bash
curl -X POST http://localhost:8082/api/payments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "subscriptionPlanId": 1,
    "amount": 99.99,
    "currency": "usd",
    "paymentIntentId": "pi_xxx"
  }'
```

**Response:**
```json
{
  "paymentId": 1,
  "status": "COMPLETED",
  "subscriptionId": 1,
  "amount": 99.99
}
```

### Get Payment History
```bash
curl http://localhost:8082/api/payments/user/1
```

### Get Payment by ID
```bash
curl http://localhost:8082/api/payments/1
```

## Key Classes

### StripeService
```java
// Create payment intent
PaymentIntent createPaymentIntent(Long amount, String currency, String email)

// Confirm payment
PaymentIntent confirmPayment(String paymentIntentId)

// Check if successful
boolean isPaymentSuccessful(String paymentIntentId)
```

### PaymentService
```java
// Create payment intent
PaymentResponse createPaymentIntent(CreatePaymentIntentRequest request)

// Confirm and create subscription
PaymentResponse confirmPaymentAndCreateSubscription(PaymentRequest request)

// Get payments
List<PaymentResponse> getPaymentsByUser(Long userId)
PaymentResponse getPaymentById(Long paymentId)
```

### PaymentController
```
POST   /api/payments/create-intent  - Create payment intent
POST   /api/payments/confirm        - Confirm payment
GET    /api/payments/user/{userId}  - Get payment history
GET    /api/payments/{paymentId}    - Get payment by ID
```

## Payment Status Values

```java
PENDING      // Payment intent created, awaiting confirmation
COMPLETED    // Payment successful, subscription created
FAILED       // Payment failed
CANCELLED    // Payment cancelled
REFUNDED     // Payment refunded
```

## Test Cards

| Card Number | Status | Use Case |
|-------------|--------|----------|
| 4242 4242 4242 4242 | Success | Normal payment |
| 4000 0000 0000 0002 | Decline | Test decline |
| 4000 0025 0000 3155 | Auth Required | Test 3D Secure |

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| User not found | Invalid userId | Verify user exists |
| Subscription plan not found | Invalid planId | Verify plan exists |
| Payment was not successful | Stripe payment failed | Check Stripe dashboard |
| Stripe error: certificate_unknown | Network/SSL issue | Check network connectivity |

## Frontend Integration (Minimal Example)

```javascript
// 1. Create payment intent
const response = await fetch('/api/payments/create-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1,
    subscriptionPlanId: 1,
    currency: 'usd'
  })
});
const { clientSecret } = await response.json();

// 2. Confirm payment with Stripe
const stripe = Stripe('pk_test_xxx');
const result = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: { email: 'user@example.com' }
  }
});

// 3. Confirm on backend
if (result.paymentIntent.status === 'succeeded') {
  const confirmResponse = await fetch('/api/payments/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 1,
      subscriptionPlanId: 1,
      amount: 99.99,
      currency: 'usd',
      paymentIntentId: result.paymentIntent.id
    })
  });
  const subscription = await confirmResponse.json();
  console.log('Subscription created:', subscription);
}
```

## Database Schema

```sql
-- Payment table updates
ALTER TABLE payments ADD COLUMN stripe_payment_intent_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN stripe_customer_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN subscription_plan_id BIGINT;
ALTER TABLE payments MODIFY COLUMN status ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- Add foreign key
ALTER TABLE payments ADD CONSTRAINT fk_subscription_plan 
  FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id);
```

## Debugging

### Enable Debug Logging
Add to `application.yaml`:
```yaml
logging:
  level:
    com.example.back.service.StripeService: DEBUG
    com.example.back.service.PaymentService: DEBUG
```

### Check Logs
```bash
# View payment creation logs
grep "Creating payment intent" logs/application.log

# View payment confirmation logs
grep "Confirming payment" logs/application.log

# View Stripe errors
grep "Stripe error" logs/application.log
```

### Verify Stripe Connection
```bash
# Test Stripe API key
curl -u sk_test_your_key: https://api.stripe.com/v1/customers
```

## Production Checklist

- [ ] Switch to live Stripe keys
- [ ] Update STRIPE_API_KEY environment variable
- [ ] Enable Stripe webhooks
- [ ] Test with real cards
- [ ] Set up monitoring/alerts
- [ ] Configure backup payment method
- [ ] Review security settings
- [ ] Test error scenarios
- [ ] Load test payment processing
- [ ] Document runbook for payment issues

## Useful Links

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Java Library](https://github.com/stripe/stripe-java)

## Support Resources

1. **STRIPE_INTEGRATION_GUIDE.md** - Comprehensive guide
2. **STRIPE_IMPLEMENTATION_SUMMARY.md** - Implementation details
3. **Application Logs** - Check for errors
4. **Stripe Dashboard** - View payment details
5. **Audit Logs** - Track payment history
