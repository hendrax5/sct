# 🧪 TESTING GUIDE

## Overview

Comprehensive testing guide for the Ecommerce Platform MVP. This covers unit tests, integration tests, API testing, and end-to-end testing.

---

## Test Setup

### Prerequisites
```bash
# Install dependencies
npm install

# Setup test database
docker compose up -d
npm run migrate:dev
```

### Running Tests
```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Coverage report
npm test -- --coverage

# Run specific test file
npm test -- tests/api/auth.test.ts
```

---

## API Testing with cURL

### 1. Health Check
```bash
curl http://localhost:3000/api/health
# Expected: {"status":"ok"}
```

### 2. User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "name": "Test User"
  }'

# Save the accessToken from response
export TOKEN="<accessToken_from_response>"
```

### 3. User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### 4. Get User Profile
```bash
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 5. List Products
```bash
curl "http://localhost:3000/api/products?page=1&limit=10"
```

### 6. Get Cart
```bash
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Add to Cart
```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod-123",
    "quantity": 2
  }'
```

### 8. Create Address
```bash
curl -X POST http://localhost:3000/api/addresses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Home",
    "street": "Jl. Sudirman No. 123",
    "city": "Jakarta Selatan",
    "province": "DKI Jakarta",
    "zipCode": "12190",
    "fullName": "John Doe",
    "phone": "081234567890",
    "isDefault": true
  }'
```

### 9. Calculate Shipping Cost
```bash
curl -X POST http://localhost:3000/api/shipping/cost \
  -H "Content-Type: application/json" \
  -d '{
    "origin": 501,
    "destination": 574,
    "weight": 1000,
    "courier": "jne"
  }'
```

### 10. Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"productId": "prod-123", "quantity": 2}
    ],
    "shippingAddressId": "addr-456",
    "paymentMethod": "XENDIT"
  }'
```

---

## Integration Testing

### Database Operations
```typescript
// tests/integration/database.test.ts
import { prisma } from '@/lib/db'

test('should create user', async () => {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'hashed',
      name: 'Test',
    },
  })
  
  expect(user.id).toBeDefined()
  expect(user.email).toBe('test@example.com')
})
```

### Authentication Flow
```typescript
// tests/integration/auth-flow.test.ts
test('complete auth flow', async () => {
  // 1. Register
  const registerRes = await fetch('/api/auth/register', {...})
  expect(registerRes.status).toBe(201)
  
  // 2. Login
  const loginRes = await fetch('/api/auth/login', {...})
  const { accessToken } = await loginRes.json()
  
  // 3. Access protected route
  const profileRes = await fetch('/api/users/profile', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  expect(profileRes.status).toBe(200)
})
```

---

## Test Coverage Targets

| Module | Target Coverage | Priority |
|--------|----------------|----------|
| Auth (lib/auth.ts) | 100% | Critical |
| Validation (lib/validation.ts) | 100% | Critical |
| Payment Integration | 90% | High |
| Cart Management | 85% | High |
| Product APIs | 80% | Medium |
| User Profile | 80% | Medium |

---

## Manual Testing Checklist

### Authentication
- [ ] Register with valid email
- [ ] Register with duplicate email (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Access protected route without token (should fail)
- [ ] Access protected route with expired token (should fail)

### Products
- [ ] List products with pagination
- [ ] Filter products by category
- [ ] Search products by keyword
- [ ] View product detail
- [ ] Create product as admin

### Cart
- [ ] Add item to cart
- [ ] Update cart item quantity
- [ ] Remove item from cart
- [ ] View cart total
- [ ] Stock validation on add to cart

### Orders
- [ ] Create order with items
- [ ] View order detail
- [ ] Order status tracking

### Payments
- [ ] Create Xendit payment
- [ ] Create bank transfer payment
- [ ] Webhook payment confirmation

### Shipping
- [ ] Calculate shipping cost (JNE)
- [ ] Calculate shipping cost (TIKI)
- [ ] Calculate shipping cost (POS)

---

## Performance Testing

### Load Testing with Apache Bench
```bash
# Test health endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 http://localhost:3000/api/health

# Test products list
ab -n 100 -c 10 http://localhost:3000/api/products
```

### Expected Performance
- Health check: <50ms p99
- Product list: <200ms p99
- Cart operations: <150ms p99
- Order creation: <300ms p99

---

## Security Testing

### SQL Injection Test
```bash
# Should be prevented by Prisma
curl "http://localhost:3000/api/products?search='; DROP TABLE products;--"
```

### XSS Test
```bash
# Should be sanitized
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "<script>alert(1)</script>", ...}'
```

### Authentication Bypass Test
```bash
# Should return 401
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer invalid_token"
```

---

## Continuous Integration

Tests run automatically on GitHub Actions for:
- Every push to `main` or `develop`
- Every pull request

### CI Pipeline
1. Lint & Type Check
2. Unit Tests
3. Integration Tests
4. Build Verification
5. Docker Image Build

---

## Troubleshooting

### Tests Failing Locally
```bash
# Reset test database
docker compose down -v
docker compose up -d
npm run migrate:dev

# Clear jest cache
npm test -- --clearCache
```

### Database Connection Issues
```bash
# Check if database is running
docker compose ps

# View database logs
docker compose logs db
```

---

## Next Steps

1. Write more unit tests for utility functions
2. Add E2E tests with Playwright
3. Setup test coverage reporting (Codecov)
4. Add visual regression tests
5. Performance benchmarking

