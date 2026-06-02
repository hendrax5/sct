# 📜 CHANGELOG

Semua perubahan penting di-track di file ini. Format: [Semantic Versioning](https://semver.org/) + [Conventional Commits](https://www.conventionalcommits.org/).

---

## [Unreleased]

### Added (Planned for next release)
- [ ] Product reviews & ratings system
- [ ] Email newsletter signup
- [ ] SMS notifications (OTP, order updates)
- [ ] Guest checkout (optional, no account)
- [ ] Advanced inventory forecasting

### Changed
- (none yet)

### Fixed
- (none yet)

### Security
- (none yet)

---

## [1.0.0] — 2026-03-20 🚀 MVP LAUNCH

### Added
- ✅ **Auth System**
  - User registration & login (email/password)
  - JWT token management (15min access + 7d refresh)
  - Password reset via email link
  - NextAuth.js v5 integration
  - Session management with auto-refresh

- ✅ **Product Catalog**
  - 5000+ product SKU support
  - Product variants (size, color, etc)
  - Category filtering & organization
  - Full-text search with <500ms latency
  - Advanced filtering: price range, in-stock, rating
  - Product detail pages with multi-image gallery
  - SEO optimization: meta tags, structured data (JSON-LD)
  - Image lazy loading & optimization

- ✅ **Shopping Cart**
  - Add/remove items, update quantities
  - Cart persistence across devices
  - Real-time total calculation
  - Stock validation (prevent over-order)
  - Clear cart functionality

- ✅ **Checkout & Payment**
  - Multi-step checkout form with validation
  - Address selection/creation
  - Shipping cost calculation via RajaOngkir API
  - Courier selection (JNE, TIKI, POS)
  - Xendit payment integration (credit cards, e-wallets, transfer bank)
  - Manual bank transfer as fallback payment method
  - Order confirmation emails via SendGrid
  - Webhook handling for payment callbacks

- ✅ **Order Management**
  - Order creation on payment success
  - Order tracking with status timeline
  - Shipping tracking number integration
  - Order history with pagination
  - Order detail page with receipt
  - Email notifications on status changes
  - Order cancellation (if status allows)
  - Printable invoice/shipping label

- ✅ **User Features**
  - User profiles (name, email, phone, avatar)
  - Multiple shipping addresses
  - Wishlist (add/remove favorites)
  - Order history & tracking
  - Address management (CRUD)

- ✅ **Admin Dashboard**
  - Dashboard overview (revenue, orders, low stock alerts)
  - Product management (list, create, update, soft delete)
  - Bulk product import (CSV → database)
  - Inventory tracking & manual adjustments
  - Order management (list, filter, bulk actions)
  - Manual payment verification (proof image upload)
  - Sales analytics (revenue chart, top products)
  - Low-stock alerts & notifications
  - Admin settings (bank account, store info)

- ✅ **Deployment & Infrastructure**
  - Docker setup (Dockerfile + docker-compose.yml)
  - PostgreSQL database (Neon free tier)
  - Redis caching (optional, for future scaling)
  - Vercel deployment (Next.js optimized)
  - GitHub Actions CI/CD pipeline
  - Automated database backups
  - Environment-based configuration (.env)
  - Structured logging for debugging

- ✅ **Security**
  - Password hashing (bcrypt, cost factor 12)
  - JWT authentication (RS256)
  - Input validation (Zod schemas)
  - SQL injection prevention (Prisma parameterized queries)
  - XSS protection (React auto-escaping)
  - CSRF protection (SameSite cookies)
  - Rate limiting (100 req/15min per IP, 5 req/5min on login)
  - HTTPS enforcement + HSTS header
  - Security headers: CSP, X-Frame-Options, X-Content-Type-Options
  - No credit card data storage (PCI compliance via Xendit)
  - Payment webhook signature verification

- ✅ **Monitoring & Analytics**
  - Vercel Analytics integration
  - Sentry error tracking
  - Structured logging (stdout → Docker)
  - Performance monitoring (Lighthouse >80)
  - API latency tracking
  - Database query monitoring

- ✅ **Documentation**
  - README with quick start
  - API documentation (OpenAPI/Swagger)
  - Deployment guide (Docker + Vercel)
  - Troubleshooting guide
  - Architecture diagram
  - Security checklist
  - Release notes

### Changed
- (N/A for v1.0.0 — initial release)

### Fixed
- (N/A for v1.0.0 — initial release)

### Security
- Enforced HTTPS everywhere
- Added rate limiting on authentication endpoints
- Implemented input validation on all API endpoints
- Secured payment webhook with HMAC signature verification
- No sensitive data in logs

### Deprecated
- (none)

### Removed
- (none)

### Database Migrations
- `001_init_users.sql` — Users table with auth fields
- `002_init_products.sql` — Products, categories, variants
- `003_init_orders.sql` — Orders, order items, payments
- `004_init_cart.sql` — Cart management
- `005_init_wishlist.sql` — Wishlist table
- `006_add_indexes.sql` — Performance indexes

### Known Issues
- 🟡 Email notifications delayed by 1-5 minutes (SendGrid SLA)
- 🟡 Wishlist sync occasionally slow during peak hours (Redis cache refresh needed)
- 🟡 CSV bulk import limited to 1000 items per file (chunking needed for >1000)
- 🟡 RajaOngkir shipping cost calculation takes 2-3 seconds

### Performance
- Product search latency reduced from 800ms to 150ms (database indexing)
- Page load improved to <2s (image optimization, code splitting)
- TTFB <500ms (Vercel edge caching)
- Lighthouse score: 85+ (mobile)

### Contributors
- [Your Team] — Development & testing
- [UMKM Owner] — Beta testing & feedback

### Links
- 🔗 [GitHub Release](https://github.com/org/ecommerce-umkm/releases/tag/v1.0.0)
- 📖 [Deployment Guide](./DEPLOYMENT.md)
- 🐛 [Known Issues](https://github.com/org/ecommerce-umkm/issues?q=label%3Av1.0.0)

---

## [1.0.1] — 2026-03-27 🔧 Hotfix

### Fixed
- Fixed cart calculation rounding error (2-3 cents discrepancy in total)
- Fixed email notification not sending for some SMTP recipients
- Fixed wishlist sync not working across browser sessions
- Fixed product search returning duplicates in some queries
- Fixed admin dashboard crashing with >500 orders

### Security
- Patched SQL injection vulnerability in product search filter
- Updated dependencies (4 security patches from npm audit)

### Performance
- Optimized product listing query (reduced from 2 queries to 1)
- Implemented query caching for frequently viewed products

---

## [1.1.0] — 2026-04-10 ✨ Quality of Life

### Added
- Product reviews & ratings (1-5 stars)
- Review moderation (admin approval)
- Email newsletter signup
- Promotional banner system (admin configurable)
- "Recently viewed" products tracking
- Product recommendations (similar items)
- Guest checkout option (no account required)
- SMS notifications for order updates (via Twilio)
- Export orders to CSV (admin feature)
- Bulk discount codes (e.g., SUMMER20 = 20% off)

### Changed
- Improved admin dashboard UX (darker theme, better typography)
- Moved "Wishlist" to user account menu (more discoverable)
- Product images now use WebP format (faster loading)
- Updated error messages (more helpful, actionable)

### Fixed
- Fixed mobile checkout form layout (input fields overlapping)
- Fixed payment timeout on slow networks (increased from 30s to 60s)
- Fixed admin analytics showing wrong totals for cancelled orders

### Security
- Added rate limiting per authenticated user (separate from IP-based)
- Implemented CAPTCHA on contact form (Google reCAPTCHA v3)
- Added CSP header for image sources

---

## [1.2.0] — 2026-05-01 🚀 Advanced Features

### Added
- Advanced inventory forecasting (sales velocity-based)
- Affiliate program (referral links & commission tracking)
- Multiple currency support (IDR, USD, SGD)
- Customer support chat widget (Intercom integration)
- Advanced analytics: cohort analysis, customer lifetime value
- Email marketing automation (Brevo integration)
- Product variants with dynamic pricing
- Subscription/recurring orders option
- Admin user management (create staff accounts, role-based access)
- Detailed audit log (all admin actions logged)

### Changed
- Database schema v2 (new tables for affiliation, subscriptions)
- API versioning: moved to /api/v2 (v1 deprecated but still supported)
- Admin dashboard redesigned (new card layout, interactive charts)

### Fixed
- Fixed inventory sync between cart and admin (now real-time with WebSocket)
- Fixed affiliate commission calculation (off-by-one error)
- Fixed email templates not rendering properly in Outlook

### Performance
- Added Redis caching layer (30% reduction in DB queries)
- Implemented database connection pooling (PgBouncer)
- Lazy load admin dashboard charts (load on tab click)

---

## [1.3.0] — 2026-06-01 ⚡ Scaling & Optimization

### Added
- CDN integration (Cloudflare for global distribution)
- API rate limiting per user tier (free/basic/premium)
- Elasticsearch integration for full-text search
- Background job queue (Bull + Redis for heavy tasks)
- Image processing pipeline (thumbnail generation, optimization)
- Database read replicas (if traffic >5k/month)
- Advanced caching strategy (TTL matrix per endpoint)
- GraphQL API option (alongside REST)

### Changed
- Database sharding plan (prepare for >100k orders)
- Deployment strategy: Kubernetes-ready manifests
- Monitoring upgraded to Datadog (from Sentry)

### Fixed
- Fixed timezone issues in analytics (now per-user timezone)
- Fixed slow reports export (now async with email download link)

### Performance
- Page load optimized to <1s (99th percentile)
- Database query optimization (new indexes, query plans reviewed)
- API response time: p99 <100ms

---

## [2.0.0] — TBD 🎯 Major Redesign

### Planned
- Multi-vendor marketplace (multiple sellers)
- Advanced loyalty program (points, tiers)
- Mobile app (React Native)
- Live chat support (Zendesk integration)
- POS system integration (physical + online inventory sync)
- B2B wholesale features
- Advanced shipping integrations (all major couriers)

### Breaking Changes
- Migration from NextAuth to Clerk auth (better MFA, SSO)
- API v1 deprecated (only v2 supported)
- Database schema major restructure (migration scripts provided)
- New payment structure (vendor split, commission handling)

---

## Migration Guides

### v1.0.0 → v1.0.1
```bash
# No database migrations needed
# Just pull latest code and redeploy
npm install
npm run build
docker compose up -d
```

### v1.0.1 → v1.1.0
```bash
# New tables for reviews, newsletter, promotions
npm install
npm run migrate  # Applies all pending migrations
npm run build
docker compose up -d
```

### v1.1.0 → v1.2.0
```bash
# Major: new affiliate & subscription tables
# Schema version update: 1 → 2
npm install
npm run migrate
npm run build
# Backup before deploying!
docker compose down
docker compose up -d
```

### v1.x.x → v2.0.0 (Future)
```bash
# Major: multi-vendor marketplace
# Full schema redesign required
# Migration script: scripts/migrate_v1_to_v2.sql
npm install
npm run migrate:v2
npm run build
# Consider blue-green deployment strategy
```

---

## How to Update

### For Users
```bash
# Automatic: Vercel auto-deploys on new release
# Check version at footer: "Version: v1.0.0"
```

### For Self-Hosted Deployments
```bash
# Step 1: Pull latest code
git fetch origin
git checkout v1.1.0  # or latest tag

# Step 2: Update dependencies
npm install

# Step 3: Run migrations (if any)
npm run migrate

# Step 4: Rebuild & deploy
npm run build
docker compose down
docker compose up -d

# Step 5: Verify
curl http://localhost:3000/api/health
```

---

## Reporting Issues

Found a bug? Report at: https://github.com/org/ecommerce-umkm/issues

Security issue? Email: security@example.com (private disclosure)

