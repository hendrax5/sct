# 📏 ENGINEERING RULES & GUIDELINES

Panduan teknis untuk team development. Semua rule wajib diikuti sebelum PR merge.

---

## 🎯 CORE PRINCIPLES

### 1. Production-First Mindset
- Semua code written dengan asumsi akan production dari hari pertama
- No "we'll fix this later" — fix now atau jangan merge
- Performance, security, maintainability = non-negotiable

### 2. Explicit Over Implicit
- Variable names: descriptive, tidak abbreviated (cart = ✅, c = ❌)
- Function names: action + subject (getUserById, createOrder, updateStock)
- Comments: hanya untuk WHY, bukan WHAT (code speaks for itself)

### 3. Fail Fast, Feedback Immediately
- Errors thrown early, validation first
- Input validation on every API boundary
- Logs should tell story, not be noise

### 4. Scalability by Default
- No premature optimization, tapi think in terms of 10x scale
- Database queries: indexed by default
- Caching strategy defined upfront
- No N+1 queries

---

## 🏗️ PROJECT STRUCTURE

### Directory Layout (Mandatory)
```
ecommerce-umkm/
├── app/                    # Next.js App Router
├── lib/                    # Shared utilities, helpers
│   ├── db.ts              # Prisma client
│   ├── auth.ts            # Auth logic
│   ├── validation.ts      # Zod schemas
│   └── api-clients/       # External APIs (Xendit, RajaOngkir)
├── components/            # React components
├── public/                # Static assets
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── scripts/               # Utility scripts (seed, backup)
├── tests/                 # Test files (mirror app structure)
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── .github/workflows/     # CI/CD
├── docs/                  # Documentation
└── README.md
```

### File Naming Conventions
```
Pages/Routes:     page.tsx, layout.tsx (kebab-case folder)
  ✅ app/products/[id]/page.tsx
  ❌ app/Products/ProductDetail.tsx

Components:       PascalCase.tsx
  ✅ components/ProductCard.tsx
  ❌ components/product-card.tsx

Utils/Helpers:    camelCase.ts
  ✅ lib/formatPrice.ts
  ❌ lib/format-price.ts

Types/Interfaces: PascalCase.ts
  ✅ lib/types/User.ts
  ❌ lib/types/user.ts

Tests:            *.test.ts or *.spec.ts (mirror src structure)
  ✅ tests/lib/auth.test.ts
  ❌ tests/authTest.ts
```

---

## 💻 CODE STYLE

### TypeScript Rules
```typescript
// ✅ DO: explicit types
const userId: string = "abc123"
function calculateTotal(items: CartItem[]): number { ... }

// ❌ DON'T: rely on inference for API boundaries
const userId = "abc123"  // public function param
function calculateTotal(items) { ... }

// ✅ DO: use strict mode
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}

// ✅ DO: object over many params
function createOrder(data: CreateOrderDto) { ... }
// instead of:
// function createOrder(items, address, shippingMethod, ...) { ... }

// ✅ DO: discriminated unions for variants
type PaymentResult = 
  | { status: "success"; transactionId: string }
  | { status: "failed"; errorCode: string }
```

### Naming Conventions
```typescript
// Variables
const MAX_ITEMS_PER_PAGE = 100              // constants: UPPER_SNAKE
const cartTotal = 50000                     // variables: camelCase
let isLoading = false                       // booleans: is/has prefix

// Functions
function getUserById(id: string) { ... }    // actions: verb + noun
function formatPrice(price: number) { ... }
async function createOrder(data) { ... }

// React Components
function ProductCard({ ... }) { ... }       // PascalCase, noun
function useCartItems() { ... }             // hooks: use prefix
const isProductAvailable = true             // props: descriptive

// CSS Classes (Tailwind)
<div className="flex items-center justify-between">
```

---

## 🔒 SECURITY RULES

### Input Validation (MANDATORY)
```typescript
import { z } from "zod"

// Define schema first
const CreateProductSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().int().positive(),
  stock: z.number().int().nonnegative(),
})

// Validate at boundaries (API routes, form handlers)
export async function POST(req: Request) {
  const body = await req.json()
  const data = CreateProductSchema.parse(body)  // throws if invalid
  // proceed with validated data
}
```

### Secrets Management
```bash
# ✅ DO: store secrets in .env file (not in code)
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-secret-key-here

# ✅ DO: commit .env.example (without values)
DATABASE_URL=
JWT_SECRET=

# ✅ DO: add .env to .gitignore
echo ".env" >> .gitignore

# ❌ DON'T: commit .env, credentials, or API keys
# ❌ DON'T: hardcode secrets in code
const dbUrl = process.env.DATABASE_URL  // ✅
const dbUrl = "postgresql://..."        // ❌
```

---

## 🗄️ DATABASE RULES

### Schema Design
```prisma
// ✅ DO: timestamp all records
model Product {
  id        String    @id @default(cuid())
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?  // soft delete
}

// ✅ DO: add indexes for frequently queried fields
@@index([categoryId])
@@index([isActive])
@@index([createdAt])
```

---

## 🔄 API DESIGN

### Request/Response Format
```typescript
// ✅ Success response (200, 201)
{
  "data": { id: "123", name: "..." },
  "meta": { timestamp: "2026-03-20T..." }
}

// ✅ Error response (4xx, 5xx)
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Price must be positive"
  }
}
```

---

## 🚀 PERFORMANCE RULES

### Database Queries
```typescript
// ✅ DO: select only needed fields
const product = await db.product.findUnique({
  where: { id },
  select: { id: true, name: true, price: true }
})

// ✅ DO: eager load related data (prevent N+1)
const orders = await db.order.findMany({
  include: { items: true, user: true }
})

// ✅ DO: paginate large datasets
const products = await db.product.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: "desc" }
})
```

---

## 🔄 GIT & DEPLOYMENT

### Commit Messages
```
✅ good: feat(auth): add email verification
✅ good: fix(cart): prevent double-submission
✅ good: perf(search): add database index

❌ bad: update
❌ bad: fix stuff
```

---

## 📋 BEFORE COMMITTING

**CHECKLIST (mandatory for all PRs):**

- [ ] Code follows style guide
- [ ] No console.log left (use proper logging)
- [ ] Tests pass locally (npm test)
- [ ] No console warnings/errors
- [ ] Security: no secrets in code
- [ ] Types: no any types
- [ ] API: validated with Zod
- [ ] Error handling: no silent failures
- [ ] Commit messages: conventional commits
- [ ] PR description: what/why/testing

**Failure = PR blocked until resolved.**

---

## 📚 USEFUL COMMANDS

```bash
npm install                    # install deps
npm run dev                    # local dev server
npm test                       # run tests
npm run lint                   # run ESLint
npx prisma migrate dev        # create migration
docker compose up -d          # start services
```

---

## 🚨 ANTI-PATTERNS (Never Do This)

```typescript
// ❌ Global mutable state
let cartTotal = 0

// ❌ Silent failures
try { ... } catch (e) { }

// ❌ Magic numbers
if (price > 100000) { ... }

// ❌ Loose types
const data: any = { ... }

// ❌ Deep nesting
if (a) { if (b) { if (c) { ... } } }
```
