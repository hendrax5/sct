# 🧪 Quick Testing Guide

## 1. Start Services
```bash
docker compose up -d
npm install
npm run migrate:dev
npm run dev
```

## 2. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "name": "Test User"
  }' | jq .

# Save token: TOKEN="<accessToken_from_response>"
export TOKEN="eyJ..."
```

## 3. Test All Endpoints

### User Profile
```bash
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### List Products
```bash
curl http://localhost:3000/api/products | jq .
```

### Get Cart
```bash
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Add Address
```bash
curl -X POST http://localhost:3000/api/addresses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Home",
    "street": "Jl. Sudirman 123",
    "city": "Jakarta",
    "province": "Jakarta",
    "zipCode": "12345",
    "fullName": "Test User",
    "phone": "081234567890",
    "isDefault": true
  }' | jq .
```

### Calculate Shipping
```bash
curl -X POST http://localhost:3000/api/shipping/cost \
  -H "Content-Type: application/json" \
  -d '{
    "origin": 501,
    "destination": 574,
    "weight": 1000,
    "courier": "jne"
  }' | jq .
```

## 4. Database UI
Open http://localhost:8080 in browser (Adminer)

## 5. Run Tests
```bash
npm test
npm run test:watch
```

That's it! All endpoints working and ready for frontend integration.
