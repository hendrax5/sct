# 🗺️ ROADMAP: Ecommerce UMKM Platform

## Versioning Strategy
- **v0.1.x** — Alpha MVP (internal testing)
- **v1.0.0** — Public launch (2026-Q2)
- **v1.x.x** — Feature iterations & bug fixes
- **v2.0.0** — Major architecture upgrade (future)

---

## PHASE 1: MVP Foundation (Week 1-3)
**Target Release:** v0.1.0 (internal alpha)
**Goal:** Core functionality working, internal testing ready

### Sprint 1.1 (Week 1)
**Deliverable:** Project setup + Auth system + DB schema live

- [ ] Project scaffolding: Next.js 15 + Prisma + TypeScript setup
- [ ] GitHub repo + Docker Compose (local dev)
- [ ] NextAuth.js v5 integration (email/password)
- [ ] Prisma migrations: User, Product, Category tables
- [ ] JWT token refresh logic
- [ ] Password reset flow (email link via SendGrid)
- [ ] User profile page (update name, phone, avatar)
- [ ] Admin middleware: role-based access control

**Quality Gates:**
- ✅ All unit tests pass (auth, validation)
- ✅ Lighthouse score >80 (mobile)
- ✅ No console errors/warnings
- ✅ Security: password hashing tested, JWT expiry tested

---

### Sprint 1.2 (Week 2)
**Deliverable:** Product catalog MVP + Search

- [ ] Product listing page (paginated, 12 items/page)
- [ ] Product detail page (images, price, variants, stock)
- [ ] Category filter (dropdown)
- [ ] Price range filter (slider)
- [ ] Full-text search (Postgres native or Elasticsearch)
- [ ] In-stock filter
- [ ] Sorting (price, newest, popular)
- [ ] Image optimization (Next.js Image component)
- [ ] SEO: meta tags, structured data (JSON-LD)
- [ ] Admin: bulk product import (CSV → DB)

**Quality Gates:**
- ✅ Search latency <500ms
- ✅ Filter works on 5k products without lag
- ✅ Images load <1s (CDN cached)
- ✅ Responsive on mobile

---

### Sprint 1.3 (Week 3)
**Deliverable:** Cart + Checkout flow + Payment integration (Xendit)

- [ ] Add to cart (store in DB, not localStorage)
- [ ] Cart persistence (sync across devices)
- [ ] Cart page: update qty, remove items, clear
- [ ] Checkout form: email, phone, address validation
- [ ] Shipping address selection/create new
- [ ] RajaOngkir integration: calculate shipping cost (JNE, TIKI, POS)
- [ ] Courier selection
- [ ] Xendit invoice creation (on checkout)
- [ ] Payment redirection to Xendit
- [ ] Xendit webhook: order creation on payment success
- [ ] Order confirmation email
- [ ] Manual transfer as fallback payment method

**Quality Gates:**
- ✅ Full checkout flow tested (mock Xendit)
- ✅ Order created only after payment confirmed
- ✅ Webhook signature verified
- ✅ No payment data stored locally (PCI compliance)

**Risk:** Xendit API delays → have mock implementation ready

---

## PHASE 2: Core Features (Week 4-6)
**Target Release:** v1.0.0-beta (staging)
**Goal:** Feature-complete MVP, production-ready

### Sprint 2.1 (Week 4)
**Deliverable:** Admin Dashboard MVP

- [ ] Admin dashboard: overview cards (today revenue, pending payments, low stock, new orders)
- [ ] Orders table: list, search, filter by status/date, sort
- [ ] Bulk actions: mark as shipped, update tracking number
- [ ] Order detail: customer info, items, payment status, shipping status
- [ ] Inventory management: product list with stock levels, adjust stock
- [ ] Low-stock alerts: trigger at <5 items
- [ ] Admin settings: update bank account, store name, logo

**Quality Gates:**
- ✅ Admin dashboard load <2s
- ✅ Table handles 1k orders without lag
- ✅ Bulk update operations tested

---

### Sprint 2.2 (Week 5)
**Deliverable:** Order tracking + Wishlist + User enhancements

- [ ] Order tracking page: status timeline, tracking number link
- [ ] Email notifications: status changes, shipping updates
- [ ] Wishlist feature: add/remove, saved items persistent
- [ ] Wishlist page: view, move to cart
- [ ] User order history: paginated, searchable
- [ ] User addresses: CRUD, set default
- [ ] User profile: edit all personal info

**Quality Gates:**
- ✅ Email delivery tested (SendGrid)
- ✅ Wishlist sync across sessions
- ✅ Address validation (regex, required fields)

---

### Sprint 2.3 (Week 6)
**Deliverable:** Analytics + Manual transfer handling + Refinements

- [ ] Admin analytics: dashboard with revenue chart (daily/weekly/monthly)
- [ ] Top-selling products (rank by qty sold)
- [ ] Traffic analytics: unique visitors, sessions (Vercel Analytics)
- [ ] Manual payment upload: user uploads proof image, admin verifies
- [ ] Payment status: auto-mark as confirmed after admin approval
- [ ] Inventory sync: stock decrements on order, increments on cancel
- [ ] Promo codes: basic implementation (fixed discount % or amount)
- [ ] Bug fixes from beta testing

**Quality Gates:**
- ✅ Analytics dashboard loads <2s
- ✅ Revenue calculations verified (reconcile with payments)
- ✅ Manual transfer workflow end-to-end tested

---

## PHASE 3: Production Hardening (Week 7-8)
**Target Release:** v1.0.0 (public launch)
**Goal:** Production-ready, security-hardened, deployment automated

### Sprint 3.1 (Week 7)
**Deliverable:** Security audit + Performance optimization

- [ ] Security audit: penetration testing (SQL injection, XSS, CSRF)
- [ ] Dependency audit: npm audit critical fixes
- [ ] Password policies: enforce strong passwords (regex validation)
- [ ] Rate limiting: implement on login (5 req/5min), general API (100 req/15min)
- [ ] HTTPS + HSTS header enforcement
- [ ] CORS: whitelist only trusted origins
- [ ] Content Security Policy (CSP) headers
- [ ] Image optimization: lazy loading, srcset
- [ ] Code splitting: dynamic imports for large pages
- [ ] Database query optimization: add missing indexes
- [ ] Caching strategy: product catalog (24h), category (24h), user cart (session)

**Quality Gates:**
- ✅ Lighthouse score >85 (mobile)
- ✅ TTFB <500ms
- ✅ p99 latency <200ms
- ✅ Security headers verified (OWASP checklist)
- ✅ No SQL injection vulnerabilities (automated testing)

---

### Sprint 3.2 (Week 8)
**Deliverable:** Deployment + Monitoring + Documentation

- [ ] Docker setup: Dockerfile + docker-compose.yml
- [ ] Environment configs: .env.example, secrets management
- [ ] CI/CD pipeline: GitHub Actions (test → build → deploy)
- [ ] Automated backups: daily Postgres dumps to cloud storage
- [ ] Error tracking: Sentry integration
- [ ] Performance monitoring: Vercel Analytics + custom metrics
- [ ] Logging: structured logs to stdout (Docker friendly)
- [ ] Documentation: README, DEPLOYMENT.md, API docs (OpenAPI/Swagger)
- [ ] Runbook: incident response, rollback procedures
- [ ] Load testing: 1000 concurrent users (verify stability)
- [ ] User acceptance testing (UAT): UMKM owner runs through workflows

**Quality Gates:**
- ✅ Zero-downtime deployment verified
- ✅ Automated rollback tested
- ✅ Load test: 99th percentile latency <1s
- ✅ Uptime SLA: 99.5% over 7 days
- ✅ All documentation reviewed by team + UMKM owner

---

## PHASE 4: Post-Launch (v1.1.x - v1.x.x)
**Timeline:** Weeks 9+
**Goal:** Stability, performance optimization, feature iterations

### v1.1.0: Quality of Life Improvements
- [ ] Product reviews & ratings (user-generated)
- [ ] Email newsletter signup
- [ ] Promotional banners (admin configurable)
- [ ] Product recommendations (similar items)
- [ ] Guest checkout (optional, no account needed)
- [ ] Multiple currencies support (IDR, USD)
- [ ] SMS notifications (OTP, order updates)

### v1.2.0: Advanced Features
- [ ] Inventory forecasting (based on sales velocity)
- [ ] Affiliate program (referral links)
- [ ] Bulk order discounts (e.g., buy 5+ get 10% off)
- [ ] Marketplace features (if expanding to multi-vendor)
- [ ] Advanced analytics: cohort analysis, customer lifetime value
- [ ] Email marketing automation (Brevo/Mailchimp)

### v1.3.0: Scaling & Optimization
- [ ] Redis caching layer (for frequently accessed data)
- [ ] Database read replicas (if traffic grows >5k/month)
- [ ] CDN integration (Cloudflare for global distribution)
- [ ] API rate limiting per user (tier-based)
- [ ] Elasticsearch for full-text search optimization
- [ ] Background jobs: Kafka/Bull for heavy tasks

---

## PHASE 5: Major Features (v2.0.0+)
**Timeline:** Future (post-stabilization)

- [ ] Multi-vendor marketplace
- [ ] Subscription/recurring orders
- [ ] Advanced loyalty program
- [ ] Mobile app (React Native or Flutter)
- [ ] Live chat support (Intercom/Zendesk)
- [ ] Inventory synchronization with physical store POS
- [ ] Advanced reporting & forecasting (BI integration)

---

## 🎯 Key Milestones & Dates

| Milestone | Target Date | Status |
|-----------|---|---|
| Phase 1: MVP Foundation Complete | Week 3 | 🔵 On Track |
| Phase 2: Feature Complete | Week 6 | 🔵 On Track |
| Phase 3: Production Ready | Week 8 | 🔵 On Track |
| v1.0.0 Public Launch | End Week 8 | 🔵 Planned |
| v1.1.0 QoL Updates | Week 12 | 🔵 Planned |
| v1.2.0 Advanced Features | Week 16 | 🔵 Planned |

---

## 📊 Success Criteria (Post-Launch)

### Functional Success
- ✅ All MVP features working without critical bugs
- ✅ Cart conversion rate: >2%
- ✅ Payment success rate: >95%
- ✅ Order fulfillment time: <24h average

### Performance Success
- ✅ Page load: <2s (Lighthouse 80+)
- ✅ TTFB: <500ms
- ✅ API latency: p99 <200ms
- ✅ Uptime: 99.5%

### Security Success
- ✅ Zero payment data breaches
- ✅ All OWASP Top 10 addressed
- ✅ PCI-DSS assessment passed
- ✅ Dependency vulnerabilities: zero critical

### User Success
- ✅ Support response time: <4h
- ✅ Customer satisfaction: >4.5/5
- ✅ Return rate: <5%
- ✅ Monthly active users: >100

---

## 🚨 Risk Management

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|-----------|
| Xendit API delays | Checkout blocked | Medium | Mock API, fallback manual transfer |
| Database outage | Full service down | Low | Automated backups, RTO <1h |
| Payment webhook fails | Orders not created | Medium | Retry logic, manual reconciliation |
| Traffic spike | Performance degradation | Low (MVP phase) | Auto-scaling, rate limiting |
| Security vulnerability discovered | Revenue/reputation loss | Medium | Incident response plan, penetration testing |

---

## 📝 Release Process

### Before Every Release
1. ✅ Code review: 2+ approvals
2. ✅ Test suite: 100% pass rate
3. ✅ Security scan: npm audit, SAST
4. ✅ Performance check: Lighthouse, load test
5. ✅ Staging deployment: full E2E testing
6. ✅ Changelog updated
7. ✅ Documentation updated

### Release Steps
1. Merge to `main` (via PR)
2. Tag: `git tag v1.0.0`
3. Push: `git push origin main --tags`
4. GitHub Actions: auto-build Docker image
5. Deploy to production (blue-green strategy)
6. Smoke test: verify critical paths
7. Monitor: first 1h for errors

### Rollback Plan
- If critical issue detected: `git revert` + redeploy
- Keep previous Docker image available (tag: `v1.0.0-prev`)
- Database migrations: always provide down() rollback script

