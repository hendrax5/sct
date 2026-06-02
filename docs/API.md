# 📚 API DOCUMENTATION

## Base URL
```
Development: http://localhost:3000/api
Production: https://ecommerce.example.com/api
```

## Response Format

### Success Response
```json
{
  "data": { /* resource data */ },
  "meta": { "timestamp": "2026-03-20T10:30:00Z" }
}
```

### Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

## AUTH ENDPOINTS

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe"
}

Response 201:
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response 200:
{
  "data": {
    "user": { "id": "uuid", "email": "...", "name": "..." },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

---

## PRODUCTS ENDPOINTS

### List Products
```
GET /products?page=1&limit=20&categoryId=cat-123&search=laptop&sort=price

Response 200:
{
  "data": [
    {
      "id": "prod-123",
      "sku": "LAP-001",
      "name": "Laptop",
      "price": 5000000,
      "stock": 10,
      "images": ["url1", "url2"],
      "slug": "laptop"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  }
}
```

### Get Product Detail
```
GET /products/:id

Response 200:
{
  "data": {
    "id": "prod-123",
    "sku": "LAP-001",
    "name": "Laptop",
    "description": "High performance laptop",
    "price": 5000000,
    "stock": 10,
    "images": ["url1"],
    "category": { "id": "cat-1", "name": "Electronics" },
    "variants": [
      { "id": "var-1", "name": "RAM", "value": "8GB", "price": 0 }
    ]
  }
}
```

---

## ORDERS ENDPOINTS

### Create Order
```
POST /orders
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "items": [
    { "productId": "prod-123", "quantity": 2 }
  ],
  "shippingAddressId": "addr-456",
  "paymentMethod": "XENDIT"
}

Response 201:
{
  "data": {
    "id": "order-789",
    "orderNumber": "ORD-1706851800000-AB123",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "items": [
      { "productId": "prod-123", "quantity": 2, "pricePerUnit": 5000000 }
    ]
  }
}
```

### Get Order Detail
```
GET /orders/:id
Authorization: Bearer <accessToken>

Response 200:
{
  "data": {
    "id": "order-789",
    "orderNumber": "ORD-xxx",
    "status": "SHIPPED",
    "paymentStatus": "CONFIRMED",
    "shippingStatus": "SHIPPED",
    "trackingNo": "JNE123456789",
    "courierName": "JNE",
    "items": [...],
    "subtotal": 10000000,
    "shippingCost": 50000,
    "tax": 0,
    "total": 10050000,
    "createdAt": "2026-03-20T10:00:00Z"
  }
}
```

---

## ADMIN ENDPOINTS

### Create Product
```
POST /admin/products
Authorization: Bearer <adminToken>
Content-Type: application/json

{
  "sku": "LAP-002",
  "name": "Gaming Laptop",
  "description": "High end gaming laptop",
  "price": 15000000,
  "stock": 5,
  "categoryId": "cat-electronics",
  "images": ["url1", "url2"]
}

Response 201:
{
  "data": {
    "id": "prod-124",
    "sku": "LAP-002",
    "name": "Gaming Laptop",
    ...
  }
}
```

### Update Order Status
```
PATCH /admin/orders/:id
Authorization: Bearer <adminToken>
Content-Type: application/json

{
  "status": "SHIPPED",
  "trackingNo": "JNE123456789",
  "courierName": "JNE"
}

Response 200:
{
  "data": {
    "id": "order-789",
    "status": "SHIPPED",
    "trackingNo": "JNE123456789",
    ...
  }
}
```

---

## ERROR CODES

| Code | Status | Meaning |
|------|--------|---------|
| INVALID_CREDENTIALS | 401 | Email or password incorrect |
| UNAUTHORIZED | 401 | Missing or invalid token |
| USER_EXISTS | 409 | Email already registered |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Input validation failed |
| INTERNAL_ERROR | 500 | Server error |

---

## AUTHENTICATION

All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <accessToken>
```

Token expires in 15 minutes. Use refreshToken to get new accessToken:
```
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refreshToken>"
}
```

---

## RATE LIMITING

- General: 100 requests per 15 minutes per IP
- Login: 5 attempts per 5 minutes per IP

Headers returned:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706851200
```


---

## CART ENDPOINTS

### Get Cart
```
GET /cart
Authorization: Bearer <accessToken>

Response 200:
{
  "data": {
    "id": "cart-123",
    "userId": "user-456",
    "items": [
      {
        "id": "item-1",
        "productId": "prod-123",
        "quantity": 2,
        "product": {
          "id": "prod-123",
          "name": "Laptop",
          "price": 5000000,
          "stock": 10
        }
      }
    ],
    "total": 10000000,
    "itemCount": 1
  }
}
```

### Add Item to Cart
```
POST /cart/items
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "productId": "prod-123",
  "quantity": 2
}

Response 201:
{
  "data": {
    "id": "item-1",
    "cartId": "cart-123",
    "productId": "prod-123",
    "quantity": 2
  }
}
```

### Update Cart Item
```
PATCH /cart/items/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "quantity": 5
}

Response 200:
{
  "data": {
    "id": "item-1",
    "quantity": 5
  }
}
```

### Remove Cart Item
```
DELETE /cart/items/:id
Authorization: Bearer <accessToken>

Response 200:
{
  "data": { "success": true }
}
```

---

## ADDRESS ENDPOINTS

### List Addresses
```
GET /addresses
Authorization: Bearer <accessToken>

Response 200:
{
  "data": [
    {
      "id": "addr-123",
      "userId": "user-456",
      "label": "Home",
      "street": "Jl. Sudirman No. 123",
      "city": "Jakarta Selatan",
      "province": "DKI Jakarta",
      "zipCode": "12190",
      "fullName": "John Doe",
      "phone": "081234567890",
      "isDefault": true
    }
  ]
}
```

### Create Address
```
POST /addresses
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "label": "Office",
  "street": "Jl. Thamrin No. 45",
  "city": "Jakarta Pusat",
  "province": "DKI Jakarta",
  "zipCode": "10350",
  "fullName": "John Doe",
  "phone": "081234567890",
  "isDefault": false
}

Response 201:
{
  "data": {
    "id": "addr-124",
    "label": "Office",
    ...
  }
}
```

---

## PAYMENT ENDPOINTS

### Create Payment
```
POST /payments/create
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "orderId": "order-789",
  "paymentMethod": "XENDIT"
}

Response 201 (Xendit):
{
  "data": {
    "payment": {
      "id": "pay-123",
      "orderId": "order-789",
      "amount": 10050000,
      "method": "XENDIT",
      "xenditInvoiceId": "inv-123",
      "status": "PENDING"
    },
    "paymentUrl": "https://checkout.xendit.co/web/inv-123"
  }
}

Response 201 (Bank Transfer):
{
  "data": {
    "id": "pay-124",
    "orderId": "order-789",
    "amount": 10050000,
    "method": "BANK_TRANSFER",
    "bankAccount": "BCA 1234567890",
    "status": "PENDING"
  }
}
```

---

## SHIPPING ENDPOINTS

### Calculate Shipping Cost
```
POST /shipping/cost
Content-Type: application/json

{
  "origin": 501,
  "destination": 574,
  "weight": 1000,
  "courier": "jne"
}

Response 200:
{
  "data": [
    {
      "service": "REG",
      "description": "Layanan Reguler",
      "cost": 50000,
      "etd": "2-3"
    },
    {
      "service": "YES",
      "description": "Yakin Esok Sampai",
      "cost": 100000,
      "etd": "1-1"
    }
  ]
}
```

---

## USER ENDPOINTS

### Get Profile
```
GET /users/profile
Authorization: Bearer <accessToken>

Response 200:
{
  "data": {
    "id": "user-456",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "081234567890",
    "avatar": "https://example.com/avatar.jpg",
    "role": "user"
  }
}
```

### Update Profile
```
PATCH /users/profile
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "081234567891"
}

Response 200:
{
  "data": {
    "id": "user-456",
    "name": "John Updated",
    "phone": "081234567891",
    ...
  }
}
```

---

## WEBHOOK ENDPOINTS

### Xendit Payment Callback
```
POST /webhooks/xendit
X-Callback-Token: <xendit_webhook_token>
Content-Type: application/json

{
  "id": "inv-123",
  "external_id": "ORDER-order-789",
  "status": "PAID",
  "amount": 10050000,
  ...
}

Response 200:
{
  "success": true
}
```

---

## UPDATED ERROR CODES

| Code | Status | Meaning |
|------|--------|---------|
| INSUFFICIENT_STOCK | 400 | Product out of stock |
| FORBIDDEN | 403 | Access denied |
| SHIPPING_ERROR | 400 | Shipping calculation failed |
| PAYMENT_ERROR | 500 | Payment gateway error |

