# Stripe Integration - Test Scenarios

## Test Environment Setup

### Prerequisites
1. Stripe test account created
2. Test API key obtained
3. Backend running on http://localhost:8082
4. Database populated with test data

### Test Data Setup

```sql
-- Create test user
INSERT INTO users (first_name, last_name, email, password, role, created_at) 
VALUES ('Test', 'User', 'test@example.com', 'hashed_password', 'STUDENT', NOW());

-- Create test subscription plans
INSERT INTO subscription_plans (name, price, billing_cycle, max_courses, max_students, features, created_at) 
VALUES 
  ('BASIC', 29.99, 'MONTHLY', 10, 100, '["feature1", "feature2"]', NOW()),
  ('PRO', 99.99, 'MONTHLY', 50, 1000, '["feature1", "feature2", "feature3"]', NOW()),
  ('PREMIUM', 199.99, 'YEARLY', 100, 5000, '["all_features"]', NOW());
```

## Test Scenarios

### Scenario 1: Successful Payment Flow

**Objective:** Complete a successful payment and create subscription

**Steps:**
1. Create payment intent
2. Confirm payment with test card
3. Verify subscription created

**Test Case 1.1: Create Payment Intent**
```bash
curl -X POST http://localhost:8082/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "subscriptionPlanId": 1,
    "currency": "usd"
  }'
```

**Expected Response:**
- Status: 201 Created
- Contains `paymentId`, `clientSecret`, `status: PENDING`
- Contains subscription plan details

**Verification:**
```sql
SELECT * FROM payments WHERE user_id = 1 AND status = 'PENDING';
```

**Test Case 1.2: Confirm Payment**
```bash
curl -X POST http://localhost:8082/api/payments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "subscriptionPlanId": 1,
    "amount": 29.99,
    "currency": "usd",
    "paymentIntentId": "pi_xxx_from_previous_response"
  }'
```

**Expected Response:**
- Status: 200 OK
- Contains `status: COMPLETED`
- Contains `subscriptionId`

**Verification:**
```sql
SELECT * FROM payments WHERE user_id = 1 AND status = 'COMPLETED';
SELECT * FROM subscriptions WHERE user_id = 1 AND status = 'ACTIVE';
```

### Scenario 2: Payment Failure Handling

**Objective:** Handle payment failures gracefully

**Test Case 2.1: Declined Card**
```bash
# Use test card: 4000 0000 0000 0002 (always declines)
curl -X POST http://localhost:8082/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "subscriptionPlanId": 2,
    "currency": "usd"
  }'
```

**Expected Response:**
- Status: 201 Created
- Payment intent created with PENDING status

**Then attempt to confirm with declined card:**
```bash
curl -X POST http://localhost:8082/api/payments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "subscriptionPlanId": 2,
    "amount": 99.99,
    "currency": "usd",
    "paymentIntentId": "pi_xxx"
  }'
```

**Expected Response:**
- Status: 400 Bad Request
- Error message about payment failure
- No subscription created

**Verification:**
```sql
SELECT * FROM payments WHERE user_id = 2 AND status = 'PENDING';
SELECT * FROM subscriptions WHERE user_id = 2;
```

### Scenario 3: Invalid User

**Objective:** Handle invalid user ID

**Test Case 3.1: Non-existent User**
```bash
curl -X POST http://localhost:8082/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 99999,
    "subscriptionPlanId": 1,
    "currency": "usd"
  }'
```

**Expected Response:**
- Status: 500 Internal Server Error
- Error message: "User not found with ID: 99999"

### Scenario 4: Invalid Subscription Plan

**Objective:** Handle invalid subscription plan

**Test Case 4.1: Non-existent Plan**
```bash
curl -X POST http://localhost:8082/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "subscriptionPlanId": 99999,
    "currency": "usd"
  }'
```

**Expected Response:**
- Status: 500 Internal Server Error
- Error message: "Subscription plan not found with ID: 99999"

### Scenario 5: Multiple Subscriptions

**Objective:** Handle user upgrading subscription

**Test Case 5.1: Create First Subscription**
```bash
# Create payment intent for BASIC plan
curl -X POST http://localhost:8082/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 3,
    "subscriptionPlanId": 1,
    "currency": "usd"
  }'

# Confirm payment
curl -X POST http://localhost:8082/api/payments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 3,
    "subscriptionPlanId": 1,
    "amount": 29.99,
    "currency": "usd",
    "paymentIntentId": "pi_xxx"
  }'
```

**Verification:**
```sql
SELECT * FROM subscriptions WHERE user_id = 3 AND status = 'ACTIVE';
```

**Test Case 5.2: Upgrade to PRO Plan**
```bash
# Create payment intent for PRO plan
curl -X POST http://localhost:8082/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 3,
    "subscriptionPlanId": 2,
    "currency": "usd"
  }'

# Confirm payment
curl -X POST http://localhost:8082/api/payments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 3,
    "subscriptionPlanId": 2,
    "amount": 99.99,
    "currency": "usd",
    "paymentIntentId": "pi_xxx"
  }'
```

**Expected Behavior:**
- Previous BASIC subscription cancelled
- New PRO subscription created
- Both payments recorded

**Verification:**
```sql
SELECT * FROM subscriptions WHERE user_id = 3 ORDER BY created_at;
SELECT * FROM payments WHERE user_id = 3 ORDER BY created_at;
```

### Scenario 6: Payment History

**Objective:** Retrieve payment history

**Test Case 6.1: Get User Payments**
```bash
curl http://localhost:8082/api/payments/user/1
```

**Expected Response:**
- Status: 200 OK
- Array of payment objects
- Each payment contains: paymentId, amount, status, method, etc.

**Test Case 6.2: Get Specific Payment**
```bash
curl http://localhost:8082/api/payments/1
```

**Expected Response:**
- Status: 200 OK
- Single payment object with all details

### Scenario 7: Different Currencies

**Objective:** Test payment with different currencies

**Test Case 7.1: EUR Currency**
```bash
curl -X POST http://localhost:8082/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 4,
    "subscriptionPlanId": 1,
    "currency": "eur"
  }'
```

**Expected Response:**
- Status: 201 Created
- Payment intent created with EUR currency

**Test Case 7.2: GBP Currency**
```bash
curl -X POST http://localhost:8082/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 5,
    "subscriptionPlanId": 2,
    "currency": "gbp"
  }'
```

**Expected Response:**
- Status: 201 Created
- Payment intent created with GBP currency

### Scenario 8: Billing Cycles

**Objective:** Test different billing cycles

**Test Case 8.1: Monthly Subscription**
```bash
# Create payment for monthly plan
curl -X POST http://localhost:8082/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 6,
    "subscriptionPlanId": 1,
    "currency": "usd"
  }'

# Confirm payment
curl -X POST http://localhost:8082/api/payments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 6,
    "subscriptionPlanId": 1,
    "amount": 29.99,
    "currency": "usd",
    "paymentIntentId": "pi_xxx"
  }'
```

**Verification:**
```sql
SELECT 
  id, 
  start_date, 
  end_date, 
  DATEDIFF(end_date, start_date) as days_valid 
FROM subscriptions 
WHERE user_id = 6;
-- Should show approximately 30 days
```

**Test Case 8.2: Yearly Subscription**
```bash
# Create payment for yearly plan
curl -X POST http://localhost:8082/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 7,
    "subscriptionPlanId": 3,
    "currency": "usd"
  }'

# Confirm payment
curl -X POST http://localhost:8082/api/payments/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 7,
    "subscriptionPlanId": 3,
    "amount": 199.99,
    "currency": "usd",
    "paymentIntentId": "pi_xxx"
  }'
```

**Verification:**
```sql
SELECT 
  id, 
  start_date, 
  end_date, 
  DATEDIFF(end_date, start_date) as days_valid 
FROM subscriptions 
WHERE user_id = 7;
-- Should show approximately 365 days
```

### Scenario 9: Audit Logging

**Objective:** Verify audit trail is recorded

**Test Case 9.1: Check Audit Logs**
```sql
SELECT * FROM audit_logs 
WHERE user_id = 1 
AND action IN ('PAYMENT_INTENT_CREATED', 'PAYMENT_COMPLETED')
ORDER BY created_at DESC;
```

**Expected Results:**
- PAYMENT_INTENT_CREATED entry when payment intent created
- PAYMENT_COMPLETED entry when payment confirmed

### Scenario 10: Concurrent Payments

**Objective:** Test handling of concurrent payment requests

**Test Case 10.1: Rapid Payment Requests**
```bash
# Send multiple payment intent requests rapidly
for i in {1..5}; do
  curl -X POST http://localhost:8082/api/payments/create-intent \
    -H "Content-Type: application/json" \
    -d '{
      "userId": 8,
      "subscriptionPlanId": 1,
      "currency": "usd"
    }' &
done
wait
```

**Expected Behavior:**
- All requests succeed
- Each creates separate payment intent
- No data corruption

**Verification:**
```sql
SELECT COUNT(*) as payment_count FROM payments WHERE user_id = 8;
```

## Performance Tests

### Load Test: Payment Intent Creation

```bash
# Create 100 payment intents
for i in {1..100}; do
  curl -X POST http://localhost:8082/api/payments/create-intent \
    -H "Content-Type: application/json" \
    -d "{
      \"userId\": $((i % 10 + 1)),
      \"subscriptionPlanId\": $((i % 3 + 1)),
      \"currency\": \"usd\"
    }" &
done
wait
```

**Metrics to Monitor:**
- Response time
- Error rate
- Database connection pool usage
- Stripe API rate limits

## Regression Tests

### After Each Deployment

1. **Basic Payment Flow**
   - Create payment intent
   - Confirm payment
   - Verify subscription created

2. **Error Handling**
   - Invalid user
   - Invalid plan
   - Payment failure

3. **Data Integrity**
   - Check payment records
   - Check subscription records
   - Check audit logs

4. **API Compatibility**
   - Legacy endpoints still work
   - New endpoints work correctly
   - Response formats correct

## Test Checklist

- [ ] Successful payment flow
- [ ] Payment failure handling
- [ ] Invalid user handling
- [ ] Invalid plan handling
- [ ] Multiple subscriptions
- [ ] Payment history retrieval
- [ ] Different currencies
- [ ] Monthly billing cycle
- [ ] Yearly billing cycle
- [ ] Audit logging
- [ ] Concurrent requests
- [ ] Load testing
- [ ] Error responses
- [ ] Data integrity
- [ ] API compatibility
